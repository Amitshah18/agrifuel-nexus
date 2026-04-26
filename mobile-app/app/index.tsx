import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('af_token');
        const userStr = await AsyncStorage.getItem('af_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          
          // THE FIX: Support old database accounts safely
          const actualUserType = user.userType || user.role;
          
          if (!actualUserType) {
            await AsyncStorage.removeItem('af_token');
            await AsyncStorage.removeItem('af_user');
            setRoute('/login');
          } else if (actualUserType === 'buyer') {
            setRoute('/(business)');
          } else {
            setRoute('/(dashboard)');
          }
        } else {
          setRoute('/login');
        }
      } catch (e) {
        setRoute('/login');
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, []);

  if (!isReady || !route) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15803d' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return <Redirect href={route as any} />;
}