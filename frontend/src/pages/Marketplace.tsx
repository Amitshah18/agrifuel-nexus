import React, { useState, useEffect, FormEvent } from 'react';
import { Package, MapPin, Calendar, IndianRupee, Plus, Leaf, Navigation, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Marketplace() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listing Form State
  const [residueType, setResidueType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  
  // OTP State
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) setUser(JSON.parse(userData));
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('af_token');
      // Fetching all listings belonging to this farmer
      const res = await fetch('/api/listings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Filter to show only farmer's own listings in their dashboard
      const myData = data.filter((item: any) => item.farmer._id === JSON.parse(localStorage.getItem('af_user') || '{}').id);
      setListings(myData);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: FormEvent) => {
    e.preventDefault();
    
    // 1. Get Live Coordinates
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
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
          fetchListings();
        }
      } catch (error) {
        console.error(error);
      }
    }, () => {
      alert("Please allow location access to list your biomass.");
    });
  };

  const handleVerifyOTP = async (orderId: string, listingId: string) => {
    const submittedOtp = otpInput[listingId];
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
        alert(`Success! ${data.message}`);
        fetchListings(); // Refresh to show completed status
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Verification failed.");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="p-4 rounded-2xl bg-green-100 text-green-700"><Leaf size={32} /></div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Sell Your Biomass</h1>
          <p className="text-gray-500 font-medium mt-1">List your crop residue. Payments are secured in Escrow.</p>
        </div>
      </div>

      {/* ADD LISTING FORM */}
      <form onSubmit={handleCreateListing} className="bg-white border border-green-100 shadow-sm rounded-3xl p-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Residue Type</label>
          <select required value={residueType} onChange={(e) => setResidueType(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-medium bg-gray-50 outline-none focus:ring-2 focus:ring-green-500">
            <option value="">Select Crop Waste</option>
            <option value="Rice Husk">Rice Husk</option>
            <option value="Wheat Straw">Wheat Straw</option>
            <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Quantity (Tons)</label>
          <input required type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-medium bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"/>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-bold text-gray-700 mb-2">Price (per Ton)</label>
          <input required type="number" value={pricePerTon} onChange={(e) => setPricePerTon(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-medium bg-gray-50 outline-none focus:ring-2 focus:ring-green-500"/>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 h-[50px]">
          <Navigation size={20} /> Use My Location & List
        </button>
      </form>

      {/* MY LISTINGS & PENDING PICKUPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg text-xs uppercase">{listing.residueType}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${listing.status === 'booked' ? 'bg-orange-100 text-orange-800' : listing.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  {listing.status}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-gray-900">{listing.quantity}</span>
                <span className="text-gray-500 font-bold mb-1">Tons</span>
              </div>
            </div>

            {/* OTP Verification Section (Only if Booked) */}
            {listing.status === 'booked' && (
              <div className="p-6 bg-orange-50 border-t border-orange-100 flex-1">
                <h4 className="font-extrabold text-orange-900 mb-2 flex items-center gap-2"><KeyRound size={18}/> Truck Arriving!</h4>
                <p className="text-sm text-orange-800 mb-4 font-medium">Ask the driver for the 6-digit OTP to release your ₹{(listing.quantity * listing.pricePerTon).toLocaleString()} from escrow.</p>
                <div className="flex gap-2">
                  <input 
                    type="text" maxLength={6} placeholder="Enter OTP"
                    value={otpInput[listing._id] || ''}
                    onChange={(e) => setOtpInput({...otpInput, [listing._id]: e.target.value})}
                    className="flex-1 px-4 py-2 rounded-lg border border-orange-200 text-center text-lg font-bold tracking-widest outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button onClick={() => handleVerifyOTP("ORDER_ID_HERE", listing._id)} className="bg-orange-600 text-white font-bold px-4 rounded-lg hover:bg-orange-700">Verify</button>
                </div>
              </div>
            )}

            {listing.status === 'completed' && (
              <div className="p-6 bg-green-50 flex-1 flex items-center justify-center gap-2">
                <CheckCircle2 className="text-green-600" />
                <span className="font-extrabold text-green-800">Funds Released</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}