/**
 * ============================================
 * ENGLISH WITH COLOMBIA – script.js
 * Interactive grammar learning for kids (7–8)
 * Features: Matching, Multiple Choice, Unscramble,
 *           Reading, Listening (SpeechSynthesis),
 *           Writing, Gamification & Confetti
 * ============================================
 */

/* ==========================================
   GLOBAL STATE
========================================== */
let totalStars  = 0;   // Stars earned
let totalPoints = 0;   // Points earned
let currentVoice = null; // For SpeechSynthesis

/* ==========================================
   WELCOME SCREEN → START
========================================== */
function startLearning() {
  document.getElementById('welcome-screen').classList.remove('active');
  document.getElementById('welcome-screen').style.display = 'none';

  const app = document.getElementById('main-app');
  app.classList.remove('hidden');

  // Initialize all game modules
  initMatchingGame();
  initMCGame();
  initUnscrambleGame();
  initReadingQuestions();
  initListeningSection();
  initWritingSection();

  // Try to preload a voice for speech
  loadVoices();
}

/* ==========================================
   SECTION / TAB NAVIGATION
========================================== */
function showSection(id, btn) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  // Deactivate all tabs
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));

  // Show chosen section
  const section = document.getElementById(id);
  if (section) section.classList.add('active');

  // Activate chosen tab
  if (btn) btn.classList.add('active');
}

function showGame(id, btn) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById(id + '-game');
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ==========================================
   SCORE & GAMIFICATION
========================================== */
function addPoints(pts, stars) {
  totalPoints += pts;
  totalStars  += stars;

  // Update UI
  document.getElementById('star-count').textContent  = totalStars;
  document.getElementById('point-count').textContent = totalPoints;
  document.getElementById('star-count-welcome').textContent = totalStars;

  // Celebratory feedback
  if (stars > 0) {
    showSuccessOverlay(stars >= 2 ? '🌟' : '⭐', stars >= 2 ? 'Excellent!' : 'Correct!');
    if (totalStars % 5 === 0) launchFireworks();
  }
}

function showSuccessOverlay(emoji, text) {
  const overlay = document.getElementById('success-overlay');
  document.getElementById('success-emoji').textContent = emoji;
  document.getElementById('success-text').textContent  = text;

  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';

  // Auto-hide after 1.2 seconds
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.style.display = '';
  }, 1200);
}

/* ==========================================
   CONFETTI / FIREWORKS
========================================== */
function launchFireworks() {
  const container = document.getElementById('fireworks');
  container.classList.remove('hidden');
  container.style.display = 'block';
  container.innerHTML = '';

  const colors = ['#FFD100','#CE1126','#003087','#2ECC71','#FF7F00','#9B59B6','#FF6B9D'];
  const shapes = ['■','●','▲','★','♦'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(piece);
  }

  setTimeout(() => {
    container.classList.add('hidden');
    container.style.display = '';
    container.innerHTML = '';
  }, 3500);
}

/* ==========================================
   RESET EVERYTHING
========================================== */
function resetAll() {
  if (!confirm('Reset all your progress and start again? 🔄')) return;
  totalStars  = 0;
  totalPoints = 0;
  document.getElementById('star-count').textContent  = 0;
  document.getElementById('point-count').textContent = 0;
  initMatchingGame();
  initMCGame();
  initUnscrambleGame();
  initReadingQuestions();
  initListeningSection();
  initWritingSection();
  showSection('grammar-explain', document.querySelector('.tab-btn:first-child'));
}

/* ==========================================
   ===== GAME 1: MATCHING GAME =====
   Pairs: sentence ↔ emoji picture
========================================== */

// Each pair: { id, sentence, image, emoji description }
const matchingPairs = [
  { id: 1, sentence: "The girl drinks chocolate.", image: "👧☕", type: 'simple' },
  { id: 2, sentence: "The girl is drinking chocolate.", image: "👧🍵✨", type: 'continuous' },
  { id: 3, sentence: "The monkey climbs trees.", image: "🐒🌳", type: 'simple' },
  { id: 4, sentence: "The monkey is climbing a tree.", image: "🐒🌿⬆️", type: 'continuous' },
  { id: 5, sentence: "Colombians eat arepas.", image: "🇨🇴🫓", type: 'simple' },
  { id: 6, sentence: "Mateo is eating an arepa.", image: "🧒🫓😋", type: 'continuous' },
];

