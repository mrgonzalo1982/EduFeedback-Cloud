/* =====================================================================
   STATE
===================================================================== */
let STUDENTS = DEFAULT_STUDENTS; // Initialized from data.js

const ST = {
  level:'6', section:'1',
  selecting:false, selected:[],
  groups:{}, evals:{},
  curGroup:null, activeTab:0,
  pendingDelete:null,
  aiProvider: 'groq',
  groupChecklist: {}, // { gid: { item_id: bool } }
};

const TIMERS = {}; // { sid: { elapsed, running, iid } }
const DEBOUNCE = {};

/* =====================================================================
   PERSISTENCE
===================================================================== */
function persist(){
  try {
    localStorage.setItem('ef_v2', JSON.stringify({
      groups: ST.groups,
      evals: ST.evals,
      customStudents: STUDENTS !== DEFAULT_STUDENTS ? STUDENTS : null
    }));
  } catch(e) {}
}

function restore(){
  try {
    const d = JSON.parse(localStorage.getItem('ef_v2') || '{}');
    if(d.groups) ST.groups = d.groups;
    if(d.evals) ST.evals = d.evals;
    if(d.customStudents) STUDENTS = d.customStudents;
  } catch(e) {}
}

/* =====================================================================
   HELPERS
===================================================================== */
function secKey(){ return `${ST.level}-${ST.section}`; }
function getGroups(){ return ST.groups[secKey()] || []; }
function setGroups(g){ ST.groups[secKey()] = g; }

function getStu(id){
  for(const lv of Object.values(STUDENTS)) {
    for(const s of Object.values(lv)) {
      const f = s.find(x => x.id === id);
      if(f) return f;
    }
  }
  return null;
}

function getStuList(){ return STUDENTS[ST.level]?.[ST.section] || []; }
function initials(fn, ln){ return ((fn || '?')[0] + (ln || '?')[0]).toUpperCase(); }
function avatarGrad(id){ 
  const c = [['#8b5cf6','#ec4899'],['#3b82f6','#8b5cf6'],['#10b981','#3b82f6'],['#f59e0b','#ef4444'],['#ec4899','#f97316'],['#6366f1','#22d3ee']];
  return `linear-gradient(135deg,${c[id.charCodeAt(0) % c.length].join(',')})`; 
}
function fmtDate(){ return new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',day:'numeric'}).format(new Date()); }
function uid(){ return Math.random().toString(36).slice(2,10); }

function unassignedIds(){
  const used = new Set(getGroups().flatMap(g => g.studentIds));
  return getStuList().filter(s => !used.has(s.id)).map(s => s.id);
}

function stuTotal(sEv){
  if(!sEv) return null;
  const config = getRubric();
  const v = config.criteria.map(c => sEv.scores?.[c]);
  if(v.some(x => x == null || x === undefined)) return null;
  return v.reduce((a,b) => a + b, 0);
}

function scoreColor(t){
  if(t === null) return 'var(--text3)';
  const config = getRubric();
  const ratio = t / config.totalPts;
  if(ratio >= 0.875) return '#22c55e'; // ~14/16 or ~26/30
  if(ratio >= 0.625) return '#3b82f6'; // ~10/16 or ~18/30
  if(ratio >= 0.375) return '#f59e0b';
  return '#ef4444';
}

function getEv(){ return ST.evals[ST.curGroup.id]; }
function getStuEv(sid){ return getEv().students[sid]; }
function bandStyle(pts){
  const config = getRubric();
  const max = config.bandInfo[0].pts; // e.g. 4 or 5
  const ratio = pts / max;
  if(pts === null) return ['#f9fafb', '#374151'];
  if(ratio >= 0.8) return ['#dcfce7', '#166534']; // Exc
  if(ratio >= 0.6) return ['#dbeafe', '#1e40af']; // Good
  if(ratio >= 0.4) return ['#fef3c7', '#78350f']; // Sat
  if(ratio >= 0.2) return ['#fff7ed', '#9a3412']; // Dev
  return ['#fef2f2', '#991b1b']; // Beg
}

/* =====================================================================
   NAVIGATION
===================================================================== */
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if(target) target.classList.add('active');
  updateBC(name);
}

function updateBC(screen){
  const bc = document.getElementById('breadcrumb');
  if(!bc) return;
  if(screen === 'dashboard'){
    bc.innerHTML = `<span class="bc-now">Dashboard</span>`;
  } else if(screen === 'evaluation' && ST.curGroup){
    bc.innerHTML = `<span class="bc-link" onclick="goToDash()">Dashboard</span><span class="bc-sep">›</span><span class="bc-link" onclick="goToDash()">Section ${ST.section}</span><span class="bc-sep">›</span><span class="bc-now">${ST.curGroup.name}</span>`;
  }
}

function goToDash(){
  if(ST.curGroup) autoSave();
  ST.curGroup = null;
  showScreen('dashboard');
  renderDash();
}

function autoSave(){
  if(!ST.curGroup) return;
  const ev = ST.evals[ST.curGroup.id];
  if(ev && ev.unit) persist();
}

/* =====================================================================
   DASHBOARD
===================================================================== */
function renderSectionTabs(){
  const tabs = document.getElementById('section-tabs');
  if(!tabs || !STUDENTS[ST.level]) return;
  tabs.innerHTML = Object.keys(STUDENTS[ST.level]).map(s => `
    <button class="tab${s === ST.section ? ' active' : ''}" onclick="switchSec('${s}')">Section ${s}</button>
  `).join('');
}

function switchSec(s){
  ST.section = s;
  ST.selecting = false;
  ST.selected = [];
  renderSectionTabs();
  renderDash();
}

function onLevelChange(){
  ST.level = document.getElementById('level-sel').value;
  const sections = Object.keys(STUDENTS[ST.level] || {});
  ST.section = sections[0] || '1';
  renderSectionTabs();
  renderDash();
}

function renderDash(){
  const groups = getGroups();
  const done = groups.filter(g => ST.evals[g.id]?.unit).length;
  const progEl = document.getElementById('dash-prog');
  if(progEl) progEl.textContent = `Level ${ST.level} · Section ${ST.section} · ${groups.length} group${groups.length !== 1 ? 's' : ''} · ${done}/${groups.length} evaluated`;
  
  const grid = document.getElementById('groups-grid');
  if(grid) {
    grid.innerHTML = groups.length === 0 
      ? `<div class="empty" style="grid-column:1/-1"><div class="empty-icon">👥</div><h3>No groups yet</h3><p>Select students from the panel to create your first group.</p></div>` 
      : groups.map(g => renderGroupCard(g)).join('');
  }
  
  renderUnassigned(unassignedIds());
  renderStats(groups);
}

