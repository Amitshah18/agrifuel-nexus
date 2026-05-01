import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, ChevronRight, Leaf, Building2, 
  MapPin, User, ShieldCheck, FileText, AlertCircle, Zap, Shield, Factory
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"type" | "wizard">("type");
  const [signupType, setSignupType] = useState<"farmer" | "buyer" | null>(null);
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", businessName: "",
    state: "", district: "", tehsil: "", village: "", pincode: "",
    companyType: "", gstin: "",
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

  const getStepIcon = (stepNum: number) => {
    if (stepNum === 1) return <User className="h-5 w-5" />;
    if (stepNum === 2) return signupType === 'farmer' ? <MapPin className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
    return <ShieldCheck className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex bg-[#FAFCFF] font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Left Side - Premium Brand Panel (Context Area) */}
      <div className="hidden lg:flex w-5/12 bg-[#022c22] p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Abstract Glowing Orbs & Texture */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[70%] rounded-full bg-[#059669]/30 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-teal-500/20 blur-[100px]"></div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>

        {/* Branding */}
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            AgriFuel Nexus
          </Link>
          <h1 className="text-4xl font-black text-white mt-12 mb-6 tracking-tighter leading-tight">
            Join the Modern <br/> Agricultural Ecosystem.
          </h1>
          <p className="text-emerald-100/70 text-lg leading-relaxed font-medium mb-12 max-w-md">
            Whether you're a farmer looking to turn crop waste into profit, or an industrial buyer securing biofuel resources, Nexus is your secure bridge.
          </p>

          {/* Feature Context Highlights */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-800/50 shrink-0">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">AI-Powered Farming</h4>
                <p className="text-emerald-100/60 font-medium text-sm mt-1">Diagnose diseases instantly with our advanced mobile scanner.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-800/50 shrink-0">
                <Factory className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Direct B2B Marketplace</h4>
                <p className="text-emerald-100/60 font-medium text-sm mt-1">Bypass middlemen. Trade biomass directly with state refineries.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-800/50 shrink-0">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">100% Secure Escrow</h4>
                <p className="text-emerald-100/60 font-medium text-sm mt-1">Funds are locked before pickup and released instantly via OTP.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Interactive Wizard Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        
        {/* Soft background glow for the right side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className={`w-full bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] border border-white relative z-10 transition-all duration-500 ease-in-out ${stage === 'wizard' ? 'max-w-2xl' : 'max-w-xl'}`}>
          
          {/* Mobile Branding (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg shadow-sm">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-emerald-950">AgriFuel Nexus</span>
          </div>

          {/* STAGE 1: Account Type Selection */}
          {stage === "type" && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-emerald-950 tracking-tighter mb-3">Create an Account</h2>
                <p className="text-slate-500 font-medium">Select how you want to use the platform.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button
                  onClick={() => { setSignupType("farmer"); setStage("wizard"); }}
                  className="group relative flex flex-col items-center text-center p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
                >
                  <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Leaf className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-emerald-950 text-lg tracking-tight mb-1">Farmer / FPO</h3>
                  <p className="text-xs text-slate-500 font-medium">Sell crop residue & access AI advisory.</p>
                </button>

                <button
                  onClick={() => { setSignupType("buyer"); setStage("wizard"); }}
                  className="group relative flex flex-col items-center text-center p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="h-16 w-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-emerald-950 text-lg tracking-tight mb-1">Corporate Buyer</h3>
                  <p className="text-xs text-slate-500 font-medium">Procure sustainable biomass resources.</p>
                </button>
              </div>

              <div className="mt-12 text-center border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-600 font-medium">
                  Already registered? <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Sign in instead</Link>
                </p>
              </div>
            </div>
          )}

          {/* STAGE 2: The Wizard Form */}
          {stage === "wizard" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              
              {/* Wizard Header & Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <button onClick={() => setStage("type")} className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
                    <ArrowLeft className="h-3 w-3 mr-1.5" /> Back
                  </button>
                  <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                    {signupType === 'farmer' ? 'Farmer Registration' : 'Corporate Registration'}
                  </div>
                </div>

                <div className="flex justify-between relative px-2">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 h-1 bg-[#059669] -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
                  
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-[#059669] text-white shadow-lg shadow-emerald-500/30' : 'bg-white border border-slate-200 text-slate-300'}`}>
                        {step > s ? <CheckCircle2 className="h-5 w-5" /> : getStepIcon(s)}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${step >= s ? 'text-emerald-950' : 'text-slate-400'}`}>
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
                    <h3 className="text-3xl font-black text-emerald-950 tracking-tighter mb-8">Let's start with the basics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {signupType === "farmer" ? "Full Name (As per Aadhaar/Bank) *" : "Registered Business Name *"}
                        </label>
                        <input 
                          required 
                          name={signupType === "farmer" ? "fullName" : "businessName"} 
                          value={signupType === "farmer" ? formData.fullName : formData.businessName} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-medium">+91</span>
                          </div>
                          <input 
                            required type="tel" name="mobile" maxLength={10} 
                            value={formData.mobile} onChange={handleInputChange} 
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 tracking-wide shadow-sm" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address *</label>
                        <input 
                          required type="email" name="email" 
                          value={formData.email} onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Location / Details */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-3xl font-black text-emerald-950 tracking-tighter mb-8">
                      {signupType === "farmer" ? "Where is your farm located?" : "Corporate Registration Details"}
                    </h3>
                    
                    {signupType === "farmer" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">State *</label>
                          <input required name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium shadow-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">District *</label>
                          <input required name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium shadow-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Tehsil / Taluka *</label>
                          <input required name="tehsil" value={formData.tehsil} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium shadow-sm" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Village / Panchayat *</label>
                          <input required name="village" value={formData.village} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium shadow-sm" />
                        </div>
                        <div className="space-y-2 col-span-1 md:col-span-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">PIN Code *</label>
                          <input required name="pincode" maxLength={6} value={formData.pincode} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium tracking-wide shadow-sm" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Industry Sector *</label>
                          <select required name="companyType" value={formData.companyType} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 cursor-pointer shadow-sm">
                            <option value="">Select your sector</option>
                            <option value="Biofuel Refinery">Biofuel Refinery (Ethanol/Biodiesel)</option>
                            <option value="Biomass Pellet Mfg">Biomass Pellet Manufacturer</option>
                            <option value="Thermal Power Plant">Thermal Power Plant</option>
                            <option value="Aggregator">Supply Chain Aggregator</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">GSTIN Number *</label>
                          <input required name="gstin" maxLength={15} value={formData.gstin} onChange={handleInputChange} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium uppercase tracking-wider shadow-sm" />
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Required for B2B marketplace compliance.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Security */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-3xl font-black text-emerald-950 tracking-tighter mb-8">Secure your account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Create Password *</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm Password *</label>
                        <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Global Error Banner */}
                {error && (
                  <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl font-bold flex items-start gap-3 animate-in fade-in">
                    <AlertCircle className="h-5 w-5 shrink-0" /> <p>{error}</p>
                  </div>
                )}

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-8 mt-10 border-t border-slate-100">
                  {step > 1 ? (
                    <button type="button" onClick={() => {setStep(step - 1); setError("");}} className="px-6 py-3 font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest text-xs">
                      Previous Step
                    </button>
                  ) : <div></div>}
                  
                  <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-[#022c22] hover:bg-[#064e3b] shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50">
                    {step === totalSteps ? (loading ? "Setting up..." : "Complete Registration") : "Continue to Next Step"}
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