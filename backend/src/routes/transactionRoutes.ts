import express from "express";
import { 
  bookAndPay, verifyOTPAndReleaseFunds, getBuyerOrders, getFarmerOrders, getFarmerAnalytics, 
  makeOffer, updateOfferStatus, getBuyerOffers, getFarmerOffers 
} from "../controllers/transactionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Escrow & Orders
router.post("/book", protect, bookAndPay);
router.post("/verify-otp", protect, verifyOTPAndReleaseFunds);
router.get("/buyer/orders", protect, getBuyerOrders);
router.get("/farmer/orders", protect, getFarmerOrders);
router.get("/analytics", protect, getFarmerAnalytics);

// Offers & Negotiation
router.post("/offer", protect, makeOffer);
router.put("/offers/:id/:action", protect, updateOfferStatus);
router.get("/buyer/offers", protect, getBuyerOffers);
router.get("/offers/received", protect, getFarmerOffers);

export default router;