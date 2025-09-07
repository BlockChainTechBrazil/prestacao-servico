// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFnbADSzbV6pBvEHz_5lj08XBI94Q3xZ0",
  authDomain: "blockchaintechbrazil.firebaseapp.com",
  projectId: "blockchaintechbrazil",
  storageBucket: "blockchaintechbrazil.firebasestorage.app",
  messagingSenderId: "23141314037",
  appId: "1:23141314037:web:6567847988efa1f651c4bc",
  measurementId: "G-L560ZTQ13R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicializa Analytics apenas em ambiente de navegador e quando suportado
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignora caso não suportado
    });
}

export { analytics };
export default app;
