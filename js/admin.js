
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDdpsB59V6pDdpbAHmqZoxxs0FpTezlWi8",
    authDomain: "roomsync-admin-74116.firebaseapp.com",
    projectId: "roomsync-admin-74116",
    storageBucket: "roomsync-admin-74116.firebasestorage.app",
    messagingSenderId: "152060402350",
    appId: "1:152060402350:web:01ddced862a18fe73e2b3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const adminButton = document.getElementById('adminBtn');
adminButton.addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('adminID').value;
    const password = document.getElementById('adminPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});