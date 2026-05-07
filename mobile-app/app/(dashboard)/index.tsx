import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Sun, Droplets, FlaskConical, Leaf, Scan, Store } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function DashboardOverview() {
  const [userName, setUserName] = useState('Farmer');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();

  const weather = { temp: 28, condition: "Partly Cloudy", humidity: 65, rainChance: 20 };
  const soil = { ph: 6.2, nitrogen: "Low", moisture: 42 };

  const advisorySlides = [
    {
      id: 1, tag: t('dashboard.slide1_tag', "Pest Alert"),
      title: t('dashboard.slide1_title', "Fall Armyworm Detected"),
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2, tag: t('dashboard.slide2_tag', "Weather"),
      title: t('dashboard.slide2_title', "Heavy Rainfall Expected"),
      img: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3, tag: t('dashboard.slide3_tag', "Market"),
      title: t('dashboard.slide3_title', "Biomass Demand Surging"),
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800"
    }
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('af_user');
        if (userData) setUserName(JSON.parse(userData).name?.split(' ')[0] || 'Farmer');
      } catch (e) {} finally { setLoading(false); }
    };
    loadUser();

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % advisorySlides.length;
        scrollViewRef.current?.scrollTo({ x: next * (width - 48), animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      {/* HEADER WITH LOGO */}
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Image source={require('../../assets/agrifuel_nexus_logo.png')} style={{ width: 44, height: 44, marginTop: 4 }} resizeMode="contain" />
          <View>
            <Text style={{ color: '#059669', fontWeight: '800', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              {t('dashboard.good_morning', 'Good Morning')}
            </Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: '#022c22', letterSpacing: -1 }}>
              {userName}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={{ height: 48, width: 48, backgroundColor: '#ffffff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }}>
          <Bell color="#0f172a" size={22} />
          <View style={{ position: 'absolute', top: 12, right: 12, height: 10, width: 10, backgroundColor: '#ef4444', borderRadius: 5, borderWidth: 2, borderColor: '#ffffff' }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* 1. AUTO-SLIDING ALERTS CARD */}
        <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
          <View style={{ backgroundColor: '#022c22', borderRadius: 32, overflow: 'hidden', height: 220, elevation: 5, shadowColor: '#064e3b', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setCurrentSlide(Math.round(e.nativeEvent.contentOffset.x / (width - 48)))}
              scrollEventThrottle={16}
            >
              {advisorySlides.map((slide) => (
                <View key={slide.id} style={{ width: width - 48, height: '100%', position: 'relative', backgroundColor: '#022c22' }}>
                  <Image source={{ uri: slide.img }} style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} />
                  <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  <View style={{ position: 'absolute', bottom: 24, left: 24, paddingRight: 24 }}>
                    <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8, borderWidth: 1, borderColor: '#34d399' }}>
                      <Text style={{ fontSize: 10, fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 }}>{slide.tag}</Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5, lineHeight: 28 }}>{slide.title}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 24, right: 24, flexDirection: 'row', gap: 6 }}>
              {advisorySlides.map((_, i) => (
                <View key={i} style={{ height: 6, borderRadius: 3, backgroundColor: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)', width: i === currentSlide ? 24 : 8 }} />
              ))}
            </View>
          </View>
        </View>

        {/* 2. SPLIT ROW: SCAN & WEATHER */}
        <View style={{ paddingHorizontal: 24, marginTop: 16, flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity 
            onPress={() => router.push('/detection')} 
            activeOpacity={0.8}
            style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: '#d1fae5', elevation: 2, shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, justifyContent: 'space-between', aspectRatio: 1 }}
          >
            <View style={{ height: 48, width: 48, backgroundColor: '#ecfdf5', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Scan color="#059669" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#022c22', marginBottom: 2 }}>{t('dashboard.run_ai_scan', 'AI Scan')}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b' }}>{t('dashboard.detect_diseases', 'Detect diseases')}</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1, backgroundColor: '#022c22', borderRadius: 32, padding: 20, elevation: 4, shadowColor: '#022c22', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, justifyContent: 'space-between', aspectRatio: 1, position: 'relative', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 50 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Sun color="#fbbf24" size={32} />
              <Text style={{ fontSize: 36, fontWeight: '900', color: '#ffffff', letterSpacing: -1 }}>{weather.temp}°</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 2 }}>{t('dashboard.climate_condition', weather.condition)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Droplets color="#60a5fa" size={12} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#a7f3d0' }}>{t('dashboard.humidity', 'Hum')}: {weather.humidity}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. MARKETPLACE HERO BANNER */}
        <View style={{ paddingHorizontal: 24, marginTop: 16 }}>
          <View style={{ backgroundColor: '#ecfdf5', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#a7f3d0', position: 'relative', overflow: 'hidden' }}>
            <Leaf size={140} color="#a7f3d0" style={{ position: 'absolute', right: -30, top: -20, opacity: 0.4, transform: [{ rotate: '15deg' }] }} />
            
            <View style={{ backgroundColor: '#ffffff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#059669', textTransform: 'uppercase', letterSpacing: 1 }}>{t('tabs.market', 'Marketplace')}</Text>
            </View>
            
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -0.5 }}>{t('market.monetize_title', 'Monetize Your Crop Residue.')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#065f46', marginBottom: 20, width: '80%', lineHeight: 18 }}>{t('market.sell_direct', 'Sell directly to biofuel refineries with zero middlemen. Get paid instantly.')}</Text>
            
            <TouchableOpacity onPress={() => router.push('/marketplace')} style={{ backgroundColor: '#059669', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
              <Store color="#ffffff" size={18} style={{ marginRight: 8 }} />
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>{t('market.open_market', 'Open Market')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. SOIL INTELLIGENCE */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}>
            <FlaskConical color="#022c22" size={20} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>{t('dashboard.soil_status', 'Soil Intelligence')}</Text>
          </View>
          
          <View style={{ backgroundColor: '#ffffff', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('dashboard.ph_level', 'pH Level')}</Text>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#059669', marginBottom: 8 }}>{soil.ph}</Text>
                <View style={{ backgroundColor: '#ecfdf5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#d1fae5' }}>
                  <Text style={{ fontSize: 9, fontWeight: '900', color: '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('dashboard.optimal', 'Optimal')}</Text>
                </View>
              </View>
              <View style={{ width: 1, backgroundColor: '#f1f5f9' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('dashboard.nitrogen', 'Nitrogen')}</Text>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#ef4444', marginBottom: 8 }}>{soil.nitrogen}</Text>
                <View style={{ backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#fee2e2' }}>
                  <Text style={{ fontSize: 9, fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('dashboard.low', 'Low')}</Text>
                </View>
              </View>
              <View style={{ width: 1, backgroundColor: '#f1f5f9' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('dashboard.moisture', 'Moisture')}</Text>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#2563eb', marginBottom: 8 }}>{soil.moisture}%</Text>
                <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#dbeafe' }}>
                  <Text style={{ fontSize: 9, fontWeight: '900', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('dashboard.good', 'Good')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}