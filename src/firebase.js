import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDfh5_vV4bDI7swsWnqTdqLFFp23S2IjyE",
    authDomain: "task-management-cfa87.firebaseapp.com",
    projectId: "task-management-cfa87",
    storageBucket: "task-management-cfa87.appspot.com",
    messagingSenderId: "938843604297",
    appId: "1:938843604297:web:485c9ccecb30c00eb00698",
    measurementId: "G-BX0FL0B7VG"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export { db };
