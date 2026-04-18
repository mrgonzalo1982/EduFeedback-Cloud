/* =====================================================================
   FIREBASE ENGINE — AUTH & FIRESTORE
===================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let app, auth, db;
let userDocUnsub = null;

// User state
export let currentUser = null;

export async function initFirebase(config) {
    if (!config || !config.apiKey) return false;
    try {
        app = initializeApp(config);
        auth = getAuth(app);
        db = getFirestore(app);
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                // Success: sync data
                await syncUserFromCloud(user.uid);
                window.onUserLogin?.(user);
            } else {
                currentUser = null;
                window.onUserLogout?.();
            }
        });
        return true;
    } catch (e) {
        console.error("Firebase Init Error:", e);
        return false;
    }
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (e) {
        console.error("Login Error:", e);
        throw e;
    }
}

export async function logout() {
    if (userDocUnsub) userDocUnsub();
    await signOut(auth);
}

// Data Sync
async function syncUserFromCloud(uid) {
    const userRef = doc(db, "users", uid);
    userDocUnsub = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            
            // Sync AI config
            if (data.groqKey) {
                localStorage.setItem('ef_groq_key', data.groqKey);
                if (window.updateAIBadge) window.updateAIBadge();
            }

            // Sync Application State (ST)
            // We use a window global 'ST' from logic.js
            if (window.ST) {
                if (data.groups) window.ST.groups = data.groups;
                if (data.evals) window.ST.evals = data.evals;
                if (data.students) window.STUDENTS = data.students;
                
                // Re-render dashboard if we are there
                if (window.renderDash) window.renderDash();
            }
        }
    });
}

export async function saveToCloud(data) {
    if (!currentUser) return;
    try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, data, { merge: true });
    } catch (e) {
        console.error("Cloud Save Error:", e);
    }
}

export async function saveGroqKeyToCloud(key) {
    if (!currentUser) return;
    await saveToCloud({ groqKey: key });
}
