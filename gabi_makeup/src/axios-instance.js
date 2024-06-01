// src/axios-instance.js
import axios from 'axios';

// Configuração do Axios
const instance = axios.create({
  baseURL: 'https://gabi-makeup-api-2e0d.onrender.com/v1/',//process.env.REACT_APP_BASEURL, // URL base da sua API
  
});

// Adicionar interceptor para todas as solicitações
instance.interceptors.request.use(
  
  (config) => {
    // Adicionar lógica para adicionar cabeçalho de autenticação
    const username =process.env.REACT_APP_USERNAME;
    const password = 'G@biM@keup';//process.env.REACT_APP_PASSWORD;
    const basicAuth = 'Basic ' + btoa(username + ':' + password); // Codifica para Base64
    config.headers.Authorization = basicAuth; // Adiciona o cabeçalho de autenticação a todas as solicitações
    console.log('1 ',username);
    console.log('2 ',password);
    console.log('3 ',basicAuth);
    console.log('4 ',process.env.REACT_APP_BASEURL);
    console.log('5 ',config);
    return config;
  },
  (error) => {
    console.log('error: ',error)
    return Promise.reject(error);
    
  }
); 

export default instance;
