import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { incrementInventory } from "./booking.js"; // adjust path if needed

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

export async function loadBookings(userEmail) {
  const tbody = document.querySelector("#reservationsTable tbody");
  tbody.innerHTML = "<tr><td colspan='9'>Loading...</td></tr>";

  // Query bookings for the current user
  const bookingsQuery = query(collection(db, "bookings"), where("email", "==", userEmail));
  const querySnapshot = await getDocs(bookingsQuery);

  tbody.innerHTML = "";
  if (querySnapshot.size === 0) {
    tbody.innerHTML = "<tr><td colspan='9'>No reservations found.</td></tr>";
  } else {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.setAttribute("data-id", doc.id);
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
        <td><button class="btn btn-danger btn-sm cancel-btn">Cancel</button></td>
      `;
      tbody.appendChild(row);
    });
  }
}

const bookingsBtn = document.getElementById('bookingsBtn');
if (bookingsBtn) {
  bookingsBtn.addEventListener('click', function() {
    window.location.href = 'reservations.html';
  });
}

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

document.addEventListener("click", async function(e) {
  if (e.target.classList.contains("cancel-btn")) {
    const row = e.target.closest("tr");
    const docId = row.getAttribute("data-id");
    const roomType = row.children[3].textContent; // 4th column is Room Type
    if (confirm("Are you sure you want to cancel this booking?")) {
      await deleteDoc(doc(db, "bookings", docId));
      await incrementInventory(roomType);
      row.remove();
    }
  }
});