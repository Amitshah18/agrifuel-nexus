import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Modal, Platform, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Scan, TrendingUp, ShieldCheck, Globe, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLangModal, setShowLangModal] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('preferredLanguage', lang);
    setShowLangModal(false);
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const slides = [
    {
      id: 1, icon: <Scan size={70} color="#059669" />,
      title: t('welcome.slide1_title', 'Farm Smarter with AI'),
      desc: t('welcome.slide1_desc', 'Instantly diagnose crop diseases using your smartphone camera right in the field.'),
      bg: 'bg-emerald-50', border: 'border-emerald-100'
    },
    {
      id: 2, icon: <TrendingUp size={70} color="#2563eb" />,
      title: t('welcome.slide2_title', 'Direct B2B Marketplace'),
      desc: t('welcome.slide2_desc', 'Bypass middlemen. Sell your crop residue directly to industrial biofuel refineries.'),
      bg: 'bg-blue-50', border: 'border-blue-100'
    },
    {
      id: 3, icon: <ShieldCheck size={70} color="#0d9488" />,
      title: t('welcome.slide3_title', '100% Secure Escrow'),
      desc: t('welcome.slide3_desc', 'Funds are locked safely before pickup and released instantly via a driver OTP.'),
      bg: 'bg-teal-50', border: 'border-teal-100'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
      
      {/* 1. Header (Logo & Language) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image source={require('../assets/agrifuel_nexus_logo_no-background.png')} style={{ width: 32, height: 32 }} resizeMode="contain" />
          <Text style={{ fontWeight: '900', fontSize: 20, color: '#022c22', letterSpacing: -0.5 }}>{t('common.app_name', 'AgriFuel Nexus')}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setShowLangModal(true)} 
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
        >
          <Globe color="#475569" size={16} />
          <Text style={{ color: '#334155', fontWeight: '800', fontSize: 10, marginLeft: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            {i18n.language ? i18n.language.substring(0, 3) : 'ENG'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Swipeable Onboarding Carousel */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1, marginTop: 24 }}>
        {slides.map((slide) => (
          <View key={slide.id} style={{ width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 40 }}>
            <View style={{ width: 224, height: 224, borderRadius: 112, alignItems: 'center', justifyContent: 'center', marginBottom: 48, backgroundColor: slide.id === 1 ? '#ecfdf5' : slide.id === 2 ? '#eff6ff' : '#f0fdfa', borderWidth: 1, borderColor: slide.id === 1 ? '#d1fae5' : slide.id === 2 ? '#dbeafe' : '#ccfbf1' }}>
              <View style={{ width: 160, height: 160, backgroundColor: '#ffffff', borderRadius: 80, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 30, elevation: 5, borderWidth: 1, borderColor: '#ffffff' }}>
                {slide.icon}
              </View>
            </View>
            
            <Text style={{ fontSize: 32, fontWeight: '900', textAlign: 'center', color: '#022c22', marginBottom: 16, letterSpacing: -1, lineHeight: 38 }}>{slide.title}</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#64748b', fontWeight: '500', lineHeight: 24, paddingHorizontal: 8 }}>{slide.desc}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 3. Bottom Action Area (Pagination & Buttons) */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 24, backgroundColor: '#ffffff', borderTopLeftRadius: 48, borderTopRightRadius: 48, shadowColor: '#000', shadowOffset: { width: 0, height: -20 }, shadowOpacity: 0.03, shadowRadius: 40, elevation: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
        
        {/* Pagination Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <View key={i} style={{ height: 8, borderRadius: 4, backgroundColor: i === activeIndex ? '#059669' : '#e2e8f0', width: i === activeIndex ? 32 : 8 }} />
          ))}
        </View>

        <TouchableOpacity onPress={() => router.push('/signup')} activeOpacity={0.8} style={{ width: '100%', backgroundColor: '#022c22', paddingVertical: 18, borderRadius: 24, alignItems: 'center', shadowColor: '#064e3b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5, marginBottom: 16 }}>
          <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18 }}>{t('auth.create_account', 'Create Free Account')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.8} style={{ width: '100%', paddingVertical: 18, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
          <Text style={{ color: '#059669', fontWeight: '900', fontSize: 18 }}>{t('auth.sign_in', 'Log In to Dashboard')}</Text>
        </TouchableOpacity>
      </View>

      {/* LANGUAGE MODAL */}
      <Modal visible={showLangModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: Platform.OS === 'ios' ? 48 : 32 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 24, color: '#022c22' }}>{t('profile.select_language', 'Select Language')}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity key={lang} onPress={() => changeLanguage(lang)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <Text style={{ fontSize: 18, fontWeight: i18n.language === lang ? '900' : '600', color: i18n.language === lang ? '#059669' : '#334155' }}>{lang}</Text>
                {i18n.language === lang && <Check color="#059669" size={24} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowLangModal(false)} style={{ marginTop: 32, alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}