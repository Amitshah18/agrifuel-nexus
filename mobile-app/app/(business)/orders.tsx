import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Map as MapIcon, KeyRound, CheckCircle2 } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../src/services/api';

export default function BusinessOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => { fetchOrders(); }, [])
  );

  const fetchOrders = async () => {
    try {
      const res = await api.get('/transactions/buyer/orders');
      setOrders(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator color="#2563eb" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="px-6 py-4 bg-white border-b border-gray-100"><Text className="text-2xl font-extrabold text-gray-900">Active Pickups</Text></View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {orders.map((order) => {
          const farmer = order.farmer || {};
          const address = farmer.address || {};

          return (
            <View key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              <View className={`p-4 border-b flex-row justify-between items-center ${order.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                <Text className={`font-bold uppercase text-xs ${order.status === 'completed' ? 'text-green-800' : 'text-blue-800'}`}>
                  {order.status === 'completed' ? 'Collected' : 'Pending Pickup'}
                </Text>
                <Text className="font-black text-lg">₹{order.totalAmount}</Text>
              </View>

              <View className="p-5">
                <Text className="text-xl font-bold text-gray-900 mb-3">{order.listing?.quantity || 0} Tons of {order.listing?.residueType || 'Biomass'}</Text>
                
                <View className="flex-row items-start mb-4">
                  <MapPin size={18} color="#9ca3af" className="mt-1 mr-2" />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900">{farmer.fullName || 'Unknown'} ({farmer.mobile || 'N/A'})</Text>
                    <Text className="text-gray-600 text-sm">{address.village || 'Unknown Location'}, Tehsil: {address.tehsil}</Text>
                    <Text className="text-gray-600 text-sm">{address.district}, {address.state} - {address.pincode}</Text>
                  </View>
                </View>

                {order.status === 'funds_in_escrow' && (
                  <View className="bg-gray-900 p-5 rounded-2xl flex-row justify-between items-center mt-2">
                    <View>
                      <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pickup OTP</Text>
                      <Text className="text-white text-3xl font-black tracking-widest">{order.pickupOTP}</Text>
                    </View>
                    <KeyRound size={28} color="#3b82f6" />
                  </View>
                )}

                {order.status === 'completed' && (
                  <View className="bg-green-50 p-4 rounded-xl flex-row items-center gap-2 mt-2">
                    <CheckCircle2 color="#16a34a" size={20}/>
                    <Text className="text-green-800 font-bold">Handover Successful</Text>
                  </View>
                )}
              </View>

              {/* FIXED: Official Google Maps Search URL format */}
              {order.status !== 'completed' && order.listing?.location?.coordinates && (
                <TouchableOpacity 
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${order.listing.location.coordinates.lat},${order.listing.location.coordinates.lng}`)}
                  className="bg-blue-600 p-4 flex-row justify-center items-center gap-2 active:bg-blue-700"
                >
                  <MapIcon color="white" size={18} />
                  <Text className="text-white font-bold text-base">Navigate to Farm</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}