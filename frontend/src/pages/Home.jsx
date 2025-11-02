import { useState } from "react";
import { Link } from "react-router-dom";
import farmImg from "../assets/homePic.png";
import Navbar from "../components/Navbar-Homepage/Navbar_Home.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/Card/Card.jsx";
import { ArrowRight, Leaf, Brain, TrendingUp } from "lucide-react";
import LoginModal from "../components/LoginModal.jsx";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="relative w-screen">
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <section className="relative w-full h-screen">
        <div className="absolute inset-0">
          <img
            src={farmImg}
            alt="Modern sustainable farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 p-12 text-white flex flex-col justify-center h-full">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            AgriFuel Nexus
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mb-8 text-gray-100">
            Empowering sustainable agriculture with AI, innovation, and
            eco-friendly marketplace solutions.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-white font-medium transition"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features section (same as yours) */}
      {/* ... */}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
