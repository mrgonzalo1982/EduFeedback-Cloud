/* =====================================================================
   DATA — STUDENTS (Default/Fallback)
===================================================================== */
const DEFAULT_STUDENTS = {
  '6': {
    '1': [
      {id:'s1_1', fn:'Agustina',        ln:'Barrios Arriagada',   email:'agubarrios@alumnos.uai.cl'},
      {id:'s1_2', fn:'Jose Tomas',      ln:'Castro Galarce',      email:'josetocastro@alumnos.uai.cl'},
      {id:'s1_3', fn:'Sebastian',       ln:'Costa Tapia',         email:'secosta@alumnos.uai.cl'},
      {id:'s1_4', fn:'Trinidad',        ln:'Espinoza Galaz',      email:'trespinoza@alumnos.uai.cl'},
      {id:'s1_5', fn:'Marco',           ln:'Gandulfo Saavedra',   email:'magandulfo@alumnos.uai.cl'},
      {id:'s1_6', fn:'Joshuea',         ln:'Granda Nivelo',       email:'jgranda@alumnos.uai.cl'},
      {id:'s1_7', fn:'Emilio',          ln:'Grande Rodriguez',    email:'egrande@alumnos.uai.cl'},
      {id:'s1_8', fn:'Agustin',         ln:'Marin Hidalgo',       email:'agumarin@alumnos.uai.cl'},
      {id:'s1_9', fn:'Sebastian',       ln:'Peña Peña',           email:'sebapena@alumnos.uai.cl'},
      {id:'s1_10',fn:'Fernanda',        ln:'Pérez Barrios',       email:'fernandacperez@alumnos.uai.cl'},
      {id:'s1_11',fn:'Martin',          ln:'Pizarro Fernandez',   email:'martinipizarro@alumnos.uai.cl'},
      {id:'s1_12',fn:'Sebastian',       ln:'Rodriguez Vani',      email:'sebastiananrodriguez@alumnos.uai.cl'},
      {id:'s1_13',fn:'Monserrat',       ln:'Valencia Oporto',     email:'monvalencia@alumnos.uai.cl'},
      {id:'s1_14',fn:'Maria Jesus',     ln:'Vasquez Vasquez',     email:'majvasquez@alumnos.uai.cl'},
      {id:'s1_15',fn:'Catalina',        ln:'Videla Ruz',          email:'catvidela@alumnos.uai.cl'},
    ],
    '7': [
      {id:'s7_1', fn:'Akash',           ln:'Di Fazio Nelidow',    email:'akdifazio@alumnos.uai.cl'},
      {id:'s7_2', fn:'Igal',            ln:'Eidelsatein Cortese', email:'igeidelsatein@alumnos.uai.cl'},
      {id:'s7_3', fn:'Rosario',         ln:'Frías Rosas',         email:'rosfrias@alumnos.uai.cl'},
      {id:'s7_4', fn:'Catalina',        ln:'Jelvez Barraza',      email:'catjelvez@alumnos.uai.cl'},
      {id:'s7_5', fn:'Isabel',          ln:'Ketterer Menichetti', email:'isabketterer@alumnos.uai.cl'},
      {id:'s7_6', fn:'Antonella',       ln:'Meneses Reinoso',     email:'antomeneses@alumnos.uai.cl'},
      {id:'s7_7', fn:'Tiare',           ln:'Romo Muller',         email:'tiaromo@alumnos.uai.cl'},
      {id:'s7_8', fn:'Camila',          ln:'Salinas Gonzalez',    email:'camsalinas@alumnos.uai.cl'},
      {id:'s7_9', fn:'Florencia',       ln:'Santelice Figueroa',  email:'florsantelice@alumnos.uai.cl'},
      {id:'s7_10',fn:'Martin',          ln:'Tuteleers Massa',     email:'martuteleers@alumnos.uai.cl'},
      {id:'s7_11',fn:'Anastasia',       ln:'Velasco Ramos',       email:'ansvelasco@alumnos.uai.cl'},
      {id:'s7_12',fn:'Javier',          ln:'Vidal Villalobos',    email:'javvidal@alumnos.uai.cl'},
    ],
    '8': [
      {id:'s8_1', fn:'Aintzane',        ln:'Aspillaga Uriarte',   email:'ainaspillaga@alumnos.uai.cl'},
      {id:'s8_2', fn:'Matias',          ln:'Catalán Carvajal',    email:'matcatalan@alumnos.uai.cl'},
      {id:'s8_3', fn:'Maria de los A.', ln:'Chavez Chubretovich', email:'marychavez@alumnos.uai.cl'},
      {id:'s8_4', fn:'Javiera',         ln:'Chelón Lucero',       email:'javichelon@alumnos.uai.cl'},
      {id:'s8_5', fn:'Diego',           ln:'Gabrielli Bellalta',  email:'diegabrielli@alumnos.uai.cl'},
      {id:'s8_6', fn:'Mateo',           ln:'Gómez Schaeffer',     email:'matgomez@alumnos.uai.cl'},
      {id:'s8_7', fn:'Brando',          ln:'La Rosa Gomez',       email:'branlarosa@alumnos.uai.cl'},
      {id:'s8_8', fn:'Franco',          ln:'Lewysohn Silva',      email:'franlewysohn@alumnos.uai.cl'},
      {id:'s8_9', fn:'Sofia',           ln:'Riffo Arancibia',     email:'sofiriffo@alumnos.uai.cl'},
      {id:'s8_10',fn:'Omar',            ln:'Rojas Henriquez',     email:'omarrojas@alumnos.uai.cl'},
      {id:'s8_11',fn:'Francisca',       ln:'Rojas Ortega',        email:'franrojas@alumnos.uai.cl'},
      {id:'s8_12',fn:'Raimundo',        ln:'Rotter Segovia',      email:'raimrotter@alumnos.uai.cl'},
      {id:'s8_13',fn:'Angel',           ln:'Saldivia Monsalve',   email:'angsaldivia@alumnos.uai.cl'},
      {id:'s8_14',fn:'Maria Amalia',    ln:'Varela Herrera',      email:'marvarela@alumnos.uai.cl'},
    ],
  }
};

