import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Listing from "../models/Listing";
import Order from "../models/Order";
import User from "../models/User";

// ==========================================
// 1. BUYER: Book, Pay, and Generate OTP
// ==========================================
// Add these updated and new functions to your existing controller

export const bookAndPay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, pickupDate } = req.body;
    const buyerId = req.user.id;

    const listing = await Listing.findById(listingId).populate("farmer");
    if (!listing || listing.status !== "available") {
      res.status(400).json({ message: "Listing is no longer available." }); return;
    }

    const totalAmount = listing.quantity * listing.pricePerTon;
    const rawOtp = crypto.randomInt(100000, 999999).toString(); // Plain OTP

    const order = await Order.create({
      listing: listing._id,
      farmer: listing.farmer._id,
      buyer: buyerId,
      totalAmount,
      pickupDate,
      pickupOTP: rawOtp, // Saved in plain text for Zomato-style retrieval
      status: "funds_in_escrow"
    });

    listing.status = "booked"; // Hides it from marketplace
    await listing.save();

    res.status(201).json({ message: "Payment successful.", orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: "Transaction failed." });
  }
};

export const verifyOTPAndReleaseFunds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, submittedOtp } = req.body;
    const farmerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order || order.status !== "funds_in_escrow" || order.farmer.toString() !== farmerId) {
      res.status(400).json({ message: "Invalid order." }); return;
    }

    // Direct string comparison
    if (order.pickupOTP !== submittedOtp) {
      res.status(401).json({ message: "Invalid OTP." }); return;
    }

    order.status = "completed";
    await order.save();

    await Listing.findByIdAndUpdate(order.listing, { status: "completed" });
    await User.findByIdAndUpdate(farmerId, { $inc: { totalEarnings: order.totalAmount } });

    res.status(200).json({ message: "OTP Verified! Funds released." });
  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
};

// NEW: Fetch Buyer's Orders (For the Zomato-style History)
export const getBuyerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Populate listing and farmer to get the FULL address
    const orders = await Order.find({ buyer: req.user.id })
      .populate("listing")
      .populate("farmer", "fullName mobile address") 
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};
// ==========================================
// 3. FARMER ANALYTICS: Get Total Earnings
// ==========================================
export const getFarmerAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const farmer = await User.findById(req.user.id);
    const completedOrders = await Order.find({ farmer: req.user.id, status: "completed" }).countDocuments();
    
    res.status(200).json({
      totalEarnings: farmer?.totalEarnings || 0,
      completedDeals: completedOrders
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics." });
  }
};
export const getFarmerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ farmer: req.user.id })
      .populate("listing")
      .populate("buyer", "companyDetails mobile email") // Get buyer details
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch farmer orders." });
  }
};