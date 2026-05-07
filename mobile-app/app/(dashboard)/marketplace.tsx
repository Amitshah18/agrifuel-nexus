import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import api from '../../src/services/api';

export default function FarmerListingsScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unbookedListings, setUnbookedListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  const [showForm, setShowForm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [residueType, setResidueType] = useState('');
  const [customResidue, setCustomResidue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');

  const { t } = useTranslation();

  const residueOptions = [
    { value: 'Rice Husk', label: t('market.rice_husk', 'Rice Husk') },
    { value: 'Wheat Straw', label: t('market.wheat_straw', 'Wheat Straw') },
    { value: 'Sugarcane Bagasse', label: t('market.sugarcane_bagasse', 'Sugarcane Bagasse') },
    { value: 'Other', label: t('market.other', 'Other') }
  ];

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const fetchData = async () => {
    try {
      const ordersRes = await api.get('/transactions/farmer/orders');
      setOrders(ordersRes.data);

      try {
        const offersRes = await api.get('/transactions/offers/received');
        setOffers(offersRes.data);
      } catch (e) {}

      const listingsRes = await api.get('/listings');
      const userStr = await AsyncStorage.getItem('af_user');
      const myId = JSON.parse(userStr || '{}').id;
      setUnbookedListings(listingsRes.data.filter((l: any) => l.farmer?._id === myId && l.status === 'available'));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleCreateListing = async () => {
    const finalResidueType = residueType === 'Other' ? customResidue : residueType;
    if (!finalResidueType || !quantity || !pricePerTon) return Alert.alert(t('common.error', 'Error'), "Fill required fields");
    
    setIsLocating(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setIsLocating(false); return Alert.alert(t('common.error', 'Error'), "Permission denied"); }

    try {
      let location = await Location.getCurrentPositionAsync({});
      await api.post('/listings', { 
        residueType: finalResidueType, quantity: Number(quantity), pricePerTon: Number(pricePerTon),
        coordinates: { lat: location.coords.latitude, lng: location.coords.longitude }
      });
      setShowForm(false);
      setResidueType(''); setCustomResidue(''); setQuantity(''); setPricePerTon(''); 
      Alert.alert(t('common.success', 'Success'), "Listing created");
      fetchData();
    } catch (error) { Alert.alert(t('common.error', 'Error'), "Could not create listing"); } finally { setIsLocating(false); }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject') => {
    try {
      await api.put(`/transactions/offers/${offerId}/${action}`);
      Alert.alert(t('common.success', 'Success'), action === 'accept' ? 'Offer Accepted' : 'Offer Rejected'); 
      fetchData();
    } catch (error) { Alert.alert(t('common.error', 'Error'), "Failed to process offer."); }
  };

  const handleVerifyOTP = async (orderId: string) => {
    const submittedOtp = otpInput[orderId];
    if (!submittedOtp || submittedOtp.length !== 6) return Alert.alert(t('common.error', 'Error'), "Enter 6-digit OTP");
    try {
      await api.post('/transactions/verify-otp', { orderId, submittedOtp });
      Alert.alert(t('common.success', 'Success'), "Funds Released!");
      setOtpInput({...otpInput, [orderId]: ''}); fetchData();
    } catch (error: any) { Alert.alert("Failed", error.response?.data?.message || "Invalid OTP"); }
  };

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#059669" /></View>;

  const pendingPickups = orders.filter(o => o.status === 'funds_in_escrow');
  const pendingOffers = offers.filter(o => o.status === 'pending');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>{t('market.my_listings', 'Marketplace')}</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} style={{ height: 44, width: 44, backgroundColor: '#022c22', borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {showForm && (
          <View style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24, elevation: 3 }}>
            <Text style={{ fontWeight: '900', fontSize: 22, color: '#022c22', marginBottom: 20 }}>{t('market.create_new_listing', 'Post New Listing')}</Text>
            
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>{t('market.residue_type', 'Biomass Type')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, flexDirection: 'row' }}>
              {residueOptions.map(opt => (
                <TouchableOpacity key={opt.value} onPress={() => { setResidueType(opt.value); setCustomResidue(''); }} style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, backgroundColor: residueType === opt.value ? '#059669' : '#f8fafc', borderColor: residueType === opt.value ? '#059669' : '#e2e8f0' }}>
                  <Text style={{ fontWeight: '800', color: residueType === opt.value ? '#ffffff' : '#334155' }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>{t('market.quantity_tons', 'Quantity (Tons)')}</Text>
                <TextInput style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, fontWeight: '800', color: '#0f172a', fontSize: 16 }} placeholder={t('market.qty_placeholder', "e.g. 10")} keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>{t('market.price_per_ton', 'Price/Ton (₹)')}</Text>
                <TextInput style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, fontWeight: '800', color: '#0f172a', fontSize: 16 }} placeholder={t('market.price_placeholder', "e.g. 3200")} keyboardType="numeric" value={pricePerTon} onChangeText={setPricePerTon} />
              </View>
            </View>

            <TouchableOpacity onPress={handleCreateListing} disabled={isLocating} style={{ backgroundColor: '#022c22', paddingVertical: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>
              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>{isLocating ? t('common.processing', 'Processing...') : t('market.post_listing', 'Post to Marketplace')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {pendingOffers.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 12, fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{t('market.incoming_offers', 'Incoming Offers')}</Text>
            {pendingOffers.map(offer => (
              <View key={offer._id} style={{ backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#e2e8f0', padding: 24, marginBottom: 16, elevation: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <Text style={{ fontWeight: '900', color: '#0f172a', fontSize: 18 }}>{offer.company?.companyDetails?.businessName}</Text>
                  <View style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>{t('market.wants', 'Wants')} {offer.requestedQuantity}T</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 36, fontWeight: '900', color: '#059669', marginVertical: 12, letterSpacing: -1 }}>₹{offer.offeredPricePerTon}</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={() => handleOfferAction(offer._id, 'reject')} style={{ flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#64748b', fontWeight: '800' }}>{t('market.reject', 'Reject')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleOfferAction(offer._id, 'accept')} style={{ flex: 1, backgroundColor: '#059669', paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 3 }}>
                    <Text style={{ color: '#ffffff', fontWeight: '800' }}>{t('market.accept_offer', 'Accept')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {pendingPickups.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 12, fontWeight: '900', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{t('market.action_required', 'Action Required')}</Text>
            {pendingPickups.map(order => (
              <View key={order._id} style={{ backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 2, borderColor: '#fdba74', padding: 24, marginBottom: 16, elevation: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{ backgroundColor: '#fff7ed', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}><Text style={{ fontWeight: '900', color: '#ea580c', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{t('market.truck_arriving', 'Truck Arriving')}</Text></View>
                  <Text style={{ fontWeight: '900', color: '#059669', fontSize: 20 }}>₹{order.totalAmount?.toLocaleString()}</Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4, letterSpacing: -0.5 }}>{order.listing?.quantity || 0} {t('market.tons_of', 'Tons of')} {order.listing?.residueType || 'Biomass'}</Text>
                <Text style={{ color: '#64748b', fontWeight: '600', marginBottom: 24, fontSize: 14 }}>{t('market.buyer', 'Buyer')}: {order.buyer?.companyDetails?.businessName}</Text>
                
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{t('market.enter_driver_otp', "Enter Driver's OTP to Release Funds")}</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TextInput 
                    style={{ flex: 1, backgroundColor: '#f8fafc', borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 20, textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: '900', color: '#0f172a' }}
                    maxLength={6} keyboardType="numeric" placeholder="••••••"
                    value={otpInput[order._id] || ''} onChangeText={(val) => setOtpInput({...otpInput, [order._id]: val.replace(/\D/g, '')})}
                  />
                  <TouchableOpacity onPress={() => handleVerifyOTP(order._id)} style={{ backgroundColor: '#ea580c', justifyContent: 'center', paddingHorizontal: 24, borderRadius: 20, elevation: 3 }}>
                    <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>{t('market.verify', 'Verify')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}