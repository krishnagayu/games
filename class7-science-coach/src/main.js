import './style.css';
import { chapters, chapterGuides, electricityGuide, worksheets } from './data.js';
import { generateQuestion } from './generators.js';
import { createElectricityLab } from './lab.js';

// ───────── State Management ─────────
const state = {
  currentView: 'chapters', // 'chapters', 'chapter-view', 'session', 'session-report', 'dashboard', 'lab'
  selectedChapter: null,
  selectedLevel: 'basic',
  userAnswers: {},
  streak: 0,
  lastActiveDate: '',
  dailyStreakHistory: [],

  adaptiveStats: {
    totalAttempted: 0,
    totalCorrect: 0,
    sessionsCompleted: 0,
    highScores: {} // chapterId -> highest score achieved
  },
  activeSession: null
};

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('class7_science_coach_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      if (!state.adaptiveStats) {
        state.adaptiveStats = { totalAttempted: 0, totalCorrect: 0, sessionsCompleted: 0, highScores: {} };
      }
      if (!state.dailyStreakHistory) {
        state.dailyStreakHistory = [];
      }
    } catch (e) {
      console.error('Error parsing saved state', e);
    }
  }
  updateStreak();
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('class7_science_coach_state', JSON.stringify(state));
  renderNavbarProgress();
}

// Update daily study streak
function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  if (!state.dailyStreakHistory.includes(today)) {
    state.dailyStreakHistory.push(today);

    let streakCount = 1;
    let checkDate = new Date();
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (state.dailyStreakHistory.includes(checkStr)) {
        streakCount++;
      } else {
        break;
      }
    }
    state.streak = streakCount;
    state.lastActiveDate = today;
    saveState();
  }
}

// Stats aggregator
function getStats() {
  let totalQuestions = 0;
  let correctQuestions = 0;

  Object.keys(worksheets).forEach(level => {
    worksheets[level].forEach((q, index) => {
      totalQuestions++;
      const key = `${level}_${q.chapter}_${index}`;
      if (state.userAnswers[key]?.correct) {
        correctQuestions++;
      }
    });
  });

  if (state.adaptiveStats) {
    totalQuestions += state.adaptiveStats.totalAttempted || 0;
    correctQuestions += state.adaptiveStats.totalCorrect || 0;
  }

  const completionRate = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
  return { totalQuestions, correctQuestions, completionRate };
}

// ───────── Router & DOM Root ─────────
const appEl = document.getElementById('app');

