import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Pega automaticamente o IP do host (computador) detectado pelo Expo
const debuggerHost = Constants.expoConfig?.hostUri;
const ipDoComputador = debuggerHost ? debuggerHost.split(':')[0] : null;

// No emulador Android, o IP correto para falar com o computador é 10.0.2.2
const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : (ipDoComputador || 'localhost');

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || `http://${fallbackHost}:3000/api`,
  timeout: 10000,
});

export default api;