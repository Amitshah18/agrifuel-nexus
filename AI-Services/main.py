import os
import io
import glob
import pandas as pd
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# 1. Initialize FastAPI
app = FastAPI(title="AgriFuel AI Vision Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Variables
model = None
plant_mapping = []
disease_mapping = []

@app.on_event("startup")
async def load_ai_resources():
    global model, plant_mapping, disease_mapping
    
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    dataset_path = os.path.join(BASE_DIR, 'Dataset.csv')
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(BASE_DIR, 'final_dataset_Hopefully.csv')
        
    try:
        print(f"Looking for dataset at: {dataset_path}")
        df = pd.read_csv(dataset_path) 
        df.columns = df.columns.str.strip().str.upper()
        
        plant_mapping = sorted(df['PLANT NAME'].unique())
        disease_mapping = sorted(df['PLANT DISEASE NAME'].astype(str).unique())
        
        possible_models = glob.glob(os.path.join(BASE_DIR, '*.keras')) + glob.glob(os.path.join(BASE_DIR, '*.h5'))
        
        if not possible_models:
            print("❌ CRITICAL: I cannot find ANY .keras or .h5 file in this folder!")
            return
            
        model_path = possible_models[0]
        print(f"Found model at: {model_path}")
        print("Loading TensorFlow Keras model (this might take a few seconds)...")
        
        model = tf.keras.models.load_model(model_path)
        print("✅ AI Engine Online and Ready!")
        
    except Exception as e:
        print(f"❌ Error loading resources: {e}")

def prepare_image(image_bytes):
    """Converts the uploaded image into the exact format your Keras model expects."""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/api/predict")
async def predict_disease(file: UploadFile = File(...)):
    """Receives an image, runs it through Keras, and returns the labels."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
        
    try:
        contents = await file.read()
        img_tensor = prepare_image(contents)
        
        # Run the AI!
        predictions = model.predict(img_tensor)
        
        # THE FIX: Reverted directly back to the logic that worked for your model.
        # We grab output 0 (Plant) and output 1 (Disease), ignoring the 3rd output.
        plant_idx = np.argmax(predictions[0])
        disease_idx = np.argmax(predictions[1])
        
        plant_name = plant_mapping[plant_idx]
        disease_name = disease_mapping[disease_idx]
        
        return {
            "success": True,
            "plant_name": plant_name,
            "disease_name": disease_name
        }
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the image.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)