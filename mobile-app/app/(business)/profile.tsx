import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Building2, Mail, ShieldCheck, LogOut, ChevronRight, Globe, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

export default function BusinessProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [showLangModal, setShowLangModal] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('af_user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('preferredLanguage', lang);
    setShowLangModal(false);
  };

  const handleLogout = () => {
    Alert.alert(t('profile.secure_logout', 'Secure Logout'), t('profile.logout_confirm', 'Are you sure you want to log out?'), [
      { text: t('common.cancel', 'Cancel'), style: "cancel" },
      { 
        text: t('profile.log_out', 'Log Out'), style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem('af_token');
          await AsyncStorage.removeItem('af_user');
          router.replace('/login');
        }
      }
    ]);
  };

  if (!user) return <View style={{ flex: 1, backgroundColor: '#FAFCFF' }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        
        {/* User Card */}
        <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
          <View style={{ width: 120, height: 120, backgroundColor: '#eff6ff', borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 4, borderColor: '#ffffff', elevation: 3 }}>
            <Building2 color="#2563eb" size={50} />
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#022c22', letterSpacing: -0.5, textAlign: 'center' }}>{user.companyDetails?.businessName || user.fullName}</Text>
          <View style={{ backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 12 }}>
            <Text style={{ fontSize: 10, color: '#1d4ed8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }}>{t('profile.verified_business', 'Verified Business')}</Text>
          </View>
        </View>

        {/* Settings Info */}
        <View style={{ backgroundColor: 'white', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden', elevation: 2, marginBottom: 24 }}>
          
          <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: '#f8fafc', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#f1f5f9', padding: 12, borderRadius: 16, marginRight: 16 }}><Mail color="#475569" size={24} /></View>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('profile.email', 'Email')}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{user.email}</Text>
            </View>
          </View>

          <View style={{ padding: 24, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderRadius: 16, marginRight: 16 }}><ShieldCheck color="#059669" size={24} /></View>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('profile.security', 'Security')}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{t('profile.enterprise_protected', 'Enterprise Protected')}</Text>
            </View>
          </View>
        </View>

        {/* Settings Links */}
        <View style={{ backgroundColor: 'white', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden', elevation: 2 }}>
          
          <TouchableOpacity onPress={() => setShowLangModal(true)} style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: '#f8fafc', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#f1f5f9', padding: 12, borderRadius: 16, marginRight: 16 }}><Globe color="#475569" size={24} /></View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{t('profile.app_language', 'App Language')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '900', color: '#059669', marginRight: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{i18n.language}</Text>
              <ChevronRight color="#cbd5e1" size={20} />
            </View>
          </TouchableOpacity>

        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 40, backgroundColor: '#fef2f2', borderColor: '#fee2e2', borderWidth: 2, padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut color="#dc2626" size={20} style={{ marginRight: 8 }} />
          <Text style={{ color: '#b91c1c', fontWeight: '900', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{t('profile.secure_logout', 'Secure Logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* LANGUAGE MODAL */}
      <Modal visible={showLangModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: Platform.OS === 'ios' ? 48 : 32 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', marginBottom: 24, color: '#022c22', letterSpacing: -0.5 }}>{t('profile.select_language', 'Select Language')}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity 
                key={lang} onPress={() => changeLanguage(lang)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
              >
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