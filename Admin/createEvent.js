import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const eventForm = document.getElementById("eventForm");
const taskForm = document.getElementById("taskForm");
const expenseForm = document.getElementById("expenseForm");
const dashboard = document.getElementById("dashboard");

let events = [];

let currentEventId = null;

eventForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const location = document.getElementById("eventLocation").value.trim();

  if (!name || !date || !location) return;

  const newEvent = {
    name,
    date,
    location,
    tasks: [],
    expenses: [],
  };

  try {
    const docRef = await addDoc(collection(db, "events"), newEvent);
    newEvent.id = docRef.id;
    events.push({ ...newEvent });
    currentEventId = docRef.id;
    renderDashboard();
    eventForm.reset();
  } catch (error) {
    console.error("Error adding event: ", error);
  }
});

taskForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentEventId) return alert("Please create an event first!");

  const title = document.getElementById("taskTitle").value.trim();
  const assignedTo = document.getElementById("assignedTo").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;

  const task = { title, assignedTo, dueDate, completed: false };

  try {
    const eventRef = doc(db, "events", currentEventId);
    await updateDoc(eventRef, {
      tasks: arrayUnion(task),
    });

    const event = events.find((e) => e.id === currentEventId);
    event.tasks.push(task);
    renderDashboard();
    taskForm.reset();
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

// Expense addition
expenseForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!currentEventId) return alert("Please create an event first!");

  const title = document.getElementById("expenseTitle").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;

  const expense = { title, amount, category };

  try {
    const eventRef = doc(db, "events", currentEventId);
    await updateDoc(eventRef, {
      expenses: arrayUnion(expense),
    });

    const event = events.find((e) => e.id === currentEventId);
    event.expenses.push(expense);
    renderDashboard();
    expenseForm.reset();
  } catch (error) {
    console.error("Error adding expense:", error);
  }
});

// Dashboard rendering
function renderDashboard() {
  dashboard.innerHTML = "";

  events.forEach((event) => {
    // Fix: Default undefined tasks/expenses to empty arrays
    const tasks = event.tasks || [];
    const expenses = event.expenses || [];

    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow-md relative";

    const activeTasks = event.tasks.filter((t) => !t.completed);
    const completedTasks = event.tasks.filter((t) => t.completed);

    const activeTaskHTML = activeTasks
      .map(
        (t, i) => `
  <li class="text-sm flex justify-between items-center">
    <label class="flex items-center space-x-2">
      <input 
        type="checkbox" 
        onchange="toggleTaskComplete('${event.id}', ${event.tasks.indexOf(t)})"
        class="form-checkbox h-4 w-4 text-green-600 rounded"
      />
      <span>${t.title} - <span class="text-gray-600">${t.assignedTo}</span> (${
          t.dueDate
        })</span>
    </label>
    <button onclick="deleteTask('${event.id}', ${event.tasks.indexOf(
          t
        )})" class="text-red-500 hover:text-red-700">✕</button>
  </li>
`
      )
      .join("");

    const completedTaskHTML = completedTasks
      .map(
        (t, i) => `
  <li class="text-sm flex justify-between items-center">
    <label class="flex items-center space-x-2">
      <input 
        type="checkbox" 
        checked 
        onchange="toggleTaskComplete('${event.id}', ${event.tasks.indexOf(t)})"
        class="form-checkbox h-4 w-4 text-green-600 rounded"
      />
      <span class="line-through text-gray-400">${t.title} - ${t.assignedTo} (${
          t.dueDate
        })</span>
    </label>
    <button onclick="deleteTask('${event.id}', ${event.tasks.indexOf(
          t
        )})" class="text-red-500 hover:text-red-700">✕</button>
  </li>
`
      )
      .join("");

    window.toggleTaskComplete = async function (eventId, taskIndex) {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      event.tasks[taskIndex].completed = !event.tasks[taskIndex].completed;

      try {
        // Overwrite tasks array in Firestore
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, { tasks: event.tasks });

        renderDashboard();
      } catch (error) {
        console.error("Error updating task completion:", error);
      }
    };

    const expenseHTML = expenses
      .map(
        (e, i) => `
        <li class="text-sm flex justify-between items-center">
          <span>💰 ${e.title} - $${e.amount.toFixed(
          2
        )} <span class="text-gray-600">(${e.category})</span></span>
          <button onclick="deleteExpense('${
            event.id
          }', ${i})" class="text-red-500 hover:text-red-700">✕</button>
        </li>
      `
      )
      .join("");

    card.innerHTML = `
        <button onclick="deleteEvent('${
          event.id
        }')" class="absolute top-2 right-2 text-red-500 hover:text-red-700">🗑️</button>
        <h3 class="text-xl font-bold text-orange-600">${event.name}</h3>
        <p class="text-gray-600">📅 ${event.date}</p>
        <p class="text-gray-600 mb-2">📍 ${event.location}</p>


        <div class="mb-3">
  <div class="text-sm text-gray-600 mb-1">Progress</div>
  <div class="w-full bg-gray-200 rounded-full h-2.5">
    <div class="bg-green-500 h-2.5 rounded-full" style="width: ${
      (completedTasks.length / event.tasks.length) * 100 || 0
    }%"></div>
  </div>
</div>
  
        <div class="mt-4">
  <h4 class="font-semibold text-gray-700">Tasks</h4>
  <div>
    <p class="text-sm text-gray-600">🟢 Active</p>
    <ul class="list-disc ml-5 space-y-1">${
      activeTaskHTML || '<li class="text-sm text-gray-400">No active tasks</li>'
    }</ul>
  </div>
  <div class="mt-2">
    <p class="text-sm text-gray-600">✅ Completed</p>
    <ul class="list-disc ml-5 space-y-1">${
      completedTaskHTML ||
      '<li class="text-sm text-gray-400">No completed tasks</li>'
    }</ul>
  </div>
</div>

  
        <div class="mt-4">
          <h4 class="font-semibold text-gray-700">Expenses</h4>
          <ul class="list-disc ml-5 space-y-1">${
            expenseHTML ||
            '<li class="text-sm text-gray-400">No expenses added</li>'
          }</ul>
        </div>
      `;

    dashboard.appendChild(card);
  });
}

// Delete an entire event
window.deleteEvent = async function (eventId) {
  try {
    await deleteDoc(doc(db, "events", eventId));
    events = events.filter((e) => e.id !== eventId);
    if (currentEventId === eventId) currentEventId = null;
    renderDashboard();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

// Delete a task from an event
window.deleteTask = async function (eventId, taskIndex) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.tasks.splice(taskIndex, 1);

  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      tasks: event.tasks,
    });
    renderDashboard();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Delete an expense from an event
window.deleteExpense = async function (eventId, expenseIndex) {
  const event = events.find((e) => e.id === eventId);
  if (!event) return;

  event.expenses.splice(expenseIndex, 1);

  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      expenses: event.expenses,
    });
    renderDashboard();
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    events = [];

    querySnapshot.forEach((docSnap) => {
      const eventData = docSnap.data();
      events.push({ id: docSnap.id, ...eventData });
    });

    renderDashboard();
  } catch (error) {
    console.error("Error loading events:", error);
  }
});
