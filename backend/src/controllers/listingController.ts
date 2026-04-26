import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Listing from "../models/Listing";
import User from "../models/User";

// @route POST /api/listings
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { residueType, quantity, pricePerTon, coordinates, description, images } = req.body;
    
    const farmer = await User.findById(req.user.id);
    if (!farmer) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!coordinates || coordinates.lat === undefined || coordinates.lng === undefined) {
      res.status(400).json({ message: "Location coordinates are required." });
      return;
    }

    const listing = await Listing.create({
      farmer: req.user.id,
      residueType,
      quantity,
      pricePerTon,
      description,
      images,
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
export const getListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({ status: "available" })
      .populate("farmer", "fullName mobile")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// @route GET /api/listings/benchmark
export const getMarketBenchmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { residueType, state } = req.query;

    const benchmark = await Listing.aggregate([
      { 
        $match: { 
          residueType: residueType, 
          "location.state": state,
          status: "available" 
        } 
      },
      { 
        $group: { 
          _id: null, 
          avgPrice: { $avg: "$pricePerTon" },
          minPrice: { $min: "$pricePerTon" },
          maxPrice: { $max: "$pricePerTon" }
        } 
      }
    ]);

    if (benchmark.length > 0) {
      res.status(200).json(benchmark[0]);
    } else {
      res.status(200).json({ avgPrice: 0, minPrice: 0, maxPrice: 0, message: "Not enough data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch benchmark" });
  }
};