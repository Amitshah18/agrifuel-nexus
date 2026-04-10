import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    residueType: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerTon: { type: Number, required: true },
    location: {
      state: { type: String }, district: { type: String }, village: { type: String },
      // Store exact live coordinates
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    status: { type: String, enum: ["available", "booked", "completed"], default: "available" },
  },
  { timestamps: true }
);

// Add a 2dsphere index for location-based sorting later
listingSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model("Listing", listingSchema);