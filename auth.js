import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

document.addEventListener('DOMContentLoaded', () => {
    // Forms and elements
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const switchToLoginLink = document.getElementById('switch-to-login');
    const switchToSignupLink = document.getElementById('switch-to-signup');
    const signupErrorDisplay = document.getElementById('signup-error');
    const loginErrorDisplay = document.getElementById('login-error');
    
    // Password input elements
    const signupPasswordInput = document.getElementById('signup-password');
    const loginPasswordInput = document.getElementById('login-password');
    
    // Eye icons for toggling password view
    const signupEye = document.getElementById('signup-eye');
    const loginEye = document.getElementById('login-eye');

    // Function to show inline errors
    function showError(errorDisplayElement, message) {
        errorDisplayElement.textContent = message;
        errorDisplayElement.style.display = 'block';  // Show the error message
    }

    // Function to hide errors
    function hideError(errorDisplayElement) {
        errorDisplayElement.textContent = '';
        errorDisplayElement.style.display = 'none';  // Hide the error message
    }

    // Toggle password visibility
    function togglePasswordVisibility(inputElement, eyeElement) {
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            eyeElement.innerHTML = '&#128065;';  // Open eye icon
        } else {
            inputElement.type = 'password';
            eyeElement.innerHTML = '&#128065;';  // Closed eye icon
        }
    }
    // Function to show success message and hide the forms
    function showSuccessMessage(message, userId) {
        successMessageDisplay.textContent = message;
        successMessageDisplay.style.display = 'block';  // Show the success message
        signupForm.style.display = 'none';  // Hide form after success
        loginForm.style.display = 'none';  // Hide form after success
    
        // Send message to the Chrome extension after sign-up or login
        sendMessageToExtension(userId);
    }
    // Add event listener for password toggle (Sign-Up form)
    signupEye.addEventListener('click', () => {
        togglePasswordVisibility(signupPasswordInput, signupEye);
    });

    // Add event listener for password toggle (Login form)
    loginEye.addEventListener('click', () => {
        togglePasswordVisibility(loginPasswordInput, loginEye);
    });

    // Show login form and hide sign-up form
    switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        hideError(signupErrorDisplay);
    });

    // Show sign-up form and hide login form
    switchToSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        hideError(loginErrorDisplay);
    });

    // Handle Google Sign-Up
    const googleSignupBtn = document.getElementById('google-signup-btn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    window.location.href = 'profile.html';  // Redirect to profile page
                })
                .catch((error) => {
                    showError(signupErrorDisplay, 'Error during Google Sign-Up: ' + error.message);
                });
        });
    }

    // Handle Google Log-In
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    window.location.href = 'profile.html';  // Redirect to profile page
                })
                .catch((error) => {
                    showError(loginErrorDisplay, 'Error during Google Log-In: ' + error.message);
                });
        });
    }

    // Handle Email/Password Sign-Up with validation
    const signupButton = document.getElementById('signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            // Validate password strength
            if (!passwordRegex.test(password)) {
                showError(signupErrorDisplay, 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
                return;
            }

            // Firebase sign-up request
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    window.location.href = 'profile.html';  // Redirect to profile page
                })
                .catch((error) => {
                    const errorCode = error.code;

                    // Handle Firebase errors here
                    if (errorCode === 'auth/email-already-in-use') {
                        showError(signupErrorDisplay, 'This email is already in use. Please try logging in.');
                    } else if (errorCode === 'auth/invalid-email') {
                        showError(signupErrorDisplay, 'The email address is not valid.');
                    } else if (errorCode === 'auth/weak-password') {
                        showError(signupErrorDisplay, 'The password is too weak. Please follow the password guidelines.');
                    } else {
                        showError(signupErrorDisplay, 'Error during sign-up: ' + error.message);
                    }
                });
        });
    }

    // Handle Email/Password Log-In
    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    window.location.href = 'profile.html';  // Redirect to profile page
                })
                .catch((error) => {
                    const errorCode = error.code;

                    // Handle Firebase login errors here
                    if (errorCode === 'auth/wrong-password') {
                        showError(loginErrorDisplay, 'Wrong password. Please try again.');
                    } else if (errorCode === 'auth/user-not-found') {
                        showError(loginErrorDisplay, 'User not found. Please sign up first.');
                    } else {
                        showError(loginErrorDisplay, 'Error during log-in: ' + error.message);
                    }
                });
        });
    }
});
