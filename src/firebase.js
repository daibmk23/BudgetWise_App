import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCrCf5pVDYeAT9Z5uz5AwU2qVpxFUBi_uw",
  authDomain: "wisebudget-bccf8.firebaseapp.com",
  projectId: "wisebudget-bccf8",
  storageBucket: "wisebudget-bccf8.firebasestorage.app",
  messagingSenderId: "303627375094",
  appId: "1:303627375094:web:4965cebc82db8f2482b7d7",
  measurementId: "G-S8MYXYPZ2E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };