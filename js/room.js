import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function() {

const firebaseConfig = {
    apiKey: "AIzaSyB5L9hv2MXY30hMCYEaVn_EdXRNTEdXZfc",
    authDomain: "roomsync-sia101.firebaseapp.com",
    projectId: "roomsync-sia101",
    storageBucket: "roomsync-sia101.firebasestorage.app",
    messagingSenderId: "279983739273",
    appId: "1:279983739273:web:0808152771eb01e181d158"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function updateUserProfile(user) {
    const userName = user.displayName;

    document.getElementById("userName").textContent = userName;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserProfile(user);
    } else {
        window.location.href = "register.html";
    }
});

});

export function setupDateValidation(startId = 'startDate', endId = 'endDate') {
    const startDate = document.getElementById(startId);
    const endDate = document.getElementById(endId);

    if (startDate && endDate) {
        const today = new Date().toISOString().split('T')[0];
        startDate.min = today;
        endDate.min = today;
        startDate.addEventListener('change', function () {
            endDate.min = startDate.value;
            if (endDate.value < startDate.value) {
                endDate.value = startDate.value;
            }
        });
       
    }
}