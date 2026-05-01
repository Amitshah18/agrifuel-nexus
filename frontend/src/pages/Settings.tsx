import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Save, ShieldCheck, MapPin, Lock, Bell, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';

export default function Settings() {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  
  // Editable form state
  const [formData, setFormData] = useState({
    fullName: '',
    state: '',
    district: '',
    emailAlerts: true,
    smsAlerts: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Pre-fill the editable fields
      setFormData({
        fullName: parsedUser.name || parsedUser.fullName || '',
        state: parsedUser.address?.state || '',
        district: parsedUser.address?.district || parsedUser.address?.village || '',
        emailAlerts: parsedUser.preferences?.emailAlerts ?? true,
        smsAlerts: parsedUser.preferences?.smsAlerts ?? true,
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await api.put('/api/users/profile', {
        fullName: formData.fullName,
        address: {
          state: formData.state,
          district: formData.district,
          ...user.address 
        },
        preferences: {
          emailAlerts: formData.emailAlerts,
          smsAlerts: formData.smsAlerts
        }
      });

      // Update local storage and state with the fresh database data
      localStorage.setItem('af_user', JSON.stringify(updatedUser.user || updatedUser));
      setUser(updatedUser.user || updatedUser);
      alert("Settings saved successfully!");

    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const isBuyer = user?.role === 'buyer' || user?.userType === 'buyer';

  // Dynamic Theme Classes
  const theme = {
    header: isBuyer ? 'text-zinc-900' : 'text-[#1A2E19]',
    subHeader: isBuyer ? 'text-zinc-500' : 'text-[#5C715A]',
    cardBorder: isBuyer ? 'border-zinc-300' : 'border-[#E5E9DF]',
    sectionBg: isBuyer ? 'bg-zinc-50/50 border-zinc-200' : 'bg-[#F8FAF8] border-[#F4F7F4]',
    avatarBg: isBuyer ? 'bg-white border-zinc-300 text-zinc-700 shadow-sm' : 'bg-[#E5F0E1] border-[#DCE7D5] text-[#16a34a]',
    label: isBuyer ? 'text-zinc-800' : 'text-[#2B3A28]',
    icon: isBuyer ? 'text-zinc-500' : 'text-[#5C715A]',
    // Improved input borders for business side ensuring high visibility
    input: isBuyer 
      ? 'bg-white border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 text-zinc-900 shadow-sm' 
      : 'bg-[#F8FAF8] border-[#E5E9DF] focus:border-[#A3C49D] text-[#1A2E19]',
    disabledInput: isBuyer 
      ? 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed opacity-80'
      : 'bg-[#F0F4EF] border-[#E5E9DF] text-[#8A9A86] cursor-not-allowed opacity-80',
    button: isBuyer 
      ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
      : 'bg-[#1A2E19] hover:bg-[#2B3A28] text-white',
    buttonIcon: isBuyer ? 'text-zinc-400' : 'text-[#A3C49D]',
    shield: isBuyer ? 'text-blue-600' : 'text-[#16a34a]',
    divider: isBuyer ? 'border-zinc-200' : 'border-[#F4F7F4]',
    radius: isBuyer ? 'rounded-2xl' : 'rounded-[2rem]',
    toggleBg: isBuyer ? 'peer-checked:bg-zinc-900' : 'peer-checked:bg-[#16a34a]',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className={`text-3xl font-black tracking-tight ${theme.header}`}>Account Settings</h1>
        <p className={`font-medium text-sm mt-1 ${theme.subHeader}`}>Manage your personal profile and system configurations.</p>
      </div>

      <div className={`bg-white ${theme.radius} shadow-sm border ${theme.cardBorder} overflow-hidden`}>
        
        {/* Profile Header Block */}
        <div className={`p-6 md:p-8 border-b flex items-center gap-5 ${theme.sectionBg}`}>
          <div className={`h-20 w-20 rounded-2xl flex items-center justify-center border ${theme.avatarBg}`}>
            <User size={32} />
          </div>
          <div>
            <h2 className={`text-2xl font-black ${theme.header}`}>{user.name || user.fullName || "User Profile"}</h2>
            <div className={`flex items-center gap-1.5 mt-1 text-sm font-bold ${theme.subHeader}`}>
              <ShieldCheck size={16} className={theme.shield} /> Identity Verified
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* General Info */}
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.subHeader}`}>Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-bold mb-2 flex items-center gap-2 ${theme.label}`}>
                  <User size={14} className={theme.icon}/> Full Name
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors border ${theme.input}`} 
                />
              </div>
              
              {/* LOCKED FIELD: Mobile */}
              <div>
                <label className={`block text-xs font-bold mb-2 flex justify-between items-center ${theme.label}`}>
                  <span className="flex items-center gap-2"><Phone size={14} className={theme.icon}/> Mobile Number</span>
                  <Lock size={12} className={theme.icon} />
                </label>
                <input 
                  type="text" 
                  disabled
                  value={user.mobile || ''} 
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border ${theme.disabledInput}`} 
                />
              </div>
              
              {/* LOCKED FIELD: Email */}
              <div className="md:col-span-2">
                <label className={`block text-xs font-bold mb-2 flex justify-between items-center ${theme.label}`}>
                  <span className="flex items-center gap-2"><Mail size={14} className={theme.icon}/> Email Address</span>
                  <Lock size={12} className={theme.icon} />
                </label>
                <input 
                  type="email" 
                  disabled
                  value={user.email || ''} 
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border ${theme.disabledInput}`} 
                />
              </div>
            </div>
          </div>

          <hr className={theme.divider} />

          {/* Location Info */}
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.subHeader}`}>Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-bold mb-2 flex items-center gap-2 ${theme.label}`}>
                  <MapPin size={14} className={theme.icon}/> State
                </label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state} 
                  onChange={handleChange}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors border ${theme.input}`} 
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-2 flex items-center gap-2 ${theme.label}`}>
                  <Building2 size={14} className={theme.icon}/> District / Village
                </label>
                <input 
                  type="text" 
                  name="district"
                  value={formData.district} 
                  onChange={handleChange}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors border ${theme.input}`} 
                />
              </div>
            </div>
          </div>

          <hr className={theme.divider} />

          {/* NEW FEATURE: System Preferences */}
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme.subHeader}`}>System Preferences</h3>
            <div className="space-y-4">
              
              <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-transparent hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isBuyer ? 'bg-zinc-100' : 'bg-[#F0F4EF]'}`}><Bell size={16} className={theme.icon} /></div>
                  <div>
                    <p className={`text-sm font-bold ${theme.header}`}>Email Notifications</p>
                    <p className={`text-xs font-medium ${theme.subHeader}`}>Receive market updates and order alerts via email.</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="emailAlerts" checked={formData.emailAlerts} onChange={handleChange} className="sr-only peer" />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme.toggleBg}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-transparent hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isBuyer ? 'bg-zinc-100' : 'bg-[#F0F4EF]'}`}><Smartphone size={16} className={theme.icon} /></div>
                  <div>
                    <p className={`text-sm font-bold ${theme.header}`}>SMS Alerts</p>
                    <p className={`text-xs font-medium ${theme.subHeader}`}>Get critical OTPs and pickup notifications via text.</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="smsAlerts" checked={formData.smsAlerts} onChange={handleChange} className="sr-only peer" />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${theme.toggleBg}`}></div>
                </div>
              </label>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm text-sm ${theme.button}`}
            >
              {loading ? "Saving Data..." : <><Save size={16} className={theme.buttonIcon}/> Save Changes</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}