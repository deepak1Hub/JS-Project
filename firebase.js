// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2Jwx-KebXooeyyCgCv3Ggzl29N78gANE",
  authDomain: "js-project-62da1.firebaseapp.com",
  projectId: "js-project-62da1",
  storageBucket: "js-project-62da1.appspot.com", 
  messagingSenderId: "76846883912",
  appId: "1:76846883912:web:d520bc770c7283a292e47d",
  measurementId: "G-RK3FJWXWMM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
