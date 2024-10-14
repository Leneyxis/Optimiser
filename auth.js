import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA76x0hUgF1XfR6y3JQd9jjpwfvfP5nPxY",
    authDomain: "linkedin-profile-optimizer.firebaseapp.com",
    projectId: "linkedin-profile-optimizer",
    storageBucket: "linkedin-profile-optimizer.appspot.com",
    messagingSenderId: "710294928001",
    appId: "1:710294928001:web:c1bc0a201f91a00d166b80",
    measurementId: "G-51S5X3WCGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const successMessageDisplay = document.getElementById('success-message');
    const signupErrorDisplay = document.getElementById('signup-error');
    const loginErrorDisplay = document.getElementById('login-error');

    // Function to display success message
    function showSuccessMessage(message) {
        successMessageDisplay.textContent = message;
        successMessageDisplay.style.display = 'block';  // Show the success message
        signupForm.style.display = 'none';  // Hide form after success
        loginForm.style.display = 'none';  // Hide form after success
    }

    // Function to send message to Chrome extension
    function sendMessageToExtension(userId) {
        chrome.runtime.sendMessage(
            'fnjddgflihjpacfjdpehbnfmblhejpen',  // Replace with your extension's ID
            { action: 'storeUser', userId: userId },
            (response) => {
                console.log('Response from extension:', response);
            }
        );
    }

    // Handle Firebase sign-up request
    const signupButton = document.getElementById('signup-button');
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Firebase sign-up request
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendMessageToExtension(user.uid);
                showSuccessMessage('Sign up is successful! Please close this page and open the extension to continue with optimization.');
            })
            .catch((error) => {
                showError(signupErrorDisplay, 'Error during sign-up: ' + error.message);
            });
    });

    // Handle Firebase login request
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Firebase login request
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendMessageToExtension(user.uid);
                showSuccessMessage('Login is successful! Please close this page and open the extension to continue with optimization.');
            })
            .catch((error) => {
                showError(loginErrorDisplay, 'Error during login: ' + error.message);
            });
    });
});
