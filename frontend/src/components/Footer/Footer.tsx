import { Heart } from "lucide-react";
import "./Footer.css";

interface FooterProps {}

export default function Footer({}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About Us */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="logo-icon bg-gradient-to-r from-green-400 to-blue-500 rounded px-2 py-1 text-white font-bold">
                A
              </div>
              <h3 className="text-xl font-bold">AgriFuel Nexus</h3>
            </div>
            <p className="text-gray-300">
              Revolutionizing agriculture with AI-powered insights and sustainable
              marketplace solutions for the modern farmer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Access</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#home" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-green-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-green-400 transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-green-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#login" className="hover:text-green-400 transition">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">📧</span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm">contact@agrifuelnexus.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">📱</span>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm">+1 (555) 123-4567</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <p className="text-gray-300 mb-4">Connect with us on social media</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition"
                title="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition"
                title="LinkedIn"
              >
                in
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition"
                title="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} AgriFuel Nexus. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-green-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-400 transition">
              Cookie Policy
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            Made with <Heart className="h-4 w-4 text-red-500" /> for farmers
          </div>
        </div>
      </div>
    </footer>
  );
}
