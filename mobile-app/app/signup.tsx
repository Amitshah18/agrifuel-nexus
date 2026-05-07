import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Building2, AlertCircle, Globe, Check, User, MapPin, FileText, ShieldCheck, Leaf } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/services/api';

const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

export default function SignupScreen() {
  const [stage, setStage] = useState<"type" | "wizard">("type");
  const [signupType, setSignupType] = useState<"farmer" | "buyer" | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const { t, i18n } = useTranslation(); 
  const [showLangModal, setShowLangModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", businessName: "",
    state: "", district: "", tehsil: "", village: "", pincode: "",
    companyType: "", gstin: "",
    password: "", confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('preferredLanguage', lang);
    setShowLangModal(false);
  };

  const updateForm = (key: string, value: string) => { setFormData(prev => ({ ...prev, [key]: value })); };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.mobile || !formData.email) return setError(t('auth.err_contact_req', 'Contact details required.'));
      if (signupType === 'farmer' && !formData.fullName) return setError(t('auth.err_name_req', 'Full name required.'));
      if (signupType === 'buyer' && !formData.businessName) return setError(t('auth.err_business_req', 'Business name required.'));
    }
    if (step === 2) {
      if (signupType === 'farmer' && (!formData.state || !formData.district || !formData.village)) return setError(t('auth.err_location_req', 'Location details required.'));
      if (signupType === 'buyer' && (!formData.companyType || !formData.gstin)) return setError(t('auth.err_reg_req', 'Registration details required.'));
    }
    setStep(step + 1);
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) return setError(t('auth.err_password_match', 'Passwords do not match.'));

    setLoading(true);
    try {
      const payload = {
        userType: signupType, email: formData.email, mobile: formData.mobile, password: formData.password, fullName: formData.fullName,
        address: { state: formData.state, district: formData.district, tehsil: formData.tehsil, village: formData.village, pincode: formData.pincode },
        companyDetails: signupType === 'buyer' ? { businessName: formData.businessName, gstin: formData.gstin, companyType: formData.companyType } : undefined
      };

      await api.post('/auth/signup', payload);
      router.replace('/login'); 
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.err_network', 'Network error.'));
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (stepNum: number) => {
    if (stepNum === 1) return <User color={step >= 1 ? "white" : "#94a3b8"} size={20} />;
    if (stepNum === 2) return signupType === 'farmer' ? <MapPin color={step >= 2 ? "white" : "#94a3b8"} size={20} /> : <FileText color={step >= 2 ? "white" : "#94a3b8"} size={20} />;
    return <ShieldCheck color={step >= 3 ? "white" : "#94a3b8"} size={20} />;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Minimal Header with App Logo */}
        <View style={{ paddingTop: 64, paddingBottom: 24, paddingHorizontal: 24, backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5 }}>
          {stage === 'wizard' ? (
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : setStage("type")} style={{ padding: 8, marginLeft: -8 }}>
              <ArrowLeft color="#0f172a" size={24} />
            </TouchableOpacity>
          ) : <View style={{ width: 40 }} />}
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={require('../assets/agrifuel_nexus_logo_no-background.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>{t('common.app_name', 'AgriFuel Nexus')}</Text>
          </View>
          
          {/* 👈 LANGUAGE BUTTON */}
          <TouchableOpacity onPress={() => setShowLangModal(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' }}>
            <Globe color="#64748b" size={14} />
            <Text style={{ color: '#475569', fontWeight: '900', fontSize: 10, marginLeft: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{i18n.language ? i18n.language.substring(0, 3) : 'ENG'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
          
          {/* STAGE 1: Account Type */}
          {stage === "type" && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 36, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('auth.join_ecosystem', 'Create Account')}</Text>
              <Text style={{ color: '#64748b', fontWeight: '600', fontSize: 16, marginBottom: 40 }}>{t('auth.how_to_use', 'Select how you want to use the platform.')}</Text>

              <TouchableOpacity onPress={() => { setSignupType("farmer"); setStage("wizard"); }} style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 32, borderWidth: 2, borderColor: '#e2e8f0', marginBottom: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }} activeOpacity={0.8}>
                <View style={{ height: 64, width: 64, backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#d1fae5', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Leaf color="#059669" size={32} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#022c22', marginBottom: 4, letterSpacing: -0.5 }}>{t('auth.role_farmer', 'Farmer / FPO')}</Text>
                <Text style={{ color: '#64748b', textAlign: 'center', fontWeight: '600', fontSize: 14 }}>{t('auth.role_farmer_desc', 'Sell crop residue & access AI advisory.')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setSignupType("buyer"); setStage("wizard"); }} style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 32, borderWidth: 2, borderColor: '#e2e8f0', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }} activeOpacity={0.8}>
                <View style={{ height: 64, width: 64, backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#dbeafe', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Building2 color="#2563eb" size={32} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#022c22', marginBottom: 4, letterSpacing: -0.5 }}>{t('auth.role_buyer', 'Corporate Buyer')}</Text>
                <Text style={{ color: '#64748b', textAlign: 'center', fontWeight: '600', fontSize: 14 }}>{t('auth.role_buyer_desc', 'Procure sustainable biomass resources.')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: 40, paddingVertical: 16 }}>
                <Text style={{ textAlign: 'center', fontWeight: '700', color: '#64748b', fontSize: 15 }}>{t('auth.already_registered', 'Already registered?')} <Text style={{ color: '#059669', fontWeight: '900' }}>{t('auth.sign_in', 'Sign in')}</Text></Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STAGE 2: Wizard Form */}
          {stage === "wizard" && (
            <View>
              {/* Custom Progress Bar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 16, position: 'relative' }}>
                <View style={{ position: 'absolute', top: 24, left: 32, right: 32, height: 4, backgroundColor: '#e2e8f0', zIndex: -10, borderRadius: 2 }} />
                <View style={{ position: 'absolute', top: 24, left: 32, height: 4, backgroundColor: '#059669', zIndex: -10, borderRadius: 2, width: `${((step - 1) / 2) * 85}%` }} />
                
                {[1, 2, 3].map((s) => (
                  <View key={s} style={{ alignItems: 'center', zIndex: 10 }}>
                    <View style={{ height: 48, width: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: step >= s ? '#059669' : '#ffffff', borderWidth: 2, borderColor: step >= s ? '#059669' : '#e2e8f0', elevation: step >= s ? 5 : 0, shadowColor: '#059669', shadowOffset: {width: 0, height: 4}, shadowOpacity: step >= s ? 0.3 : 0, shadowRadius: 10 }}>
                      {getStepIcon(s)}
                    </View>
                  </View>
                ))}
              </View>

              {step === 1 && (
                <View style={{ gap: 20 }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('auth.start_basics', "Let's start with the basics")}</Text>
                  
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{signupType === 'farmer' ? t('auth.full_name_label', 'Full Name *') : t('auth.business_name_label', 'Business Name *')}</Text>
                    <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }} placeholder={signupType === 'farmer' ? t('auth.full_name_placeholder', 'As per Aadhaar') : t('auth.business_name_placeholder', 'Registered Name')} placeholderTextColor="#cbd5e1" value={signupType === 'farmer' ? formData.fullName : formData.businessName} onChangeText={(val) => updateForm(signupType === 'farmer' ? 'fullName' : 'businessName', val)} />
                  </View>

                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.mobile_number_label', 'Mobile Number *')}</Text>
                    <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16, letterSpacing: 2, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }} placeholder="9876543210" placeholderTextColor="#cbd5e1" keyboardType="phone-pad" maxLength={10} value={formData.mobile} onChangeText={(val) => updateForm('mobile', val)} />
                  </View>

                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.email_address_label', 'Email Address *')}</Text>
                    <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }} placeholder="mail@example.com" placeholderTextColor="#cbd5e1" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(val) => updateForm('email', val)} />
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={{ gap: 20 }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{signupType === 'farmer' ? t('auth.farm_location', 'Where is your farm?') : t('auth.company_details', 'Company Details')}</Text>
                  
                  {signupType === 'farmer' ? (
                    <View style={{ gap: 16 }}> 
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.state_label', 'State *')}</Text>
                          <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} value={formData.state} onChangeText={(v) => updateForm('state', v)}/>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.district_label', 'District *')}</Text>
                          <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} value={formData.district} onChangeText={(v) => updateForm('district', v)}/>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.tehsil_label', 'Tehsil *')}</Text>
                          <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} value={formData.tehsil} onChangeText={(v) => updateForm('tehsil', v)}/>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.pin_label', 'PIN Code *')}</Text>
                          <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16, letterSpacing: 2 }} keyboardType="number-pad" maxLength={6} value={formData.pincode} onChangeText={(v) => updateForm('pincode', v)}/>
                        </View>
                      </View>
                      <View>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.village_label', 'Village / Panchayat *')}</Text>
                        <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} value={formData.village} onChangeText={(v) => updateForm('village', v)}/>
                      </View>
                    </View>
                  ) : (
                    <View style={{ gap: 20 }}>
                      <View>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.industry_type_label', 'Industry Sector *')}</Text>
                        <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} placeholder="e.g. Biofuel Refinery" placeholderTextColor="#cbd5e1" value={formData.companyType} onChangeText={(v) => updateForm('companyType', v)}/>
                      </View>
                      <View>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.gstin_label', 'GSTIN Number *')}</Text>
                        <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }} placeholder="22AAAAA0000A1Z5" placeholderTextColor="#cbd5e1" maxLength={15} autoCapitalize="characters" value={formData.gstin} onChangeText={(v) => updateForm('gstin', v)}/>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {step === 3 && (
                <View style={{ gap: 20 }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#022c22', marginBottom: 8, letterSpacing: -1 }}>{t('auth.secure_account', 'Secure your account')}</Text>
                  
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.password_label', 'Create Password *')}</Text>
                    <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} secureTextEntry value={formData.password} onChangeText={(v) => updateForm('password', v)}/>
                  </View>
                  
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('auth.confirm_password_label', 'Confirm Password *')}</Text>
                    <TextInput style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, height: 60, fontWeight: '700', color: '#0f172a', fontSize: 16 }} secureTextEntry value={formData.confirmPassword} onChangeText={(v) => updateForm('confirmPassword', v)}/>
                  </View>
                </View>
              )}

              {error ? (
                <View style={{ backgroundColor: '#fef2f2', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: '#fee2e2' }}>
                  <AlertCircle color="#dc2626" size={20} />
                  <Text style={{ color: '#b91c1c', fontWeight: '800', marginLeft: 12, fontSize: 14, flex: 1 }}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity onPress={step === totalSteps ? handleSignup : nextStep} disabled={loading} style={{ backgroundColor: loading ? '#cbd5e1' : '#022c22', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 32, elevation: 5, shadowColor: '#064e3b', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 }}>
                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18 }}>{step === totalSteps ? (loading ? t('auth.creating', 'Setting up...') : t('auth.create_account', 'Complete Registration')) : t('auth.continue', 'Continue to Next Step')}</Text>
              </TouchableOpacity>
            </View>
          )}
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