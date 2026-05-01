import React, { useState, useEffect, FormEvent } from 'react';
import { Package, TrendingUp, Image as ImageIcon, X, PlusCircle, KeyRound, AlertTriangle, Loader2, Sparkles, Trash2, Camera, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../lib/api'; 

export default function Marketplace() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listing Form State
  const [residueType, setResidueType] = useState('');
  const [customResidue, setCustomResidue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  // Hero Carousel State & Data (5 High Quality Images)
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const marketNews = [
    {
      tag: "Market Insight",
      tagColor: "text-[#1A2E19] bg-white",
      title: "High Demand for Rice Husk",
      desc: "Biofuel refineries in your state are actively buying. List your inventory now to lock in premium prices before the harvest season ends.",
      img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a8803?auto=format&fit=crop&q=80&w=1200"
    },
    {
      tag: "Govt Subsidy",
      tagColor: "text-white bg-orange-500",
      title: "New Stubble Incentive",
      desc: "Earn an extra ₹500/ton for Wheat Straw processing. Ensure your GSTIN is updated in your profile settings to qualify.",
      img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a8803?auto=format&fit=crop&q=80&w=1200"
    },
    {
      tag: "Trend Alert",
      tagColor: "text-white bg-[#16a34a]",
      title: "Sugarcane Bagasse Peak",
      desc: "Post-harvest season has reduced supply. Prices are up 12% this week. This is the optimal time to secure a buyer.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
    },
    {
      tag: "Logistics Update",
      tagColor: "text-white bg-blue-500",
      title: "Free Transport Weekend",
      desc: "Partner refineries are offering free farm-gate pickup for listings over 10 Tons this coming weekend.",
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200"
    },
    {
      tag: "Crop Health",
      tagColor: "text-white bg-purple-500",
      title: "Protect Your Biomass",
      desc: "Heavy rains predicted. Ensure your harvested residue is covered to prevent rot and maintain its market value.",
      img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  // Initialize User & Carousel
  useEffect(() => {
    const userData = localStorage.getItem('af_user');
    if (userData) setUser(JSON.parse(userData));
    fetchListings();

    const intervalId = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % marketNews.length);
    }, 5000); 

    return () => clearInterval(intervalId);
  }, []);

  // Fetch Dynamic Benchmark
  useEffect(() => {
    const fetchBenchmark = async () => {
      const typeToCheck = residueType === 'Other' ? customResidue : residueType;
      if (typeToCheck && residueType !== 'Other') {
        const state = JSON.parse(localStorage.getItem('af_user') || '{}').address?.state || "Maharashtra";
        try {
          const data = await api.get(`/api/listings/benchmark?residueType=${typeToCheck}&state=${state}`);
          if (data.avgPrice > 0) setBenchmark(data);
          else setBenchmark(null);
        } catch (e) { setBenchmark(null); }
      } else { setBenchmark(null); }
    };
    fetchBenchmark();
  }, [residueType, customResidue]);

  // Centralized Fetch logic
  const fetchListings = async () => {
    try {
      const data = await api.get('/api/listings');
      const myId = JSON.parse(localStorage.getItem('af_user') || '{}').id;
      const myData = data.filter((item: any) => item.farmer._id === myId);
      
      // Sort: Booked first, then available, then completed
      myData.sort((a: any, b: any) => {
        const weight = { 'booked': 1, 'available': 2, 'completed': 3 };
        return (weight[a.status as keyof typeof weight] || 4) - (weight[b.status as keyof typeof weight] || 4);
      });
      
      setListings(myData);
    } catch (error) {
      console.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > 2) return alert("Maximum 2 images allowed.");

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
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
      const { latitude, longitude } = position.coords;

      try {
        await api.post('/api/listings', { 
          residueType: finalResidueType, 
          quantity: Number(quantity), 
          pricePerTon: Number(pricePerTon),
          description,
          images,
          coordinates: { lat: latitude, lng: longitude } 
        });
        
        setResidueType(''); setCustomResidue(''); setQuantity(''); setPricePerTon(''); setDescription(''); setImages([]);
        alert("Listing Published Successfully!");
        fetchListings();
      } catch (error: any) {
        alert(error.message || "Failed to create listing.");
      } finally {
        setIsLocating(false);
      }
    }, () => {
      alert("Please allow location access to list your biomass.");
      setIsLocating(false);
    });
  };

  // Optimistic UI Delete
  const handleDeleteListing = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this listing? This cannot be undone.")) return;
    
    // 1. Immediately hide it from UI for a snappy feel
    setListings(prev => prev.filter(l => l._id !== id));

    // 2. Process in background
    try {
      await api.delete(`/api/listings/${id}`);
    } catch (error: any) {
      console.error("Delete Error:", error);
      alert("Backend API Failed. Please ensure your backend DELETE route is running.");
      // 3. If backend fails, put the item back on the screen
      fetchListings(); 
    }
  };

  const handleVerifyOTP = async (orderId: string, listingId: string) => {
    const submittedOtp = otpInput[listingId];
    if (!submittedOtp || submittedOtp.length !== 6) return alert("Enter a valid 6-digit OTP");

    try {
      await api.post('/api/transactions/verify-otp', { orderId, submittedOtp });
      alert(`Success! Funds released to your account.`);
      setOtpInput(prev => ({ ...prev, [listingId]: '' }));
      fetchListings(); 
    } catch (error: any) {
      alert(error.message || "Verification failed.");
    }
  };

  // Filter listings based on status
  const availableListings = listings.filter(l => l.status === 'available');
  const bookedListings = listings.filter(l => l.status === 'booked');

  if (loading) return <div className="p-10 text-center font-bold text-[#8A9A86] animate-pulse">Loading Marketplace...</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full font-sans antialiased bg-[#F4F7F4] p-1 md:p-2 pb-12">
      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {/* HEADER */}
        <div className="px-2 pt-2 flex justify-between items-end mb-2">
          <div>
            <h1 className="text-3xl font-black text-[#1A2E19] tracking-tight">Marketplace</h1>
            <p className="text-[#5C715A] font-medium text-xs mt-0.5">List your biomass and secure payments via Escrow.</p>
          </div>
        </div>

        {/* HERO / NEWS BANNER - PERFECTED VISIBILITY */}
        <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-[#E5E9DF] relative min-h-[220px] bg-black">
          {marketNews.map((news, idx) => (
            <div 
              key={idx} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {/* Image fully covers the box */}
              <img src={news.img} alt="Farming Banner" className="absolute inset-0 w-full h-full object-cover opacity-80" loading="eager" />
              
              {/* Deep dark gradient strictly for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d170c]/90 via-[#0d170c]/50 to-transparent"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-center p-8 max-w-2xl">
                <span className={`${news.tagColor} px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase mb-3 inline-block shadow-sm w-max`}>
                  {news.tag}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight tracking-tight">{news.title}</h2>
                <p className="text-gray-200 font-medium text-sm max-w-md leading-relaxed">
                  {news.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Slider Dots */}
          <div className="absolute bottom-5 left-8 z-20 flex gap-1.5">
            {marketNews.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentHeroIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroIdx ? 'w-6 bg-[#16a34a]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ==================================================== */}
          {/* LEFT: CREATE LISTING FORM (5 Cols)                   */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E5E9DF] sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#E5F0E1] p-2 rounded-xl text-[#16a34a]"><PlusCircle size={20} /></div>
              <h2 className="text-lg font-black text-[#1A2E19]">Create Listing</h2>
            </div>
            
            <form onSubmit={handleCreateListing} className="space-y-5">
              
              {/* Residue Type */}
              <div>
                <label className="block text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-2">Residue Type *</label>
                <select required value={residueType} onChange={(e) => {setResidueType(e.target.value); setCustomResidue('');}} className="w-full bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3C49D] transition-colors cursor-pointer appearance-none">
                  <option value="" disabled>Select Crop Waste</option>
                  <option value="Rice Husk">Rice Husk</option>
                  <option value="Wheat Straw">Wheat Straw</option>
                  <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
                  <option value="Corn Stover">Corn Stover</option>
                  <option value="Other">Other (Specify)</option>
                </select>
                {residueType === 'Other' && (
                  <input required type="text" value={customResidue} onChange={(e) => setCustomResidue(e.target.value)} placeholder="Type residue name..." className="w-full mt-2 bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3C49D] transition-colors"/>
                )}
              </div>

              {/* Grid: Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-2">Quantity (Tons) *</label>
                  <input required type="number" step="0.1" min="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0.0" className="w-full bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3C49D] transition-colors"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-2">Price (₹/Ton) *</label>
                  <input required type="number" min="1" value={pricePerTon} onChange={(e) => setPricePerTon(e.target.value)} placeholder="0" className="w-full bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3C49D] transition-colors"/>
                </div>
              </div>

              {/* Dynamic Benchmark Alert */}
              {benchmark && residueType !== 'Other' && (
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-[#16a34a]" size={16} />
                    <span className="text-xs font-bold text-[#15803d]">State Average Price</span>
                  </div>
                  <span className="text-xs font-black text-[#14532d]">₹{benchmark.avgPrice.toFixed(0)}/t</span>
                </div>
              )}

              {/* Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black text-[#8A9A86] uppercase tracking-widest">Photos (Max 2)</label>
                  <span className="text-[10px] font-bold text-[#8A9A86] bg-[#F4F7F4] px-2 py-0.5 rounded">{images.length}/2</span>
                </div>
                <div className="flex gap-3">
                  {images.length < 2 && (
                    <label className="border-2 border-dashed border-[#A3C49D] rounded-xl h-20 w-20 bg-[#F8FAF8] hover:bg-[#F0F4EF] flex flex-col items-center justify-center text-center cursor-pointer transition-colors shrink-0">
                      <Camera className="text-[#A3C49D] mb-1" size={20} />
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                  {images.map((imgSrc, index) => (
                    <div key={index} className="relative h-20 w-20 rounded-xl border border-[#E5E9DF] shadow-sm overflow-hidden group shrink-0">
                      <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-[#8A9A86] uppercase tracking-widest mb-2">Notes (Optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add specific details, accessibility..." className="w-full bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] text-sm font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-[#A3C49D] transition-colors h-20 resize-none"></textarea>
              </div>

              <button type="submit" disabled={isLocating} className="w-full bg-[#1A2E19] hover:bg-[#2B3A28] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-green-900/10 transition-all active:scale-[0.98] disabled:opacity-70 text-sm">
                {isLocating ? <><Loader2 size={18} className="animate-spin text-[#A3C49D]"/> Fetching Location...</> : <><Sparkles size={18} className="text-[#A3C49D]"/> Publish to Market</>}
              </button>
            </form>
          </div>

          {/* ==================================================== */}
          {/* RIGHT: LISTINGS & ESCROW (7 Cols)                    */}
          {/* ==================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. BOOKED / PENDING PICKUPS (Action Required) */}
            {bookedListings.length > 0 && (
              <div className="bg-orange-50/50 border border-orange-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <AlertTriangle size={20} className="text-orange-600 animate-pulse" />
                  <h2 className="text-lg font-black text-orange-900">Pending Pickups</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookedListings.map((listing) => (
                    <div key={listing._id} className="bg-white rounded-2xl border border-orange-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Escrow Locked</span>
                        </div>
                        <h3 className="text-xl font-black text-[#1A2E19] mb-1">{listing.quantity} Tons of {listing.residueType}</h3>
                        <p className="text-[10px] font-bold text-[#8A9A86] uppercase tracking-widest">₹{(listing.quantity * listing.pricePerTon).toLocaleString()} secured</p>
                      </div>
                      <div className="p-4 bg-orange-100/50 border-t border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <KeyRound size={14} className="text-orange-600"/>
                          <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Verify Driver OTP</p>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" maxLength={6} placeholder="••••••"
                            value={otpInput[listing._id] || ''}
                            onChange={(e) => setOtpInput({...otpInput, [listing._id]: e.target.value.replace(/\D/g, '')})}
                            className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-orange-200 text-center text-sm font-black tracking-[0.2em] text-orange-900 outline-none focus:border-orange-500 bg-white"
                          />
                          <button 
                            onClick={() => handleVerifyOTP("ORDER_ID_HERE", listing._id)} 
                            className="bg-orange-600 text-white font-black px-4 rounded-xl hover:bg-orange-700 transition-colors shadow-sm text-xs"
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ACTIVE MARKET INVENTORY */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-[#1A2E19]" />
                  <h2 className="text-lg font-black text-[#1A2E19]">Active Inventory</h2>
                </div>
                <div className="flex items-center gap-1 bg-[#F0FDF4] px-2.5 py-1 rounded-lg border border-[#DCFCE7]">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse"></span>
                  <span className="text-[9px] font-black text-[#15803d] uppercase tracking-widest">Live on Market</span>
                </div>
              </div>

              {availableListings.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-[#E5E9DF] flex flex-col items-center justify-center text-center opacity-70">
                  <div className="h-16 w-16 bg-[#F8FAF8] border border-[#E5E9DF] rounded-2xl flex items-center justify-center mb-4">
                    <Info size={24} className="text-[#8A9A86]" />
                  </div>
                  <p className="font-bold text-[#1A2E19]">No Inventory Listed</p>
                  <p className="text-xs text-[#5C715A] mt-1 max-w-sm">Use the form to list your biomass. Refineries are looking to buy right now.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableListings.map((listing) => (
                    <div key={listing._id} className="bg-white rounded-3xl border border-[#E5E9DF] hover:border-[#DCE7D5] shadow-sm flex flex-col overflow-hidden transition-colors">
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-[#F8FAF8] border border-[#E5E9DF] text-[#1A2E19] font-black px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-widest">
                            {listing.residueType}
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-[#1A2E19] tracking-tighter">{listing.quantity}</span>
                              <span className="text-xs font-bold text-[#8A9A86]">Tons</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-[#8A9A86] uppercase tracking-widest mb-0.5">Asking Price</p>
                            <p className="text-lg font-black text-[#16a34a]">₹{listing.pricePerTon}<span className="text-[10px] text-[#5C715A] font-bold">/t</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 py-3 border-t border-[#F4F7F4] flex justify-end bg-[#F8FAF8]">
                        <button 
                          onClick={() => handleDeleteListing(listing._id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={14} /> Delete Listing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}