import React, { useState, useEffect } from 'react';
import { Truck, MapPin, KeyRound, CheckCircle2, Map, Loader2, User, PackageOpen } from 'lucide-react';

export default function BusinessOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('af_token');
        const res = await fetch('/api/transactions/buyer/orders', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full bg-[#fcfcfc]">
      <Loader2 className="animate-spin mb-3 text-zinc-400" size={28} />
      <p className="font-medium text-zinc-500 text-xs tracking-wide">Loading active orders...</p>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#fcfcfc] font-sans pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              Active Orders & Pickups
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">Manage logistics and securely release escrow funds.</p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
            <PackageOpen className="text-zinc-300 mb-3" size={32} />
            <h3 className="text-sm font-bold text-zinc-900 mb-1">No Active Pickups</h3>
            <p className="text-zinc-500 text-xs">You don't have any pending or completed orders right now.</p>
          </div>
        ) : (
          /* ORDERS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {orders.map((order) => {
              const farmer = order.farmer;
              const listing = order.listing;
              const address = farmer?.address;
              const isCompleted = order.status === 'completed';

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
                  
                  {/* Card Header */}
                  <div className={`p-4 border-b border-zinc-100 flex justify-between items-center ${isCompleted ? 'bg-green-50/50' : 'bg-zinc-50/80'}`}>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100/50 text-blue-700'}`}>
                      {isCompleted ? 'Collected' : 'Pending Pickup'}
                    </span>
                    <span className="font-bold text-zinc-900 text-base">₹{order.totalAmount.toLocaleString()}</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-5">
                      <h3 className="text-xl font-black text-zinc-900 tracking-tight">{listing?.quantity}<span className="text-sm font-semibold text-zinc-500 ml-0.5">T</span></h3>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">{listing?.residueType}</p>
                    </div>
                    
                    {/* Details Section */}
                    <div className="space-y-3 mb-6 bg-zinc-50/50 border border-zinc-100 rounded-lg p-3">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="h-7 w-7 rounded-md bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm"><User size={14} className="text-zinc-500" /></div>
                        <div>
                           <p className="font-bold text-zinc-900">{farmer?.fullName}</p>
                           <p className="text-zinc-500 font-medium">{farmer?.mobile}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 text-xs pt-2 border-t border-zinc-100">
                        <div className="h-7 w-7 rounded-md bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm"><MapPin size={14} className="text-zinc-500" /></div>
                        <div className="text-zinc-600 mt-0.5">
                          <p className="font-medium">{address?.village || 'Village Info Unavailable'}, {address?.tehsil || ''}</p>
                          <p className="font-medium">{address?.district || 'District Info Unavailable'}, {address?.state}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto space-y-3">
                      
                      {/* Zomato Style OTP Box */}
                      {order.status === 'funds_in_escrow' && (
                        <div className="bg-zinc-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
                          <div>
                            <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">Secret Pickup PIN</p>
                            <p className="text-2xl font-mono font-black tracking-[0.15em]">{order.pickupOTP}</p>
                          </div>
                          <KeyRound size={28} className="text-zinc-600" />
                        </div>
                      )}
                      
                      {isCompleted && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs border border-green-100 shadow-sm">
                          <CheckCircle2 size={16} /> Handover Successful
                        </div>
                      )}

                      {/* Navigation Link */}
                      {!isCompleted && listing?.location?.coordinates && (
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${listing.location.coordinates.lat},${listing.location.coordinates.lng}`}
                          target="_blank" rel="noreferrer"
                          className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs shadow-sm"
                        >
                          <Map size={14} /> Navigate to Farm
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}