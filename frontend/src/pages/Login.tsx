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
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex w-1/2 bg-green-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-green-800/50 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-emerald-600/40 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="text-3xl font-extrabold text-white flex items-center gap-3 tracking-tight">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <Leaf className="h-8 w-8 text-green-400" />
            </div>
            AgriFuel Nexus
          </Link>
          <p className="text-green-100/80 mt-6 text-lg max-w-md leading-relaxed font-light">
            The intelligent ecosystem connecting sustainable Indian farming practices with the future of global biofuel.
          </p>
        </div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl max-w-lg">
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-xl text-white font-medium leading-snug">
            "Selling our crop residue directly to biofuel plants has completely transformed our village's economy. No more stubble burning."
          </blockquote>
          <p className="text-green-200 mt-4 font-medium">— Ramesh S., Maharashtra</p>
        </div>
      </div>

      {/* Right Side - Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {/* Dynamic Header */}
          <div className="mb-8 relative">
            {stage !== "role" && (
              <button 
                onClick={() => {setStage("role"); setError(""); setSuccess("");}} 
                className="absolute -top-10 left-0 flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </button>
            )}
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {stage === "forgot" ? "Reset Password" : "Welcome back"}
            </h2>
            <p className="text-gray-500 font-medium">
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
                className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50/50 hover:shadow-lg hover:shadow-green-500/10 transition-all group text-left"
              >
                <div className="bg-green-100 p-3.5 rounded-xl mr-5 group-hover:bg-green-500 transition-colors shadow-sm">
                  <Leaf className="h-6 w-6 text-green-700 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Farmer Login</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Access AI tools & sell residue</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => { setRole("company"); setStage("credentials"); }}
                className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all group text-left"
              >
                <div className="bg-blue-100 p-3.5 rounded-xl mr-5 group-hover:bg-blue-600 transition-colors shadow-sm">
                  <Building2 className="h-6 w-6 text-blue-700 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Business / Buyer</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Procure biofuel resources</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STAGE 2: Login Credentials */}
          {stage === "credentials" && (
            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Mobile Number or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                    placeholder="e.g. 9876543210 or mail@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <button type="button" onClick={() => setStage("forgot")} className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
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

              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Authenticating..." : "Sign in to Dashboard"}
              </button>
            </form>
          )}

          {/* STAGE 3: Forgot Password */}
          {stage === "forgot" && (
            <form onSubmit={handleForgotPass} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Registered Mobile or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium text-gray-900"
                    placeholder="Enter details to receive OTP"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" /> <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-800 text-sm rounded-xl font-medium flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" /> <p>{success}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex justify-center py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-md transition-all disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          )}

          {/* Global Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-green-600 hover:text-green-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}