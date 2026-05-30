// Class 7 English Coach · Honeycomb Academy
// Core Application Logic, Interactive Engine, and Local Storage System

import { GRAMMAR_CHAPTERS } from './data.js';
import { generateQuestion } from './generators.js';

// Sound Synthesizer via Web Audio API
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('coach_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('coach_muted', this.muted);
    return this.muted;
  }

  playTone(freq, type, duration, delay = 0) {
    if (this.muted) return;
    this.init();
    
    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn("Audio Context failed to play:", e);
      }
    }, delay * 1000);
  }

  playCorrect() {
    this.playTone(523.25, "sine", 0.15, 0); // C5
    this.playTone(659.25, "sine", 0.25, 0.08); // E5
  }

  playIncorrect() {
    this.playTone(220, "triangle", 0.3); // A3
  }

  playSuccessMelody() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
    notes.forEach((freq, idx) => {
      this.playTone(freq, "sine", 0.25, idx * 0.08);
    });
  }
}

const synth = new AudioSynth();

// Application State
const STATE = {
  theme: localStorage.getItem('coach_theme') || 'dark',
  streak: parseInt(localStorage.getItem('coach_streak')) || 0,
  lastPracticeDate: localStorage.getItem('coach_last_date') || null,
  totalSolved: parseInt(localStorage.getItem('coach_total_solved')) || 0,
  totalCorrect: parseInt(localStorage.getItem('coach_total_correct')) || 0,
  chapterProgress: JSON.parse(localStorage.getItem('coach_chapter_progress')) || {}, // { chapterId: { solved: 0, correct: 0, completedDifficulties: [] } }
  
  // Active session parameters
  activeSession: null // { chapterId, questions: [], currentIdx: 0, difficulty: 'Basic', answers: [] }
};

// Sync localStorage
function saveState() {
  localStorage.setItem('coach_streak', STATE.streak);
  localStorage.setItem('coach_last_date', STATE.lastPracticeDate);
  localStorage.setItem('coach_total_solved', STATE.totalSolved);
  localStorage.setItem('coach_total_correct', STATE.totalCorrect);
  localStorage.setItem('coach_chapter_progress', JSON.stringify(STATE.chapterProgress));
}

// Reset All Data
function resetData() {
  if (confirm("Are you sure you want to reset all your progress, stats, and streaks?")) {
    localStorage.clear();
    STATE.streak = 0;
    STATE.lastPracticeDate = null;
    STATE.totalSolved = 0;
    STATE.totalCorrect = 0;
    STATE.chapterProgress = {};
    saveState();
    synth.playIncorrect();
    renderApp();
  }
}

// Check / update streak logic
function updateStreak() {
  const today = new Date().toDateString();
  if (STATE.lastPracticeDate !== today) {
    if (STATE.lastPracticeDate) {
      const lastDate = new Date(STATE.lastPracticeDate);
      const diffTime = Math.abs(new Date(today) - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        STATE.streak += 1;
      } else if (diffDays > 1) {
        STATE.streak = 1;
      }
    } else {
      STATE.streak = 1;
    }
    STATE.lastPracticeDate = today;
    saveState();
  }
}

// Text to Speech
function speakText(text) {
  if ('speechSynthesis' in window) {
    // Cancel currently speaking
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    
    // Choose premium sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
    if (premiumVoice) utterance.voice = premiumVoice;

    window.speechSynthesis.speak(utterance);
    
    // Trigger visual feedback
    const waveBars = document.querySelectorAll('.wave-bar');
    waveBars.forEach(bar => bar.classList.add('active'));
    
    utterance.onend = () => {
      waveBars.forEach(bar => bar.classList.remove('active'));
    };
  }
}

// Get user title based on accuracy & total correct answers
function getUserTitle() {
  const correct = STATE.totalCorrect;
  if (correct >= 50) return "Grammar Archmage 👑";
  if (correct >= 35) return "Grammar Sage 🧙‍♂️";
  if (correct >= 20) return "English Scholar 🎓";
  if (correct >= 8) return "Adept Grammarian ✍️";
  return "Grammar Apprentice 🌱";
}

