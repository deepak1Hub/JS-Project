import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { auth } from "./firebase.js";
import { db } from "./firebase.js";
import { loadEventsFromFirestore } from "./fireStoreEvents.js";

export async function storeClickedEvent(event) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("User not logged in");
    return;
  }

  const userEmail = user.email;
  const ref = doc(db, "clickedEvents", userEmail);
  const docSnap = await getDoc(ref);

  const existing = docSnap.exists() ? docSnap.data().eventIds || [] : [];

  // Prevent duplicates
  if (!existing.includes(event.id)) {
    const updated = [...existing, event.id];

    await setDoc(ref, { eventIds: updated });
    console.log("Stored clicked event for:", userEmail);
  }
}



const wrapper = document.getElementById("clickedEventsWrapper");

auth.onAuthStateChanged(async user => {
  if (!user) {
    wrapper.innerHTML = `<p class="text-red-500 text-center">Please log in to view your clicked events.</p>`;
    return;
  }

  const ref = doc(db, "clickedEvents", user.email);
  const docSnap = await getDoc(ref);
  const eventIds = docSnap.exists() ? docSnap.data().eventIds : [];

  if (eventIds.length === 0) {
    wrapper.innerHTML = `<p class="text-center text-gray-600">You haven't clicked any events yet.</p>`;
    return;
  }

  const allEventData = await loadEventsFromFirestore();
  const matchedEvents = [];

  Object.values(allEventData.events).forEach(categoryEvents => {
    matchedEvents.push(
      ...categoryEvents.filter(e => eventIds.includes(e.id))
    );
  });

  matchedEvents.forEach(event => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow p-4";
    div.innerHTML = `
      <img src="${event.image}" alt="${event.name}" class="w-full h-48 object-cover rounded mb-2" />
      <h3 class="text-xl font-bold">${event.name}</h3>
      <p class="text-sm text-gray-600">📍 ${event.location}</p>
      <p class="text-sm text-red-600">💰 ${event.price}</p>
    `;
    wrapper.appendChild(div);
  });
});



