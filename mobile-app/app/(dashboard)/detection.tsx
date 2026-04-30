import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, Upload, AlertCircle, CheckCircle2, Leaf, Volume2, Square } from 'lucide-react-native';
import { useTranslation } from 'react-i18next'; // 👈 IMPORT

export default function DetectionScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ plant_name: string; disease_name: string; advisory: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { t, i18n } = useTranslation(); // 👈 INIT

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const getVoiceLocale = (lang: string) => {
    const map: Record<string, string> = { 'English': 'en-IN', 'Hindi': 'hi-IN', 'Bengali': 'bn-IN', 'Marathi': 'mr-IN', 'Punjabi': 'hi-IN', 'Haryanvi': 'hi-IN' };
    return map[lang] || 'hi-IN';
  };

  const toggleVoice = async (text: string) => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking || isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: getVoiceLocale(i18n.language),
        rate: 0.85,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const pickImage = async (useCamera: boolean) => {
    Speech.stop(); setIsSpeaking(false);
    if (useCamera) await ImagePicker.requestCameraPermissionsAsync();
    else await ImagePicker.requestMediaLibraryPermissionsAsync();

    const res = useCamera ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!res.canceled && res.assets && res.assets[0].uri) { setImageUri(res.assets[0].uri); setResult(null); }
  };

  const analyzeCrop = async () => {
    if (!imageUri) return;
    setLoading(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 'Unknown', lng = 'Unknown';
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        lat = loc.coords.latitude.toString(); lng = loc.coords.longitude.toString();
      }

      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'leaf.jpg';
      const match = /\.(\w+)$/.exec(filename);
      formData.append('file', { uri: imageUri, name: filename, type: match ? `image/${match[1]}` : `image/jpeg` } as any);
      formData.append('latitude', lat); formData.append('longitude', lng); formData.append('date', new Date().toISOString());
      formData.append('language', i18n.language); // 👈 SENDS TRANSLATION LOCALE

      const token = await AsyncStorage.getItem('af_token');
      const response = await fetch('http://192.168.1.5:5000/api/advisory/analyze', {
        method: 'POST', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) { setResult(data); } 
      else { Alert.alert(t('scan.analysis_failed'), data.message); }
    } catch (error) {
      Alert.alert(t('common.error'), t('scan.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = result?.disease_name.toLowerCase().includes('healthy');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827' }}>{t('scan.ai_crop_scan')}</Text>
          <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700' }}>{t('scan.active_language')}: {i18n.language}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: result ? 140 : 320, width: '100%', backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 2, borderStyle: imageUri ? 'solid' : 'dashed', borderColor: imageUri ? '#dcfce7' : '#e5e7eb', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} /> : <Leaf color="#d1d5db" size={48} />}
        </View>

        {!result && (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
            <TouchableOpacity onPress={() => pickImage(true)} style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 16, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 2 }}>
              <Camera color="#374151" size={20} style={{ marginRight: 8 }} />
              <Text style={{ color: '#374151', fontWeight: '800' }}>{t('scan.camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage(false)} style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 16, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 2 }}>
              <Upload color="#374151" size={20} style={{ marginRight: 8 }} />
              <Text style={{ color: '#374151', fontWeight: '800' }}>{t('scan.gallery')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={result ? () => { setResult(null); setImageUri(null); } : analyzeCrop} disabled={(!imageUri && !result) || loading} style={{ backgroundColor: (!imageUri && !result) ? '#d1d5db' : '#16a34a', paddingVertical: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>
          {loading ? <ActivityIndicator color="#ffffff" size="large" /> : <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18 }}>{result ? t('scan.scan_new_image') : t('scan.get_diagnosis')}</Text>}
        </TouchableOpacity>

        {result && (
          <View style={{ marginTop: 24, backgroundColor: '#ffffff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#e5e7eb', elevation: 5 }}>
            <TouchableOpacity onPress={() => toggleVoice(result.advisory)} style={{ backgroundColor: isSpeaking ? '#fee2e2' : '#e0e7ff', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: isSpeaking ? '#fca5a5' : '#c7d2fe' }}>
              {isSpeaking ? <Square color="#dc2626" size={20} fill="#dc2626" style={{ marginRight: 8 }}/> : <Volume2 color="#4f46e5" size={20} style={{ marginRight: 8 }} />}
              <Text style={{ color: isSpeaking ? '#dc2626' : '#4f46e5', fontWeight: '900', fontSize: 16 }}>{isSpeaking ? t('scan.stop_audio') : `${t('scan.listen_in')} ${i18n.language}`}</Text>
            </TouchableOpacity>

            <Text style={{ color: '#111827', fontSize: 22, fontWeight: '900', marginBottom: 16 }}>{(result.plant_name || '').replace(/_/g, ' ')}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isHealthy ? '#dcfce7' : '#fee2e2', padding: 16, borderRadius: 16, marginBottom: 24 }}>
              {isHealthy ? <CheckCircle2 color="#16a34a" size={28} style={{ marginRight: 12 }} /> : <AlertCircle color="#dc2626" size={28} style={{ marginRight: 12 }} />}
              <Text style={{ color: isHealthy ? '#16a34a' : '#dc2626', fontSize: 18, fontWeight: '900', flex: 1 }}>{(result.disease_name || '').replace(/_/g, ' ')}</Text>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 12 }}>{t('scan.advisory_report')}</Text>
            <Text style={{ fontSize: 16, color: '#4b5563', lineHeight: 28, fontWeight: '500' }}>{result.advisory}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}