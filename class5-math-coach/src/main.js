import './style.css';
import { chapters, worksheets } from './data.js';
import { generateQuestion } from './generators.js';
import { renderDiagram } from './diagrams.js';

// ───────── State Management ─────────
const state = {
  currentView: 'chapters', // 'chapters', 'worksheet', 'session', 'session-report', 'dashboard'
  selectedChapter: null,
  selectedLevel: 'basic', 
  userAnswers: {}, // key: `${level}_${chapterId}_${qIndex}` -> { answered: boolean, correct: boolean, input: string }
  streak: 0,
  lastActiveDate: '',
  dailyStreakHistory: [], // array of YYYY-MM-DD
  
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
  const saved = localStorage.getItem('class5_math_coach_state');
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
  localStorage.setItem('class5_math_coach_state', JSON.stringify(state));
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
  brand.onclick = () => navigateTo('chapters');
  
  const icon = document.createElement('div');
  icon.className = 'navbar__brand-icon';
  icon.textContent = 'M';
  
  const title = document.createElement('span');
  title.textContent = 'Math Magic Coach';
  
  brand.appendChild(icon);
  brand.appendChild(title);
  nav.appendChild(brand);
  
  const navLinks = document.createElement('div');
  navLinks.className = 'navbar__nav';
  
  const linkChapters = document.createElement('button');
  linkChapters.className = `navbar__link ${state.currentView === 'chapters' ? 'active' : ''}`;
  linkChapters.textContent = 'NCERT Chapters';
  linkChapters.onclick = () => navigateTo('chapters');
  
  const linkDash = document.createElement('button');
  linkDash.className = `navbar__link ${state.currentView === 'dashboard' ? 'active' : ''}`;
  linkDash.textContent = 'My Dashboard';
  linkDash.onclick = () => navigateTo('dashboard');
  
  navLinks.appendChild(linkChapters);
  navLinks.appendChild(linkDash);
  nav.appendChild(navLinks);
  
  const progressDiv = document.createElement('div');
  progressDiv.className = 'navbar__progress';
  
  const progressText = document.createElement('span');
  progressText.id = 'navbar-progress-text';
  progressText.textContent = '0% Done';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'navbar__progress-bar';
  
  const progressFill = document.createElement('div');
  progressFill.id = 'navbar-progress-fill';
  progressFill.className = 'navbar__progress-fill';
  progressFill.style.width = '0%';
  
  progressBar.appendChild(progressFill);
  progressDiv.appendChild(progressText);
  progressDiv.appendChild(progressBar);
  nav.appendChild(progressDiv);
  
  return nav;
}

function renderNavbarProgress() {
  const stats = getStats();
  const fillEl = document.getElementById('navbar-progress-fill');
  const textEl = document.getElementById('navbar-progress-text');
  if (fillEl && textEl) {
    fillEl.style.width = `${stats.completionRate}%`;
    textEl.textContent = `${stats.completionRate}% Done`;
  }
}

// Hero Section
function createHero() {
  const hero = document.createElement('section');
  hero.className = 'hero';
  
  const badge = document.createElement('div');
  badge.className = 'hero__badge';
  
  const dot = document.createElement('div');
  dot.className = 'hero__badge-dot';
  
  const badgeText = document.createElement('span');
  badgeText.textContent = 'NCERT Class 5 Math-Magic';
  
  badge.appendChild(dot);
  badge.appendChild(badgeText);
  hero.appendChild(badge);
  
  const h1 = document.createElement('h1');
  h1.textContent = 'Step into the Magical World of Math!';
  hero.appendChild(h1);
  
  const p = document.createElement('p');
  p.textContent = 'Embark on a beautiful math journey across all 14 chapters. Master place values with fish tales, explore shapes and degree clocks, and unlock standard formulas.';
  hero.appendChild(p);
  
  const stats = document.createElement('div');
  stats.className = 'hero__stats';
  
  const statsInfo = getStats();
  
  const stat1 = createStatCard('🔥 Streak', `${state.streak} Days`, 'Daily Study Streak');
  const stat2 = createStatCard('⭐ Solved', statsInfo.correctQuestions, 'Problems Mastered');
  const stat3 = createStatCard('🏆 Score', `${statsInfo.completionRate}%`, 'Overall Accuracy');
  
  stats.appendChild(stat1);
  stats.appendChild(stat2);
  stats.appendChild(stat3);
  hero.appendChild(stats);
  
  return hero;
}

