import axios from 'axios';
import Constants from 'expo-constants';

// Pega automaticamente o IP do computador que o Expo está usando para rodar o app
const debuggerHost = Constants.expoConfig?.hostUri;
const ipDoComputador = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

// agora o Axios busca a URL do arquivo .env
// se a variável não for encontrada, ele usa o localhost como fallback de segurança.
//const api = axios.create({
//  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://[IP_ADDRESS]/api',
//  timeout: 5000,
//});

// Mudança para que rode tanto no Expo Go quanto no emulador Android Studio
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || `http://${ipDoComputador}:3000/api`,
  timeout: 5000,
});

export default api;