/* ============================================================
   PAGE HELP — floating "?" button + instructions popup
   Self-contained (own styles, own DOM), works on every page
   regardless of that page's own theme/CSS. Shows once
   automatically per page (localStorage), reopenable any time.
============================================================ */
(function () {
  'use strict';

  var LANG_KEY = 'RK_LANG';
  var SEEN_PREFIX = 'RK_HELP_SEEN_';

  var CONTENT = {
    exercises: {
      ro: {
        title: 'Exerciții TOPIK',
        lead: '7 tipuri de exerciții (traducere, particule, conjugare, puzzle, chain), pe cele 6 niveluri TOPIK.',
        steps: [
          'Alege tipul de exercițiu și nivelul TOPIK din butonul de configurare (sus).',
          'Răspunde la fiecare întrebare — primești feedback imediat.',
          'Urmărește badge-urile Mod, Corecte, Total și Streak din antet.',
          'Poți asculta pronunția coreeană la exercițiile care au sunet automat.'
        ]
      },
      en: {
        title: 'TOPIK exercises',
        lead: '7 exercise types (translation, particles, conjugation, puzzle, chain), across all 6 TOPIK levels.',
        steps: [
          'Pick the exercise type and TOPIK level from the settings button (top).',
          'Answer each question — you get instant feedback.',
          'Track the Mode, Correct, Total and Streak badges in the header.',
          'Some exercises play Korean pronunciation automatically.'
        ]
      }
    },
    lessons: {
      ro: {
        title: 'Lecții TOPIK',
        lead: 'Lecții structurate pe niveluri TOPIK 1–6, cu vocabular, gramatică și exemple.',
        steps: [
          'Alege un nivel și o lecție din listă.',
          'Parcurge explicațiile, vocabularul și exemplele lecției.',
          'Treci apoi la Exerciții pentru a fixa ce ai învățat.'
        ]
      },
      en: {
        title: 'TOPIK lessons',
        lead: 'Lessons structured across TOPIK levels 1–6, with vocabulary, grammar and examples.',
        steps: [
          'Pick a level and a lesson from the list.',
          'Go through the explanations, vocabulary and examples.',
          'Then head to Exercises to lock in what you learned.'
        ]
      }
    },
    glossary: {
      ro: {
        title: 'Glosar',
        lead: 'Dicționarul aplicației — tot vocabularul, cu căutare rapidă.',
        steps: [
          'Scrie un cuvânt (coreean sau tradus) în bara de căutare.',
          'Apasă ⭐ pentru a marca un cuvânt ca favorit și a-l regăsi ușor.',
          'Apasă simbolul de sunet pentru a asculta pronunția.'
        ]
      },
      en: {
        title: 'Glossary',
        lead: 'The app’s dictionary — all vocabulary, with quick search.',
        steps: [
          'Type a word (Korean or translated) in the search bar.',
          'Tap ⭐ to mark a word as favorite so you can find it again easily.',
          'Tap the sound icon to hear its pronunciation.'
        ]
      }
    },
    builder: {
      ro: {
        title: 'Constructor de propoziții',
        lead: 'Compune propoziții coreene alegând cuvinte și particule, pas cu pas.',
        steps: [
          'Selectează piesele (subiect, particule, verb etc.) în ordinea corectă.',
          'Aplicația verifică structura gramaticală pe măsură ce alegi.',
          'Vezi traducerea propoziției formate la final.'
        ]
      },
      en: {
        title: 'Sentence builder',
        lead: 'Build Korean sentences by picking words and particles, step by step.',
        steps: [
          'Select the pieces (subject, particles, verb, etc.) in the right order.',
          'The app checks the grammatical structure as you choose.',
          'See the translation of the finished sentence at the end.'
        ]
      }
    },
    hangul: {
      ro: {
        title: 'Hangul — Alfabet',
        lead: 'Învață literele alfabetului coreean și regulile de citire.',
        steps: [
          'Parcurge consoanele și vocalele, ascultând pronunția fiecăreia.',
          'Folosește bara de căutare pentru a găsi o regulă anume de citire.',
          'Exersează recunoașterea literelor înainte de a trece la silabe.'
        ]
      },
      en: {
        title: 'Hangul — Alphabet',
        lead: 'Learn the letters of the Korean alphabet and reading rules.',
        steps: [
          'Go through consonants and vowels, listening to each sound.',
          'Use the search bar to find a specific reading rule.',
          'Practice recognizing letters before moving on to syllables.'
        ]
      }
    },
    'hanja-book': {
      ro: {
        title: 'Hanja',
        lead: 'Carte de referință pentru caracterele chinezești (hanja) folosite în coreeană.',
        steps: [
          'Caută un hanja după citire sau după sens, cu bara de căutare.',
          'Deschide un caracter pentru a vedea ordinea liniilor (stroke order).',
          'Consultă semnificația și cuvintele coreene care îl folosesc.'
        ]
      },
      en: {
        title: 'Hanja',
        lead: 'A reference book for the Chinese characters (hanja) used in Korean.',
        steps: [
          'Search a hanja by reading or by meaning, with the search bar.',
          'Open a character to see its stroke order.',
          'Check its meaning and the Korean words that use it.'
        ]
      }
    },
    writing: {
      ro: {
        title: 'Practică Scrisul',
        lead: 'Exersează scrisul de mână al literelor, silabelor, cuvintelor și propozițiilor.',
        steps: [
          'Alege categoria: Litere, Silabe, Cuvinte sau Propoziții.',
          'Scrie modelul afișat direct pe ecran (deget, mouse sau stylus).',
          'Aplicația evaluează acuratețea; apasă „Următor” sau „Resetează”.'
        ]
      },
      en: {
        title: 'Writing practice',
        lead: 'Practice handwriting letters, syllables, words and sentences.',
        steps: [
          'Pick a category: Letters, Syllables, Words or Sentences.',
          'Write the shown model directly on the screen (finger, mouse or stylus).',
          'The app scores your accuracy; tap "Next" or "Reset".'
        ]
      }
    },
    reading: {
      ro: {
        title: 'Lectură & Speaking',
        lead: 'Texte în coreeană organizate pe niveluri TOPIK, plus antrenament de pronunție.',
        steps: [
          'Tab „Citește": alege nivelul TOPIK, apasă pe cuvinte pentru traducere și salvează-le.',
          'Tab „Antrenament": ascultă o propoziție, înregistrează-te și verifică scorul pronunției.',
          'Provocarea zilnică din Antrenament oferă un bonus de XP.'
        ]
      },
      en: {
        title: 'Reading & Speaking',
        lead: 'Korean texts by TOPIK level, plus pronunciation practice.',
        steps: [
          '"Read" tab: pick a TOPIK level, tap words for translation, save the ones you want.',
          '"Practice" tab: listen to a sentence, record yourself, and check your pronunciation score.',
          'The daily challenge in Practice gives a bonus XP.'
        ]
      }
    },
    listening: {
      ro: {
        title: 'Ascultare',
        lead: 'Exersează înțelegerea audio a limbii coreene.',
        steps: [
          'Apasă play și ascultă înregistrarea.',
          'Răspunde la întrebările de verificare a înțelegerii.',
          'Reascultă oricând ai nevoie, înainte de a răspunde.'
        ]
      },
      en: {
        title: 'Listening',
        lead: 'Practice Korean listening comprehension.',
        steps: [
          'Press play and listen to the recording.',
          'Answer the comprehension questions.',
          'Replay it as many times as you need before answering.'
        ]
      }
    },
    stories: {
      ro: {
        title: 'Povești',
        lead: 'Povești scurte în coreeană, potrivite nivelului tău.',
        steps: [
          'Alege o poveste din listă.',
          'Citește textul, folosind traducerea și vocabularul ca sprijin.',
          'Revino la poveștile citite oricând, pentru recapitulare.'
        ]
      },
      en: {
        title: 'Stories',
        lead: 'Short Korean stories, matched to your level.',
        steps: [
          'Pick a story from the list.',
          'Read the text, using the translation and vocabulary as support.',
          'Come back to stories you’ve read any time, to review.'
        ]
      }
    },
    conversation: {
      ro: {
        title: 'Conversații',
        lead: 'Exersează dialoguri realiste în coreeană.',
        steps: [
          'Parcurge replicile conversației, în ordine.',
          'Ascultă pronunția fiecărei replici.',
          'Alege / completează răspunsul corect pentru a continua dialogul.'
        ]
      },
      en: {
        title: 'Conversations',
        lead: 'Practice realistic Korean dialogues.',
        steps: [
          'Go through the conversation lines, in order.',
          'Listen to the pronunciation of each line.',
          'Pick / complete the correct reply to continue the dialogue.'
        ]
      }
    },
    composition: {
      ro: {
        title: 'Compunere ghidată',
        lead: 'Exersează scrisul liber în coreeană, pornind de la un subiect dat.',
        steps: [
          'Citește cerința / subiectul propus.',
          'Scrie textul tău în caseta de editare.',
          'Trimite compunerea pentru feedback.'
        ]
      },
      en: {
        title: 'Guided composition',
        lead: 'Practice free Korean writing, starting from a given topic.',
        steps: [
          'Read the suggested prompt / topic.',
          'Write your text in the editing box.',
          'Submit your composition for feedback.'
        ]
      }
    },
    flashcards: {
      ro: {
        title: 'Flashcards',
        lead: 'Recapitulează vocabularul cu carduri, folosind repetiție spațiată.',
        steps: [
          'Apasă cardul pentru a vedea traducerea.',
          'Notează dacă ai știut sau nu răspunsul — aplicația reprogramează reapariția cardului.',
          'Marchează cardurile importante ca favorite, pentru recapitulare rapidă.'
        ]
      },
      en: {
        title: 'Flashcards',
        lead: 'Review vocabulary with cards, using spaced repetition.',
        steps: [
          'Tap a card to reveal its translation.',
          'Mark whether you knew the answer — the app reschedules when the card reappears.',
          'Star important cards as favorites, for quick review.'
        ]
      }
    },
    mistakes: {
      ro: {
        title: 'Greșelile Mele',
        lead: 'Greșelile tale din exerciții, salvate automat, ca să le poți repeta.',
        steps: [
          'Parcurge lista greșelilor adunate din celelalte pagini.',
          'Exersează-le din nou, până le stăpânești.',
          'Odată corectate, ele dispar din listă.'
        ]
      },
      en: {
        title: 'My mistakes',
        lead: 'Your exercise mistakes, saved automatically so you can redo them.',
        steps: [
          'Go through the mistakes collected from the other pages.',
          'Practice them again until you’ve mastered them.',
          'Once corrected, they drop off the list.'
        ]
      }
    },
    journal: {
      ro: {
        title: 'Jurnal',
        lead: 'Scrie zilnic în coreeană, ca exercițiu liber.',
        steps: [
          'Notează gânduri, propoziții sau un rezumat al zilei.',
          'Scrie direct în caseta de text — intrările se salvează local.',
          'Recitește intrările vechi pentru a-ți vedea progresul.'
        ]
      },
      en: {
        title: 'Journal',
        lead: 'Write daily in Korean, as a free-writing exercise.',
        steps: [
          'Jot down thoughts, sentences, or a summary of your day.',
          'Type directly in the text box — entries are saved locally.',
          'Reread older entries to see your progress.'
        ]
      }
    },
    stats: {
      ro: {
        title: 'Statistici',
        lead: 'Progresul tău: exerciții rezolvate, acuratețe, streak-uri, evoluție pe niveluri.',
        steps: [
          'Consultă graficele pentru a vedea unde ai nevoie de mai mult exercițiu.',
          'Urmărește streak-ul zilnic ca motivație.',
          'Revino aici periodic, ca reper al progresului.'
        ]
      },
      en: {
        title: 'Statistics',
        lead: 'Your progress: exercises solved, accuracy, streaks, level evolution.',
        steps: [
          'Check the charts to see where you need more practice.',
          'Track your daily streak for motivation.',
          'Come back here regularly, as a progress checkpoint.'
        ]
      }
    },
    today: {
      ro: {
        title: 'Azi — Planificator TOPIK',
        lead: 'Planul tău zilnic de studiu, pe baza progresului și a obiectivului tău.',
        steps: [
          'Configurează obiectivul: nivelul TOPIK țintă și data examenului.',
          'Urmează planul zilnic sugerat de aplicație.',
          'Bifează activitățile terminate pentru a-ți urmări progresul.'
        ]
      },
      en: {
        title: 'Today — TOPIK planner',
        lead: 'Your daily study plan, based on your progress and goal.',
        steps: [
          'Set your goal: target TOPIK level and exam date.',
          'Follow the daily plan the app suggests.',
          'Check off finished activities to track your progress.'
        ]
      }
    },
    'word-context': {
      ro: {
        title: 'Harta Cuvântului',
        lead: 'Explorează contextul de utilizare al unui cuvânt coreean.',
        steps: [
          'Scrie un cuvânt coreean în câmpul de căutare și apasă Enter.',
          'Vezi exemple de utilizare, cuvinte înrudite și pronunția.',
          'Apasă pe un cuvânt înrudit pentru a-l explora mai departe.'
        ]
      },
      en: {
        title: 'Word context map',
        lead: 'Explore the usage context of a Korean word.',
        steps: [
          'Type a Korean word in the search field and press Enter.',
          'See usage examples, related words and pronunciation.',
          'Tap a related word to explore it further.'
        ]
      }
    },
    'word-map': {
      ro: {
        title: 'Constelații',
        lead: 'Hartă vizuală a vocabularului, cu cuvinte grupate după sens.',
        steps: [
          'Explorează harta interactivă, deplasându-te cu mouse-ul/degetul.',
          'Apasă pe un cuvânt pentru detalii și cuvintele lui conexe.',
          'Folosește harta pentru a-ți aminti legăturile dintre cuvinte.'
        ]
      },
      en: {
        title: 'Constellations',
        lead: 'A visual vocabulary map, with words grouped by meaning.',
        steps: [
          'Explore the interactive map by panning with mouse/touch.',
          'Tap a word for details and its related words.',
          'Use the map to remember the connections between words.'
        ]
      }
    },
    'slot-machine': {
      ro: {
        title: 'Slot Machine',
        lead: 'Exersează combinații de cuvinte și particule, în format de joc.',
        steps: [
          'Apasă butonul de spin pentru a genera o combinație nouă.',
          'Verifică dacă propoziția rezultată este corectă gramatical.',
          'Repetă pentru cât mai multe combinații diferite.'
        ]
      },
      en: {
        title: 'Slot machine',
        lead: 'Practice word and particle combinations, in a game format.',
        steps: [
          'Press spin to generate a new combination.',
          'Check whether the resulting sentence is grammatically correct.',
          'Repeat for as many different combinations as you like.'
        ]
      }
    },
    'sentence-formation': {
      ro: {
        title: 'Atelier Propoziții',
        lead: 'Atelier ghidat, pas cu pas, de formare a propozițiilor, pe capitole.',
        steps: [
          'Alege un capitol din meniul „Capitole”.',
          'Parcurge etapele indicate (conjugare, extindere, recapitulare).',
          'Completează exercițiile fiecărei etape pentru a avansa.'
        ]
      },
      en: {
        title: 'Sentence workshop',
        lead: 'A guided, step-by-step sentence-building workshop, by chapter.',
        steps: [
          'Pick a chapter from the "Chapters" menu.',
          'Go through the indicated stages (conjugation, extension, review).',
          'Complete each stage’s exercises to move forward.'
        ]
      }
    },
    exam: {
      ro: {
        title: 'Examen TOPIK',
        lead: 'Simulează un examen TOPIK cronometrat.',
        steps: [
          'Alege nivelul TOPIK și durata examenului.',
          'Citește structura examenului înainte de a începe.',
          'Răspunde la întrebări în timpul alocat, apoi vezi rezultatul și revizuiește greșelile.'
        ]
      },
      en: {
        title: 'TOPIK exam',
        lead: 'Simulate a timed TOPIK exam.',
        steps: [
          'Pick the TOPIK level and exam duration.',
          'Read the exam structure before you start.',
          'Answer within the allotted time, then check your result and review mistakes.'
        ]
      }
    },
    caiet: {
      ro: {
        title: 'Caiet coreean',
        lead: 'Caietul tău personal — vocabular și notițe organizate pe lecții.',
        steps: [
          'Răsfoiește conținutul caietului pentru recapitulare rapidă.',
          'Folosește-l ca sinteză a lecțiilor deja parcurse.'
        ]
      },
      en: {
        title: 'Korean notebook',
        lead: 'Your personal notebook — vocabulary and notes organized by lesson.',
        steps: [
          'Browse the notebook content for a quick review.',
          'Use it as a summary of the lessons you’ve already covered.'
        ]
      }
    },
    'lesson-neural': {
      ro: {
        title: 'Lecție interactivă',
        lead: 'O lecție interactivă unică, cu explicații, exemple și exerciții integrate.',
        steps: [
          'Parcurge secțiunile lecției, în ordine.',
          'Deschide „Command Center” pentru a-ți vedea progresul și insignele.',
          'Completează exercițiile integrate pentru a debloca realizări noi.'
        ]
      },
      en: {
        title: 'Interactive lesson',
        lead: 'A unique interactive lesson, with explanations, examples and built-in exercises.',
        steps: [
          'Go through the lesson sections, in order.',
          'Open "Command Center" to see your progress and badges.',
          'Complete the built-in exercises to unlock new achievements.'
        ]
      }
    }
  };

  function pageKey() {
    var p = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '');
    return p === '' ? 'index' : p;
  }

  function getLang() {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ro';
  }

  var injected = false;
  function injectStyles() {
    if (injected) return;
    injected = true;
    var css = ''
      + '.rk-ph-fab{position:fixed;left:18px;bottom:18px;width:46px;height:46px;border-radius:50%;'
      + 'border:none;cursor:pointer;z-index:100000;display:flex;align-items:center;justify-content:center;'
      + 'font:800 20px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff;'
      + 'background:linear-gradient(135deg,#f472b6,#a855f7,#6366f1);'
      + 'box-shadow:0 8px 24px rgba(88,28,135,.45);transition:transform .15s ease,box-shadow .15s ease;}'
      + '.rk-ph-fab:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 12px 30px rgba(88,28,135,.55);}'
      + '.rk-ph-overlay{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;'
      + 'padding:20px;background:rgba(5,4,16,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}'
      + '.rk-ph-overlay[hidden]{display:none;}'
      + '.rk-ph-card{width:100%;max-width:420px;max-height:85vh;overflow-y:auto;border-radius:20px;'
      + 'background:#16142b;color:#f2f0fb;padding:22px 22px 20px;position:relative;'
      + 'box-shadow:0 24px 60px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);'
      + 'font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}'
      + '.rk-ph-topbar{position:absolute;top:14px;right:14px;display:flex;gap:6px;align-items:center;}'
      + '.rk-ph-langbtn{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#f2f0fb;'
      + 'border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800;cursor:pointer;}'
      + '.rk-ph-langbtn.active{background:linear-gradient(135deg,#f472b6,#a855f7);border-color:transparent;}'
      + '.rk-ph-close{border:none;background:rgba(255,255,255,.08);color:#f2f0fb;width:26px;height:26px;'
      + 'border-radius:50%;cursor:pointer;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;}'
      + '.rk-ph-close:hover{background:rgba(255,255,255,.16);}'
      + '.rk-ph-title{font-size:19px;font-weight:900;margin:0 40px 8px 0;}'
      + '.rk-ph-lead{margin:0 0 14px;color:rgba(242,240,251,.78);}'
      + '.rk-ph-steps{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;}'
      + '.rk-ph-steps li{color:rgba(242,240,251,.92);}'
      + '.rk-ph-ok{margin-top:18px;width:100%;border:none;border-radius:999px;padding:11px 16px;font-weight:900;'
      + 'cursor:pointer;color:#fff;background:linear-gradient(135deg,#f472b6,#a855f7,#6366f1);'
      + 'box-shadow:0 8px 20px rgba(168,85,247,.3);font-size:14px;}'
      + '@media(max-width:480px){.rk-ph-fab{left:12px;bottom:12px;width:42px;height:42px;font-size:18px;}}';
    var style = document.createElement('style');
    style.setAttribute('data-rk-page-help', '');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function render(overlay, key, lang) {
    var data = CONTENT[key][lang] || CONTENT[key].ro;
    var stepsHtml = data.steps.map(function (s) {
      return '<li>' + s + '</li>';
    }).join('');
    overlay.innerHTML = ''
      + '<div class="rk-ph-card" role="dialog" aria-modal="true" aria-label="' + data.title + '">'
      + '  <div class="rk-ph-topbar">'
      + '    <button type="button" class="rk-ph-langbtn' + (lang === 'ro' ? ' active' : '') + '" data-rk-lang="ro">ro</button>'
      + '    <button type="button" class="rk-ph-langbtn' + (lang === 'en' ? ' active' : '') + '" data-rk-lang="en">en</button>'
      + '    <button type="button" class="rk-ph-close" data-rk-close aria-label="' + (lang === 'ro' ? 'Închide' : 'Close') + '">✕</button>'
      + '  </div>'
      + '  <p class="rk-ph-title">' + data.title + '</p>'
      + '  <p class="rk-ph-lead">' + data.lead + '</p>'
      + '  <ul class="rk-ph-steps">' + stepsHtml + '</ul>'
      + '  <button type="button" class="rk-ph-ok" data-rk-close>' + (lang === 'ro' ? 'Am înțeles' : 'Got it') + '</button>'
      + '</div>';
  }

  function openHelp(key) {
    injectStyles();
    var overlay = document.querySelector('.rk-ph-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'rk-ph-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeHelp(overlay);
      });
      overlay.addEventListener('click', function (e) {
        var langBtn = e.target.closest('[data-rk-lang]');
        if (langBtn) {
          var lang = langBtn.getAttribute('data-rk-lang');
          localStorage.setItem(LANG_KEY, lang);
          render(overlay, key, lang);
          return;
        }
        if (e.target.closest('[data-rk-close]')) closeHelp(overlay);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeHelp(overlay);
      });
    }
    render(overlay, key, getLang());
    overlay.removeAttribute('hidden');
  }

  function closeHelp(overlay) {
    overlay.setAttribute('hidden', '');
  }

  function init() {
    var key = pageKey();
    if (!CONTENT[key]) return;
    injectStyles();

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'rk-ph-fab';
    fab.setAttribute('aria-label', getLang() === 'ro' ? 'Instrucțiuni pagină' : 'Page instructions');
    fab.textContent = '?';
    fab.addEventListener('click', function () { openHelp(key); });
    document.body.appendChild(fab);

    var seenKey = SEEN_PREFIX + key;
    if (!localStorage.getItem(seenKey)) {
      localStorage.setItem(seenKey, '1');
      openHelp(key);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
