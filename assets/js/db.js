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
        // MERGE instead of overwrite
        for (const key in data.groups) {
            if (!window.ST.groups[key]) {
                window.ST.groups[key] = data.groups[key];
                changed = true;
            } else {
                // Merge groups within section if they are different
                data.groups[key].forEach(cg => {
                    if (!window.ST.groups[key].find(lg => lg.id === cg.id)) {
                        window.ST.groups[key].push(cg);
                        changed = true;
                    }
                });
            }
        }
    }
    
    if (data.evals) {
        // MERGE evals
        for (const id in data.evals) {
            if (!window.ST.evals[id]) {
                window.ST.evals[id] = data.evals[id];
                changed = true;
            }
        }
    }

    if (data.students) {
        // For students, we'll take the cloud version if local is empty/default
        if (window.STUDENTS === window.DEFAULT_STUDENTS) {
            window.STUDENTS = data.students;
            changed = true;
        }
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

export async function forcePullFromCloud() {
    if (!currentUser || !window.ST) return;
    console.log("Manual pull from cloud requested...");
    const userRef = doc(db, "users", currentUser.uid);
    try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            mergeLocalAndCloud(snap.data());
        } else {
            console.log("No cloud data found to pull.");
        }
    } catch (e) {
        console.error("Force Pull Error:", e);
    }
}

export async function broadcastGroupResults(groupId) {
    if (!currentUser || !window.ST) return;
    const ev = window.ST.evals[groupId];
    const group = window.ST.groups[window.ST.level + '-' + window.ST.section]?.find(g => g.id === groupId);
    if (!ev || !group) return;

    const teacherName = currentUser.displayName || "Your Teacher";
    const teacherEmail = currentUser.email;

    const promises = group.studentIds.map(async (sid) => {
        const student = window.getStu(sid);
        const sEv = ev.students[sid];
        if (!student || !sEv || !sEv.custom) return; // Skip if no feedback

        const payload = {
            teacherName,
            teacherEmail,
            unit: ev.unit,
            date: ev.date || new Date().toLocaleDateString(),
            score: window.stuTotal(sEv),
            maxScore: window.getRubric().totalPts,
            feedback: sEv.custom,
            nextGoal: sEv.nextGoal || "",
            scores: sEv.scores,
            studentEmail: student.email,
            timestamp: serverTimestamp()
        };

        return publishToStudentFeed(student.email, groupId + '_' + sid, payload);
    });

    await Promise.all(promises);
}

async function publishToStudentFeed(email, id, payload) {
    if (!email) return;
    // We use a hashed or direct email path for the student results.
    // For simplicity in this demo, we'll store under a collection indexed by email.
    // In production, you'd use a subcollection of the student's own UID if possible,
    // or a global collection with a 'targetEmail' field for query purposes.
    const feedbackRef = doc(db, "student_results", email.toLowerCase().trim(), "evals", id);
    await setDoc(feedbackRef, payload, { merge: true });
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
