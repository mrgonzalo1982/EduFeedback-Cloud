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
    
    // First, try to get a one-time snapshot to do a merge if needed
    try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const cloudData = snap.data();
            mergeLocalAndCloud(cloudData);
        } else {
            // Cloud is empty, push what we have locally
            forcePushLocalToCloud();
        }
    } catch (e) {
        console.error("Initial Sync Error:", e);
    }

    userDocUnsub = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            applyCloudSnapshot(data);
        }
    });
}

function mergeLocalAndCloud(cloudData) {
    console.log("Merging Cloud and Local data...");
    if (!window.ST) return;
    
    let changed = false;
    
    // Merge Groups
    if (cloudData.groups) {
        for (const key in cloudData.groups) {
            if (!window.ST.groups[key]) {
                window.ST.groups[key] = cloudData.groups[key];
                changed = true;
            } else {
                // Merge individual groups within section
                cloudData.groups[key].forEach(cg => {
                    if (!window.ST.groups[key].find(lg => lg.id === cg.id)) {
                        window.ST.groups[key].push(cg);
                        changed = true;
                    }
                });
            }
        }
    }
    
    // Merge Evals
    if (cloudData.evals) {
        for (const id in cloudData.evals) {
            if (!window.ST.evals[id]) {
                window.ST.evals[id] = cloudData.evals[id];
                changed = true;
            }
        }
    }

    if (changed) {
        if (window.renderDash) window.renderDash();
        // If we merged news from cloud, no need to push back immediately 
        // to avoid loops, but we should update LocalStorage
        localStorage.setItem('ef_v2', JSON.stringify({
            groups: window.ST.groups,
            evals: window.ST.evals,
            customStudents: window.STUDENTS !== window.DEFAULT_STUDENTS ? window.STUDENTS : null
        }));
    } else {
        // If nothing changed from cloud, maybe local has more? 
        // Force a persist to ensure cloud is up to date
        forcePushLocalToCloud();
    }
}

function applyCloudSnapshot(data) {
    if (!window.ST) return;
    let changed = false;

    if (data.groqKey) {
        localStorage.setItem('ef_groq_key', data.groqKey);
        if (window.updateAIBadge) window.updateAIBadge();
    }

    if (data.groups) {
        window.ST.groups = data.groups;
        changed = true;
    }
    if (data.evals) {
        window.ST.evals = data.evals;
        changed = true;
    }
    if (data.students) {
        window.STUDENTS = data.students;
        changed = true;
    }
    
    if (changed && window.renderDash) window.renderDash();
}

export async function forcePushLocalToCloud() {
    if (!currentUser || !window.ST) return;
    console.log("Force-syncing Local data to Cloud...");
    await saveToCloud({
        groups: window.ST.groups,
        evals: window.ST.evals
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
