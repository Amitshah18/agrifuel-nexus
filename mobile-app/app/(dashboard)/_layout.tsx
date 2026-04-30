import { Tabs, router } from 'expo-router';
import { Home, Scan, Sprout, Store, UserCircle } from 'lucide-react-native';
import { Platform, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '../../src/i18n';

export default function DashboardLayout() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { t } = useTranslation(); 
  useEffect(() => {
    const checkAccess = async () => {
      const userStr = await AsyncStorage.getItem('af_user');
      if (!userStr) { router.replace('/login'); return; }
      
      const user = JSON.parse(userStr);
      const actualUserType = user.userType || user.role;
      
      if (!actualUserType) {
        await AsyncStorage.removeItem('af_user');
        router.replace('/login');
      } else if (actualUserType !== 'farmer') {
        router.replace('/(business)');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAccess();
  }, []);

  if (!isAuthorized) return <View style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#16a34a" size="large" /></View>;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f3f4f6',
          height: Platform.OS === 'ios' ? 85 : 65, paddingBottom: Platform.OS === 'ios' ? 25 : 10, paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      {/* <Tabs.Screen name="detection" options={{ title: t('tabs.scan'), tabBarIcon: ({ color }) => <Scan color={color} size={24} /> }} /> */}
      {/* <Tabs.Screen name="advisory" options={{ title: t('tabs.advisory'), tabBarIcon: ({ color }) => <Sprout color={color} size={24} /> }} /> */}
      <Tabs.Screen name="marketplace" options={{ title: t('tabs.market'), tabBarIcon: ({ color }) => <Store color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: ({ color }) => <UserCircle color={color} size={24} /> }} />
    </Tabs>
  );
}