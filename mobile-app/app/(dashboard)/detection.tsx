import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, Upload, AlertCircle, CheckCircle2, Volume2, Square, ScanLine, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function DetectionScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ plant_name: string; disease_name: string; advisory: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => { return () => { Speech.stop(); }; }, []);

  const getVoiceLocale = (lang: string) => {
    const map: Record<string, string> = { 'English': 'en-IN', 'Hindi': 'hi-IN', 'Bengali': 'bn-IN', 'Marathi': 'mr-IN', 'Punjabi': 'hi-IN', 'Haryanvi': 'hi-IN' };
    return map[lang] || 'hi-IN';
  };

  const toggleVoice = async (text: string) => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking || isSpeaking) {
      Speech.stop(); setIsSpeaking(false);
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

    const res = useCamera 
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 }) 
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    
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
      formData.append('language', i18n.language); 

      const token = await AsyncStorage.getItem('af_token');
      const response = await fetch('http://192.168.1.5:5000/api/advisory/analyze', {
        method: 'POST', headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) { setResult(data); } 
      else { Alert.alert(t('scan.analysis_failed', 'Analysis Failed'), data.message); }
    } catch (error) {
      Alert.alert(t('common.error', 'Error'), t('scan.connection_error', 'Connection failed.'));
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = result?.disease_name.toLowerCase().includes('healthy');
  const parsedAdvisoryPoints = result ? result.advisory.split(/(?<=\.)\s+/).filter(p => p.trim().length > 10) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }} edges={['top']}>
      
      <View style={{ paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 26, fontWeight: '900', color: '#022c22', letterSpacing: -0.5 }}>{t('scan.ai_crop_scan', 'AI Crop Scanner')}</Text>
          <Text style={{ fontSize: 12, color: '#059669', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{t('scan.active_language', 'Translating to')}: {i18n.language}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={{ height: result ? 160 : 340, width: '100%', backgroundColor: imageUri ? '#ffffff' : '#f8fafc', borderRadius: 32, borderWidth: 2, borderStyle: imageUri ? 'solid' : 'dashed', borderColor: imageUri ? '#10b981' : '#cbd5e1', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: imageUri ? 5 : 0 }}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 24, elevation: 2, marginBottom: 16 }}>
                <ScanLine color="#94a3b8" size={48} />
              </View>
              <Text style={{ color: '#64748b', fontWeight: '700', fontSize: 16 }}>{t('scan.center_leaf', 'Center leaf in frame')}</Text>
            </View>
          )}
        </View>

        {!result && (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
            <TouchableOpacity onPress={() => pickImage(true)} style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 20, borderRadius: 24, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 2 }}>
              <Camera color="#0f172a" size={20} style={{ marginRight: 8 }} />
              <Text style={{ color: '#0f172a', fontWeight: '900', fontSize: 16 }}>{t('scan.camera', 'Camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage(false)} style={{ flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 20, borderRadius: 24, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', elevation: 2 }}>
              <Upload color="#0f172a" size={20} style={{ marginRight: 8 }} />
              <Text style={{ color: '#0f172a', fontWeight: '900', fontSize: 16 }}>{t('scan.gallery', 'Gallery')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          onPress={result ? () => { setResult(null); setImageUri(null); } : analyzeCrop} 
          disabled={(!imageUri && !result) || loading} 
          style={{ backgroundColor: (!imageUri && !result) ? '#cbd5e1' : '#022c22', paddingVertical: 20, borderRadius: 24, alignItems: 'center', justifyContent: 'center', elevation: (!imageUri && !result) ? 0 : 5 }}
          activeOpacity={0.9}
        >
          {loading ? <ActivityIndicator color="#ffffff" size="large" /> : <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18 }}>{result ? t('scan.scan_new_image', 'Scan New Image') : t('scan.get_diagnosis', 'Analyze Crop Health')}</Text>}
        </TouchableOpacity>

        {result && (
          <View style={{ marginTop: 32, backgroundColor: '#ffffff', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', elevation: 3 }}>
            
            <TouchableOpacity onPress={() => toggleVoice(result.advisory)} style={{ backgroundColor: isSpeaking ? '#fee2e2' : '#f0fdf4', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: isSpeaking ? '#fca5a5' : '#dcfce7' }}>
              {isSpeaking ? <Square color="#dc2626" size={18} fill="#dc2626" style={{ marginRight: 8 }}/> : <Volume2 color="#059669" size={18} style={{ marginRight: 8 }} />}
              <Text style={{ color: isSpeaking ? '#dc2626' : '#059669', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>{isSpeaking ? t('scan.stop_audio', 'Stop Audio') : `${t('scan.listen_in', 'Read in')} ${i18n.language}`}</Text>
            </TouchableOpacity>

            <Text style={{ color: '#022c22', fontSize: 26, fontWeight: '900', marginBottom: 16, letterSpacing: -0.5 }}>{(result.plant_name || '').replace(/_/g, ' ')}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isHealthy ? '#ecfdf5' : '#fef2f2', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: isHealthy ? '#d1fae5' : '#fee2e2' }}>
              {isHealthy ? <CheckCircle2 color="#059669" size={32} style={{ marginRight: 16 }} /> : <AlertCircle color="#dc2626" size={32} style={{ marginRight: 16 }} />}
              <Text style={{ color: isHealthy ? '#047857' : '#b91c1c', fontSize: 20, fontWeight: '900', flex: 1 }}>{(result.disease_name || '').replace(/_/g, ' ')}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles size={20} color="#059669"/>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: 1 }}>{t('scan.advisory_report', 'Action Plan')}</Text>
            </View>

            <View style={{ gap: 12 }}>
              {parsedAdvisoryPoints.length > 0 ? parsedAdvisoryPoints.map((point, idx) => (
                <View key={idx} style={{ flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' }}>
                   <View style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 }}>
                      <Text style={{ color: '#059669', fontWeight: '900', fontSize: 14 }}>{idx + 1}</Text>
                   </View>
                   <Text style={{ flex: 1, color: '#334155', fontWeight: '700', lineHeight: 24, fontSize: 15 }}>{point}.</Text>
                </View>
              )) : (
                <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9' }}>
                  <Text style={{ fontSize: 16, color: '#334155', lineHeight: 28, fontWeight: '600' }}>{result.advisory}</Text>
                </View>
              )}
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}