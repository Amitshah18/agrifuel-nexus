import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Listing from "../models/Listing";
import User from "../models/User";

// @route POST /api/listings
// @access Private (Farmers only)
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. Extract the new 'coordinates' sent from the React/React Native frontend
    const { residueType, quantity, pricePerTon, coordinates } = req.body;
    
    // Get the farmer from the database
    const farmer = await User.findById(req.user.id);
    if (!farmer) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 2. Safety check: Ensure coordinates were actually sent
    if (!coordinates || coordinates.lat === undefined || coordinates.lng === undefined) {
      res.status(400).json({ message: "Location coordinates are required to list biomass." });
      return;
    }

    // 3. Create the listing with the live GPS coordinates included
    const listing = await Listing.create({
      farmer: req.user.id,
      residueType,
      quantity,
      pricePerTon,
      location: {
        state: farmer.address?.state || "Unknown",
        district: farmer.address?.district || "Unknown",
        village: farmer.address?.village || "Unknown",
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      },
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};

// @route GET /api/listings
// @access Private (Buyers & Farmers)
export const getListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Fetch all available listings and populate the farmer's name/mobile
    const listings = await Listing.find({ status: "available" })
      .populate("farmer", "fullName mobile")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};