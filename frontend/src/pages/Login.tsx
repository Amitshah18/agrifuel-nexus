import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, Leaf, Building2, ArrowLeft, KeyRound, 
  Smartphone, Lock, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"role" | "credentials" | "forgot">("role");
  const [role, setRole] = useState<"farmer" | "company" | null>(null);
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("af_token", data.token);
      localStorage.setItem("af_user", JSON.stringify(data.user));
      navigate(data.user.role === "farmer" ? "/dashboard" : "/business");
    } catch (err: any) {
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPass = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("If an account exists, an OTP has been sent to your registered contact.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFCFF] font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Left Side - Premium Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#022c22] p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#059669]/30 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-teal-500/20 blur-[100px]"></div>
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            AgriFuel Nexus
          </Link>
          <p className="text-emerald-100/70 mt-6 text-lg max-w-md leading-relaxed font-medium">
            The intelligent ecosystem connecting sustainable Indian farming practices with the future of global biofuel.
          </p>
        </div>
        
        {/* Glassmorphic Testimonial */}
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] max-w-lg shadow-2xl">
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-xl text-white font-medium leading-relaxed tracking-tight">
            "Selling our crop residue directly to biofuel plants has completely transformed our village's economy. No more stubble burning."
          </blockquote>
          <p className="text-emerald-400 mt-5 font-bold tracking-tight">— Ramesh S., Maharashtra</p>
        </div>
      </div>

      {/* Right Side - Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Soft background glow for the right side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative z-10">
          
          {/* Dynamic Header */}
          <div className="mb-10 relative">
            {stage !== "role" && (
              <button 
                onClick={() => {setStage("role"); setError(""); setSuccess("");}} 
                className="absolute -top-6 left-0 flex items-center text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </button>
            )}
            <h2 className="text-3xl font-black text-emerald-950 tracking-tighter mb-2 mt-4">
              {stage === "forgot" ? "Reset Password" : "Welcome back."}
            </h2>
            <p className="text-slate-500 font-medium">
              {stage === "role" && "Select your account type to access the portal."}
              {stage === "credentials" && `Sign in to your ${role === 'farmer' ? 'Farmer Dashboard' : 'Corporate Account'}.`}
              {stage === "forgot" && "Enter your registered mobile or email to receive an OTP."}
            </p>
          </div>

          {/* STAGE 1: Role Selection */}
          {stage === "role" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => { setRole("farmer"); setStage("credentials"); }}
                className="w-full flex items-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group text-left"
              >
                <div className="bg-emerald-50 p-3.5 rounded-xl mr-5 group-hover:bg-emerald-500 transition-colors shadow-sm border border-emerald-100 group-hover:border-emerald-500">
                  <Leaf className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-950 text-lg tracking-tight">Farmer Login</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Access AI tools & sell residue</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => { setRole("company"); setStage("credentials"); }}
                className="w-full flex items-center p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group text-left"
              >
                <div className="bg-blue-50 p-3.5 rounded-xl mr-5 group-hover:bg-blue-600 transition-colors shadow-sm border border-blue-100 group-hover:border-blue-600">
                  <Building2 className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-950 text-lg tracking-tight">Business / Buyer</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Procure biofuel resources</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STAGE 2: Login Credentials */}
          {stage === "credentials" && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Number or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
                    placeholder="e.g. 9876543210 or mail@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <button type="button" onClick={() => setStage("forgot")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl font-medium flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 rounded-xl font-bold text-white bg-[#022c22] hover:bg-[#064e3b] shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Authenticating..." : "Sign in to Dashboard"}
              </button>
            </form>
          )}

          {/* STAGE 3: Forgot Password */}
          {stage === "forgot" && (
            <form onSubmit={handleForgotPass} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Registered Mobile or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-900 shadow-sm"
                    placeholder="Enter details to receive OTP"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium flex items-start gap-3 border border-red-100">
                  <AlertCircle className="h-5 w-5 shrink-0" /> <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-xl font-medium flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> <p>{success}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 rounded-xl font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          )}

          {/* Global Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}