let matchingSelected = null;  // Currently clicked sentence card ID
let matchedPairs     = [];    // IDs of successfully matched pairs
let matchScore       = 0;
let matchAttempts    = 0;

function initMatchingGame() {
  matchingSelected = null;
  matchedPairs = [];
  matchScore   = 0;
  matchAttempts = 0;

  // Shuffle the image array separately to create the puzzle
  const shuffledImages = [...matchingPairs].sort(() => Math.random() - 0.5);

  const container = document.getElementById('matching-container');
  container.innerHTML = `
    <div class="matching-column sentences-col">
      <div class="matching-column-title">📝 Sentences</div>
      ${matchingPairs.map(p => `
        <div class="match-card match-sentence" id="sent-${p.id}" onclick="matchSelect('sent', ${p.id})">
          ${p.sentence}
        </div>
      `).join('')}
    </div>
    <div class="matching-column images-col">
      <div class="matching-column-title">🖼️ Pictures</div>
      ${shuffledImages.map(p => `
        <div class="match-card match-image" id="img-${p.id}" onclick="matchSelect('img', ${p.id})">
          ${p.image}
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('matching-feedback').textContent = '';
  document.getElementById('matching-feedback').className = 'game-feedback';
  updateMatchScore();
}

function matchSelect(type, id) {
  if (matchedPairs.includes(id)) return; // Already matched

  if (type === 'sent') {
    // Deselect any previously selected sentence
    if (matchingSelected && matchingSelected.type === 'sent') {
      document.getElementById(`sent-${matchingSelected.id}`).classList.remove('selected');
    }

    if (matchingSelected && matchingSelected.type === 'img') {
      // We have an image selected and now selected a sentence → try to match
      tryMatch(id, matchingSelected.id);
    } else {
      matchingSelected = { type: 'sent', id };
      document.getElementById(`sent-${id}`).classList.add('selected');
    }

  } else { // type === 'img'
    if (matchingSelected && matchingSelected.type === 'img') {
      document.getElementById(`img-${matchingSelected.id}`).classList.remove('selected');
    }

    if (matchingSelected && matchingSelected.type === 'sent') {
      // We have a sentence selected, now an image → try to match
      tryMatch(matchingSelected.id, id);
    } else {
      matchingSelected = { type: 'img', id };
      document.getElementById(`img-${id}`).classList.add('selected');
    }
  }
}

function tryMatch(sentId, imgId) {
  matchAttempts++;
  matchingSelected = null;

  const sentCard = document.getElementById(`sent-${sentId}`);
  const imgCard  = document.getElementById(`img-${imgId}`);

  sentCard.classList.remove('selected');
  imgCard.classList.remove('selected');

  if (sentId === imgId) {
    // ✅ Correct match!
    matchedPairs.push(sentId);
    sentCard.classList.add('matched');
    imgCard.classList.add('matched');
    matchScore++;
    addPoints(10, 1);
    showFeedback('matching-feedback', '✅ Great match! Well done! 🎉', 'correct');

    if (matchedPairs.length === matchingPairs.length) {
      setTimeout(() => {
        showFeedback('matching-feedback', '🏆 Amazing! You matched all of them! You are a STAR! ⭐⭐⭐', 'correct');
        addPoints(20, 2);
        launchFireworks();
      }, 600);
    }
  } else {
    // ❌ Wrong match
    sentCard.classList.add('wrong');
    imgCard.classList.add('wrong');
    showFeedback('matching-feedback', '❌ Not quite! Try again! 💪', 'wrong');
    setTimeout(() => {
      sentCard.classList.remove('wrong');
      imgCard.classList.remove('wrong');
    }, 800);
  }
  updateMatchScore();
}

function updateMatchScore() {
  document.getElementById('matching-score').textContent =
    `Matched: ${matchScore} / ${matchingPairs.length}`;
}