function renderGroupCard(g){
  const ev = ST.evals[g.id];
  const done = ev?.unit;
  const stuCards = g.studentIds.map(sid => {
    const s = getStu(sid);
    if(!s) return '';
    const tot = stuTotal(ev?.students?.[sid]);
    const config = getRubric();
    const pass = tot !== null && tot >= config.passThreshold;
    return `
      <div class="gc-student">
        <div class="ava" style="background:${avatarGrad(sid)}; font-size:9px; border:1px solid rgba(255,255,255,0.1)">${initials(s.fn, s.ln)}</div>
        <span class="gc-student-name">${s.fn} ${s.ln}</span>
        ${tot !== null ? `<span class="badge ${pass ? 'bdg-pass' : 'bdg-fail'}" style="font-size:9px; padding:1px 6px">${tot}/${config.totalPts}</span>` : ''}
      </div>`;
  }).join('');
  
  return `
    <div class="group-card${done ? ' done' : ''}" onclick="openGroupEval('${g.id}')">
      <div class="gc-top" style="margin-bottom:14px">
        <span class="gc-name" style="font-size:15px; letter-spacing:-0.2px">${g.name}</span>
        <span class="badge ${done ? 'bdg-done' : 'bdg-pend'}">${done ? '✓ Done' : 'Pending'}</span>
      </div>
      ${done ? `<div class="crit-label" style="font-size:9.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;display:flex;align-items:center;gap:4px"><span>🗓 Unit ${ev.unit}</span> · <span>${ev.date || ''}</span></div>` : ''}
      <div class="gc-students" style="gap:8px">${stuCards}</div>
      <div class="gc-foot" onclick="event.stopPropagation()" style="border-top:1px solid var(--glass-border); margin-top:16px; padding-top:14px">
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" style="flex:1; border-radius:12px" onclick="openGroupEval('${g.id}')">${done ? '✏️ Edit Eval' : '▶ Start Assessment'}</button>
          <button class="btn btn-ghost btn-sm" onclick="askDelete('${g.id}')" title="Delete" style="border-radius:12px">🗑</button>
        </div>
      </div>
    </div>`;
}

function renderUnassigned(ids){
  const list = document.getElementById('ua-list');
  const startBtn = document.getElementById('btn-start-sel');
  if(startBtn) startBtn.style.display = ids.length === 0 ? 'none' : 'block';
  
  if(!list) return;
  if(ids.length === 0){
    list.innerHTML = `<div style="text-align:center;color:var(--text3);font-size:13px;padding:18px 0">All students are assigned.</div>`;
    const selBar = document.getElementById('sel-bar');
    if(selBar) selBar.style.display = 'none';
    return;
  }
  
  list.innerHTML = ids.map(id => getStu(id)).filter(Boolean).map(s => `
    <div class="ua-item${ST.selected.includes(s.id) ? ' sel' : ''}" id="ua-${s.id}" onclick="toggleSel('${s.id}')">
      <div class="ava" style="background:${avatarGrad(s.id)};width:27px;height:27px;font-size:10px">${initials(s.fn, s.ln)}</div>
      <span class="ua-item-name">${s.fn} ${s.ln}</span>
      <span style="color:var(--purple);display:${ST.selected.includes(s.id) ? 'inline' : 'none'};font-size:13px">✓</span>
    </div>
  `).join('');
  
  const selBar = document.getElementById('sel-bar');
  if(ST.selecting && selBar) selBar.style.display = 'block';
}

