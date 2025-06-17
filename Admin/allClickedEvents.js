import { db } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const wrapper = document.getElementById("allClickedEventsWrapper");

async function getAllClickedEvents() {
  const clickedRef = collection(db, "clickedEvents");
  const snapshot = await getDocs(clickedRef);

  if (snapshot.empty) {
    wrapper.innerHTML = "<p class='text-center text-gray-600'>No clicked events found.</p>";
    return;
  }

  for (const userDoc of snapshot.docs) {
    const email = userDoc.id;
    const data = userDoc.data();
    const eventIds = data.eventIds || [];

    console.log(`🧠 Fetching clicked events for: ${email}`, eventIds);

    if (eventIds.length === 0) {
      const userSection = document.createElement("div");
      userSection.innerHTML = `
        <h2 class="text-xl font-bold text-blue-600">${email}</h2>
        <p class="text-gray-500 italic">No events clicked yet.</p>
      `;
      wrapper.appendChild(userSection);
      continue;
    }

    const eventCards = [];

    for (const id of eventIds) {
      try {
        const eventDoc = await getDoc(doc(db, "allEvents", id));
        if (eventDoc.exists()) {
          const event = eventDoc.data();
          eventCards.push(`
            <div class="bg-white rounded-lg shadow p-4">
              <img src="${event.image}" alt="${event.name}" class="w-full h-40 object-cover rounded mb-2" />
              <h3 class="text-lg font-bold">${event.name}</h3>
              <p class="text-gray-600">📍 ${event.location || "No location"}</p>
              <p class="text-red-500">💰 ${event.price || "No price listed"}</p>
            </div>
          `);
        } else {
          console.warn(`⚠️ Event not found in 'events' collection with ID: ${id}`);
        }
      } catch (err) {
        console.error("🔥 Error loading event:", id, err.message);
      }
    }

    const userSection = document.createElement("div");
    userSection.innerHTML = `
      <h2 class="text-xl font-bold text-blue-600 mb-2">${email}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${eventCards.length > 0 ? eventCards.join("") : "<p class='text-gray-500 italic'>No valid events found.</p>"}
      </div>
    `;
    wrapper.appendChild(userSection);
  }
}

getAllClickedEvents();
