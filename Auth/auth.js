import { auth } from '../firebase.js'; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc , setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { db } from "../firebase.js"; 


window.register = async function () {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-pass").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User created with UID:", user.uid);

    // Add user document with role
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: "client"  // default role
    });

    alert("Registration successful and role saved");
  } catch (error) {
    console.error("Registration error:", error.message);
  }
};

window.login = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-pass").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user role from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const role = userDocSnap.data().role;
      if (role === "admin") {
        alert("Admin login successful");
        window.location.href = "../Admin/allClickedEvents.html";
      } else {
        alert("User login successful");
        window.location.href = "./cards.html";
      }
    } else {
      alert("User role not found, logging in as client");
      window.location.href = "./cards.html";
    }

  } catch (err) {
    console.log(err.message);
  }
};

window.forgotPassword = function () {
  
  const email = document.getElementById("forgot-email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};
