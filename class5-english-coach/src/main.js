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
  const saved = localStorage.getItem('class5_english_coach_state');
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
  localStorage.setItem('class5_english_coach_state', JSON.stringify(state));
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
  } else if (!state.lastActiveDate) {
    state.lastActiveDate = today;
    state.streak = 1;
    saveState();
  }
}

// Get overall stats
function getStats() {
  let totalWorksheet = 0;
  let correctWorksheet = 0;

  // Static worksheets stats
  Object.keys(worksheets).forEach(level => {
    worksheets[level].forEach((q, index) => {
      totalWorksheet++;
      const key = `${level}_${q.chapter}_${index}`;
      if (state.userAnswers[key]?.correct) {
        correctWorksheet++;
      }
    });
  });

  const adaptiveAttempted = state.adaptiveStats?.totalAttempted || 0;
  const adaptiveCorrect = state.adaptiveStats?.totalCorrect || 0;

  const totalAttempted = Object.keys(state.userAnswers).length + adaptiveAttempted;
  const totalCorrect = Object.keys(state.userAnswers).filter(k => state.userAnswers[k].correct).length + adaptiveCorrect;

  const completionRate = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const totalFinishedWorksheets = Math.round((correctWorksheet / totalWorksheet) * 100);

  return { totalAttempted, totalCorrect, completionRate, totalFinishedWorksheets };
}

// Check Badge Status
function getBadges() {
  const stats = getStats();
  return [
    {
      id: "grammar_rookie",
      name: "Grammar Rookie",
      desc: "Answer 5 questions correctly across worksheets or adaptive runs.",
      icon: "🌱",
      unlocked: stats.totalCorrect >= 5
    },
    {
      id: "noun_ninja",
      name: "Noun Ninja",
      desc: "Perfect score on Chapter 1 (Nouns) basic worksheet.",
      icon: "🎯",
      unlocked: worksheets.basic.filter(q => q.chapter === 1).every((q, idx) => state.userAnswers[`basic_1_${idx}`]?.correct)
    },
    {
      id: "tense_titan",
      name: "Tense Titan",
      desc: "Complete the Chapter 4 (Verbs & Tenses) intermediate worksheet perfectly.",
      icon: "⏳",
      unlocked: worksheets.intermediate.filter(q => q.chapter === 4).every((q, idx) => state.userAnswers[`intermediate_4_${idx}`]?.correct)
    },
    {
      id: "preposition_pilot",
      name: "Preposition Pilot",
      desc: "Complete prepositions worksheet questions with >80% accuracy.",
      icon: "✈️",
      unlocked: Object.keys(state.userAnswers).filter(k => k.includes("_7_") && state.userAnswers[k].correct).length >= 3
    },
    {
      id: "olympiad_overlord",
      name: "Olympiad Overlord",
      desc: "Correctly answer any 4 Olympiad worksheet questions.",
      icon: "👑",
      unlocked: Object.keys(state.userAnswers).filter(k => k.startsWith("olympiad_") && state.userAnswers[k].correct).length >= 4
    },
    {
      id: "streak_champion",
      name: "Streak Champion",
      desc: "Build an active learning streak of at least 2 days.",
      icon: "🔥",
      unlocked: state.streak >= 2
    }
  ];
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
  icon.textContent = 'E';
  
  const title = document.createElement('span');
  title.textContent = 'English Coach';
  
  brand.appendChild(icon);
  brand.appendChild(title);
  nav.appendChild(brand);
  
  const navLinks = document.createElement('div');
  navLinks.className = 'navbar__nav';
  
  const linkChapters = document.createElement('button');
  linkChapters.className = `navbar__link ${state.currentView === 'chapters' ? 'active' : ''}`;
  linkChapters.textContent = 'NCERT Grammar';
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
  progressText.textContent = '0% Mastered';
  
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
  const textEl = document.getElementById('navbar-progress-text');
  const fillEl = document.getElementById('navbar-progress-fill');
  if (textEl && fillEl) {
    const stats = getStats();
    textEl.textContent = `${stats.totalFinishedWorksheets}% Mastered`;
    fillEl.style.width = `${stats.totalFinishedWorksheets}%`;
  }
}

