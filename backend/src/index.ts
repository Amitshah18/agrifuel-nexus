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
  process.env.FRONTEND_URL?.replace(/\/$/, ''), 
  'http://localhost:5173',    
  'http://localhost:8081',    
  'http://localhost:19006'    
].filter(Boolean);            

// 2. Configure CORS logic
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) {
      return callback(null, true);
    }
    
    const cleanOrigin = origin.replace(/\/$/, ''); // Strip trailing slash from incoming request

    if (allowedOrigins.indexOf(cleanOrigin) !== -1) {
      callback(null, true);
    } else {
      console.error(`🚨 CORS BLOCKED ORIGIN: ${origin}`); // This will tell us exactly what is failing in the Render logs
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
// Middleware (FIXED: Only ONE json parser with 50mb limit)
app.use(cors(corsOptions));
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