function renderStats(groups){
  const config = getRubric();
  const evGroups = groups.filter(g => ST.evals[g.id]?.unit);
  const allScores = evGroups.flatMap(g => g.studentIds.map(sid => stuTotal(ST.evals[g.id]?.students?.[sid]))).filter(v => v !== null);
  const avg = allScores.length ? Math.round((allScores.reduce((a,b) => a + b, 0) / allScores.length) * 10) / 10 : 0;
  const passing = allScores.filter(v => v >= config.passThreshold).length;
  const totalStudents = evGroups.reduce((a, g) => a + g.studentIds.length, 0);
  const pct = allScores.length ? Math.round((passing / allScores.length) * 100) : 0;

  const stats = [
    { num: `${evGroups.length}/${groups.length}`, lbl: 'Groups Evaluated', icon: '💎', col: 'var(--purple-l)' },
    { num: `${avg}/${config.totalPts}`, lbl: 'Class Average', icon: '📈', col: 'var(--blue)' },
    { num: `${pct}%`, lbl: 'Pass Rate', icon: '🎓', col: pct >= 60 ? 'var(--green)' : 'var(--red)' },
    { num: `${passing}/${totalStudents || 0}`, lbl: 'Total Passing', icon: '✅', col: 'var(--green)' }
  ];

  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon" style="background:color-mix(in srgb, ${s.col} 15%, transparent); color:${s.col}">${s.icon}</div>
      <div class="stat-num" style="color:${s.col}">${s.num}</div>
      <div class="stat-lbl">${s.lbl}</div>
    </div>
  `).join('');
}

/* =====================================================================
   SELECTION & GROUP MANAGEMENT
===================================================================== */
function startSelecting(){
  ST.selecting = true;
  ST.selected = [];
  const bar = document.getElementById('sel-bar');
  const btn = document.getElementById('btn-start-sel');
  if(bar) bar.style.display = 'block';
  if(btn) btn.style.display = 'none';
  updateSelBar();
}

function isExceptional(){ return document.getElementById('chk-exceptional')?.checked || false; }
function getMaxGroup(){ 
  if(ST.level === '7') return isExceptional() ? 6 : 5;
  return isExceptional() ? 4 : 3; 
}
function getMinGroup(){ 
  if(ST.level === '7') return isExceptional() ? 1 : 5;
  return isExceptional() ? 1 : 2; 
}

function toggleExceptional(){
  updateSelBar();
  const btn = document.getElementById('btn-confirm-grp');
  if(btn) btn.disabled = ST.selected.length < getMinGroup() || ST.selected.length > getMaxGroup();
}

function toggleSel(id){
  if(!ST.selecting) startSelecting();
  const i = ST.selected.indexOf(id);
  if(i > -1){ ST.selected.splice(i, 1); }
  else {
    if(ST.selected.length >= getMaxGroup()){
      showToast(`Maximum ${getMaxGroup()} students per group.`, 'var(--amber)');
      return;
    }
    ST.selected.push(id);
  }
  renderDash();
  updateSelBar();
}

function updateSelBar(){
  const n = ST.selected.length;
  const min = getMinGroup();
  const cnt = document.getElementById('sel-count');
  const btn = document.getElementById('btn-create-grp');
  if(cnt){
    if(n === 0) cnt.textContent = 'Tap students to select';
    else if(n === 1 && min === 1) cnt.textContent = '1 selected — ready or add more';
    else if(n < min) cnt.textContent = `${n} selected — add ${min - n} more`;
    else cnt.textContent = `${n} student${n > 1 ? 's' : ''} selected`;
  }
  if(btn) btn.disabled = n < 1;
}

function openCreateModal(){
  if(ST.selected.length < 1) return;
  const chk = document.getElementById('chk-exceptional');
  if(chk) chk.checked = false;
  
  const list = document.getElementById('modal-stu-list');
  if(list) {
    list.innerHTML = ST.selected.map(id => {
      const s = getStu(id);
      return `<div class="gc-student" style="padding:7px;background:var(--bg);border-radius:6px"><div class="ava" style="background:${avatarGrad(id)}">${initials(s.fn, s.ln)}</div><span>${s.fn} ${s.ln}</span></div>`;
    }).join('');
  }

  // Update exceptional label text dynamically
  const lbl = document.getElementById('exceptional-desc');
  if(lbl) {
    if(ST.level === '7') lbl.textContent = "Habilitar para crear un grupo de 1-4 o 6 estudiantes (casos especiales).";
    else lbl.textContent = "Habilitar para crear un grupo de 1 o 4 estudiantes (casos especiales).";
  }
  
  const nameInp = document.getElementById('grp-name-inp');
  if(nameInp) nameInp.value = `Group ${getGroups().length + 1}`;
  
  openModal('modal-group');
  updateSelBar();
  
  // Refresh confirm button state immediately
  const confirmBtn = document.getElementById('btn-confirm-grp');
  if(confirmBtn) confirmBtn.disabled = ST.selected.length < getMinGroup() || ST.selected.length > getMaxGroup();
}

function confirmCreateGroup(){
  const n = ST.selected.length;
  const min = getMinGroup();
  const max = getMaxGroup();
  if(n < min || n > max) return;
  
  const nameInp = document.getElementById('grp-name-inp');
  const name = (nameInp ? nameInp.value.trim() : '') || `Group ${getGroups().length + 1}`;
  
  let exceptional = isExceptional();
  if (ST.level === '7') {
    exceptional = exceptional && (n < 5 || n === 6);
  } else {
    exceptional = exceptional && (n === 1 || n === 4);
  }
  
  const g = { id: uid(), name, section: ST.section, studentIds: [...ST.selected], exceptional };
  
  const grps = getGroups();
  grps.push(g);
  setGroups(grps);
  ST.selected = [];
  ST.selecting = false;
  persist();
  closeModal('modal-group');
  renderDash();
}

function askDelete(id){
  ST.pendingDelete = id;
  openModal('modal-delete');
}

function confirmDeleteGroup(){
  if(!ST.pendingDelete) return;
  setGroups(getGroups().filter(g => g.id !== ST.pendingDelete));
  delete ST.evals[ST.pendingDelete];
  ST.pendingDelete = null;
  persist();
  closeModal('modal-delete');
  renderDash();
}

function openModal(id){
  const m = document.getElementById(id);
  if(m) m.classList.add('open');
}

function closeModal(id){
  const m = document.getElementById(id);
  if(m) m.classList.remove('open');
  if(id === 'modal-group'){
    ST.selected = [];
    ST.selecting = false;
    renderDash();
  }
}

/* =====================================================================
   EVALUATION SCREEN
===================================================================== */
function openGroupEval(gid){
  const g = getGroups().find(g => g.id === gid);
  if(!g) return;
  ST.curGroup = g;
  ST.activeTab = 0;
  if(!ST.evals[gid]) ST.evals[gid] = { unit: null, date: fmtDate(), students: {} };
  const ev = ST.evals[gid];
  g.studentIds.forEach(sid => {
    if(!ev.students[sid]) {
      ev.students[sid] = { scores:{}, bandSel:{}, extras:{}, custom:'', strength:'', nextGoal:'', liveNotes:'', questChecked:{}, grammarChecked:{}, suggestedExtras:{}, synthesizedNote:'', exactPhrase:'', grammarError:'', mood:'neutral' };
    }
  });
  showScreen('evaluation');
  renderEvalScreen();
}

function renderEvalScreen(){
  const g = ST.curGroup;
  const ev = getEv();
  const config = getRubric();
  const nameEl = document.getElementById('eval-group-name');
  const metaEl = document.getElementById('eval-meta');
  if(nameEl) nameEl.textContent = g.name;
  if(metaEl) metaEl.textContent = `Level ${ST.level} · Section ${g.section}`;
  
  // Render Dynamic Assessment/Unit Buttons
  const unitWrap = document.querySelector('.unit-sel');
  if(unitWrap){
    unitWrap.innerHTML = `
      <label>${config.assessmentLabel}</label>
      ${config.units.map(u => `<button class="unit-btn${ev.unit === u ? ' active' : ''}" id="ubtn${u}" onclick="selectUnit(${u})">${config.assessmentLabel} ${u}</button>`).join('')}
    `;
  }
  
  renderStudentTabs();
  renderStudentsGrid();
  
  // Render Group Checklist if Level 7
  if(ST.level === '7') renderGroupChecklist();
  else {
    const gcWrap = document.getElementById('group-checklist-wrap');
    if(gcWrap) gcWrap.style.display = 'none';
  }
}

function refreshUnitBtns(u){
  const u7 = document.getElementById('ubtn7');
  const u8 = document.getElementById('ubtn8');
  if(u7) u7.classList.toggle('active', u === 7);
  if(u8) u8.classList.toggle('active', u === 8);
}

function selectUnit(u){
  getEv().unit = u;
  const config = getRubric();
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(u));
  });
  ST.curGroup.studentIds.forEach(sid => {
    const qw = document.getElementById(`qwrap-${sid}`);
    if(qw) qw.innerHTML = buildQuestionsHTML(sid);
    const gr = document.getElementById(`gwrap-${sid}`);
    if(gr) gr.innerHTML = buildGrammarHTML(sid);
  });
  markUnsaved();
}

function renderStudentTabs(){
  const g = ST.curGroup;
  const ev = getEv();
  const config = getRubric();
  const inner = document.getElementById('stabs-inner');
  if(!inner) return;
  inner.innerHTML = g.studentIds.map((sid, i) => {
    const s = getStu(sid);
    const tot = stuTotal(ev.students[sid]);
    const pass = tot !== null && tot >= config.passThreshold;
    const col = tot !== null ? (pass ? 'var(--green)' : 'var(--red)') : 'var(--text3)';
    return `<div class="stab${i === ST.activeTab ? ' active' : ''}" onclick="switchTab(${i})"><div>${s.fn.split(' ')[0]}</div><div class="stab-score" style="color:${col}">${tot !== null ? tot + '/' + config.totalPts : '—'}</div></div>`;
  }).join('');
}

function switchTab(i){
  ST.activeTab = i;
  document.querySelectorAll('.stab').forEach((t, idx) => t.classList.toggle('active', idx === i));
  document.querySelectorAll('.scol').forEach((c, idx) => {
    const isActive = idx === i;
    c.classList.toggle('active', isActive);
    if(isActive) window.scrollTo({top: 0, behavior: 'instant'}); 
  });
}

function renderStudentsGrid(){
  const g = ST.curGroup;
  const grid = document.getElementById('students-grid');
  if(!grid) return;
  grid.style.gridTemplateColumns = `repeat(${g.studentIds.length}, 1fr)`;
  grid.innerHTML = g.studentIds.map((sid, i) => buildScolHTML(sid, i)).join('');
  g.studentIds.forEach(sid => analyzeNotes(sid));
}

function buildScolHTML(sid, idx){
  const s = getStu(sid);
  const sEv = getStuEv(sid);
  const config = getRubric();
  const tot = stuTotal(sEv);
  const pass = tot !== null && tot >= config.passThreshold;
  const pct = tot !== null ? Math.round((tot / config.totalPts) * 100) : 0;
  const col = scoreColor(tot);
  const critHtml = config.criteria.map(c => buildCritHTML(sid, c)).join('');
  
  return `<div class="scol${idx === ST.activeTab ? ' active' : ''}" id="scol-${sid}">
    <div class="scol-hdr">
      <div class="scol-ava-row">
        <div class="ava" style="background:${avatarGrad(sid)};width:32px;height:32px;font-size:11px">${initials(s.fn, s.ln)}</div>
        <div><div class="scol-name">${s.fn}</div><div class="scol-lname">${s.ln}</div></div>
      </div>
      <div class="scol-score-row">
        <span class="scol-total" id="tot-${sid}" style="color:${tot !== null ? col : 'var(--text3)'}">${tot !== null ? tot : '—'}</span>
        <span class="scol-of">/${config.totalPts}</span>
        <span id="pct-${sid}" style="font-size:12px;font-weight:600;color:${col};margin-left:auto">${tot !== null ? pct + '%' : ''}</span>
        <span id="pbdg-${sid}" class="badge ${tot === null ? '' : 'bdg-' + (pass ? 'pass' : 'fail')}" style="${tot === null ? 'visibility:hidden' : ''}">${pass ? '✓ PASS' : '✕ FAIL'}</span>
      </div>
      <div class="score-bar-wrap"><div class="score-bar-fill" id="bar-${sid}" style="width:${pct}%;background:${col}"></div><div class="score-bar-thresh" style="left:${(config.passThreshold / config.totalPts)*100}%" title="Passing threshold ${config.passThreshold}/${config.totalPts}"></div></div>
    </div>
    <div class="timer-wrap" id="timer-wrap-${sid}">${buildTimerHTML(sid)}</div>
    <div id="qwrap-${sid}" class="qwrap">${buildQuestionsHTML(sid)}</div>
    <div id="gwrap-${sid}" class="qwrap" style="background:rgba(139,92,246,.03); border-bottom:1px solid var(--border)">${buildGrammarHTML(sid)}</div>
    <div class="notes-wrap">
      <div class="notes-hdr">📝 Live Notes <span class="notes-hdr-sub">— impressions</span></div>
      <textarea class="notes-ta" id="notes-${sid}" placeholder="e.g: used 'used to' correctly · searched for vocab…" oninput="handleNotesInput('${sid}',this.value)">${sEv.liveNotes || ''}</textarea>
      <div class="notes-chips" id="chips-${sid}"></div>
      <div class="synth-note" id="synth-${sid}"><div class="synth-lbl">✨ Auto-Feedback Hint</div><div class="synth-text"></div></div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:12px">
        <span class="label-mini">Mood Tracking</span>
        <button class="mood-btn${sEv.mood === 'nervous' ? ' mood-sel' : ''}" onclick="setMood('${sid}','nervous')" title="Nervous">😰</button>
        <button class="mood-btn${!sEv.mood || sEv.mood === 'neutral' ? ' mood-sel' : ''}" onclick="setMood('${sid}','neutral')" title="Neutral">😐</button>
        <button class="mood-btn${sEv.mood === 'confident' ? ' mood-sel' : ''}" onclick="setMood('${sid}','confident')" title="Confident">😊</button>
        <button class="mood-btn${sEv.mood === 'blocked' ? ' mood-sel' : ''}" onclick="setMood('${sid}','blocked')" title="Blocked / Froze">🤯</button>
      </div>
      <div style="margin-top:10px">
        <label class="label-mini">💬 Exact phrase captured</label>
        <input type="text" class="inp" id="phrase-${sid}" placeholder="What they said..." value="${sEv.exactPhrase || ''}" oninput="getStuEv('${sid}').exactPhrase=this.value;markUnsaved()"/>
      </div>
      <div style="margin-top:10px">
        <label class="label-mini">⚠ Target Grammar Error</label>
        <select class="select-inp" style="width:100%" id="gramerr-${sid}" onchange="getStuEv('${sid}').grammarError=this.value;markUnsaved()">
          <option value="">— None —</option>
          <option value="Tense Confusion (past vs perfect)"${sEv.grammarError.includes('Tense Confusion') ? ' selected' : ''}>Tense Confusion</option>
          <option value="Missing auxiliary verb"${sEv.grammarError.includes('Missing auxiliary') ? ' selected' : ''}>Missing auxiliary</option>
          <option value="Wrong 'used to' formation"${sEv.grammarError.includes("used to' formation") ? ' selected' : ''}>Wrong 'used to'</option>
          <option value="Subject-verb agreement"${sEv.grammarError.includes('agreement') ? ' selected' : ''}>Subject-verb agreement</option>
        </select>
      </div>
    </div>
    <div class="criteria-wrap" style="background:var(--bg2)">${critHtml}</div>
    <div class="comments-outer" style="margin-top:12px">
      <button class="comments-toggle" onclick="toggleComments('${sid}')"><span>💬 Comments</span><span id="carr-${sid}">▾</span></button>
      <div class="comments-panel" id="cpanel-${sid}"></div>
    </div>
    <div class="comments-outer" style="margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;margin-bottom:8px;padding:0 11px">🎓 Pedagogical Feedback</div>
      <textarea class="cp-ta" id="ai-final-${sid}" oninput="getStuEv('${sid}').custom=this.value;markUnsaved()">${sEv.custom || ''}</textarea>
      <button class="ai-btn" id="ai-btn-${sid}" onclick="generateAIFeedback('${sid}')">✨ Generate AI Feedback</button>
    </div>
    <div class="scol-foot"><button class="btn btn-ghost btn-sm" style="width:100%" onclick="printOne('${sid}')">🖨 Print One</button></div>
  </div>`;
}

function buildCritHTML(sid, crit){
  const config = getRubric();
  const bank = config.banks[crit];
  const sEv = getStuEv(sid);
  const cur = sEv.scores[crit] ?? null;
  const bi = config.bandInfo;
  
  // Disable individual selection for 'checklist' in Level 7 (synced from group)
  const isAutoChecklist = (ST.level === '7' && crit === 'checklist');
  
  const btns = bi.map(b => `<button class="band-btn${cur === b.pts ? ' sel' : ''}" data-pts="${b.pts}" title="${b.label}" onclick="${isAutoChecklist ? '' : `selectScore('${sid}','${crit}',${b.pts})`}" ${isAutoChecklist ? 'style="cursor:not-allowed; opacity:0.7"' : ''}><span class="band-pts">${b.pts}</span><span class="band-lbl">${b.short}</span></button>`).join('');
  return `<div class="crit-block" id="crit-${sid}-${crit}"><div class="crit-hdr"><span class="crit-label">${bank.label}</span><span class="crit-pts${cur !== null ? ' sc' : ''}" id="cs-${sid}-${crit}">${cur !== null ? cur : '—'}${isAutoChecklist ? ' <span style="font-size:9px;font-weight:400;color:var(--text3)">(Auto)</span>' : ''}</span></div><div class="band-btns">${btns}</div></div>`;
}

/* =====================================================================
   GROUP CHECKLIST (Level 7)
===================================================================== */
function renderGroupChecklist(){
  const wrap = document.getElementById('group-checklist-wrap');
  if(!wrap) return;
  const config = getRubric();
  if(!config.groupChecklistItems) return;
  
  wrap.style.display = 'block';
  const gid = ST.curGroup.id;
  if(!ST.groupChecklist[gid]) ST.groupChecklist[gid] = {};
  const gc = ST.groupChecklist[gid];
  
  const itemsHtml = config.groupChecklistItems.map(item => `
    <div class="q-item${gc[item.id] ? ' chk' : ''}" style="margin:0; padding:6px 10px; border-radius:10px" onclick="toggleGroupCheckItem('${item.id}')">
      <span class="q-check">${gc[item.id] ? '✓' : '○'}</span>
      <span style="font-size:12px">${item.label}</span>
    </div>
  `).join('');
  
  wrap.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
      <div style="font-size:11px; font-weight:800; color:var(--purple); text-transform:uppercase; letter-spacing:1px">📋 Group Work Checklist (Affects all members)</div>
      <div style="font-size:12px; font-weight:700; color:var(--text2)">Group Score: ${Object.values(gc).filter(Boolean).length}/5</div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:8px">${itemsHtml}</div>
  `;
}

