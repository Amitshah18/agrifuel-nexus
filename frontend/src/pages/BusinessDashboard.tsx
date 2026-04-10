import React, { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, IndianRupee, Phone, Building2, Truck, Leaf, ShieldCheck, Map } from 'lucide-react';

export default function BusinessDashboard() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) setUser(JSON.parse(userData));
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAndPay = async () => {
    if (!pickupDate) return alert("Select a pickup date");
    
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: selectedListing._id, pickupDate })
      });
      const data = await res.json();
      
      if (res.ok) {
        setBookingSuccess(data); // Shows the success modal with OTP
        setSelectedListing(null);
        fetchListings(); // Refresh feed
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Payment processing failed.");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading...</div>;

  return (
    <div className="space-y-8 relative">
      {/* Promotional Info Slider */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 opacity-10"><Leaf size={200} /></div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 inline-block">Govt Initiative 2026</span>
          <h2 className="text-2xl md:text-3xl font-black mb-2">Stop Stubble Burning. Start Earning.</h2>
          <p className="text-green-50 font-medium leading-relaxed mb-6">
            Subsidies are now available for farmers selling over 10 Tons of crop residue. Secure your deals through AgriFuel Nexus to automatically qualify.
          </p>
          <button className="bg-white text-green-800 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition">Learn More</button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Procurement Center</h1>
          <p className="text-gray-500 font-medium mt-2 flex items-center gap-2"><Building2 size={18} /> Sorted by nearest available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">{listing.residueType}</span>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-black text-gray-900">{listing.quantity}</span>
                <span className="text-gray-500 font-bold">Tons</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center text-gray-700">
                <MapPin size={18} className="text-gray-400 mr-3" />
                <span className="font-medium text-sm">{listing.location.village}, {listing.location.district}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <IndianRupee size={18} className="text-gray-400 mr-3" />
                <span className="font-bold text-gray-900">₹{listing.pricePerTon.toLocaleString()} <span className="text-gray-500 font-medium text-sm">/ ton</span></span>
              </div>
            </div>

            <div className="p-4 bg-gray-900 flex justify-between items-center mt-auto group-hover:bg-blue-700 transition-colors">
              <button 
                onClick={() => setSelectedListing(listing)}
                className="w-full bg-white text-gray-900 font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                Secure in Escrow <ShieldCheck size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Checkout</h2>
            <p className="text-gray-600 font-medium mb-6">Funds will be held securely in escrow until pickup is complete.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <div className="flex justify-between mb-2"><span className="text-gray-500 font-bold">Amount:</span><span className="font-black text-lg">₹{(selectedListing.quantity * selectedListing.pricePerTon).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">Farmer:</span><span className="font-bold">{selectedListing.farmer.fullName}</span></div>
            </div>

            <label className="block text-sm font-bold text-gray-700 mb-2">Schedule Pickup Date</label>
            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-medium mb-6 outline-none focus:ring-2 focus:ring-blue-500"/>
            
            <div className="flex gap-4">
              <button onClick={() => setSelectedListing(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleBookAndPay} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Pay & Book</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS & OTP MODAL */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-t-8 border-t-blue-500">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck size={32}/></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Secured!</h2>
            <p className="text-gray-600 font-medium mb-6">Give this OTP to the farmer when you arrive to release the funds.</p>
            
            <div className="bg-gray-900 text-white py-4 rounded-2xl mb-6 shadow-inner text-4xl font-black tracking-[0.2em]">
              {bookingSuccess.pickupOTP}
            </div>

            <div className="text-left bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="font-bold text-blue-900 mb-1 flex items-center gap-2"><Phone size={16}/> {bookingSuccess.farmerDetails.mobile}</p>
              <p className="font-medium text-blue-800 text-sm">{bookingSuccess.farmerDetails.village}</p>
            </div>

            <div className="flex gap-4">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${bookingSuccess.farmerDetails.coordinates.lat},${bookingSuccess.farmerDetails.coordinates.lng}`}
                target="_blank" rel="noreferrer"
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Map size={18}/> View Map
              </a>
              <button onClick={() => setBookingSuccess(null)} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}