import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_agrifuel_key", { expiresIn: "30d" });
};

// 1. SIGNUP
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, mobile, password, userType, ...rest } = req.body;

    // Check uniqueness for BOTH email and mobile
    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
       res.status(400).json({ 
        message: userExists.email === email 
          ? "Account with this email already exists." 
          : "Account with this mobile number already exists." 
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, mobile, password: hashedPassword, userType, ...rest });

    res.status(201).json({ message: "Account created successfully", _id: user.id });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 2. LOGIN (Email OR Mobile)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be email or phone

    // Find user by email OR mobile
    const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] });
    if (!user) {
      res.status(401).json({ message: "Account not found. Please check your details." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password." });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user.id),
      user: { id: user.id, email: user.email, name: user.fullName || user.companyDetails?.businessName, role: user.userType },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// 3. FORGOT PASSWORD (OTP Logic Scaffold)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] });
    
    if (!user) {
      res.status(404).json({ message: "No account found with that email or mobile number." });
      return;
    }

    // In a real app, generate a 6-digit OTP here and send via Twilio (SMS) or Nodemailer (Email)
    res.status(200).json({ message: "OTP sent successfully to your registered contact." });
  } catch (error) {
    res.status(500).json({ message: "Server error processing request." });
  }
};