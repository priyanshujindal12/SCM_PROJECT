import { auth } from "./firebase_config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("signUpForm");
    const signInForm = document.getElementById("signInForm");
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            signUpForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });
    
    
    signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signInEmail").value.trim();
        const password = document.getElementById("signInPassword").value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully!");
            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
});