function createStatCard(emoji, value, label) {
  const card = document.createElement('div');
  card.className = 'hero__stat';
  
  const valEl = document.createElement('div');
  valEl.className = 'hero__stat-value';
  valEl.textContent = value;
  
  const labelEl = document.createElement('div');
  labelEl.className = 'hero__stat-label';
  labelEl.textContent = `${emoji} · ${label}`;
  
  card.appendChild(valEl);
  card.appendChild(labelEl);
  return card;
}

// Chapters Grid
function createChaptersGrid() {
  const section = document.createElement('section');
  section.className = 'section';
  
  const header = document.createElement('div');
  header.className = 'section__header';
  
  const title = document.createElement('h2');
  title.className = 'section__title';
  title.textContent = 'Explore Math Chapters';
  
  header.appendChild(title);
  section.appendChild(header);
  
  const grid = document.createElement('div');
  grid.className = 'chapters-grid';
  
  chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.setProperty('--chapter-accent', ch.accent);
    card.onclick = () => navigateTo('worksheet', { chapter: ch });
    
    const num = document.createElement('div');
    num.className = 'chapter-card__num';
    num.textContent = `Chapter ${ch.id}`;
    
    const cTitle = document.createElement('h3');
    cTitle.className = 'chapter-card__title';
    cTitle.textContent = ch.title;
    
    const summary = document.createElement('p');
    summary.className = 'chapter-card__summary';
    summary.textContent = ch.summary;
    
    const topics = document.createElement('div');
    topics.className = 'chapter-card__topics';
    ch.topics.slice(0, 3).forEach(t => {
      const topic = document.createElement('span');
      topic.className = 'chapter-card__topic';
      topic.textContent = t;
      topics.appendChild(topic);
    });
    
    card.appendChild(num);
    card.appendChild(cTitle);
    card.appendChild(summary);
    card.appendChild(topics);
    grid.appendChild(card);
  });
  
  section.appendChild(grid);
  return section;
}