/* ==========================================
   ===== GAME 2: MULTIPLE CHOICE =====
========================================== */

const mcQuestions = [
  {
    context: "🌅 Every day / Routine",
    sentence: "The toucan _____ in the jungle.",
    options: ["live", "lives", "is living"],
    correct: 1,
    emoji: "🦜",
    explanation: "We use 'lives' (Present Simple) because it's a fact about where the toucan always lives!"
  },
  {
    context: "🎬 Right now!",
    sentence: "Look! Sofía _____ cumbia!",
    options: ["dances", "dance", "is dancing"],
    correct: 2,
    emoji: "💃",
    explanation: "We use 'is dancing' (Present Continuous) because Sofía is doing it right now!"
  },
  {
    context: "🌅 Every day / Routine",
    sentence: "Colombians _____ coffee every morning.",
    options: ["drinks", "drink", "are drinking"],
    correct: 1,
    emoji: "☕",
    explanation: "We use 'drink' (Present Simple) because this is something Colombians do every day!"
  },
  {
    context: "🎬 Right now!",
    sentence: "The farmer _____ coffee beans.",
    options: ["picks", "pick", "is picking"],
    correct: 2,
    emoji: "👨‍🌾",
    explanation: "We use 'is picking' (Present Continuous) because the farmer is doing it at this moment!"
  },
  {
    context: "🌅 Every day / Routine",
    sentence: "Mateo _____ football every day.",
    options: ["play", "plays", "is playing"],
    correct: 1,
    emoji: "⚽",
    explanation: "We use 'plays' (Present Simple with -s for he/she/it) for his daily routine!"
  },
  {
    context: "🎬 Right now!",
    sentence: "The children _____ in the Amazonas river.",
    options: ["swim", "swims", "are swimming"],
    correct: 2,
    emoji: "🏊",
    explanation: "We use 'are swimming' (Present Continuous) because they are doing it right now!"
  },
  {
    context: "🌅 Every day / Routine",
    sentence: "The jaguar _____ in the jungle.",
    options: ["live", "lives", "is living"],
    correct: 1,
    emoji: "🐆",
    explanation: "We use 'lives' (Present Simple) because this is a fact about the jaguar!"
  },
  {
    context: "🎬 Right now!",
    sentence: "Look at the picture! The monkey _____ a banana.",
    options: ["eats", "eat", "is eating"],
    correct: 2,
    emoji: "🐒",
    explanation: "We use 'is eating' (Present Continuous) because the monkey is eating it at this moment!"
  },
];

let mcCurrentIndex = 0;
let mcScore        = 0;
let mcAnswered     = false;

function initMCGame() {
  mcCurrentIndex = 0;
  mcScore        = 0;
  mcAnswered     = false;
  renderMCQuestion();
}

function renderMCQuestion() {
  const q = mcQuestions[mcCurrentIndex];
  const container = document.getElementById('mc-container');

  container.innerHTML = `
    <div class="mc-question-card">
      <div class="mc-context">${q.context}</div>
      <span class="mc-image-hint">${q.emoji}</span>
      <div class="mc-question">${q.sentence}</div>
      <div class="mc-options">
        ${q.options.map((opt, i) => `
          <button class="mc-btn" onclick="checkMC(${i})" id="mc-opt-${i}">
            ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('mc-feedback').textContent = '';
  document.getElementById('mc-feedback').className = 'game-feedback';
  document.getElementById('mc-score').textContent =
    `Question: ${mcCurrentIndex + 1} / ${mcQuestions.length}`;
}

