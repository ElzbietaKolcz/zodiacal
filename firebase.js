import { createClient } from "@supabase/supabase-js";
import { initializeApp, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const { data, error } = await supabase.from('cosmetics').select().limit(5).order('category')
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app;
if (getApp.length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, app, storage, onAuthStateChanged, data, error };
