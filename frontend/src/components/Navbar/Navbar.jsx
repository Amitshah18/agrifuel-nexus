import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
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

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="text-gray-600 hover:text-green-700"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User size={22} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
