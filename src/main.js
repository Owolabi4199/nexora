import { initializeApp } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, onAuthStateChanged, signOut
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";
import "./style.css";
import { firebaseConfig } from "./firebase-config.js";


const appRoot = document.querySelector("#app");
const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
let auth;
let db;
let stopTasks = null;
let currentUser = null;
let tasks = [];
let activeFilter = "all";

if (configured) {
  const firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function renderSetup() {
  appRoot.innerHTML = `
    <main class="setup-shell">
      <div class="brand-mark">N</div>
      <p class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
      <h1>Make your<br><span>next move.</span></h1>
      <p class="muted">NEXORA is your personal space to capture ideas, focus on what matters, and turn plans into progress.</p>
      <section class="setup-card">
        <h2>One quick setup step</h2>
        <p>Add your Firebase web app settings to the environment file before running the app. See <strong>README.md</strong> for the exact steps.</p>
        <p class="hint">Your Firebase project is not connected to this code until those settings are added.</p>
      </section>
    </main>`;
}

function renderSignedOut() {
  appRoot.innerHTML = `
    <main class="auth-shell">
      <div class="brand-row"><div class="brand-mark">N</div><span>NEXORA</span></div>
      <section class="hero">
        <p class="eyebrow">A CLEARER WAY FORWARD</p>
        <h1>Big ideas.<br><span>Real momentum.</span></h1>
        <p class="muted">A calm workspace for the things you want to make happen. Start with one move.</p>
      </section>
      <section class="auth-card">
        <h2>Welcome to NEXORA</h2>
        <p class="muted">Sign in to keep your workspace synced.</p>
        <button class="primary-btn" id="google-signin"><span class="google-g">G</span> Continue with Google</button>
        <p class="fine-print">By continuing, you agree to use NEXORA responsibly.</p>
      </section>
      <p class="footer-note">Built for what comes next.</p>
    </main>`;
  document.querySelector("#google-signin").addEventListener("click", async () => {
    const button = document.querySelector("#google-signin");
    button.disabled = true;
    button.textContent = "Connecting…";
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(error.code)) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return;
      }
      alert(error.message || "Sign-in failed. Please try again.");
      button.disabled = false;
      button.innerHTML = '<span class="google-g">G</span> Continue with Google';
    }
  });
}

function filteredTasks() {
  if (activeFilter === "open") return tasks.filter((task) => !task.done);
  if (activeFilter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

function renderWorkspace() {
  const doneCount = tasks.filter((task) => task.done).length;
  const openCount = tasks.length - doneCount;
  const visible = filteredTasks();
  appRoot.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-row"><div class="brand-mark small">N</div><span>NEXORA</span></div>
        <button class="avatar-btn" id="signout" aria-label="Sign out">${escapeHtml((currentUser.displayName || currentUser.email || "N").slice(0,1).toUpperCase())}</button>
      </header>
      <main class="workspace">
        <section class="welcome">
          <p class="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>What's your next<br><span>move, ${escapeHtml((currentUser.displayName || "there").split(" ")[0])}?</span></h1>
          <p class="muted">Small steps create extraordinary things.</p>
        </section>
        <section class="stats">
          <div class="stat-card"><span class="stat-number">${openCount}</span><span class="stat-label">In progress</span></div>
          <div class="stat-card"><span class="stat-number">${doneCount}</span><span class="stat-label">Completed</span></div>
          <div class="stat-card"><span class="stat-number">${tasks.length}</span><span class="stat-label">Total moves</span></div>
        </section>
        <section class="capture">
          <form id="task-form">
            <label for="task-input">Capture your next move</label>
            <div class="capture-row">
              <input id="task-input" maxlength="180" placeholder="What do you want to make happen?" required />
              <button class="add-btn" type="submit" aria-label="Add task">＋</button>
            </div>
          </form>
        </section>
        <section class="list-section">
          <div class="section-heading"><h2>Your moves</h2><span class="count">${tasks.length} total</span></div>
          <nav class="filters" aria-label="Filter tasks">
            <button data-filter="all" class="${activeFilter === "all" ? "selected" : ""}">All</button>
            <button data-filter="open" class="${activeFilter === "open" ? "selected" : ""}">In progress</button>
            <button data-filter="done" class="${activeFilter === "done" ? "selected" : ""}">Completed</button>
          </nav>
          <div class="task-list">
            ${visible.length ? visible.map((task) => `
              <article class="task-item ${task.done ? "is-done" : ""}">
                <button class="check-btn" data-toggle="${task.id}" aria-label="Mark task ${task.done ? "incomplete" : "complete"}">${task.done ? "✓" : ""}</button>
                <span class="task-title">${escapeHtml(task.title)}</span>
                <button class="delete-btn" data-delete="${task.id}" aria-label="Delete task">×</button>
              </article>`).join("") : `
              <div class="empty-state"><div class="empty-icon">✦</div><h3>${tasks.length ? "Nothing in this view" : "Your next move starts here"}</h3><p>${tasks.length ? "Choose another filter to see your tasks." : "Add one small action above. You can build from there."}</p></div>`}
          </div>
        </section>
      </main>
      <footer class="app-footer">NEXORA <span>·</span> Make your next move.</footer>
    </div>`;

  document.querySelector("#signout").addEventListener("click", () => signOut(auth));
  document.querySelector("#task-form").addEventListener("submit", addTask);
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderWorkspace();
  }));
  document.querySelectorAll("[data-toggle]").forEach((button) => button.addEventListener("click", () => toggleTask(button.dataset.toggle)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => removeTask(button.dataset.delete)));
}

async function addTask(event) {
  event.preventDefault();
  const input = document.querySelector("#task-input");
  const title = input.value.trim();
  if (!title || !currentUser) return;
  const submit = event.submitter;
  if (submit) submit.disabled = true;
  try {
    await addDoc(collection(db, "users", currentUser.uid, "tasks"), {
      title, done: false, createdAt: serverTimestamp()
    });
    input.value = "";
  } catch (error) {
    alert(error.message || "Could not save this move.");
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  try {
    await updateDoc(doc(db, "users", currentUser.uid, "tasks", id), { done: !task.done });
  } catch (error) {
    alert(error.message || "Could not update this move.");
  }
}

async function removeTask(id) {
  if (!confirm("Delete this move?")) return;
  try {
    await deleteDoc(doc(db, "users", currentUser.uid, "tasks", id));
  } catch (error) {
    alert(error.message || "Could not delete this move.");
  }
}

function watchTasks(user) {
  if (stopTasks) stopTasks();
  const tasksQuery = query(collection(db, "users", user.uid, "tasks"), orderBy("createdAt", "desc"));
  stopTasks = onSnapshot(tasksQuery, (snapshot) => {
    tasks = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderWorkspace();
  }, (error) => {
    console.error(error);
    appRoot.innerHTML = '<main class="setup-shell"><h1>We could not load your workspace.</h1><p class="muted">Check your Firestore security rules and try again.</p></main>';
  });
}

if (!configured) {
  renderSetup();
} else {
  getRedirectResult(auth).catch((error) => console.error("Sign-in redirect:", error));
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) watchTasks(user);
    else {
      if (stopTasks) stopTasks();
      tasks = [];
      renderSignedOut();
    }
  });
}
