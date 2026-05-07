import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Map as MapIcon, KeyRound, CheckCircle2, PackageOpen, User } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import api from '../../src/services/api';

export default function BusinessOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => { fetchOrders(); }, [])
  );

  const fetchOrders = async () => {
    try {
      const res = await api.get('/transactions/buyer/orders');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>{t('market.active_pickups', 'Active Pickups')}</Text>
        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 4 }}>{t('market.manage_logistics', 'Manage logistics and securely release escrow.')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {orders.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64, backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dashed' }}>
            <PackageOpen color="#cbd5e1" size={48} style={{ marginBottom: 16 }} />
            <Text style={{ fontWeight: '900', color: '#0f172a', fontSize: 18, marginBottom: 8 }}>{t('market.no_pickups', 'No Active Pickups')}</Text>
            <Text style={{ fontWeight: '600', color: '#94a3b8', fontSize: 14 }}>{t('market.no_pickups_desc', "You don't have any pending orders.")}</Text>
          </View>
        ) : (
          orders.map((order) => {
            const farmer = order.farmer || {};
            const listing = order.listing || {};
            const address = farmer.address || {};
            const isCompleted = order.status === 'completed';

            return (
              <View key={order._id} style={{ backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 3, marginBottom: 24, overflow: 'hidden' }}>
                
                {/* Header */}
                <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isCompleted ? '#f0fdf4' : '#f8fafc' }}>
                  <View style={{ backgroundColor: isCompleted ? '#dcfce7' : '#e2e8f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: isCompleted ? '#16a34a' : '#475569' }}>
                      {isCompleted ? t('market.collected', 'Collected') : t('market.pending_pickup', 'Pending Pickup')}
                    </Text>
                  </View>
                  <Text style={{ fontWeight: '900', fontSize: 20, color: '#022c22' }}>₹{order.totalAmount.toLocaleString()}</Text>
                </View>

                <View style={{ padding: 24 }}>
                  <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', marginBottom: 20, letterSpacing: -1 }}>{listing.quantity || 0}<Text style={{ fontSize: 16, color: '#64748b' }}>T</Text> <Text style={{ fontSize: 20 }}>{listing.residueType || 'Biomass'}</Text></Text>
                  
                  <View style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                      <View style={{ height: 32, width: 32, borderRadius: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}><User size={16} color="#64748b" /></View>
                      <View>
                        <Text style={{ fontWeight: '900', color: '#0f172a', fontSize: 16 }}>{farmer.fullName || 'Unknown'}</Text>
                        <Text style={{ color: '#64748b', fontSize: 12, fontWeight: '700' }}>{farmer.mobile || 'N/A'}</Text>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <MapPin size={18} color="#059669" style={{ marginTop: 2, marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#475569', fontSize: 14, fontWeight: '600' }}>{address.village || 'Unknown Village'}, {address.tehsil}</Text>
                        <Text style={{ color: '#475569', fontSize: 14, fontWeight: '600' }}>{address.district}, {address.state} - {address.pincode}</Text>
                      </View>
                    </View>
                  </View>

                  {!isCompleted && (
                    <View style={{ backgroundColor: '#022c22', padding: 24, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, shadowColor: '#064e3b', shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 }}>
                      <View>
                        <Text style={{ color: '#a7f3d0', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('market.pickup_otp', 'Pickup OTP')}</Text>
                        <Text style={{ color: '#ffffff', fontSize: 36, fontWeight: '900', letterSpacing: 8 }}>{order.pickupOTP}</Text>
                      </View>
                      <KeyRound size={36} color="#34d399" />
                    </View>
                  )}

                  {isCompleted && (
                    <View style={{ backgroundColor: '#f0fdf4', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#dcfce7' }}>
                      <CheckCircle2 color="#059669" size={24} style={{ marginRight: 12 }}/>
                      <Text style={{ color: '#047857', fontWeight: '900', fontSize: 16 }}>{t('market.handover_success', 'Handover Successful')}</Text>
                    </View>
                  )}

                  {!isCompleted && listing?.location?.coordinates && (
                    <TouchableOpacity 
                      onPress={() => Linking.openURL(`http://maps.google.com/?q=${listing.location.coordinates.lat},${listing.location.coordinates.lng}`)}
                      style={{ backgroundColor: '#f1f5f9', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <MapIcon color="#0f172a" size={18} style={{ marginRight: 8 }} />
                      <Text style={{ color: '#0f172a', fontWeight: '900', fontSize: 16 }}>{t('market.navigate', 'Navigate to Farm')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}