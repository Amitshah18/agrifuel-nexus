import express from "express";
import { createListing, getListings } from "../controllers/listingController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getListings).post(protect, createListing);

export default router;