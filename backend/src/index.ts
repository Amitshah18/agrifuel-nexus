import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import listingRoutes from "./routes/listingRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import advisoryRoutes from './routes/advisoryRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
// Connect to MongoDB
connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,   // Deployed Vercel React App
  'http://localhost:5173',    // Local Vite React App
  'http://localhost:8081',    // Local Expo Web App
  'http://localhost:19006'    // Legacy Local Expo Web App
].filter(Boolean);            // Removes undefined if env vars are missing

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (Mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow if the origin is in our array
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
// Middleware (FIXED: Only ONE json parser with 50mb limit)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});