// Hero Section
function createHero() {
  const section = document.createElement('section');
  section.className = 'hero';
  
  const content = document.createElement('div');
  content.className = 'hero__content';
  
  const badge = document.createElement('span');
  badge.className = 'hero__badge';
  badge.textContent = 'NCERT Class 5 Grammar (Marigold)';
  
  const title = document.createElement('h1');
  title.className = 'hero__title';
  title.textContent = 'Master English Grammar!';
  
  const desc = document.createElement('p');
  desc.className = 'hero__desc';
  desc.textContent = 'Practice nouns, pronouns, tenses, subject-verb agreement and more. Level up with extensive worksheet banks and infinite generators!';
  
  const meta = document.createElement('div');
  meta.className = 'hero__meta';
  
  const stats = getStats();
  
  const statStreak = document.createElement('div');
  statStreak.className = 'hero__stat';
  const valStreak = document.createElement('span');
  valStreak.className = 'hero__stat-val';
  valStreak.innerHTML = `🔥 ${state.streak} Days`;
  const labelStreak = document.createElement('span');
  labelStreak.className = 'hero__stat-label';
  labelStreak.textContent = 'Study Streak';
  statStreak.appendChild(valStreak);
  statStreak.appendChild(labelStreak);
  
  const statAcc = document.createElement('div');
  statAcc.className = 'hero__stat';
  const valAcc = document.createElement('span');
  valAcc.className = 'hero__stat-val';
  valAcc.textContent = `${stats.completionRate}%`;
  const labelAcc = document.createElement('span');
  labelAcc.className = 'hero__stat-label';
  labelAcc.textContent = 'Grammar Accuracy';
  statAcc.appendChild(valAcc);
  statAcc.appendChild(labelAcc);
  
  meta.appendChild(statStreak);
  meta.appendChild(statAcc);
  
  content.appendChild(badge);
  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(meta);
  
  const art = document.createElement('div');
  art.className = 'hero__art';
  art.textContent = '📖';
  
  section.appendChild(content);
  section.appendChild(art);
  
  return section;
}

// Chapters Grid
function createChaptersGrid() {
  const container = document.createElement('div');
  
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.innerHTML = '🎯 Explore Grammar Units';
  container.appendChild(title);
  
  const grid = document.createElement('div');
  grid.className = 'chapters-grid';
  
  chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.style.setProperty('--accent-color', ch.accent);
    card.style.setProperty('--accent-bg', ch.accent.replace('60%', '95%').replace('55%', '95%').replace('50%', '95%').replace('45%', '95%'));
    card.onclick = () => navigateTo('worksheet', { chapter: ch });
    
    const line = document.createElement('div');
    line.className = 'chapter-card__accent-line';
    card.appendChild(line);
    
    const header = document.createElement('div');
    header.className = 'chapter-card__header';
    
    const num = document.createElement('span');
    num.className = 'chapter-card__num';
    num.textContent = `Unit ${ch.id}`;
    
    header.appendChild(num);
    card.appendChild(header);
    
    const details = document.createElement('div');
    
    const cTitle = document.createElement('h3');
    cTitle.className = 'chapter-card__title';
    cTitle.textContent = ch.title;
    
    const cDesc = document.createElement('p');
    cDesc.className = 'chapter-card__desc';
    cDesc.textContent = ch.summary;
    
    const cTopics = document.createElement('div');
    cTopics.className = 'chapter-card__topics';
    ch.topics.slice(0, 3).forEach(t => {
      const topic = document.createElement('span');
      topic.className = 'chapter-card__topic-badge';
      topic.textContent = t;
      cTopics.appendChild(topic);
    });
    
    details.appendChild(cTitle);
    details.appendChild(cDesc);
    details.appendChild(cTopics);
    card.appendChild(details);
    
    const footer = document.createElement('div');
    footer.className = 'chapter-card__footer';
    
    // Calc completed worksheet questions for this chapter
    const answeredCount = Object.keys(state.userAnswers).filter(k => k.includes(`_${ch.id}_`)).length;
    const statText = document.createElement('span');
    statText.className = 'chapter-card__stat';
    statText.textContent = `${answeredCount} questions saved`;
    
    const btn = document.createElement('button');
    btn.className = 'chapter-card__btn';
    btn.textContent = 'Practice';
    
    footer.appendChild(statText);
    footer.appendChild(btn);
    card.appendChild(footer);
    
    grid.appendChild(card);
  });
  
  container.appendChild(grid);
  return container;
}

