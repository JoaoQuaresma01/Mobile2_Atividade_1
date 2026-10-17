import axios from 'axios';

// Usando o IP
const api = axios.create({
  baseURL: 'http://192.168.1.73:3000/api',
  timeout: 5000,
});

export default api;