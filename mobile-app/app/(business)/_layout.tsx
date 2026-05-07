import { Tabs, router } from 'expo-router';
import { Store, Truck, BarChart3, UserCircle } from 'lucide-react-native';
import { Platform, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function BusinessLayout() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { t } = useTranslation();

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

  if (!isAuthorized) return <View style={{ flex: 1, backgroundColor: '#FAFCFF', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#059669" size="large" /></View>;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.03,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ title: t('tabs.market', 'Market'), tabBarIcon: ({ color }) => <Store color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="orders" 
        options={{ title: t('tabs.pickups', 'Pickups'), tabBarIcon: ({ color }) => <Truck color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="analytics" 
        options={{ title: t('tabs.analytics', 'Analytics'), tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: t('tabs.profile', 'Profile'), tabBarIcon: ({ color }) => <UserCircle color={color} size={24} /> }} 
      />
    </Tabs>
  );
}