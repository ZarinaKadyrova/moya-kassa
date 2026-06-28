// src/firebase.js
// ⚠️  ИНСТРУКЦИЯ: замените значения ниже на ваши из Firebase Console
// Перейдите: https://console.firebase.google.com
// → Создайте проект → Web app → скопируйте firebaseConfig

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "ВСТАВЬТЕ_ВАШ_API_KEY",
  authDomain: "ВСТАВЬТЕ_ВАШ_AUTH_DOMAIN",
  projectId: "ВСТАВЬТЕ_ВАШ_PROJECT_ID",
  storageBucket: "ВСТАВЬТЕ_ВАШ_STORAGE_BUCKET",
  messagingSenderId: "ВСТАВЬТЕ_ВАШ_MESSAGING_SENDER_ID",
  appId: "ВСТАВЬТЕ_ВАШ_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
