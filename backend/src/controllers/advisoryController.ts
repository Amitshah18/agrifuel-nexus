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
      I am a farmer. Today's date is ${date || new Date().toISOString()}. 
      My GPS coordinates are Latitude: ${latitude || 'Unknown'}, Longitude: ${longitude || 'Unknown'}.
      
      My crop has been diagnosed by my AI Vision model. 
      Crop (English): ${plant_name.replace(/_/g, ' ')}
      Diagnosis (English): ${disease_name.replace(/_/g, ' ')}

      Act as an expert agricultural advisor. 
      CRITICAL INSTRUCTIONS:
      1. You MUST respond entirely in the ${language} language.
      2. You MUST translate the disease name into a local, commonly understood name in ${language}.
      3. Provide a detailed but easy-to-understand step-by-step action plan.
      4. DO NOT use markdown symbols (* or #). Use simple dashes (-) for lists.
      5. You MUST return ONLY a valid JSON object. Do not include markdown code blocks like \`\`\`json.

      Return EXACTLY this JSON structure:
      {
        "localDiseaseName": "Translated disease name in ${language}",
        "advisoryText": "The full, natural spoken advisory in ${language} (Cause, Steps, and Weather advice combined)."
      }
    `;

    let finalData = { localDiseaseName: disease_name, advisoryText: "" };
    let attempts = 0;

    while (attempts < 3) {
      try {
        const llmResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        
        const rawText = llmResponse.text || "{}";
        // Clean the response in case Gemini accidentally adds markdown code blocks
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        
        finalData.localDiseaseName = parsedResponse.localDiseaseName || disease_name;
        finalData.advisoryText = parsedResponse.advisoryText || "Advisory unavailable.";
        break;
        
      } catch (error: any) {
        attempts++;
        if (attempts >= 3) throw new Error("Gemini AI is busy. Please try again.");
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