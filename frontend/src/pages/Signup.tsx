import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, ChevronRight, Leaf, Building2, 
  MapPin, User, ShieldCheck, Phone, FileText, AlertCircle 
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"type" | "wizard">("type");
  const [signupType, setSignupType] = useState<"farmer" | "buyer" | null>(null);
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1: Identity
    fullName: "", email: "", mobile: "", businessName: "",
    // Step 2: Context
    state: "", district: "", tehsil: "", village: "", pincode: "",
    companyType: "", gstin: "",
    // Step 3: Security
    password: "", confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.mobile || !formData.email) return setError("Contact details are required.");
      if (signupType === 'farmer' && !formData.fullName) return setError("Full name is required.");
      if (signupType === 'buyer' && !formData.businessName) return setError("Business name is required.");
    }
    if (step === 2) {
      if (signupType === 'farmer' && (!formData.state || !formData.district || !formData.village)) 
        return setError("Please complete your location details.");
      if (signupType === 'buyer' && (!formData.companyType || !formData.gstin)) 
        return setError("Please complete your registration details.");
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!"); return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType: signupType,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          fullName: formData.fullName,
          address: {
            state: formData.state, district: formData.district, tehsil: formData.tehsil, village: formData.village, pincode: formData.pincode
          },
          companyDetails: signupType === 'buyer' ? {
            businessName: formData.businessName, gstin: formData.gstin, companyType: formData.companyType
          } : undefined
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for step icons
  const getStepIcon = (stepNum: number) => {
    if (stepNum === 1) return <User className="h-5 w-5" />;
    if (stepNum === 2) return signupType === 'farmer' ? <MapPin className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
    return <ShieldCheck className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Branding */}
      <div className="mx-auto w-full max-w-3xl mb-8 text-center animate-in fade-in slide-in-from-top-4">
        <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-gray-900 tracking-tight">
          <Leaf className="h-8 w-8 text-green-600" /> AgriFuel Nexus
        </Link>
      </div>

      {/* Main Card */}
      <div className={`mx-auto w-full transition-all duration-500 ease-in-out ${stage === 'wizard' ? 'max-w-3xl' : 'max-w-xl'}`}>
        <div className="bg-white py-10 px-6 sm:px-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 relative overflow-hidden">
          
          {/* STAGE 1: Account Type Selection */}
          {stage === "type" && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Join the Ecosystem</h2>
                <p className="text-gray-500 font-medium text-lg">How would you like to use AgriFuel Nexus?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  onClick={() => { setSignupType("farmer"); setStage("wizard"); }}
                  className="group relative flex flex-col items-center text-center p-8 border-2 border-gray-100 rounded-3xl hover:border-green-500 hover:bg-green-50/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-xl mb-2">Farmer / FPO</h3>
                  <p className="text-sm text-gray-500 font-medium">Access AI advisory and monetize your crop residue directly.</p>
                </button>

                <button
                  onClick={() => { setSignupType("buyer"); setStage("wizard"); }}
                  className="group relative flex flex-col items-center text-center p-8 border-2 border-gray-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-xl mb-2">Corporate Buyer</h3>
                  <p className="text-sm text-gray-500 font-medium">Procure sustainable biomass and biofuel resources.</p>
                </button>
              </div>

              <p className="mt-10 text-center text-base text-gray-600 font-medium">
                Already registered? <Link to="/login" className="font-bold text-green-600 hover:text-green-700">Sign in instead</Link>
              </p>
            </div>
          )}

          {/* STAGE 2: The Wizard Form */}
          {stage === "wizard" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              
              {/* Wizard Header & Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={() => setStage("type")} className="flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Change Type
                  </button>
                  <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
                    {signupType === 'farmer' ? 'Farmer Registration' : 'Corporate Registration'}
                  </div>
                </div>

                <div className="flex justify-between relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
                  
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-green-600 text-white shadow-md shadow-green-500/30' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                        {step > s ? <CheckCircle2 className="h-5 w-5" /> : getStepIcon(s)}
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                        {s === 1 ? 'Identity' : s === 2 ? (signupType === 'farmer' ? 'Location' : 'Details') : 'Security'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                
                {/* STEP 1: Basic Identity */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Let's start with the basics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">
                          {signupType === "farmer" ? "Full Name (As per Aadhaar/Bank) *" : "Registered Business Name *"}
                        </label>
                        <input 
                          required 
                          name={signupType === "farmer" ? "fullName" : "businessName"} 
                          value={signupType === "farmer" ? formData.fullName : formData.businessName} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900" 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">Mobile Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-medium">+91</span>
                          </div>
                          <input 
                            required type="tel" name="mobile" maxLength={10} 
                            value={formData.mobile} onChange={handleInputChange} 
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900 tracking-wide" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">Email Address *</label>
                        <input 
                          required type="email" name="email" 
                          value={formData.email} onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Location / Details (Indian Context) */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
                      {signupType === "farmer" ? "Where is your farm located?" : "Corporate Registration Details"}
                    </h3>
                    
                    {signupType === "farmer" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">State *</label>
                          <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">District *</label>
                          <input required name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">Tehsil / Taluka *</label>
                          <input required name="tehsil" value={formData.tehsil} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">Village / Gram Panchayat *</label>
                          <input required name="village" value={formData.village} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700">PIN Code *</label>
                          <input required name="pincode" maxLength={6} value={formData.pincode} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium tracking-wide" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">Industry Sector *</label>
                          <select required name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 cursor-pointer">
                            <option value="">Select your sector</option>
                            <option value="Biofuel Refinery">Biofuel Refinery (Ethanol/Biodiesel)</option>
                            <option value="Biomass Pellet Mfg">Biomass Pellet Manufacturer</option>
                            <option value="Thermal Power Plant">Thermal Power Plant</option>
                            <option value="Aggregator">Supply Chain Aggregator</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-bold text-gray-700">GSTIN Number *</label>
                          <input required name="gstin" maxLength={15} value={formData.gstin} onChange={handleInputChange} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium uppercase tracking-wider" />
                          <p className="text-xs text-gray-500 font-medium mt-1">Required for B2B marketplace compliance.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Security */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Secure your account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">Create Password *</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">Confirm Password *</label>
                        <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Global Error Banner */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl font-bold flex items-start gap-3 animate-in fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0" /> <p>{error}</p>
                  </div>
                )}

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
                  {step > 1 ? (
                    <button type="button" onClick={() => {setStep(step - 1); setError("");}} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors">
                      Back
                    </button>
                  ) : <div></div>}
                  
                  <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all disabled:opacity-50">
                    {step === totalSteps ? (loading ? "Setting up..." : "Create Account") : "Continue to Next Step"}
                    {step !== totalSteps && <ChevronRight className="h-5 w-5" />}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}