import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFbduiYLKkgHusrQJLm0-FspLJXT39XEc",
  authDomain: "moya-kassa.firebaseapp.com",
  projectId: "moya-kassa",
  storageBucket: "moya-kassa.firebasestorage.app",
  messagingSenderId: "809332802472",
  appId: "1:809332802472:web:49031f8fcb9ab25b3dd39d",
  measurementId: "G-QQFKMBJWVW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
