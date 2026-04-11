import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User, LogOut, Package, Truck, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

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
      // Fetch active orders to act as notifications
      const endpoint = role === 'farmer' ? '/api/transactions/farmer/orders' : '/api/transactions/buyer/orders';
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      
      // Filter for actionable/recent items
      const activeNotifs = data.filter((order: any) => order.status === 'funds_in_escrow');
      setNotifications(activeNotifs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to securely log out?")) {
      localStorage.removeItem("af_token");
      localStorage.removeItem("af_user");
      navigate("/login");
    }
  };

  if (!user) return null;
  const isFarmer = user.role === 'farmer';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between z-50 relative">
      <div className="flex items-center space-x-6">
        <Link to={isFarmer ? "/dashboard" : "/business"} className={`text-xl font-extrabold tracking-tight ${isFarmer ? 'text-green-700' : 'text-blue-700'}`}>
          AgriFuel Nexus <span className="text-sm font-medium text-gray-500 ml-2 border-l border-gray-300 pl-2">{isFarmer ? 'Farmer Portal' : 'Corporate'}</span>
        </Link>
      </div>

      <div className="flex items-center space-x-5">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className={`relative p-2 rounded-full transition ${notifOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <Bell size={22} className="text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
                <span className="text-xs font-bold bg-gray-200 px-2 py-0.5 rounded-full">{notifications.length} New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500 font-medium">You're all caught up!</p>
                ) : (
                  notifications.map((notif: any) => (
                    <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {isFarmer ? <Truck size={16} className="text-orange-500"/> : <CheckCircle2 size={16} className="text-green-500"/>}
                        {isFarmer ? 'Buyer En Route!' : 'Pickup Pending'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {isFarmer 
                          ? `${notif.buyer?.companyDetails?.businessName} has paid for ${notif.listing?.quantity} Tons. Awaiting OTP.` 
                          : `Don't forget your OTP: ${notif.pickupOTP} for ${notif.farmer?.fullName}`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="text-gray-500 hover:text-gray-900 transition"><Settings size={22} /></button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className={`h-10 w-10 rounded-full flex items-center justify-center transition shadow-sm border-2 border-white ${isFarmer ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <User size={20} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
              </div>
              <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition">
                <User size={16} /> Profile Settings
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition border-t border-gray-100">
                <LogOut size={16} /> Secure Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}