// Chapter Dashboard View
function createChapterDashboardView() {
  const ch = state.selectedChapter;
  if (!ch) return document.createElement('div');
  
  const container = document.createElement('div');
  
  const back = document.createElement('button');
  back.className = 'back-btn';
  back.innerHTML = '← Back to Chapters';
  back.onclick = () => navigateTo('chapters');
  container.appendChild(back);
  
  const header = document.createElement('div');
  header.className = 'chapter-header';
  
  const title = document.createElement('h2');
  title.className = 'chapter-header__title';
  title.textContent = `Unit ${ch.id}: ${ch.title}`;
  
  const desc = document.createElement('p');
  desc.className = 'chapter-header__desc';
  desc.textContent = ch.summary;
  
  header.appendChild(title);
  header.appendChild(desc);
  container.appendChild(header);
  
  const secTitle = document.createElement('h3');
  secTitle.className = 'section-title';
  secTitle.textContent = '⚡ Select Practice Mode';
  container.appendChild(secTitle);
  
  const grid = document.createElement('div');
  grid.className = 'mode-grid';
  
  // 4 difficulty levels for static worksheets
  const levels = [
    { id: 'basic', name: '🟢 Basic Grammar', desc: 'Focus on core rules, fundamental nouns/verbs, and simple sentences.' },
    { id: 'intermediate', name: '🟡 Intermediate', desc: 'Intermediate tenses, collective nouns, proper determiners.' },
    { id: 'advanced', name: '🟠 Advanced', desc: 'Complex subject-verb agreement, adverbs of degree, and proper syntax.' },
    { id: 'olympiad', name: '🔴 Olympiad Elite', desc: 'Highly challenging sentence structures, absolute modifiers, complex prepositions.' }
  ];
  
  levels.forEach(lvl => {
    const card = document.createElement('div');
    card.className = 'mode-card';
    
    const mIcon = document.createElement('div');
    mIcon.className = 'mode-card__icon';
    mIcon.textContent = lvl.id === 'basic' ? '📗' : lvl.id === 'intermediate' ? '📙' : lvl.id === 'advanced' ? '📘' : '🏆';
    
    const mTitle = document.createElement('h4');
    mTitle.className = 'mode-card__title';
    mTitle.textContent = lvl.name;
    
    const mDesc = document.createElement('p');
    mDesc.className = 'mode-card__desc';
    mDesc.textContent = lvl.desc;
    
    const btn = document.createElement('button');
    btn.className = 'mode-card__btn mode-card__btn--outline';
    btn.textContent = `Start Worksheet`;
    btn.onclick = () => startSession(ch.id, lvl.id, 'worksheet');
    
    card.appendChild(mIcon);
    card.appendChild(mTitle);
    card.appendChild(mDesc);
    card.appendChild(btn);
    grid.appendChild(card);
  });
  
  // Adaptive Infinite Practice Card
  const adaptCard = document.createElement('div');
  adaptCard.className = 'mode-card premium';
  
  const aIcon = document.createElement('div');
  aIcon.className = 'mode-card__icon';
  aIcon.textContent = '⚡';
  
  const aTitle = document.createElement('h4');
  aTitle.className = 'mode-card__title';
  aTitle.textContent = 'Infinite Adaptive Coach';
  
  const aDesc = document.createElement('p');
  aDesc.className = 'mode-card__desc';
  aDesc.textContent = 'Procedurally generated questions custom-tailored to your current difficulty level. Practice forever!';
  
  const aBtn = document.createElement('button');
  aBtn.className = 'mode-card__btn mode-card__btn--solid';
  aBtn.textContent = 'Start Infinite Session';
  aBtn.onclick = () => startSession(ch.id, 'basic', 'adaptive');
  
  adaptCard.appendChild(aIcon);
  adaptCard.appendChild(aTitle);
  adaptCard.appendChild(aDesc);
  adaptCard.appendChild(aBtn);
  grid.appendChild(adaptCard);
  
  container.appendChild(grid);
  return container;
}