// RENDER APP VIEW
export function renderApp() {
  const root = document.getElementById('app');
  root.className = STATE.theme === 'light' ? 'light-theme' : '';
  
  if (STATE.activeSession) {
    renderPracticeView(root);
  } else {
    renderDashboardView(root);
  }
}

// DASHBOARD RENDER
function renderDashboardView(container) {
  // Accuracy Calculator
  const accuracy = STATE.totalSolved > 0 
    ? Math.round((STATE.totalCorrect / STATE.totalSolved) * 100) 
    : 0;

  // Total grammar modules completion
  const totalChaptersCount = GRAMMAR_CHAPTERS.length;
  let masteredChapters = 0;
  GRAMMAR_CHAPTERS.forEach(ch => {
    const prog = STATE.chapterProgress[ch.id];
    if (prog && prog.completedDifficulties && prog.completedDifficulties.length >= 4) {
      masteredChapters++;
    }
  });

  const headerHtml = `
    <header>
      <div class="brand">
        <span class="brand-subtitle">Honeycomb Academy</span>
        <h1 class="brand-title">Class 7 English Coach</h1>
      </div>
      <div class="header-controls">
        <div class="quick-stats">
          <div class="quick-stat-item" title="Daily streak">
            <span class="streak-flame">🔥</span>
            <span>${STATE.streak} Day${STATE.streak === 1 ? '' : 's'}</span>
          </div>
          <div class="quick-stat-item" title="Total correct answers">
            <span>✨</span>
            <span>${STATE.totalCorrect} Correct</span>
          </div>
        </div>
        <button id="theme-toggle" class="btn btn-icon" title="Toggle Theme">
          ${STATE.theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button id="mute-toggle" class="btn btn-icon" title="Toggle Sound">
          ${synth.muted ? '🔇' : '🔊'}
        </button>
        <button id="reset-btn" class="btn" title="Reset all data">Reset</button>
      </div>
    </header>
  `;

  const leftColumnHtml = `
    <div class="chapters-section">
      <h2 class="section-title">📖 Grammar Curriculum Chapters</h2>
      <div class="chapter-list">
        ${GRAMMAR_CHAPTERS.map((ch, idx) => {
          const progress = STATE.chapterProgress[ch.id] || { solved: 0, correct: 0, completedDifficulties: [] };
          const completedCount = progress.completedDifficulties ? progress.completedDifficulties.length : 0;
          const completedPercentage = Math.round((completedCount / 4) * 100);

          return `
            <div class="card chapter-card" data-id="${ch.id}">
              <div class="chapter-info">
                <span class="chapter-card-title">${ch.title}</span>
                <span class="chapter-card-desc">${ch.description}</span>
                <div style="display: flex; gap: 0.4rem; margin-top: 0.5rem;">
                  ${['Basic', 'Intermediate', 'Advanced', 'Olympiad'].map(diff => {
                    const isDone = progress.completedDifficulties && progress.completedDifficulties.includes(diff);
                    return `<span class="badge ${isDone ? `badge-${diff.toLowerCase()}` : ''}" style="${!isDone ? 'opacity: 0.35; border: 1px dashed var(--border-color);' : ''}">${diff}</span>`;
                  }).join('')}
                </div>
              </div>
              <div class="chapter-meta">
                <div class="progress-circle" style="background: radial-gradient(closest-side, var(--bg-app) 79%, transparent 80% 100%), conic-gradient(var(--accent-blue) ${completedPercentage}%, var(--border-color) 0);">
                  ${completedPercentage}%
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const rightColumnHtml = `
    <div class="stats-panel">
      <div class="card card-glowing text-center">
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">Academy Rank</h3>
        <div class="badge badge-olympiad" style="font-size: 1rem; padding: 0.5rem 1.2rem; margin-bottom: 1rem; display: inline-block;">
          ${getUserTitle()}
        </div>
        <div class="stat-grid-3">
          <div class="stat-box">
            <span class="stat-val">${STATE.streak}</span>
            <span class="stat-lbl">Streak</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${accuracy}%</span>
            <span class="stat-lbl">Accuracy</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${STATE.totalSolved}</span>
            <span class="stat-lbl">Solved</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h4 style="font-family: var(--font-sans); font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          🚀 Daily Grammar Tip
        </h4>
        <p id="grammar-tip" style="font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary);">
          <em>"Universal truths, scientific facts, or habitual actions do not undergo a change of tense in indirect speech even if the reporting verb is in the past tense."</em>
        </p>
      </div>

      <div class="card">
        <h4 style="font-family: var(--font-sans); font-weight: 700; margin-bottom: 1rem;">
          📊 Curriculum Progress
        </h4>
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:0.4rem;">
          <span>Modules Mastered</span>
          <span>${masteredChapters} / ${totalChaptersCount}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${(masteredChapters / totalChaptersCount) * 100}%"></div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = `
    ${headerHtml}
    <div class="dashboard-grid">
      ${leftColumnHtml}
      ${rightColumnHtml}
    </div>
    <footer>
      Honeycomb Academy Class 7 English Coach · Designed with visual excellence.
    </footer>
  `;

  // Attach Event Listeners
  document.getElementById('theme-toggle').addEventListener('click', () => {
    STATE.theme = STATE.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('coach_theme', STATE.theme);
    renderApp();
  });

  document.getElementById('mute-toggle').addEventListener('click', () => {
    const isMuted = synth.toggleMute();
    renderApp();
  });

  document.getElementById('reset-btn').addEventListener('click', resetData);

  document.querySelectorAll('.chapter-card').forEach(card => {
    card.addEventListener('click', () => {
      const chapterId = card.getAttribute('data-id');
      openDifficultySelectorModal(chapterId);
    });
  });

  // Load a random grammar tip
  const tips = [
    "When subjects are joined by 'neither... nor', the verb agrees with the closer subject.",
    "For collective nouns, use a plural verb if members act individually or disagree.",
    "The standard adjective order is: Opinion, Size/Shape, Age, Color, Origin, Material, Purpose.",
    "Active sentences with modal verbs (e.g., 'must keep') use 'must be kept' in the passive voice.",
    "Possessive pronouns like 'yours', 'hers', 'theirs' never use apostrophes.",
    "Preposition 'since' denotes a specific starting point, while 'for' denotes a duration."
  ];
  document.getElementById('grammar-tip').innerHTML = `<em>"${getRandomElement(tips)}"</em>`;
}

// DIFFICULTY SELECTOR MODAL (Overlay)
function openDifficultySelectorModal(chapterId) {
  const chapter = GRAMMAR_CHAPTERS.find(c => c.id === chapterId);
  const container = document.getElementById('app');
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'difficulty-modal';

  const progress = STATE.chapterProgress[chapterId] || { completedDifficulties: [] };

  modalOverlay.innerHTML = `
    <div class="modal">
      <h2 style="font-family: var(--font-display); font-size: 1.8rem;">Select Difficulty Level</h2>
      <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${chapter.title}</p>
      
      <div style="display:flex; flex-direction:column; gap: 0.8rem; width: 100%;">
        ${['Basic', 'Intermediate', 'Advanced', 'Olympiad'].map(diff => {
          const isCompleted = progress.completedDifficulties && progress.completedDifficulties.includes(diff);
          return `
            <button class="btn diff-modal-btn ${isCompleted ? 'btn-completed' : ''}" data-diff="${diff}" style="justify-content: space-between; text-align: left; padding: 1rem 1.5rem; border-radius: var(--radius-md);">
              <span style="display:flex; align-items:center; gap: 0.5rem;">
                <span class="badge badge-${diff.toLowerCase()}">${diff}</span>
                ${isCompleted ? '<span style="color: var(--color-success)">★ Mastered</span>' : ''}
              </span>
              <span>Start Sheet →</span>
            </button>
          `;
        }).join('')}
      </div>

      <button id="close-modal" class="btn" style="margin-top: 0.5rem; width:100%;">Cancel</button>
    </div>
  `;

  container.appendChild(modalOverlay);

  // Close modal
  document.getElementById('close-modal').addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });

  // Select difficulty and launch session
  modalOverlay.querySelectorAll('.diff-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const difficulty = btn.getAttribute('data-diff');
      modalOverlay.remove();
      startSession(chapterId, difficulty);
    });
  });
}

// START PRACTICE SESSION
function startSession(chapterId, difficulty) {
  const chapter = GRAMMAR_CHAPTERS.find(c => c.id === chapterId);
  
  // Initialize past IDs store if not present
  if (!STATE.pastQuestionIds) {
    STATE.pastQuestionIds = JSON.parse(localStorage.getItem('coach_past_qids')) || {};
  }
  if (!STATE.pastQuestionIds[chapterId]) {
    STATE.pastQuestionIds[chapterId] = {};
  }
  if (!STATE.pastQuestionIds[chapterId][difficulty]) {
    STATE.pastQuestionIds[chapterId][difficulty] = [];
  }
  const pastIdsSet = new Set(STATE.pastQuestionIds[chapterId][difficulty]);
  
  // Get static question for this difficulty (if any)
  const staticQ = chapter.staticQuestions.find(q => q.difficulty === difficulty);
  
  // Generate 4 dynamic questions ensuring uniqueness across session and past usage
  const questions = [];
  const usedIds = new Set();
  if (staticQ) {
    questions.push({ ...staticQ });
    usedIds.add(staticQ.id);
    pastIdsSet.add(staticQ.id);
  }
  let attempts = 0;
  while (questions.length < 5) {
    const dyn = generateQuestion(chapterId, difficulty);
    if (!usedIds.has(dyn.id) && !pastIdsSet.has(dyn.id)) {
      questions.push(dyn);
      usedIds.add(dyn.id);
      pastIdsSet.add(dyn.id);
    }
    attempts++;
    // Prevent infinite loop if pool exhausted
    if (attempts > 20) {
      // Reset past IDs for this chapter/difficulty to allow reuse
      STATE.pastQuestionIds[chapterId][difficulty] = [];
      pastIdsSet.clear();
    }
  }

  // Persist updated past IDs
  localStorage.setItem('coach_past_qids', JSON.stringify(STATE.pastQuestionIds));

  STATE.activeSession = {
    chapterId,
    chapterTitle: chapter.title,
    difficulty,
    questions,
    currentIdx: 0,
    answers: [] // { questionId, selectedAnswer, correct: boolean }
  };

  renderApp();
}
  const chapter = GRAMMAR_CHAPTERS.find(c => c.id === chapterId);
  
  // Get static question for this difficulty (if any)
  const staticQ = chapter.staticQuestions.find(q => q.difficulty === difficulty);
  
  // Generate 4 dynamic questions ensuring uniqueness
  const questions = [];
  const usedIds = new Set();
  if (staticQ) {
    questions.push({ ...staticQ });
    usedIds.add(staticQ.id);
  }
  while (questions.length < 5) {
    const dyn = generateQuestion(chapterId, difficulty);
    if (!usedIds.has(dyn.id)) {
      questions.push(dyn);
      usedIds.add(dyn.id);
    }
  }

  STATE.activeSession = {
    chapterId,
    chapterTitle: chapter.title,
    difficulty,
    questions,
    currentIdx: 0,
    answers: [] // { questionId, selectedAnswer, correct: boolean }
  };

  renderApp();
}

// RENDER SESSION PRACTICE VIEW (HIGH FOCUS)
function renderPracticeView(container) {
  const session = STATE.activeSession;
  const currentQ = session.questions[session.currentIdx];
  const progressPercent = Math.round(((session.currentIdx) / session.questions.length) * 100);

  const ttsButtonHtml = `
    <div class="audio-controls">
      <button id="tts-btn" class="btn btn-icon" title="Speak Question">
        🔊
      </button>
      <div class="audio-wave">
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
        <span class="wave-bar"></span>
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="practice-container">
      <div class="session-header">
        <button id="exit-session" class="btn">← Back to Dashboard</button>
        <span style="font-weight: 700; color: var(--accent-gold); display: flex; align-items:center; gap:0.4rem;">
          ${session.chapterTitle} 
          <span class="badge badge-${session.difficulty.toLowerCase()}">${session.difficulty}</span>
        </span>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
      </div>
      
      <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--text-secondary);">
        <span>Question ${session.currentIdx + 1} of ${session.questions.length}</span>
        <span>${progressPercent}% Completed</span>
      </div>

      <div class="card question-card">
        <div class="question-meta-row">
          <span class="badge badge-${session.difficulty.toLowerCase()}">${session.difficulty} Level</span>
          ${ttsButtonHtml}
        </div>
        
        <div class="question-text" id="q-text">
          ${currentQ.question}
        </div>

        <div class="options-grid" id="options-container">
          ${currentQ.type === 'mcq' ? renderMcqOptions(currentQ) : renderTextInput()}
        </div>
      </div>

      <div id="explanation-container"></div>

      <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
        <button id="action-btn" class="btn btn-primary" disabled>Check Answer</button>
      </div>
    </div>
  `;

  // Attach dynamic functions
  let selectedOption = null;
  const actionBtn = document.getElementById('action-btn');
  const explanationContainer = document.getElementById('explanation-container');

  // Text-To-Speech
  document.getElementById('tts-btn').addEventListener('click', () => {
    speakText(currentQ.question);
  });

  // Exit practice sheet
  document.getElementById('exit-session').addEventListener('click', () => {
    if (confirm("Are you sure you want to exit this active practice session? All progress in this sheet will be lost.")) {
      STATE.activeSession = null;
      renderApp();
    }
  });

  if (currentQ.type === 'mcq') {
    const optButtons = document.querySelectorAll('.option-button');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (actionBtn.getAttribute('data-state') === 'next') return; // Answer already submitted
        
        optButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedOption = parseInt(btn.getAttribute('data-index'));
        actionBtn.removeAttribute('disabled');
      });
    });
  } else {
    // Text input logic
    const answerInput = document.getElementById('answer-input');
    answerInput.addEventListener('input', () => {
      if (answerInput.value.trim().length > 0) {
        actionBtn.removeAttribute('disabled');
      } else {
        actionBtn.setAttribute('disabled', 'true');
      }
    });
  }

  // Handle Answer Check & Submission
  actionBtn.addEventListener('click', () => {
    const currentState = actionBtn.getAttribute('data-state');

    if (currentState === 'next') {
      // Transition to next question
      session.currentIdx++;
      if (session.currentIdx >= session.questions.length) {
        finishSession();
      } else {
        renderApp();
      }
    } else {
      // Evaluating current answer
      let isCorrect = false;
      
      if (currentQ.type === 'mcq') {
        isCorrect = (selectedOption === currentQ.correct);
        
        // Highlight correct and incorrect options
        const optButtons = document.querySelectorAll('.option-button');
        optButtons.forEach((btn, idx) => {
          btn.classList.add('disabled');
          if (idx === currentQ.correct) {
            btn.classList.add('correct');
          } else if (idx === selectedOption && !isCorrect) {
            btn.classList.add('incorrect');
          }
        });
      } else {
        const textAns = document.getElementById('answer-input').value.trim().toLowerCase();
        const correctAnswers = Array.isArray(currentQ.correct) 
          ? currentQ.correct.map(a => a.toLowerCase()) 
          : [currentQ.correct.toLowerCase()];
        
        isCorrect = correctAnswers.includes(textAns);
        const inputField = document.getElementById('answer-input');
        inputField.disabled = true;
        
        if (isCorrect) {
          inputField.style.borderColor = 'var(--color-success)';
          inputField.style.background = 'hsla(142, 76%, 45%, 0.1)';
        } else {
          inputField.style.borderColor = 'var(--color-error)';
          inputField.style.background = 'hsla(354, 76%, 59%, 0.1)';
        }
      }

      // Play Sound Feedback
      if (isCorrect) {
        synth.playCorrect();
      } else {
        synth.playIncorrect();
      }

      // Record result
      session.answers.push({
        questionId: currentQ.id,
        selected: selectedOption,
        correct: isCorrect
      });

      // Update Global Stats counters
      STATE.totalSolved++;
      if (isCorrect) STATE.totalCorrect++;

      // Show Explanation Panel
      explanationContainer.innerHTML = `
        <div class="explanation-card">
          <span class="explanation-title">${isCorrect ? '✨ Magnificent!' : '💡 Grammar Insight'}</span>
          <p class="explanation-text">${currentQ.explanation}</p>
        </div>
      `;

      // Update CTA button to transition forward
      actionBtn.innerText = "Next Question →";
      actionBtn.setAttribute('data-state', 'next');
    }
  });
}

function renderMcqOptions(question) {
  return question.options.map((opt, idx) => `
    <button class="option-button" data-index="${idx}">
      <span>${opt}</span>
      <span class="option-indicator">${String.fromCharCode(65 + idx)}</span>
    </button>
  `).join('');
}

function renderTextInput() {
  return `
    <div class="input-answer-container">
      <input type="text" id="answer-input" class="answer-input" placeholder="Type your answer here..." autocomplete="off">
    </div>
  `;
}

// END PRACTICE SESSION & RECORD COMPLETED LEVEL
function finishSession() {
  const session = STATE.activeSession;
  const totalQuestions = session.questions.length;
  const correctAnswers = session.answers.filter(a => a.correct).length;
  const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

  // Play rich synthesized celebration melody
  synth.playSuccessMelody();

  // If score is perfect or highly accurate, unlock/complete difficulty for chapter
  if (scorePercent >= 80) {
    if (!STATE.chapterProgress[session.chapterId]) {
      STATE.chapterProgress[session.chapterId] = { solved: 0, correct: 0, completedDifficulties: [] };
    }
    const chProg = STATE.chapterProgress[session.chapterId];
    if (!chProg.completedDifficulties.includes(session.difficulty)) {
      chProg.completedDifficulties.push(session.difficulty);
    }
  }

  // Update study streak daily
  updateStreak();
  saveState();

  // Modal celebration popup
  const container = document.getElementById('app');
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="modal">
      <span style="font-size: 4rem;">🎉</span>
      <h2 style="font-family: var(--font-display); font-size: 2rem;">Sheet Complete!</h2>
      <p style="color: var(--text-secondary);">You completed standard Class 7 worksheet: <br><strong>${session.chapterTitle} (${session.difficulty})</strong></p>
      
      <div style="margin: 1rem 0; width:100%;">
        <div style="font-size: 3rem; font-weight:800; color:var(--accent-gold);">${correctAnswers} / ${totalQuestions}</div>
        <div style="color: var(--text-secondary); font-size: 0.95rem; margin-top:0.4rem;">Questions Solved Correctly (${scorePercent}%)</div>
      </div>

      <div style="width:100%; text-align: left; background: rgba(0,0,0,0.15); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <h4 style="margin-bottom:0.4rem; color:var(--accent-blue);">Academy Progress:</h4>
        <div style="font-size:0.9rem; margin-bottom:0.2rem;">Daily Streak: <strong>${STATE.streak} Days 🔥</strong></div>
        <div style="font-size:0.9rem;">Rank: <strong>${getUserTitle()}</strong></div>
      </div>

      <button id="finish-btn" class="btn btn-primary" style="width: 100%; padding:0.8rem;">Return to Library</button>
    </div>
  `;

  container.appendChild(modalOverlay);

  document.getElementById('finish-btn').addEventListener('click', () => {
    modalOverlay.remove();
    STATE.activeSession = null;
    renderApp();
  });
}

// Initialise Application when page loads
window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
