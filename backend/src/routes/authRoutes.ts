import express from "express";
import { registerUser, loginUser, forgotPassword } from "../controllers/authController";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

export default router;