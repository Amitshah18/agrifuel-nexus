import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure 192.168.1.14 is still your CURRENT Wi-Fi IPv4 Address!
const BASE_URL = Platform.OS === 'android' 
  ? 'http://192.168.1.5:5000/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  // THE FIX: Removed the hardcoded 'Content-Type' header. 
  // Axios will now automatically switch between JSON and Multipart!
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('af_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;