/* =====================================================================
   DATA — RUBRIC BANKS (growth-mindset language)
===================================================================== */
const CRITERIA = ['taskAch','grammar','vocab','pronun'];
const BANKS = {
  taskAch: {
    label:'Task Achievement',
    band:{
      4:{text:"You spoke fluently and covered all aspects of the task fully, with natural flow and no repetition. This is exactly what a strong presentation looks like.",
         tip:"You've mastered the foundation — push further by adding sophisticated discourse markers and signposting language to elevate your presentations even more."},
      3:{text:"You gave a well-developed response that clearly addressed the task. Your length and linking showed solid preparation.",
         tip:"To reach Excellent, expand each point with specific examples and aim to speak for the full 60 seconds without repetition."},
      2:{text:"Your response covered the core requirements of the task. You're building the foundation — the next step is adding depth and detail.",
         tip:"Prepare a detailed outline with at least two examples per question. Practice speaking for the full 60 seconds on each point before the presentation."},
      1:{text:"You communicated some ideas, and that's a real starting point. Speaking in a second language takes courage, and you're developing this skill step by step.",
         tip:"Practice speaking for 2 minutes daily using bullet-point notes — not a full script. Record yourself and listen back once a week to notice your own progress."},
      0:{text:"This task was a real challenge, and acknowledging that is the first step. Now you have a clear picture of what the target looks like — and that's valuable.",
         tip:"Work with your group to create a structured preparation plan. Record yourself practicing at home and celebrate every small improvement you notice."},
    },
    extras:[
      "You covered the main ideas but moved through some points too quickly.",
      "You used the grammar structures from the unit effectively in your response.",
      "Your use of the follow-up question was excellent and felt very natural.",
      "Your response was too short — aim for at least 60 seconds per student.",
      "You showed great confidence and spoke with a very natural flow.",
      "You used your presentation support (PPT/notes) well, without reading from it directly.",
    ]
  },
  grammar:{
    label:'Grammar',
    band:{
      4:{text:"You produced complex sentences with very few or no errors throughout. Your verb formation was consistently accurate — impressive control.",
         tip:"Keep pushing: try incorporating more advanced structures like passive voice, conditionals, or reported speech in future assessments."},
      3:{text:"You used a range of sentence forms with some complexity and very few errors. Verb formation was generally accurate and your grammar supported your ideas well.",
         tip:"To reach Excellent, use subordinate clauses more consistently: 'Although I used to…', 'Even though my taste has changed…'"},
      2:{text:"Your basic grammar was solid — you formed sentences accurately, and that's a strong foundation. The next step is adding more complexity.",
         tip:"Review the unit grammar structures and challenge yourself to include one subordinate clause per idea. Daily practice with these structures makes a big difference."},
      1:{text:"You communicated using language, and that's what matters most at this stage. Grammar accuracy is a skill that develops with focused, consistent practice — not talent.",
         tip:"Start with one structure at a time. Write 5 'used to' sentences (or present perfect continuous sentences) every day and say them out loud until they feel natural."},
      0:{text:"Grammar accuracy builds gradually over time — and every learner starts somewhere. You're identifying your starting point, which is the most important first step.",
         tip:"Review the unit grammar with your teacher's support. Resources like British Council LearnEnglish are free and offer exercises at exactly your level."},
    },
    extras:[
      "You correctly used 'used to' to describe past habits — well done!",
      "You used comparisons (more…than / not as…as) accurately and naturally.",
      "You correctly used present perfect continuous with time expressions.",
      "You sometimes confused past simple and present perfect — this is a common challenge worth reviewing.",
      "Verb tense agreement needs a bit more consistent practice.",
      "You occasionally omitted auxiliary verbs in questions and negatives.",
    ]
  },
  vocab:{
    label:'Vocabulary',
    band:{
      4:{text:"You used a wide, natural range of vocabulary — including lower-frequency words, synonyms, and idiomatic expressions. It made your speech richer and more engaging.",
         tip:"Excellent range! Keep challenging yourself with one new idiom or collocation per topic, and explore authentic sources like podcasts and films."},
      3:{text:"You used a solid vocabulary range with very little searching. Your use of synonyms and some idiomatic language made your response effective.",
         tip:"To score higher, use more synonyms and avoid repeating key words. Create a vocabulary map for each topic area before the presentation."},
      2:{text:"You had the vocabulary to get your meaning across — that's the essential foundation. Now let's build a richer, more varied word bank.",
         tip:"Create a vocabulary list per unit topic and review it before speaking. Aim to use at least 3 unit vocabulary words per response."},
      1:{text:"You communicated your ideas even when words were hard to find — that persistence really shows. Vocabulary grows quickly with regular reading, listening, and deliberate study.",
         tip:"Write 5 new words per day with a definition, a synonym, and an example sentence. Review them weekly. Even 10 minutes a day makes a real, measurable difference."},
      0:{text:"Vocabulary is one of those skills that grows dramatically with consistent input — and it can improve faster than you might expect.",
         tip:"Focus on the core unit vocabulary first. Use Quizlet or Anki flashcards for short daily reviews. Even passive listening to English (music, YouTube) builds your word bank over time."},
    },
    extras:[
      "You used topic-specific vocabulary (music / TV shows / movies / activities) very effectively.",
      "You paraphrased well when you didn't know an exact word — that's a great strategy!",
      "You used idiomatic expressions in a very natural way.",
      "You repeated the same key words several times — try using synonyms next time.",
      "Your vocabulary was appropriate for the level and the task.",
      "You searched for words too often — focusing on pre-task vocabulary preparation will help a lot.",
    ]
  },
  pronun:{
    label:'Pronunciation',
    band:{
      4:{text:"You were understood effortlessly. Your control of sounds, stress, intonation, and linking was very skillful — it made listening a genuine pleasure.",
         tip:"Excellent! Now focus on mastering connected speech — contractions, reductions, and word linking — to sound even more natural and fluent."},
      3:{text:"You were easily understood and your accent caused no difficulty. Your use of stress and intonation helped clarify your meaning throughout.",
         tip:"To reach Excellent, practice linking words in connected speech: 'used_to', 'not_as_popular'. Imitating native speakers regularly is the fastest path."},
      2:{text:"Your message came through clearly — that's the priority. Now let's work on making your delivery even more precise and natural-sounding.",
         tip:"Record yourself and compare with a native speaker model for the same words. Apps like ELSA Speak help identify your specific focus areas."},
      1:{text:"Pronunciation is one of the most coachable English skills — with the right targeted practice, it improves noticeably in a short time. You've identified exactly where to focus.",
         tip:"Use YouGlish to hear target words in natural context. Shadow native speakers out loud for 10–15 minutes daily — it's the most effective method."},
      0:{text:"Pronunciation clarity develops through targeted practice and daily listening exposure. Identifying your specific challenge areas is genuinely the hardest and most important first step.",
         tip:"Work individually with your teacher on the specific sounds that are difficult for you. Daily listening (podcasts, YouTube in English) plus deliberate, slow repetition practice is key."},
    },
    extras:[
      "Your intonation made your speech sound natural and genuinely engaging.",
      "Pay closer attention to word stress in multi-syllable vocabulary words.",
      "Your connected speech sounded very natural and fluent.",
      "Some specific consonant sounds need more targeted practice.",
      "Your pace and rhythm were well-suited for clear, comfortable communication.",
      "Slowing down slightly would improve overall clarity for the listener.",
    ]
  }
};

