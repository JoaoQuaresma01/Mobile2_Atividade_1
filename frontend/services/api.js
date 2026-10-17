import axios from 'axios';

// agora o Axios busca a URL do arquivo .env
// se a variável não for encontrada, ele usa o localhost como fallback de segurança.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 5000,
});

export default api;