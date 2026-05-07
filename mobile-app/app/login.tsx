import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { Smartphone, Lock, AlertCircle, Globe, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import api from '../src/services/api';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLangModal, setShowLangModal] = useState(false);
  
  const { t, i18n } = useTranslation(); 

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('preferredLanguage', lang);
    setShowLangModal(false);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError(t('auth.err_fill_all'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { identifier, password });
      const user = response.data.user;
      
      await AsyncStorage.setItem('af_token', response.data.token);
      await AsyncStorage.setItem('af_user', JSON.stringify(user));
      
      const actualUserType = user.userType || user.role;

      if (actualUserType === 'buyer') {
        router.replace('/(business)');
      } else {
        router.replace('/(dashboard)');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.err_network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Premium Deep Emerald Header with Logo */}
        <View className="bg-green-700 pt-20 pb-10 px-8 items-center rounded-b-[40px] shadow-sm">
          
          <View style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(16, 185, 129, 0.1)' }} />
          <View style={{ position: 'absolute', bottom: -20, right: -20, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(20, 184, 166, 0.1)' }} />

          <TouchableOpacity 
            onPress={() => setShowLangModal(true)}
            style={{ position: 'absolute', top: 50, right: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', zIndex: 10 }}
          >
            <Globe color="white" size={14} />
            <Text style={{ color: 'white', fontWeight: '900', marginLeft: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{i18n.language ? i18n.language.substring(0,3) : 'ENG'}</Text>
          </TouchableOpacity>

          {/* Actual App Logo Image */}
          <Image source={require('../assets/agrifuel_nexus_logo_no-background.png')} style={{ width: 80, height: 80, marginBottom: 16 }} resizeMode="contain" />
          
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: -1 }}>{t('common.app_name', 'AgriFuel Nexus')}</Text>
          <Text style={{ color: 'rgba(209, 250, 229, 0.8)', textAlign: 'center', marginTop: 8, fontWeight: '600', fontSize: 14 }}>{t('auth.tagline', 'The intelligent farming ecosystem.')}</Text>
        </View>

        {/* Login Form Area */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 32, letterSpacing: -1 }}>{t('auth.welcome_back', 'Welcome back.')}</Text>

          <View style={{ gap: 20 }}>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.mobile_email_label', 'Mobile Number or Email')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10 }}>
                <Smartphone color="#94a3b8" size={20} />
                <TextInput 
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#0f172a', fontWeight: '700' }} 
                  placeholder={t('auth.mobile_placeholder', 'e.g. 9876543210')} 
                  placeholderTextColor="#cbd5e1" 
                  value={identifier} 
                  onChangeText={setIdentifier} 
                  autoCapitalize="none" 
                  keyboardType="email-address" 
                />
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{t('auth.password_label', 'Password')}</Text>
                <TouchableOpacity><Text style={{ fontSize: 12, fontWeight: '800', color: '#059669' }}>{t('auth.forgot_password', 'Forgot?')}</Text></TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10 }}>
                <Lock color="#94a3b8" size={20} />
                <TextInput 
                  style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#0f172a', fontWeight: '700' }} 
                  placeholder="••••••••" 
                  placeholderTextColor="#cbd5e1" 
                  secureTextEntry 
                  value={password} 
                  onChangeText={setPassword} 
                />
              </View>
            </View>

            {error !== '' && (
              <View style={{ backgroundColor: '#fef2f2', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#fee2e2' }}>
                <AlertCircle color="#dc2626" size={20} />
                <Text style={{ color: '#b91c1c', fontWeight: '800', marginLeft: 12, fontSize: 14, flex: 1 }}>{error}</Text>
              </View>
            )}

            <TouchableOpacity 
              onPress={handleLogin} 
              disabled={loading} 
              style={{ backgroundColor: loading ? '#94a3b8' : '#022c22', height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, elevation: 5, shadowColor: '#064e3b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 }} 
              activeOpacity={0.8}
            >
              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18 }}>{loading ? t('auth.authenticating', 'Authenticating...') : t('auth.sign_in', 'Sign in to Dashboard')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 15 }}>{t('auth.no_account', "Don't have an account?")} </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={{ color: '#059669', fontWeight: '900', fontSize: 15 }}>{t('auth.sign_up', 'Create an account')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
}