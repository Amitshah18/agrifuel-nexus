import { Tabs, router } from 'expo-router';
import { Home, Truck, UserCircle } from 'lucide-react-native';
import { Platform, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BusinessLayout() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const userStr = await AsyncStorage.getItem('af_user');
      
      if (!userStr) {
        router.replace('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      const actualUserType = user.userType || user.role;
      
      if (!actualUserType) {
        await AsyncStorage.removeItem('af_user');
        router.replace('/login');
      } else if (actualUserType !== 'buyer') {
        router.replace('/(dashboard)');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAccess();
  }, []);

  if (!isAuthorized) return <View style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#2563eb" size="large" /></View>;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Market', tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'Pickups', tabBarIcon: ({ color }) => <Truck color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <UserCircle color={color} size={24} /> }} />
    </Tabs>
  );
}