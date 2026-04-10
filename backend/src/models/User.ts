import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Both email and mobile can be used to log in
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { 
      type: String, 
      enum: ["farmer", "buyer"], 
      required: true 
    },
    
    // Core Identity
    fullName: { type: String }, // For Farmer or Contact Person
    totalEarnings: { type: Number, default: 0 },
    // Indian Context Address
    address: {
      state: { type: String },
      district: { type: String },
      tehsil: { type: String }, // Block/Taluka
      village: { type: String },
      pincode: { type: String },
    },

    // B2B Company Specific (Buyers/Sellers)
    companyDetails: {
      businessName: { type: String },
      companyType: { type: String }, // e.g., "Biofuel Refinery", "Biomass Aggregator"
      gstin: { type: String },       // Indian GST Number
      expectedVolume: { type: String },
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);