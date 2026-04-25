import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
  onLogout?: () => void;
  onMenuClick?: () => void;
}

export default function Navbar({ onLogout, onMenuClick }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left Section: Logo + Links */}
      <div className="flex items-center space-x-6">
        <a href="/dashboard" className="text-xl font-bold text-green-700">
          AgriFuel Nexus
        </a>
        
      </div>
      <div className="relative w-1 shadow-md space-x-10 flex items-center justify-between">
        <a href="/dashboard" className="text-gray-700 hover:text-green-700">
          Dashboard
        </a>
        <a href="/crops" className="text-gray-700 hover:text-green-700">
          My Crops
        </a>
        <a href="/marketplace" className="text-gray-700 hover:text-green-700">
          Marketplace
        </a>
      </div>

      {/* Middle Section: Search */}
      <div className="relative left-25 w-2/5">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-5 relative">
        <button className="text-gray-600 hover:text-green-700">
          <Bell size={22} />
        </button>
        <button className="text-gray-600 hover:text-green-700">
          <Settings size={22} />
        </button>

        {/* Profile Menu */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition"
        >
          <User size={20} />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-50">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
              <User size={18} />
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2 border-t"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
