import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import Groq from 'groq-sdk';

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export const analyzeCrop = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    const { latitude, longitude, date, language = 'Hindi' } = req.body;

    // ==========================================
    // 1. FORWARD IMAGE TO PYTHON AI (Hugging Face)
    // ==========================================
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'upload.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });

    // Safely construct the URL (Prevents the 404/500 crash)
    const AI_BASE_URL = (process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const pythonUrl = `${AI_BASE_URL}/predict`;
    
    let visionResult;
    try {
      const pythonResponse = await axios.post(pythonUrl, formData, { 
        headers: { ...formData.getHeaders(),
        'Content-Length': formData.getLengthSync() 
      } 
      });
      visionResult = pythonResponse.data;
    } catch (error: any) {
      console.error("Python AI Error:", error.message);
      res.status(500).json({ success: false, message: 'Vision AI Service failed or is offline.' });
      return;
    }

    const { plant_name, disease_name } = visionResult;

    // ==========================================
    // 2. MULTI-LANGUAGE LLM TRANSLATION (Groq + Llama 3)
    // ==========================================
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

    let finalData = { localDiseaseName: disease_name, advisoryText: "Advisory unavailable." };
    let attempts = 0;

    while (attempts < 3) {
      try {
        const llmResponse = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama3-8b-8192", 
          temperature: 0.1, // Dropped to 0.1 for maximum rigid formatting
          response_format: { type: "json_object" }, 
        });
        
        let responseText = llmResponse.choices[0]?.message?.content || "{}";
        
        // ==========================================
        // THE FIX: Strip sneaky markdown formatting
        // ==========================================
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const parsedResponse = JSON.parse(responseText);
        
        finalData.localDiseaseName = parsedResponse.localDiseaseName || disease_name;
        finalData.advisoryText = parsedResponse.advisoryText || "Advisory unavailable.";
        break; 
        
      } catch (error: any) {
        attempts++;
        console.error(`Groq Parsing Attempt ${attempts} Failed:`, error.message);
        if (attempts >= 3) {
            // Adding the actual error message here will help us debug if it still fails
            throw new Error(`AI Translation Failed: ${error.message}`);
        }
      }
    }

    // ==========================================
    // 3. SEND FINAL DATA TO FRONTEND
    // ==========================================
    res.status(200).json({
      success: true,
      plant_name,
      disease_name: finalData.localDiseaseName, 
      advisory: finalData.advisoryText
    });

  } catch (error: any) {
    console.error("Advisory Generation Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate advisory.' });
  }
};