/* =====================================================================
   STUDENT PORTAL LOGIC
 ===================================================================== */
import { db, auth } from './db.js?v=9';
import { collection, query, getDocs, doc, setDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let studentChart = null;
let currentEvals = [];

window.initStudentPortal = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    await fetchStudentResults(user.email);
};

async function fetchStudentResults(email) {
    const listEl = document.getElementById('stu-eval-list');
    if (!listEl) return;

    try {
        const q = query(
            collection(db, "student_results", email.toLowerCase().trim(), "evals"),
            orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        currentEvals = [];
        querySnapshot.forEach((doc) => {
            currentEvals.push({ id: doc.id, ...doc.data() });
        });

        renderStudentHistory();
        renderStudentChart();
        updateNextGoal();
    } catch (e) {
        console.error("Error fetching results:", e);
        listEl.innerHTML = `<div style="color:var(--red)">Failed to load results.</div>`;
    }
}

function renderStudentHistory() {
    const listEl = document.getElementById('stu-eval-list');
    if (!listEl || currentEvals.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text4)">No assessments published yet.</div>`;
        return;
    }

    listEl.innerHTML = currentEvals.map(ev => {
        const pass = ev.score >= (ev.maxScore * 0.6); // Simple threshold for UI
        return `
            <div class="student-card" onclick="viewFullFeedback('${ev.id}')">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <div>
                        <div style="font-size:11px; color:var(--purple); font-weight:800; text-transform:uppercase">Unit ${ev.unit}</div>
                        <div style="font-size:16px; font-weight:700">${ev.teacherName}</div>
                        <div style="font-size:12px; color:var(--text3)">${ev.date}</div>
                    </div>
                    <div style="text-align:right">
                        <div style="font-size:20px; font-weight:900; color:${pass ? 'var(--green)' : 'var(--red)'}">${ev.score}/${ev.maxScore}</div>
                        <div class="badge ${pass ? 'bdg-pass' : 'bdg-fail'}" style="font-size:10px">${pass ? 'PASS' : 'FAIL'}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateNextGoal() {
    const goalEl = document.getElementById('stu-next-goal');
    if (!goalEl) return;
    
    const latest = currentEvals[0];
    if (latest && latest.nextGoal) {
        goalEl.textContent = latest.nextGoal;
    }
}

function renderStudentChart() {
    const ctx = document.getElementById('stuChart');
    if (!ctx || currentEvals.length === 0) return;

    if (studentChart) studentChart.destroy();

    const data = [...currentEvals].reverse(); // Oldest first for chart
    const labels = data.map(ev => `Unit ${ev.unit}`);
    const scores = data.map(ev => (ev.score / ev.maxScore) * 100);

    studentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance %',
                data: scores,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, grid: { display: false }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

window.submitReflection = async () => {
    const box = document.getElementById('stu-reflection-box');
    const text = box.value.trim();
    const user = auth.currentUser;
    if (!text || !user || currentEvals.length === 0) return;

    const latestId = currentEvals[0].id;
    const refPath = doc(db, "student_interactions", user.email.toLowerCase().trim(), "evals", latestId);

    try {
        window.showToast("Submitting...", "var(--purple)");
        await setDoc(refPath, {
            reflection: text,
            timestamp: serverTimestamp()
        }, { merge: true });
        window.showToast("Reflection saved!", "var(--green)");
        box.value = '';
    } catch (e) {
        console.error("Reflection Error:", e);
    }
};

window.viewFullFeedback = (id) => {
    const ev = currentEvals.find(e => e.id === id);
    if (!ev) return;
    
    // We recreate the student evaluation object to reuse the teacher's rendering logic if possible,
    // or we create a specific mini-renderer for the student.
    // For now, let's just alert the basic feedback.
    alert(`Feedback for Unit ${ev.unit}:\n\n${ev.feedback}`);
};
