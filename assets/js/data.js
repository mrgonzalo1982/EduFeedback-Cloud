/* =====================================================================
   DATA — STUDENTS
==================================================================== */
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
  },
  '7': {
    '1': [
      {"id": "s7_1_1", "fn": "Trinidad Antonia", "ln": "Amar Mallol", "email": "tamar@alumnos.uai.cl"},
      {"id": "s7_1_2", "fn": "Josefina Antonia", "ln": "Bascunan Lillo", "email": "josefbascunan@alumnos.uai.cl"},
      {"id": "s7_1_3", "fn": "Dominga Antonella", "ln": "Bellagamba Gallardo", "email": "dbellagamba@alumnos.uai.cl"},
      {"id": "s7_1_4", "fn": "Benjamin Antonio", "ln": "Burgos Leon", "email": "benburgos@alumnos.uai.cl"},
      {"id": "s7_1_5", "fn": "Vicente Alonso", "ln": "Concha P\u00e9rez", "email": "vicconcha@alumnos.uai.cl"},
      {"id": "s7_1_6", "fn": "Grexcy Anais", "ln": "Espinoza Saavedra", "email": "grespinoza@alumnos.uai.cl"},
      {"id": "s7_1_7", "fn": "Katty Alejandra", "ln": "Frost Aranda", "email": "kfrost@alumnos.uai.cl"},
      {"id": "s7_1_8", "fn": "Mat\u00edas Rodrigo", "ln": "Jaccard Del Canto", "email": "mjaccard@alumnos.uai.cl"},
      {"id": "s7_1_9", "fn": "Farida Misrrain", "ln": "Libano Salas", "email": "flibano@alumnos.uai.cl"},
      {"id": "s7_1_10", "fn": "Joaqu\u00edn Andres", "ln": "Maturana Saffie", "email": "joamaturana@alumnos.uai.cl"},
      {"id": "s7_1_11", "fn": "Simon Emilio", "ln": "Molina Lara", "email": "simolina@alumnos.uai.cl"},
      {"id": "s7_1_12", "fn": "Joaquin Isaias", "ln": "Ocaranza Conde", "email": "jocaranza@alumnos.uai.cl"},
      {"id": "s7_1_13", "fn": "Laura Andrea", "ln": "Osses Hern\u00e1ndez", "email": "laosses@alumnos.uai.cl"},
      {"id": "s7_1_14", "fn": "Ignacia Belen", "ln": "Paredes Berenguer", "email": "ignparedes@alumnos.uai.cl"},
      {"id": "s7_1_15", "fn": "Agustin Mauricio", "ln": "Pulgar Ayala", "email": "agpulgar@alumnos.uai.cl"},
      {"id": "s7_1_16", "fn": "Valeria Monserrat", "ln": "Retamales Acuna", "email": "vretamales@alumnos.uai.cl"},
      {"id": "s7_1_17", "fn": "Daniella Caterina", "ln": "Roncagliolo Ugarte", "email": "droncagliolo@alumnos.uai.cl"},
      {"id": "s7_1_18", "fn": "Joaquin Carlos Enrique", "ln": "Rossi Araya", "email": "jorossi@alumnos.uai.cl"},
      {"id": "s7_1_19", "fn": "Francisca Amelia", "ln": "Sanchez Arizaga", "email": "francisanchez@alumnos.uai.cl"},
      {"id": "s7_1_20", "fn": "Jos\u00e9 Ignacio", "ln": "Silva Carrillo", "email": "joseigsilva@alumnos.uai.cl"},
      {"id": "s7_1_21", "fn": "Marcelo Alberto", "ln": "V\u00e1squez Campos", "email": "marcelovasquez@alumnos.uai.cl"},
      {"id": "s7_1_22", "fn": "Agust\u00edn Arturo", "ln": "Zambrano Mart\u00ednez", "email": "agzambrano@alumnos.uai.cl"},
      {"id": "test_stu", "fn": "Gonzalo", "ln": "Flores", "email": "gonzaloandres.flores@edu.uai.cl"}
    ],
    '2': [
      {"id": "s7_2_1", "fn": "Vicente Ignacio", "ln": "Aravena Espinoza", "email": "vicaravena@alumnos.uai.cl"},
      {"id": "s7_2_2", "fn": "Florencia Paz", "ln": "Basualto Arancibia", "email": "flbasualto@alumnos.uai.cl"},
      {"id": "s7_2_3", "fn": "Florencia Margarita", "ln": "Canas Canas", "email": "flocanas@alumnos.uai.cl"},
      {"id": "s7_2_4", "fn": "Benjamin Elias", "ln": "Cariqueo Caniuqueo", "email": "bcariqueo@alumnos.uai.cl"},
      {"id": "s7_2_5", "fn": "Amalia Ignacia", "ln": "Correa Larrain", "email": "amacorrea@alumnos.uai.cl"},
      {"id": "s7_2_6", "fn": "Jose Luis", "ln": "Cuadra Figueroa", "email": "jcuadra@alumnos.uai.cl"},
      {"id": "s7_2_7", "fn": "Alonso Gabriel", "ln": "Fabbri Espinoza", "email": "alofabbri@alumnos.uai.cl"},
      {"id": "s7_2_8", "fn": "Martin Sebastian", "ln": "Gajardo Diaz", "email": "martigajardo@alumnos.uai.cl"},
      {"id": "s7_2_9", "fn": "Matias Benjamin", "ln": "Guzman Valdivia", "email": "matismuzman@alumnos.uai.cl"},
      {"id": "s7_2_10", "fn": "Martin Andres", "ln": "Hormazabal Cerda", "email": "martihormazabal@alumnos.uai.cl"},
      {"id": "s7_2_11", "fn": "Nicolas Ignacio", "ln": "Mondaca Arancibia", "email": "nicmondaca@alumnos.uai.cl"},
      {"id": "s7_2_12", "fn": "Fernanda Rafaela", "ln": "Munoz Lagos", "email": "fernandamunoz@alumnos.uai.cl"},
      {"id": "s7_2_13", "fn": "Catalina Ignacia", "ln": "Perez Lopez", "email": "catalinaiperez@alumnos.uai.cl"},
      {"id": "s7_2_14", "fn": "Sebastian Esteban", "ln": "Ramirez Ortiz", "email": "sebastiramirez@alumnos.uai.cl"},
      {"id": "s7_2_15", "fn": "Cristobal Martin", "ln": "Reyes Montecinos", "email": "cristobareyes@alumnos.uai.cl"},
      {"id": "s7_2_16", "fn": "Pia Constanza", "ln": "Sanders Ferrada", "email": "psanders@alumnos.uai.cl"},
      {"id": "s7_2_17", "fn": "Joaqu\u00edn Alonso", "ln": "Santana Gonz\u00e1lez", "email": "joasantana@alumnos.uai.cl"},
      {"id": "s7_2_18", "fn": "Sof\u00eda Antonia", "ln": "Serra Vel\u00e1squez", "email": "sserra@alumnos.uai.cl"},
      {"id": "s7_2_19", "fn": "Felipe Beltr\u00e1n", "ln": "Sotta Couso", "email": "fesotta@alumnos.uai.cl"},
      {"id": "s7_2_20", "fn": "Josefa Ivonne", "ln": "Tapia Jorquera", "email": "josefatapia@alumnos.uai.cl"},
      {"id": "s7_2_21", "fn": "Ignacio Eduardo", "ln": "Villarroel Carrasco", "email": "igvillarroel@alumnos.uai.cl"},
      {"id": "s7_2_22", "fn": "Martina Belen", "ln": "Vitar Saavedra", "email": "martinavitar@alumnos.uai.cl"}
    ],
    '3': [
      {"id": "s7_3_1", "fn": "Joaqu\u00edn Alejandro", "ln": "Araya Medina", "email": "joaqaraya@alumnos.uai.cl"},
      {"id": "s7_3_2", "fn": "Javiera Antonia", "ln": "Ascorra Del R\u00edo", "email": "jascorra@alumnos.uai.cl"},
      {"id": "s7_3_3", "fn": "Inge Sabrina", "ln": "Bruna Gerlach", "email": "ibruna@alumnos.uai.cl"},
      {"id": "s7_3_4", "fn": "Patricio Ignacio", "ln": "Cabrera Araya", "email": "patricabrera@alumnos.uai.cl"},
      {"id": "s7_3_5", "fn": "Agustin Ignacio", "ln": "Donoso Ramirez", "email": "agustindonoso@alumnos.uai.cl"},
      {"id": "s7_3_6", "fn": "Lukas Benjamin", "ln": "Fredes Godoy", "email": "lufredes@alumnos.uai.cl"},
      {"id": "s7_3_7", "fn": "Manuel Humberto", "ln": "Gallardo Solar", "email": "manuegallardo@alumnos.uai.cl"},
      {"id": "s7_3_8", "fn": "Alonso Emilio", "ln": "Gonz\u00e1lez Cabello", "email": "alongonzalez@alumnos.uai.cl"},
      {"id": "s7_3_9", "fn": "Antonella Pascale", "ln": "Gortaire Rubi", "email": "agortaire@alumnos.uai.cl"},
      {"id": "s7_3_10", "fn": "Victoria Catalina", "ln": "Ibaceta Escobar", "email": "vicibaceta@alumnos.uai.cl"},
      {"id": "s7_3_11", "fn": "Constanza Paz Maria", "ln": "Olivares Reyes", "email": "constanzolivares@alumnos.uai.cl"},
      {"id": "s7_3_12", "fn": "Andres Castor", "ln": "Perez Encina", "email": "andrescperez@alumnos.uai.cl"},
      {"id": "s7_3_13", "fn": "Agust\u00edn Jos\u00e9 Ram\u00f3n", "ln": "P\u00e9rez Mujica", "email": "agustinjperez@alumnos.uai.cl"},
      {"id": "s7_3_14", "fn": "Zdenka", "ln": "Pivcevic Puelma", "email": "zpivcevic@alumnos.uai.cl"},
      {"id": "s7_3_15", "fn": "Eduardo Enrique", "ln": "Porras Vera", "email": "edporras@alumnos.uai.cl"},
      {"id": "s7_3_16", "fn": "Joaqu\u00edn Alonso", "ln": "Rivera Arriagada", "email": "joaqrivera@alumnos.uai.cl"},
      {"id": "s7_3_17", "fn": "Vicente Antonio", "ln": "Rodriguez Casazza", "email": "vicenteanrodriguez@alumnos.uai.cl"},
      {"id": "s7_3_18", "fn": "Maximiliano Andres", "ln": "Torres Guajardo", "email": "maximtorres@alumnos.uai.cl"},
      {"id": "s7_3_19", "fn": "Felipe Ignacio", "ln": "Torrijo Bustos", "email": "ftorrijo@alumnos.uai.cl"},
      {"id": "s7_3_20", "fn": "Monserrat Polette", "ln": "Vera Nunez", "email": "monsvera@alumnos.uai.cl"},
      {"id": "s7_3_21", "fn": "Antonia Sof\u00eda", "ln": "Vergara Dazarola", "email": "antonivergara@alumnos.uai.cl"},
      {"id": "s7_3_22", "fn": "Benjam\u00edn Gabriel", "ln": "Z\u00fa\u00f1iga Guerra", "email": "benzuniga@alumnos.uai.cl"}
    ],
    '4': [
      {"id": "s7_4_1", "fn": "Martin Simon", "ln": "Andrade Minetti", "email": "martiandrade@alumnos.uai.cl"},
      {"id": "s7_4_2", "fn": "Marcelo Esteban", "ln": "Araneda Alcalde", "email": "marcearaneda@alumnos.uai.cl"},
      {"id": "s7_4_3", "fn": "Trinidad Isidora", "ln": "Barrientos Rodriguez", "email": "trbarrientos@alumnos.uai.cl"},
      {"id": "s7_4_4", "fn": "Joaqu\u00edn Antonio", "ln": "Ben\u00edtez Arriaza", "email": "joabenitez@alumnos.uai.cl"},
      {"id": "s7_4_5", "fn": "Martina Antonia", "ln": "Bravo Carmona", "email": "martinbravo@alumnos.uai.cl"},
      {"id": "s7_4_6", "fn": "Marco Antonio", "ln": "Cabrera Guevraa", "email": "marcoacabrera@alumnos.uai.cl"},
      {"id": "s7_4_7", "fn": "Nicol\u00e1s Daniel", "ln": "D\u00edaz Mart\u00ednez", "email": "nicolasddiaz@alumnos.uai.cl"},
      {"id": "s7_4_8", "fn": "Magdalena Antonia", "ln": "Farias Tordecilla", "email": "magdfarias@alumnos.uai.cl"},
      {"id": "s7_4_9", "fn": "Maximiliano Ignacio", "ln": "Fernandez Herrera", "email": "maximfernandez@alumnos.uai.cl"},
      {"id": "s7_4_10", "fn": "Florencia Antonella", "ln": "Fernandez Mansilla", "email": "florfernandez@alumnos.uai.cl"},
      {"id": "s7_4_11", "fn": "Paulina Ester", "ln": "Gonzalez Sanchez", "email": "paulinaegonzalez@alumnos.uai.cl"},
      {"id": "s7_4_12", "fn": "Isidora Constanza", "ln": "Ibaceta Hurtado", "email": "isibaceta@alumnos.uai.cl"},
      {"id": "s7_4_13", "fn": "Maria Trinidad", "ln": "Kruuse Fuentes", "email": "mkruuse@alumnos.uai.cl"},
      {"id": "s7_4_14", "fn": "Alexandra Paz", "ln": "Leon Verdugo", "email": "alexleon@alumnos.uai.cl"},
      {"id": "s7_4_15", "fn": "Borja Tomas", "ln": "Padilla Vega", "email": "bpadilla@alumnos.uai.cl"},
      {"id": "s7_4_16", "fn": "Pia Constanza", "ln": "Pinochet Miranda", "email": "pipinochet@alumnos.uai.cl"},
      {"id": "s7_4_17", "fn": "Agustin Emiliano", "ln": "Ramirez Frioli", "email": "agustramirez@alumnos.uai.cl"},
      {"id": "s7_4_18", "fn": "Emilia Ivonne", "ln": "Saez Ahumada", "email": "emsaez@alumnos.uai.cl"},
      {"id": "s7_4_19", "fn": "Valentina Ignacia", "ln": "Vasquez Vasquez", "email": "valentinvasquez@alumnos.uai.cl"},
      {"id": "s7_4_20", "fn": "Jos\u00e9 Manuel", "ln": "Vicente Gorigoit\u00eda", "email": "jovicente@alumnos.uai.cl"},
      {"id": "s7_4_21", "fn": "Victoria Katarina", "ln": "Vilches Gutierrez", "email": "victvilches@alumnos.uai.cl"},
      {"id": "s7_4_22", "fn": "Francisca Ignacia", "ln": "Villarroel Rosas", "email": "francivillarroel@alumnos.uai.cl"}
    ]
  }
};

