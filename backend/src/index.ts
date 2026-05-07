import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import listingRoutes from "./routes/listingRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import advisoryRoutes from './routes/advisoryRoutes';

dotenv.config();
const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

connectDB();

// ==========================================
// 🚨 MANUAL PREFLIGHT INTERCEPTOR
// ==========================================
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ''), 
  'https://agrifuelnexus.vercel.app',           
  'http://localhost:5173',                      
  'http://localhost:8081',                      
];

app.use((req: Request, res: Response, next: Function) => {
  const origin = req.headers.origin;

  // 1. Assign Allowed Origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
  }

  // 2. Assign Required Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 3. BRUTE FORCE PREFLIGHT INTERCEPTOR (This stops the 404)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});
// ==========================================

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/advisory', advisoryRoutes);

// Basic Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "AgriFuel Nexus API is running!" });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});
