import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5L9hv2MXY30hMCYEaVn_EdXRNTEdXZfc",
  authDomain: "roomsync-sia101.firebaseapp.com",
  projectId: "roomsync-sia101",
  storageBucket: "roomsync-sia101.appspot.com",
  messagingSenderId: "279983739273",
  appId: "1:279983739273:web:0808152771eb01e181d158"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadBookings() {
  const tbody = document.querySelector("#reservationsTable tbody");
  tbody.innerHTML = "<tr><td colspan='9'>Loading...</td></tr>";

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      tbody.innerHTML = "<tr><td colspan='9'>Please log in to view your bookings.</td></tr>";
      return;
    }

    const userEmail = user.email;
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    tbody.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ""}</td>
        <td>${data.contact || ""}</td>
        <td>${data.email || ""}</td>
        <td>${data.roomType || ""}</td>
        <td>${data.guests || ""}</td>
        <td>${data.startDate || ""}</td>
        <td>${data.endDate || ""}</td>
        <td>${data.paymentMethod || ""}</td>
        <td>${data.gcashRef || ""}</td>
      `;
      tbody.appendChild(row);
    });
    if (tbody.innerHTML === "") {
      tbody.innerHTML = "<tr><td colspan='9'>No reservations found.</td></tr>";
    }
  });
}

document.getElementById('bookingsBtn').addEventListener('click', function() {
  window.location.href = 'reservations.html';
});

export function setupBookingSubmission(formSelector = "#bookingModal form") {
  document.addEventListener("submit", async function (e) {
    const form = e.target;
    if (form.matches(formSelector)) {
      e.preventDefault();

      // Get the current user
      const auth = getAuth();
      const user = auth.currentUser;
      const userEmail = user ? user.email : "";

      const data = {
        roomType: form.querySelector("#roomType").value,
        name: form.querySelector("#name").value,
        contact: form.querySelector("#contact").value,
        email: userEmail,
        startDate: form.querySelector("#startDate").value,
        endDate: form.querySelector("#endDate").value,
        startTime: form.querySelector("#startTime").value,
        endTime: form.querySelector("#endTime").value,
        guests: form.querySelector("#guests").value,
        timestamp: new Date().toISOString()
      };

      
    }
  });
}

function renderBookingRow(booking) {
  return `
    <tr>
      <td>${booking.name || ""}</td>
      <td>${booking.contact || ""}</td>
      <td>${booking.email || ""}</td>
      <td>${booking.roomType || ""}</td>
      <td>${booking.guests || ""}</td>
      <td>${booking.startDate || ""}</td>
      <td>${booking.endDate || ""}</td>
      <td>${booking.paymentMethod || ""}</td>
      <td>${booking.gcashRef || ""}</td>
    </tr>
  `;
}