function toggleGroupCheckItem(itemId){
  const gid = ST.curGroup.id;
  if(!ST.groupChecklist[gid]) ST.groupChecklist[gid] = {};
  ST.groupChecklist[gid][itemId] = !ST.groupChecklist[gid][itemId];
  
  renderGroupChecklist();
  syncChecklistToStudents();
  markUnsaved();
}

function syncChecklistToStudents(){
  const gid = ST.curGroup.id;
  const score = Object.values(ST.groupChecklist[gid] || {}).filter(Boolean).length;
  
  ST.curGroup.studentIds.forEach(sid => {
    selectScore(sid, 'checklist', score);
  });
}

/* =====================================================================
   TIMER
===================================================================== */
function buildTimerHTML(sid){
  const t = TIMERS[sid] || { elapsed: 0, running: false };
  const min = Math.floor(t.elapsed / 60);
  const sec = t.elapsed % 60;
  const disp = `${min}:${sec.toString().padStart(2, '0')}`;
  const barPct = Math.min((t.elapsed / 75) * 100, 100);
  const barCol = t.elapsed < 50 ? '#6366f1' : t.elapsed <= 70 ? '#22c55e' : '#f59e0b';
  let zone, zoneCol;
  if(t.elapsed === 0){ zone = 'Ready'; zoneCol = 'var(--text3)'; }
  else if(t.elapsed < 50){ zone = 'Speaking…'; zoneCol = 'var(--text2)'; }
  else if(t.elapsed <= 70){ zone = '✓ Target zone'; zoneCol = 'var(--green)'; }
  else { zone = 'Over time'; zoneCol = 'var(--amber)'; }
  
  return `
    <div class="timer-row">
      <div class="timer-left"><span class="timer-icon">⏱</span><span class="timer-display" id="timer-${sid}">${disp}</span><span class="timer-zone" id="timer-zone-${sid}" style="color:${zoneCol}">${zone}</span></div>
      <div class="timer-btns">
        <button class="timer-btn tbtn-start" id="timer-btn-${sid}" onclick="toggleTimer('${sid}')" title="Start/Pause">${t.running ? '⏸' : '▶'}</button>
        <button class="timer-btn" onclick="resetTimer('${sid}')" title="Reset">↺</button>
      </div>
    </div>
    <div class="timer-bar-wrap" onclick="setTimerByClick('${sid}', event)"><div class="timer-bar-fill" id="tbar-${sid}" style="width:${barPct}%;background:${barCol}"></div><div class="timer-target-line" title="60s target"></div></div>
    <div class="timer-label-row"><span>0s</span><span class="timer-label-60" style="color:var(--green)">60s</span><span>75s+</span></div>`;
}