// Chapter Dashboard View
function createChapterDashboardView() {
  const ch = state.selectedChapter;
  if (!ch) return document.createElement('div');
  
  const section = document.createElement('section');
  section.className = 'section';
  
  const backBtn = document.createElement('button');
  backBtn.className = 'btn-secondary';
  backBtn.textContent = '← Back to Chapters';
  backBtn.onclick = () => navigateTo('chapters');
  backBtn.style.marginBottom = '2rem';
  section.appendChild(backBtn);
  
  const headerCard = document.createElement('div');
  headerCard.className = 'session-card';
  headerCard.style.borderTop = `6px solid ${ch.accent}`;
  
  const num = document.createElement('div');
  num.className = 'chapter-card__num';
  num.textContent = `Chapter ${ch.id}`;
  
  const title = document.createElement('h2');
  title.className = 'hero h1';
  title.style.fontSize = 'var(--fs-2xl)';
  title.style.padding = '0';
  title.style.textAlign = 'left';
  title.textContent = ch.title;
  
  const p = document.createElement('p');
  p.className = 'chapter-card__summary';
  p.style.fontSize = 'var(--fs-lg)';
  p.textContent = ch.summary;
  
  const topicsDiv = document.createElement('div');
  topicsDiv.className = 'chapter-card__topics';
  ch.topics.forEach(t => {
    const topic = document.createElement('span');
    topic.className = 'chapter-card__topic';
    topic.textContent = t;
    topicsDiv.appendChild(topic);
  });
  
  headerCard.appendChild(num);
  headerCard.appendChild(title);
  headerCard.appendChild(p);
  headerCard.appendChild(topicsDiv);
  section.appendChild(headerCard);
  
  // Practice Action Tiers
  const tierContainer = document.createElement('div');
  tierContainer.style.marginTop = '3rem';
  tierContainer.style.display = 'flex';
  tierContainer.style.flexDirection = 'column';
  tierContainer.style.gap = '1.5rem';
  
  const levels = [
    { key: 'basic', title: '🌸 Basic Practice', desc: 'Gentle, friendly problems to test foundational understanding.' },
    { key: 'intermediate', title: '✨ Intermediate Challenge', desc: 'Standard word problems, calculations, and visual puzzles.' },
    { key: 'advanced', title: '🚀 Advanced Magic', desc: 'Deeper logic problems that require thinking outside the box.' },
    { key: 'olympiad', title: '🏆 Olympiad Wizardry', desc: 'Prestigious, brain-twisting competition-level mathematical mysteries.' }
  ];
  
  levels.forEach(level => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.flexDirection = 'row';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'space-between';
    card.style.flexWrap = 'wrap';
    card.style.gap = '1.5rem';
    
    const info = document.createElement('div');
    info.style.flex = '1';
    
    const lTitle = document.createElement('h3');
    lTitle.className = 'chapter-card__title';
    lTitle.textContent = level.title;
    
    const lDesc = document.createElement('p');
    lDesc.className = 'chapter-card__summary';
    lDesc.style.margin = '0';
    lDesc.textContent = level.desc;
    
    info.appendChild(lTitle);
    info.appendChild(lDesc);
    card.appendChild(info);
    
    const startBtn = document.createElement('button');
    startBtn.className = 'submit-btn';
    startBtn.textContent = 'Start Journey';
    startBtn.onclick = () => startPracticeSession(ch.id, level.key);
    card.appendChild(startBtn);
    
    tierContainer.appendChild(card);
  });
  
  section.appendChild(tierContainer);
  
  return section;
}

// Launch Adaptive Session
function startPracticeSession(chapterId, level) {
  // Handcraft a session of 5 questions
  const chWorksheets = worksheets[level].filter(q => q.chapter === chapterId);
  const sessionQuestions = [...chWorksheets];
  
  // Fill remaining slots using the generator
  while (sessionQuestions.length < 5) {
    const generated = generateQuestion(chapterId, level);
    sessionQuestions.push(generated);
  }
  
  state.activeSession = {
    chapterId,
    level,
    questions: sessionQuestions.slice(0, 5),
    currentIndex: 0,
    answers: [], // boolean correctness
    startTime: Date.now()
  };
  
  navigateTo('session');
}

