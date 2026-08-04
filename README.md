# 🌾 AgriFuel Nexus: AI-Powered Farming Advisory & Sustainable Biofuel Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![GCP](https://img.shields.io/badge/Google%20Cloud-Platform-4285F4?style=flat&logo=googlecloud&logoColor=white)](https://cloud.google.com/)

---

## 📌 Project Overview

**AgriFuel Nexus** is a dual-impact, closed-loop AI platform designed to transform agricultural operations and promote sustainability in farming communities. 

The platform addresses two interconnected agricultural challenges: **crop health loss** due to late disease detection and **environmental degradation** caused by open agricultural residue (stubble) burning. By combining Computer Vision, Generative AI advisory, and a digital B2B marketplace, AgriFuel Nexus empowers small and marginal farmers to protect crop yields while turning post-harvest waste into a steady secondary revenue stream.

---

## 🎯 Problem Statement

1. **Delayed Crop Pathology:** Smallholder farmers rely on visual inspections or delayed local advice, leading to rapid disease spread and lost yields.
2. **Generic Advisory Services:** Conventional advisory tools lack integrated real-time data regarding local soil metrics, weather patterns, and specific crop conditions.
3. **Residue Burning & Value Loss:** India generates over 500 million tons of agricultural residue annually. Without direct access to industrial buyers, farmers burn stubble/husks post-harvest, releasing massive GHG emissions and wasting billions in economic value.
4. **Market & Tech Fragmentation:** Existing digital tools isolatedly address either plant disease diagnosis or waste conversion, lacking a unified, accessible solution for low-bandwidth mobile environments.

---

## 💡 Proposed Solution & Key Features

AgriFuel Nexus bridges these gaps with a single, unified digital ecosystem:

### 🔍 1. Multi-Output AI Disease Diagnostic Engine
* **Instant Visual Scan:** Analyzes leaf images captured via low-end smartphones to identify plant taxon and underlying pathologies (e.g., rust, blight, mildew).
* **Multi-Output CNN:** Simultaneously predicts crop species and disease status with confidence scoring and severity indexing.

### 🤖 2. Context-Aware Generative AI Farming Advisory
* **Hyper-Localized Recommendations:** Blends real-time disease diagnostic outputs with local soil health metrics (SHC API) and regional weather forecasts (IMD API).
* **Actionable Guidance:** Generates customized agronomic advice detailing optimal fertilizer dosages, irrigation schedules, and eco-friendly treatment plans in regional languages.

### 🛒 3. Digital Biofuel Residue Marketplace
* **Direct Farmer-to-Industry Linkage:** Connects farmers with bio-energy and recycling companies to sell post-harvest residues (stalks, husks, leaves).
* **Smart Matching & Bidding:** An automated matching engine ranks active inventory based on geospatial proximity, volume, and target pricing.
* **Secure Operations:** Role-based access control (RBAC) and transaction logs for reliable commercial execution.

### 🌿 4. Climate-Resilient Agricultural Promotion
* **Economic Incentives:** Includes ROI calculators demonstrating the financial gain of selling biomass versus open burning.
* **Sustainable Practices:** Provides educational guides on cover cropping, zero-budget farming, and soil health preservation.

---

## 🏗 System Architecture & Workflow

```text
+-----------------------------------------------------------------------------------+
|                        1. User Interaction Layer                                  |
|            React.js (Web Dashboard)  |  React Native (Mobile App)                 |
+-----------------------------------------------------------------------------------+
                                        |  (HTTPS / REST APIs)
                                        v
+-----------------------------------------------------------------------------------+
|                        2. Backend Orchestration Layer                             |
|            Node.js & Express.js API Gateway (Auth, Routing, Logic)                |
+-----------------------------------------------------------------------------------+
       |                                |                                   |
       v                                v                                   v
+-----------------------+    +-----------------------+    +-------------------------+
|  Disease Diagnostics  |    |  Advisory Engine      |    |  Marketplace Engine     |
|  (Flask / PyTorch /   |    |  (GenAI / Soil &      |    |  (Matching Logic &      |
|   TensorFlow CNN)     |    |   Weather APIs)       |    |   Transaction Service)  |
+-----------------------+    +-----------------------+    +-------------------------+
       |                                |                                   |
       +--------------------------------+-----------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                        4. Data Persistence Layer                                  |
|         MongoDB Atlas (User & Listing Data)  |  Google Cloud Storage (Images)     |
+-----------------------------------------------------------------------------------+

```

### Operational Workflow:
1. **Diagnosis & Advisory:** Farmer uploads leaf image ➔ AI model identifies disease ➔ Weather & Soil APIs fetched ➔ GenAI synthesizes localized treatment plan.
2. **Residue Monetization:** Farmer lists available crop waste ➔ Enterprise buyers query available volume ➔ Matching engine ranks proposals ➔ Secure transaction executed.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, React Native, Tailwind CSS |
| **Backend API Gateway** | Node.js, Express.js |
| **AI / Machine Learning** | Python, PyTorch, TensorFlow / Keras, OpenCV, Hugging Face Transformers |
| **AI Serving** | Flask / FastAPI Microservices |
| **Database & Storage** | MongoDB Atlas (Mongoose), Google Cloud Storage (GCS) |
| **Cloud Infrastructure** | Google Cloud Platform (Cloud Run, GCP Storage) |
| **Integrations** | IMD Weather API, Soil Health Card (SHC) API |

---

## 🗺 Development Roadmap

- [x] **Phase 1: System Architecture & Requirements** — Problem formulation, architecture layout, and UI wireframing.
- [x] **Phase 2: AI Computer Vision & Backend Services** — Multi-output CNN training on PlantVillage dataset, image pipeline, and API setup.
- [x] **Phase 3: Advisory & Marketplace Integration** — Context-aware GenAI advisory, IMD/SHC API linking, and B2B marketplace engine.
- [ ] **Phase 4: Field Testing & Extensions** — Field pilot feedback, IoT soil sensor integration, and blockchain-based transaction auditing.

---

## 👥 Authors & Acknowledgments

### **Development Team**
* **Amit Kumar Shah** — B.Tech CSE (AI-ML), Sister Nivedita University
* **Stuti Karmakar** — B.Tech CSE (AI-ML), Sister Nivedita University
* **Soumyabha Majumdar** — B.Tech CSE (AI-ML), Sister Nivedita University
* **Soumipa Saha** — B.Tech CSE (AI-ML), Sister Nivedita University

### **Academic Guidance**
* **Project Supervisor:** Dr. Debasis Mazumdar (Senior Professor, Dept. of Computer Science, Sister Nivedita University, Newtown, Kolkata).
* Department of Computer Science, **Sister Nivedita University, West Bengal**.

---

## 📄 License

This project is submitted in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science and Engineering (AI-ML)**. All rights reserved.