function checkMC(chosenIndex) {
  if (mcAnswered) return; // Prevent double answering
  mcAnswered = true;

  const q = mcQuestions[mcCurrentIndex];
  const buttons = document.querySelectorAll('.mc-btn');
  buttons.forEach(b => b.disabled = true);

  if (chosenIndex === q.correct) {
    // ✅ Correct
    buttons[chosenIndex].classList.add('correct');
    mcScore++;
    addPoints(10, 1);
    showFeedback('mc-feedback', `✅ Correct! ${q.explanation}`, 'correct');
  } else {
    // ❌ Wrong
    buttons[chosenIndex].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    showFeedback('mc-feedback', `❌ Not quite! ${q.explanation}`, 'wrong');
  }

  // Auto-advance after 2.5 seconds
  setTimeout(() => {
    mcCurrentIndex++;
    mcAnswered = false;
    if (mcCurrentIndex < mcQuestions.length) {
      renderMCQuestion();
    } else {
      // Game over
      const container = document.getElementById('mc-container');
      const percent = Math.round((mcScore / mcQuestions.length) * 100);
      const medal = percent >= 90 ? '🥇' : percent >= 70 ? '🥈' : percent >= 50 ? '🥉' : '💪';
      container.innerHTML = `
        <div style="text-align:center; padding: 30px;">
          <div style="font-size:5rem; margin-bottom:16px;">${medal}</div>
          <h3 style="font-family:var(--font-head); font-size:2rem; color:var(--col-blue); margin-bottom:12px;">
            ${percent >= 70 ? 'Fantastic!' : 'Keep Practicing!'}
          </h3>
          <p style="font-size:1.2rem; color:#555;">
            You got <strong>${mcScore} out of ${mcQuestions.length}</strong> correct! (${percent}%)
          </p>
        </div>
      `;
      document.getElementById('mc-feedback').textContent = '';
      if (percent >= 70) { addPoints(20, 2); launchFireworks(); }
    }
  }, 2500);
}

/* ==========================================
   ===== GAME 3: UNSCRAMBLE =====
========================================== */

const unscrambleSentences = [
  {
    words: ['she', 'is', 'dancing', 'cumbia'],
    correct: 'she is dancing cumbia',
    emoji: '💃',
    hint: 'A girl is dancing right now!'
  },
  {
    words: ['Mateo', 'plays', 'football', 'every', 'day'],
    correct: 'Mateo plays football every day',
    emoji: '⚽',
    hint: 'This is Mateo\'s routine!'
  },
  {
    words: ['the', 'farmer', 'is', 'picking', 'coffee'],
    correct: 'the farmer is picking coffee',
    emoji: '👨‍🌾',
    hint: 'The farmer is doing this right now!'
  },
  {
    words: ['Colombians', 'drink', 'coffee', 'every', 'morning'],
    correct: 'Colombians drink coffee every morning',
    emoji: '☕',
    hint: 'This is a daily habit in Colombia!'
  },
  {
    words: ['the', 'toucan', 'is', 'flying', 'over', 'the', 'jungle'],
    correct: 'the toucan is flying over the jungle',
    emoji: '🦜',
    hint: 'The toucan is flying right now!'
  },
  {
    words: ['the', 'monkey', 'climbs', 'trees', 'in', 'the', 'Amazonas'],
    correct: 'the monkey climbs trees in the Amazonas',
    emoji: '🐒',
    hint: 'This is what monkeys usually do!'
  },
];

let unscrambleIndex  = 0;
let unscrambleScore  = 0;
let answerWords      = [];  // Words placed in answer zone (objects with value & original index)
let bankWords        = [];  // Words remaining in word bank

function initUnscrambleGame() {
  unscrambleIndex = 0;
  unscrambleScore = 0;
  renderUnscrambleQuestion();
}

function renderUnscrambleQuestion() {
  const q = unscrambleSentences[unscrambleIndex];
  answerWords = [];
  // Shuffle the word bank
  bankWords = [...q.words].map((w, i) => ({ value: w, id: i }))
    .sort(() => Math.random() - 0.5);

  const container = document.getElementById('unscramble-container');
  container.innerHTML = `
    <div class="unscramble-question">${q.hint}</div>
    <span class="unscramble-emoji">${q.emoji}</span>
    <div class="answer-zone-label">👆 Click words to build your sentence:</div>
    <div class="answer-zone" id="answer-zone"></div>
    <div class="answer-zone-label">📦 Word Bank – click to add words:</div>
    <div class="word-bank" id="word-bank"></div>
    <button class="btn-check-unscramble" onclick="checkUnscramble()">✅ Check My Answer!</button>
  `;

  renderUnscrambleWords();

  document.getElementById('unscramble-feedback').textContent = '';
  document.getElementById('unscramble-feedback').className = 'game-feedback';
  document.getElementById('unscramble-score').textContent =
    `Question: ${unscrambleIndex + 1} / ${unscrambleSentences.length}`;
}

