import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import crypto from "crypto";
import Listing from "../models/Listing";
import Order from "../models/Order";
import Offer from "../models/Offer";
import User from "../models/User";

// ==========================================
// 1. ESCROW & BOOKING LOGIC
// ==========================================
export const bookAndPay = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, pickupDate } = req.body;
    const buyerId = req.user.id;

    const listing = await Listing.findById(listingId).populate("farmer");
    if (!listing || listing.status !== "available") {
      res.status(400).json({ message: "Listing is no longer available." }); return;
    }

    const totalAmount = listing.quantity * listing.pricePerTon;
    const rawOtp = crypto.randomInt(100000, 999999).toString();

    const order = await Order.create({
      listing: listing._id,
      farmer: listing.farmer._id,
      buyer: buyerId,
      totalAmount,
      pickupDate,
      pickupOTP: rawOtp,
      status: "funds_in_escrow"
    });

    listing.status = "booked";
    await listing.save();

    res.status(201).json({ 
      message: "Payment successful.", 
      orderId: order._id,
      pickupOTP: rawOtp,
      farmerDetails: {
        mobile: (listing.farmer as any).mobile,
        // ADD ?. and fallback values here:
        village: listing.location?.village || "Unknown",
        coordinates: listing.location?.coordinates || { lat: 0, lng: 0 }
      }
    });
  } catch (error) { res.status(500).json({ message: "Transaction failed." }); }
};

export const verifyOTPAndReleaseFunds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, submittedOtp } = req.body;
    const farmerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order || order.status !== "funds_in_escrow" || order.farmer.toString() !== farmerId) {
      res.status(400).json({ message: "Invalid order." }); return;
    }

    if (order.pickupOTP !== submittedOtp) {
      res.status(401).json({ message: "Invalid OTP." }); return;
    }

    order.status = "completed";
    await order.save();

    await Listing.findByIdAndUpdate(order.listing, { status: "completed" });
    await User.findByIdAndUpdate(farmerId, { $inc: { totalEarnings: order.totalAmount } });

    res.status(200).json({ message: "OTP Verified! Funds released." });
  } catch (error) { res.status(500).json({ message: "Verification failed." }); }
};

// ==========================================
// 2. ORDER FETCHING LOGIC
// ==========================================
export const getBuyerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("listing")
      .populate("farmer", "fullName mobile address") 
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) { res.status(500).json({ message: "Failed to fetch orders." }); }
};

export const getFarmerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ farmer: req.user.id })
      .populate("listing")
      .populate("buyer", "companyDetails mobile email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) { res.status(500).json({ message: "Failed to fetch farmer orders." }); }
};

// ==========================================
// 3. NEGOTIATION / OFFER LOGIC
// ==========================================
export const makeOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, offeredPricePerTon, requestedQuantity, message } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) { res.status(404).json({ message: "Listing not found" }); return; }

    const offer = await Offer.create({
      listing: listingId,
      company: req.user.id,
      farmer: listing.farmer,
      offeredPricePerTon,
      requestedQuantity,
      message,
      status: "pending"
    });

    res.status(201).json({ message: "Offer sent successfully!", offer });
  } catch (error) { res.status(500).json({ message: "Failed to send offer." }); }
};

export const updateOfferStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action } = req.params; // 'accept' or 'reject'
    const offerId = req.params.id;

    const offer = await Offer.findById(offerId);
    if (!offer) { res.status(404).json({ message: "Offer not found" }); return; }

    offer.status = action === 'accept' ? 'accepted' : 'rejected';
    await offer.save();

    res.status(200).json({ message: `Offer ${offer.status} successfully`, offer });
  } catch (error) { res.status(500).json({ message: "Failed to update offer." }); }
};

export const getBuyerOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offers = await Offer.find({ company: req.user.id });
    res.status(200).json(offers);
  } catch (error) { res.status(500).json({ message: "Failed to fetch offers." }); }
};

export const getFarmerOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offers = await Offer.find({ farmer: req.user.id, status: "pending" })
      .populate("listing")
      .populate("company", "companyDetails mobile email")
      .sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) { res.status(500).json({ message: "Failed to fetch offers." }); }
};

export const getFarmerAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const farmer = await User.findById(req.user.id);
    const completedOrders = await Order.find({ farmer: req.user.id, status: "completed" }).countDocuments();
    res.status(200).json({ totalEarnings: farmer?.totalEarnings || 0, completedDeals: completedOrders });
  } catch (error) { res.status(500).json({ message: "Failed to fetch analytics." }); }
};