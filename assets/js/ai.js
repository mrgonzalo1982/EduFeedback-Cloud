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
  const config = getRubric();
  if(!ev.unit) { 
    showToast(`📚 Please select ${config.assessmentLabel} 1 or 2 at the top first`, 'var(--amber)'); 
    // Flash the unit selector area for visibility
    const wrap = document.querySelector('.unit-sel');
    if(wrap) {
      wrap.style.boxShadow = '0 0 0 4px var(--amber-br)';
      setTimeout(() => wrap.style.boxShadow = 'none', 1000);
    }
    return; 
  }

  const key = getApiKey();
  if(!key){ openAIModal(); return; }
  
  const sEv = getStuEv(sid);
  const timer = TIMERS[sid]?.elapsed || 0;
  if(timer === 0) { showToast('⏱ Please use the timer to measure pacing before generating feedback.', 'var(--amber)'); return; }

  const notes = (sEv.liveNotes || '').trim();
  if(notes.length < 8){ showToast('✏️ Add some live notes first', 'var(--amber)'); return; }

  const s = getStu(sid); const firstName = s.fn.split(' ')[0];
  const uq = config.uq[ev.unit];
  const criteria = config.criteria;

  // Gather selected extras & Detailed scores
  const selectedExtras = criteria.map(c => {
    const exIndices = sEv.extras[c] || [];
    return exIndices.map(idx => config.banks[c].extras[idx]).filter(Boolean);
  }).flat().join('; ');

  const criteriaScores = criteria.map(c => {
    const score = sEv.scores[c];
    const bank = config.banks[c];
    const label = bank.label;
    const desc = (score !== undefined && bank.band[score]) ? bank.band[score].text : 'No score assigned';
    return `${label} (${score !== undefined ? score + '/' + (ST.level==='7'?5:4) : 'N/A'}): "${desc}"`;
  }).join('\n');

  // Questions Context
  let questContext = '';
  let missedQuestions = 'None';

  if (ST.level === '7') {
    const topicName = ev.groupTopic !== null ? uq.main[ev.groupTopic] : 'Not specified';
    const fuName = ev.groupFollowUp !== null ? uq.followUp[ev.groupFollowUp] : 'Not specified';
    questContext = `Group Story Topic: [${topicName}]. Group Follow-up: [${fuName}]`;
    if (ev.groupTopic === null) missedQuestions = 'The group story topic selection';
  } else {
    const qc = sEv.questChecked?.[ev.unit] || { main: Array(uq.main.length).fill(false), followUp: null };
    const mainQs = uq.main.filter((_, i) => qc.main[i]).join(', ');
    const missedQs = uq.main.filter((_, i) => !qc.main[i]);
    const fuQ = qc.followUp !== null ? uq.followUp[qc.followUp] : null;
    questContext = `Addressed: [${mainQs || 'None'}]. Follow-up: [${fuQ || 'None'}]`;
    if (missedQs.length > 0 || qc.followUp === null) {
      const m = [...missedQs.map(q => `"${q}"`)];
      if (qc.followUp === null) m.push('the follow-up question');
      missedQuestions = m.join('; ');
    }
  }

  // Pacing (Target: ~60s per student)
  const target = 60;
  const remaining = target - timer;
  let pacingContext, pacingRule = '';
  if (timer < 45) {
    pacingContext = `${timer}s spoken — ${remaining}s short of target`;
    pacingRule = `Student spoke for only ${timer} seconds. Suggest they expand their narrative details to reach the ${target}s mark.`;
  } else if (timer > 80) {
    pacingContext = `${timer}s spoken — ${timer - target}s over target`;
    pacingRule = `Student spoke for ${timer} seconds. Suggest they be more concise with background details.`;
  } else {
    pacingContext = `${timer}s — within target zone ✓`;
  }
  const grammarErrorType = sEv.grammarError || 'Not specified';
  const exactPhrase = sEv.exactPhrase || 'Not captured';


  // Score Tone
  const tot = stuTotal(sEv);
  const totalScoreContext = tot !== null ? `${tot}/${config.totalPts}` : 'Not fully scored';
  let toneRule;
  const passRatio = tot !== null ? tot / config.totalPts : 0;
  
  if (tot === null)      toneRule = 'Direct, professional, and motivating.';
  else if (passRatio < .4)   toneRule = 'VERY compassionate. Lead with warmth. Acknowledge courage. No harsh corrections.';
  else if (passRatio < .6)   toneRule = 'Compassionate but clear. Praise what worked specifically, then one clear correction.';
  else if (passRatio < .75)  toneRule = 'Direct and positive. Celebrate the pass. Push for one concrete improvement.';
  else if (passRatio < .9)   toneRule = 'Challenger tone. Acknowledge strong performance. Push for precision.';
  else                      toneRule = 'C1 excellence mode. Tell them they approach advanced level.';

  // Mood
  const mood = sEv.mood || 'neutral';
  const moodInstructions = {
    nervous:   'MOOD: Student appeared nervous. Lead with strong emotional validation.',
    confident: 'MOOD: Student was confident. Set a higher bar and challenge them directly.',
    blocked:   'MOOD: Student froze. Only encouragement — nothing harsh whatsoever.',
    neutral:   ''
  };
  const moodNote = moodInstructions[mood] || '';
  
  // Level 7 Specific Rules (Specialized for Last Student)
  let specialization = '';
  if(ST.level === '7') {
    const gid = ST.curGroup.id;
    const sIds = ST.curGroup.studentIds;
    const isLast = sid === sIds[sIds.length - 1];
    
    if (isLast) {
      const aiUsed = ST.groupChecklist[gid]?.aiUse;
      specialization = `
SPECIAL CONTEXT (STORYTELLING - FINAL PRESENTER):
- This student is the FINAL presenter of their group and handles the AI reflection.
- Reflection/Lesson Learned is mandatory.
- AI EVIDENCE RULE: ${aiUsed ? "They successfully used AI as a tool. PRAISE their reflective integration of AI evidence." : "They did NOT adequately show AI evidence. BRIEFLY mention the importance of using AI as a supportive tool for narrative structure."}`;
    } else {
      specialization = `
SPECIAL CONTEXT (STORYTELLING):
- This student is part of a group performance. Focus on their individual narrative delivery and transitions.
- Do NOT mention AI reflection/evidence unless it appears explicitly in their 'LIVE NOTES'.`;
    }
  }

  // Prompt Construction
  const sysPrompt = `You are a B1 EFL oral assessment teacher. Transform input data into ONE paragraph of feedback (max 70 words, max clarity, plain text).
${specialization}

CORE ROLE: You are a supportive coach. Use the teacher's specific observations and exactly what the student said as your primary source of detail.

HIERARCHY OF INFORMATION:
1. PRIMARY: 'RUBRIC OBSERVATIONS' and 'EXACT PHRASE SAID'. These are your main sources for specific detail.
2. SECONDARY: 'RUBRIC SCORES' (with Level Descriptions). These are the official standards you must reflect.
3. CONTEXT: 'LIVE NOTES', 'MOOD', and 'PACING'. Use these to calibrate tone and coaching advice.

STRUCTURE: 
1. Strength (WEAVE in teacher observations, the exact phrase, or rubric standards). 
2. Practical Correction (Address points with low scores or missed target grammar). 
3. Practical Study Strategy (Actionable: record yourself, use flashcards, watch clips. NO technical phonetics).

TONE: Apply the 'TONE RULE' and 'MOOD INSTRUCTIONS' strictly. Use ${firstName}. No bullets.

BANNED JARGON: "phonetic", "alveolar", "dental fricative", "lexical", "subordinate clause", "syntax", "aspiration", "prosody".
BANNED: "great job", "well done", "keep it up", "overall", "in conclusion", "it's important to", "make sure to", "remember to", "good effort", "I recommend".`;

  const userPrompt = `STUDENT: ${firstName} | ${config.assessmentLabel} ${ev.unit}: ${uq.topic}
LEVEL: ${ST.level}
TONE RULE: ${toneRule}
MOOD INSTRUCTIONS: ${moodNote}

DATA:
- RUBRIC SCORES: ${criteriaScores}
- RUBRIC OBSERVATIONS: ${selectedExtras || 'None selected'}
- PACING: ${pacingContext}
- REQUIREMENTS ADDRESSED: ${questContext}
- MISSED REQUIREMENTS: ${missedQuestions}
${sEv.grammarChecked?.[ev.unit] ? `- TARGET GRAMMAR ACHIEVED: [${uq.grammar.filter((_, i) => sEv.grammarChecked[ev.unit][i]).join(', ') || 'None'}]
- TARGET GRAMMAR MISSED: [${uq.grammar.filter((_, i) => !sEv.grammarChecked[ev.unit][i]).join(', ') || 'None'}]` : ''}
- GRAMMAR ERROR TYPE: ${grammarErrorType || 'Not specified'}
- LIVE NOTES: ${notes}
- EXACT PHRASE SAID: "${exactPhrase || 'Not captured'}"

${sEv.strength ? `TEACHER INITIAL STRENGTH: "${sEv.strength}"` : ''}
${sEv.nextGoal ? `TEACHER INITIAL GOAL: "${sEv.nextGoal}"` : ''}

INSTRUCTIONS:
1. Synthesize all data above into a single, cohesive paragraph.
2. If PACING was short/long, follow: ${pacingRule || 'Mention it briefly if relevant'}.
3. If REQUIREMENTS or GRAMMAR were missed, address them constructively.
4. If an EXACT PHRASE was captured, weave it naturally into the feedback.`;

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
