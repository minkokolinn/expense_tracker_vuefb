import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

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

export {db}