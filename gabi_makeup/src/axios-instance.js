// src/axios-instance.js
import axios from 'axios';

// Verifique se as variáveis de ambiente estão definidas
if (!process.env.REACT_APP_BASEURL || !process.env.REACT_APP_USERNAME || !process.env.REACT_APP_PASSW) {
  console.error('Missing environment variables. Please check your .env file or Vercel environment settings.');
}

// Configuração do Axios
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASEURL, // URL base da sua API
});

// Adicionar interceptor para todas as solicitações
instance.interceptors.request.use(
  
  (config) => {
    // Adicionar lógica para adicionar cabeçalho de autenticação
    const username =process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;
    const basicAuth = 'Basic ' + btoa(username + ':' + password); // Codifica para Base64
    config.headers.Authorization = basicAuth; // Adiciona o cabeçalho de autenticação a todas as solicitações
    console.log('REACT_APP_BASEURL:', process.env.REACT_APP_BASEURL);
    console.log('REACT_APP_USERNAME:', process.env.REACT_APP_USERNAME);
    console.log('REACT_APP_PASSWORD:', process.env.REACT_APP_PASSWORD);
    return config;
  },
  (error) => {
    console.log('REACT_APP_BASEURL:', process.env.REACT_APP_BASEURL);
    console.log('REACT_APP_USERNAME:', process.env.REACT_APP_USERNAME);
    console.log('REACT_APP_PASSWORD:', process.env.REACT_APP_PASSWORD);
    return Promise.reject(error);
    
  }
); 

export default instance;
