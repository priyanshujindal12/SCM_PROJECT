import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBk5loDyP_UQALCkbOY98z6xCA0aXcP6wQ",
    authDomain: "guardian-angel-5e9f7.firebaseapp.com",
    projectId: "guardian-angel-5e9f7",
    storageBucket: "guardian-angel-5e9f7.appspot.com",
    messagingSenderId: "1085736239962",
    appId: "1:1085736239962:web:37492ea0838a045d562963",
    measurementId: "G-7X5W3HYR7F"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//this is a useless comment
export { auth };
