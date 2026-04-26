import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Leaf, Building2, AlertCircle } from 'lucide-react-native';
import api from '../src/services/api';

export default function SignupScreen() {
  const [stage, setStage] = useState<"type" | "wizard">("type");
  const [signupType, setSignupType] = useState<"farmer" | "buyer" | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", businessName: "",
    state: "", district: "", tehsil: "", village: "", pincode: "",
    companyType: "", gstin: "",
    password: "", confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.mobile || !formData.email) return setError("Contact details are required.");
      if (signupType === 'farmer' && !formData.fullName) return setError("Full name is required.");
      if (signupType === 'buyer' && !formData.businessName) return setError("Business name is required.");
    }
    if (step === 2) {
      if (signupType === 'farmer' && (!formData.state || !formData.district || !formData.village)) 
        return setError("Please complete your location details.");
      if (signupType === 'buyer' && (!formData.companyType || !formData.gstin)) 
        return setError("Please complete your registration details.");
    }
    setStep(step + 1);
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);
    try {
      const payload = {
        userType: signupType,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        fullName: formData.fullName,
        address: {
          state: formData.state, district: formData.district, tehsil: formData.tehsil, village: formData.village, pincode: formData.pincode
        },
        companyDetails: signupType === 'buyer' ? {
          businessName: formData.businessName, gstin: formData.gstin, companyType: formData.companyType
        } : undefined
      };

      await api.post('/auth/signup', payload);
      router.replace('/login'); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Network error. Backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center justify-between z-10 border-b border-gray-100">
          {stage === 'wizard' ? (
            <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : setStage("type")} className="p-2 -ml-2">
              <ArrowLeft color="#374151" size={24} />
            </TouchableOpacity>
          ) : <View className="w-8" />}
          <Text className="text-xl font-extrabold text-green-700 tracking-tight">AgriFuel Nexus</Text>
          <View className="w-8" />
        </View>

        <View className="flex-1 px-6 pt-8">
          
          {/* STAGE 1: ROLE SELECTION */}
          {stage === "type" && (
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Join the Ecosystem</Text>
              <Text className="text-gray-500 font-medium text-base mb-8">How would you like to use AgriFuel Nexus?</Text>

              <TouchableOpacity 
                onPress={() => { setSignupType("farmer"); setStage("wizard"); }}
                className="bg-white p-6 rounded-3xl border border-gray-200 mb-4 items-center shadow-sm active:border-green-500"
              >
                <View className="h-16 w-16 bg-green-50 border border-green-100 rounded-2xl items-center justify-center mb-4">
                  <Leaf color="#16a34a" size={32} />
                </View>
                <Text className="text-xl font-extrabold text-gray-900 mb-1">Farmer / FPO</Text>
                <Text className="text-gray-500 text-center font-medium">Access AI advisory and monetize your crop residue.</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => { setSignupType("buyer"); setStage("wizard"); }}
                className="bg-white p-6 rounded-3xl border border-gray-200 items-center shadow-sm active:border-blue-500"
              >
                <View className="h-16 w-16 bg-blue-50 border border-blue-100 rounded-2xl items-center justify-center mb-4">
                  <Building2 color="#2563eb" size={32} />
                </View>
                <Text className="text-xl font-extrabold text-gray-900 mb-1">Corporate Buyer</Text>
                <Text className="text-gray-500 text-center font-medium">Procure sustainable biomass and biofuel resources.</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/login')} className="mt-8 py-4">
                <Text className="text-center font-bold text-gray-600">Already registered? <Text className="text-green-600">Sign in</Text></Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STAGE 2: WIZARD */}
          {stage === "wizard" && (
            <View>
              {/* Stepper */}
              <View className="flex-row items-center justify-between mb-8 px-2">
                {[1, 2, 3].map((s) => (
                  <View key={s} className="items-center z-10 bg-gray-50">
                    <View className={`h-10 w-10 rounded-full items-center justify-center ${step >= s ? 'bg-green-600' : 'bg-white border-2 border-gray-200'}`}>
                      <Text className={step >= s ? 'text-white font-bold' : 'text-gray-400 font-bold'}>{s}</Text>
                    </View>
                  </View>
                ))}
                {/* Connecting Line */}
                <View className="absolute top-5 left-4 right-4 h-1 bg-gray-200 -z-10" />
              </View>

              {/* Step 1: Identity */}
              {step === 1 && (
                <View className="space-y-4">
                  <Text className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Let's start with basics</Text>
                  
                  <Text className="text-sm font-bold text-gray-700">{signupType === 'farmer' ? 'Full Name *' : 'Business Name *'}</Text>
                  <TextInput 
                    className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900"
                    placeholder={signupType === 'farmer' ? "As per Aadhaar" : "Registered Name"}
                    value={signupType === 'farmer' ? formData.fullName : formData.businessName}
                    onChangeText={(val) => updateForm(signupType === 'farmer' ? 'fullName' : 'businessName', val)}
                  />

                  <Text className="text-sm font-bold text-gray-700 mt-2">Mobile Number *</Text>
                  <TextInput 
                    className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900"
                    placeholder="10-digit number" keyboardType="phone-pad" maxLength={10}
                    value={formData.mobile} onChangeText={(val) => updateForm('mobile', val)}
                  />

                  <Text className="text-sm font-bold text-gray-700 mt-2">Email Address *</Text>
                  <TextInput 
                    className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900"
                    placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none"
                    value={formData.email} onChangeText={(val) => updateForm('email', val)}
                  />
                </View>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <View className="space-y-4">
                  <Text className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    {signupType === 'farmer' ? 'Farm Location' : 'Company Details'}
                  </Text>
                  
                  {signupType === 'farmer' ? (
                    <View> 
                      <View className="flex-row gap-4">
                        <View className="flex-1"><Text className="text-sm font-bold text-gray-700 mb-1">State *</Text><TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" value={formData.state} onChangeText={(v) => updateForm('state', v)}/></View>
                        <View className="flex-1"><Text className="text-sm font-bold text-gray-700 mb-1">District *</Text><TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" value={formData.district} onChangeText={(v) => updateForm('district', v)}/></View>
                      </View>
                      <View className="flex-row gap-4 mt-4">
                        <View className="flex-1"><Text className="text-sm font-bold text-gray-700 mb-1">Tehsil *</Text><TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" value={formData.tehsil} onChangeText={(v) => updateForm('tehsil', v)}/></View>
                        <View className="flex-1"><Text className="text-sm font-bold text-gray-700 mb-1">PIN *</Text><TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" keyboardType="number-pad" maxLength={6} value={formData.pincode} onChangeText={(v) => updateForm('pincode', v)}/></View>
                      </View>
                      <View className="mt-4">
                        <Text className="text-sm font-bold text-gray-700 mb-1">Village / Gram Panchayat *</Text>
                        <TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900" value={formData.village} onChangeText={(v) => updateForm('village', v)}/>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text className="text-sm font-bold text-gray-700 mb-1">Industry Type *</Text>
                      <TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900 mb-4" placeholder="e.g. Biofuel Refinery" value={formData.companyType} onChangeText={(v) => updateForm('companyType', v)}/>
                      
                      <Text className="text-sm font-bold text-gray-700 mb-1">GSTIN Number *</Text>
                      <TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 font-medium text-gray-900 uppercase" placeholder="22AAAAA0000A1Z5" maxLength={15} autoCapitalize="characters" value={formData.gstin} onChangeText={(v) => updateForm('gstin', v)}/>
                    </View>
                  )}
                </View>
              )}

              {/* Step 3: Security */}
              {step === 3 && (
                <View className="space-y-4">
                  <Text className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Secure Account</Text>
                  
                  <Text className="text-sm font-bold text-gray-700">Password *</Text>
                  <TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" secureTextEntry value={formData.password} onChangeText={(v) => updateForm('password', v)}/>
                  
                  <Text className="text-sm font-bold text-gray-700 mt-2">Confirm Password *</Text>
                  <TextInput className="bg-white border border-gray-200 rounded-xl px-4 h-14 text-gray-900 font-medium" secureTextEntry value={formData.confirmPassword} onChangeText={(v) => updateForm('confirmPassword', v)}/>
                </View>
              )}

              {error ? (
                <View className="bg-red-50 p-3 rounded-xl flex-row items-center mt-6 border border-red-100">
                  <AlertCircle color="#dc2626" size={18} />
                  <Text className="text-red-700 font-medium ml-2 text-sm flex-1">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                onPress={step === totalSteps ? handleSignup : nextStep}
                disabled={loading}
                className={`h-14 rounded-xl items-center justify-center mt-6 ${loading ? 'bg-gray-400' : 'bg-gray-900'}`}
              >
                <Text className="text-white font-bold text-lg">
                  {step === totalSteps ? (loading ? 'Creating...' : 'Create Account') : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}