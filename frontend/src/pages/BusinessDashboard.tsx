import React, { useState, useEffect, useMemo } from 'react';
import { Package, MapPin, IndianRupee, ShieldCheck, Handshake, Search, X, Phone, Map, CheckCircle2, TrendingUp, SlidersHorizontal, Image as ImageIcon, Loader2, Leaf, BarChart3, Clock, AlertCircle } from 'lucide-react';

export default function BusinessDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [sentOffers, setSentOffers] = useState<any[]>([]); // Now stores full offer objects
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(15000);

  const [buyingListing, setBuyingListing] = useState<any>(null);
  const [offeringListing, setOfferingListing] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  
  const [pickupDate, setPickupDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  // Initial Fetch & Background Polling (Concurrency)
  useEffect(() => { 
    fetchData(); 
    const interval = setInterval(() => fetchData(true), 10000); // Poll every 10s for status updates
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (background = false) => {
    if (background) setIsRefreshing(true);
    try {
      const token = localStorage.getItem('af_token');
      const [listRes, offerRes] = await Promise.all([
        fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/transactions/buyer/offers', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const listData = await listRes.json();
      const offerData = await offerRes.json();
      
      setListings(listData.filter((item: any) => item.status === 'available'));
      if (Array.isArray(offerData)) setSentOffers(offerData);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice) return alert("Enter your offer price");
    
    // OPTIMISTIC UI UPDATE: Instantly move it to the offers section
    const tempOffer = {
      _id: 'temp_' + Date.now(),
      listing: offeringListing,
      status: 'pending',
      offeredPricePerTon: Number(offerPrice),
      message: offerMessage
    };
    setSentOffers(prev => [...prev, tempOffer]);
    setOfferingListing(null); setOfferPrice(''); setOfferMessage('');

    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/offer', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: tempOffer.listing._id, offeredPricePerTon: tempOffer.offeredPricePerTon, requestedQuantity: tempOffer.listing.quantity, message: tempOffer.message })
      });
      if (!res.ok) throw new Error("Offer failed");
      fetchData(true); // Sync real DB ID
    } catch (error) { 
      alert("Failed to send offer.");
      fetchData(true); // Revert optimistic update on failure
    }
  };

  const handleBuyNow = async () => {
    if (!pickupDate) return alert("Select a pickup date");
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: buyingListing._id, pickupDate })
      });
      const data = await res.json();
      if (res.ok) { setBookingSuccess(data); setBuyingListing(null); fetchData(true); } 
      else alert(data.message);
    } catch (error) { alert("Payment processing failed."); }
  };

  const optimizeImageUrl = (imgStr: string) => {
    if (!imgStr) return null;
    if (imgStr.startsWith('http') || imgStr.startsWith('data:image')) return imgStr;
    return `http://localhost:5000/${imgStr.replace(/^\//, '')}`; 
  };

  // --- LOGIC: SPLIT MARKET LISTINGS vs ACTIVE OFFERS ---
  const activeOffers = sentOffers.filter(o => o.status === 'pending' || o.status === 'accepted');
  const activeOfferListingIds = activeOffers.map(o => typeof o.listing === 'object' ? o.listing._id : o.listing);

  // Filter listings for the main market (excluding those currently in negotiation)
  const marketListings = listings.filter(listing => {
    if (activeOfferListingIds.includes(listing._id)) return false; // Hide if negotiating
    const matchesType = filterType === 'All' || listing.residueType === filterType;
    const matchesPrice = listing.pricePerTon <= maxPrice;
    const matchesSearch = listing.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) || listing.residueType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesPrice && matchesSearch;
  });

  const marketKPIs = useMemo(() => {
    if (marketListings.length === 0) return { totalTons: 0, avgPrice: 0, co2Offset: 0 };
    const totalTons = marketListings.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const avgPrice = marketListings.reduce((sum, item) => sum + (item.pricePerTon || 0), 0) / marketListings.length;
    return { totalTons: totalTons.toFixed(1), avgPrice: Math.round(avgPrice), co2Offset: Math.round(totalTons * 1.5) };
  }, [marketListings]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full text-zinc-900 bg-white">
      <Loader2 className="animate-spin mb-3 text-zinc-400" size={28} />
      <p className="font-medium text-zinc-500 text-xs tracking-wide">Syncing market data...</p>
    </div>
  );

  const categories = ['All', 'Rice Husk', 'Wheat Straw', 'Sugarcane Bagasse', 'Corn Stover'];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#fcfcfc] font-sans pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* COMPACT HEADER & KPIS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              Procurement Market 
              {isRefreshing && <Loader2 size={14} className="animate-spin text-zinc-400" />}
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">Source biomass directly from verified farmers.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="bg-white border border-zinc-200 rounded-lg px-4 py-2.5 min-w-[130px] shadow-sm">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-0.5"><Package size={12}/> Volume</span>
              <p className="text-lg font-black text-zinc-900">{marketKPIs.totalTons} <span className="text-xs text-zinc-400 font-semibold">T</span></p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg px-4 py-2.5 min-w-[130px] shadow-sm">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-0.5"><TrendingUp size={12}/> Avg Price</span>
              <p className="text-lg font-black text-zinc-900">₹{marketKPIs.avgPrice} <span className="text-xs text-zinc-400 font-semibold">/t</span></p>
            </div>
          </div>
        </div>

        {/* ULTRA-MINIMAL FILTER BAR */}
        <div className="bg-white border border-zinc-200 rounded-lg p-1.5 flex flex-col lg:flex-row gap-1.5 shadow-sm sticky top-4 z-20">
          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input type="text" placeholder="Search locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent focus:bg-zinc-50 rounded-md pl-8 pr-3 py-1.5 text-sm font-medium text-zinc-900 outline-none transition-all placeholder:text-zinc-400"/>
          </div>

          <div className="flex-1 flex items-center gap-1 overflow-x-auto hide-scrollbar border-l border-zinc-100 pl-2">
            {categories.map(type => (
              <button key={type} onClick={() => setFilterType(type)} className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filterType === type ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-56 shrink-0 flex items-center gap-3 border-l border-zinc-100 pl-3 pr-2 py-1">
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Max ₹/t</span>
                <span className="text-xs font-bold text-zinc-900">₹{(maxPrice/1000).toFixed(1)}k</span>
              </div>
              <input type="range" min="1000" max="15000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-zinc-900 h-1 bg-zinc-200 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* SECTION 1: ACTIVE NEGOTIATIONS (OFFERS MADE) */}
        {activeOffers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Handshake size={16} className="text-blue-500"/> Active Negotiations & Offers
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {activeOffers.map(offer => {
                const listing = typeof offer.listing === 'object' ? offer.listing : listings.find(l => l._id === offer.listing);
                if (!listing) return null;
                const isAccepted = offer.status === 'accepted';

                return (
                  <div key={offer._id} className={`bg-white border ${isAccepted ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.15)]' : 'border-zinc-200 shadow-sm'} rounded-xl p-4 flex items-center justify-between gap-4 transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                        {optimizeImageUrl(listing.images?.[0]) ? (
                           <img src={optimizeImageUrl(listing.images?.[0])!} alt="" className="w-full h-full object-cover" />
                        ) : <ImageIcon className="m-auto mt-3 text-zinc-300" size={20}/>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-zinc-900">{listing.quantity}T {listing.residueType}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                            {isAccepted ? 'Accepted' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-zinc-500">Your Offer: <span className="text-zinc-900 font-bold">₹{offer.offeredPricePerTon}/t</span> (vs Ask: ₹{listing.pricePerTon})</p>
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      {isAccepted ? (
                        <button 
                          onClick={() => setBuyingListing({...listing, pricePerTon: offer.offeredPricePerTon})} // Override price with accepted offer
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <ShieldCheck size={14}/> Schedule & Pay
                        </button>
                      ) : (
                        <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100">
                          <Clock size={12}/> Awaiting Farmer
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: LIVE MARKET GRID */}
        <div>
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Package size={16} className="text-zinc-400"/> Available Market Inventory
          </h2>
          {marketListings.length === 0 ? (
            <div className="bg-white border border-dashed border-zinc-200 rounded-xl p-8 text-center">
              <BarChart3 className="text-zinc-300 mb-2 mx-auto" size={24} />
              <h3 className="text-sm font-bold text-zinc-900 mb-1">Market Empty</h3>
              <p className="text-zinc-500 text-xs">No matching listings found outside of your active negotiations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4">
              {marketListings.map((listing) => (
                <div key={listing._id} className="bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 rounded-xl overflow-hidden flex flex-col transition-all duration-200 group">
                  <div className="h-32 w-full relative bg-zinc-50 border-b border-zinc-100">
                    {optimizeImageUrl(listing.images?.[0]) ? (
                      <img src={optimizeImageUrl(listing.images?.[0])!} alt="Crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50"><ImageIcon className="text-zinc-300" size={20} /></div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded uppercase tracking-wider">{listing.residueType}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xl font-black text-zinc-900">{listing.quantity}<span className="text-xs font-semibold text-zinc-500 ml-0.5">T</span></span>
                      <span className="font-bold text-zinc-900 text-sm">₹{listing.pricePerTon}<span className="text-[10px] font-medium text-zinc-500">/t</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-4 text-zinc-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="text-[11px] font-medium truncate">{listing.location?.village || 'Unknown'}, {listing.location?.district || 'Unknown'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button onClick={() => setOfferingListing(listing)} className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-[11px]">
                         Offer
                      </button>
                      <button onClick={() => setBuyingListing(listing)} className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-[11px]">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODALS (Identical Logic, Refined Styling) */}
      {buyingListing && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setBuyingListing(null)} className="absolute top-4 right-4 p-1 text-zinc-400 hover:bg-zinc-100 rounded-md transition-colors"><X size={16}/></button>
            <div className="h-10 w-10 bg-zinc-100 text-zinc-900 rounded-lg flex items-center justify-center mb-3"><ShieldCheck size={20} /></div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Secure via Escrow</h2>
            <p className="text-zinc-500 text-[11px] mb-5">Funds are held securely and released upon OTP verification at pickup.</p>
            
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 mb-5">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2 mb-2">
                <span className="text-zinc-500 font-bold text-[10px] uppercase">Total Payable</span>
                <span className="font-black text-lg text-zinc-900">₹{(buyingListing.quantity * buyingListing.pricePerTon).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold text-[10px] uppercase">Supplier</span>
                <span className="font-bold text-zinc-900 text-[11px] flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> {buyingListing.farmer?.fullName || "Verified"}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-bold text-zinc-700 mb-1.5">Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"/>
            </div>
            <button onClick={handleBuyNow} className="w-full bg-zinc-900 text-white font-bold py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-xs flex items-center justify-center gap-2">
              Pay Securely <ShieldCheck size={14} />
            </button>
          </div>
        </div>
      )}

      {offeringListing && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setOfferingListing(null)} className="absolute top-4 right-4 p-1 text-zinc-400 hover:bg-zinc-100 rounded-md transition-colors"><X size={16}/></button>
            <div className="h-10 w-10 bg-zinc-100 text-zinc-900 rounded-lg flex items-center justify-center mb-3"><Handshake size={20} /></div>
            <h2 className="text-lg font-bold text-zinc-900 mb-1">Negotiate Price</h2>
            <p className="text-zinc-500 text-[11px] mb-5">Asking price: <span className="font-bold text-zinc-900">₹{offeringListing.pricePerTon.toLocaleString()}/t</span></p>
            
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Your Offer (₹/Ton)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2 text-zinc-400" size={14} />
                  <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0.00" className="w-full border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"/>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">Message (Optional)</label>
                <textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="E.g., We can pick up tomorrow." className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 h-16 resize-none transition-all"></textarea>
              </div>
            </div>
            <button onClick={handleMakeOffer} className="w-full bg-zinc-900 text-white font-bold py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-xs">Submit Offer</button>
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3"><ShieldCheck size={24}/></div>
            <h2 className="text-xl font-black text-zinc-900 mb-1">Escrow Secured</h2>
            <p className="text-zinc-500 text-[11px] mb-5">Present this PIN to the farmer upon arrival to complete the transaction.</p>
            
            <div className="bg-zinc-50 py-3 rounded-lg border border-zinc-200 mb-5">
               <div className="text-2xl font-mono font-black tracking-[0.2em] text-zinc-900">{bookingSuccess.pickupOTP}</div>
               <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-wider mt-0.5">Secret PIN</p>
            </div>

            <div className="text-left bg-zinc-50 p-3 rounded-lg border border-zinc-100 mb-5">
              <p className="font-bold text-zinc-900 text-xs mb-1 flex items-center gap-2"><Phone size={12} className="text-zinc-400"/> {bookingSuccess.farmerDetails?.mobile || "Contact unavailable"}</p>
              <p className="font-medium text-zinc-600 text-[11px] flex items-center gap-2"><MapPin size={12} className="text-zinc-400"/> {bookingSuccess.farmerDetails?.village || "Location provided privately"}</p>
            </div>

            <div className="flex gap-2 w-full">
              {bookingSuccess.farmerDetails?.coordinates && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${bookingSuccess.farmerDetails.coordinates.lat},${bookingSuccess.farmerDetails.coordinates.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs">
                  <Map size={14}/> Map
                </a>
              )}
              <button onClick={() => setBookingSuccess(null)} className="flex-[2] bg-zinc-900 text-white font-bold py-2 rounded-lg hover:bg-zinc-800 transition-colors text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}