// ───────── SESSION ACTIONS ─────────
function startSession(chapterId, levelId, type) {
  let questions = [];
  
  if (type === 'worksheet') {
    // Filter static worksheets questions for this level and chapter
    questions = worksheets[levelId].filter(q => q.chapter === chapterId).map((q, idx) => {
      // Map to same standard format
      return {
        ...q,
        index: worksheets[levelId].indexOf(q), // keep reference to overall index in worksheets array
        level: levelId
      };
    });
  } else {
    // Procedurally generate 5 questions using templates
    for (let i = 0; i < 5; i++) {
      const generated = generateQuestion(chapterId, levelId);
      questions.push({
        ...generated,
        level: levelId,
        index: i
      });
    }
  }

  if (questions.length === 0) {
    alert("This worksheet level doesn't have static questions yet, but you can play Infinite Adaptive Coach!");
    return;
  }
  
  state.activeSession = {
    chapterId,
    levelId,
    type,
    questions,
    currentIndex: 0,
    score: 0,
    answersLog: [] // log of correct/incorrect status for this session
  };
  
  navigateTo('session');
}

// Active Practice Session View
function createActiveSessionView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');
  
  const q = sess.questions[sess.currentIndex];
  
  const layout = document.createElement('div');
  layout.className = 'session-layout';
  
  const header = document.createElement('div');
  header.className = 'session-header';
  
  const title = document.createElement('span');
  title.className = 'session-title-label';
  title.textContent = sess.type === 'worksheet' ? `Worksheet Session` : `Infinite Adaptive Coach`;
  
  const progText = document.createElement('span');
  progText.className = 'session-progress-text';
  progText.textContent = `Question ${sess.currentIndex + 1} of ${sess.questions.length}`;
  
  header.appendChild(title);
  header.appendChild(progText);
  layout.appendChild(header);
  
  const progBar = document.createElement('div');
  progBar.className = 'session-progress-bar';
  const fill = document.createElement('div');
  fill.className = 'session-progress-fill';
  fill.style.width = `${((sess.currentIndex) / sess.questions.length) * 100}%`;
  progBar.appendChild(fill);
  layout.appendChild(progBar);
  
  const card = document.createElement('div');
  card.className = 'question-card';
  
  const cardMeta = document.createElement('div');
  cardMeta.className = 'question-card__meta';
  
  const badge = document.createElement('span');
  badge.className = `question-card__badge ${sess.levelId}`;
  badge.textContent = `${sess.levelId} grammar`;
  cardMeta.appendChild(badge);
  card.appendChild(cardMeta);
  
  const text = document.createElement('p');
  text.className = 'question-card__text';
  text.innerHTML = q.text;
  card.appendChild(text);
  
  let selectedAnsIndex = null;
  let textResponse = '';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Check Answer';
  submitBtn.disabled = true;
  
  // MCQ Options or text input
  if (q.type === 'mcq') {
    const list = document.createElement('div');
    list.className = 'options-list';
    
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      
      const optIdx = document.createElement('span');
      optIdx.className = 'option-index';
      optIdx.textContent = String.fromCharCode(65 + idx); // A, B, C, D
      
      const optText = document.createElement('span');
      optText.textContent = opt;
      
      btn.appendChild(optIdx);
      btn.appendChild(optText);
      
      btn.onclick = () => {
        if (submitBtn.textContent === 'Continue') return;
        
        // Deselect previous
        list.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        selectedAnsIndex = idx;
        submitBtn.disabled = false;
      };
      
      list.appendChild(btn);
    });
    card.appendChild(list);
  } else {
    // Fill in or Short answer
    const container = document.createElement('div');
    container.className = 'input-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = q.type === 'fillin' ? 'Type the missing word here...' : 'Type your answer here...';
    
    input.oninput = () => {
      textResponse = input.value.trim();
      submitBtn.disabled = textResponse === '';
    };
    
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !submitBtn.disabled && submitBtn.textContent !== 'Continue') {
        submitBtn.click();
      }
    };
    
    container.appendChild(input);
    card.appendChild(container);
  }
  
  const actionDiv = document.createElement('div');
  actionDiv.className = 'action-container';
  
  const exitBtn = document.createElement('button');
  exitBtn.className = 'back-btn';
  exitBtn.style.marginBottom = '0';
  exitBtn.textContent = 'Exit Session';
  exitBtn.onclick = () => {
    if (confirm("Are you sure you want to end this practice session? Your progress for this session won't be saved.")) {
      navigateTo('worksheet', { chapter: chapters.find(c => c.id === sess.chapterId) });
    }
  };
  
  actionDiv.appendChild(exitBtn);
  actionDiv.appendChild(submitBtn);
  card.appendChild(actionDiv);
  
  // Submit action handler
  submitBtn.onclick = () => {
    if (submitBtn.textContent === 'Continue') {
      // Go to next question or report
      sess.currentIndex++;
      if (sess.currentIndex >= sess.questions.length) {
        // End session
        finishSession();
      } else {
        navigateTo('session');
      }
      return;
    }
    
    let isCorrect = false;
    if (q.type === 'mcq') {
      isCorrect = selectedAnsIndex === q.answer;
      
      // Update UI choices
      card.querySelectorAll('.option-btn').forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) {
          btn.classList.add('correct');
        } else if (idx === selectedAnsIndex) {
          btn.classList.add('wrong');
        }
      });
    } else {
      // Check short answer / fill in
      const parsedAns = textResponse.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const parsedCorrect = q.answer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      isCorrect = parsedAns === parsedCorrect;
      
      const inputEl = card.querySelector('.text-input');
      if (inputEl) {
        inputEl.disabled = true;
        inputEl.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';
        inputEl.style.backgroundColor = isCorrect ? 'var(--success-light)' : 'var(--error-light)';
      }
    }
    
    // Save answers state
    if (sess.type === 'worksheet') {
      const key = `${sess.levelId}_${sess.chapterId}_${q.index}`;
      state.userAnswers[key] = { answered: true, correct: isCorrect, input: q.type === 'mcq' ? q.options[selectedAnsIndex] : textResponse };
    } else {
      // Adaptive stats
      state.adaptiveStats.totalAttempted++;
      if (isCorrect) state.adaptiveStats.totalCorrect++;
    }
    
    if (isCorrect) {
      sess.score++;
      card.classList.add('correct');
    } else {
      card.classList.add('wrong');
    }
    
    sess.answersLog.push(isCorrect);
    saveState();
    
    // Render explanation panel
    const solPanel = document.createElement('div');
    solPanel.className = `solution-panel ${isCorrect ? 'correct' : 'wrong'}`;
    
    const solHeader = document.createElement('h4');
    solHeader.className = 'solution-panel__header';
    solHeader.innerHTML = isCorrect ? '🎉 Correct Answer!' : '❌ Let\'s Learn!';
    
    const explanation = document.createElement('p');
    explanation.className = 'solution-panel__explanation';
    explanation.innerHTML = `<b>Correct answer:</b> ${q.type === 'mcq' ? q.options[q.answer] : q.answer}<br/><br/>${q.solution}`;
    
    solPanel.appendChild(solHeader);
    solPanel.appendChild(explanation);
    card.insertBefore(solPanel, actionDiv);
    
    // Switch action button to Continue
    submitBtn.textContent = 'Continue';
  };
  
  layout.appendChild(card);
  return layout;
}

