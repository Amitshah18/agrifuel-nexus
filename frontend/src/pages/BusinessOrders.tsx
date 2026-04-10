import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, KeyRound, CheckCircle2, Map } from 'lucide-react';

export default function BusinessOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('af_token');
      const res = await fetch('/api/transactions/buyer/orders', { headers: { Authorization: `Bearer ${token}` } });
      setOrders(await res.json());
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-gray-900">My Active Pickups</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => {
          const farmer = order.farmer;
          const listing = order.listing;
          const address = farmer.address;

          return (
            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className={`p-4 border-b ${order.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'} flex justify-between items-center`}>
                <span className={`font-bold px-3 py-1 rounded-lg text-xs uppercase ${order.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                  {order.status === 'completed' ? 'Collected' : 'Pending Pickup'}
                </span>
                <span className="font-black text-lg">₹{order.totalAmount.toLocaleString()}</span>
              </div>

              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold mb-4">{listing?.quantity} Tons of {listing?.residueType}</h3>
                
                {/* Full Address Display */}
                <div className="flex items-start text-gray-600 mb-4">
                  <MapPin size={20} className="mr-3 text-gray-400 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900">{farmer.fullName} <span className="font-medium text-gray-500">({farmer.mobile})</span></p>
                    <p className="text-sm">{address.village}, Tehsil: {address.tehsil}</p>
                    <p className="text-sm">{address.district}, {address.state} - {address.pincode}</p>
                  </div>
                </div>

                {/* Zomato Style OTP Box */}
                {order.status === 'funds_in_escrow' && (
                  <div className="bg-gray-900 text-white p-5 rounded-2xl flex items-center justify-between mt-4">
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pickup OTP</p>
                      <p className="text-3xl font-black tracking-widest">{order.pickupOTP}</p>
                    </div>
                    <KeyRound size={32} className="text-blue-500 opacity-50" />
                  </div>
                )}
                
                {order.status === 'completed' && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-2 font-bold mt-4">
                    <CheckCircle2 /> Handover Successful
                  </div>
                )}
              </div>

              {/* Navigation Link */}
              {order.status !== 'completed' && listing?.location?.coordinates && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=$${listing.location.coordinates.lat},${listing.location.coordinates.lng}`}
                  target="_blank" rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 text-center flex items-center justify-center gap-2 transition"
                >
                  <Map size={18} /> Navigate to Farm
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}