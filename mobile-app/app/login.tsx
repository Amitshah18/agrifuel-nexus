import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Leaf, Smartphone, Lock, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/services/api';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { identifier, password });
      const user = response.data.user;
      
      await AsyncStorage.setItem('af_token', response.data.token);
      await AsyncStorage.setItem('af_user', JSON.stringify(user));
      
      // THE FIX: Check for the new schema 'userType' OR the old schema 'role'
      const actualUserType = user.userType || user.role;

      if (actualUserType === 'buyer') {
        router.replace('/(business)');
      } else {
        router.replace('/(dashboard)');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Network error. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
        <View className="bg-green-700 pt-20 pb-10 px-8 items-center rounded-b-[40px] shadow-sm">
          <View className="bg-white/20 p-4 rounded-2xl mb-4">
            <Leaf color="white" size={40} />
          </View>
          <Text className="text-3xl font-extrabold text-white tracking-tight">AgriFuel Nexus</Text>
          <Text className="text-green-100 text-center mt-2 font-medium">Smart farming & sustainable energy.</Text>
        </View>

        <View className="flex-1 px-6 pt-10 pb-8">
          <Text className="text-2xl font-extrabold text-gray-900 mb-6">Welcome Back</Text>

          <View className="space-y-5">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-2">Mobile or Email</Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-green-500">
                <Smartphone color="#9ca3af" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900 font-medium"
                  placeholder="9876543210"
                  placeholderTextColor="#9ca3af"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-bold text-gray-700">Password</Text>
                <TouchableOpacity>
                  <Text className="text-sm font-bold text-green-600">Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-green-500">
                <Lock color="#9ca3af" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900 font-medium"
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {error !== '' ? (
              <View className="bg-red-50 p-3 rounded-xl flex-row items-center mt-2 border border-red-100">
                <AlertCircle color="#dc2626" size={18} />
                <Text className="text-red-700 font-medium ml-2 text-sm flex-1">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className={`h-14 rounded-xl flex-row items-center justify-center mt-4 ${loading ? 'bg-gray-400' : 'bg-gray-900'}`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? 'Authenticating...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 flex-row justify-center items-center">
            <Text className="text-gray-600 font-medium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-green-600 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}