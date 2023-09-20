import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { getAuth } from "firebase/auth";
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const firebaseConfig = {
  apiKey: apiKey || "mock",
  authDomain: authDomain || "mock",
  databaseURL: databaseURL || "mock",
  projectId: projectId || "mock",
  storageBucket: storageBucket || "mock",
  messagingSenderId: messagingSenderId || "mock",
  appId: appId || "mock",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);