// Finish active session
function finishSession() {
  const sess = state.activeSession;
  if (!sess) return;
  
  state.adaptiveStats.sessionsCompleted++;
  
  // Calculate score highscore
  if (sess.type === 'worksheet') {
    const key = `${sess.chapterId}`;
    const prevHigh = state.adaptiveStats.highScores[key] || 0;
    if (sess.score > prevHigh) {
      state.adaptiveStats.highScores[key] = sess.score;
    }
  }
  
  saveState();
  navigateTo('session-report');
}

// Session Report View
function createSessionReportView() {
  const sess = state.activeSession;
  if (!sess) return document.createElement('div');
  
  const card = document.createElement('div');
  card.className = 'report-card';
  
  const icon = document.createElement('div');
  icon.className = 'report-card__icon';
  
  const pct = Math.round((sess.score / sess.questions.length) * 100);
  icon.textContent = pct >= 80 ? '🏆' : pct >= 50 ? '🥈' : '⭐';
  
  const title = document.createElement('h2');
  title.className = 'report-card__title';
  title.textContent = pct >= 80 ? 'Incredible Work!' : 'Good Effort!';
  
  const desc = document.createElement('p');
  desc.className = 'report-card__desc';
  desc.textContent = `You finished the ${sess.levelId} practice session with a score of ${sess.score} out of ${sess.questions.length}!`;
  
  const stats = document.createElement('div');
  stats.className = 'report-stats';
  
  const scoreStat = document.createElement('div');
  scoreStat.className = 'report-stat';
  const scoreVal = document.createElement('span');
  scoreVal.className = 'report-stat__val';
  scoreVal.textContent = `${sess.score}/${sess.questions.length}`;
  const scoreLbl = document.createElement('span');
  scoreLbl.className = 'report-stat__label';
  scoreLbl.textContent = 'Score';
  scoreStat.appendChild(scoreVal);
  scoreStat.appendChild(scoreLbl);
  
  const pctStat = document.createElement('div');
  pctStat.className = 'report-stat';
  const pctVal = document.createElement('span');
  pctVal.className = 'report-stat__val';
  pctVal.textContent = `${pct}%`;
  const pctLbl = document.createElement('span');
  pctLbl.className = 'report-stat__label';
  pctLbl.textContent = 'Accuracy';
  pctStat.appendChild(pctVal);
  pctStat.appendChild(pctLbl);
  
  stats.appendChild(scoreStat);
  stats.appendChild(pctStat);
  
  const actions = document.createElement('div');
  actions.className = 'report-actions';
  
  const retryBtn = document.createElement('button');
  retryBtn.className = 'submit-btn';
  retryBtn.textContent = 'Practice Again';
  retryBtn.onclick = () => startSession(sess.chapterId, sess.levelId, sess.type);
  
  const homeBtn = document.createElement('button');
  homeBtn.className = 'submit-btn';
  homeBtn.style.backgroundColor = 'var(--text-muted)';
  homeBtn.textContent = 'Finish & Exit';
  homeBtn.onclick = () => {
    state.activeSession = null;
    saveState();
    navigateTo('chapters');
  };
  
  actions.appendChild(retryBtn);
  actions.appendChild(homeBtn);
  
  card.appendChild(icon);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(stats);
  card.appendChild(actions);
  
  return card;
}

