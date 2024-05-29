import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(  
    <React.StrictMode>
      <GoogleOAuthProvider clientId="179419466627-4ph0us4edk6rt2hdf0no6vpugu0r4aik.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode> ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
