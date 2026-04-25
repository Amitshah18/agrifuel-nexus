import express from "express";
import { bookAndPay, verifyOTPAndReleaseFunds, getFarmerAnalytics, getBuyerOrders, getFarmerOrders } from "../controllers/transactionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/book", protect, bookAndPay);
router.post("/verify-otp", protect, verifyOTPAndReleaseFunds);
router.get("/analytics", protect, getFarmerAnalytics);
router.get("/buyer/orders", protect, getBuyerOrders);
router.get("/farmer/orders", protect, getFarmerOrders);

export default router;