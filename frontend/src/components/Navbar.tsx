import React, { useState } from "react";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Re-verify intent
    const confirmLogout = window.confirm("Are you sure you want to securely log out?");
    
    if (confirmLogout) {
      // 2. Destroy credentials
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      // 3. Redirect to login
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between z-50 relative">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <a href="/" className="text-xl font-extrabold text-green-700 tracking-tight">
          AgriFuel Nexus
        </a>
      </div>
      
      {/* Quick Links */}
      <div className="hidden md:flex space-x-10 items-center justify-between">
        <a href="/" className="text-gray-600 font-medium hover:text-green-700 transition">Home</a>
        <a href="/about" className="text-gray-600 font-medium hover:text-green-700 transition">About</a>
        <a href="/innovation" className="text-gray-600 font-medium hover:text-green-700 transition">Innovation</a>
      </div>

      {/* Middle Section: Search */}
      <div className="relative hidden md:block w-1/3">
        <input
          type="text"
          placeholder="Search crop residues, advisory..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-sm"
        />
        <Search className="absolute left-4 top-3 text-gray-400" size={18} />
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-5">
        <button className="text-gray-500 hover:text-gray-900 transition">
          <Bell size={22} />
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition">
          <Settings size={22} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200 transition"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User size={20} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">My Account</p>
              </div>
              <button 
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <User size={16} /> Profile Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition border-t border-gray-100"
              >
                <LogOut size={16} /> Secure Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}