function toggleTimer(sid){
  if(!getEv().unit){ showToast('📚 Select Unit first', 'var(--amber)'); return; }
  if(!TIMERS[sid]) TIMERS[sid] = { elapsed: 0, running: false, iid: null };
  const t = TIMERS[sid];
  if(t.running){ clearInterval(t.iid); t.running = false; }
  else {
    t.running = true;
    t.iid = setInterval(() => { t.elapsed++; updateTimerUI(sid); }, 1000);
  }
  updateTimerUI(sid);
}

function setTimerByClick(sid, e){
  const wrap = e.currentTarget;
  const rect = wrap.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(x / rect.width, 1));
  const newElapsed = Math.round(pct * 75); // Target 75s scale
  
  if(!TIMERS[sid]) TIMERS[sid] = { elapsed: 0, running: false, iid: null };
  TIMERS[sid].elapsed = newElapsed;
  markUnsaved();
  updateTimerUI(sid);
}

function resetTimer(sid){
  const t = TIMERS[sid];
  if(t){ clearInterval(t.iid); TIMERS[sid] = { elapsed: 0, running: false, iid: null }; }
  updateTimerUI(sid);
}

function updateTimerUI(sid){
  const t = TIMERS[sid] || { elapsed: 0, running: false };
  const min = Math.floor(t.elapsed / 60);
  const sec = t.elapsed % 60;
  const disp = `${min}:${sec.toString().padStart(2, '0')}`;
  const barPct = Math.min((t.elapsed / 75) * 100, 100);
  const barCol = t.elapsed < 50 ? '#6366f1' : t.elapsed <= 70 ? '#22c55e' : '#f59e0b';
  
  const tEl = document.getElementById(`timer-${sid}`);
  const bEl = document.getElementById(`tbar-${sid}`);
  const btnEl = document.getElementById(`timer-btn-${sid}`);
  const zEl = document.getElementById(`timer-zone-${sid}`);
  
  if(tEl) tEl.textContent = disp;
  if(bEl) { bEl.style.width = barPct + '%'; bEl.style.background = barCol; }
  if(btnEl) btnEl.textContent = t.running ? '⏸' : '▶';
  if(zEl) {
    let zone, col;
    if(t.elapsed === 0){ zone = 'Ready'; col = 'var(--text3)'; }
    else if(t.elapsed < 50){ zone = 'Speaking…'; col = 'var(--text2)'; }
    else if(t.elapsed <= 70){ zone = '✓ Target zone'; col = 'var(--green)'; }
    else { zone = 'Over time'; col = 'var(--amber)'; }
    zEl.textContent = zone;
    zEl.style.color = col;
  }
}

