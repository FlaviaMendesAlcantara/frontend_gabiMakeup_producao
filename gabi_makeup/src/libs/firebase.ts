import { initializeApp } from 'firebase/app';
import { getStorage  }    from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId:process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket:'gs://gabimakeupgaleria.appspot.com',
    messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID
};
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);