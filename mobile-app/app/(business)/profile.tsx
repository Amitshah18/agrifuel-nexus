import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Building2, Mail, ShieldCheck, LogOut, ChevronRight, Briefcase } from 'lucide-react-native';

export default function BusinessProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('af_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Secure Logout",
      "Are you sure you want to log out of the Procurement Dashboard?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('af_token');
            await AsyncStorage.removeItem('af_user');
            router.replace('/login');
          }
        }
      ]
    );
  };

  if (!user) return <View className="flex-1 bg-gray-50" />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="items-center pt-8 pb-6 px-6">
          <View className="h-24 w-24 rounded-full bg-blue-100 items-center justify-center mb-4 shadow-sm border-4 border-white">
            <Building2 color="#2563eb" size={40} />
          </View>
          {/* FIXED: Pulling the actual business name from the schema */}
          <Text className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">
            {user.companyDetails?.businessName || user.name || 'Corporate Buyer'}
          </Text>
          <View className="mt-2 px-3 py-1 rounded-full bg-blue-100">
            <Text className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Verified Business Account
            </Text>
          </View>
        </View>

        <View className="px-6 space-y-6 mt-4">
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <View className="p-4 border-b border-gray-50 flex-row items-center">
              <Mail color="#9ca3af" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Email</Text>
                <Text className="text-base font-medium text-gray-900">{user.email}</Text>
              </View>
            </View>
            
            <View className="p-4 border-b border-gray-50 flex-row items-center">
              <Briefcase color="#9ca3af" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account ID</Text>
                <Text className="text-base font-medium text-gray-900">{user._id?.substring(0, 10)}...</Text>
              </View>
            </View>

            <View className="p-4 flex-row items-center">
              <ShieldCheck color="#2563eb" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</Text>
                <Text className="text-base font-medium text-gray-900">Enterprise Protected</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-4">
            <TouchableOpacity className="p-5 border-b border-gray-50 flex-row items-center justify-between bg-white active:bg-gray-50">
              <Text className="text-base font-bold text-gray-900">Procurement Settings</Text>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="p-5 flex-row items-center justify-between bg-white active:bg-gray-50">
              <Text className="text-base font-bold text-gray-900">Support & Help</Text>
              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleLogout}
            className="mt-6 bg-red-50 border border-red-100 p-5 rounded-2xl flex-row items-center justify-center active:bg-red-100 transition-colors"
          >
            <LogOut color="#dc2626" size={20} />
            <Text className="text-red-600 font-extrabold text-base ml-2">Secure Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}