function navigateTo(view, params = {}) {
  state.currentView = view;
  if (params.chapter) state.selectedChapter = params.chapter;
  if (params.level) state.selectedLevel = params.level;

  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ───────── Master Render Core ─────────
function renderApp() {
  appEl.innerHTML = '';

  appEl.appendChild(createNavbar());

  const main = document.createElement('main');

  if (state.currentView === 'chapters') {
    main.appendChild(createHero());
    main.appendChild(createChaptersGrid());
  } else if (state.currentView === 'chapter-view') {
    main.appendChild(createChapterView());
  } else if (state.currentView === 'lab') {
    main.appendChild(createDedicatedLabView());
  } else if (state.currentView === 'session') {
    main.appendChild(createActiveSessionView());
  } else if (state.currentView === 'session-report') {
    main.appendChild(createSessionReportView());
  } else if (state.currentView === 'dashboard') {
    main.appendChild(createDashboardView());
  }

  appEl.appendChild(main);
  renderNavbarProgress();
}

// ───────── UI Components ─────────

function createNavbar() {
  const nav = document.createElement('header');
  nav.className = 'navbar';

  const brand = document.createElement('div');
  brand.className = 'navbar__brand';
  brand.innerHTML = `
    <div class="navbar__brand-icon">⚡</div>
    <span>Science Coach · Class 7</span>
  `;
  brand.addEventListener('click', () => navigateTo('chapters'));

  const navbarNav = document.createElement('nav');
  navbarNav.className = 'navbar__nav';

  const links = [
    { name: 'Chapters', view: 'chapters' },
    { name: 'Electricity Lab', view: 'lab' },
    { name: 'Dashboard', view: 'dashboard' }
  ];

  links.forEach(link => {
    const a = document.createElement('button');
    a.className = `navbar__link ${state.currentView === link.view ? 'active' : ''}`;
    a.textContent = link.name;
    a.addEventListener('click', () => navigateTo(link.view));
    navbarNav.appendChild(a);
  });

  const progressDiv = document.createElement('div');
  progressDiv.className = 'navbar__progress';
  progressDiv.innerHTML = `
    <span>Mastery</span>
    <div class="navbar__progress-bar">
      <div class="navbar__progress-fill" id="nav-progress-fill"></div>
    </div>
  `;

  nav.appendChild(brand);
  nav.appendChild(navbarNav);
  nav.appendChild(progressDiv);

  return nav;
}

function renderNavbarProgress() {
  const fill = document.getElementById('nav-progress-fill');
  if (fill) {
    const { completionRate } = getStats();
    fill.style.width = `${completionRate}%`;
  }
}

// Hero Section
function createHero() {
  const hero = document.createElement('section');
  hero.className = 'hero';

  const { correctQuestions } = getStats();

  let rankTitle = 'Junior Science Apprentice 🌱';
  if (correctQuestions >= 50) rankTitle = 'NCERT Science Master 👑';
  else if (correctQuestions >= 25) rankTitle = 'Circuit & Science Specialist 🚀';
  else if (correctQuestions >= 10) rankTitle = 'Curious Scientist 🔬';

  hero.innerHTML = `
    <div class="hero__badge">
      <span class="hero__badge-dot"></span>
      NCERT Class 7 Science Coach
    </div>
    <h1>Master Science & Circuits</h1>
    <p>Adaptive diagnostics, interactive virtual circuits laboratory, and step-by-step concept mastery strictly aligned with the <strong>NCERT Class 7 Science textbook</strong>, featuring a dedicated deep-dive into <strong>Electric Current and Its Effects</strong>.</p>
    <div class="hero__stats">
      <div class="hero__stat">
        <div class="hero__stat-value">${state.streak} Days</div>
        <div class="hero__stat-label">Daily Streak</div>
      </div>
      <div class="hero__stat">
        <div class="hero__stat-value">${correctQuestions}</div>
        <div class="hero__stat-label">Solved Problems</div>
      </div>
      <div class="hero__stat">
        <div class="hero__stat-value" style="font-size: var(--fs-lg);">${rankTitle}</div>
        <div class="hero__stat-label">Science Rank</div>
      </div>
    </div>
  `;
  return hero;
}

// Chapters Grid
function createChaptersGrid() {
  const section = document.createElement('section');
  section.className = 'section';

  section.innerHTML = `
    <div class="section__header">
      <div>
        <h2 class="section__title">NCERT Class 7 Science Chapters</h2>
        <p class="section__subtitle">Select any chapter to start adaptive drills strictly based on NCERT concepts, or explore Chapter 10 for the specialized Electricity deep-dive & live lab.</p>
      </div>
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'chapter-grid';

  chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = `chapter-card ${ch.isFeatured ? 'chapter-card--featured' : ''}`;
    card.style.setProperty('--card-accent', ch.accent);

    const high = state.adaptiveStats?.highScores?.[ch.id] || 0;
    const statusClass = high >= 800 ? 'chapter-card__status--done' : 'chapter-card__status--new';
    const statusLabel = high > 0 ? `Score: ${high}` : `Not Started`;

    card.innerHTML = `
      ${ch.badge ? `<div class="featured-ribbon">${ch.badge}</div>` : ''}
      <div class="chapter-card__header">
        <div class="chapter-card__icon">${ch.icon}</div>
        <div class="chapter-card__num">CH ${String(ch.id).padStart(2, '0')}</div>
      </div>
      <h3 class="chapter-card__title">${ch.title}</h3>
      <p class="chapter-card__desc">${ch.summary}</p>
      <div class="chapter-card__footer">
        <span class="chapter-card__topics">${ch.topics.length} Key Subtopics</span>
        <span class="chapter-card__status ${statusClass}">${statusLabel}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      navigateTo('chapter-view', { chapter: ch });
    });

    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

// Dedicated Lab View
function createDedicatedLabView() {
  const view = document.createElement('div');
  view.className = 'worksheet-view';

  const backBtn = document.createElement('button');
  backBtn.className = 'worksheet-view__back';
  backBtn.innerHTML = `← Back to Syllabus`;
  backBtn.addEventListener('click', () => navigateTo('chapters'));
  view.appendChild(backBtn);

  const header = document.createElement('div');
  header.className = 'worksheet-view__header';
  header.innerHTML = `
    <h2 class="worksheet-view__title">⚡ Electricity & Circuits Virtual Science Lab</h2>
    <p class="section__subtitle">Experiment with real-time physical parameters: toggle switches, reverse battery polarities, test fuses under overcurrent, and observe Oersted magnetic compass deflection.</p>
  `;
  view.appendChild(header);

  // Embed the lab
  view.appendChild(createElectricityLab());

  return view;
}