function renderUnscrambleWords() {
  const bankContainer   = document.getElementById('word-bank');
  const answerContainer = document.getElementById('answer-zone');

  bankContainer.innerHTML = bankWords.map(w =>
    `<button class="word-chip" onclick="addWordToAnswer(${w.id})">${w.value}</button>`
  ).join('');

  answerContainer.innerHTML = answerWords.length === 0
    ? '<span style="color:#aaa; font-style:italic; font-size:0.9rem;">Your sentence will appear here...</span>'
    : answerWords.map(w =>
        `<button class="word-chip in-answer" onclick="removeWordFromAnswer(${w.id})">${w.value}</button>`
      ).join('');
}

function addWordToAnswer(wordId) {
  const idx = bankWords.findIndex(w => w.id === wordId);
  if (idx === -1) return;
  const word = bankWords.splice(idx, 1)[0];
  answerWords.push(word);
  renderUnscrambleWords();
}

function removeWordFromAnswer(wordId) {
  const idx = answerWords.findIndex(w => w.id === wordId);
  if (idx === -1) return;
  const word = answerWords.splice(idx, 1)[0];
  bankWords.push(word);
  renderUnscrambleWords();
}

function checkUnscramble() {
  const q = unscrambleSentences[unscrambleIndex];

  if (answerWords.length === 0) {
    showFeedback('unscramble-feedback', '⚠️ Please build your sentence first! Click the words!', 'wrong');
    return;
  }

  const attempt = answerWords.map(w => w.value).join(' ').toLowerCase().trim();
  const correct  = q.correct.toLowerCase().trim();

  if (attempt === correct) {
    // ✅ Correct!
    unscrambleScore++;
    addPoints(15, 1);
    showFeedback('unscramble-feedback', `✅ Perfect! "${q.correct}" 🎉`, 'correct');

    setTimeout(() => {
      unscrambleIndex++;
      if (unscrambleIndex < unscrambleSentences.length) {
        renderUnscrambleQuestion();
      } else {
        const container = document.getElementById('unscramble-container');
        container.innerHTML = `
          <div style="text-align:center; padding: 30px;">
            <div style="font-size: 5rem; margin-bottom: 16px;">🏆</div>
            <h3 style="font-family:var(--font-head); font-size:2rem; color:var(--col-blue);">
              You finished all sentences!
            </h3>
            <p style="font-size:1.1rem; color:#555; margin-top:12px;">
              Score: <strong>${unscrambleScore} / ${unscrambleSentences.length}</strong>
            </p>
          </div>
        `;
        document.getElementById('unscramble-feedback').textContent = '';
        addPoints(25, 3);
        launchFireworks();
      }
    }, 2000);
  } else {
    showFeedback('unscramble-feedback', `❌ Not quite! Check the word order and try again! 💪`, 'wrong');
  }
}

/* ==========================================
   ===== READING SECTION =====
========================================== */

const readingQs = [
  {
    question: "🏙️ Where does Mateo live?",
    options: ["Cartagena", "Bogotá", "Amazonas", "Medellín"],
    correct: 1
  },
  {
    question: "☕ What is the farmer doing in the story?",
    options: ["Drinking coffee", "Eating arepas", "Picking coffee beans", "Dancing cumbia"],
    correct: 2
  },
  {
    question: "🦜 Which animal does Sofía photograph?",
    options: ["Jaguar", "Monkey", "Frog", "Toucan"],
    correct: 3
  }
];

let readingAnswers = [null, null, null];

