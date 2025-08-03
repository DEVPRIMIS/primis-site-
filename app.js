import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "***",
  authDomain: "primis-39910.firebaseapp.com",
  projectId: "primis-39910",
  storageBucket: "primis-39910.appspot.com",
  messagingSenderId: "***",
  appId: "***"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth & DOM
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userEmailSpan = document.getElementById("userEmail");
const mainSection = document.getElementById("main");
const authSection = document.getElementById("auth");
const postBtn = document.getElementById("postBtn");
const messageInput = document.getElementById("message");
const feed = document.getElementById("feed");

registerBtn.onclick = () => {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(() => alert("Compte créé"))
    .catch(e => alert(e.message));
};

loginBtn.onclick = () => {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .catch(e => alert(e.message));
};

logoutBtn.onclick = () => signOut(auth);

postBtn.onclick = async () => {
  const message = messageInput.value.trim();
  if (message) {
    await addDoc(collection(db, "posts"), {
      user: auth.currentUser.email,
      text: message,
      timestamp: new Date()
    });
    messageInput.value = "";
  }
};

onAuthStateChanged(auth, user => {
  if (user) {
    authSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    userEmailSpan.textContent = user.email;
  } else {
    authSection.classList.remove("hidden");
    mainSection.classList.add("hidden");
  }
});

onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), snapshot => {
  feed.innerHTML = "";
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().user}: ${doc.data().text}`;
    feed.appendChild(li);
  });
});
