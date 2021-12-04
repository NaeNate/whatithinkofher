import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyAY9NDo6v8kjyd51uhmacSS39d05wN19lU",
  authDomain: "whatithinkofher.firebaseapp.com",
  projectId: "whatithinkofher",
  storageBucket: "whatithinkofher.appspot.com",
  messagingSenderId: "231594593764",
  appId: "1:231594593764:web:23fb304914f8a490b38bf1",
});

export const db = getFirestore(app);
export const auth = getAuth(app);