/* =====================================================================
   QUESTIONS CHECKLIST
===================================================================== */
function buildQuestionsHTML(sid){
  const ev = getEv();
  const config = getRubric();
  if(!ev.unit) return `<div style="font-size:11.5px;color:var(--text3);padding:8px 0">Select ${config.assessmentLabel} above.</div>`;
  const uq = config.uq[ev.unit];
  const sEv = getStuEv(sid);
  const qc = sEv.questChecked?.[ev.unit] || {};
  const main = qc.main || Array(uq.main.length).fill(false);
  const fu = qc.followUp ?? null;
  const checked = main.filter(Boolean).length;
  
  const mainHtml = uq.main.map((q, i) => `<div class="q-item${main[i] ? ' chk' : ''}" onclick="toggleQ('${sid}',${i})"><span class="q-check">${main[i] ? '✓' : '○'}</span><span>${q}</span></div>`).join('');
  const fuHtml = uq.followUp.map((q, i) => `<div class="q-item${fu === i ? ' chk-fu' : ''}" onclick="selectFU('${sid}',${i})"><span class="q-check">${fu === i ? '●' : '○'}</span><span>${q}</span></div>`).join('');
  
  return `<div class="q-hdr"><span>📋 Task Requirements</span><span style="font-size:10px;color:${checked === uq.main.length ? 'var(--green)' : 'var(--text3)'}">${checked}/${uq.main.length}</span></div><div class="q-list">${mainHtml}</div><div class="q-fu-lbl" style="font-size:11px; margin-top:12px; margin-bottom:6px">📋 Follow-up Question:</div><div class="q-list">${fuHtml}</div>`;
}

function toggleQ(sid, i){
  const ev = getEv(); if(!ev.unit) return;
  const config = getRubric();
  const uq = config.uq[ev.unit];
  const sEv = getStuEv(sid); if(!sEv.questChecked) sEv.questChecked = {};
  if(!sEv.questChecked[ev.unit]) sEv.questChecked[ev.unit] = { main: Array(uq.main.length).fill(false), followUp: null };
  sEv.questChecked[ev.unit].main[i] = !sEv.questChecked[ev.unit].main[i];
  const qw = document.getElementById(`qwrap-${sid}`);
  if(qw) qw.innerHTML = buildQuestionsHTML(sid);
  markUnsaved();
}

function selectFU(sid, i){
  const ev = getEv(); if(!ev.unit) return;
  const config = getRubric();
  const uq = config.uq[ev.unit];
  const sEv = getStuEv(sid); if(!sEv.questChecked) sEv.questChecked = {};
  if(!sEv.questChecked[ev.unit]) sEv.questChecked[ev.unit] = { main: Array(uq.main.length).fill(false), followUp: null };
  sEv.questChecked[ev.unit].followUp = (sEv.questChecked[ev.unit].followUp === i) ? null : i;
  const qw = document.getElementById(`qwrap-${sid}`);
  if(qw) qw.innerHTML = buildQuestionsHTML(sid);
  markUnsaved();
}

/* =====================================================================
   GRAMMAR CHECKLIST
===================================================================== */
function buildGrammarHTML(sid){
  const ev = getEv();
  const config = getRubric();
  if(!ev.unit) return `<div style="font-size:11.5px;color:var(--text3);padding:8px 0">Select ${config.assessmentLabel} first.</div>`;
  const uq = config.uq[ev.unit];
  if(!uq || !uq.grammar) return '';
  const sEv = getStuEv(sid);
  if(!sEv.grammarChecked) sEv.grammarChecked = {};
  const gc = sEv.grammarChecked[ev.unit] || Array(uq.grammar.length).fill(false);
  
  const gHtml = uq.grammar.map((g, i) => `<div class="q-item g-item${gc[i] ? ' chk' : ''}" onclick="toggleGrammar('${sid}',${i})"><span class="q-check">${gc[i] ? '✨' : '○'}</span><span>${g}</span></div>`).join('');
  
  return `<div class="q-hdr" style="color:var(--purple)"><span>🎯 Target Grammar</span></div><div class="q-list g-list">${gHtml}</div>`;
}

function toggleGrammar(sid, i){
  const ev = getEv(); if(!ev.unit) return;
  const config = getRubric();
  const uq = config.uq[ev.unit];
  if(!uq || !uq.grammar) return;
  const sEv = getStuEv(sid); if(!sEv.grammarChecked) sEv.grammarChecked = {};
  if(!sEv.grammarChecked[ev.unit]) sEv.grammarChecked[ev.unit] = Array(uq.grammar.length).fill(false);
  sEv.grammarChecked[ev.unit][i] = !sEv.grammarChecked[ev.unit][i];
  const gr = document.getElementById(`gwrap-${sid}`);
  if(gr) gr.innerHTML = buildGrammarHTML(sid);
  markUnsaved();
}

/* =====================================================================
   LIVE NOTES
===================================================================== */
function handleNotesInput(sid, val){
  getStuEv(sid).liveNotes = val;
  markUnsaved();
  clearTimeout(DEBOUNCE[sid]);
  DEBOUNCE[sid] = setTimeout(() => analyzeNotes(sid), 600);
}

function analyzeNotes(sid){
  const sEv = getStuEv(sid);
  const notes = (sEv.liveNotes || '').toLowerCase();
  const config = getRubric();
  if(notes.length < 3){ sEv.suggestedExtras = {}; sEv.synthesizedNote = ''; updateNotesUI(sid); return; }
  
  const result = {};
  for(const crit of config.criteria){
    const kw = config.keyw[crit];
    if(!kw) continue;
    const pos = new Set(); const neg = new Set();
    kw.pos.forEach(({k, idx}) => { if(k.some(t => notes.includes(t))) pos.add(idx); });
    kw.neg.forEach(({k, idx}) => { if(k.some(t => notes.includes(t))) neg.add(idx); });
    result[crit] = { pos: [...pos], neg: [...neg] };
  }
  sEv.suggestedExtras = result;
  sEv.synthesizedNote = buildSynthNote(sid, result);
  updateNotesUI(sid);
  const panel = document.getElementById(`cpanel-${sid}`);
  if(panel && panel.classList.contains('open')) panel.innerHTML = buildCommentsPanel(sid);
}

function buildSynthNote(sid, analysis){
  const s = getStu(sid); const firstName = s.fn.split(' ')[0];
  const parts = [];
  const strengths = [];
  if(analysis.taskAch?.pos.length) strengths.push('addressing the task');
  if(analysis.grammar?.pos.length) strengths.push('grammar accuracy');
  if(analysis.vocab?.pos.length) strengths.push('vocabulary use');
  if(analysis.pronun?.pos.length) strengths.push('clear pronunciation');
  
  if(strengths.length){ parts.push(`${firstName} showed strength in ${strengths.join(' and ')}`); }
  
  const dev = [];
  if(analysis.taskAch?.neg.length) dev.push('developing ideas');
  if(analysis.grammar?.neg.length) dev.push('grammar control');
  
  if(dev.length){ parts.push(`The focus area is ${dev.join(' and ')}`); }
  return parts.join('. ') + (parts.length ? '.' : '');
}

function updateNotesUI(sid){
  const sEv = getStuEv(sid);
  const chips = document.getElementById(`chips-${sid}`);
  const synth = document.getElementById(`synth-${sid}`);
  if(!chips) return;
  const analysis = sEv.suggestedExtras || {};
  const detected = [];
  const config = getRubric();
  for(const crit of config.criteria){
    const d = analysis[crit];
    if(!d) continue;
    if(d.pos.length) detected.push({ label: config.banks[crit].label, type: 'pos' });
    if(d.neg.length) detected.push({ label: config.banks[crit].label, type: 'neg' });
  }
  chips.innerHTML = detected.map(d => `<span class="chip chip-${d.type}">${d.label} ${d.type === 'pos' ? '✓' : '△'}</span>`).join('');
  if(synth){
    if(sEv.synthesizedNote){ 
      synth.style.display = 'block'; 
      synth.querySelector('.synth-text').textContent = sEv.synthesizedNote; 
    } else synth.style.display = 'none';
  }
}

