import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Settings as SettingsIcon, User, LogOut, Globe, Leaf, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import agrifuelLogo from "@/assets/agrifuel_nexus_logo.png"
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext"; 

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Handle clicking outside the profile dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    navigate('/login');
  };

  const isFarmer = user?.role === 'farmer' || user?.userType === 'farmer';

  return (
    <nav className="bg-white border-b border-[#E5E9DF] h-16 shrink-0 flex items-center z-40 px-4 md:px-6 w-full">
      <div className="w-full flex justify-between items-center">
        
        {/* LEFT SIDE: Brand & Mobile Menu */}
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            className="md:hidden text-[#8A9A86] hover:text-[#1A2E19] p-1"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          
          <Link to={isFarmer ? "/dashboard" : "/business"} className="flex items-center gap-2">
            <div>
              <img 
                src={agrifuelLogo}
                alt="Background"
                className="h-14 w-14"
              />
            </div>
            <span className="font-black text-xl tracking-tight text-[#1A2E19] hidden sm:block">AgriFuel Nexus</span>
          </Link>

          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 text-[#8A9A86]" size={16} />
            <input 
              type="text" 
              placeholder="Search resources, market data..." 
              className="w-full lg:w-96 pl-9 pr-4 py-2 bg-[#F8FAF8] border border-[#E5E9DF] rounded-xl text-sm font-medium text-[#1A2E19] focus:outline-none focus:border-[#A3C49D] focus:bg-white transition-all placeholder:text-[#8A9A86]"
            />
          </div>
        </div>

        {/* RIGHT SIDE: Notifications & Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="text-[#8A9A86] hover:text-[#1A2E19] transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={profileMenuRef}>
            <button
              className="h-9 w-9 rounded-xl bg-[#F0F4EF] text-[#2B3A28] hover:bg-[#DCE7D5] flex items-center justify-center transition-colors border border-[#E5E9DF]"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <User size={18} />
            </button>

            {profileOpen && user && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl border border-[#E5E9DF] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-4 bg-[#F8FAF8] border-b border-[#E5E9DF]">
                  <p className="text-sm font-black text-[#1A2E19]">{user.name || user.fullName || "User"}</p>
                  <p className="text-xs text-[#5C715A] font-medium truncate mt-0.5">{user.email || user.mobile}</p>
                </div>

                {/* LANGUAGE SELECTOR */}
                <div className="px-5 py-3 border-b border-[#E5E9DF]">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={14} className="text-[#8A9A86]" />
                    <p className="text-[10px] font-black text-[#5C715A] uppercase tracking-widest">App Language</p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-xs rounded-lg focus:border-[#A3C49D] block p-2 outline-none font-bold transition-colors cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <Link to="/dashboard/settings" onClick={() => setProfileOpen(false)} className="w-full text-left px-5 py-3 text-sm font-bold text-[#2B3A28] hover:bg-[#F8FAF8] flex items-center gap-3 transition-colors border-b border-[#F4F7F4]">
                  <SettingsIcon size={16} className="text-[#8A9A86]"/> Account Settings
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm font-black text-red-600 hover:bg-[#FEF2F2] flex items-center gap-3 transition-colors">
                  <LogOut size={16} className="text-red-400"/> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}