import './style.css';
import { chapters, worksheets } from './data.js';
import { generateQuestion } from './generators.js';

// ───────── State Management ─────────
const state = {
  currentView: 'chapters', // 'chapters', 'worksheet', 'session', 'session-report', 'dashboard'
  selectedChapter: null,
  selectedLevel: 'basic', 
  userAnswers: {}, // key: `${level}_${chapterId}_${qIndex}` -> { answered: boolean, correct: boolean, input: string }
  streak: 0,
  lastActiveDate: '',
  dailyStreakHistory: [], // array of YYYY-MM-DD
  
  // Adaptive Learning System state
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
  const saved = localStorage.getItem('class7_math_coach_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      // Ensure nested fields are initialized
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
  localStorage.setItem('class7_math_coach_state', JSON.stringify(state));
  renderNavbarProgress();
}

// Update study streak
function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  
  if (!state.dailyStreakHistory.includes(today)) {
    state.dailyStreakHistory.push(today);
    
    // Calculate streak
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

// Get overall stats
function getStats() {
  let totalQuestions = 0;
  let correctQuestions = 0;

  // Static worksheets stats
  Object.keys(worksheets).forEach(level => {
    worksheets[level].forEach((q, index) => {
      totalQuestions++;
      const key = `${level}_${q.chapter}_${index}`;
      if (state.userAnswers[key]?.correct) {
        correctQuestions++;
      }
    });
  });

  // Dynamic adaptive stats
  if (state.adaptiveStats) {
    totalQuestions += state.adaptiveStats.totalAttempted || 0;
    correctQuestions += state.adaptiveStats.totalCorrect || 0;
  }

  const completionRate = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
  return { totalQuestions, correctQuestions, completionRate };
}

// ───────── DOM References & Router ─────────
const appEl = document.getElementById('app');

function navigateTo(view, params = {}) {
  state.currentView = view;
  if (params.chapter) state.selectedChapter = params.chapter;
  if (params.level) state.selectedLevel = params.level;
  
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ───────── Rendering Core ─────────
function renderApp() {
  appEl.innerHTML = '';
  
  // 1. Render Navbar
  appEl.appendChild(createNavbar());
  
  // 2. Render Main Container
  const main = document.createElement('main');
  
  if (state.currentView === 'chapters') {
    main.appendChild(createHero());
    main.appendChild(createChaptersGrid());
  } else if (state.currentView === 'worksheet') {
    main.appendChild(createChapterDashboardView());
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

// ───────── Components ─────────

// Navbar
function createNavbar() {
  const nav = document.createElement('header');
  nav.className = 'navbar';
  
  const brand = document.createElement('div');
  brand.className = 'navbar__brand';
  brand.innerHTML = `
    <div class="navbar__brand-icon">∑</div>
    <span>Math Coach</span>
  `;
  brand.addEventListener('click', () => navigateTo('chapters'));
  
  const navbarNav = document.createElement('nav');
  navbarNav.className = 'navbar__nav';
  
  const links = [
    { name: 'Chapters', view: 'chapters' },
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
    <span>Overall</span>
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
  
  hero.innerHTML = `
    <div class="hero__badge">
      <span class="hero__badge-dot"></span>
      Class 7 CBSE Adaptive Coach
    </div>
    <h1>Master Mathematics</h1>
    <p>Your premium interactive math companion. Track daily streaks, conquer chapters with adaptive AI drills, and reach Olympiad excellence.</p>
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
        <div class="hero__stat-value">${Math.max(1, Math.floor(correctQuestions / 10) + 1)}</div>
        <div class="hero__stat-label">Coach Level</div>
      </div>
    </div>
  `;
  return hero;
}

// Chapters Grid View
function createChaptersGrid() {
  const section = document.createElement('section');
  section.className = 'section';
  
  section.innerHTML = `
    <div class="section__header">
      <div>
        <h2 class="section__title">Syllabus Chapters</h2>
        <p class="section__subtitle">Select a topic below to begin your adaptive GRE-style diagnostic drill.</p>
      </div>
    </div>
  `;
  
  const grid = document.createElement('div');
  grid.className = 'chapter-grid';
  
  chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.setProperty('--card-accent', ch.accent);
    
    // Check highest adaptive score
    const high = state.adaptiveStats?.highScores?.[ch.id] || 0;
    const statusClass = high >= 800 ? 'chapter-card__status--done' : 'chapter-card__status--new';
    const statusLabel = high > 0 ? `Score: ${high}` : `Not Started`;
    
    card.innerHTML = `
      <div class="chapter-card__num">${String(ch.id).padStart(2, '0')}</div>
      <h3 class="chapter-card__title">${ch.title}</h3>
      <p class="chapter-card__desc">${ch.summary}</p>
      <div class="chapter-card__footer">
        <span class="chapter-card__topics">${ch.topics.length} Key Subtopics</span>
        <span class="chapter-card__status ${statusClass}">${statusLabel}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      navigateTo('worksheet', { chapter: ch });
    });
    
    grid.appendChild(card);
  });
  
  section.appendChild(grid);
  return section;
}

// Chapter Prep Launch Screen
function createChapterDashboardView() {
  const ch = state.selectedChapter;
  if (!ch) return document.createElement('div');
  
  const view = document.createElement('div');
  view.className = 'worksheet-view';
  
  // Back button
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
    <h2 class="worksheet-view__title">Chapter ${ch.id}: ${ch.title}</h2>
    <p class="section__subtitle" style="margin-bottom: 1.5rem;">${ch.summary}</p>
  `;
  view.appendChild(header);
  
  // Chapter Key Info & Launch Action Card
  const actionCard = document.createElement('div');
  actionCard.className = 'question-card';
  actionCard.style.padding = '2.5rem 2rem';
  actionCard.style.border = '1px solid var(--border-subtle)';
  actionCard.style.background = 'var(--bg-glass)';
  actionCard.style.backdropFilter = 'blur(10px)';
  
  let keyTopicsHtml = ch.topics.map(t => `<li style="font-size: var(--fs-base); margin-bottom: 0.5rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;"><span style="color: var(--accent);">✔</span> ${t}</li>`).join('');
  
  actionCard.innerHTML = `
    <h3 class="chapter-card__title" style="margin-bottom: 1rem; font-size: var(--fs-xl);">CBSE Adaptive Diagnostics</h3>
    <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
      Launch a 10-question adaptive mathematics drill designed to evaluate and master your skills in this chapter. 
      The system will dynamically scale difficulty levels (<strong>Basic, Intermediate, Advanced, Olympiad</strong>) after each question depending on your accuracy.
    </p>
    
    <div style="margin-bottom: 2rem;">
      <h4 style="font-size: var(--fs-sm); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Syllabus Focus Areas</h4>
      <ul style="padding-left: 0.5rem;">
        ${keyTopicsHtml}
      </ul>
    </div>
    
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
      <div>
        <div style="font-size: var(--fs-xs); color: var(--text-muted); text-transform: uppercase;">Chapter High Score</div>
        <div style="font-size: var(--fs-xl); font-weight: 800; color: ${highScore > 0 ? 'var(--accent)' : 'var(--text-muted)'}">
          ${highScore > 0 ? `${highScore} Points` : 'No attempts yet'}
        </div>
      </div>
      <button class="option-btn correct" id="btn-start-session" style="padding: 0.85rem 2rem; border-radius: var(--radius-md); font-weight: 700; width: auto; font-size: var(--fs-base);">
        ⚡ Start Adaptive Session
      </button>
    </div>
  `;
  
  actionCard.querySelector('#btn-start-session').addEventListener('click', () => {
    startAdaptiveSession(ch.id);
  });
  
  view.appendChild(actionCard);
  return view;
}

// ───────── Adaptive Session Logic & Views ─────────

function startAdaptiveSession(chapterId) {
  state.activeSession = {
    chapterId: chapterId,
    currentStep: 0,
    totalSteps: 10,
    questions: [],      // array of 10 question objects generated
    userAnswers: [],    // array of user answers
    currentLevel: 'basic', // basic, intermediate, advanced, olympiad
    score: 500,         // starting score
    trajectory: [500],  // record of scores
    currentQuestion: null,
    answered: false,
    selectedOption: null,
    textInput: '',
    gradedCorrect: false
  };
  
  // Pre-generate the first question
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
  
  // Header details
  const header = document.createElement('div');
  header.className = 'worksheet-view__header';
  
  // Custom difficulty class mapping
  const levelColors = {
    basic: 'hsl(170, 75%, 55%)',
    intermediate: 'hsl(200, 70%, 55%)',
    advanced: 'hsl(35, 90%, 60%)',
    olympiad: 'hsl(340, 75%, 60%)'
  };
  const activeColor = levelColors[sess.currentLevel] || 'var(--accent)';
  
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span class="worksheet-view__level-badge" style="background: hsla(${activeColor.slice(4, -1)}, 0.15); color: ${activeColor}; border: 1px solid ${activeColor}; font-weight: 700; text-transform: uppercase;">
        ${sess.currentLevel}
      </span>
      <div style="font-size: var(--fs-sm); font-weight: 600; color: var(--text-secondary);">
        Question ${sess.currentStep + 1} of ${sess.totalSteps}
      </div>
    </div>
    <h2 class="worksheet-view__title" style="font-size: var(--fs-xl);">Ch ${ch.id}: ${ch.title}</h2>
    
    <!-- Progress Indicator Bar -->
    <div style="width: 100%; height: 6px; background: var(--bg-glass); border-radius: 99px; margin-top: 1rem; overflow: hidden;">
      <div style="width: ${((sess.currentStep) / sess.totalSteps) * 100}%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width 0.4s var(--ease-out);"></div>
    </div>
  `;
  view.appendChild(header);
  
  // Session Metrics Panel
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
      <span style="color: var(--text-muted); display: block; font-size: var(--fs-xs); text-transform: uppercase;">Ability Index</span>
      <strong style="color: var(--text-primary); font-size: var(--fs-lg); font-weight: 700;">${sess.score} pts</strong>
    </div>
    <div style="flex: 1; border-left: 1px solid var(--border-subtle); padding-left: 1.5rem;">
      <span style="color: var(--text-muted); display: block; font-size: var(--fs-xs); text-transform: uppercase;">Engine Mode</span>
      <strong style="color: ${activeColor}; font-size: var(--fs-lg); font-weight: 700; text-transform: capitalize;">${sess.currentLevel}</strong>
    </div>
  `;
  view.appendChild(metricsPanel);
  
  // Question Card
  const card = document.createElement('div');
  card.className = 'question-card';
  card.style.position = 'relative';
  
  // Question text
  const qHeader = document.createElement('div');
  qHeader.className = 'question-card__header';
  qHeader.innerHTML = `
    <div class="question-card__number">${sess.currentStep + 1}</div>
    <div class="question-card__type">${q.type === 'mcq' ? 'Multiple Choice' : 'Direct Solver'}</div>
  `;
  card.appendChild(qHeader);
  
  const qText = document.createElement('div');
  qText.className = 'question-card__text';
  qText.style.fontSize = 'var(--fs-lg)';
  qText.style.fontWeight = '500';
  qText.style.marginBottom = '1.75rem';
  qText.textContent = q.text;
  card.appendChild(qText);
  
  // User input structure
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
    // Fill in or short answer
    const inputContainer = document.createElement('div');
    inputContainer.className = 'answer-input';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Compute and type answer here...';
    input.value = sess.textInput || '';
    if (sess.answered) {
      input.disabled = true;
      if (sess.gradedCorrect) {
        input.style.borderColor = 'hsl(140, 60%, 50%)';
        input.style.background = 'hsla(140, 60%, 50%, 0.05)';
      } else {
        input.style.borderColor = 'hsl(0, 70%, 55%)';
        input.style.background = 'hsla(0, 70%, 55%, 0.05)';
      }
    }
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = sess.answered ? 'Submitted' : 'Submit';
    if (sess.answered) submitBtn.disabled = true;
    
    const triggerTextSubmit = () => {
      const val = input.value.trim();
      if (!val) return;
      submitAdaptiveAnswer(val);
    };
    
    submitBtn.addEventListener('click', triggerTextSubmit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerTextSubmit();
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);
    card.appendChild(inputContainer);
  }
  
  // In-line Solution Section (Visible once answered)
  if (sess.answered) {
    const solCard = document.createElement('div');
    solCard.className = 'solution-card';
    solCard.style.marginTop = '1.75rem';
    solCard.style.borderTop = '1px solid var(--border-subtle)';
    solCard.style.paddingTop = '1.5rem';
    
    solCard.innerHTML = `
      <p style="font-size: var(--fs-base); margin-bottom: 0.5rem;">
        <strong>${sess.gradedCorrect ? 'Correct Answer! 🎉' : 'Incorrect. Study the approach below: 💡'}</strong>
      </p>
      <p style="margin-bottom: 0.75rem; color: var(--text-primary);">
        <strong>Answer Key:</strong> ${q.type === 'mcq' ? q.options[q.answer] : q.answer}
      </p>
      <p style="color: var(--text-secondary); line-height: 1.6;">
        <strong>Solution Step-by-Step:</strong> ${q.solution}
      </p>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
        <button class="option-btn correct" id="btn-session-continue" style="padding: 0.75rem 2rem; border-radius: var(--radius-md); font-weight: 700; width: auto;">
          ${sess.currentStep + 1 === sess.totalSteps ? '🏁 Complete Session' : 'Next Question ➜'}
        </button>
      </div>
    `;
    
    solCard.querySelector('#btn-session-continue').addEventListener('click', () => {
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
    const cleanVal = userVal.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanAns = q.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
    isCorrect = cleanVal === cleanAns || userVal.trim() === q.answer;
  }
  
  sess.gradedCorrect = isCorrect;
  sess.answered = true;
  
  // Calculate GRE-style dynamic scale points
  const pointsDelta = {
    basic: isCorrect ? 50 : -25,
    intermediate: isCorrect ? 75 : -40,
    advanced: isCorrect ? 100 : -60,
    olympiad: isCorrect ? 150 : -80
  };
  
  const delta = pointsDelta[sess.currentLevel];
  sess.score = Math.max(200, Math.min(1000, sess.score + delta));
  sess.trajectory.push(sess.score);
  
  // Keep logs globally in userAnswers for progress calculations
  const globalKey = `adaptive_${sess.chapterId}_${Date.now()}`;
  state.userAnswers[globalKey] = {
    answered: true,
    correct: isCorrect,
    input: String(userVal)
  };
  
  // Update state adaptive counter
  state.adaptiveStats.totalAttempted++;
  if (isCorrect) state.adaptiveStats.totalCorrect++;
  
  saveState();
  updateStreak();
  
  // Re-render
  renderApp();
}

function advanceAdaptiveSession() {
  const sess = state.activeSession;
  if (!sess) return;
  
  if (sess.currentStep + 1 >= sess.totalSteps) {
    // End session! Save scores and transition to report
    const chId = sess.chapterId;
    const pastHigh = state.adaptiveStats.highScores[chId] || 0;
    if (sess.score > pastHigh) {
      state.adaptiveStats.highScores[chId] = sess.score;
    }
    state.adaptiveStats.sessionsCompleted++;
    saveState();
    
    navigateTo('session-report');
  } else {
    // Scale level
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
    
    // Generate next question (with duplicate detection to prevent repeating same/similar text)
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

// ───────── Post-Session Performance Report ─────────
function createSessionReportView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');
  
  const ch = chapters.find(c => c.id === sess.chapterId);
  const correctCount = sess.questions.filter((q, idx) => {
    const qAns = sess.selectedOption !== null ? sess.selectedOption : sess.textInput;
    if (q.type === 'mcq') {
      return sess.selectedOption === q.answer;
    } else {
      const cleanVal = String(sess.textInput).toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanAns = q.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanVal === cleanAns || String(sess.textInput).trim() === q.answer;
    }
  }).length;
  
  // Mastery title based on score
  let masteryLabel = 'Basic Practitioner';
  let masteryColor = 'hsl(170, 75%, 55%)';
  if (sess.score >= 850) {
    masteryLabel = 'Olympiad Grandmaster 👑';
    masteryColor = 'hsl(340, 75%, 60%)';
  } else if (sess.score >= 650) {
    masteryLabel = 'Advanced Specialist 🚀';
    masteryColor = 'hsl(35, 90%, 60%)';
  } else if (sess.score >= 450) {
    masteryLabel = 'Intermediate Scholar 📐';
    masteryColor = 'hsl(200, 70%, 55%)';
  }
  
  const view = document.createElement('div');
  view.className = 'worksheet-view';
  
  // Header
  const header = document.createElement('div');
  header.className = 'worksheet-view__header';
  header.innerHTML = `
    <h2 class="worksheet-view__title">Diagnostics Performance Summary</h2>
    <p class="section__subtitle">CBSE Class 7 Adaptive Evaluation breakdown for Chapter ${ch.id}: ${ch.title}</p>
  `;
  view.appendChild(header);
  
  // High level cards
  const summaryGrid = document.createElement('div');
  summaryGrid.style.display = 'grid';
  summaryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
  summaryGrid.style.gap = '1.25rem';
  summaryGrid.style.marginBottom = '2.5rem';
  
  summaryGrid.innerHTML = `
    <div class="stat-card" style="padding: 1.5rem;">
      <div class="stat-card__value" style="font-size: var(--fs-2xl);">${sess.score} pts</div>
      <div class="stat-card__label">Adaptive Score</div>
    </div>
    <div class="stat-card" style="padding: 1.5rem;">
      <div class="stat-card__value" style="font-size: var(--fs-2xl); color: ${masteryColor};">${correctCount} / ${sess.totalSteps}</div>
      <div class="stat-card__label">Accuracy Index</div>
    </div>
    <div class="stat-card" style="padding: 1.5rem; grid-column: span 1;">
      <div class="stat-card__value" style="font-size: var(--fs-lg); font-weight:800; white-space: normal; line-height:1.3; color: ${masteryColor};">${masteryLabel}</div>
      <div class="stat-card__label">Mastery Achievement</div>
    </div>
  `;
  view.appendChild(summaryGrid);
  
  // Custom SVG Interactive Curve Plot
  const graphCard = document.createElement('div');
  graphCard.className = 'question-card';
  graphCard.style.padding = '2rem';
  graphCard.style.marginBottom = '2.5rem';
  
  graphCard.innerHTML = `
    <h3 class="chapter-card__title" style="margin-bottom: 0.5rem; font-size: var(--fs-base);">Difficulty & Score Trajectory</h3>
    <p class="section__subtitle" style="margin-bottom: 2rem;">Adaptive index performance curve plotted after each problem.</p>
    
    <div style="width: 100%; overflow-x: auto; display: flex; justify-content: center; background: hsla(225, 20%, 12%, 0.4); border-radius: var(--radius-md); padding: 1.5rem 0;">
      <svg id="trajectory-svg" width="480" height="240" viewBox="0 0 480 240" style="overflow: visible; max-width: 100%;">
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="var(--accent-2)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        
        <!-- Benchmark Grid lines -->
        <line x1="40" y1="30" x2="450" y2="30" stroke="var(--border-subtle)" stroke-dasharray="4 4" />
        <text x="455" y="34" fill="var(--text-muted)" font-size="9px">1000 (Olympiad)</text>
        
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
  
  // Render Curve points asynchronously to match DOM ready
  setTimeout(() => {
    const svgEl = document.getElementById('trajectory-svg');
    if (!svgEl) return;
    
    const traj = sess.trajectory; // array of score values
    const pointsCount = traj.length;
    const xSpacing = 410 / (sess.totalSteps); // spacing over grid length 410
    
    // Map score value to SVG Y coordinates
    // SVG height is 240, plotting region is Y: 30 (score 1000) to 210 (score 200). Length is 180.
    const mapY = (sVal) => {
      const clamped = Math.max(200, Math.min(1000, sVal));
      return 210 - ((clamped - 200) / 800) * 180;
    };
    
    // Build path strings
    let dLine = '';
    let dArea = 'M 40 210';
    
    traj.forEach((scoreVal, index) => {
      const px = 40 + index * xSpacing;
      const py = mapY(scoreVal);
      
      if (index === 0) {
        dLine += `M ${px} ${py}`;
      } else {
        dLine += ` L ${px} ${py}`;
      }
      dArea += ` L ${px} ${py}`;
    });
    
    dArea += ` L ${40 + (pointsCount - 1) * xSpacing} 210 Z`;
    
    // Create Area Element
    const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPath.setAttribute("d", dArea);
    areaPath.setAttribute("fill", "url(#score-grad)");
    svgEl.appendChild(areaPath);
    
    // Create Line Element
    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", dLine);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "var(--accent)");
    linePath.setAttribute("stroke-width", "3.5");
    linePath.setAttribute("stroke-linecap", "round");
    linePath.setAttribute("stroke-linejoin", "round");
    svgEl.appendChild(linePath);
    
    // Create point markers
    traj.forEach((scoreVal, index) => {
      const px = 40 + index * xSpacing;
      const py = mapY(scoreVal);
      
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      
      const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      glow.setAttribute("cx", px);
      glow.setAttribute("cy", py);
      glow.setAttribute("r", "7");
      glow.setAttribute("fill", "var(--accent)");
      glow.setAttribute("opacity", "0.3");
      
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", px);
      dot.setAttribute("cy", py);
      dot.setAttribute("r", "4.5");
      dot.setAttribute("fill", "var(--bg-primary)");
      dot.setAttribute("stroke", "var(--accent)");
      dot.setAttribute("stroke-width", "2.5");
      
      // Label for step
      const stepTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      stepTxt.setAttribute("x", px);
      stepTxt.setAttribute("y", "230");
      stepTxt.setAttribute("fill", "var(--text-secondary)");
      stepTxt.setAttribute("font-size", "8px");
      stepTxt.setAttribute("text-anchor", "middle");
      stepTxt.textContent = index === 0 ? "Start" : `Q${index}`;
      
      group.appendChild(glow);
      group.appendChild(dot);
      svgEl.appendChild(group);
      svgEl.appendChild(stepTxt);
    });
  }, 50);
  
  // Review all questions
  const reviewWrapper = document.createElement('div');
  reviewWrapper.className = 'question-card';
  reviewWrapper.innerHTML = `<h3 class="chapter-card__title" style="margin-bottom: 1.5rem; font-size: var(--fs-lg);">Detailed Question Log Review</h3>`;
  
  sess.questions.forEach((q, qIndex) => {
    const detail = document.createElement('details');
    detail.style.borderBottom = '1px solid var(--border-subtle)';
    detail.style.padding = '1rem 0';
    detail.style.cursor = 'pointer';
    
    // Check correct
    let userAns = '';
    let isQCorrect = false;
    if (q.type === 'mcq') {
      const userSel = sess.questions === 10 ? sess.userAnswers[qIndex] : (qIndex === 0 ? sess.selectedOption : sess.userAnswers?.[qIndex]?.input || 'A'); // safe guards
      // Let's deduce correct from scores
      const finalIndex = sess.trajectory[qIndex + 1] > sess.trajectory[qIndex];
      isQCorrect = finalIndex;
      userAns = q.options[q.answer];
    } else {
      isQCorrect = sess.trajectory[qIndex + 1] > sess.trajectory[qIndex];
      userAns = q.answer;
    }
    
    const flagColor = isQCorrect ? 'hsl(140, 60%, 50%)' : 'hsl(0, 70%, 55%)';
    const statusTxt = isQCorrect ? '✔ Correct' : '✖ Incorrect';
    
    detail.innerHTML = `
      <summary style="display: flex; justify-content: space-between; align-items: center; list-style: none; font-weight: 500;">
        <span style="font-size: var(--fs-base); color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <span style="color: ${flagColor}; font-weight: 800;">${statusTxt}</span>
          <span>Question ${qIndex + 1} (${q.type === 'mcq' ? 'MCQ' : 'Short'})</span>
        </span>
        <span style="color: var(--text-muted); font-size: var(--fs-xs);">Click to Expand ➜</span>
      </summary>
      
      <div style="margin-top: 1rem; color: var(--text-secondary); cursor: default; font-size: var(--fs-sm); line-height: 1.6; padding-left: 0.5rem;">
        <p style="color: var(--text-primary); font-size: var(--fs-base); margin-bottom: 0.75rem;"><strong>Problem:</strong> ${q.text}</p>
        <p style="margin-bottom: 0.5rem;"><strong>Correct Answer Key:</strong> <span style="color: var(--text-primary); font-weight:600;">${userAns}</span></p>
        <p><strong>Step-by-step Explanation:</strong> ${q.solution}</p>
      </div>
    `;
    
    reviewWrapper.appendChild(detail);
  });
  
  view.appendChild(reviewWrapper);
  
  // Footer Action Buttons
  const foot = document.createElement('div');
  foot.style.display = 'flex';
  foot.style.justifyContent = 'center';
  foot.style.marginTop = '2.5rem';
  
  const returnBtn = document.createElement('button');
  returnBtn.className = 'option-btn correct';
  returnBtn.textContent = 'Return to Chapters';
  returnBtn.style.padding = '0.9rem 2.5rem';
  returnBtn.style.fontSize = 'var(--fs-base)';
  returnBtn.style.fontWeight = '700';
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

// Upgraded Dashboard View
function createDashboardView() {
  const view = document.createElement('div');
  view.className = 'dashboard';
  
  const { totalQuestions, correctQuestions, completionRate } = getStats();
  
  // Dashboard stats
  view.innerHTML = `
    <div class="worksheet-view__header">
      <h2 class="worksheet-view__title">Your Learning Dashboard</h2>
      <p class="section__subtitle">Detailed review of your interactive CBSE mathematics diagnostic program.</p>
    </div>
    
    <div class="dashboard__grid" style="margin-bottom: 2.5rem;">
      <div class="stat-card">
        <div class="stat-card__value">${correctQuestions} / ${totalQuestions}</div>
        <div class="stat-card__label">Problems Solved</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${state.adaptiveStats.sessionsCompleted}</div>
        <div class="stat-card__label">Sessions Logged</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${state.streak} Days</div>
        <div class="stat-card__label">Active Streak</div>
      </div>
    </div>
    
    <div class="question-card" style="margin-bottom: 2rem;">
      <h3 class="chapter-card__title" style="margin-bottom: 0.5rem;">Daily Attendance Calendar</h3>
      <p class="section__subtitle">Lock in your math skills with focused 20-minute daily drills.</p>
      <div class="streak-bar" id="dashboard-streak-bar"></div>
    </div>
  `;
  
  // Generate streak visualization
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
  
  // Chapter breakdown table/list
  const breakdown = document.createElement('div');
  breakdown.className = 'question-card';
  breakdown.innerHTML = `<h3 class="chapter-card__title" style="margin-bottom: 1rem;">Chapter Diagnostics Scores</h3>`;
  
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
    
    const scoreColor = high >= 800 ? 'hsl(340, 75%, 60%)' : high >= 600 ? 'hsl(35, 90%, 60%)' : high >= 400 ? 'hsl(200, 70%, 55%)' : 'var(--text-muted)';
    
    row.innerHTML = `
      <div style="font-size: var(--fs-sm); font-weight: 500;">
        Ch ${ch.id}: ${ch.title}
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
