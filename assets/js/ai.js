/* =====================================================================
   AI FEEDBACK — GROQ ENGINE
===================================================================== */

let ST_CURRENT_GROQ_MODEL = 0;
const ST_GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.1-8b-instant"
];

function getApiKey(){
  return localStorage.getItem('ef_groq_key') || '';
}

function saveAISettings(){
  const qKey = document.getElementById('ai-key-groq').value.trim();
  if(qKey) localStorage.setItem('ef_groq_key', qKey);
  updateAIBadge();
  closeModal('modal-ai');
  showToast(`⚡ Groq Feedback enabled!`, 'var(--amber)');
}

function updateAIBadge(){
  const badge = document.getElementById('ai-status-badge');
  if(!badge) return;
  const key = getApiKey();
  const hasKey = !!key;
  badge.className = `ai-badge ${hasKey ? 'ai-on' : 'ai-off'}`;
  badge.textContent = hasKey ? `🤖 AI: Groq` : '🤖 AI: OFF';
}

function openAIModal(){
  const key = getApiKey();
  document.getElementById('ai-key-groq').value = key;
  openModal('modal-ai');
}

async function generateAIFeedback(sid){
  const ev = getEv();
  if(!ev.unit) { showToast('📚 Please select Unit 7 or Unit 8 above first', 'var(--amber)'); return; }

  const key = getApiKey();
  if(!key){ openAIModal(); return; }
  
  const sEv = getStuEv(sid);
  const timer = TIMERS[sid]?.elapsed || 0;
  if(timer === 0) { showToast('⏱ Please use the timer to measure pacing before generating feedback.', 'var(--amber)'); return; }

  const notes = (sEv.liveNotes || '').trim();
  if(notes.length < 8){ showToast('✏️ Add some live notes first', 'var(--amber)'); return; }

  const s = getStu(sid); const firstName = s.fn.split(' ')[0];
  const uq = UQ[ev.unit];

  // Gather selected extras
  const selectedExtras = CRITERIA.map(c => {
    const exIndices = sEv.extras[c] || [];
    return exIndices.map(idx => BANKS[c].extras[idx]).filter(Boolean);
  }).flat().join('; ');

  // Questions Context
  const qc = sEv.questChecked?.[ev.unit] || { main: Array(uq.main.length).fill(false), followUp: null };
  const mainQs = uq.main.filter((_, i) => qc.main[i]).join(', ');
  const missedQs = uq.main.filter((_, i) => !qc.main[i]);
  const fuQ = qc.followUp !== null ? uq.followUp[qc.followUp] : null;
  const questContext = `Addressed: [${mainQs || 'None'}]. Follow-up: [${fuQ || 'None'}]`;
  let missedQuestions = 'None';
  if (missedQs.length > 0 || qc.followUp === null) {
    const m = [...missedQs.map(q => `"${q}"`)];
    if (qc.followUp === null) m.push('the follow-up question');
    missedQuestions = m.join('; ');
  }

  // Pacing
  const remaining = 60 - timer;
  let pacingContext, pacingRule = '';
  if (timer < 50) {
    pacingContext = `${timer}s spoken — ${remaining}s short of target`;
    pacingRule = `Student spoke for only ${timer} seconds. Tell them: "developing your second example would naturally fill the remaining ${remaining} seconds."`;
  } else if (timer > 75) {
    pacingContext = `${timer}s spoken — ${timer - 60}s over target`;
    pacingRule = `Student spoke for ${timer} seconds. Suggest they drop repetition and signal conclusion earlier.`;
  } else {
    pacingContext = `${timer}s — within target zone ✓`;
  }

  // Score Tone
  const tot = stuTotal(sEv);
  const totalScoreContext = tot !== null ? `${tot}/16` : 'Not fully scored';
  let toneRule;
  if (tot === null)   toneRule = 'Direct, professional, and motivating.';
  else if (tot <= 5)  toneRule = 'VERY compassionate. Lead with warmth. Acknowledge courage. No harsh corrections.';
  else if (tot <= 9)  toneRule = 'Compassionate but clear. Praise what worked specifically, then one clear correction.';
  else if (tot <= 11) toneRule = 'Direct and positive. Celebrate the pass. Push for one concrete improvement.';
  else if (tot <= 14) toneRule = 'Challenger tone. Acknowledge strong performance. Push for precision.';
  else                toneRule = 'C1 excellence mode. Tell them they approach advanced level.';

  // Mood
  const mood = sEv.mood || 'neutral';
  const moodInstructions = {
    nervous:   'MOOD: Student appeared nervous. Lead with strong emotional validation.',
    confident: 'MOOD: Student was confident. Set a higher bar and challenge them directly.',
    blocked:   'MOOD: Student froze. Only encouragement — nothing harsh whatsoever.',
    neutral:   ''
  };
  const moodNote = moodInstructions[mood] || '';

  const exactPhrase = (sEv.exactPhrase || '').trim();
  const grammarErrorType = (sEv.grammarError || '').trim();

  // Prompt Construction
  const sysPrompt = `You are a B1 EFL oral assessment teacher. Transform input data into ONE paragraph of feedback (max 65 words, max clarity, plain text).
STRUCTURE: 
1. Strength (specific from notes/phrase). 
2. Correction (exact grammar error or missed question text). 
3. Micro-tip.
4. Pacing advice if needed.

TONE: ${toneRule}
${moodNote}

BANNED: "great job", "well done", "keep it up", "overall", "in conclusion", "it's important to", "make sure to", "remember to", "good effort".
No bullets, no line breaks. Plain text only. Use ${firstName}.`;

  const userPrompt = `STUDENT: ${firstName} | Unit ${ev.unit}: ${uq.topic}
SCORE: ${totalScoreContext}
PACING: ${pacingContext}
QUESTIONS: ${questContext}
MISSED: ${missedQuestions}
GRAMMAR ERROR TYPE: ${grammarErrorType || 'Not specified'}
LIVE NOTES: ${notes}
${exactPhrase ? `EXACT PHRASE SAID: "${exactPhrase}"` : ''}

INSTRUCTIONS:
${pacingRule ? `- PACING: ${pacingRule}` : ''}
${missedQuestions !== 'None' ? `- MISSED QUESTIONS: Name each missed question text.` : ''}
${exactPhrase ? `- CITE: Weave "${exactPhrase}" into the feedback.` : ''}`;

  setAIBtn(sid, 'loading');
  try {
    await generateAIFeedbackGroq(sid, key, sysPrompt, userPrompt);
    setAIBtn(sid, 'done');
  } catch(e) {
    console.error('AI error:', e);
    setAIBtn(sid, 'error');
    showToast('⚠ ' + e.message, 'var(--red)');
  }
}