// Active Practice Session (ONE Question at a time)
function createActiveSessionView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');
  
  const q = sess.questions[sess.currentIndex];
  
  const container = document.createElement('div');
  container.className = 'session-container';
  
  const exitBtn = document.createElement('button');
  exitBtn.className = 'btn-secondary';
  exitBtn.textContent = '← Abandone Journey';
  exitBtn.onclick = () => navigateTo('chapters');
  exitBtn.style.alignSelf = 'flex-start';
  container.appendChild(exitBtn);
  
  const card = document.createElement('div');
  card.className = 'session-card';
  
  const header = document.createElement('div');
  header.className = 'session-header';
  
  const title = document.createElement('div');
  title.className = 'session-title';
  title.textContent = `Problem ${sess.currentIndex + 1} of 5`;
  
  const progressText = document.createElement('div');
  progressText.className = 'session-progress-text';
  progressText.textContent = `${sess.level.toUpperCase()}`;
  
  header.appendChild(title);
  header.appendChild(progressText);
  card.appendChild(header);
  
  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.textContent = q.text;
  card.appendChild(qText);

  // Render SVG diagram if available
  const diagramHtml = renderDiagram(q);
  if (diagramHtml) {
    const diagramContainer = document.createElement('div');
    diagramContainer.innerHTML = diagramHtml;
    card.appendChild(diagramContainer);
  }
  
  const answerSection = document.createElement('div');
  answerSection.id = 'answer-section';
  
  let selectedMCQIndex = null;
  
  if (q.type === 'mcq') {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      
      const badge = document.createElement('div');
      badge.className = 'option-badge';
      badge.textContent = String.fromCharCode(65 + idx); // A, B, C, D
      
      const label = document.createElement('span');
      label.textContent = opt;
      
      btn.appendChild(badge);
      btn.appendChild(label);
      
      btn.onclick = () => {
        const active = grid.querySelector('.selected');
        if (active) active.classList.remove('selected');
        btn.classList.add('selected');
        selectedMCQIndex = idx;
      };
      
      grid.appendChild(btn);
    });
    
    answerSection.appendChild(grid);
  } else {
    // short answer or fillin
    const container = document.createElement('div');
    container.className = 'short-answer-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = q.type === 'fillin' ? 'Type the missing word or number...' : 'Type your answer here...';
    input.id = 'text-answer-input';
    
    container.appendChild(input);
    answerSection.appendChild(container);
  }
  
  card.appendChild(answerSection);
  
  // Submit & Next Controls
  const controlDiv = document.createElement('div');
  controlDiv.style.display = 'flex';
  controlDiv.style.flexDirection = 'column';
  controlDiv.style.gap = '1rem';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Submit Magical Answer';
  
  submitBtn.onclick = () => {
    let isCorrect = false;
    let userAnsStr = "";
    
    if (q.type === 'mcq') {
      if (selectedMCQIndex === null) {
        alert('Please choose an answer first!');
        return;
      }
      isCorrect = (selectedMCQIndex === q.answer);
      userAnsStr = q.options[selectedMCQIndex];
    } else {
      const inputEl = document.getElementById('text-answer-input');
      const val = inputEl ? inputEl.value.trim() : "";
      if (!val) {
        alert('Please type an answer first!');
        return;
      }
      isCorrect = (val.toLowerCase() === q.answer.toLowerCase());
      userAnsStr = val;
    }
    
    // Save to user history
    sess.answers.push(isCorrect);
    
    // Update total stats
    state.adaptiveStats.totalAttempted++;
    if (isCorrect) state.adaptiveStats.totalCorrect++;
    
    // Show Feedback Box
    answerSection.innerHTML = '';
    submitBtn.style.display = 'none';
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback-box';
    feedback.style.borderLeftColor = isCorrect ? 'var(--accent-4)' : 'var(--accent-3)';
    
    const status = document.createElement('div');
    status.className = `feedback-status ${isCorrect ? 'correct' : 'incorrect'}`;
    status.textContent = isCorrect ? '✨ Magnificent! Correct!' : '🌸 Oh, almost! Keep learning!';
    
    const userSummary = document.createElement('p');
    userSummary.innerHTML = `Your Answer: <strong>${userAnsStr}</strong><br>Correct Answer: <strong>${q.type === 'mcq' ? q.options[q.answer] : q.answer}</strong>`;
    userSummary.style.fontSize = 'var(--fs-sm)';
    
    const expl = document.createElement('p');
    expl.className = 'explanation-text';
    expl.innerHTML = `<strong>Explanation:</strong> ${q.solution}`;
    
    feedback.appendChild(status);
    feedback.appendChild(userSummary);
    feedback.appendChild(expl);
    answerSection.appendChild(feedback);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'submit-btn';
    nextBtn.textContent = sess.currentIndex < 4 ? 'Next Question →' : 'View Session Report →';
    nextBtn.onclick = () => {
      if (sess.currentIndex < 4) {
        sess.currentIndex++;
        navigateTo('session');
      } else {
        // End of session
        state.adaptiveStats.sessionsCompleted++;
        
        // Save chapter high scores
        const score = sess.answers.filter(a => a).length;
        const previousHigh = state.adaptiveStats.highScores[sess.chapterId] || 0;
        if (score > previousHigh) {
          state.adaptiveStats.highScores[sess.chapterId] = score;
        }
        
        saveState();
        navigateTo('session-report');
      }
    };
    controlDiv.appendChild(nextBtn);
  };
  
  controlDiv.appendChild(submitBtn);
  card.appendChild(controlDiv);
  
  container.appendChild(card);
  return container;
}