function initReadingQuestions() {
  readingAnswers = [null, null, null];
  const container = document.getElementById('reading-questions');

  container.innerHTML = readingQs.map((q, qi) => `
    <div class="reading-q-item" id="rq-${qi}">
      <p>${q.question}</p>
      <div class="reading-options">
        ${q.options.map((opt, oi) => `
          <button class="reading-opt-btn" id="ropt-${qi}-${oi}" onclick="selectReadingOpt(${qi}, ${oi})">
            ${String.fromCharCode(65 + oi)}. ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('reading-feedback').textContent = '';
  document.getElementById('reading-feedback').style.background = '';
}

function selectReadingOpt(qi, oi) {
  // Deselect previous
  for (let o = 0; o < readingQs[qi].options.length; o++) {
    document.getElementById(`ropt-${qi}-${o}`).classList.remove('selected');
  }
  document.getElementById(`ropt-${qi}-${oi}`).classList.add('selected');
  readingAnswers[qi] = oi;
}

function checkReadingAnswers() {
  let correct = 0;

  readingQs.forEach((q, qi) => {
    for (let o = 0; o < q.options.length; o++) {
      const btn = document.getElementById(`ropt-${qi}-${o}`);
      btn.disabled = true;
      btn.classList.remove('selected');
      if (o === q.correct) btn.classList.add('correct');
    }

    if (readingAnswers[qi] === q.correct) {
      correct++;
    } else if (readingAnswers[qi] !== null) {
      document.getElementById(`ropt-${qi}-${readingAnswers[qi]}`).classList.add('wrong');
    }
  });

  const feedback = document.getElementById('reading-feedback');
  const pct = Math.round((correct / readingQs.length) * 100);

  if (correct === readingQs.length) {
    feedback.textContent = `🏆 Perfect! You answered all ${readingQs.length} questions correctly! Incredible reader! ⭐⭐⭐`;
    feedback.style.background = '#e8ffe8';
    feedback.style.color      = '#1a9e55';
    feedback.style.border     = '2px solid #2ecc71';
    feedback.style.padding    = '14px';
    feedback.style.borderRadius = '12px';
    addPoints(30, 3);
    launchFireworks();
  } else {
    feedback.textContent = `You got ${correct} / ${readingQs.length} correct (${pct}%). Read the story again and try harder! 💪`;
    feedback.style.background = pct >= 50 ? '#fff3cc' : '#ffe8e8';
    feedback.style.color      = pct >= 50 ? '#996600' : '#cc0000';
    feedback.style.border     = `2px solid ${pct >= 50 ? '#ffd54f' : '#e57373'}`;
    feedback.style.padding    = '14px';
    feedback.style.borderRadius = '12px';
    if (correct > 0) addPoints(correct * 10, correct);
  }
}

/* ==========================================
   ===== LISTENING SECTION (SpeechSynthesis API) =====
========================================== */

const listeningSentences = [
  { text: "Colombians drink coffee.",               type: 'simple',     emoji: '☕' },
  { text: "The monkey climbs trees.",               type: 'simple',     emoji: '🐒' },
  { text: "Mateo plays football every day.",        type: 'simple',     emoji: '⚽' },
  { text: "The toucan lives in the jungle.",        type: 'simple',     emoji: '🦜' },
  { text: "Sofía eats arepas for breakfast.",       type: 'simple',     emoji: '🫓' },
  { text: "The monkey is climbing a tree.",         type: 'continuous', emoji: '🐒' },
  { text: "The children are playing football.",     type: 'continuous', emoji: '⚽' },
  { text: "The farmer is picking coffee beans.",    type: 'continuous', emoji: '👨‍🌾' },
  { text: "Sofía is dancing cumbia right now.",     type: 'continuous', emoji: '💃' },
  { text: "The girl is drinking hot chocolate.",    type: 'continuous', emoji: '🍵' },
];

let listenCurrentIndex = 0;
let listenPlayed       = new Set();

function initListeningSection() {
  listenCurrentIndex = 0;
  listenPlayed.clear();
  renderListenSentence();
  renderListenThumbs();
  document.getElementById('listen-type-feedback').textContent = '';
}

function renderListenSentence() {
  const s = listeningSentences[listenCurrentIndex];

  const badge = document.getElementById('listening-type-badge');
  badge.textContent = s.type === 'simple' ? '🌅 Present Simple' : '🎬 Present Continuous';
  badge.className   = 'listening-type-badge' + (s.type === 'continuous' ? ' continuous' : '');
  // Hide the type so students must guess (revealed on check)
  badge.style.opacity = '0';

  document.getElementById('listening-sentence').textContent = `${s.emoji} Listen carefully!`;
  document.getElementById('listen-current').textContent = listenCurrentIndex + 1;
  document.getElementById('listen-total').textContent   = listeningSentences.length;

  document.getElementById('listen-type-feedback').textContent = '';
}

function renderListenThumbs() {
  const grid = document.getElementById('listening-sentences-grid');
  grid.innerHTML = listeningSentences.map((s, i) => `
    <div class="listen-thumb ${i === listenCurrentIndex ? 'current' : ''} ${listenPlayed.has(i) ? 'played' : ''}"
         onclick="jumpToListen(${i})">
      ${s.emoji}<br/>${i + 1}
    </div>
  `).join('');
}

function loadVoices() {
  // Try to get English voice for SpeechSynthesis
  const tryLoad = () => {
    const voices = window.speechSynthesis.getVoices();
    currentVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0]
      || null;
  };
  tryLoad();
  window.speechSynthesis.onvoiceschanged = tryLoad;
}

