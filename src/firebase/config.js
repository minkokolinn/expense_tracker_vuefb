import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1IwALP41-LdMiUpUxH6rfwie4rdHM8fc",
  authDomain: "expensetrackervuefb.firebaseapp.com",
  projectId: "expensetrackervuefb",
  storageBucket: "expensetrackervuefb.firebasestorage.app",
  messagingSenderId: "1010759690441",
  appId: "1:1010759690441:web:0ef57dc7408056597b0518",
};

let app = initializeApp(firebaseConfig)
let db = getFirestore(app)
let auth = getAuth(app)

function getCurrentUser(){
  return new Promise((resolve,reject)=>{
    const unsubscribe = onAuthStateChanged(auth, user=>{
      unsubscribe();
      resolve(user);
    },reject);
  });
}

export {db, getCurrentUser, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser}