import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Leaf, Store, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"type" | "form">("type");
  const [signupType, setSignupType] = useState<"farmer" | "buyer" | "seller" | null>(null);
  
  // Consolidated basic form state for brevity. 
  // In a production app, you might split these into separate state objects.
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", mobile: "",
    country: "", state: "",
    // Farmer specific
    landSize: "", soilType: "",
    // Business specific
    businessName: "", registrationNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    // MOCK API REQUEST FOR SIGNUP
    setTimeout(() => {
      setLoading(false);
      // Pretend the backend successfully created the user
      // Route them back to the login page to sign in
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-3xl font-extrabold text-green-700">
          <Leaf className="h-8 w-8" /> AgriFuel Nexus
        </Link>
      </div>

      <div className={`sm:mx-auto sm:w-full transition-all duration-300 ${stage === 'form' ? 'sm:max-w-4xl' : 'sm:max-w-md'}`}>
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {stage === "form" && (
             <button onClick={() => setStage("type")} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
               <ArrowLeft className="h-4 w-4 mr-1" /> Change Account Type
             </button>
          )}

          {/* STAGE 1: Account Selection */}
          {stage === "type" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create your account</h2>
              <div className="space-y-4">
                <button
                  onClick={() => { setSignupType("farmer"); setStage("form"); }}
                  className="w-full flex items-start p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <Leaf className="h-6 w-6 text-green-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-900">Farmer Account</h3>
                    <p className="text-sm text-gray-500 mt-1">Get AI advisory and sell crop waste directly to the marketplace.</p>
                  </div>
                </button>

                <button
                  onClick={() => { setSignupType("buyer"); setStage("form"); }}
                  className="w-full flex items-start p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <Store className="h-6 w-6 text-blue-600 mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-900">Business Buyer</h3>
                    <p className="text-sm text-gray-500 mt-1">Purchase sustainable biomass and biofuel resources from farmers.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: Registration Form */}
          {stage === "form" && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-gray-200 pb-5">
                <h3 className="text-xl font-bold leading-6 text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500"/>
                  {signupType === 'farmer' ? "Farmer Registration" : "Business Registration"}
                </h3>
              </div>

              {/* Using CSS Grid for clean layout of many fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                
                {/* Standard Fields for Everyone */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Full Name / Contact Person *</label>
                  <input required name="fullName" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                  <input required type="email" name="email" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <input required type="tel" name="mobile" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>

                {/* Conditional Fields based on User Type */}
                {signupType === "farmer" ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Land Holding (Acres) *</label>
                      <input required type="number" name="landSize" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Primary Soil Type</label>
                      <select name="soilType" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                        <option value="">Select Soil Type</option>
                        <option value="loamy">Loamy</option>
                        <option value="clay">Clayey</option>
                        <option value="sandy">Sandy</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Business/Company Name *</label>
                      <input required name="businessName" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Registration/Tax ID *</label>
                      <input required name="registrationNumber" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </>
                )}

                {/* Password Fields always sit at the bottom */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Password *</label>
                  <input required type="password" name="password" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Confirm Password *</label>
                  <input required type="password" name="confirmPassword" onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>

              {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">{error}</p>}

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto md:min-w-[200px] float-right py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Create Account"}
                </button>
              </div>
            </form>
          )}

          {stage === "type" && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-green-600 hover:text-green-500">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}