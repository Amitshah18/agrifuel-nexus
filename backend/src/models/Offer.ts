import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    offeredPricePerTon: { type: Number, required: true },
    requestedQuantity: { type: Number, required: true },
    message: { type: String },
    
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected", "countered"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);