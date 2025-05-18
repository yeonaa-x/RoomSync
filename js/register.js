import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5L9hv2MXY30hMCYEaVn_EdXRNTEdXZfc",
    authDomain: "roomsync-sia101.firebaseapp.com",
    projectId: "roomsync-sia101",
    storageBucket: "roomsync-sia101.firebasestorage.app",
    messagingSenderId: "279983739273",
    appId: "1:279983739273:web:0808152771eb01e181d158"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            window.location.href = "login.html";
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error: " + errorMessage);
            // ..
        });
});

const googleButton = document.getElementById("googlebutton");
googleButton.addEventListener("click", function (event) {
    event.preventDefault();

    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log(user);
            window.location.href = "login.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});