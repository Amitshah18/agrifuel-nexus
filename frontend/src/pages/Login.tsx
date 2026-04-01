import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Leaf, Building2, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  // Simplified to just two stages: Pick a role, then enter credentials
  const [stage, setStage] = useState<"role" | "credentials">("role");
  const [role, setRole] = useState<"farmer" | "company" | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoBack = () => {
    setError("");
    setStage("role");
    setRole(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ==========================================
    // MOCK BACKEND SIMULATION
    // ==========================================
    // This simulates a 1.5 second network request so you can 
    // test the UI without a running Python/Node backend.
    setTimeout(() => {
      setLoading(false);
      
      // Basic mock validation (optional, just to test error states)
      if (password.length < 6) {
        setError("Invalid credentials. Password must be at least 6 characters.");
        return;
      }

      // 1. Save fake authentication tokens to the browser
      localStorage.setItem("af_token", "mock_jwt_token_987654321");
      localStorage.setItem("af_user", JSON.stringify({
        email: email,
        role: role,
        name: role === 'farmer' ? "Test Farmer" : "Test Company"
      }));

      // 2. Route the user based on their role
      if (role === "farmer") {
        navigate("/dashboard"); // Farmers go to their hub
      } else {
        // NOTE: Make sure you have a Route for this in App.tsx!
        navigate("/marketplace"); // Companies go straight to buying
      }
    }, 1500);
    // ==========================================
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-green-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Leaf className="h-8 w-8" /> AgriFuel Nexus
          </Link>
          <p className="text-green-100 mt-4 text-lg max-w-md">
            The intelligent ecosystem connecting sustainable farming practices with the future of biofuel.
          </p>
        </div>
        
        <div className="relative z-10">
          <blockquote className="text-xl text-white font-medium italic">
            "Transforming agricultural waste into sustainable energy, one farm at a time."
          </blockquote>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-72 h-72 bg-green-400 rounded-full opacity-40 blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          {stage === "credentials" && (
            <button onClick={handleGoBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to roles
            </button>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">
              {stage === "role" && "Select your account type to continue."}
              {stage === "credentials" && `Sign in to your ${role === 'farmer' ? 'Farmer' : 'Company'} account.`}
            </p>
          </div>

          {/* STAGE 1: Role Selection */}
          {stage === "role" && (
            <div className="space-y-4">
              <button
                onClick={() => { setRole("farmer"); setStage("credentials"); }}
                className="w-full flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:shadow-md transition-all group text-left"
              >
                <div className="bg-green-100 p-4 rounded-xl mr-4 group-hover:bg-green-500 transition-colors">
                  <Leaf className="h-6 w-6 text-green-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Farmer Login</h3>
                  <p className="text-sm text-gray-500">Access AI tools & sell biofuel</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { setRole("company"); setStage("credentials"); }}
                className="w-full flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group text-left"
              >
                <div className="bg-blue-100 p-4 rounded-xl mr-4 group-hover:bg-blue-500 transition-colors">
                  <Building2 className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Biofuel Company</h3>
                  <p className="text-sm text-gray-500">Purchase sustainable resources</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {/* STAGE 2: Credentials */}
          {stage === "credentials" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder={role === 'farmer' ? "farmer@village.com" : "purchasing@biofuelcorp.com"}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-900">Password</label>
                  <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Sign in"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-green-600 hover:text-green-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}