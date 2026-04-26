import express from "express";
import { createListing, getListings, getMarketBenchmark } from "../controllers/listingController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/benchmark", protect, getMarketBenchmark);
router.route("/").get(protect, getListings).post(protect, createListing);

export default router;