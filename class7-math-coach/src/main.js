import './style.css';
import { chapters, worksheets } from './data.js';

// ───────── State Management ─────────
const state = {
  currentView: 'chapters', // 'chapters', 'worksheet', 'dashboard'
  selectedChapter: null,
  selectedLevel: 'basic', // 'basic', 'intermediate', 'advanced', 'olympiad'
  userAnswers: {}, // key: `${level}_${chapterId}_${qIndex}` -> { answered: boolean, correct: boolean, input: string }
  streak: 0,
  lastActiveDate: '',
  dailyStreakHistory: [] // array of YYYY-MM-DD
};

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('class7_math_coach_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
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
  if (!state.dailyStreakHistory) {
    state.dailyStreakHistory = [];
  }
  
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

// Get completion stats
function getStats() {
  let totalQuestions = 0;
  let correctQuestions = 0;

  // Count total questions across all levels
  Object.keys(worksheets).forEach(level => {
    worksheets[level].forEach((q, index) => {
      totalQuestions++;
      const key = `${level}_${q.chapter}_${index}`;
      if (state.userAnswers[key]?.correct) {
        correctQuestions++;
      }
    });
  });

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
    main.appendChild(createWorksheetView());
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
    <span>Progress</span>
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
      Class 7 CBSE Math Coach
    </div>
    <h1>Master Mathematics</h1>
    <p>Your premium interactive math companion. Track daily streaks, conquer CBSE chapters, and advance to Olympiad excellence.</p>
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
        <p class="section__subtitle">Select a topic below to begin your daily 20-minute drill.</p>
      </div>
    </div>
  `;
  
  const grid = document.createElement('div');
  grid.className = 'chapter-grid';
  
  chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.setProperty('--card-accent', ch.accent);
    
    // Calculate progress for this specific chapter
    let totalChQ = 0;
    let solvedChQ = 0;
    Object.keys(worksheets).forEach(level => {
      worksheets[level].forEach((q, idx) => {
        if (q.chapter === ch.id) {
          totalChQ++;
          if (state.userAnswers[`${level}_${ch.id}_${idx}`]?.correct) {
            solvedChQ++;
          }
        }
      });
    });
    
    const isDone = totalChQ > 0 && solvedChQ === totalChQ;
    const statusClass = isDone ? 'chapter-card__status--done' : 'chapter-card__status--new';
    const statusLabel = isDone ? '✓ Completed' : `${solvedChQ}/${totalChQ} Solved`;
    
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
      navigateTo('worksheet', { chapter: ch, level: 'basic' });
    });
    
    grid.appendChild(card);
  });
  
  section.appendChild(grid);
  return section;
}

// Worksheet View (Interactive Q&A)
function createWorksheetView() {
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
  header.innerHTML = `
    <span class="worksheet-view__level-badge worksheet-view__level-badge--${state.selectedLevel}">
      ${state.selectedLevel}
    </span>
    <h2 class="worksheet-view__title">Chapter ${ch.id}: ${ch.title}</h2>
    <p class="section__subtitle">${ch.summary}</p>
  `;
  view.appendChild(header);
  
  // Level Tabs
  const levels = ['basic', 'intermediate', 'advanced', 'olympiad'];
  const tabs = document.createElement('div');
  tabs.className = 'level-tabs';
  levels.forEach(lvl => {
    const tab = document.createElement('button');
    tab.className = `level-tab ${state.selectedLevel === lvl ? 'active' : ''}`;
    tab.textContent = lvl.charAt(0).toUpperCase() + lvl.slice(1);
    tab.addEventListener('click', () => {
      state.selectedLevel = lvl;
      renderApp();
    });
    tabs.appendChild(tab);
  });
  view.appendChild(tabs);
  
  // Filter questions for the selected level and chapter
  const questions = worksheets[state.selectedLevel]
    ? worksheets[state.selectedLevel].map((q, idx) => ({ ...q, originalIndex: idx })).filter(q => q.chapter === ch.id)
    : [];
  
  if (questions.length === 0) {
    const noQuestions = document.createElement('div');
    noQuestions.className = 'question-card';
    noQuestions.innerHTML = `<p class="question-card__text" style="color: var(--text-secondary); text-align: center;">No questions loaded for this level yet.</p>`;
    view.appendChild(noQuestions);
  } else {
    questions.forEach((q, qNum) => {
      const qIndex = q.originalIndex;
      const qKey = `${state.selectedLevel}_${ch.id}_${qIndex}`;
      const savedAns = state.userAnswers[qKey] || { answered: false, correct: false, input: '' };
      
      const card = document.createElement('div');
      card.className = 'question-card';
      
      // Question header
      const qHeader = document.createElement('div');
      qHeader.className = 'question-card__header';
      qHeader.innerHTML = `
        <div class="question-card__number">${qNum + 1}</div>
        <div class="question-card__type">${q.type === 'mcq' ? 'Multiple Choice' : q.type === 'fillin' ? 'Fill In the Blank' : 'Short Answer'}</div>
      `;
      card.appendChild(qHeader);
      
      // Question text
      const qText = document.createElement('div');
      qText.className = 'question-card__text';
      qText.textContent = q.text;
      card.appendChild(qText);
      
      // Question inputs based on type
      if (q.type === 'mcq') {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'question-card__options';
        
        q.options.forEach((opt, oIdx) => {
          const btn = document.createElement('button');
          btn.className = 'option-btn';
          
          if (savedAns.answered) {
            if (oIdx === q.answer) {
              btn.classList.add('correct');
            } else if (savedAns.input === String(oIdx)) {
              btn.classList.add('wrong');
            }
          } else {
            btn.addEventListener('click', () => {
              const isCorrect = oIdx === q.answer;
              state.userAnswers[qKey] = {
                answered: true,
                correct: isCorrect,
                input: String(oIdx)
              };
              saveState();
              updateStreak();
              renderApp();
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
        // short answer or fill in
        const inputContainer = document.createElement('div');
        inputContainer.className = 'answer-input';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type your answer here...';
        input.value = savedAns.input || '';
        if (savedAns.answered) {
          input.disabled = true;
          if (savedAns.correct) {
            input.style.borderColor = 'hsl(140, 60%, 50%)';
            input.style.background = 'hsla(140, 60%, 50%, 0.05)';
          } else {
            input.style.borderColor = 'hsl(0, 70%, 55%)';
            input.style.background = 'hsla(0, 70%, 55%, 0.05)';
          }
        }
        
        const submitBtn = document.createElement('button');
        submitBtn.textContent = savedAns.answered ? 'Submitted' : 'Submit';
        if (savedAns.answered) submitBtn.disabled = true;
        
        const handleTextSubmit = () => {
          const val = input.value.trim();
          if (!val) return;
          
          // Clean check for text matching
          const cleanVal = val.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanAns = q.answer.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isCorrect = cleanVal === cleanAns || val === q.answer;
          
          state.userAnswers[qKey] = {
            answered: true,
            correct: isCorrect,
            input: val
          };
          saveState();
          updateStreak();
          renderApp();
        };
        
        submitBtn.addEventListener('click', handleTextSubmit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') handleTextSubmit();
        });
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(submitBtn);
        card.appendChild(inputContainer);
      }
      
      // Solution section (visible if answered)
      if (savedAns.answered) {
        const solCard = document.createElement('div');
        solCard.className = 'solution-card';
        solCard.innerHTML = `
          <p><strong>${savedAns.correct ? 'Correct! 🎉' : 'Incorrect. 💡'}</strong></p>
          <p style="margin-top: 0.5rem;"><strong>Correct Answer:</strong> ${q.type === 'mcq' ? q.options[q.answer] : q.answer}</p>
          <p style="margin-top: 0.5rem;"><strong>Step-by-step Solution:</strong> ${q.solution}</p>
        `;
        card.appendChild(solCard);
      }
      
      view.appendChild(card);
    });
  }
  
  return view;
}

// Dashboard View
function createDashboardView() {
  const view = document.createElement('div');
  view.className = 'dashboard';
  
  const { totalQuestions, correctQuestions, completionRate } = getStats();
  
  // Dashboard stats
  view.innerHTML = `
    <div class="worksheet-view__header">
      <h2 class="worksheet-view__title">Your Learning Dashboard</h2>
      <p class="section__subtitle">Detailed review of your 200-day CBSE mathematics training program.</p>
    </div>
    
    <div class="dashboard__grid" style="margin-bottom: 2.5rem;">
      <div class="stat-card">
        <div class="stat-card__value">${correctQuestions} / ${totalQuestions}</div>
        <div class="stat-card__label">Problems Solved</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${completionRate}%</div>
        <div class="stat-card__label">Program Progress</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${state.streak} Days</div>
        <div class="stat-card__label">Active Streak</div>
      </div>
    </div>
    
    <div class="question-card" style="margin-bottom: 2rem;">
      <h3 class="chapter-card__title" style="margin-bottom: 0.5rem;">Weekly Attendance Heatmap</h3>
      <p class="section__subtitle">Consistently spend 20 minutes a day to lock in your math skills.</p>
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
  breakdown.innerHTML = `<h3 class="chapter-card__title" style="margin-bottom: 1rem;">Chapter Breakdown</h3>`;
  
  const list = document.createElement('div');
  list.style.display = 'grid';
  list.style.gap = '0.75rem';
  
  chapters.forEach(ch => {
    let tot = 0;
    let solved = 0;
    
    Object.keys(worksheets).forEach(level => {
      worksheets[level].forEach((q, idx) => {
        if (q.chapter === ch.id) {
          tot++;
          if (state.userAnswers[`${level}_${ch.id}_${idx}`]?.correct) {
            solved++;
          }
        }
      });
    });
    
    const pct = tot > 0 ? Math.round((solved / tot) * 100) : 0;
    
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '0.5rem 0';
    row.style.borderBottom = '1px solid var(--border-subtle)';
    
    row.innerHTML = `
      <div style="font-size: var(--fs-sm); font-weight: 500;">
        Ch ${ch.id}: ${ch.title}
      </div>
      <div style="font-size: var(--fs-sm); color: var(--text-secondary); display: flex; align-items: center; gap: 1rem;">
        <span>${solved}/${tot} solved</span>
        <strong style="color: ${pct === 100 ? 'hsl(140, 60%, 50%)' : 'var(--accent)'}">${pct}%</strong>
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