/* =====================================================================
   DATA — LEVEL CONFIGURATIONS
==================================================================== */
const LEVEL_CONFIGS = {
  '6': {
    totalPts: 16,
    passThreshold: 10,
    criteria: ['taskAch','grammar','vocab','pronun'],
    assessmentLabel: 'Unit',
    evalTitle: 'Oral Assessment Feedback',
    units: [7, 8],
    bandInfo: [
      {pts:4,label:'Excellent',         short:'Exc.',  cls:'band-exc',bar:'#22c55e'},
      {pts:3,label:'Good',              short:'Good',  cls:'band-gd', bar:'#3b82f6'},
      {pts:2,label:'Satisfactory',      short:'Sat.',  cls:'band-sat',bar:'#f59e0b'},
      {pts:1,label:'Developing',        short:'Dev.',  cls:'band-ni', bar:'#f97316'},
      {pts:0,label:'Beginning',         short:'Beg.',  cls:'band-blw',bar:'#ef4444'},
    ],
    banks: {
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
    },
    uq: {
      7:{
        topic:'How our entertainment preferences have changed',
        grammar:['used to','Comparisons (not as…as / more…than)','Softening Language'],
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
        grammar:['Present perfect continuous','Present perfect vs. simple','since / for / lately / recently'],
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
    },
    keyw: {
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
      }
    }
  },
  '7': {
    totalPts: 30,
    passThreshold: 18,
    criteria: ['checklist','mastery','organization','delivery','language','nonVerbal'],
    assessmentLabel: 'Evaluation',
    evalTitle: 'Level 7 — Group Presentation Storytelling',
    units: [1],
    groupChecklistItems: [
      { id: 'contrib', label: 'All group members contribute evenly without one person dominating' },
      { id: 'timing', label: 'Timing: 4-5 minutes' },
      { id: 'visuals', label: 'High-quality, formatting, relevant visual aids' },
      { id: 'transitions', label: 'Smooth transitions between participants' },
      { id: 'aiUse', label: 'Effective use of AI (adapted, not copied)' }
    ],
    bandInfo: [
      {pts:5,label:'Always',          short:'Exc.', cls:'band-exc',bar:'#22c55e'},
      {pts:4,label:'Very Often',      short:'Good+',cls:'band-gd+',bar:'#10b981'},
      {pts:3,label:'Often',           short:'Good', cls:'band-gd', bar:'#3b82f6'},
      {pts:2,label:'Sometimes',       short:'Sat.',  cls:'band-sat',bar:'#f59e0b'},
      {pts:1,label:'Rarely',          short:'Dev.',  cls:'band-ni', bar:'#f97316'},
      {pts:0,label:'Never',           short:'Beg.',  cls:'band-blw',bar:'#ef4444'},
    ],
    banks: {
      checklist: {
        label:'Group Checklist',
        band:{
          5:{text:"Your group showed exceptional coordination. Timing was spot-on, visual aids were high-quality, and the transition between participants was seamless.",
             tip:"Masterful teamwork! To elevate further, try using even more dynamic interaction between speakers to make it feel like a shared narrative."},
          4:{text:"Great group synchronization. Your visual aids were helpful and the division of work was balanced and effective.",
             tip:"Very good flow. Focus on making the transitions even tighter during the conflict-climax segments to build more narrative tension."},
          3:{text:"Good teamwork! You addressed most logistical points well. The timing was appropriate and everyone participated.",
             tip:"Solid foundation. For the next presentation, coordinate your visual themes more closely so the slides feel as unified as your story."},
          2:{text:"Effective coordination in many areas. You covered the core requirements of the group task adequately.",
             tip:"Refine your timing. Sometimes one segment went a bit long; practice with a timer during group rehearsals to ensure total balance."},
          1:{text:"Coordination is a skill that improves with every group project. You managed to present together, which is the first big step.",
             tip:"Work on alignent. In future tasks, dedicate one meeting purely to practicing the transitions between speakers to ensure a natural flow."},
          0:{text:"Group work can be challenging, but it's where we learn the most about professional communication. This experience is your starting point.",
             tip:"Create a group contract next time. Divide roles early and check in on each other's progress weekly to avoid last-minute imbalances."},
        },
        extras: [
          "Effective use of AI evidence was clear in your presentation.",
          "Visual aids were particularly engaging and professional.",
          "Timing was perfectly managed within the 4-5 minute window.",
          "Smooth transitions made the group effort feel very professional.",
          "Division of work was clear and even among all members.",
          "Visual support was lacking in some segments — aim for more consistency."
        ]
      },
      mastery: {
        label:'Subject Mastery',
        band:{
          5:{text:"The story was profoundly engaging and coherent. Your reflection showed deep critical thinking and a clear, meaningful lesson learned.",
             tip:"Deep analysis! Keep exploring these complex themes — your ability to draw meaningful conclusions from narrative is a major strength."},
          4:{text:"Clear and very engaging story. You maintained a strong narrative thread and provided a insightful reflection on the outcome.",
             tip:"Strong storytelling. To reach the top band, try to make the 'Lesson Learned' even more personal to show individual growth."},
          5: {text: "The story was profoundly engaging and coherent. Your reflection showed deep critical thinking and a clear, meaningful lesson learned.", tip: "Deep analysis! Keep exploring these complex themes — your ability to draw meaningful conclusions from narrative is a major strength."},
          3:{text:"Solid storytelling! Your story was clear and logical, and you included a relevant reflection on the experience.",
             tip:"Good coherence. Strengthen your conclusion by explicitly connecting the resolution of the story to the ethical use of tools like AI."},
          2:{text:"You told a clear story that the audience could follow. You included the core elements of the required topic.",
             tip:"Expand your reflection. Don't just say what happened — spend more time explaining what you would do differently next time."},
          1:{text:"You shared a story and met the basic goal of communicating an experience. Storytelling takes courage, especially in a second language.",
             tip:"Focus on clarity. Outline the main event more simply before you start so the audience has a clear 'map' of your story."},
          0:{text:"Starting a narrative can be difficult, but identifying your topic is the first step toward building a great story.",
             tip:"Work on the 'Conflict' part of the story first. A good story needs a clear problem to be truly engaging for the audience."},
        },
        extras: [
          "Ethical use of AI was handled with great maturity in your story.",
          "The reflection showed a very high level of self-awareness.",
          "Coherence was a strong point in your narrative flow.",
          "The 'Lesson Learned' was particularly poignant and well-explained.",
          "Narrative tension was maintained effectively throughout.",
          "Some parts of the story were unclear — simplify the plot next time."
        ]
      },
      organization: {
        label:'Organization',
        band:{
          5:{text:"Flawless narrative structure. Each section (Intro, Conflict, Climax) built tension perfectly toward a satisfying resolution.",
             tip:"Masterful pacing! Your organization acted as a guide for the audience — use this 'roadmap' style in all professional speaking."},
          4:{text:"Very clear narrative structure. The transitions between the build-up and the climax were smooth and easy to follow.",
             tip:"Strong organization. Try to spend slightly less time on the background so you can give more weight to the resolution and reflection."},
          3:{text:"Solid structure! The beginning, development, and resolution were distinct and logical.",
             tip:"Good flow. Use more specific narrative connectors (Suddenly, Eventually, Consequently) to signpost each new stage of the story."},
          2:{text:"Logical organization in most parts. You followed the required structure for the storytelling task.",
             tip:"Balance your sections. Make sure the climax is the most important part of the delivery — sometimes it felt a bit rushed."},
          1:{text:"Identifying the stages of a story is a learning process. You moved through the parts, which is a good foundation.",
             tip:"Use a visual storyboard during prep. Drawing out the 'Beginning, Middle, End' helps you organize your thoughts before speaking."},
          0:{text:"Structure builds over time as you practice narrative. Every story needs a foundation to stand on.",
             tip:"Follow the mandatory structure strictly next time: Intro, Background, Conflict, Climax, Resolution. It's a proven recipe for success."},
        },
        extras: [
          "Excellent use of the 5-part structure.",
          "Pacing between the conflict and the climax was very effective.",
          "The transition from background to climax was particularly smooth.",
          "Pacing felt a bit uneven — try to dedicate more time to the climax.",
          "Resolution was handled well, with enough time for reflection.",
          "Transitions between students were clear and well-rehearsed."
        ]
      },
      delivery: {
        label:'Delivery',
        band:{
          5:{text:"Your pronunciation was exceptionally clear and natural. Intelligible speech and effortless flow made your storytelling a pleasure to listen to.",
             tip:"Professional delivery! To go beyond, focus on 'Vocal Variety' — using your tone to match the mood of different parts of the story."},
          4:{text:"Very clear and intelligible speech. You showed good control of sounds and word stress throughout the narrative.",
             tip:"Clear delivery. Practice the pronunciation of specific narrative verbs (Past Simple endings like -ed) to ensure total accuracy."},
          3:{text:"Good delivery! You were easily understood and your rhythm supports the narrative well.",
             tip:"Solid clarity. Record yourself telling one part of the story and listen back to identify any words that sound slightly rushed."},
          2:{text:"Message was clear and fairly easy to understand. You delivered your part of the story effectively.",
             tip:"Focus on chunking. Group your words into meaningful phrases rather than saying word-by-word to help the audience follow easily."},
          1:{text:"Intelligible speech builds step-by-step. Communicating your part of the story is the most important achievement at this stage.",
             tip:"Slow down. Don't worry about speed — clarity is much more important. Take a deep breath between every two sentences."},
          0:{text:"Every speaker starts by finding their voice. Pronunciation clarity develops with consistent listening and repeating.",
             tip:"Use YouGlish to listen to native speakers saying your key words. Repeat them out loud until the sounds feel more familiar."},
        },
        extras: [
          "Pronunciation was clear and helped the narrative flow.",
          "Good use of pauses for emotional effect in the story.",
          "Delivery was confident and easy to follow.",
          "Be careful with -ed endings in past simple verbs.",
          "Pronunciation sometimes made it difficult to follow the plot.",
          "Speech was steady and well-paced for the audience."
        ]
      },
      language: {
        label:'Language',
        band:{
          5:{text:"Accurate and sophisticated use of narrative tenses (Past Continuous/Perfect). Your connectors made the transitions feel natural and varied.",
             tip:"Fluent language control! Challenge yourself by using more descriptive adjectives and idiomatic expressions to paint a 'mental picture'."},
          4:{text:"Very good control of narrative tenses. You used a variety of structures to describe both the background and the action.",
             tip:"Accurate language. Try using 'Past Perfect' (I had done) more often when setting the scene before the main story event."},
          3:{text:"Good control of past tenses and connectors. You used appropriate vocabulary for the storytelling task.",
             tip:"Solid grammar. Review the difference between Past Simple (action) and Past Continuous (background) to add more texture to your story."},
          2:{text:"Accurate use of basic past tenses. You have enough language to get your story across effectively.",
             tip:"Broaden your word choice. Find three 'interesting' synonyms for common words (like dynamic instead of fast, or complex instead of hard)."},
          1:{text:"Narrative language is a major milestone in English. You managed to communicate past events, which is a key skill.",
             tip:"Master the 'Past Simple' first. Consistency with 'I was', 'I did', 'I said' is the best foundation for storytelling."},
          0:{text:"Language grows as you read and hear more stories. Identifying the words you need is the first step toward fluency.",
             tip:"Create a 'Word Bank' for your story. Write down 5 verbs and 5 adjectives before you start and try to use them in your draft."},
        },
        extras: [
          "Excellent use of narrative tenses (Continuous/Perfect).",
          "Connectors were used very effectively to link the plot.",
          "Accuracy with past tenses was a notable strength.",
          "Be careful with irregular verb forms in the past simple.",
          "Vocabulary was well-chosen for the specific story topic.",
          "Repetition of 'and then' — try using 'next', 'eventually' or 'consequently'."
        ]
      },
      nonVerbal: {
        label:'Non-verbal aspects',
        band:{
          5:{text:"Excellent body language and visual contact! Your volume and presence truly engaged the audience and supported the story's emotions.",
             tip:"Compelling presence! You used your whole self to tell the story — keep using this energy in any public speaking role."},
          4:{text:"Great presence and engagement. You maintained consistent eye contact and used an appropriate volume for the room.",
             tip:"Engaging speaker. Try to use manual gestures more deliberately to 'illustrate' the conflict or climax as you speak."},
          3:{text:"Good visual contact and volume. You look comfortable presenting to your peers.",
             tip:"Solid presence. Don't be afraid to look away from your slides more often; the audience is much more engaged by your face than by the PPT."},
          2:{text:"Effective use of non-verbal cues. Your volume was adequate and you showed appropriate engagement with the audience.",
             tip:"Work on eye contact. Try to look at three different people in the audience during your 1-minute segment to build connection."},
          1:{text:"Body language is part of the message. Standing in front of a group is its own achievement — well done for taking that step.",
             tip:"Practice in front of a mirror. Stand with your feet shoulder-width apart to build stability and use your hands to emphasize one key point."},
          0:{text:"Non-verbal communication is a skill we build with confidence. Every presentation is an opportunity to practice.",
             tip:"Start with volume. If you speak loud and clear, the rest of your confidence will follow naturally. Don't hide behind the computer!"},
        },
        extras: [
          "Volume and clarity were well-suited for the presentation.",
          "Eye contact was consistent and engaging throughout.",
          "Body language helped emphasize the emotional parts of the story.",
          "Too much reading from slides — try to look at the audience more.",
          "Posture was professional and showed confidence.",
          "Gestures were helpful in explaining the story's conflict."
        ]
      },
    },
    uq: {
      1: {
        topic: 'Storytelling: Narrative Tenses & AI Reflection',
        grammar: ['Past Simple vs Continuous', 'Past Perfect', 'Narrative Connectors'],
        vocab: 'Reflective and descriptive expressions',
        main: [
          'A moment that changed everything',
          'A mistake that taught an important lesson',
          'A situation that tested trust, values, or courage',
          'An experience that pushed someone out of their comfort zone',
          'When expectations didn\'t match reality',
          'A challenge that brought growth or transformation'
        ],
        followUp: [
          'Answer one question from a classmate, tutor, or teacher effectivelyly'
        ]
      }
    },
    keyw: {
      // Basic Level 7 mapping
      mastery: {
        pos: [{k:['engaging','clear story','coherent','reflection','lesson','learned'],idx:0}],
        neg: [{k:['unclear plot','confusing','no reflection','no lesson'],idx:5}]
      },
      language: {
        pos: [{k:['past perfect','continuous','connectors'],idx:0}],
        neg: [{k:['wrong tense','base form','irregular verb error'],idx:3}]
      }
    }
  }
};

/* =====================================================================
   GLOBAL STATE ACCESSORS (Level-Aware)
==================================================================== */
function getRubric() {
  return LEVEL_CONFIGS[ST.level] || LEVEL_CONFIGS['6'];
}

/* Re-bind these as functions or getters in logic.js or exports here */
const getCriteria = () => getRubric().criteria;
const getBanks = () => getRubric().banks;
const getBandInfo = () => getRubric().bandInfo;
const getUQ = () => getRubric().uq;
const getKeyw = () => getRubric().keyw;
const getTotalPts = () => getRubric().totalPts;
const getPassThreshold = () => getRubric().passThreshold;
