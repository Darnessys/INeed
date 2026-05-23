import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // إضافة دي ضرورية عشان نتعامل مع الداتابيز

const firebaseConfig = {
  apiKey: "AIzaSyBhtKwxBzK64YKMCzxK_uMp6SD7-IQZxOE",
  authDomain: "ineed-89b29.firebaseapp.com",
  projectId: "ineed-89b29",
  storageBucket: "ineed-89b29.firebasestorage.app",
  messagingSenderId: "215747270372",
  appId: "1:215747270372:web:a3c31e6a4bc2981b927ef1",
  measurementId: "G-P9JLEWEVWH"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الـ db عشان نستخدمها في أي ملف تاني (زي الـ OrderService)
export const db = getFirestore(app);