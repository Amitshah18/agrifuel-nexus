import React, { useState, useEffect, FormEvent } from 'react';
import { Package, IndianRupee, KeyRound, CheckCircle2, Truck, AlertTriangle, Navigation, Leaf, History, PlusCircle, TrendingUp, MessageSquare, Image as ImageIcon, X } from 'lucide-react';

export default function FarmerListings() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unbookedListings, setUnbookedListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  // Form State
  const [residueType, setResidueType] = useState('');
  const [customResidue, setCustomResidue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]); 

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBenchmark = async () => {
      const typeToCheck = residueType === 'Other' ? customResidue : residueType;
      if (typeToCheck && residueType !== 'Other') {
        const state = JSON.parse(localStorage.getItem('af_user') || '{}').address?.state || "Maharashtra";
        try {
          const res = await fetch(`/api/listings/benchmark?residueType=${typeToCheck}&state=${state}`);
          const data = await res.json();
          if (data.avgPrice > 0) setBenchmark(data);
          else setBenchmark(null);
        } catch (e) { setBenchmark(null); }
      } else { setBenchmark(null); }
    };
    fetchBenchmark();
  }, [residueType, customResidue]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('af_token');
      
      const ordersRes = await fetch('/api/transactions/farmer/orders', { headers: { Authorization: `Bearer ${token}` } });
      setOrders(await ordersRes.json());

      try {
        const offersRes = await fetch('/api/transactions/offers/received', { headers: { Authorization: `Bearer ${token}` } });
        setOffers(await offersRes.json());
      } catch (e) {}

      const listingsRes = await fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } });
      const listingsData = await listingsRes.json();
      const myId = JSON.parse(localStorage.getItem('af_user') || '{}').id;
      
      const available = listingsData.filter((l: any) => l.farmer?._id === myId && l.status === 'available');
      setUnbookedListings(available);
      
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > 2) return alert("Maximum 2 images allowed.");

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateListing = async (e: FormEvent) => {
    e.preventDefault();
    const finalResidueType = residueType === 'Other' ? customResidue : residueType;
    if (!finalResidueType) return alert("Please specify the residue type.");

    setIsLocating(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const token = localStorage.getItem('af_token');
        const res = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            residueType: finalResidueType, 
            quantity: Number(quantity), 
            pricePerTon: Number(pricePerTon),
            description,
            images,
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude } 
          })
        });
        
        if (res.ok) {
          setResidueType(''); setCustomResidue(''); setQuantity(''); setPricePerTon(''); setDescription(''); setImages([]);
          alert("Listing Published Successfully!");
          fetchData();
        } else alert("Failed to create listing.");
      } catch (error) { console.error(error); } finally { setIsLocating(false); }
    }, () => { alert("Location access required."); setIsLocating(false); });
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch(`/api/transactions/offers/${offerId}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Offer ${action}ed successfully!`);
        fetchData(); 
      }
    } catch (error) { alert("Failed to process offer."); }
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
      if (res.ok) {
        alert("🎉 Success! Funds have been released to your account.");
        setOtpInput({...otpInput, [orderId]: ''});
        fetchData();
      } else alert((await res.json()).message);
    } catch (error) { alert("Verification failed."); }
  };

  const pendingOrders = orders.filter(o => o.status === 'funds_in_escrow');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOffers = offers.filter(o => o.status === 'pending');

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Loading your dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans px-4 sm:px-6">
      
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5 pt-4">
        <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100"><Leaf size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Listings & Pickups</h1>
          <p className="text-gray-500 font-medium text-sm mt-0.5">Manage marketplace listings and verify buyer pickups.</p>
        </div>
      </div>

      {/* OFFERS INBOX */}
      {pendingOffers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2"><MessageSquare className="text-blue-500" size={20}/> Incoming Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingOffers.map(offer => {
              const diff = offer.offeredPricePerTon - offer.listing?.pricePerTon;
              const isHigher = diff >= 0;
              return (
                <div key={offer._id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${isHigher ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex justify-between items-start mb-3 pl-2">
                    <p className="font-bold text-gray-900">{offer.company?.companyDetails?.businessName}</p>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded uppercase">Wants {offer.requestedQuantity}T</span>
                  </div>
                  <div className="flex items-end gap-3 mb-4 pl-2">
                    <p className="text-2xl font-black text-gray-900">₹{offer.offeredPricePerTon}</p>
                    <p className={`text-xs font-bold mb-1 ${isHigher ? 'text-green-600' : 'text-red-500'}`}>{isHigher ? '+' : ''}{diff} vs asking</p>
                  </div>
                  {offer.message && <p className="text-sm text-gray-600 italic mb-5 pl-2">"{offer.message}"</p>}
                  <div className="flex gap-3 pl-2">
                    <button onClick={() => handleOfferAction(offer._id, 'reject')} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-100 text-sm transition-all">Reject</button>
                    <button onClick={() => handleOfferAction(offer._id, 'accept')} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 shadow-sm text-sm transition-all">Accept to Escrow</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PICKUPS ARRIVING (OTP) - UI FIXED TO NEVER CUT OFF */}
      {pendingOrders.length > 0 && (
        <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-orange-800 mb-5 flex items-center gap-2">
            <AlertTriangle className="animate-pulse text-orange-500" size={20} /> Pickups Arriving
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-orange-200 flex flex-col overflow-hidden">
                <div className="p-5 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider">Awaiting OTP</span>
                      <h3 className="text-xl font-black mt-2 text-gray-900">{order.listing?.quantity} Tons of {order.listing?.residueType}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Escrow</p>
                      <p className="text-xl font-bold text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100"><Truck size={18} className="text-gray-600"/></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.buyer?.companyDetails?.businessName}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">Contact: {order.buyer?.mobile}</p>
                    </div>
                  </div>

                  {/* THE FIX: Compact, horizontal flex row that will never overflow */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Enter Driver's OTP</label>
                    <div className="flex flex-row items-center gap-3">
                      <input 
                        type="text" maxLength={6} placeholder="••••••"
                        value={otpInput[order._id] || ''}
                        onChange={(e) => setOtpInput({...otpInput, [order._id]: e.target.value.replace(/\D/g, '')})}
                        className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-gray-200 text-center text-xl font-black tracking-[0.2em] text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50"
                      />
                      <button onClick={() => handleVerifyOTP(order._id)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow-sm transition-all whitespace-nowrap">
                        Verify
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE LISTING */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="text-green-600" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Create New Listing</h2>
        </div>
        
        <form onSubmit={handleCreateListing} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Residue Type *</label>
              <select required value={residueType} onChange={(e) => {setResidueType(e.target.value); setCustomResidue('');}} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 transition-all text-sm mb-2">
                <option value="" disabled>Select Crop Waste</option>
                <option value="Rice Husk">Rice Husk</option>
                <option value="Wheat Straw">Wheat Straw</option>
                <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
                <option value="Corn Stover">Corn Stover</option>
                <option value="Other">Other (Specify)</option>
              </select>
              {residueType === 'Other' && (
                <input required type="text" value={customResidue} onChange={(e) => setCustomResidue(e.target.value)} placeholder="Type residue name..." className="w-full border border-green-300 rounded-lg px-4 py-2.5 font-semibold text-gray-900 bg-green-50/30 outline-none focus:ring-1 focus:ring-green-500 transition-all text-sm"/>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Quantity (Tons) *</label>
              <input required type="number" step="0.1" min="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 5.5" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Price (₹/Ton) *</label>
              <input required type="number" min="1" value={pricePerTon} onChange={(e) => setPricePerTon(e.target.value)} placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 text-sm"/>
              
              {benchmark && residueType !== 'Other' && (
                <div className="mt-2 bg-green-50 border border-green-100 rounded px-3 py-1.5 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={14} />
                  <p className="text-[10px] font-bold text-green-800">State Avg: ₹{benchmark.avgPrice.toFixed(0)}/t</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Add Photos (Max 2)</label>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{images.length}/2</span>
              </div>
              <div className="flex gap-3 items-start">
                {images.length < 2 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-20 w-20 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <ImageIcon className="text-gray-400 mb-1" size={16} />
                    <span className="text-[10px] font-bold text-gray-500">Upload</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                {images.map((imgSrc, index) => (
                  <div key={index} className="relative h-20 w-20 rounded-lg border border-gray-200 shadow-sm overflow-hidden group">
                    <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Description (Optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Condition, access..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-medium text-gray-800 bg-gray-50 focus:bg-white outline-none focus:ring-1 focus:ring-green-500 text-sm h-20 resize-none"></textarea>
            </div>
          </div>

          <button type="submit" disabled={isLocating} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-70 mt-2 text-sm">
            {isLocating ? "Processing..." : "Post Listing"}
          </button>
        </form>
      </div>

      {/* ACTIVE INVENTORY & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2"><Package className="text-gray-400" size={18} /> Active Market Inventory</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {unbookedListings.length === 0 ? <p className="text-center text-gray-500 text-sm py-8">No active listings.</p> : 
              unbookedListings.map(listing => (
                <div key={listing._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase">{listing.residueType}</span>
                    <p className="text-lg font-bold text-gray-900 mt-1">{listing.quantity} <span className="text-xs text-gray-500 font-medium">Tons</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Asking</p>
                    <p className="text-base font-bold text-gray-900">₹{listing.pricePerTon}<span className="text-xs text-gray-500 font-medium">/t</span></p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2"><History className="text-gray-400" size={18} /> Transaction History</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {completedOrders.length === 0 ? <p className="text-center text-gray-500 text-sm py-8">No completed transactions.</p> : 
              completedOrders.map(order => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1 mb-1"><CheckCircle2 size={12} className="text-green-600"/><span className="text-[10px] font-bold text-green-700 uppercase">Paid</span></div>
                    <p className="font-semibold text-gray-900 text-sm">{order.listing?.quantity}T {order.listing?.residueType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">+₹{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}