import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import listingRoutes from "./routes/listingRoutes";
import transactionRoutes from "./routes/transactionRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware (FIXED: Only ONE json parser with 50mb limit)
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/transactions", transactionRoutes);

// Basic Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "AgriFuel Nexus API is running!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});