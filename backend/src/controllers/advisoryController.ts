import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeCrop = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    // Default to Hindi if the user hasn't selected a language yet
    const { latitude, longitude, date, language = 'Hindi' } = req.body;

    // 1. FORWARD IMAGE TO PYTHON AI
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const pythonUrl = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000/api/predict';
    
    let visionResult;
    try {
      const pythonResponse = await axios.post(pythonUrl, formData, { headers: { ...formData.getHeaders() } });
      visionResult = pythonResponse.data;
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Vision AI Service failed or is offline.' });
      return;
    }

    const { plant_name, disease_name } = visionResult;

    // 2. DYNAMIC MULTI-LANGUAGE GEMINI PROMPT (Forcing JSON output)
    const prompt = `
        You are an expert Agricultural AI. 
        I have detected a crop condition. 
        - Plant: ${plant_name}
        - Condition/Disease: ${disease_name}
        - Target Language: ${language}

        Provide a minimal, highly actionable advisory report following these STRICT RULES:
        1. Translate both the Plant Name and the local/common name of the Disease into the ${language}.
        2. Provide EXACTLY 3 to 6 actionable steps for treatment, prevention, or next steps.
        3. Language: The entire response MUST be completely in the ${language} script.
        4. Write each actionable step as a concise sentence. End every sentence with a standard English period "." followed by a single space. 
        5. DO NOT use the Hindi/Bengali Purna Viram (।). DO NOT use bullet points (-, *), line breaks, or numbered lists (1., 2.).
        
        OUTPUT AS A STRICT JSON OBJECT with exactly two keys:
        {
          "localDiseaseName": "The translated disease name here",
          "advisoryText": "First action. Second action. Third action."
        }
    `;

    let finalData = { localDiseaseName: disease_name, advisoryText: "" };
    let attempts = 0;

    while (attempts < 3) {
      try {
        const llmResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-preview",
          contents: prompt,
          config: {
            // THIS IS THE MAGIC FIX: Forces Gemini to return valid, raw JSON without markdown
            responseMimeType: "application/json", 
          }
        });
        
        // No more regex replace hacks needed, we can parse it directly
        const parsedResponse = JSON.parse(llmResponse.text || "{}");
        
        finalData.localDiseaseName = parsedResponse.localDiseaseName || disease_name;
        finalData.advisoryText = parsedResponse.advisoryText || "Advisory unavailable.";
        break; // Success! Break out of the retry loop.
        
      } catch (error: any) {
        attempts++;
        console.error(`Gemini Parsing Attempt ${attempts} Failed:`, error);
        if (attempts >= 3) throw new Error("Gemini AI is busy or failed to parse. Please try again.");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 3. SEND TO FRONTEND
    res.status(200).json({
      success: true,
      plant_name,
      disease_name: finalData.localDiseaseName, // Send the translated name!
      advisory: finalData.advisoryText
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate advisory.' });
  }
};