// Chapter Detailed View
function createChapterView() {
  const ch = state.selectedChapter;
  if (!ch) return document.createElement('div');

  const view = document.createElement('div');
  view.className = 'worksheet-view';

  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'worksheet-view__back';
  backBtn.innerHTML = `← Back to Chapters`;
  backBtn.addEventListener('click', () => navigateTo('chapters'));
  view.appendChild(backBtn);

  // Header
  const header = document.createElement('div');
  header.className = 'worksheet-view__header';
  const highScore = state.adaptiveStats?.highScores?.[ch.id] || 0;

  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
      <span style="font-size: 2rem;">${ch.icon}</span>
      <h2 class="worksheet-view__title">Chapter ${ch.id}: ${ch.title}</h2>
    </div>
    <p class="section__subtitle" style="margin-bottom: 1.5rem; font-size: var(--fs-base);">${ch.summary}</p>
  `;
  view.appendChild(header);

  // 1. Diagnostic Launch Card
  const launchCard = document.createElement('div');
  launchCard.className = 'question-card';
  launchCard.style.border = '1px solid var(--accent)';
  launchCard.style.background = 'linear-gradient(135deg, hsla(48, 100%, 50%, 0.08), var(--bg-card))';
  
  launchCard.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="font-size: var(--fs-xs); color: var(--accent); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
          NCERT Class 7 Adaptive Science Engine
        </div>
        <h3 style="font-size: var(--fs-xl); font-weight: 800; margin-bottom: 0.5rem;">${ch.title} Adaptive Diagnostics</h3>
        <p style="color: var(--text-secondary); max-width: 650px; font-size: var(--fs-sm);">
          10-question dynamic diagnostic session scaling across <strong>Basic (Foundations), Intermediate (Concepts), Advanced (Application), and Mastery (Exemplar)</strong> tiers strictly based on the Class 7 NCERT textbook.
        </p>
      </div>
      <div>
        <button class="option-btn correct" id="btn-start-session" style="padding: 0.9rem 2rem; font-weight: 800; font-size: var(--fs-base); width: auto;">
          ⚡ Start Adaptive Session
        </button>
      </div>
    </div>
  `;
  launchCard.querySelector('#btn-start-session').addEventListener('click', () => {
    startAdaptiveSession(ch.id);
  });
  view.appendChild(launchCard);

  // 2. If Chapter 10 (Electricity Focus), show Virtual Lab and Circuit Component Guide
  if (ch.id === 10) {
    view.appendChild(createElectricityLab());

    const compSection = document.createElement('div');
    compSection.className = 'question-card';
    compSection.innerHTML = `
      <h3 class="chapter-card__title" style="margin-bottom: 0.5rem; font-size: var(--fs-lg);">
        Standard Circuit Components & Symbols Guide
      </h3>
      <p class="section__subtitle" style="margin-bottom: 1.5rem;">
        Master the standard circuit representations required by the NCERT Class 7 textbook:
      </p>
      <div class="component-guide-grid">
        ${electricityGuide.components.map(c => `
          <div class="comp-card">
            <div class="comp-card__name">${c.name}</div>
            <div class="comp-svg-wrap">${c.svg}</div>
            <div class="comp-card__rule">${c.rule}</div>
          </div>
        `).join('')}
      </div>
    `;
    view.appendChild(compSection);
  }

  // 3. NCERT Core Scientific Concepts Breakdown
  const concepts = ch.id === 10 ? electricityGuide.keyConcepts : (chapterGuides[ch.id] || []);
  if (concepts.length > 0) {
    const conceptsCard = document.createElement('div');
    conceptsCard.className = 'question-card';
    conceptsCard.innerHTML = `
      <h3 class="chapter-card__title" style="margin-bottom: 0.5rem; font-size: var(--fs-lg);">
        NCERT Key Scientific Concepts & Principles
      </h3>
      <p class="section__subtitle" style="margin-bottom: 1.5rem;">
        Essential foundational principles and definitions from the NCERT Class 7 Science textbook:
      </p>
      <div style="display: grid; gap: 1rem;">
        ${concepts.map(kc => `
          <div style="background: var(--bg-glass); border: 1px solid var(--border-subtle); padding: 1rem 1.25rem; border-radius: var(--radius-md);">
            <h4 style="font-size: var(--fs-base); color: var(--accent); margin-bottom: 0.25rem;">${kc.title}</h4>
            <p style="font-size: var(--fs-sm); color: var(--text-secondary); line-height: 1.5;">${kc.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
    view.appendChild(conceptsCard);
  }

  // 4. Syllabus Subtopics & High Score
  const topicsCard = document.createElement('div');
  topicsCard.className = 'question-card';
  let keyTopicsHtml = ch.topics.map(t => `<li style="font-size: var(--fs-base); margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--accent);">✔</span> ${t}</li>`).join('');

  topicsCard.innerHTML = `
    <h3 class="chapter-card__title" style="margin-bottom: 1rem; font-size: var(--fs-lg);">NCERT Textbook Subtopics</h3>
    <ul style="padding-left: 0.5rem; margin-bottom: 1.5rem;">
      ${keyTopicsHtml}
    </ul>
    
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
      <div>
        <div style="font-size: var(--fs-xs); color: var(--text-muted); text-transform: uppercase;">Chapter High Score</div>
        <div style="font-size: var(--fs-xl); font-weight: 800; color: ${highScore > 0 ? 'var(--accent)' : 'var(--text-muted)'}">
          ${highScore > 0 ? `${highScore} Points` : 'No attempts yet'}
        </div>
      </div>
    </div>
  `;
  view.appendChild(topicsCard);

  return view;
}

// ───────── Adaptive Session Logic ─────────

function startAdaptiveSession(chapterId) {
  state.activeSession = {
    chapterId: chapterId,
    currentStep: 0,
    totalSteps: 10,
    questions: [],
    userAnswers: [],
    currentLevel: 'basic',
    score: 500,
    trajectory: [500],
    currentQuestion: null,
    answered: false,
    selectedOption: null,
    textInput: '',
    gradedCorrect: false
  };

  state.activeSession.currentQuestion = generateQuestion(chapterId, 'basic');
  state.activeSession.questions.push(state.activeSession.currentQuestion);

  navigateTo('session');
}

function createActiveSessionView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');

  const ch = chapters.find(c => c.id === sess.chapterId);
  const q = sess.currentQuestion;

  const view = document.createElement('div');
  view.className = 'worksheet-view';

  const header = document.createElement('div');
  header.className = 'worksheet-view__header';

  const levelColors = {
    basic: 'hsl(145, 70%, 48%)',
    intermediate: 'hsl(199, 89%, 48%)',
    advanced: 'hsl(48, 100%, 50%)',
    olympiad: 'hsl(350, 89%, 60%)'
  };
  const tierLabels = {
    basic: 'Basic (NCERT Foundations)',
    intermediate: 'Intermediate (NCERT Concepts)',
    advanced: 'Advanced (NCERT Application)',
    olympiad: 'Mastery (NCERT Exemplar)'
  };
  const activeLabel = tierLabels[sess.currentLevel] || `${sess.currentLevel} Tier`;

  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="background: hsla(${activeColor.slice(4, -1)}, 0.15); color: ${activeColor}; border: 1px solid ${activeColor}; font-weight: 800; text-transform: uppercase; font-size: var(--fs-xs); padding: 0.3rem 0.8rem; border-radius: 99px;">
        ${activeLabel}
      </span>
      <div style="font-size: var(--fs-sm); font-weight: 600; color: var(--text-secondary);">
        Question ${sess.currentStep + 1} of ${sess.totalSteps}
      </div>
    </div>
    <h2 class="worksheet-view__title" style="font-size: var(--fs-xl);">${ch.icon} Ch ${ch.id}: ${ch.title}</h2>
    
    <!-- Progress Indicator Bar -->
    <div style="width: 100%; height: 6px; background: var(--bg-glass); border-radius: 99px; margin-top: 1rem; overflow: hidden;">
      <div style="width: ${((sess.currentStep) / sess.totalSteps) * 100}%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--electric-cyan)); transition: width 0.4s var(--ease-out);"></div>
    </div>
  `;
  view.appendChild(header);

  // Metrics Panel
  const metricsPanel = document.createElement('div');
  metricsPanel.style.display = 'flex';
  metricsPanel.style.gap = '1.5rem';
  metricsPanel.style.marginBottom = '2rem';
  metricsPanel.style.background = 'var(--bg-glass)';
  metricsPanel.style.padding = '0.75rem 1.5rem';
  metricsPanel.style.borderRadius = 'var(--radius-md)';
  metricsPanel.style.fontSize = 'var(--fs-sm)';

  metricsPanel.innerHTML = `
    <div style="flex: 1;">
      <span style="color: var(--text-muted); display: block; font-size: var(--fs-xs); text-transform: uppercase;">Diagnostic Index</span>
      <strong style="color: var(--text-primary); font-size: var(--fs-lg); font-weight: 800;">${sess.score} pts</strong>
    </div>
    <div style="flex: 1; border-left: 1px solid var(--border-subtle); padding-left: 1.5rem;">
      <span style="color: var(--text-muted); display: block; font-size: var(--fs-xs); text-transform: uppercase;">Adaptive Engine Mode</span>
      <strong style="color: ${activeColor}; font-size: var(--fs-lg); font-weight: 800; text-transform: capitalize;">${sess.currentLevel}</strong>
    </div>
  `;
  view.appendChild(metricsPanel);

  // Question Card
  const card = document.createElement('div');
  card.className = 'question-card';

  const qHeader = document.createElement('div');
  qHeader.className = 'question-card__header';
  qHeader.innerHTML = `
    <div class="question-card__number">${sess.currentStep + 1}</div>
    <div class="question-card__type">${q.type === 'mcq' ? 'Multiple Choice Problem' : 'Direct Numerical / Conceptual Solver'}</div>
  `;
  card.appendChild(qHeader);

  const qText = document.createElement('div');
  qText.style.fontSize = 'var(--fs-lg)';
  qText.style.fontWeight = '600';
  qText.style.marginBottom = '1.75rem';
  qText.style.lineHeight = '1.5';
  qText.textContent = q.text;
  card.appendChild(qText);

  if (q.type === 'mcq') {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'question-card__options';

    q.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';

      if (sess.answered) {
        if (oIdx === q.answer) {
          btn.classList.add('correct');
        } else if (sess.selectedOption === oIdx) {
          btn.classList.add('wrong');
        }
      } else {
        btn.addEventListener('click', () => {
          submitAdaptiveAnswer(oIdx);
        });
      }

      btn.innerHTML = `
        <div class="option-btn__label">${String.fromCharCode(65 + oIdx)}</div>
        <span>${opt}</span>
      `;
      optionsContainer.appendChild(btn);
    });
    card.appendChild(optionsContainer);
  } else {
    // Fill in / short
    const inputContainer = document.createElement('div');
    inputContainer.className = 'answer-input';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type scientific answer or value here...';
    input.value = sess.textInput || '';
    if (sess.answered) {
      input.disabled = true;
      if (sess.gradedCorrect) {
        input.style.borderColor = 'var(--electric-green)';
        input.style.background = 'hsla(142, 71%, 45%, 0.1)';
      } else {
        input.style.borderColor = 'var(--electric-red)';
        input.style.background = 'hsla(350, 89%, 60%, 0.1)';
      }
    }

    const submitBtn = document.createElement('button');
    submitBtn.textContent = sess.answered ? 'Submitted' : 'Submit';
    if (sess.answered) submitBtn.disabled = true;

    const triggerSubmit = () => {
      const val = input.value.trim();
      if (!val) return;
      submitAdaptiveAnswer(val);
    };

    submitBtn.addEventListener('click', triggerSubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSubmit();
    });

    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);
    card.appendChild(inputContainer);
  }

  // Solution Box
  if (sess.answered) {
    const solCard = document.createElement('div');
    solCard.style.marginTop = '1.75rem';
    solCard.style.borderTop = '1px solid var(--border-subtle)';
    solCard.style.paddingTop = '1.5rem';

    solCard.innerHTML = `
      <p style="font-size: var(--fs-base); margin-bottom: 0.5rem; color: ${sess.gradedCorrect ? 'var(--electric-green)' : 'var(--electric-red)'}; font-weight: 800;">
        ${sess.gradedCorrect ? '✔ Correct Answer! Solid NCERT understanding! 🎉' : '✖ Incorrect. Let us examine the NCERT principle: 💡'}
      </p>
      <p style="margin-bottom: 0.75rem; color: var(--text-primary);">
        <strong>Answer Key:</strong> <span style="color: var(--accent); font-weight: 700;">${q.type === 'mcq' ? q.options[q.answer] : q.answer}</span>
      </p>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        <strong>NCERT Step-by-Step Explanation:</strong> ${q.solution}
      </p>

      <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
        <button class="option-btn correct" id="btn-session-next" style="padding: 0.75rem 2rem; border-radius: var(--radius-md); font-weight: 800; width: auto;">
          ${sess.currentStep + 1 === sess.totalSteps ? '🏁 Complete Session' : 'Next Question ➜'}
        </button>
      </div>
    `;

    solCard.querySelector('#btn-session-next').addEventListener('click', () => {
      advanceAdaptiveSession();
    });

    card.appendChild(solCard);
  }

  view.appendChild(card);
  return view;
}

function submitAdaptiveAnswer(userVal) {
  const sess = state.activeSession;
  if (!sess || sess.answered) return;

  const q = sess.currentQuestion;
  let isCorrect = false;

  if (q.type === 'mcq') {
    sess.selectedOption = userVal;
    isCorrect = userVal === q.answer;
  } else {
    sess.textInput = userVal;
    const cleanVal = String(userVal).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanAns = String(q.answer).toLowerCase().replace(/[^a-z0-9]/g, '');
    isCorrect = cleanVal === cleanAns || String(userVal).trim().toLowerCase() === String(q.answer).toLowerCase();
  }

  sess.gradedCorrect = isCorrect;
  sess.answered = true;

  // Scale delta
  const pointsDelta = {
    basic: isCorrect ? 50 : -25,
    intermediate: isCorrect ? 75 : -40,
    advanced: isCorrect ? 100 : -60,
    olympiad: isCorrect ? 150 : -80
  };

  const delta = pointsDelta[sess.currentLevel];
  sess.score = Math.max(200, Math.min(1000, sess.score + delta));
  sess.trajectory.push(sess.score);

  const globalKey = `adaptive_${sess.chapterId}_${Date.now()}`;
  state.userAnswers[globalKey] = {
    answered: true,
    correct: isCorrect,
    input: String(userVal)
  };

  state.adaptiveStats.totalAttempted++;
  if (isCorrect) state.adaptiveStats.totalCorrect++;

  saveState();
  updateStreak();
  renderApp();
}

function advanceAdaptiveSession() {
  const sess = state.activeSession;
  if (!sess) return;

  if (sess.currentStep + 1 >= sess.totalSteps) {
    const chId = sess.chapterId;
    const pastHigh = state.adaptiveStats.highScores[chId] || 0;
    if (sess.score > pastHigh) {
      state.adaptiveStats.highScores[chId] = sess.score;
    }
    state.adaptiveStats.sessionsCompleted++;
    saveState();

    navigateTo('session-report');
  } else {
    const isCorrect = sess.gradedCorrect;
    const currentLvl = sess.currentLevel;

    let nextLvl = currentLvl;
    if (isCorrect) {
      if (currentLvl === 'basic') nextLvl = 'intermediate';
      else if (currentLvl === 'intermediate') nextLvl = 'advanced';
      else if (currentLvl === 'advanced') nextLvl = 'olympiad';
    } else {
      if (currentLvl === 'olympiad') nextLvl = 'advanced';
      else if (currentLvl === 'advanced') nextLvl = 'intermediate';
      else if (currentLvl === 'intermediate') nextLvl = 'basic';
    }

    sess.currentLevel = nextLvl;
    sess.currentStep++;
    sess.answered = false;
    sess.gradedCorrect = false;
    sess.selectedOption = null;
    sess.textInput = '';

    let nextQ = null;
    let attempts = 0;
    do {
      nextQ = generateQuestion(sess.chapterId, nextLvl);
      attempts++;
    } while (sess.questions.some(q => q.text === nextQ.text) && attempts < 15);

    sess.currentQuestion = nextQ;
    sess.questions.push(sess.currentQuestion);

    navigateTo('session');
  }
}

// ───────── Session Report ─────────
function createSessionReportView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');

  const ch = chapters.find(c => c.id === sess.chapterId);
  const correctCount = sess.questions.filter((q, idx) => {
    return sess.trajectory[idx + 1] > sess.trajectory[idx];
  }).length;

  let masteryLabel = 'Basic Learner 🌱';
  let masteryColor = 'hsl(145, 70%, 48%)';
  if (sess.score >= 850) {
    masteryLabel = 'NCERT Science Master 👑';
    masteryColor = 'hsl(350, 89%, 60%)';
  } else if (sess.score >= 650) {
    masteryLabel = 'Advanced Concept Achiever 🚀';
    masteryColor = 'hsl(48, 100%, 50%)';
  } else if (sess.score >= 450) {
    masteryLabel = 'Proficient Scientist 🔬';
    masteryColor = 'hsl(199, 89%, 48%)';
  }

  const view = document.createElement('div');
  view.className = 'worksheet-view';

  const header = document.createElement('div');
  header.className = 'worksheet-view__header';
  header.innerHTML = `
    <h2 class="worksheet-view__title">Performance Diagnostic Report</h2>
    <p class="section__subtitle">NCERT Class 7 Science Adaptive Evaluation breakdown for Chapter ${ch.id}: ${ch.title}</p>
  `;
  view.appendChild(header);

  // Summary Metrics Grid
  const summaryGrid = document.createElement('div');
  summaryGrid.style.display = 'grid';
  summaryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
  summaryGrid.style.gap = '1.25rem';
  summaryGrid.style.marginBottom = '2.5rem';

  summaryGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-card__value">${sess.score} pts</div>
      <div class="stat-card__label">Adaptive Index</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value" style="color: ${masteryColor};">${correctCount} / ${sess.totalSteps}</div>
      <div class="stat-card__label">Correct Answers</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value" style="font-size: var(--fs-lg); font-weight: 800; color: ${masteryColor};">${masteryLabel}</div>
      <div class="stat-card__label">Mastery Achievement</div>
    </div>
  `;
  view.appendChild(summaryGrid);

  // Trajectory Plot
  const graphCard = document.createElement('div');
  graphCard.className = 'question-card';
  graphCard.innerHTML = `
    <h3 class="chapter-card__title" style="margin-bottom: 0.5rem; font-size: var(--fs-base);">Difficulty & Score Trajectory</h3>
    <p class="section__subtitle" style="margin-bottom: 1.5rem;">Adaptive index progression through 10 science problems.</p>
    
    <div style="width: 100%; overflow-x: auto; display: flex; justify-content: center; background: hsla(222, 35%, 5%, 0.6); border-radius: var(--radius-md); padding: 1.5rem 0;">
      <svg id="trajectory-svg" width="480" height="240" viewBox="0 0 480 240" style="overflow: visible; max-width: 100%;">
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        
        <line x1="40" y1="30" x2="450" y2="30" stroke="var(--border-subtle)" stroke-dasharray="4 4" />
        <text x="455" y="34" fill="var(--text-muted)" font-size="9px">1000 (Mastery)</text>
        
        <line x1="40" y1="80" x2="450" y2="80" stroke="var(--border-subtle)" stroke-dasharray="4 4" />
        <text x="455" y="84" fill="var(--text-muted)" font-size="9px">800 (Advanced)</text>
        
        <line x1="40" y1="130" x2="450" y2="130" stroke="var(--border-subtle)" stroke-dasharray="4 4" />
        <text x="455" y="134" fill="var(--text-muted)" font-size="9px">600 (Intermediate)</text>
        
        <line x1="40" y1="180" x2="450" y2="180" stroke="var(--border-subtle)" stroke-dasharray="4 4" />
        <text x="455" y="184" fill="var(--text-muted)" font-size="9px">400 (Basic)</text>

        <line x1="40" y1="210" x2="450" y2="210" stroke="var(--border-subtle)" />
        <text x="455" y="214" fill="var(--text-muted)" font-size="9px">200 (Min)</text>
      </svg>
    </div>
  `;
  view.appendChild(graphCard);

  setTimeout(() => {
    const svgEl = document.getElementById('trajectory-svg');
    if (!svgEl) return;

    const traj = sess.trajectory;
    const xSpacing = 410 / sess.totalSteps;

    const mapY = (sVal) => {
      const clamped = Math.max(200, Math.min(1000, sVal));
      return 210 - ((clamped - 200) / 800) * 180;
    };

    let dLine = '';
    let dArea = 'M 40 210';

    traj.forEach((scoreVal, index) => {
      const px = 40 + index * xSpacing;
      const py = mapY(scoreVal);

      if (index === 0) dLine += `M ${px} ${py}`;
      else dLine += ` L ${px} ${py}`;
      dArea += ` L ${px} ${py}`;
    });

    dArea += ` L ${40 + (traj.length - 1) * xSpacing} 210 Z`;

    const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPath.setAttribute("d", dArea);
    areaPath.setAttribute("fill", "url(#score-grad)");
    svgEl.appendChild(areaPath);

    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", dLine);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "var(--accent)");
    linePath.setAttribute("stroke-width", "3.5");
    linePath.setAttribute("stroke-linecap", "round");
    linePath.setAttribute("stroke-linejoin", "round");
    svgEl.appendChild(linePath);

    traj.forEach((scoreVal, index) => {
      const px = 40 + index * xSpacing;
      const py = mapY(scoreVal);

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", px);
      dot.setAttribute("cy", py);
      dot.setAttribute("r", "5");
      dot.setAttribute("fill", "var(--bg-primary)");
      dot.setAttribute("stroke", "var(--accent)");
      dot.setAttribute("stroke-width", "2.5");

      const stepTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      stepTxt.setAttribute("x", px);
      stepTxt.setAttribute("y", "230");
      stepTxt.setAttribute("fill", "var(--text-secondary)");
      stepTxt.setAttribute("font-size", "8px");
      stepTxt.setAttribute("text-anchor", "middle");
      stepTxt.textContent = index === 0 ? "Start" : `Q${index}`;

      group.appendChild(dot);
      svgEl.appendChild(group);
      svgEl.appendChild(stepTxt);
    });
  }, 50);

  // Review List
  const reviewWrapper = document.createElement('div');
  reviewWrapper.className = 'question-card';
  reviewWrapper.innerHTML = `<h3 class="chapter-card__title" style="margin-bottom: 1.5rem; font-size: var(--fs-lg);">Detailed Question Log Review</h3>`;

  sess.questions.forEach((q, qIndex) => {
    const detail = document.createElement('details');
    detail.style.borderBottom = '1px solid var(--border-subtle)';
    detail.style.padding = '1rem 0';
    detail.style.cursor = 'pointer';

    const isQCorrect = sess.trajectory[qIndex + 1] > sess.trajectory[qIndex];
    const flagColor = isQCorrect ? 'var(--electric-green)' : 'var(--electric-red)';
    const statusTxt = isQCorrect ? '✔ Correct' : '✖ Incorrect';
    const ansKey = q.type === 'mcq' ? q.options[q.answer] : q.answer;

    detail.innerHTML = `
      <summary style="display: flex; justify-content: space-between; align-items: center; list-style: none; font-weight: 600;">
        <span style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: ${flagColor}; font-weight: 800;">${statusTxt}</span>
          <span>Question ${qIndex + 1} (${q.type === 'mcq' ? 'MCQ' : 'Numerical / Short'})</span>
        </span>
        <span style="color: var(--text-muted); font-size: var(--fs-xs);">Click to Expand ➜</span>
      </summary>
      
      <div style="margin-top: 1rem; color: var(--text-secondary); font-size: var(--fs-sm); line-height: 1.6; padding-left: 0.5rem;">
        <p style="color: var(--text-primary); font-size: var(--fs-base); margin-bottom: 0.75rem;"><strong>Problem:</strong> ${q.text}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Correct Answer:</strong> <span style="color: var(--accent); font-weight: 700;">${ansKey}</span></p>
        <p><strong>NCERT Explanation:</strong> ${q.solution}</p>
      </div>
    `;

    reviewWrapper.appendChild(detail);
  });
  view.appendChild(reviewWrapper);

  const foot = document.createElement('div');
  foot.style.display = 'flex';
  foot.style.justifyContent = 'center';
  foot.style.marginTop = '2.5rem';

  const returnBtn = document.createElement('button');
  returnBtn.className = 'option-btn correct';
  returnBtn.textContent = 'Return to Chapters';
  returnBtn.style.padding = '0.9rem 2.5rem';
  returnBtn.style.fontSize = 'var(--fs-base)';
  returnBtn.style.fontWeight = '800';
  returnBtn.style.width = 'auto';
  returnBtn.style.borderRadius = 'var(--radius-md)';

  returnBtn.addEventListener('click', () => {
    state.activeSession = null;
    navigateTo('chapters');
  });

  foot.appendChild(returnBtn);
  view.appendChild(foot);

  return view;
}

