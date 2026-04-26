import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, Truck, CheckCircle2, AlertTriangle, Bell, Plus, History, TrendingUp, MessageSquare, Image as ImageIcon, Package, X, Phone, Map as MapIcon } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../src/services/api';

export default function FarmerListingsScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [unbookedListings, setUnbookedListings] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});

  const [showForm, setShowForm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [residueType, setResidueType] = useState('');
  const [customResidue, setCustomResidue] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const residueOptions = ['Rice Husk', 'Wheat Straw', 'Sugarcane Bagasse', 'Corn Stover', 'Other'];

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  useEffect(() => {
    const fetchBenchmark = async () => {
      const typeToCheck = residueType === 'Other' ? customResidue : residueType;
      if (typeToCheck && residueType !== 'Other') {
        try {
          const userStr = await AsyncStorage.getItem('af_user');
          const state = JSON.parse(userStr || '{}').address?.state || "Maharashtra";
          const res = await api.get(`/listings/benchmark?residueType=${typeToCheck}&state=${state}`);
          if (res.data && res.data.avgPrice > 0) setBenchmark(res.data);
          else setBenchmark(null);
        } catch (error) { setBenchmark(null); }
      } else { setBenchmark(null); }
    };
    fetchBenchmark();
  }, [residueType, customResidue]);

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

  const pickImage = async () => {
    if (images.length >= 2) return Alert.alert("Limit Reached", "Max 2 photos allowed.");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 2 - images.length,
      base64: true, 
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(a => `data:image/jpeg;base64,${a.base64}`);
      setImages([...images, ...newImages].slice(0, 2));
    }
  };

  const removeImage = (indexToRemove: number) => { setImages(images.filter((_, index) => index !== indexToRemove)); };

  const handleCreateListing = async () => {
    const finalResidueType = residueType === 'Other' ? customResidue : residueType;
    if (!finalResidueType || !quantity || !pricePerTon) return Alert.alert("Error", "Fill all required fields");
    
    setIsLocating(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setIsLocating(false);
      return Alert.alert('Permission Denied', 'Allow location access to post.');
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      await api.post('/listings', { 
        residueType: finalResidueType, quantity: Number(quantity), pricePerTon: Number(pricePerTon),
        description, images, coordinates: { lat: location.coords.latitude, lng: location.coords.longitude }
      });
      setShowForm(false);
      setResidueType(''); setCustomResidue(''); setQuantity(''); setPricePerTon(''); setDescription(''); setImages([]);
      Alert.alert("Success", "Listing published successfully!");
      fetchData();
    } catch (error) { Alert.alert("Error", "Could not create listing"); } finally { setIsLocating(false); }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'reject') => {
    try {
      await api.put(`/transactions/offers/${offerId}/${action}`);
      Alert.alert("Success", `Offer ${action}ed.`); fetchData();
    } catch (error) { Alert.alert("Error", "Failed to process offer."); }
  };

  const handleVerifyOTP = async (orderId: string) => {
    const submittedOtp = otpInput[orderId];
    if (!submittedOtp || submittedOtp.length !== 6) return Alert.alert("Error", "Enter 6-digit OTP");
    try {
      await api.post('/transactions/verify-otp', { orderId, submittedOtp });
      Alert.alert("Success! 🎉", "Funds have been released to your account.");
      setOtpInput({...otpInput, [orderId]: ''}); fetchData();
    } catch (error: any) { Alert.alert("Failed", error.response?.data?.message || "Invalid OTP"); }
  };

  if (loading) return <View style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#16a34a" /></View>;

  const pendingPickups = orders.filter(o => o.status === 'funds_in_escrow');
  const completedPickups = orders.filter(o => o.status === 'completed');
  const pendingOffers = offers.filter(o => o.status === 'pending');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827' }}>My Listings</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity style={{ padding: 8, position: 'relative' }}>
            <Bell color="#4b5563" size={24} />
            {pendingPickups.length > 0 ? <View style={{ position: 'absolute', top: 4, right: 8, height: 12, width: 12, backgroundColor: '#ef4444', borderRadius: 6, borderWidth: 2, borderColor: '#ffffff' }} /> : null}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={{ height: 40, width: 40, backgroundColor: '#f0fdf4', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#dcfce7' }}>
            <Plus color="#16a34a" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {showForm ? (
          <View style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 24 }}>
            <Text style={{ fontWeight: '900', fontSize: 20, color: '#111827', marginBottom: 20 }}>Create New Listing</Text>
            
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Residue Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, flexDirection: 'row' }}>
              {residueOptions.map(type => (
                <TouchableOpacity key={type} onPress={() => { setResidueType(type); setCustomResidue(''); }} style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, backgroundColor: residueType === type ? '#111827' : '#f9fafb', borderColor: residueType === type ? '#111827' : '#e5e7eb' }}>
                  <Text style={{ fontWeight: '700', color: residueType === type ? '#ffffff' : '#4b5563' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {residueType === 'Other' ? (
              <TextInput style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontWeight: '700', color: '#111827', fontSize: 16, marginBottom: 20 }} placeholder="Specify crop waste..." value={customResidue} onChangeText={setCustomResidue} />
            ) : null}

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Quantity (Tons) *</Text>
                <TextInput style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontWeight: '700', color: '#111827', fontSize: 16 }} placeholder="e.g. 5.5" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Price (₹/Ton) *</Text>
                <TextInput style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontWeight: '700', color: '#111827', fontSize: 16 }} placeholder="0.00" keyboardType="numeric" value={pricePerTon} onChangeText={setPricePerTon} />
              </View>
            </View>

            {(benchmark && residueType !== 'Other') ? (
              <View style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#dcfce7', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <TrendingUp color="#16a34a" size={16} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#166534' }}>State Average: ₹{benchmark.avgPrice.toFixed(0)}/t</Text>
              </View>
            ) : null}

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Add Photos (Max 2)</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {images.length < 2 ? (
                <TouchableOpacity onPress={pickImage} style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', borderRadius: 12, height: 80, width: 80, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon color="#9ca3af" size={20} style={{ marginBottom: 4 }} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#9ca3af' }}>Upload</Text>
                </TouchableOpacity>
              ) : null}
              {images.map((img, idx) => (
                <View key={idx} style={{ height: 80, width: 80, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' }}>
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                  <TouchableOpacity onPress={() => removeImage(idx)} style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', borderRadius: 12, padding: 4 }}><X color="white" size={10} /></TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Description (Optional)</Text>
            <TextInput style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontWeight: '500', color: '#111827', height: 96, fontSize: 16, marginBottom: 24 }} placeholder="Condition, access..." multiline textAlignVertical="top" value={description} onChangeText={setDescription} />
            
            <TouchableOpacity onPress={handleCreateListing} disabled={isLocating} style={{ backgroundColor: '#111827', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>{isLocating ? "Processing..." : "Post Listing"}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ZONE 1: OFFERS INBOX */}
        {pendingOffers.length > 0 ? (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <MessageSquare size={14} color="#2563eb" style={{ marginRight: 6 }}/>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.5 }}>Incoming Offers</Text>
            </View>
            
            {pendingOffers.map(offer => {
              const diff = offer.offeredPricePerTon - (offer.listing?.pricePerTon || 0);
              const isHigher = diff >= 0;

              return (
                <View key={offer._id} style={{ backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb', padding: 20, marginBottom: 16, overflow: 'hidden' }}>
                  <View style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '200%', backgroundColor: isHigher ? '#22c55e' : '#ef4444' }}></View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, paddingLeft: 8 }}>
                    <Text style={{ fontWeight: '700', color: '#111827', fontSize: 16 }}>{offer.company?.companyDetails?.businessName || 'Buyer'}</Text>
                    <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#4b5563', textTransform: 'uppercase' }}>Wants {offer.requestedQuantity}T</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 12, paddingLeft: 8 }}>
                    <Text style={{ fontSize: 30, fontWeight: '900', color: '#111827' }}>₹{offer.offeredPricePerTon}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', marginBottom: 4, color: isHigher ? '#16a34a' : '#dc2626' }}>
                      {isHigher ? '+' : ''}{diff} vs asking
                    </Text>
                  </View>

                  {offer.message ? <Text style={{ fontSize: 14, color: '#6b7280', fontStyle: 'italic', marginBottom: 20, paddingLeft: 8 }}>"{offer.message}"</Text> : null}

                  <View style={{ flexDirection: 'row', gap: 12, paddingLeft: 8 }}>
                    <TouchableOpacity onPress={() => handleOfferAction(offer._id, 'reject')} style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
                      <Text style={{ color: '#374151', fontWeight: '700' }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOfferAction(offer._id, 'accept')} style={{ flex: 1, backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
                      <Text style={{ color: '#ffffff', fontWeight: '700' }}>Accept Offer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </View>
        ) : null}

        {/* ZONE 2: OTP ACTION REQUIRED */}
        {pendingPickups.length > 0 ? (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <AlertTriangle size={14} color="#ea580c" style={{ marginRight: 6 }}/>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 0.5 }}>Action Required</Text>
            </View>
            
            {pendingPickups.map(order => (
              <View key={order._id} style={{ backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 2, borderColor: '#fdba74', marginBottom: 16, overflow: 'hidden' }}>
                <View style={{ backgroundColor: '#fff7ed', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ffedd5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}><Truck size={18} color="#ea580c" style={{ marginRight: 6 }}/><Text style={{ fontWeight: '900', color: '#7c2d12' }}>Truck Arriving</Text></View>
                  <Text style={{ fontWeight: '900', color: '#16a34a', fontSize: 18 }}>₹{order.totalAmount?.toLocaleString()}</Text>
                </View>
                
                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 4 }}>{order.listing?.quantity || 0} Tons of {order.listing?.residueType || 'Biomass'}</Text>
                  <Text style={{ color: '#6b7280', fontWeight: '500', marginBottom: 20, fontSize: 14 }}>Buyer: {order.buyer?.companyDetails?.businessName || 'Corporate Buyer'}</Text>
                  
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#4b5563', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Enter Driver's OTP</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TextInput 
                      style={{ flex: 1, backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#e5e7eb', borderRadius: 12, textAlign: 'center', fontSize: 24, letterSpacing: 6, fontWeight: '900', color: '#111827' }}
                      maxLength={6} keyboardType="numeric" placeholder="••••••"
                      value={otpInput[order._id] || ''} onChangeText={(val) => setOtpInput({...otpInput, [order._id]: val.replace(/\D/g, '')})}
                    />
                    <TouchableOpacity onPress={() => handleVerifyOTP(order._id)} style={{ backgroundColor: '#ea580c', justifyContent: 'center', paddingHorizontal: 24, borderRadius: 12 }}>
                      <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* ZONE 3: ACTIVE INVENTORY */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Package size={14} color="#6b7280" style={{ marginRight: 6 }}/>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Inventory</Text>
          </View>
          
          {unbookedListings.length === 0 ? (
            <View style={{ backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed', padding: 32, alignItems: 'center' }}>
              <Text style={{ color: '#9ca3af', fontWeight: '500' }}>No active listings on the market.</Text>
            </View>
          ) : (
            unbookedListings.map(listing => (
              <View key={listing._id} style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <View style={{ backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 }}><Text style={{ fontSize: 10, fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: 0.5 }}>{listing.residueType}</Text></View>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>{listing.quantity} <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>Tons</Text></Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Asking</Text>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#111827' }}>₹{listing.pricePerTon}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ZONE 4: COMPLETED HISTORY */}
        {completedPickups.length > 0 ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <History size={14} color="#6b7280" style={{ marginRight: 6 }}/>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Transaction History</Text>
            </View>
            {completedPickups.map(order => (
              <View key={order._id} style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}><CheckCircle2 size={12} color="#16a34a" /><Text style={{ fontSize: 10, fontWeight: '700', color: '#15803d', textTransform: 'uppercase', letterSpacing: 0.5 }}>Paid</Text></View>
                  <Text style={{ fontWeight: '700', color: '#111827', fontSize: 14 }}>{order.listing?.quantity || 0}T {order.listing?.residueType || 'Unknown'}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#16a34a' }}>+₹{order.totalAmount?.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}