function setMood(sid, mood){
  const sEv = getStuEv(sid);
  sEv.mood = mood;
  markUnsaved();
  const Scol = document.getElementById(`scol-${sid}`);
  if(Scol){
    Scol.querySelectorAll('.mood-btn').forEach(btn => {
      btn.classList.toggle('mood-sel', btn.getAttribute('onclick')?.includes(`'${mood}'`));
    });
  }
}

/* =====================================================================
   SCORE & COMMENTS
===================================================================== */
function selectScore(sid, crit, pts){
  const sEv = getStuEv(sid);
  sEv.scores[crit] = pts;
  sEv.bandSel[crit] = true;
  updateScoreDisplay(sid);
  const block = document.getElementById(`crit-${sid}-${crit}`);
  if(block) block.querySelectorAll('.band-btn').forEach(b => b.classList.toggle('sel', parseInt(b.dataset.pts) === pts));
  renderStudentTabs();
  markUnsaved();
}

function updateScoreDisplay(sid){
  const sEv = getStuEv(sid);
  const config = getRubric();
  const tot = stuTotal(sEv);
  const pass = tot !== null && tot >= config.passThreshold;
  const pct = tot !== null ? Math.round((tot / config.totalPts) * 100) : 0;
  const col = scoreColor(tot);
  
  const totEl = document.getElementById(`tot-${sid}`);
  const pctEl = document.getElementById(`pct-${sid}`);
  const barEl = document.getElementById(`bar-${sid}`);
  const bdgEl = document.getElementById(`pbdg-${sid}`);
  if(totEl) { totEl.textContent = tot !== null ? tot : '—'; totEl.style.color = tot !== null ? col : 'var(--text3)'; }
  if(pctEl) { pctEl.textContent = tot !== null ? pct + '%' : ''; pctEl.style.color = col; }
  if(barEl) { barEl.style.width = pct + '%'; barEl.style.background = col; }
  if(bdgEl) { 
    bdgEl.style.visibility = tot !== null ? 'visible' : 'hidden'; 
    bdgEl.className = `badge bdg-${pass ? 'pass' : 'fail'}`;
    bdgEl.textContent = pass ? '✓ PASS' : '✕ FAIL';
  }
}

function toggleComments(sid){
  const p = document.getElementById(`cpanel-${sid}`);
  const a = document.getElementById(`carr-${sid}`);
  const isOpen = p.classList.toggle('open');
  if(a) a.textContent = isOpen ? '▴' : '▾';
  if(isOpen) p.innerHTML = buildCommentsPanel(sid);
}

function buildCommentsPanel(sid){
  const sEv = getStuEv(sid);
  const config = getRubric();
  return config.criteria.map(crit => {
    const score = sEv.scores[crit];
    const bank = config.banks[crit];
    const bc = score !== null ? bank.band[score] : null;
    return `
      <div style="margin-bottom:10px">
        <div class="cp-lbl">${bank.label}</div>
        ${bc ? `<div class="cp-item sel" onclick="toggleBandCmt('${sid}','${crit}')"><span class="cp-check">✓</span><div>${bc.text}</div></div>` : `<div style="font-size:11px;color:var(--text3)">Score this first</div>`}
      </div>`;
  }).join('');
}

function toggleBandCmt(sid, crit){
  getStuEv(sid).bandSel[crit] = !getStuEv(sid).bandSel[crit];
  markUnsaved();
  const p = document.getElementById(`cpanel-${sid}`);
  if(p?.classList.contains('open')) p.innerHTML = buildCommentsPanel(sid);
}

/* =====================================================================
   SAVE & PRINT
===================================================================== */
function markUnsaved(){
  const s = document.getElementById('save-status');
  if(s){ s.textContent = 'Unsaved changes'; s.style.color = 'var(--amber)'; }
}

function markSaved(){
  const s = document.getElementById('save-status');
  if(s){ s.textContent = '✓ Saved'; s.style.color = 'var(--green)'; }
}

function saveEval(silent = false){
  const ev = getEv();
  if(!ev.unit && !silent){ alert('Select unit first'); return; }
  ev.date = fmtDate();
  persist();
  if(!silent) markSaved();
}

