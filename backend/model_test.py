import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import os

df = pd.read_csv('Dataset.csv')
df.columns = df.columns.str.strip().str.upper()

# We sort the labels to match how LabelEncoder/Model likely ordered them
plant_mapping = sorted(df['PLANT NAME'].unique())
disease_mapping = sorted(df['PLANT DISEASE NAME'].astype(str).unique())

# LOAD MODEL
model = tf.keras.models.load_model('plant_disease_model_expert.h5')

def autonomous_test(img_path):
    # Prepare image
    img = image.load_img(img_path, target_size=(224, 224))
    img_tensor = image.img_to_array(img) / 255.0
    img_tensor = np.expand_dims(img_tensor, axis=0)

    # Predict
    # This returns the numerical IDs (0, 1, 2...)
    predictions = model.predict(img_tensor)
    
    # We use the index returned by the model to find the name in our list
    plant_idx = np.argmax(predictions[0])
    disease_idx = np.argmax(predictions[1])
    
    plant_name = plant_mapping[plant_idx]
    disease_name = disease_mapping[disease_idx]
    
    print(f"\n--- AI Identification ---")
    print(f"Plant: {plant_name}")
    print(f"Disease: {disease_name}")
    return plant_name, disease_name

# --- RUN ---
autonomous_test(r'') # Provide the image path