function speakText(text) {
  if (!window.speechSynthesis) {
    alert('Sorry, your browser does not support text-to-speech. Try Chrome or Edge!');
    return;
  }
  window.speechSynthesis.cancel(); // Stop any current speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate   = 0.85;   // Slightly slower for kids
  utterance.pitch  = 1.1;    // Slightly higher pitch for clarity
  utterance.volume = 1;
  if (currentVoice) utterance.voice = currentVoice;

  // Button animation
  const playBtn = document.getElementById('btn-play');
  if (playBtn) {
    playBtn.textContent = '🔊 Playing...';
    playBtn.classList.add('playing');
    utterance.onend = () => {
      playBtn.textContent = '▶️ Play';
      playBtn.classList.remove('playing');
    };
  }

  window.speechSynthesis.speak(utterance);
}

function playCurrent() {
  const s = listeningSentences[listenCurrentIndex];
  // Show the sentence text while playing
  document.getElementById('listening-sentence').textContent = `${s.emoji} ${s.text}`;
  listenPlayed.add(listenCurrentIndex);
  renderListenThumbs();
  speakText(s.text);
}

function repeatCurrent() {
  playCurrent();
}

function nextListening() {
  if (listenCurrentIndex < listeningSentences.length - 1) {
    listenCurrentIndex++;
  } else {
    listenCurrentIndex = 0; // Loop back
  }
  renderListenSentence();
  renderListenThumbs();
}

function jumpToListen(index) {
  listenCurrentIndex = index;
  renderListenSentence();
  renderListenThumbs();
}

function checkListenType(guessedType) {
  const s        = listeningSentences[listenCurrentIndex];
  const feedback = document.getElementById('listen-type-feedback');
  const badge    = document.getElementById('listening-type-badge');

  // Reveal badge
  badge.style.opacity = '1';

  if (guessedType === s.type) {
    feedback.textContent = `✅ Correct! This is ${s.type === 'simple' ? 'Present Simple 🌅' : 'Present Continuous 🎬'}! Great listening! 🎉`;
    feedback.style.color = '#1a9e55';
    addPoints(5, 1);
  } else {
    feedback.textContent = `❌ Not quite! This is ${s.type === 'simple' ? 'Present Simple 🌅 (routine/fact)' : 'Present Continuous 🎬 (happening now)'}. Listen again!`;
    feedback.style.color = '#cc0000';
  }
}

/* ==========================================
   ===== WRITING SECTION =====
========================================== */