function printOne(sid){ if(!getEv().unit) return; saveEval(true); document.getElementById('print-container').innerHTML = buildSheet(sid); window.print(); }
function printAll(){ if(!getEv().unit) return; saveEval(true); document.getElementById('print-container').innerHTML = ST.curGroup.studentIds.map(sid => buildSheet(sid)).join(''); window.print(); }
function buildSheet(sid){
  const s = getStu(sid); const g = ST.curGroup; const ev = getEv(); const sEv = getStuEv(sid);
  const config = getRubric();
  const tot = stuTotal(sEv); const pass = tot !== null && tot >= config.passThreshold; const pct = tot !== null ? Math.round((tot/config.totalPts)*100) : 0;

  // Questions coverage
  let questNote = '';
  if(ev.unit && sEv.questChecked?.[ev.unit]){
    const uq = config.uq[ev.unit]; const qc = sEv.questChecked[ev.unit];
    const main = qc.main || []; const checked = main.filter(Boolean).length; const fu = qc.followUp;
    const unchecked = uq.main.filter((_, i) => !main[i]);
    if(checked === uq.main.length && (uq.followUp.length === 0 || fu !== null)){
      questNote = `<span class="fs-q-ok">✓ All requirements addressed</span>`;
    } else {
      let parts = [];
      if(unchecked.length > 0) parts.push(`Points not addressed: ${unchecked.map(q => `"${q}"`).join(', ')}`);
      if(uq.followUp.length > 0 && fu === null) parts.push('Remember to include an answer to the follow-up question.');
      questNote = `<span class="fs-q-miss">📌 ${parts.join(' ')}</span>`;
    }
  }

  // Grammar goals coverage
  let grammarNote = '';
  if(ev.unit && sEv.grammarChecked?.[ev.unit]){
    const uq = config.uq[ev.unit]; const gc = sEv.grammarChecked[ev.unit];
    const checked = uq.grammar ? uq.grammar.filter((_, i) => gc[i]) : [];
    const unchecked = uq.grammar ? uq.grammar.filter((_, i) => !gc[i]) : [];
    if(uq.grammar && uq.grammar.length > 0){
      if(unchecked.length === 0){
        grammarNote = `<span class="fs-q-ok">✨ Goal met: Used all target grammar (${checked.join(', ')})</span>`;
      } else if(checked.length > 0) {
        grammarNote = `<span class="fs-q-warn" style="color:var(--purple);font-weight:700">📌 Used: ${checked.join(', ')} · Missing: ${unchecked.join(', ')}</span>`;
      } else {
        grammarNote = `<span class="fs-q-miss" style="color:var(--red);font-weight:700">❌ Goal: Try to incorporate ${unchecked.join(', ')}</span>`;
      }
    }
  }

  // Rubric rows
  const rubrRows = config.criteria.map(crit => {
    const bank = config.banks[crit]; const score = sEv.scores[crit] ?? null;
    const bi = config.bandInfo.find(b => b.pts === score);
    const [bg, fg] = score !== null ? bandStyle(score) : ['#f9fafb', '#9ca3af'];
    
    // Dynamic description from level 6 logic (to keep it consistent)
    let desc = '';
    if(ST.level === '6'){
       desc = score === 4 ? 'Fluent · complete · complex' : score === 3 ? 'Well-developed · few errors' : score === 2 ? 'Basic · meets requirements' : score === 1 ? 'Developing · needs practice' : score === 0 ? 'Beginning stage' : '';
    } else {
       desc = bi ? bi.label : '';
    }
    return `<tr><td style="padding:7px 8px;border:1px solid #e5e7eb">${bank.label}</td><td class="fs-score-cell" style="padding:7px 8px;border:1px solid #e5e7eb;${score !== null ? `background:${bg};color:${fg}` : ''}">${score !== null ? score : '—'}</td><td style="padding:7px 8px;border:1px solid #e5e7eb;font-weight:600;${score !== null ? `color:${fg}` : ''}">${bi ? bi.label : 'Not scored'}</td><td style="padding:7px 8px;border:1px solid #e5e7eb;font-size:10.5px;color:#6b7280">${desc}</td></tr>`;
  }).join('');
  
  const totalRow = tot !== null ? `<tr class="fs-total-row"><td style="padding:9px 8px;border:1px solid #e5e7eb;font-weight:800">TOTAL</td><td class="fs-score-cell fs-total-score" style="padding:9px 8px;border:1px solid #e5e7eb">${tot}</td><td style="padding:9px 8px;border:1px solid #e5e7eb;font-weight:700;color:#7c3aed">${pct}%</td><td style="padding:9px 8px;border:1px solid #e5e7eb"><span style="display:inline-block;padding:3px 11px;border-radius:99px;font-size:12px;font-weight:800;background:${pass ? '#d1fae5' : '#fee2e2'};color:${pass ? '#166534' : '#991b1b'}">${pass ? '✓ PASS' : '✕ FAIL'} · passing: ${config.passThreshold}/${config.totalPts} (${Math.round(config.passThreshold/config.totalPts*1000)/10}%)</span></td></tr>` : '';

  // Comments
  const commentBlocks = config.criteria.map(crit => {
    const bank = config.banks[crit]; const score = sEv.scores[crit] ?? null; const bc = score !== null ? bank.band[score] : null;
    const bsel = sEv.bandSel[crit] !== false; const exIds = sEv.extras[crit] || []; const exts = exIds.map(i => bank.extras[i]).filter(Boolean);
    if(!bc && exts.length === 0) return '';
    const [bg2, fg2] = score !== null ? bandStyle(score) : ['#f9fafb', '#374151'];
    return `<div class="fs-crit-block" style="border-left:4px solid ${bg2 === '#f9fafb' ? '#e5e7eb' : bg2}"><div class="fs-crit-lbl">${bank.label}</div>${bc && bsel ? `<p class="fs-comment-text">${bc.text}</p><p class="fs-tip-text">${bc.tip}</p>` : ''} ${exts.map(e => `<p class="fs-extra-text">${e}</p>`).join('')}</div>`;
  }).join('');
  
  const custom = (sEv.custom || '').trim();
  const synth = (sEv.synthesizedNote || '').trim();

  return `<div class="fsheet">
    <div class="fs-hdr">
      <div><div class="fs-prog">Universidad Adolfo Ibáñez · English Program</div><div class="fs-main-title">${config.evalTitle}</div><div class="fs-subtitle">Level ${ST.level} · Section ${g.section} · ${ev.unit ? config.assessmentLabel + ' ' + ev.unit : ''}</div></div>
      <div class="fs-meta">${ev.date || fmtDate()}<br>${g.name}</div>
    </div>
    <div class="fs-stu-box">
      <div><div class="fs-stu-name">${s.fn} ${s.ln}</div><div class="fs-stu-email">${s.email || ''}</div></div>
      <div class="fs-score-center"><div class="fs-score-num">${tot !== null ? tot : '—'}</div><div class="fs-score-of">/ ${config.totalPts} points</div>${tot !== null ? `<div class="fs-score-pct" style="color:${pass ? '#16a34a' : '#dc2626'}">${pct}%</div><div class="fs-badge ${pass ? 'pass' : 'fail'}">${pass ? '✓ PASS' : '✕ FAIL'}</div>` : ''}</div>
    </div>
    ${(questNote || grammarNote) ? `<div class="fs-q-coverage">${questNote}${questNote && grammarNote ? '<br>' : ''}${grammarNote}</div>` : ''}
    <div class="fs-section-lbl">Assessment Criteria</div>
    <table class="fs-table"><thead><tr><th style="width:30%">Criterion</th><th style="width:9%;text-align:center">Score</th><th style="width:18%">Band</th><th>Description</th></tr></thead><tbody>${rubrRows}${totalRow}</tbody></table>
    ${commentBlocks || custom || synth ? `<div class="fs-section-lbl">Analysis &amp; Observations</div><div class="fs-comments">${commentBlocks}</div>${synth ? `<div class="fs-custom" style="background:#f5f3ff;border-color:#c4b5fd;color:#4c1d95;margin-bottom:8px"><strong>Teacher observation:</strong> ${synth}</div>` : ''}` : ''}
    ${custom ? `<div class="fs-next-goal" style="background:#f0fdf4; border-color:#86efac"><div class="fs-next-goal-lbl" style="color:#16a34a">🎓 Pedagogical Feedback</div><div class="fs-next-goal-text" style="color:#166534">${custom}</div></div>` : ''}
    <div class="fs-sig"><div><div class="fs-sig-line"></div><div>Teacher's Signature</div></div><div style="text-align:right"><div>EduFeedback · UAI English Program</div><div style="color:#7c3aed">Level ${ST.level} — Oral Assessment</div></div></div>
  </div>`;
}

/* =====================================================================
   UTILS
===================================================================== */
function showToast(msg, color){
  let t = document.getElementById('ef-toast');
  if(!t){
    t = document.createElement('div'); t.id = 'ef-toast';
    t.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;z-index:9999;transition:opacity .4s;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.12);';
    document.body.appendChild(t);
  }
  t.style.color = color;
  t.style.background = `color-mix(in srgb,${color} 15%,rgba(22,27,34,.95))`;
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._to); t._to = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

function triggerImport(){ document.getElementById('import-file').click(); }
function exportData(){
  const blob = new Blob([JSON.stringify(ST)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edu-export.json'; a.click();
}
function importData(e){
  const f = e.target.files[0];
  const r = new FileReader();
  r.onload = ev => { const d = JSON.parse(ev.target.result); Object.assign(ST, d); renderDash(); };
  r.readAsText(f);
}

/* =====================================================================
   INIT
===================================================================== */
function init(){
  restore();
  renderSectionTabs();
  renderDash();
  updateBC('dashboard');
  if(typeof updateAIBadge === 'function') updateAIBadge();
}
