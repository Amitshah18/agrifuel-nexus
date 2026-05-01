import express from "express";
import { createListing, getListings, getMarketBenchmark } from "../controllers/listingController";
import { protect } from "../middleware/authMiddleware";
import Listing from "../models/Listing"; 

const router = express.Router();

router.get("/benchmark", protect, getMarketBenchmark);
router.route("/").get(protect, getListings).post(protect, createListing);

router.delete('/:id', protect, async (req: any, res: any) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Ensure only the farmer who made it can delete it
    if (listing.farmer.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
    }

    await listing.deleteOne();
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    
  } catch (error) {
    console.error("Delete Listing Error:", error);
    res.status(500).json({ success: false, message: 'Server error while deleting' });
  }
});

export default router;