import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    totalAmount: { type: Number, required: true },
    pickupDate: { type: Date, required: true },
    
    // Escrow Status
    status: { 
      type: String, 
      enum: ["funds_in_escrow", "completed", "disputed"], 
      default: "funds_in_escrow" 
    },
    
    // Secure OTP
    pickupOTP: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);