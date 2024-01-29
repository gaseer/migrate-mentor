import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup,createUserWithEmailAndPassword,signOut,signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQws2Nbgg4e6D4GIK9BGistg94hwuiZzo",
  authDomain: "atspeed-e03c9.firebaseapp.com",
  projectId: "atspeed-e03c9",
  storageBucket: "atspeed-e03c9.appspot.com",
  messagingSenderId: "199872211806",
  appId: "1:199872211806:web:811a68199cb815fc637dcf",
  measurementId: "G-WKPN2JPEB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get authentication instance and create Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword , db, signOut};
