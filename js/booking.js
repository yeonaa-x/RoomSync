import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


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


export function setupBookingSubmission(formSelector = "#bookingModal form") {
  document.addEventListener("submit", async function (e) {
    const form = e.target;
    if (form.matches(formSelector)) {
      e.preventDefault();

      const data = {
        roomType: form.querySelector("#roomType").value,
        name: form.querySelector("#name").value,
        contact: form.querySelector("#contact").value,
        email: form.querySelector("#email").value,
        startDate: form.querySelector("#startDate").value,
        endDate: form.querySelector("#endDate").value,
        guests: form.querySelector("#guests").value,
        timestamp: new Date().toISOString()
      };

      try {
        console.log("Booking data:", data);
        await addDoc(collection(db, "bookings"), data);
        alert("Booking submitted!");
        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        if (modal) modal.hide();
      } catch (error) {
        alert("Error saving booking: " + error.message);
      }
    }
  });
}


export function setupBookingConfirmation() {
  const bookingForm = document.querySelector('#bookingModal form');
  const showConfirmationBtn = document.getElementById('showConfirmationBtn');
  const confirmationModalEl = document.getElementById('confirmationModal');
  const confirmationDetails = document.getElementById('confirmationDetails');
  const finalConfirmBtn = document.getElementById('finalConfirmBtn');

  if (!bookingForm || !showConfirmationBtn || !confirmationModalEl || !confirmationDetails || !finalConfirmBtn) return;

  const confirmationModal = new bootstrap.Modal(confirmationModalEl);

  showConfirmationBtn.addEventListener('click', function () {
    const details = [
      { label: "Room Type", value: bookingForm.querySelector('#roomType').value },
      { label: "Full Name", value: bookingForm.querySelector('#name').value },
      { label: "Contact Number", value: bookingForm.querySelector('#contact').value },
      { label: "Email", value: bookingForm.querySelector('#email').value },
      { label: "Booking Start Date", value: bookingForm.querySelector('#startDate').value },
      { label: "Booking End Date", value: bookingForm.querySelector('#endDate').value },
      { label: "Number of Guests", value: bookingForm.querySelector('#guests').value }
    ];
    confirmationDetails.innerHTML = details.map(d =>
      `<li class="list-group-item"><strong>${d.label}:</strong> ${d.value}</li>`
    ).join('');
    confirmationModal.show();
  });

  finalConfirmBtn.addEventListener('click', function () {
    bookingForm.requestSubmit();
    confirmationModal.hide();
  });
}