import os
# Fix for registry conflict in Python 3.12
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, Input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

# --- 1. DATA PREPARATION ---
df = pd.read_csv('Dataset.csv')
le_plant = LabelEncoder()
le_disease = LabelEncoder()

df['PLANT_LABEL'] = le_plant.fit_transform(df['PLANT NAME'])
df['DISEASE_LABEL'] = le_disease.fit_transform(df['PLANT DISEASE NAME'])
df['STATUS_LABEL'] = df['PLANT DISEASED/NOT'].map({'YES': 1, 'NO': 0})

num_plants = len(le_plant.classes_)
num_diseases = len(le_disease.classes_)
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

def data_generator(dataframe, batch_size=32, target_size=(224, 224)):
    while True:
        dataframe = dataframe.sample(frac=1).reset_index(drop=True)
        for i in range(0, len(dataframe), batch_size):
            batch = dataframe.iloc[i:i+batch_size]
            images, l_plant, l_disease, l_status = [], [], [], []
            for _, row in batch.iterrows():
                try:
                    img = load_img(row['IMAGE_PATH'], target_size=target_size)
                    img = img_to_array(img) / 255.0
                    images.append(img)
                    l_plant.append(row['PLANT_LABEL'])
                    l_disease.append(row['DISEASE_LABEL'])
                    l_status.append(row['STATUS_LABEL'])
                except Exception:
                    continue
            if len(images) > 0:
                yield (np.array(images),
                       {'plant_output': np.array(l_plant),
                        'disease_output': np.array(l_disease),
                        'status_output': np.array(l_status)})

# --- 2. MULTI-OUTPUT MODEL ---
base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False

inputs = Input(shape=(224, 224, 3))
x = base_model(inputs)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(256, activation='relu')(x)
x = layers.Dropout(0.5)(x)

plant_out = layers.Dense(num_plants, activation='softmax', name='plant_output')(x)
disease_out = layers.Dense(num_diseases, activation='softmax', name='disease_output')(x)
status_out = layers.Dense(1, activation='sigmoid', name='status_output')(x)

model = models.Model(inputs=inputs, outputs=[plant_out, disease_out, status_out])

# --- 3. PHASE 1: INITIAL TRAINING ---
model.compile(
    optimizer='adam',
    loss={'plant_output': 'sparse_categorical_crossentropy',
          'disease_output': 'sparse_categorical_crossentropy',
          'status_output': 'binary_crossentropy'},
    metrics={'plant_output': 'accuracy', 'disease_output': 'accuracy', 'status_output': 'accuracy'}
)

train_gen = data_generator(train_df)
val_gen = data_generator(val_df)

print("Starting Phase 1: Training Classification Heads...")
history = model.fit(train_gen, steps_per_epoch=len(train_df)//32,
                    validation_data=val_gen, validation_steps=len(val_df)//32, epochs=10)

# --- 4. PHASE 2: FINE-TUNING ---
print("Starting Phase 2: Fine-Tuning Backbone...")
base_model.trainable = True
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss={'plant_output': 'sparse_categorical_crossentropy',
          'disease_output': 'sparse_categorical_crossentropy',
          'status_output': 'binary_crossentropy'},
    metrics={'plant_output': 'accuracy', 'disease_output': 'accuracy', 'status_output': 'accuracy'}
)

fine_tune_history = model.fit(train_gen, steps_per_epoch=len(train_df)//32,
                              validation_data=val_gen, validation_steps=len(val_df)//32, epochs=5)

model.save('plant_disease_model.keras')

# Multi-Output Example Predictions
plt.figure(figsize=(18, 10))
for i in range(8):
    img, label = next(test_gen)
    preds = model.predict(img, verbose=0)
    p_pred = le_plant.inverse_transform([np.argmax(preds[0])])[0]
    d_pred = le_disease.inverse_transform([np.argmax(preds[1])])[0]
    p_act = le_plant.inverse_transform([label['plant_output'][0]])[0]
    d_act = le_disease.inverse_transform([label['disease_output'][0]])[0]
   
    plt.subplot(2, 4, i+1)
    plt.imshow(img[0])
    color = 'green' if (p_pred == p_act and d_pred == d_act) else 'red'
    plt.title(f"P: {p_pred}\nD: {d_pred}", fontsize=10, color=color)
    plt.axis('off')
plt.tight_layout()
plt.show()