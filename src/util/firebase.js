// Import Firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your new Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAIb3DSbufqccGcd6MtJjSb_3Gto9ima2g",
  authDomain: "devdeakinapp-64009.firebaseapp.com",
  projectId: "devdeakinapp-64009",
  storageBucket: "devdeakinapp-64009.firebasestorage.app",
  messagingSenderId: "121068112211",
  appId: "1:121068112211:web:56412ee0a1645806c9b9a6",
  measurementId: "G-C1E3092532"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google login setup
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Email + Password signup
export const signupWithEmailAndPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Email + Password login
export const loginWithEmailAndPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Create user document in Firestore
export const createUserDoc = async (userAuth, extraInfo) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { email, displayName } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        email,
        displayName,
        createdAt,
        ...extraInfo,
      });
    } catch (error) {
      console.error("Error creating user doc:", error);
    }
  }

  return userDocRef;
};

// Sign out
export const logout = () => signOut(auth);
