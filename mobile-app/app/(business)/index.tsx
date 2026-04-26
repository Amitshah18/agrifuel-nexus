import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, IndianRupee, ShieldCheck, Handshake, Filter, Search, Phone, Map as MapIcon, CheckCircle2 } from 'lucide-react-native';
import api from '../../src/services/api';

export default function BusinessMarketplaceScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingListing, setBuyingListing] = useState<any>(null);
  const [offeringListing, setOfferingListing] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const residueTypes = ['All', 'Rice Husk', 'Wheat Straw', 'Sugarcane Bagasse', 'Corn Stover'];

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/listings');
      setListings(res.data.filter((item: any) => item.status === 'available'));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleBuyNow = async () => {
    if (!pickupDate) return Alert.alert("Error", "Enter a pickup date.");
    try {
      const res = await api.post('/transactions/book', { listingId: buyingListing._id, pickupDate });
      setBookingSuccess(res.data);
      setBuyingListing(null);
      fetchListings();
    } catch (error: any) { Alert.alert("Error", error.response?.data?.message || "Failed to book."); }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice) return Alert.alert("Error", "Enter your offer price.");
    try {
      await api.post('/transactions/offer', {
        listingId: offeringListing._id,
        offeredPricePerTon: Number(offerPrice),
        requestedQuantity: offeringListing.quantity,
        message: offerMessage
      });
      Alert.alert("Success", "Offer sent to farmer!");
      setOfferingListing(null); setOfferPrice(''); setOfferMessage('');
    } catch (error) { Alert.alert("Error", "Failed to send offer."); }
  };

  const calculateMatchScore = (listing: any) => {
    let score = 70;
    if (listing.quantity >= 10) score += 15;
    if (listing.pricePerTon <= 5000) score += 10;
    return Math.min(score, 99);
  };

  const filteredListings = listings.filter(listing => {
    const matchesType = filterType === 'All' || listing.residueType === filterType;
    const matchesSearch = listing.location?.district?.toLowerCase().includes(searchQuery.toLowerCase()) || '';
    return matchesType && matchesSearch;
  });

  if (loading) return <View className="flex-1 items-center justify-center bg-gray-50"><ActivityIndicator size="large" color="#2563eb" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      
      <View className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-2xl font-black text-gray-900 mb-4">Procurement</Text>
        
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-1 mb-4">
          <Search color="#9ca3af" size={18} />
          <TextInput placeholder="Search districts..." value={searchQuery} onChangeText={setSearchQuery} className="flex-1 h-10 ml-2 font-medium text-gray-900" />
        </View>

        <View className="flex-row items-center">
          <Filter color="#2563eb" size={16} className="mr-3" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {residueTypes.map(type => (
              <TouchableOpacity key={type} onPress={() => setFilterType(type)} className={`mr-2 px-4 py-2 rounded-full border ${filterType === type ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                <Text className={`font-bold text-xs ${filterType === type ? 'text-white' : 'text-gray-600'}`}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {filteredListings.length === 0 ? (
          <View className="items-center justify-center py-12"><Text className="font-bold text-gray-500 text-base">No listings match your filter.</Text></View>
        ) : (
          filteredListings.map((listing) => {
            const matchScore = calculateMatchScore(listing);
            return (
              <View key={listing._id} className="bg-white rounded-3xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
                
                {listing.images && listing.images.length > 0 && (
                  <Image source={{ uri: listing.images[0] }} className="w-full h-40" resizeMode="cover" />
                )}

                <View className="p-5">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                      <Text className="text-blue-700 font-bold text-[10px] uppercase tracking-wider">{listing.residueType}</Text>
                    </View>
                    <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-md border border-green-100">
                      <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></View>
                      <Text className="text-green-700 font-bold text-[10px] uppercase tracking-wider">{matchScore}% Match</Text>
                    </View>
                  </View>

                  <Text className="text-3xl font-black text-gray-900 mb-2">{listing.quantity} <Text className="text-base text-gray-500 font-bold">Tons</Text></Text>
                  
                  {listing.description ? (
                    <Text className="text-xs text-gray-600 mb-4" numberOfLines={2}>"{listing.description}"</Text>
                  ) : (
                    <Text className="text-xs text-gray-400 italic mb-4">No additional details provided.</Text>
                  )}

                  <View className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center"><IndianRupee color="#3b82f6" size={16} /><Text className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1.5">Asking Price</Text></View>
                    <Text className="font-black text-gray-900 text-lg">₹{listing.pricePerTon}<Text className="text-xs text-gray-500 font-bold">/t</Text></Text>
                  </View>

                  <View className="flex-row items-center p-2 mb-4">
                    <MapPin color="#9ca3af" size={16} />
                    <Text className="ml-2 font-medium text-sm text-gray-700">{listing.location?.village || 'Unknown'}, {listing.location?.district || 'Unknown'}</Text>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => setOfferingListing(listing)} className="flex-1 bg-blue-50 py-3.5 rounded-xl flex-row items-center justify-center active:bg-blue-100">
                        <Handshake color="#1d4ed8" size={16} /><Text className="text-blue-700 font-bold ml-1.5 text-sm">Offer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setBuyingListing(listing)} className="flex-1 bg-gray-900 py-3.5 rounded-xl flex-row items-center justify-center shadow-sm active:bg-gray-800">
                        <ShieldCheck color="#ffffff" size={16} /><Text className="text-white font-bold ml-1.5 text-sm">Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>

      {/* MODALS */}
      <Modal visible={!!buyingListing} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 pb-12">
            <Text className="text-2xl font-black text-gray-900 mb-2">Escrow Checkout</Text>
            <Text className="text-gray-500 mb-6">Total Due: ₹{(buyingListing?.quantity * buyingListing?.pricePerTon).toLocaleString()}</Text>
            <TextInput placeholder="Pickup Date (YYYY-MM-DD)" value={pickupDate} onChangeText={setPickupDate} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 font-medium"/>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => setBuyingListing(null)} className="flex-1 py-4 bg-gray-100 rounded-xl items-center"><Text className="font-bold text-gray-600">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleBuyNow} className="flex-1 py-4 bg-blue-600 rounded-xl items-center"><Text className="font-bold text-white">Pay Securely</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!offeringListing} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 pb-12">
            <Text className="text-2xl font-black text-gray-900 mb-2">Make an Offer</Text>
            <Text className="text-gray-500 mb-6">Asking Price: ₹{offeringListing?.pricePerTon}/ton</Text>
            <TextInput placeholder="Your Offer (₹/Ton)" keyboardType="numeric" value={offerPrice} onChangeText={setOfferPrice} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3 font-black text-xl text-center"/>
            <TextInput placeholder="Message (Optional)" value={offerMessage} onChangeText={setOfferMessage} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 font-medium h-20" multiline/>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => setOfferingListing(null)} className="flex-1 py-4 bg-gray-100 rounded-xl items-center"><Text className="font-bold text-gray-600">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleMakeOffer} className="flex-1 py-4 bg-gray-900 rounded-xl items-center"><Text className="font-bold text-white">Send Offer</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!bookingSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/80 justify-center p-6">
          <View className="bg-white rounded-3xl p-8 items-center">
            <ShieldCheck color="#2563eb" size={48} className="mb-4" />
            <Text className="text-2xl font-black text-gray-900 mb-2">Secured in Escrow!</Text>
            <Text className="text-gray-500 font-medium mb-6 text-center">Give this OTP to the farmer when you arrive.</Text>
            <View className="bg-gray-900 py-4 px-8 rounded-2xl mb-6"><Text className="text-4xl text-white font-black tracking-[8px]">{bookingSuccess?.pickupOTP}</Text></View>
            <View className="w-full bg-blue-50 p-4 rounded-xl mb-6">
              <Text className="font-bold text-blue-900 mb-1 flex-row items-center"><Phone size={14}/> {bookingSuccess?.farmerDetails?.mobile}</Text>
              <Text className="text-blue-800 text-sm">{bookingSuccess?.farmerDetails?.village}</Text>
            </View>
            <View className="flex-row gap-4 w-full">
              {/* FIXED: Official Google Maps Search URL format */}
              <TouchableOpacity 
                onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${bookingSuccess?.farmerDetails?.coordinates?.lat},${bookingSuccess?.farmerDetails?.coordinates?.lng}`)} 
                className="flex-1 bg-blue-600 py-4 rounded-xl items-center flex-row justify-center active:bg-blue-700"
              >
                <MapIcon color="white" size={16}/>
                <Text className="font-bold text-white ml-2 text-base">Map</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBookingSuccess(null)} className="flex-1 py-4 bg-gray-100 rounded-xl items-center"><Text className="font-bold text-gray-600 text-base">Done</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}