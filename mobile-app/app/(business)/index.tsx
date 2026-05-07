import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, MapPin, ShieldCheck, Handshake, Search, X, Phone, Map as MapIcon, CheckCircle2, TrendingUp, Image as ImageIcon, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BusinessDashboard() {
  const [userName, setUserName] = useState('Corporate Buyer');
  const [listings, setListings] = useState<any[]>([]);
  const [sentOffers, setSentOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [buyingListing, setBuyingListing] = useState<any>(null);
  const [offeringListing, setOfferingListing] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  
  const [pickupDate, setPickupDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  const { t } = useTranslation();
  const categories = ['All', 'Rice Husk', 'Wheat Straw', 'Sugarcane Bagasse', 'Corn Stover'];

  useEffect(() => { 
    loadUser();
    fetchData(); 
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('af_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.companyDetails?.businessName || parsed.fullName || 'Corporate Buyer');
      }
    } catch (e) {}
  };

  const fetchData = async (background = false) => {
    if (background) setIsRefreshing(true);
    try {
      const [listRes, offerRes] = await Promise.all([
        api.get('/listings'),
        api.get('/transactions/buyer/offers')
      ]);
      setListings(listRes.data.filter((item: any) => item.status === 'available'));
      if (Array.isArray(offerRes.data)) setSentOffers(offerRes.data);
    } catch (error) { } 
    finally { setLoading(false); setIsRefreshing(false); }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice) return Alert.alert(t('common.error', 'Error'), t('market.enter_offer', 'Enter your offer price'));
    
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
      await api.post('/transactions/offer', { 
        listingId: tempOffer.listing._id, 
        offeredPricePerTon: tempOffer.offeredPricePerTon, 
        requestedQuantity: tempOffer.listing.quantity, 
        message: tempOffer.message 
      });
      Alert.alert(t('common.success', 'Success'), t('market.offer_sent', 'Offer sent to farmer!'));
      fetchData(true);
    } catch (error) { 
      Alert.alert(t('common.error', 'Error'), t('market.offer_failed', 'Failed to send offer.'));
      fetchData(true);
    }
  };

  const handleBuyNow = async () => {
    if (!pickupDate) return Alert.alert(t('common.error', 'Error'), t('market.select_date', 'Select a pickup date'));
    try {
      const res = await api.post('/transactions/book', { listingId: buyingListing._id, pickupDate });
      setBookingSuccess(res.data); setBuyingListing(null); fetchData(true); 
    } catch (error: any) { Alert.alert(t('common.error', 'Error'), error.response?.data?.message || t('market.book_failed', 'Payment failed.')); }
  };

  const activeOffers = sentOffers.filter(o => o.status === 'pending' || o.status === 'accepted');
  const activeOfferListingIds = activeOffers.map(o => typeof o.listing === 'object' ? o.listing._id : o.listing);

  const marketListings = listings.filter(listing => {
    if (activeOfferListingIds.includes(listing._id)) return false;
    const matchesType = filterType === 'All' || listing.residueType === filterType;
    const matchesSearch = listing.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) || listing.residueType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const marketKPIs = useMemo(() => {
    if (marketListings.length === 0) return { totalTons: 0, avgPrice: 0 };
    const totalTons = marketListings.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const avgPrice = marketListings.reduce((sum, item) => sum + (item.pricePerTon || 0), 0) / marketListings.length;
    return { totalTons: totalTons.toFixed(1), avgPrice: Math.round(avgPrice) };
  }, [marketListings]);

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      {/* HEADER & KPIs */}
      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <Image source={require('../../assets/agrifuel_nexus_logo.png')} style={{ width: 40, height: 40, marginTop: 4 }} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Text style={{ color: '#059669', fontWeight: '800', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('business.procurement', 'Procurement Portal')}
              </Text>
              {isRefreshing && <ActivityIndicator size="small" color="#94a3b8" />}
            </View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -1 }} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 16, padding: 12, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Package size={12} color="#64748b" style={{ marginRight: 6 }}/>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Market Vol</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0f172a' }}>{marketKPIs.totalTons} <Text style={{ fontSize: 12, color: '#94a3b8' }}>T</Text></Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 16, padding: 12, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <TrendingUp size={12} color="#64748b" style={{ marginRight: 6 }}/>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>Avg Price</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#0f172a' }}>₹{marketKPIs.avgPrice} <Text style={{ fontSize: 12, color: '#94a3b8' }}>/t</Text></Text>
          </View>
        </View>
        
        {/* Search & Filter */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 16, height: 48, marginBottom: 12 }}>
          <Search color="#94a3b8" size={18} />
          <TextInput placeholder={t('market.search_districts', 'Search locations...')} placeholderTextColor="#cbd5e1" value={searchQuery} onChangeText={setSearchQuery} style={{ flex: 1, marginLeft: 12, fontSize: 15, color: '#0f172a', fontWeight: '600' }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
          {categories.map(type => (
            <TouchableOpacity key={type} onPress={() => setFilterType(type)} style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filterType === type ? '#022c22' : '#f1f5f9' }}>
              <Text style={{ fontWeight: '800', fontSize: 12, color: filterType === type ? '#ffffff' : '#64748b' }}>{t(`market.${type.toLowerCase().replace(' ', '_')}`, type)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* ACTIVE NEGOTIATIONS */}
        {activeOffers.length > 0 && (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Handshake size={18} color="#3b82f6" style={{ marginRight: 8 }}/>
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 }}>{t('business.active_negotiations', 'Active Negotiations')}</Text>
            </View>
            
            {activeOffers.map(offer => {
              const listing = typeof offer.listing === 'object' ? offer.listing : listings.find(l => l._id === offer.listing);
              if (!listing) return null;
              const isAccepted = offer.status === 'accepted';

              return (
                <View key={offer._id} style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: isAccepted ? '#4ade80' : '#f1f5f9', marginBottom: 16, elevation: isAccepted ? 4 : 2, shadowColor: isAccepted ? '#22c55e' : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View style={{ height: 48, width: 48, borderRadius: 12, backgroundColor: '#f8fafc', overflow: 'hidden', marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' }}>
                        {/* FIX IS HERE: Color passed as prop to ImageIcon */}
                        {listing.images?.[0] ? <Image source={{ uri: listing.images[0] }} style={{ width: '100%', height: '100%' }} /> : <ImageIcon color="#cbd5e1" style={{ alignSelf: 'center', marginTop: 12 }} size={20}/>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a' }}>{listing.quantity}T {listing.residueType}</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b' }}>Offer: <Text style={{ color: '#0f172a', fontWeight: '900' }}>₹{offer.offeredPricePerTon}/t</Text> (Ask: ₹{listing.pricePerTon})</Text>
                      </View>
                    </View>

                    <View>
                      {isAccepted ? (
                        <TouchableOpacity onPress={() => setBuyingListing({...listing, pricePerTon: offer.offeredPricePerTon})} style={{ backgroundColor: '#059669', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 }}>
                          <ShieldCheck size={14} color="#ffffff" style={{ marginRight: 6 }}/>
                          <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 12 }}>Pay</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={{ backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center' }}>
                          <Clock size={12} color="#94a3b8" style={{ marginRight: 4 }}/>
                          <Text style={{ fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* LIVE MARKET GRID */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Package size={18} color="#94a3b8" style={{ marginRight: 8 }}/>
          <Text style={{ fontSize: 14, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 }}>{t('business.available_inventory', 'Available Inventory')}</Text>
        </View>

        {marketListings.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dashed' }}>
            <Package color="#cbd5e1" size={48} style={{ marginBottom: 16 }} />
            <Text style={{ fontWeight: '900', color: '#0f172a', fontSize: 18, marginBottom: 4 }}>Market Empty</Text>
            <Text style={{ fontWeight: '600', color: '#64748b', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 }}>No matching listings found outside of your active negotiations.</Text>
          </View>
        ) : (
          marketListings.map((listing) => (
            <View key={listing._id} style={{ backgroundColor: '#ffffff', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 3, marginBottom: 24, overflow: 'hidden' }}>
              <View style={{ height: 140, width: '100%', backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                {/* FIX IS HERE: Color passed as prop to ImageIcon */}
                {listing.images?.[0] ? (
                  <Image source={{ uri: listing.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ImageIcon color="#cbd5e1" size={32} /></View>
                )}
                <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }}>{listing.residueType}</Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', letterSpacing: -1 }}>{listing.quantity}<Text style={{ fontSize: 16, color: '#64748b' }}>T</Text></Text>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#022c22' }}>₹{listing.pricePerTon}<Text style={{ fontSize: 12, color: '#64748b' }}>/t</Text></Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <MapPin color="#94a3b8" size={14} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569' }}>{listing.location?.village || 'Unknown'}, {listing.location?.district || 'Unknown'}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity onPress={() => setOfferingListing(listing)} style={{ flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#0f172a', fontWeight: '900', fontSize: 14 }}>{t('market.offer', 'Make Offer')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setBuyingListing(listing)} style={{ flex: 1, backgroundColor: '#022c22', paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#064e3b', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 10 }}>
                      <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 14 }}>{t('market.buy_now', 'Buy Now')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ESCROW MODAL */}
      <Modal visible={!!buyingListing} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: 48 }}>
            <TouchableOpacity onPress={() => setBuyingListing(null)} style={{ position: 'absolute', top: 24, right: 24, padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20 }}><X color="#64748b" size={20}/></TouchableOpacity>
            
            <View style={{ height: 48, width: 48, backgroundColor: '#f1f5f9', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><ShieldCheck color="#0f172a" size={24} /></View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('market.escrow_checkout', 'Escrow Checkout')}</Text>
            <Text style={{ color: '#64748b', fontWeight: '600', marginBottom: 24 }}>{t('market.escrow_desc', 'Funds are held securely and released upon OTP verification at pickup.')}</Text>
            
            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{t('market.total_payable', 'Total Payable')}</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#022c22' }}>₹{(buyingListing?.quantity * buyingListing?.pricePerTon).toLocaleString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{t('market.supplier', 'Supplier')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckCircle2 color="#059669" size={16} style={{ marginRight: 6 }}/>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>{buyingListing?.farmer?.fullName || "Verified Farmer"}</Text>
                </View>
              </View>
            </View>

            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('market.pickup_date', 'Pickup Date (YYYY-MM-DD)')}</Text>
            <TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#cbd5e1" value={pickupDate} onChangeText={setPickupDate} style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, fontWeight: '700', fontSize: 16, color: '#0f172a' }} />
            
            <TouchableOpacity onPress={handleBuyNow} style={{ width: '100%', paddingVertical: 20, backgroundColor: '#022c22', borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: '#064e3b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5 }}>
              <ShieldCheck color="#ffffff" size={18} style={{ marginRight: 8 }}/>
              <Text style={{ fontWeight: '900', color: '#ffffff', fontSize: 18 }}>{t('market.pay_securely', 'Pay Securely')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OFFER MODAL */}
      <Modal visible={!!offeringListing} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: 48 }}>
            <TouchableOpacity onPress={() => setOfferingListing(null)} style={{ position: 'absolute', top: 24, right: 24, padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20 }}><X color="#64748b" size={20}/></TouchableOpacity>

            <View style={{ height: 48, width: 48, backgroundColor: '#f1f5f9', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Handshake color="#0f172a" size={24} /></View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('market.negotiate_price', 'Negotiate Price')}</Text>
            <Text style={{ color: '#64748b', fontWeight: '600', marginBottom: 24 }}>{t('market.asking_price', 'Asking Price')}: <Text style={{ color: '#0f172a', fontWeight: '900' }}>₹{offeringListing?.pricePerTon?.toLocaleString()}/t</Text></Text>
            
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('market.your_offer', 'Your Offer (₹/Ton)')}</Text>
            <TextInput placeholder="0.00" placeholderTextColor="#cbd5e1" keyboardType="numeric" value={offerPrice} onChangeText={setOfferPrice} style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16, fontWeight: '900', fontSize: 24, color: '#0f172a', textAlign: 'center' }} />
            
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('market.message_opt', 'Message (Optional)')}</Text>
            <TextInput placeholder="E.g. We can pick up tomorrow." placeholderTextColor="#cbd5e1" value={offerMessage} onChangeText={setOfferMessage} style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24, fontWeight: '600', fontSize: 15, color: '#0f172a', height: 100, textAlignVertical: 'top' }} multiline />
            
            <TouchableOpacity onPress={handleMakeOffer} style={{ width: '100%', paddingVertical: 20, backgroundColor: '#022c22', borderRadius: 20, alignItems: 'center', shadowColor: '#064e3b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5 }}>
              <Text style={{ fontWeight: '900', color: '#ffffff', fontSize: 18 }}>{t('market.submit_offer', 'Submit Offer')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={!!bookingSuccess} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#ffffff', borderRadius: 40, padding: 32, alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, backgroundColor: '#ecfdf5', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <ShieldCheck color="#059669" size={40} />
            </View>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('market.escrow_secured', 'Escrow Secured!')}</Text>
            <Text style={{ color: '#64748b', fontWeight: '600', marginBottom: 32, textAlign: 'center' }}>{t('market.present_pin', 'Present this PIN to the farmer upon arrival to complete the transaction.')}</Text>
            
            <View style={{ backgroundColor: '#022c22', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 24, marginBottom: 32 }}>
              <Text style={{ fontSize: 40, color: '#ffffff', fontWeight: '900', letterSpacing: 8 }}>{bookingSuccess?.pickupOTP}</Text>
            </View>
            
            <View style={{ width: '100%', backgroundColor: '#f8fafc', padding: 20, borderRadius: 24, marginBottom: 32, borderWidth: 1, borderColor: '#f1f5f9' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Phone size={16} color="#059669" style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: '800', color: '#0f172a', fontSize: 16 }}>{bookingSuccess?.farmerDetails?.mobile}</Text>
              </View>
              <Text style={{ color: '#64748b', fontSize: 14, fontWeight: '600', marginLeft: 24 }}>{bookingSuccess?.farmerDetails?.village}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
              <TouchableOpacity onPress={() => Linking.openURL(`http://maps.google.com/?q=${bookingSuccess?.farmerDetails?.coordinates?.lat},${bookingSuccess?.farmerDetails?.coordinates?.lng}`)} style={{ flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 18, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                <MapIcon color="#0f172a" size={18} style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: '900', color: '#0f172a', fontSize: 16 }}>{t('market.map', 'Map')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBookingSuccess(null)} style={{ flex: 1, paddingVertical: 18, backgroundColor: '#059669', borderRadius: 20, alignItems: 'center' }}>
                <Text style={{ fontWeight: '900', color: '#ffffff', fontSize: 16 }}>{t('market.done', 'Done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}