// ───────── Dashboard View ─────────
function createDashboardView() {
  const view = document.createElement('div');
  view.className = 'dashboard';

  const { totalQuestions, correctQuestions } = getStats();

  view.innerHTML = `
    <div class="worksheet-view__header">
      <h2 class="worksheet-view__title">Science Learning Dashboard</h2>
      <p class="section__subtitle">Overview of your CBSE Class 7 science diagnostic drills and circuit mastery.</p>
    </div>
    
    <div class="dashboard__grid" style="margin-bottom: 2.5rem;">
      <div class="stat-card">
        <div class="stat-card__value">${correctQuestions} / ${totalQuestions}</div>
        <div class="stat-card__label">Problems Solved</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${state.adaptiveStats.sessionsCompleted}</div>
        <div class="stat-card__label">Sessions Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${state.streak} Days</div>
        <div class="stat-card__label">Active Daily Streak</div>
      </div>
    </div>
    
    <div class="question-card" style="margin-bottom: 2rem;">
      <h3 class="chapter-card__title" style="margin-bottom: 0.5rem;">Daily Study Attendance</h3>
      <p class="section__subtitle">Build regular daily practice to solidify electrical circuit concepts and science intuition.</p>
      <div class="streak-bar" id="dashboard-streak-bar"></div>
    </div>
  `;

  setTimeout(() => {
    const bar = document.getElementById('dashboard-streak-bar');
    if (bar) {
      for (let i = 14; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];

        const dayDot = document.createElement('div');
        dayDot.className = 'streak-bar__day';
        if (state.dailyStreakHistory && state.dailyStreakHistory.includes(dStr)) {
          dayDot.classList.add('active');
        }
        dayDot.title = `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}: ${state.dailyStreakHistory && state.dailyStreakHistory.includes(dStr) ? 'Studied' : 'Rest'}`;
        bar.appendChild(dayDot);
      }
    }
  }, 50);

  const breakdown = document.createElement('div');
  breakdown.className = 'question-card';
  breakdown.innerHTML = `<h3 class="chapter-card__title" style="margin-bottom: 1rem;">Chapter Diagnostic Scores</h3>`;

  const list = document.createElement('div');
  list.style.display = 'grid';
  list.style.gap = '0.75rem';

  chapters.forEach(ch => {
    const high = state.adaptiveStats?.highScores?.[ch.id] || 0;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '0.75rem 0';
    row.style.borderBottom = '1px solid var(--border-subtle)';

    const scoreColor = high >= 800 ? 'var(--electric-red)' : high >= 600 ? 'var(--accent)' : high >= 400 ? 'var(--electric-blue)' : 'var(--text-muted)';

    row.innerHTML = `
      <div style="font-size: var(--fs-sm); font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
        <span>${ch.icon}</span>
        <span>Ch ${ch.id}: ${ch.title}</span>
        ${ch.id === 10 ? '<span style="font-size: 0.65rem; background: var(--accent); color: #000; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px;">FOCUS</span>' : ''}
      </div>
      <div style="font-size: var(--fs-sm); display: flex; align-items: center; gap: 1rem;">
        <span style="color: ${scoreColor}; font-weight: 700;">
          ${high > 0 ? `${high} pts` : 'No attempts'}
        </span>
      </div>
    `;
    list.appendChild(row);
  });

  breakdown.appendChild(list);
  view.appendChild(breakdown);

  return view;
}

// ───────── Initialization ─────────
loadState();
renderApp();
