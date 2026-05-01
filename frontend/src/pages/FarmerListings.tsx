import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, Truck, AlertTriangle, Leaf, History, MessageSquare } from 'lucide-react';
import { api } from '../lib/api';

export default function FarmerListings() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unbookedListings, setUnbookedListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Clean, simple API calls without manual token extraction
      const ordersData = await api.get('/api/transactions/farmer/orders');
      setOrders(ordersData);

      try {
        const offersData = await api.get('/api/transactions/offers/received');
        setOffers(offersData);
      } catch (e) {
        // Silently ignore if offers fail (e.g. no active offers)
      }

      const listingsData = await api.get('/api/listings');
      const myId = JSON.parse(localStorage.getItem('af_user') || '{}').id;
      
      const available = listingsData.filter((l: any) => l.farmer?._id === myId && l.status === 'available');
      setUnbookedListings(available);
      
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject') => {
    try {
      await api.put(`/api/transactions/offers/${offerId}/${action}`);
      alert(`Offer ${action}ed successfully!`);
      fetchData(); 
    } catch (error) { 
      alert("Failed to process offer."); 
    }
  };

  const handleVerifyOTP = async (orderId: string) => {
    const submittedOtp = otpInput[orderId];
    if (!submittedOtp || submittedOtp.length !== 6) return alert("Enter a valid 6-digit OTP");
    
    try {
      await api.post('/api/transactions/verify-otp', { orderId, submittedOtp });
      alert("🎉 Success! Funds have been released to your account.");
      setOtpInput({...otpInput, [orderId]: ''});
      fetchData();
    } catch (error: any) { 
      alert(error.message || "Verification failed."); 
    }
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

      {/* PICKUPS ARRIVING (OTP) */}
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