// Session Report View
function createSessionReportView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');
  
  const ch = chapters.find(c => c.id === sess.chapterId);
  const correctCount = sess.answers.filter(a => a).length;
  
  const container = document.createElement('div');
  container.className = 'session-container';
  
  const card = document.createElement('div');
  card.className = 'session-card';
  card.style.borderTop = `8px solid ${ch ? ch.accent : 'var(--accent)'}`;
  
  const title = document.createElement('h2');
  title.className = 'hero h1';
  title.style.fontSize = 'var(--fs-xl)';
  title.style.padding = '0';
  title.style.textAlign = 'center';
  title.textContent = '🌟 Journey Report 🌟';
  card.appendChild(title);
  
  const text = document.createElement('p');
  text.style.textAlign = 'center';
  text.style.fontSize = 'var(--fs-lg)';
  text.innerHTML = `You completed your math journey for <strong>${ch ? ch.title : 'Chapter'}</strong> on <strong>${sess.level.toUpperCase()}</strong>!`;
  card.appendChild(text);
  
  // Score grid
  const scoreGrid = document.createElement('div');
  scoreGrid.className = 'dashboard-grid';
  
  const sCard1 = document.createElement('div');
  sCard1.className = 'dashboard-card';
  const val1 = document.createElement('div');
  val1.className = 'dashboard-card__val';
  val1.textContent = `${correctCount} / 5`;
  const lbl1 = document.createElement('div');
  lbl1.className = 'dashboard-card__label';
  lbl1.textContent = 'Problems Correct';
  sCard1.appendChild(val1);
  sCard1.appendChild(lbl1);
  
  const sCard2 = document.createElement('div');
  sCard2.className = 'dashboard-card';
  const val2 = document.createElement('div');
  val2.className = 'dashboard-card__val';
  val2.textContent = `${Math.round((correctCount/5)*100)}%`;
  const lbl2 = document.createElement('div');
  lbl2.className = 'dashboard-card__label';
  lbl2.textContent = 'Journey Score';
  sCard2.appendChild(val2);
  sCard2.appendChild(lbl2);
  
  scoreGrid.appendChild(sCard1);
  scoreGrid.appendChild(sCard2);
  card.appendChild(scoreGrid);
  
  // Highscore message
  const isPerfect = (correctCount === 5);
  const msgBox = document.createElement('div');
  msgBox.className = 'feedback-box';
  msgBox.style.borderLeftColor = isPerfect ? 'var(--accent-4)' : 'var(--accent)';
  
  const msgTitle = document.createElement('div');
  msgTitle.className = 'feedback-status correct';
  msgTitle.textContent = isPerfect ? '👑 Perfect Score Achievement!' : '✨ Splendid Effort!';
  
  const msgText = document.createElement('p');
  msgText.className = 'explanation-text';
  msgText.textContent = isPerfect 
    ? 'Stunning! You answered every question flawlessly. You have earned a Magic Golden Star!'
    : 'Fantastic job! Keep practicing to get a perfect score next time.';
  
  msgBox.appendChild(msgTitle);
  msgBox.appendChild(msgText);
  card.appendChild(msgBox);
  
  const returnBtn = document.createElement('button');
  returnBtn.className = 'submit-btn';
  returnBtn.textContent = 'Return to Chapter Dashboard';
  returnBtn.onclick = () => {
    state.activeSession = null;
    navigateTo('worksheet', { chapter: ch });
  };
  card.appendChild(returnBtn);
  
  container.appendChild(card);
  return container;
}

