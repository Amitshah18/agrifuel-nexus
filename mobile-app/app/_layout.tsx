import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This tells Expo Router to load index.tsx first, 
          and hides the default mobile headers globally */}
    </Stack>
  );
}