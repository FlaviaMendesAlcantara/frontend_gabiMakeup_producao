// src/axios-instance.js
import axios from 'axios';

// Verifique se as variáveis de ambiente estão definidas
//if (!process.env.REACT_APP_BASEURL || !process.env.REACT_APP_USERNAME || !process.env.REACT_APP_PASSWORD) {
 // console.error('Missing environment variables. Please check your .env file or Vercel environment settings.');
//}


// Configuração do Axios
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASEURL, // URL base da sua API
});

// Adicionar interceptor para todas as solicitações
instance.interceptors.request.use(
  
  (config) => {
    // Adicionar lógica para adicionar cabeçalho de autenticação
    const username =process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASS;
    const basicAuth = 'Basic ' + btoa(username + ':' + password); // Codifica para Base64
    config.headers.Authorization = basicAuth; // Adiciona o cabeçalho de autenticação a todas as solicitações
    return config;
  },
  (error) => {
    console.log('error: ',error)
    return Promise.reject(error);
    
  }
); 

export default instance;
