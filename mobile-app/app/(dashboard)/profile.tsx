import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCircle, Mail, ShieldCheck, Leaf, Building2, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
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
      "Are you sure you want to log out of AgriFuel Nexus?",
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

  const isFarmer = (user.userType || user.role) === 'farmer';

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="items-center pt-8 pb-6 px-6">
          <View className={`h-24 w-24 rounded-full items-center justify-center mb-4 shadow-sm border-4 border-white ${isFarmer ? 'bg-green-100' : 'bg-blue-100'}`}>
            {isFarmer ? <Leaf color="#16a34a" size={40} /> : <Building2 color="#2563eb" size={40} />}
          </View>
          
          <Text className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">
            {user.name || "Farmer"}
          </Text>
          
          <View className={`mt-2 px-3 py-1 rounded-full ${isFarmer ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Text className={`text-xs font-bold uppercase tracking-wider ${isFarmer ? 'text-green-800' : 'text-blue-800'}`}>
              {isFarmer ? 'Verified Farmer' : 'Corporate Buyer'}
            </Text>
          </View>
        </View>

        <View className="px-6 space-y-6 mt-4">
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <View className="p-4 border-b border-gray-50 flex-row items-center">
              <Mail color="#9ca3af" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</Text>
                <Text className="text-base font-medium text-gray-900">{user.email}</Text>
              </View>
            </View>
            
            <View className="p-4 border-b border-gray-50 flex-row items-center">
              <UserCircle color="#9ca3af" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account ID</Text>
                <Text className="text-base font-medium text-gray-900">{user._id?.substring(0, 10)}...</Text>
              </View>
            </View>

            <View className="p-4 flex-row items-center">
              <ShieldCheck color="#16a34a" size={20} />
              <View className="ml-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</Text>
                <Text className="text-base font-medium text-gray-900">Password Protected</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-4">
            <TouchableOpacity className="p-5 border-b border-gray-50 flex-row items-center justify-between bg-white active:bg-gray-50">
              <Text className="text-base font-bold text-gray-900">Edit Profile</Text>
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