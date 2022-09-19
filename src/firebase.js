import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDkpDXEHqn69qacpSboD3VaqQnhqMmKQIA",
  authDomain: "kinocms-42844.firebaseapp.com",
  databaseURL: "https://kinocms-42844-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kinocms-42844",
  storageBucket: "kinocms-42844.appspot.com",
  messagingSenderId: "1081829911531",
  appId: "1:1081829911531:web:d0ed05d1510b616edb07ae"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export{
    db,
    storage,
}