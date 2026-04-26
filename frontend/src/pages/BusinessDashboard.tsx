import React, { useState, useEffect } from 'react';
import { Package, MapPin, IndianRupee, ShieldCheck, Handshake, Search, X, Phone, Map, CheckCircle2, TrendingUp, SlidersHorizontal, Image as ImageIcon, Loader2, FileText } from 'lucide-react';

export default function BusinessDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [sentOffers, setSentOffers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search State
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(15000);

  // Modals & Action State
  const [buyingListing, setBuyingListing] = useState<any>(null);
  const [offeringListing, setOfferingListing] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  
  // Form States
  const [pickupDate, setPickupDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  useEffect(() => { fetchListingsAndOffers(); }, []);

  const fetchListingsAndOffers = async () => {
    try {
      const token = localStorage.getItem('af_token');
      
      const res = await fetch('/api/listings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setListings(data.filter((item: any) => item.status === 'available'));

      const offersRes = await fetch('/api/transactions/buyer/offers', { headers: { Authorization: `Bearer ${token}` } });
      const offersData = await offersRes.json();
      if (Array.isArray(offersData)) {
        setSentOffers(offersData.map((offer: any) => offer.listing));
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleBuyNow = async () => {
    if (!pickupDate) return alert("Select a pickup date");
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId: buyingListing._id, pickupDate })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(data); 
        setBuyingListing(null); 
        fetchListingsAndOffers();
      } else alert(data.message);
    } catch (error) { alert("Payment processing failed."); }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice) return alert("Enter your offer price");
    try {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          listingId: offeringListing._id, 
          offeredPricePerTon: Number(offerPrice), 
          requestedQuantity: offeringListing.quantity, 
          message: offerMessage 
        })
      });
      if (res.ok) {
        alert("Offer sent to farmer successfully!");
        setOfferingListing(null); setOfferPrice(''); setOfferMessage('');
        fetchListingsAndOffers(); 
      }
    } catch (error) { alert("Failed to send offer."); }
  };

  const calculateMatchScore = (listing: any) => {
    let score = 70;
    if (listing.quantity >= 10) score += 15;
    if (listing.pricePerTon <= 5000) score += 10;
    return Math.min(score, 99);
  };

  const filteredListings = listings.filter(listing => {
    const matchesType = filterType === 'All' || listing.residueType === filterType;
    const matchesPrice = listing.pricePerTon <= maxPrice;
    const matchesSearch = listing.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.residueType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesPrice && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full text-blue-600">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold text-gray-500 animate-pulse">Loading Live Market...</p>
      </div>
    );
  }

  const categories = ['All', 'Rice Husk', 'Wheat Straw', 'Sugarcane Bagasse', 'Corn Stover'];

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full min-w-0 bg-slate-50 overflow-x-hidden font-sans">
      
      <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 w-full min-w-0 max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* PREMIUM HERO BANNER */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden w-full">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-4 opacity-[0.07] pointer-events-none"><TrendingUp size={160} /></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="bg-blue-500/30 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block backdrop-blur-md">
              Corporate Procurement
            </span>
            <h1 className="text-2xl md:text-3xl font-black mb-2 leading-tight tracking-tight">
              Secure high-quality biomass, directly from the source.
            </h1>
            <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-xl">
              Our AI engine matches your facility with the most cost-effective and logistically viable crop residue across India.
            </p>
          </div>
        </div>

        {/* HORIZONTAL CONTROL BAR */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm rounded-2xl p-2 grid grid-cols-1 lg:grid-cols-12 gap-3 sticky top-4 z-20 w-full">
          <div className="relative w-full lg:col-span-3 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input type="text" placeholder="Search districts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/50 hover:bg-white/80 border border-gray-200/80 focus:border-blue-300 focus:bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 shadow-sm"/>
          </div>

          <div className="w-full lg:col-span-6 overflow-x-auto hide-scrollbar flex items-center bg-gray-200/40 p-1 rounded-xl border border-gray-100/50">
            {categories.map(type => (
              <button key={type} onClick={() => setFilterType(type)} className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex-1 text-center ${filterType === type ? 'bg-white text-blue-700 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="w-full lg:col-span-3 flex items-center gap-3 bg-white/50 p-2 rounded-xl border border-gray-200/80 shadow-sm px-4">
            <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Max Price</span>
                <span className="text-[11px] font-black text-blue-700 truncate">₹{(maxPrice/1000).toFixed(1)}k</span>
              </div>
              <input type="range" min="1000" max="15000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-blue-600 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        </div>

        {/* THE MARKET FEED */}
        {filteredListings.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md border border-white rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center w-full">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Package className="text-gray-400" size={28} /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No biomass found</h3>
            <p className="text-gray-500 text-sm font-medium max-w-sm mx-auto">We couldn't find any listings matching your current filters.</p>
            <button onClick={() => {setFilterType('All'); setMaxPrice(15000); setSearchQuery('');}} className="mt-6 text-sm text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {filteredListings.map((listing) => {
              const matchScore = calculateMatchScore(listing);
              const alreadyOffered = sentOffers.includes(listing._id);
              
              return (
                <div key={listing._id} className="bg-slate-200/60 backdrop-blur-xl border border-slate-300/60 shadow-sm hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group cursor-pointer">
                  
                  {/* FIXED IMAGE LOGIC: Render image directly since it is Base64 */}
                  <div className="h-32 w-full relative bg-gray-100 overflow-hidden border-b border-slate-300/50">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt="Biomass" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200/50 to-gray-100 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <ImageIcon className="text-gray-400 mb-2" size={24} />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">No Image Provided</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      <span className="text-[10px] font-bold text-gray-700 bg-white/90 backdrop-blur-md border border-white/50 px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">{listing.residueType}</span>
                      <div className="bg-white/90 backdrop-blur-md text-green-700 px-2 py-1 rounded flex items-center gap-1.5 border border-white/50 shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${matchScore >= 80 ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="font-bold text-[9px] uppercase tracking-wider">{matchScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">{listing.quantity}</span>
                      <span className="text-gray-600 font-bold text-[11px] tracking-wide uppercase">Tons</span>
                    </div>

                    <div className="mb-4 min-h-[36px]">
                      {listing.description ? (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium flex items-start gap-1.5">
                          <FileText size={12} className="shrink-0 mt-0.5 text-gray-400" />
                          {listing.description}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 italic line-clamp-2 leading-relaxed">No additional details provided.</p>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 mt-auto">
                      <div className="flex items-center justify-between bg-white/60 p-2.5 rounded-lg border border-white/50">
                        <div className="flex items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          <IndianRupee size={12} className="text-blue-600 mr-1.5 shrink-0" /> Price
                        </div>
                        <span className="font-bold text-gray-900 text-sm">₹{listing.pricePerTon.toLocaleString()}<span className="text-[10px] text-gray-500 font-bold">/t</span></span>
                      </div>
                      
                      <div className="flex items-center p-2.5 bg-white/60 border border-white/50 rounded-lg">
                        <MapPin size={12} className="text-gray-500 mr-2 shrink-0" />
                        <span className="font-medium text-xs text-gray-700 truncate">{listing.location?.village || 'Unknown'}, {listing.location?.district || 'Unknown'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-300/50">
                      {alreadyOffered ? (
                        <button disabled className="bg-white/40 text-gray-500 font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs cursor-not-allowed border border-slate-300/50">
                          <CheckCircle2 size={14} /> Offered
                        </button>
                      ) : (
                        <button onClick={() => setOfferingListing(listing)} className="bg-white/80 border border-blue-200/50 hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] shadow-sm">
                          <Handshake size={14} /> Negotiate
                        </button>
                      )}
                      <button onClick={() => setBuyingListing(listing)} className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 rounded-lg transition-all shadow-md hover:shadow-blue-900/20 flex items-center justify-center gap-1.5 text-xs active:scale-[0.98]">
                        <ShieldCheck size={14} /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {buyingListing && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-white animate-in zoom-in-95 duration-300">
            <button onClick={() => setBuyingListing(null)} className="absolute top-4 right-4 p-1.5 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"><X size={16}/></button>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><ShieldCheck size={20} /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Secure via Escrow</h2>
            <p className="text-gray-500 font-medium mb-5 text-xs leading-relaxed">Funds are held securely in escrow and released upon successful OTP verification at pickup.</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2 mb-2">
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">Total Payable</span>
                <span className="font-black text-xl text-gray-900">₹{(buyingListing.quantity * buyingListing.pricePerTon).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">Supplier</span>
                <span className="font-bold text-blue-700 text-xs flex items-center gap-1"><CheckCircle2 size={12}/> {buyingListing.farmer?.fullName || "Verified"}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Schedule Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-medium text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-blue-50/10 transition-all"/>
            </div>
            <button onClick={handleBuyNow} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-1.5">
              Pay Securely <ShieldCheck size={16} />
            </button>
          </div>
        </div>
      )}

      {offeringListing && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-white animate-in zoom-in-95 duration-300">
            <button onClick={() => setOfferingListing(null)} className="absolute top-4 right-4 p-1.5 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"><X size={16}/></button>
            <div className="h-10 w-10 bg-gray-100 text-gray-900 rounded-xl flex items-center justify-center mb-4"><Handshake size={20} /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Negotiate Price</h2>
            <p className="text-gray-500 font-medium mb-5 text-xs">Farmer's asking price: <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">₹{offeringListing.pricePerTon.toLocaleString()}/t</span></p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Your Offer (₹/Ton)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0.00" className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 font-bold text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-blue-50/10 transition-all"/>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Message (Optional)</label>
                <textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="E.g., We can pick up tomorrow." className="w-full border border-gray-200 rounded-lg px-3 py-2 font-medium text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-blue-50/10 h-20 resize-none transition-all"></textarea>
              </div>
            </div>
            <button onClick={handleMakeOffer} className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 shadow-md active:scale-[0.98] transition-all text-sm">Submit Offer</button>
          </div>
        </div>
      )}

      {/* FIXED MAP LINK URL SYNTAX */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center border-t-4 border-t-green-500 animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><ShieldCheck size={32}/></div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Escrow Secured!</h2>
            <p className="text-gray-500 text-xs font-medium mb-6">Present this OTP to the farmer upon arrival to complete the transaction and release funds.</p>
            
            <div className="bg-gray-900 text-white py-4 rounded-xl mb-6 shadow-inner border border-gray-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-transparent opacity-50"></div>
               <div className="relative z-10 text-4xl font-black tracking-[0.25em]">{bookingSuccess.pickupOTP}</div>
               <p className="relative z-10 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Secret Pickup PIN</p>
            </div>

            <div className="text-left bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
              <p className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5"><Phone size={14} className="text-blue-500"/> {bookingSuccess.farmerDetails?.mobile || "Contact unavailable"}</p>
              <p className="font-medium text-gray-600 text-xs flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> {bookingSuccess.farmerDetails?.village || "Location provided privately"}</p>
            </div>

            <div className="flex gap-2 w-full">
              {bookingSuccess.farmerDetails?.coordinates && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${bookingSuccess.farmerDetails.coordinates.lat},${bookingSuccess.farmerDetails.coordinates.lng}`} 
                  target="_blank" rel="noreferrer" 
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-sm"
                >
                  <Map size={14}/> Map
                </a>
              )}
              <button onClick={() => setBookingSuccess(null)} className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}