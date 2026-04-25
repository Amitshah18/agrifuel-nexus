import { useState, FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import "./login.css";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: Record<string, any>;
  message?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: (loginType: string, userType: string | null) => void;
}

const LoginModal: FC<LoginModalProps> = ({ isOpen, onClose, onSignupClick }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"loginType" | "userType" | "credentials">("loginType");
  const [loginType, setLoginType] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLoginTypeSelect = (type: string) => {
    setLoginType(type);
    if (type === "marketplace") {
      setStage("userType");
    } else {
      setStage("credentials");
    }
    setError("");
  };

  const handleUserTypeSelect = (type: string) => {
    setUserType(type);
    setStage("credentials");
    setError("");
  };

  const handleGoBack = () => {
    if (stage === "userType") {
      setStage("loginType");
      setLoginType(null);
    } else if (stage === "credentials") {
      if (loginType === "marketplace") {
        setStage("userType");
        setUserType(null);
      } else {
        setStage("loginType");
        setLoginType(null);
      }
    }
    setError("");
    setForm({ email: "", password: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: form.email,
        password: form.password,
        loginType: loginType,
        ...(loginType === "marketplace" && { userType: userType }),
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      if (data.token) {
        localStorage.setItem("af_token", data.token);
        localStorage.setItem("af_user", JSON.stringify(data.user || {}));
        localStorage.setItem("af_loginType", loginType || "");
        if (loginType === "marketplace") {
          localStorage.setItem("af_userType", userType || "");
        }
        onClose();
        navigate("/dashboard");
      } else {
        setError("Invalid server response");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Network error — make sure the backend is running.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-700">AgriFuel Nexus</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* LOGIN TYPE SELECTION */}
          {stage === "loginType" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Select Login Type
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Choose which platform you'd like to access
                </p>
              </div>

              <button
                onClick={() => handleLoginTypeSelect("marketplace")}
                className="w-full border-2 border-green-300 hover:border-green-600 hover:bg-green-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">🛒</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  BioFuel Marketplace
                </h4>
                <p className="text-sm text-gray-600">
                  Buy or sell sustainable biofuel resources
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={() => handleLoginTypeSelect("dashboard")}
                className="w-full border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">📊</div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Farmer Dashboard
                </h4>
                <p className="text-sm text-gray-600">
                  Manage crops and get AI insights
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>
          )}

          {/* USER TYPE SELECTION (for Marketplace) */}
          {stage === "userType" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Select User Type
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Are you buying or selling biofuel resources?
                </p>
              </div>

              <button
                onClick={() => handleUserTypeSelect("buyer")}
                className="w-full border-2 border-green-300 hover:border-green-600 hover:bg-green-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">🏢</div>
                <h4 className="font-bold text-gray-900 mb-1">Business Buyer</h4>
                <p className="text-sm text-gray-600">
                  Buy biofuel and biomass resources for your business
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={() => handleUserTypeSelect("seller")}
                className="w-full border-2 border-blue-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl p-6 text-left transition group"
              >
                <div className="text-4xl mb-3">👨‍🌾</div>
                <h4 className="font-bold text-gray-900 mb-1">Customer Seller</h4>
                <p className="text-sm text-gray-600">
                  Sell your biofuel and biomass to interested buyers
                </p>
                <div className="flex justify-end mt-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              </button>

              <button
                onClick={handleGoBack}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                ← Back
              </button>
            </div>
          )}

          {/* CREDENTIALS INPUT */}
          {stage === "credentials" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Sign In
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {loginType === "marketplace"
                    ? `Login as a ${userType === "buyer" ? "Business Buyer" : "Customer Seller"}`
                    : "Login to your farmer dashboard"}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 mt-2 text-white rounded-lg font-semibold transition ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={handleGoBack}
                className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Back
              </button>

              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignupClick && onSignupClick(loginType || "", userType);
                  }}
                  className="text-green-600 hover:underline font-medium bg-none border-none cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
