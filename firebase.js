import {
  initializeApp,
  getApp,
  getApps,
  deleteApp,
  SDK_VERSION,
} from 'firebase/app';

import { getAuth, Auth, Persistence, onAuthStateChanged } from 'firebase/auth';
import { initializeAppCheck } from 'firebase/app-check';
import { FirebaseAppCheckDebugProviderFactory } from 'firebase/app-check';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, app, storage, onAuthStateChanged };