const writingPictures = [
  {
    scene: ['👦', '👦', '⚽'],
    caption: 'Two boys on a football field in Bogotá',
    expected: 'The boys are playing football.',
    keywords: ['playing', 'football', 'boys', 'are'],
    hint: 'Tip: "The boys are playing football."'
  },
  {
    scene: ['👧', '💃', '🎶'],
    caption: 'A girl dancing cumbia at a festival in Cartagena',
    expected: 'The girl is dancing cumbia.',
    keywords: ['dancing', 'cumbia', 'girl', 'is'],
    hint: 'Tip: "The girl is dancing cumbia."'
  },
  {
    scene: ['🦜', '🌿', '🌳'],
    caption: 'A colorful toucan in the Amazon jungle',
    expected: 'The toucan is flying in the jungle.',
    keywords: ['toucan', 'flying', 'jungle', 'is'],
    hint: 'Tip: "The toucan is flying in the jungle."'
  },
  {
    scene: ['👨‍🌾', '☕', '🌱'],
    caption: 'A farmer at a coffee farm in the Andes mountains',
    expected: 'The farmer is picking coffee.',
    keywords: ['farmer', 'picking', 'coffee', 'is'],
    hint: 'Tip: "The farmer is picking coffee."'
  },
];

let currentPictureIndex = 0;

function initWritingSection() {
  currentPictureIndex = 0;
  selectPicture(0, document.querySelector('.pic-btn'));
  document.getElementById('student-sentence').value = '';
  const fb = document.getElementById('writing-feedback');
  fb.classList.add('hidden');
  fb.classList.remove('show-correct');
}

function selectPicture(index, btn) {
  currentPictureIndex = index;
  const pic = writingPictures[index];

  // Update active button
  document.querySelectorAll('.pic-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Update picture display
  const display = document.getElementById('picture-display');
  display.innerHTML = `
    <div class="picture-scene">${pic.scene.join(' ')}</div>
    <div class="picture-caption">📍 ${pic.caption}</div>
  `;

  // Reset writing area
  document.getElementById('student-sentence').value = '';
  const fb = document.getElementById('writing-feedback');
  fb.classList.add('hidden');
  fb.classList.remove('show-correct');
}

function checkWriting() {
  const pic      = writingPictures[currentPictureIndex];
  const input    = document.getElementById('student-sentence').value.trim().toLowerCase();
  const feedback = document.getElementById('writing-feedback');

  feedback.classList.remove('hidden', 'show-correct');

  // Check if student used key words related to present continuous
  const hasVerb   = input.includes('ing');
  const hasIsAre  = input.includes(' is ') || input.includes(' are ') || input.startsWith('is ') || input.startsWith('are ');
  const hasKeyword = pic.keywords.some(kw => input.includes(kw.toLowerCase()));

  feedback.classList.add('show-correct');

  if (hasVerb && hasIsAre && hasKeyword) {
    feedback.innerHTML = `
      <strong>🌟 Wonderful sentence! You used Present Continuous correctly!</strong><br/>
      Your sentence: "<em>${document.getElementById('student-sentence').value}</em>"<br/>
      <span style="color:#888;">Example answer: "${pic.expected}"</span>
    `;
    addPoints(15, 2);
  } else if (hasVerb || hasIsAre) {
    feedback.innerHTML = `
      <strong>💪 Good try! You're on the right track!</strong><br/>
      Remember: Subject + <strong>is/are</strong> + Verb<strong>-ing</strong><br/>
      <span style="color:#888;">${pic.hint}</span>
    `;
    addPoints(5, 0);
  } else {
    feedback.innerHTML = `
      <strong>📝 Let's try again! Here's a hint:</strong><br/>
      Use <strong>is/are + verb-ing</strong> for Present Continuous!<br/>
      <span style="color:#888;">${pic.hint}</span>
    `;
  }
}

function speakStudentSentence() {
  const sentence = document.getElementById('student-sentence').value.trim();
  if (!sentence) {
    alert('Please write a sentence first! ✍️');
    return;
  }
  speakText(sentence);
}

/* ==========================================
   SHARED HELPERS
========================================== */

function showFeedback(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className   = `game-feedback ${type}`;
}

/* ==========================================
   INIT on DOM load
   (Welcome screen handles main init)
========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load voices as soon as DOM is ready
  loadVoices();

  // Ensure welcome screen is shown
  document.getElementById('welcome-screen').classList.add('active');
  document.getElementById('main-app').classList.add('hidden');
});