// Personal Study Dashboard
function createDashboardView() {
  const section = document.createElement('section');
  section.className = 'section';
  
  const title = document.createElement('h2');
  title.className = 'section__title';
  title.textContent = 'My Magical Learning Dashboard';
  title.style.marginBottom = '2.5rem';
  section.appendChild(title);
  
  const stats = getStats();
  
  const grid = document.createElement('div');
  grid.className = 'dashboard-grid';
  
  const card1 = createDashboardStatCard('🔥 Streak', `${state.streak} Days`, 'Keep practicing daily to grow your streak!');
  const card2 = createDashboardStatCard('⭐ Mastered', stats.correctQuestions, 'Total math problems solved correctly.');
  const card3 = createDashboardStatCard('🎯 Accuracy', `${stats.completionRate}%`, 'Accuracy across all answers.');
  const card4 = createDashboardStatCard('🎒 Sessions', state.adaptiveStats.sessionsCompleted || 0, 'Completed study sessions.');
  
  grid.appendChild(card1);
  grid.appendChild(card2);
  grid.appendChild(card3);
  grid.appendChild(card4);
  section.appendChild(grid);
  
  // Chapter Achievements
  const subTitle = document.createElement('h3');
  subTitle.className = 'section__title';
  subTitle.textContent = 'My Chapter High Scores';
  subTitle.style.margin = '3rem 0 1.5rem';
  section.appendChild(subTitle);
  
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '1rem';
  
  chapters.forEach(ch => {
    const row = document.createElement('div');
    row.className = 'chapter-card';
    row.style.setProperty('--chapter-accent', ch.accent);
    row.style.flexDirection = 'row';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '1.2rem 2rem';
    
    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.flexDirection = 'column';
    
    const cTitle = document.createElement('span');
    cTitle.style.fontWeight = '700';
    cTitle.textContent = ch.title;
    
    const num = document.createElement('span');
    num.style.fontSize = 'var(--fs-xs)';
    num.style.color = 'var(--text-muted)';
    num.textContent = `Chapter ${ch.id}`;
    
    left.appendChild(cTitle);
    left.appendChild(num);
    row.appendChild(left);
    
    const scoreVal = state.adaptiveStats.highScores[ch.id] || 0;
    
    const score = document.createElement('div');
    score.style.fontFamily = 'var(--font-title)';
    score.style.fontWeight = '800';
    score.style.fontSize = 'var(--fs-lg)';
    score.style.color = scoreVal > 0 ? 'var(--accent-4)' : 'var(--text-muted)';
    score.textContent = scoreVal > 0 ? `⭐ ${scoreVal} / 5` : 'Not Started';
    
    row.appendChild(score);
    list.appendChild(row);
  });
  
  section.appendChild(list);
  return section;
}

function createDashboardStatCard(title, value, desc) {
  const card = document.createElement('div');
  card.className = 'dashboard-card';
  
  const val = document.createElement('div');
  val.className = 'dashboard-card__val';
  val.textContent = value;
  
  const lbl = document.createElement('div');
  lbl.className = 'dashboard-card__label';
  lbl.textContent = title;
  
  const d = document.createElement('p');
  d.className = 'chapter-card__summary';
  d.style.margin = '1rem 0 0';
  d.style.fontSize = 'var(--fs-xs)';
  d.textContent = desc;
  
  card.appendChild(val);
  card.appendChild(lbl);
  card.appendChild(d);
  return card;
}

// Initialize Application
loadState();
renderApp();
