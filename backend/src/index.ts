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

// Middleware
app.use(cors()); // Allows your React frontend to make requests
app.use(express.json()); // Parses incoming JSON payloads

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