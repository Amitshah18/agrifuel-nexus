import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Bell, Sun, CloudRain, Droplets, Wind, FlaskConical, 
  ArrowRight, CheckCircle2, AlertTriangle, Leaf, Zap, Scan
} from 'lucide-react-native';

export default function DashboardOverview() {
  const [userName, setUserName] = useState('Farmer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('af_user');
        if (userData) {
          const parsed = JSON.parse(userData);
          // Correctly grabbing the first name via user.name
          setUserName(parsed.name?.split(' ')[0] || 'Farmer');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const weather = { temp: 28, condition: "Partly Cloudy", humidity: 65, rainChance: 20 };
  const soil = { ph: 6.2, nitrogen: "Low", moisture: 42 };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      
      {/* HEADER */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Good Morning</Text>
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">{userName}</Text>
        </View>
        <TouchableOpacity className="h-12 w-12 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm relative">
          <Bell color="#374151" size={24} />
          <View className="absolute top-3 right-3 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* HORIZONTAL QUICK METRICS */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mt-6 pl-6"
          contentContainerStyle={{ paddingRight: 32 }}
        >
          <View className="bg-white border border-gray-100 rounded-3xl p-5 mr-4 shadow-sm w-44">
            <View className="h-10 w-10 bg-green-100 rounded-xl items-center justify-center mb-4">
              <Leaf color="#16a34a" size={20} />
            </View>
            <Text className="text-gray-500 font-bold text-xs uppercase tracking-wider">Active Crops</Text>
            <Text className="text-xl font-extrabold text-gray-900 mt-1">Wheat, Corn</Text>
          </View>

          <View className="bg-white border border-gray-100 rounded-3xl p-5 mr-4 shadow-sm w-44">
            <View className="h-10 w-10 bg-orange-100 rounded-xl items-center justify-center mb-4">
              <AlertTriangle color="#ea580c" size={20} />
            </View>
            <Text className="text-gray-500 font-bold text-xs uppercase tracking-wider">Pending Alerts</Text>
            <Text className="text-xl font-extrabold text-gray-900 mt-1">2 Actions</Text>
          </View>
        </ScrollView>

        {/* PRIMARY ACTION BUTTON */}
        <View className="px-6 mt-8">
          <TouchableOpacity 
            onPress={() => router.push('/detection')}
            className="bg-green-600 rounded-2xl flex-row items-center justify-between p-5 shadow-sm"
            activeOpacity={0.9}
          >
            <View className="flex-row items-center">
              <View className="h-12 w-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                <Scan color="#ffffff" size={24} />
              </View>
              <View>
                <Text className="text-white font-extrabold text-lg">Run AI Scan</Text>
                <Text className="text-green-100 font-medium text-sm">Detect diseases instantly</Text>
              </View>
            </View>
            <ArrowRight color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>

        {/* ENVIRONMENTAL INTELLIGENCE */}
        <View className="px-6 mt-8 space-y-5">
          <Text className="text-xl font-extrabold text-gray-900">Farm Intelligence</Text>

          {/* Weather Card */}
          <View className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row items-center">
                <Sun color="#3b82f6" size={24} className="mr-2" />
                <Text className="text-blue-900 font-extrabold text-lg">Pune Climate</Text>
              </View>
              <Text className="text-3xl font-black text-blue-900">{weather.temp}°</Text>
            </View>
            
            <View className="flex-row justify-between bg-white rounded-2xl p-4 shadow-sm">
              <View className="items-center">
                <Droplets color="#60a5fa" size={20} className="mb-1" />
                <Text className="text-gray-500 text-xs font-bold uppercase">Humidity</Text>
                <Text className="text-gray-900 font-extrabold mt-1">{weather.humidity}%</Text>
              </View>
              <View className="w-[1px] bg-gray-100" />
              <View className="items-center">
                <CloudRain color="#60a5fa" size={20} className="mb-1" />
                <Text className="text-gray-500 text-xs font-bold uppercase">Rain</Text>
                <Text className="text-gray-900 font-extrabold mt-1">{weather.rainChance}%</Text>
              </View>
              <View className="w-[1px] bg-gray-100" />
              <View className="items-center">
                <Wind color="#60a5fa" size={20} className="mb-1" />
                <Text className="text-gray-500 text-xs font-bold uppercase">Wind</Text>
                <Text className="text-gray-900 font-extrabold mt-1">12 km/h</Text>
              </View>
            </View>
          </View>

          {/* Soil Card */}
          <View className="bg-amber-50 border border-amber-100 rounded-3xl p-5 mt-4">
            <View className="flex-row items-center mb-6">
              <FlaskConical color="#d97706" size={24} className="mr-2" />
              <Text className="text-amber-900 font-extrabold text-lg">Soil Status</Text>
            </View>
            
            <View className="flex-row justify-between bg-white rounded-2xl p-4 shadow-sm">
              <View className="items-center">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">pH Level</Text>
                <Text className="text-green-600 font-extrabold text-lg">{soil.ph}</Text>
                <View className="bg-green-100 px-2 py-1 rounded-md mt-1"><Text className="text-green-700 text-[10px] font-bold">Optimal</Text></View>
              </View>
              <View className="w-[1px] bg-gray-100" />
              <View className="items-center">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Nitrogen</Text>
                <Text className="text-red-500 font-extrabold text-lg">{soil.nitrogen}</Text>
                <View className="bg-red-100 px-2 py-1 rounded-md mt-1"><Text className="text-red-700 text-[10px] font-bold">Low</Text></View>
              </View>
              <View className="w-[1px] bg-gray-100" />
              <View className="items-center">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Moisture</Text>
                <Text className="text-blue-600 font-extrabold text-lg">{soil.moisture}%</Text>
                <View className="bg-blue-100 px-2 py-1 rounded-md mt-1"><Text className="text-blue-700 text-[10px] font-bold">Good</Text></View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-xl font-extrabold text-gray-900 mb-4">Recent Activity</Text>
          <View className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
            <View className="flex-row p-4 border-b border-gray-50">
              <View className="h-10 w-10 bg-green-100 rounded-full items-center justify-center mr-4"><CheckCircle2 color="#16a34a" size={20} /></View>
              <View className="flex-1"><Text className="font-extrabold text-gray-900">Marketplace Match Found</Text><Text className="text-sm font-medium text-gray-500 mt-1 leading-snug">System matched your 1.5 Tons of Rice Husk with EcoFuel Corp.</Text></View>
            </View>
            <View className="flex-row p-4">
              <View className="h-10 w-10 bg-orange-100 rounded-full items-center justify-center mr-4"><Bell color="#ea580c" size={20} /></View>
              <View className="flex-1"><Text className="font-extrabold text-gray-900">New AI Advisory</Text><Text className="text-sm font-medium text-gray-500 mt-1 leading-snug">Low nitrogen detected. Recommend applying urea-based fertilizer.</Text></View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}