import { loadEventsFromFirestore } from "./fireStoreEvents.js";
import { storeClickedEvent } from "./clickedEvents.js"


const wrapper = document.getElementById("eventsWrapper");

function capitalizeWords(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function createEventSection(category, events) {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2 class="text-2xl font-semibold mb-4">${capitalizeWords(category)}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      ${events
        .map(
          event => `
        <div 
          class="event-card bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
           data-event-id="${event.id}"
        >
          <img src="${event.image}" alt="${event.name}" class="w-full h-48 object-cover" />
          <div class="p-4 space-y-1">
            <h3 class="text-lg font-semibold">${event.name}</h3>
            <p class="text-sm text-gray-600">📍 ${event.location || "Location not specified"}</p>
            <p class="text-sm text-red-600 font-medium">💰 ${event.price || "Price not listed"}</p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;


  section.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", () => {
      const eventId = card.getAttribute("data-event-id");
      const clickedEvent = events.find(e => e.id == eventId);
    
      console.log("Clicked card:", eventId);
      alert(`Clicked`,clickedEvent)
    
      if (clickedEvent) {
        console.log("Calling storeClickedEvent with:", clickedEvent); 
        storeClickedEvent(clickedEvent);
      } else {
        console.warn("Event not found for ID:", eventId);
      }
    });    
  });

  return section;
}

  

async function renderEvents() {
  const data = await loadEventsFromFirestore();

  if (data?.events) {
    Object.entries(data.events).forEach(([category, events]) => {
      const section = createEventSection(category, events);
      wrapper.appendChild(section);
    });
  } else {
    wrapper.innerHTML = `<p class="text-red-500 text-center text-xl">No events found.</p>`;
  }

  console.log("Loaded event data:", data);

}

renderEvents();
