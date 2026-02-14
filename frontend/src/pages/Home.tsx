import { useState, FC } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import farmImg from "../assets/homePic.png";
import NavbarHome from "../components/Navbar-Homepage/Navbar_Home";
import Footer from "../components/Footer/Footer";
import LoginModal from "../components/Login/LoginModal";
import SignupModal from "../components/Signup/SignupModal";
import "./Home.css";
import {
  ArrowRight,
  Leaf,
  Brain,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
}

interface TeamMember {
  name: string;
  role: string;
  contribution: string;
}

interface VideoData {
  title: string;
  videoId: string;
  thumbnail: string;
}

const Home: FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [signupType, setSignupType] = useState<string | null>(null);
  const [signupUserType, setSignupUserType] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [servicesSlide, setServicesSlide] = useState<number>(0);

  const handleSignupComplete = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleOpenSignupFromLogin = (type: string, userType: string | null = null) => {
    setSignupType(type);
    setSignupUserType(userType);
    setShowLogin(false);
    setShowSignup(true);
  };

  // Hero slides
  const slides: Slide[] = [
    {
      id: 1,
      title: "AI-Powered Plant Disease Detection",
      description: "Detect crop diseases early with advanced machine learning",
      icon: Brain,
    },
    {
      id: 2,
      title: "Smart Fertilizer Recommendations",
      description: "Optimize crop health with data-driven recommendations",
      icon: TrendingUp,
    },
    {
      id: 3,
      title: "Biofuel Marketplace",
      description: "Connect farmers with sustainable biofuel buyers",
      icon: Leaf,
    },
  ];

  // Services data
  const services: Service[] = [
    {
      id: 1,
      title: "Plant Disease Detection",
      description:
        "Our AI-powered system analyzes crop images to detect diseases early. Get instant diagnosis and treatment recommendations to protect your yield.",
      features: [
        "Real-time disease identification",
        "Treatment recommendations",
        "Prevention tips",
        "Historical tracking",
      ],
    },
    {
      id: 2,
      title: "Fertilizer & Pesticide Recommendation",
      description:
        "Data-driven recommendations tailored to your soil composition, climate, and crop type for maximum efficiency and sustainability.",
      features: [
        "Soil analysis integration",
        "Climate-based suggestions",
        "Cost optimization",
        "Eco-friendly options",
      ],
    },
    {
      id: 3,
      title: "Biofuel Marketplace",
      description:
        "A dedicated platform connecting farmers and businesses in the renewable energy sector. Sell your biomass directly to buyers.",
      features: [
        "Direct buyer connections",
        "Fair pricing",
        "Secure transactions",
        "Market analytics",
      ],
    },
  ];

  // Team members
  const teamMembers: TeamMember[] = [
    {
      name: "Amit Shah",
      role: "Co-Founder & Tech Lead",
      contribution: "Backend infrastructure, AI integration",
    },
    {
      name: "Stuti",
      role: "Co-Founder & Frontend Lead",
      contribution: "UI/UX design, frontend development",
    },
    {
      name: "Team Member 3",
      role: "Agriculture Expert",
      contribution: "Domain knowledge, feature design",
    },
  ];

  // Video thumbnails (YouTube videos)
  const videos: VideoData[] = [
    {
      title: "AgriFuel Nexus Overview",
      videoId: "dQw4w9WgXcQ",
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
    },
    {
      title: "Disease Detection Demo",
      videoId: "jNQXAC9IVRw",
      thumbnail: `https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg`,
    },
    {
      title: "Marketplace Tutorial",
      videoId: "9bZkp7q19f0",
      thumbnail: `https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg`,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextServicesSlide = () => {
    setServicesSlide((prev) => (prev + 1) % services.length);
  };

  const prevServicesSlide = () => {
    setServicesSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className="w-screen overflow-x-hidden">
      <NavbarHome 
        onLoginClick={() => setShowLogin(true)} 
      />

      {/* HERO SECTION */}
      <section id="home" className="relative w-full h-screen pt-16">
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
          <div className="flex gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-white font-medium transition"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#about"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-full text-white font-medium transition backdrop-blur"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Vision & Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold mb-4 text-green-700">Vision</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To revolutionize agriculture through cutting-edge AI technology,
                creating a sustainable ecosystem where farmers thrive, resources
                are optimized, and renewable energy reshapes our future.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-700">Mission</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Provide farmers with intelligent tools for disease detection,
                crop optimization, and direct market access while building a
                thriving biofuel marketplace for sustainable energy solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY AGRIFUEL NEXUS */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why AgriFuel Nexus?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Insights",
                description:
                  "Advanced machine learning for accurate disease detection and crop recommendations",
              },
              {
                icon: "📈",
                title: "Increased Yield",
                description:
                  "Optimize your farming operations with data-driven strategies",
              },
              {
                icon: "🌱",
                title: "Sustainable Future",
                description:
                  "Connect with the biofuel market and contribute to renewable energy",
              },
              {
                icon: "💰",
                title: "Better Returns",
                description: "Direct marketplace access for fair pricing and higher profits",
              },
              {
                icon: "📱",
                title: "Easy to Use",
                description:
                  "Intuitive interface designed for farmers of all technical levels",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Enterprise-grade security for your data and transactions",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Video Gallery
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {videos.map((video) => (
              <a
                key={video.videoId}
                href={`https://youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <ArrowRight className="text-white h-8 w-8" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-bold">{video.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            About Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {member.name}
                </h3>
                <p className="text-green-700 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.contribution}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Passionate About Agriculture</h3>
            <p>
              Our team combines expertise in AI, agriculture, and sustainable
              energy to create solutions that matter.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>

          {/* All Services Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="bg-gradient-to-br from-green-400 to-blue-500 h-48 flex items-center justify-center text-white">
                  <div className="text-6xl">
                    {service.id === 1 ? "🔍" : service.id === 2 ? "💊" : "🛒"}
                  </div>
                </div>
                <div className="bg-white p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-5">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="text-green-600 font-bold">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@agrifuelnexus.com</p>
                    <p className="text-gray-600">support@agrifuelnexus.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="text-3xl">📱</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      123 Agriculture Way
                      <br />
                      Tech Valley, CA 95001
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-6">
                  <a
                    href="#"
                    className="hover:opacity-80 transition"
                    title="Facebook"
                  >
                    <div className="text-3xl">f</div>
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 transition"
                    title="Twitter"
                  >
                    <div className="text-3xl">𝕏</div>
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 transition"
                    title="LinkedIn"
                  >
                    <div className="text-3xl">in</div>
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 transition"
                    title="Instagram"
                  >
                    <div className="text-3xl">📷</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Send us a Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN SECTION */}
      <section id="login" className="py-16 bg-gradient-to-br from-green-50 to-blue-50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Get Started Today
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* BioFuel Market Login */}
            <div
              onClick={() => setShowLogin(true)}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group"
            >
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                BioFuel Marketplace
              </h3>
              <p className="text-gray-600 mb-6">
                Connect as a buyer or seller in our thriving biofuel marketplace.
                Trade sustainable energy resources with confidence.
              </p>
              <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition group-hover:translate-x-1">
                Login to Marketplace <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Dashboard Login */}
            <div
              onClick={() => setShowLogin(true)}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group"
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Farmer Dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Access your personalized dashboard to manage crops, detect diseases,
                and get AI-powered farming recommendations.
              </p>
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition group-hover:translate-x-1">
                Login to Dashboard <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <SignupModal 
        isOpen={showSignup} 
        onClose={() => {
          setShowSignup(false);
          setSignupType(null);
          setSignupUserType(null);
        }} 
        onSignupComplete={handleSignupComplete}
        initialSignupType={signupType as any}
        initialUserType={signupUserType as any}
      />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSignupClick={handleOpenSignupFromLogin}
      />
    </div>
  );
};

export default Home;