const BAND_INFO = [
  {pts:4,label:'Excellent',         short:'Exc.',  cls:'band-exc',bar:'#22c55e'},
  {pts:3,label:'Good',              short:'Good',  cls:'band-gd', bar:'#3b82f6'},
  {pts:2,label:'Satisfactory',      short:'Sat.',  cls:'band-sat',bar:'#f59e0b'},
  {pts:1,label:'Developing',        short:'Dev.',  cls:'band-ni', bar:'#f97316'},
  {pts:0,label:'Beginning',         short:'Beg.',  cls:'band-blw',bar:'#ef4444'},
];

/* =====================================================================
   DATA — UNIT QUESTIONS
===================================================================== */
const UQ = {
  7:{
    topic:'How our entertainment preferences have changed',
    grammar:['used to','Comparisons (not as…as / more…than)'],
    vocab:'Music, TV shows, movies',
    main:[
      'What kind of entertainment do you enjoy now?',
      'What kind of entertainment did you use to like in the past?',
      'How is your taste different now?',
      'Why do you think your preferences have changed?',
    ],
    followUp:[
      'Is this type of entertainment as popular as it used to be? Why or why not?',
      'Would you accept or refuse an invitation related to this activity? Why?',
      'How would you soften your opinion if someone disagrees with you?',
    ],
  },
  8:{
    topic:"What I've been doing lately and my progress",
    grammar:['Present perfect continuous','Time expressions (recently, lately, for, since)'],
    vocab:'Experiences and progress',
    main:[
      'What have you been working on or doing recently?',
      'How long have you been doing it?',
      'What progress have you noticed so far?',
      'What has been difficult or challenging about it?',
    ],
    followUp:[
      'What would you like to improve next?',
      'How has this activity changed you?',
      'What advice would you give to someone starting this activity?',
    ],
  },
};

