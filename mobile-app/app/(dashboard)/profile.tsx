import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCircle, LogOut, ChevronRight, Globe, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [showLangModal, setShowLangModal] = useState(false);
  
  const { t, i18n } = useTranslation(); // 👈 USE TRANSLATION HOOK

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
    Alert.alert(t('profile.secure_logout'), t('profile.logout_confirm'), [
      { text: t('common.cancel'), style: "cancel" },
      { 
        text: t('profile.log_out'), style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem('af_token');
          await AsyncStorage.removeItem('af_user');
          router.replace('/login');
        }
      }
    ]);
  };

  if (!user) return <View style={{ flex: 1, backgroundColor: '#f9fafb' }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 96, height: 96, backgroundColor: '#dcfce7', borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <UserCircle color="#16a34a" size={48} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827' }}>{user.fullName || user.businessName}</Text>
          <Text style={{ fontSize: 16, color: '#6b7280', fontWeight: '500' }}>{user.email || user.mobile}</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 24, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden' }}>
          <TouchableOpacity onPress={() => setShowLangModal(true)} style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Globe color="#6b7280" size={20} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginLeft: 16 }}>{t('profile.app_language')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#16a34a', marginRight: 8 }}>{i18n.language}</Text>
              <ChevronRight color="#9ca3af" size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginLeft: 36 }}>{t('profile.edit_profile')}</Text>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 32, backgroundColor: '#fef2f2', borderColor: '#fee2e2', borderWidth: 1, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut color="#dc2626" size={20} style={{ marginRight: 8 }} />
          <Text style={{ color: '#b91c1c', fontWeight: '900', fontSize: 16 }}>{t('profile.secure_logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* LANGUAGE MODAL */}
      <Modal visible={showLangModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 48 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 16 }}>{t('profile.select_language')}</Text>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity 
                key={lang} onPress={() => changeLanguage(lang)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
              >
                <Text style={{ fontSize: 18, fontWeight: i18n.language === lang ? '800' : '500', color: i18n.language === lang ? '#16a34a' : '#111827' }}>{lang}</Text>
                {i18n.language === lang && <Check color="#16a34a" size={20} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowLangModal(false)} style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#6b7280' }}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}