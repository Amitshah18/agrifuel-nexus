import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User, LogOut, Globe, Leaf } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext"; 

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Bring in the global language state
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchNotifications(parsedUser.role);
    }
  }, []);

  const fetchNotifications = async (role: string) => {
    try {
      const token = localStorage.getItem('af_token');
      const endpoint = role === 'farmer' ? '/api/transactions/farmer/orders' : '/api/transactions/buyer/orders';
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const activeNotifs = data.filter((order: any) => order.status === 'funds_in_escrow');
        setNotifications(activeNotifs);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    navigate('/login');
  };

  const isFarmer = user?.role === 'farmer' || user?.userType === 'farmer';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT SIDE: Logo & Search */}
          <div className="flex items-center gap-8">
            <Link to={isFarmer ? "/dashboard" : "/business"} className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900 hidden sm:block">AgriFuel Nexus</span>
            </Link>

            <div className="hidden md:flex relative items-center">
              <Search className="absolute left-3 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search resources, buyers..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all w-64 lg:w-96"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Notifications & Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2 text-gray-400 hover:text-gray-600 transition relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className={`h-10 w-10 rounded-full flex items-center justify-center transition shadow-sm border-2 border-white ${isFarmer ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <User size={20} />
              </button>

              {profileOpen && user && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
                  </div>

                  {/* LANGUAGE SELECTOR */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={16} className="text-gray-400" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">App Language</p>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none font-medium transition-colors cursor-pointer"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                    <Settings size={16} /> Profile Settings
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}