/* =====================================================================
   DATA — KEYWORD MAP for live notes analysis
===================================================================== */
const KEYW = {
  taskAch:{
    pos:[
      {k:['confident','fluent','natural flow','easy to follow','great delivery'],idx:4},
      {k:['good example','examples','detailed','developed','specific'],idx:0},
      {k:['follow-up','follow up','used follow'],idx:2},
      {k:['ppt','slides','visual','supported'],idx:5},
      {k:['completed task','answered all','covered all','addressed all'],idx:4},
    ],
    neg:[
      {k:['too short','very short','brief','30 sec','20 sec','40 sec','only seconds'],idx:3},
      {k:['incomplete','breakdown','stopped','gave up','didn\'t finish'],idx:0},
      {k:['repetition','repeated idea','same point again'],idx:0},
      {k:['off topic','not related','missed topic'],idx:3},
    ],
  },
  grammar:{
    pos:[
      {k:['used to','use to correctly'],idx:0},
      {k:['comparative','more than','not as','comparison used'],idx:1},
      {k:['present perfect','perfect continuous','have been','has been'],idx:2},
      {k:['complex sentence','subordinate','clause','complex grammar'],idx:0},
    ],
    neg:[
      {k:['wrong tense','tense confusion','tense error','confused tense'],idx:3},
      {k:['base form','wrong verb','verb error','auxiliary missing'],idx:4},
      {k:['agreement error','sv error','subject verb'],idx:4},
    ],
  },
  vocab:{
    pos:[
      {k:['topic vocab','topic words','specific vocabulary','good word choice'],idx:0},
      {k:['paraphrase','paraphrased','found another way'],idx:1},
      {k:['idiom','idiomatic','expression used'],idx:2},
      {k:['synonym','variety','varied vocab','diverse language'],idx:4},
    ],
    neg:[
      {k:['searched for word','searching','vocab gap','long pause vocab','couldn\'t find'],idx:5},
      {k:['repeated word','same word','repetitive vocab'],idx:3},
      {k:['limited vocab','basic words','simple language','very simple'],idx:3},
    ],
  },
  pronun:{
    pos:[
      {k:['very clear','clear pronunciation','easy to understand','understood well'],idx:4},
      {k:['good intonation','natural intonation','varied intonation'],idx:0},
      {k:['linking','connected speech','natural rhythm'],idx:2},
      {k:['good stress','correct stress','stress ok'],idx:4},
    ],
    neg:[
      {k:['unclear','hard to understand','mispronounced','mispronunciation','difficult to follow'],idx:3},
      {k:['stress error','wrong stress','stress issue'],idx:1},
      {k:['too fast','too slow','pace issue','mumbling','very fast','very slow'],idx:5},
    ],
  },
};
