import { useState, useEffect } from "react";
import { X, ArrowRight, ChevronLeft } from "lucide-react";

export default function SignupModal({ isOpen, onClose, onSignupComplete, initialSignupType = null, initialUserType = null }) {
  const [stage, setStage] = useState(initialSignupType ? "form" : "signupType"); // signupType, selectUserType, form, otp
  const [signupType, setSignupType] = useState(initialSignupType); // 'dashboard' or 'marketplace'
  const [userType, setUserType] = useState(initialUserType); // 'seller' or 'buyer' (for marketplace)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialSignupType) {
        setSignupType(initialSignupType);
        if (initialSignupType === "marketplace" && initialUserType) {
          setUserType(initialUserType);
          setStage("form");
        } else if (initialSignupType === "marketplace") {
          setStage("selectUserType");
        } else {
          setStage("form");
        }
      } else {
        setStage("signupType");
        setSignupType(null);
        setUserType(null);
      }
    }
  }, [isOpen, initialSignupType, initialUserType]);

  // Dashboard form state
  const [dashboardForm, setDashboardForm] = useState({
    fullName: "",
    mobileNumber: "",
    otp: "",
    country: "",
    state: "",
    district: "",
    block: "",
    soilType: "",
    landHoldingSize: "",
    cropsGrown: [],
    irrigationMethod: "",
    joinMarketplace: false,
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Marketplace seller form state
  const [sellerForm, setSellerForm] = useState({
    businessName: "",
    ownerName: "",
    mobileNumber: "",
    otp: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    cropWasteTypes: [],
    volumePerYear: "",
    registrationNumber: "",
    certifications: "",
    businessDescription: "",
  });

  // Marketplace buyer form state
  const [buyerForm, setBuyerForm] = useState({
    companyName: "",
    contactPerson: "",
    mobileNumber: "",
    otp: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    industryType: "",
    requirementVolume: "",
    taxId: "",
    businessDescription: "",
  });

  const cropOptions = [
    "Wheat",
    "Rice",
    "Corn",
    "Sugarcane",
    "Cotton",
    "Soybean",
    "Barley",
    "Oats",
    "Pulses",
    "Vegetables",
    "Fruits",
    "Other",
  ];

  const cropWasteOptions = [
    "Rice Husk",
    "Wheat Straw",
    "Corn Stover",
    "Sugarcane Bagasse",
    "Cotton Stalks",
    "Other",
  ];

  const irrigationMethods = ["Drip", "Sprinkler", "Flood", "Rainfed", "Mixed"];
  const soilTypes = [
    "Clayey",
    "Sandy",
    "Loamy",
    "Silty",
    "Peaty",
    "Chalky",
    "Mixed",
  ];
  const industryTypes = [
    "Energy Production",
    "Power Plant",
    "Biofuel Refinery",
    "Chemical Manufacturing",
    "Food Processing",
    "Agriculture Industry",
    "Other",
  ];

  const handleSignupTypeSelect = (type) => {
    setSignupType(type);
    if (type === "marketplace") {
      setStage("selectUserType");
    } else {
      setStage("form");
    }
    setError("");
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStage("form");
    setError("");
  };

  const handleGoBack = () => {
    if (stage === "selectUserType") {
      setStage("signupType");
      setUserType(null);
    } else if (stage === "form") {
      if (signupType === "marketplace") {
        setStage("selectUserType");
      } else {
        setStage("signupType");
        setSignupType(null);
      }
    } else if (stage === "otp") {
      setStage("form");
      setOtpSent(false);
    }
    setError("");
    setOtpError("");
  };

  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");

    const mobileNumber =
      signupType === "dashboard"
        ? dashboardForm.mobileNumber
        : userType === "seller"
        ? sellerForm.mobileNumber
        : buyerForm.mobileNumber;

    try {
      // Simulate OTP sending
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      setStage("otp");
      // In production, OTP would be sent via SMS
      console.log("OTP sent to:", mobileNumber);
    } catch (err) {
      setOtpError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload = {};

      if (signupType === "dashboard") {
        // Validate dashboard form
        if (
          dashboardForm.password !== dashboardForm.confirmPassword
        ) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        payload = {
          userType: "farmer",
          fullName: dashboardForm.fullName,
          mobileNumber: dashboardForm.mobileNumber,
          otp: dashboardForm.otp,
          email: dashboardForm.email,
          password: dashboardForm.password,
          address: {
            country: dashboardForm.country,
            state: dashboardForm.state,
            district: dashboardForm.district,
            block: dashboardForm.block,
          },
          farmingDetails: {
            soilType: dashboardForm.soilType,
            landHoldingSize: dashboardForm.landHoldingSize,
            cropsGrown: dashboardForm.cropsGrown,
            irrigationMethod: dashboardForm.irrigationMethod,
          },
          joinMarketplace: dashboardForm.joinMarketplace,
        };
      } else if (signupType === "marketplace") {
        if (userType === "seller") {
          if (sellerForm.password !== sellerForm.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
          }

          payload = {
            userType: "marketplace_seller",
            businessName: sellerForm.businessName,
            ownerName: sellerForm.ownerName,
            mobileNumber: sellerForm.mobileNumber,
            otp: sellerForm.otp,
            email: sellerForm.email,
            password: sellerForm.password,
            address: {
              country: sellerForm.country,
              state: sellerForm.state,
            },
            sellerDetails: {
              cropWasteTypes: sellerForm.cropWasteTypes,
              volumePerYear: sellerForm.volumePerYear,
              registrationNumber: sellerForm.registrationNumber,
              certifications: sellerForm.certifications,
              businessDescription: sellerForm.businessDescription,
            },
          };
        } else {
          if (buyerForm.password !== buyerForm.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
          }

          payload = {
            userType: "marketplace_buyer",
            companyName: buyerForm.companyName,
            contactPerson: buyerForm.contactPerson,
            mobileNumber: buyerForm.mobileNumber,
            otp: buyerForm.otp,
            email: buyerForm.email,
            password: buyerForm.password,
            address: {
              country: buyerForm.country,
              state: buyerForm.state,
            },
            buyerDetails: {
              industryType: buyerForm.industryType,
              requirementVolume: buyerForm.requirementVolume,
              taxId: buyerForm.taxId,
              businessDescription: buyerForm.businessDescription,
            },
          };
        }
      }

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // Signup successful
      onSignupComplete && onSignupComplete();
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error — make sure the backend is running.");
    }
  };

  const toggleCrop = (crop) => {
    if (signupType === "dashboard") {
      setDashboardForm((prev) => ({
        ...prev,
        cropsGrown: prev.cropsGrown.includes(crop)
          ? prev.cropsGrown.filter((c) => c !== crop)
          : [...prev.cropsGrown, crop],
      }));
    } else if (userType === "seller") {
      setSellerForm((prev) => ({
        ...prev,
        cropWasteTypes: prev.cropWasteTypes.includes(crop)
          ? prev.cropWasteTypes.filter((c) => c !== crop)
          : [...prev.cropWasteTypes, crop],
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-green-700">AgriFuel Nexus</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* SIGNUP TYPE SELECTION */}
          {stage === "signupType" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Create Account
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Choose which platform you'd like to sign up for
                </p>
              </div>

              <button
                onClick={() => handleSignupTypeSelect("dashboard")}
                className="w-full border-2 border-green-300 hover:border-green-600 hover:bg-green-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Farmer Dashboard
                </h4>
                <p className="text-sm text-gray-600">
                  Manage crops, detect diseases, and get AI insights
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={() => handleSignupTypeSelect("marketplace")}
                className="w-full border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">🛒</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  BioFuel Marketplace
                </h4>
                <p className="text-sm text-gray-600">
                  Sell crop wastes or buy biofuel resources
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>
          )}

          {/* USER TYPE SELECTION FOR MARKETPLACE */}
          {stage === "selectUserType" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Select Account Type
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you a seller or buyer?
                </p>
              </div>

              <button
                onClick={() => handleUserTypeSelect("seller")}
                className="w-full border-2 border-green-300 hover:border-green-600 hover:bg-green-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">👨‍🌾</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Seller (Farmer)
                </h4>
                <p className="text-sm text-gray-600">
                  Sell crop wastes and biomass to buyers
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={() => handleUserTypeSelect("buyer")}
                className="w-full border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">🏢</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Buyer (Company)
                </h4>
                <p className="text-sm text-gray-600">
                  Buy biofuel and biomass resources
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={handleGoBack}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium py-2 flex items-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            </div>
          )}

          {/* DASHBOARD SIGNUP FORM */}
          {stage === "form" && signupType === "dashboard" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Farmer Registration
                </h3>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Basic Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={dashboardForm.fullName}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        fullName: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={dashboardForm.email}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={dashboardForm.mobileNumber}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      required
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !dashboardForm.mobileNumber}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {otpError && (
                    <p className="text-red-600 text-xs mt-1">{otpError}</p>
                  )}
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OTP *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={dashboardForm.otp}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          otp: e.target.value,
                        })
                      }
                      required={otpSent}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      maxLength="6"
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Location</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      placeholder="India"
                      value={dashboardForm.country}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          country: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      value={dashboardForm.state}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          state: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      placeholder="Pune"
                      value={dashboardForm.district}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          district: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block/Taluka *
                    </label>
                    <input
                      type="text"
                      placeholder="Haveli"
                      value={dashboardForm.block}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          block: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Farming Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Farming Details</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soil Type *
                    </label>
                    <select
                      value={dashboardForm.soilType}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          soilType: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Land Holding Size (in acres) *
                    </label>
                    <input
                      type="number"
                      placeholder="5.5"
                      value={dashboardForm.landHoldingSize}
                      onChange={(e) =>
                        setDashboardForm({
                          ...dashboardForm,
                          landHoldingSize: e.target.value,
                        })
                      }
                      required
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Method *
                  </label>
                  <select
                    value={dashboardForm.irrigationMethod}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        irrigationMethod: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">Select Irrigation Method</option>
                    {irrigationMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crops Grown (Select all applicable) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cropOptions.map((crop) => (
                      <label
                        key={crop}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={dashboardForm.cropsGrown.includes(crop)}
                          onChange={() => toggleCrop(crop)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{crop}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Marketplace Option */}
              <div className="bg-blue-50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dashboardForm.joinMarketplace}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        joinMarketplace: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 w-5 h-5"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Join BioFuel Marketplace
                    </p>
                    <p className="text-sm text-gray-600">
                      Sell your crop wastes as biofuel to interested companies
                    </p>
                  </div>
                </label>
              </div>

              {/* Password */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Account Security</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={dashboardForm.password}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        password: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={dashboardForm.confirmPassword}
                    onChange={(e) =>
                      setDashboardForm({
                        ...dashboardForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !otpSent}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || !otpSent
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            </form>
          )}

          {/* MARKETPLACE SELLER SIGNUP FORM */}
          {stage === "form" && signupType === "marketplace" && userType === "seller" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Marketplace Seller Registration
                </h3>
              </div>

              {/* Business Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Business Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your business name"
                    value={sellerForm.businessName}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        businessName: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={sellerForm.ownerName}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        ownerName: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Business registration number"
                    value={sellerForm.registrationNumber}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        registrationNumber: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    placeholder="Tell us about your business..."
                    value={sellerForm.businessDescription}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        businessDescription: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Contact Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={sellerForm.email}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={sellerForm.mobileNumber}
                      onChange={(e) =>
                        setSellerForm({
                          ...sellerForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      required
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !sellerForm.mobileNumber}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OTP *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={sellerForm.otp}
                      onChange={(e) =>
                        setSellerForm({
                          ...sellerForm,
                          otp: e.target.value,
                        })
                      }
                      required={otpSent}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      maxLength="6"
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Location</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      placeholder="India"
                      value={sellerForm.country}
                      onChange={(e) =>
                        setSellerForm({
                          ...sellerForm,
                          country: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      value={sellerForm.state}
                      onChange={(e) =>
                        setSellerForm({
                          ...sellerForm,
                          state: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Seller Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Product Details</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Waste Types (Select all applicable) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cropWasteOptions.map((waste) => (
                      <label
                        key={waste}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={sellerForm.cropWasteTypes.includes(waste)}
                          onChange={() => toggleCrop(waste)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{waste}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Volume (in tonnes) *
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={sellerForm.volumePerYear}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        volumePerYear: e.target.value,
                      })
                    }
                    required
                    step="10"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications/Standards
                  </label>
                  <input
                    type="text"
                    placeholder="ISO, FSC, etc."
                    value={sellerForm.certifications}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        certifications: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Account Security</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={sellerForm.password}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        password: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={sellerForm.confirmPassword}
                    onChange={(e) =>
                      setSellerForm({
                        ...sellerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !otpSent}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || !otpSent
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            </form>
          )}

          {/* MARKETPLACE BUYER SIGNUP FORM */}
          {stage === "form" && signupType === "marketplace" && userType === "buyer" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Marketplace Buyer Registration
                </h3>
              </div>

              {/* Company Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Company Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    value={buyerForm.companyName}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        companyName: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={buyerForm.contactPerson}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        contactPerson: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Type *
                  </label>
                  <select
                    value={buyerForm.industryType}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        industryType: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Industry Type</option>
                    {industryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID / GST Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Tax identification number"
                    value={buyerForm.taxId}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        taxId: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    placeholder="Tell us about your company..."
                    value={buyerForm.businessDescription}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        businessDescription: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Contact Information
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={buyerForm.email}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={buyerForm.mobileNumber}
                      onChange={(e) =>
                        setBuyerForm({
                          ...buyerForm,
                          mobileNumber: e.target.value,
                        })
                      }
                      required
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !buyerForm.mobileNumber}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OTP *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={buyerForm.otp}
                      onChange={(e) =>
                        setBuyerForm({
                          ...buyerForm,
                          otp: e.target.value,
                        })
                      }
                      required={otpSent}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      maxLength="6"
                    />
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Location</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      placeholder="India"
                      value={buyerForm.country}
                      onChange={(e) =>
                        setBuyerForm({
                          ...buyerForm,
                          country: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      value={buyerForm.state}
                      onChange={(e) =>
                        setBuyerForm({
                          ...buyerForm,
                          state: e.target.value,
                        })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Purchase Requirements
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Requirement (in tonnes) *
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={buyerForm.requirementVolume}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        requirementVolume: e.target.value,
                      })
                    }
                    required
                    step="50"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Account Security</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={buyerForm.password}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        password: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={buyerForm.confirmPassword}
                    onChange={(e) =>
                      setBuyerForm({
                        ...buyerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !otpSent}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading || !otpSent
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" /> Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