async function generateAIFeedbackGroq(sid, key, sysPrompt, userPrompt) {
  let lastError = null;
  let rawResponse = null;

  while (ST_CURRENT_GROQ_MODEL < ST_GROQ_MODELS.length) {
    const model = ST_GROQ_MODELS[ST_CURRENT_GROQ_MODEL];
    try {
      setAIBtn(sid, 'loading', `Groq: ${model}...`);
      const resp = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.7,
          max_completion_tokens: 512
        })
      });

      if (!resp.ok) {
        if (resp.status === 401) { lastError = new Error("Invalid API Key."); break; }
        if ([429, 503, 404, 400].includes(resp.status) || (resp.status >= 500)) {
          ST_CURRENT_GROQ_MODEL++;
          continue; 
        }
        throw new Error(`Groq Error: ${resp.status}`);
      }

      const data = await resp.json();
      rawResponse = data.choices?.[0]?.message?.content;
      if (!rawResponse) throw new Error("Empty response");
      break; 
    } catch (e) {
      lastError = e;
      ST_CURRENT_GROQ_MODEL++;
    }
  }

  if (rawResponse) {
    applyAIFeedback(sid, rawResponse);
  } else {
    ST_CURRENT_GROQ_MODEL = 0; 
    throw lastError || new Error("Models failed.");
  }
}

function applyAIFeedback(sid, fb){
  const sEv = getStuEv(sid);
  sEv.custom = fb.trim();
  const el = document.getElementById(`ai-final-${sid}`);
  if(el) el.value = fb.trim();
  markUnsaved();
  if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
}

function setAIBtn(sid, state, customMsg=null){
  const btn = document.getElementById(`ai-btn-${sid}`); if(!btn) return;
  btn.className = 'ai-btn';
  if(state==='loading'){ btn.disabled=true; btn.innerHTML=`<em class="ai-spin">⏳</em> ${customMsg||'Wait…'}`; }
  else if(state==='done'){ btn.disabled=false; btn.classList.add('ai-btn-done'); btn.innerHTML='✅ Generated';
    setTimeout(()=>{btn.classList.remove('ai-btn-done'); btn.innerHTML='✨ Generate AI Feedback';},3500); }
  else if(state==='error'){ btn.disabled=false; btn.classList.add('ai-btn-err'); btn.innerHTML='⚠ Error';
    setTimeout(()=>{btn.classList.remove('ai-btn-err'); btn.innerHTML='✨ Generate AI Feedback';},4000); }
}
