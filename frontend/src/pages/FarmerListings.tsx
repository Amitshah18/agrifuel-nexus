import React, { useState, useEffect, FormEvent } from 'react';
import { Package, IndianRupee, CheckCircle2, Truck, AlertTriangle, Navigation, Leaf, History, PlusCircle } from 'lucide-react';

export default function FarmerListings() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unbookedListings, setUnbookedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  const [residueType, setResidueType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('af_token');
      const ordersRes = await fetch('/api/transactions/farmer/orders', { headers: { Authorization: `Bearer ${token}` } });
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const listingsRes = await fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } });
      const listingsData = await listingsRes.json();
      const myId = JSON.parse(localStorage.getItem('af_user') || '{}').id;
      
      const available = listingsData.filter((l: any) => l.farmer._id === myId && l.status === 'available');
      setUnbookedListings(available);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: FormEvent) => {
    e.preventDefault();
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const token = localStorage.getItem('af_token');
        const res = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            residueType, 
            quantity: Number(quantity), 
            pricePerTon: Number(pricePerTon),
            coordinates: { lat: latitude, lng: longitude } 
          })
        });
        
        if (res.ok) {
          setResidueType(''); setQuantity(''); setPricePerTon('');
          fetchData();
        } else {
          alert("Failed to create listing.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert("Please allow location access to list your biomass.");
      setIsLocating(false);
    });
  };

  const handleVerifyOTP = async (orderId: string) => {
    const submittedOtp = otpInput[orderId];
    if (!submittedOtp || submittedOtp.length !== 6) return alert("Enter a valid 6-digit OTP");

    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId, submittedOtp })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("🎉 Success! Funds have been released to your account.");
        setOtpInput({...otpInput, [orderId]: ''});
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Verification failed.");
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'funds_in_escrow');
  const completedOrders = orders.filter(o => o.status === 'completed');

  if (loading) return <div className="p-10 text-center font-medium text-gray-500 animate-pulse">Loading your inventory...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
          <Leaf size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Listings & Pickups</h1>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage marketplace listings and verify buyer pickups.</p>
        </div>
      </div>

      {/* ZONE 1: CRITICAL ACTION REQUIRED (OTP) */}
      {pendingOrders.length > 0 && (
        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <h2 className="text-base font-bold text-orange-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="animate-pulse text-orange-500" size={18} /> Pickups Arriving
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingOrders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-5 flex-1 flex flex-col">
                  
                  {/* Order Top Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider">Awaiting OTP</span>
                      <h3 className="text-lg font-bold mt-2 text-gray-900">{order.listing?.quantity} Tons of {order.listing?.residueType}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Escrow</p>
                      <p className="text-xl font-bold text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 mb-5 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100"><Truck size={16} className="text-gray-600"/></div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{order.buyer?.companyDetails?.businessName || 'Corporate Buyer'}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Contact: {order.buyer?.mobile}</p>
                    </div>
                  </div>

                  {/* OTP Input Group - VERTICAL STACK & RESPONSIVE WIDTH */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                      Enter 6-Digit Driver OTP
                    </label>
                    <div className="flex flex-col gap-3">
                      <input 
                        type="text" 
                        maxLength={6} 
                        placeholder="••••••"
                        value={otpInput[order._id] || ''}
                        onChange={(e) => setOtpInput({...otpInput, [order._id]: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-center text-lg font-bold tracking-[0.2em] text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-gray-50 focus:bg-white shadow-inner"
                      />
                      <button 
                        onClick={() => handleVerifyOTP(order._id)} 
                        disabled={!otpInput[order._id] || otpInput[order._id].length !== 6}
                        className="w-full bg-orange-600 disabled:bg-orange-300 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-all active:scale-[0.98]"
                      >
                        Verify & Release Funds
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZONE 2: CREATE LISTING */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="text-green-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Create New Listing</h2>
        </div>
        
        <form onSubmit={handleCreateListing} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Residue Type</label>
              <div className="relative">
                <Package className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <select required value={residueType} onChange={(e) => setResidueType(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 transition-all appearance-none text-sm">
                  <option value="" disabled>Select Crop Waste</option>
                  <option value="Rice Husk">Rice Husk</option>
                  <option value="Wheat Straw">Wheat Straw</option>
                  <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
                  <option value="Corn Stover">Corn Stover</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Quantity (Tons)</label>
              <input required type="number" step="0.1" min="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 5.5" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 transition-all text-sm"/>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Price (₹/Ton)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-3 text-gray-400" size={16} />
                <input required type="number" min="1" value={pricePerTon} onChange={(e) => setPricePerTon(e.target.value)} placeholder="0.00" className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 transition-all text-sm"/>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLocating}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isLocating ? (
              <span className="animate-pulse">Fetching GPS...</span>
            ) : (
              <><Navigation size={16} /> Attach Location & Post to Market</>
            )}
          </button>
        </form>
      </div>

      {/* ZONE 3: INVENTORY & HISTORY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Market Inventory */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Package className="text-gray-400" size={18} /> Active Market Inventory
          </h2>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {unbookedListings.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-sm">No active listings.</p>
              </div>
            ) : (
              unbookedListings.map(listing => (
                <div key={listing._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wide">{listing.residueType}</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{listing.quantity} <span className="text-xs text-gray-500 font-medium">Tons</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Asking</p>
                    <p className="text-base font-bold text-gray-900">₹{listing.pricePerTon}<span className="text-xs text-gray-500 font-medium">/t</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <History className="text-gray-400" size={18} /> Transaction History
          </h2>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {completedOrders.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-sm">No completed transactions yet.</p>
              </div>
            ) : (
              completedOrders.map(order => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <CheckCircle2 size={12} className="text-green-600"/>
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Paid</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{order.listing?.quantity}T {order.listing?.residueType}</p>
                    <p className="text-[10px] font-medium text-gray-500 mt-0.5 truncate max-w-[150px]">To: {order.buyer?.companyDetails?.businessName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+₹{order.totalAmount.toLocaleString()}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{new Date(order.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}