import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDoc, updateDoc, 
  setDoc, doc, query, where, getDocs, deleteDoc // <-- Add query, where, getDocs, and deleteDoc here
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
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

// Fetch inventory from Firestore
export async function fetchRoomInventory() {
  const docRef = doc(db, "inventory", "rooms");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return {};
  }
}

// Display inventory on the booking form
export async function displayRoomInventory() {
  const inventory = await fetchRoomInventory();
  const select = document.querySelectorAll("#roomType");
  select.forEach(sel => {
    Array.from(sel.options).forEach(option => {
      if (inventory[option.value] !== undefined) {
        option.textContent = `${option.textContent.split(' (')[0]} (${inventory[option.value]} available)`;
      }
    });
  });
}

export async function decrementInventory(roomType) {
  const docRef = doc(db, "inventory", "rooms");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data[roomType] > 0) {
      data[roomType]--;
      await updateDoc(docRef, { [roomType]: data[roomType] });
      await displayRoomInventory();
    }
  }
}

export function setupBookingSubmission(formSelector = "#bookingModal form") {
  const auth = getAuth();
  let currentUser = null;

  // Listen for auth state changes and store the user
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });

  document.addEventListener("submit", async function (e) {
    const form = e.target;
    if (form.matches(formSelector)) {
      e.preventDefault();

      // Use the user from the auth state listener
      const userEmail = currentUser ? currentUser.email : "";

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
        paymentMethod: form.querySelector("#paymentMethod") ? form.querySelector("#paymentMethod").value : "",
        gcashRef: form.querySelector("#gcashRef") ? form.querySelector("#gcashRef").value : "",
        timestamp: new Date().toISOString()
      };

    
      const docId = data.name.trim().toLowerCase().replace(/\s+/g, "_");

      try {
        // Check if the user is logged in
        if (!currentUser) {
          alert("You must be logged in to book.");
          return;
        }

        if (data.paymentMethod === "gcash") {
          if (!data.gcashRef) {
            alert("Please enter your GCash Reference Number.");
            return;
          }
          if (!/^\d{13}$/.test(data.gcashRef)) {
            alert("GCash Reference Number must be exactly 13 digits.");
            return;
          }
        }

        await setDoc(doc(db, "bookings", docId), data);
        await decrementInventory(data.roomType);
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
  const confirmationModalEl = document.getElementById('confirmationModal');
  const confirmationDetails = document.getElementById('confirmationDetails');
  const finalConfirmBtn = document.getElementById('finalConfirmBtnConfirm');
  const showConfirmationBtn = document.getElementById('showConfirmationBtn');

  if (!bookingForm || !showConfirmationBtn || !confirmationModalEl || !confirmationDetails || !finalConfirmBtn) return;

  const confirmationModal = new bootstrap.Modal(confirmationModalEl);

  showConfirmationBtn.addEventListener('click', function () {
    const details = [
      { label: "Room Type", value: bookingForm.querySelector('#roomType').value },
      { label: "Full Name", value: bookingForm.querySelector('#name').value },
      { label: "Contact Number", value: bookingForm.querySelector('#contact').value },
      { label: "Booking Start Date", value: bookingForm.querySelector('#startDate').value },
      { label: "Booking End Date", value: bookingForm.querySelector('#endDate').value },
      { label: "Number of Guests", value: bookingForm.querySelector('#guests').value },
      { label: "Payment Method", value: bookingForm.querySelector('#paymentMethod').value },
      { label: "GCash Ref No.", value: bookingForm.querySelector('#gcashRef').value }
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


export function setupMainFormToModalSync() {
  const mainForm = document.querySelector('section .card form');
  const modalForm = document.querySelector('#bookingModal form');
  const showConfirmationBtn = document.getElementById('showConfirmationBtn');
  const bookingModalEl = document.getElementById('bookingModal');
  if (!mainForm || !modalForm || !showConfirmationBtn || !bookingModalEl) return;

  const bookingModal = new bootstrap.Modal(bookingModalEl);

  showConfirmationBtn.addEventListener('click', function () {
    ['roomType', 'name', 'contact', 'email', 'startDate', 'endDate', 'guests'].forEach(id => {
      modalForm.querySelector(`#${id}`).value = mainForm.querySelector(`#${id}`).value;
    });
    bookingModal.show();
  });
}

export function setupDateValidation(startId = 'startDate', endId = 'endDate', startTimeId = 'startTime', endTimeId = 'endTime') {
    const startDate = document.getElementById(startId);
    const endDate = document.getElementById(endId);
    const startTime = document.getElementById(startTimeId);
    const endTime = document.getElementById(endTimeId);

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

    if (startTime && endTime) {
        startTime.addEventListener('change', function () {
            endTime.min = startTime.value;
            if (endTime.value < startTime.value) {
                endTime.value = startTime.value;
            }
        });
        if (startDate) {
            startDate.addEventListener('change', function () {
                endTime.min = startTime.value;
            });
        }
    }
}

export async function restoreExpiredBookings() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5); 

  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef); 

  const expiredBookings = await getDocs(q);

  if (expiredBookings.empty) return;

  const inventoryDocRef = doc(db, "inventory", "rooms");
  const inventorySnap = await getDoc(inventoryDocRef);
  let inventory = inventorySnap.exists() ? inventorySnap.data() : {};

  let updated = false;

  for (const bookingDoc of expiredBookings.docs) {
    const booking = bookingDoc.data();
    const roomType = booking.roomType;

    if (booking.endTime && booking.endTime <= currentTime && roomType && inventory[roomType] !== undefined) {
      inventory[roomType]++;
      updated = true;
      await deleteDoc(bookingDoc.ref);
    }
  }

  if (updated) {
    await updateDoc(inventoryDocRef, inventory);
    await displayRoomInventory();
  }
}