// My Dashboard View
function createDashboardView() {
  const layout = document.createElement('div');
  layout.className = 'dashboard-layout';
  
  const title = document.createElement('h2');
  title.className = 'section-title';
  title.innerHTML = '📊 Learning Insights & Progress';
  layout.appendChild(title);
  
  const stats = getStats();
  
  // Stats grid
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  const cardStreak = createStatCard('🔥', `${state.streak} Days`, 'Daily Streak');
  const cardCorrect = createStatCard('✅', stats.totalCorrect, 'Total Correct Answers');
  const cardRate = createStatCard('🎯', `${stats.completionRate}%`, 'Grammar Accuracy');
  const cardSessions = createStatCard('🎓', state.adaptiveStats.sessionsCompleted, 'Sessions Finished');
  
  statsGrid.appendChild(cardStreak);
  statsGrid.appendChild(cardCorrect);
  statsGrid.appendChild(cardRate);
  statsGrid.appendChild(cardSessions);
  layout.appendChild(statsGrid);
  
  // Badges Section
  const badgeTitle = document.createElement('h3');
  badgeTitle.className = 'section-title';
  badgeTitle.innerHTML = '🎖️ Grammar Achievement Badges';
  layout.appendChild(badgeTitle);
  
  const badgesGrid = document.createElement('div');
  badgesGrid.className = 'badges-container';
  
  const list = getBadges();
  list.forEach(badge => {
    const card = document.createElement('div');
    card.className = `badge-card ${badge.unlocked ? 'unlocked' : ''}`;
    
    const icon = document.createElement('div');
    icon.className = 'badge-card__icon';
    icon.textContent = badge.icon;
    
    const name = document.createElement('h4');
    name.className = 'badge-card__name';
    name.textContent = badge.name;
    
    const desc = document.createElement('p');
    desc.className = 'badge-card__desc';
    desc.textContent = badge.desc;
    
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(desc);
    badgesGrid.appendChild(card);
  });
  
  layout.appendChild(badgesGrid);
  return layout;
}

function createStatCard(emoji, val, label) {
  const card = document.createElement('div');
  card.className = 'stat-card';
  
  const icon = document.createElement('div');
  icon.className = 'stat-card__icon-box';
  icon.textContent = emoji;
  
  const content = document.createElement('div');
  content.className = 'stat-card__content';
  
  const valEl = document.createElement('span');
  valEl.className = 'stat-card__val';
  valEl.textContent = val;
  
  const lblEl = document.createElement('span');
  lblEl.className = 'stat-card__label';
  lblEl.textContent = label;
  
  content.appendChild(valEl);
  content.appendChild(lblEl);
  card.appendChild(icon);
  card.appendChild(content);
  
  return card;
}

// ───────── App Init ─────────
loadState();
renderApp();
