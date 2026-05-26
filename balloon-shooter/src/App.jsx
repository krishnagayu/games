import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const SPAWN_INTERVAL_INITIAL = 1000;
const BULLET_SPEED = 0.6; // Units per ms
const BALLOON_SPEED_MIN = 0.08;
const BALLOON_SPEED_MAX = 0.15;
const PLAYER_SPEED = 0.45;
const BALLOON_COLORS = ['#00d2ff', '#ff007f', '#39ff14', '#ffff00', '#ff0055', '#9b59b6', '#e67e22'];

// Optimized Audio Engine
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playSound = (type) => {
  initAudio();
  if (!audioCtx || audioCtx.state === 'suspended') {
    audioCtx?.resume();
  }
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  if (type === 'pop') {
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'hit') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
  } else if (type === 'start') {
    osc.type = 'square';
    [440, 554, 659].forEach((f, i) => osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.1));
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start(); osc.stop(audioCtx.currentTime + 0.4);
  } else if (type === 'gameover') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.start(); osc.stop(audioCtx.currentTime + 0.6);
  } else if (type === 'levelup') {
    osc.type = 'sine';
    [523, 659, 783, 1046].forEach((f, i) => osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08));
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
    osc.start(); osc.stop(audioCtx.currentTime + 0.45);
  }
};

// Procedural Music Engine
let musicInterval = null;
const playMusic = (isPlaying) => {
  if (!isPlaying) {
    if (musicInterval) clearInterval(musicInterval);
    return;
  }
  if (musicInterval) clearInterval(musicInterval);

  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C Major
  const melody = [0, 2, 4, 0, 2, 4, 5, 4, 3, 1, 0];
  let step = 0;

  musicInterval = setInterval(() => {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(notes[melody[step % melody.length]], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
    step++;
  }, 220);
};

const MAX_BULLETS = 15;
const RECHARGE_TIME = 1800;
const DIFFICULTY_INTERVAL = 120000; // 2 minutes

function App() {
  const [difficulty, setDifficulty] = useState('equal'); // 'equal', 'p1_hard', 'p2_hard', 'vs_cpu'
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [renderState, setRenderState] = useState({
    p1: { x: 0, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
    p2: { x: 0, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
    bullets: [],
    balloons: [],
    particles: [],
    floatingTexts: [],
    isGameOver: false,
    gameStarted: false,
    level: 1,
    levelProgress: 0,
    startTime: 0
  });

  const gameAreaRef = useRef(null);
  const keys = useRef({});
  const physicsState = useRef({
    p1: { x: 0, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
    p2: { x: 0, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
    bullets: [],
    balloons: [],
    particles: [],
    floatingTexts: [],
    isGameOver: false,
    gameStarted: false,
    level: 1,
    levelProgress: 0,
    startTime: 0
  });

  const lastTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const requestRef = useRef();

  const initGame = (mode) => {
    playSound('start');
    if (musicEnabled) playMusic(true);
    const width = gameAreaRef.current?.clientWidth || window.innerWidth;
    const initial = {
      p1: { x: width * 0.2, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
      p2: { x: width * 0.7, score: 0, lives: 5, alive: true, bullets: MAX_BULLETS, recharging: false },
      bullets: [],
      balloons: [],
      particles: [],
      floatingTexts: [],
      isGameOver: false,
      gameStarted: true,
      level: 1,
      levelProgress: 0,
      startTime: performance.now()
    };
    physicsState.current = initial;
    setRenderState(initial);
    setDifficulty(mode);
    lastTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) e.preventDefault();
      keys.current[key] = true;
      initAudio();
    };
    const handleKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const gameLoop = useCallback((time) => {
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const state = physicsState.current;
    if (!state.gameStarted || state.isGameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const width = gameAreaRef.current?.clientWidth || window.innerWidth;
    const height = gameAreaRef.current?.clientHeight || window.innerHeight;

    // Time-based scaling
    const playTime = time - state.startTime;
    const timeMultiplier = 1 + Math.floor(playTime / DIFFICULTY_INTERVAL) * 0.2;

    // Spawning Logic
    const currentSpawnInterval = Math.max(220, (SPAWN_INTERVAL_INITIAL - (state.level - 1) * 80) / timeMultiplier);
    if (time - lastSpawnRef.current > currentSpawnInterval) {
      let spawnX;
      let speedMultiplier = (1.0 + (state.level - 1) * 0.08) * timeMultiplier;
      
      let effectiveDifficulty = difficulty;
      if (!state.p1.alive && state.p2.alive && difficulty !== 'vs_cpu') effectiveDifficulty = 'p2_hard';
      if (!state.p2.alive && state.p1.alive) effectiveDifficulty = 'p1_hard';

      if (effectiveDifficulty === 'p1_hard') {
        if (!state.p2.alive || Math.random() < 0.7) {
          spawnX = Math.random() * (width * 0.45);
          speedMultiplier *= 1.5;
        } else {
          spawnX = width * 0.55 + Math.random() * (width * 0.4);
        }
      } else if (effectiveDifficulty === 'p2_hard') {
        if (!state.p1.alive || Math.random() < 0.7) {
          spawnX = width * 0.55 + Math.random() * (width * 0.4);
          speedMultiplier *= 1.5;
        } else {
          spawnX = Math.random() * (width * 0.45);
        }
      } else {
        spawnX = Math.random() * (width - 60);
      }

      const isSpecial = Math.random() < 0.07; // 7% chance for golden power-up balloon

      state.balloons.push({
        id: Math.random(),
        x: spawnX,
        y: -60,
        color: isSpecial ? '#FFD700' : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        speed: (Math.random() * (BALLOON_SPEED_MAX - BALLOON_SPEED_MIN) + BALLOON_SPEED_MIN) * speedMultiplier,
        sway: Math.random() * 1.2 - 0.6,
        size: isSpecial ? 55 : 45,
        popping: false,
        popTime: 0,
        special: isSpecial
      });
      lastSpawnRef.current = time;
    }

    // P1 (Human) Logic
    const isP1Easy = difficulty === 'p2_hard';
    if (state.p1.alive) {
      if (keys.current['a']) state.p1.x = Math.max(0, state.p1.x - PLAYER_SPEED * dt);
      if (keys.current['d']) state.p1.x = Math.min(width * 0.45, state.p1.x + PLAYER_SPEED * dt);
      if (keys.current['s'] && !state.p1.recharging && !state.bullets.some(b => b.owner === 'p1' && b.y > height - 150)) {
        state.bullets.push({ id: Math.random(), x: state.p1.x + 22, y: height - 90, owner: 'p1' });
        if (!isP1Easy) {
          state.p1.bullets--;
          if (state.p1.bullets <= 0) {
            state.p1.recharging = true;
            setTimeout(() => {
              if (physicsState.current.p1) {
                physicsState.current.p1.bullets = MAX_BULLETS;
                physicsState.current.p1.recharging = false;
              }
            }, RECHARGE_TIME);
          }
        }
      }
    }

    // P2 (Human or CPU) Logic
    const isP2Easy = difficulty === 'p1_hard';
    if (state.p2.alive) {
      if (difficulty === 'vs_cpu') {
        // CPU Auto Target Tracking
        const rightBalloons = state.balloons.filter(b => b.x > width * 0.48 && !b.popping && b.y < height - 100);
        if (rightBalloons.length > 0) {
          // Track lowest threat balloon on P2 side
          const target = rightBalloons.reduce((lowest, curr) => curr.y > lowest.y ? curr : lowest, rightBalloons[0]);
          const targetX = target.x + 22;
          const p2CenterX = state.p2.x + 22;

          if (Math.abs(targetX - p2CenterX) > 15) {
            if (p2CenterX < targetX) {
              state.p2.x = Math.min(width - 50, state.p2.x + PLAYER_SPEED * 0.7 * dt); // slightly slower than human
            } else {
              state.p2.x = Math.max(width * 0.52, state.p2.x - PLAYER_SPEED * 0.7 * dt);
            }
          }

          // Auto-shoot if aligned and bullet in flight cooldown cleared
          const bulletInFlight = state.bullets.some(b => b.owner === 'p2' && b.y > height - 160);
          if (Math.abs(targetX - p2CenterX) < 25 && !state.p2.recharging && !bulletInFlight) {
            state.bullets.push({ id: Math.random(), x: state.p2.x + 22, y: height - 90, owner: 'p2' });
            state.p2.bullets--;
            if (state.p2.bullets <= 0) {
              state.p2.recharging = true;
              setTimeout(() => {
                if (physicsState.current.p2) {
                  physicsState.current.p2.bullets = MAX_BULLETS;
                  physicsState.current.p2.recharging = false;
                }
              }, RECHARGE_TIME);
            }
          }
        }
      } else {
        // Local 2P Key Controls
        if (keys.current['arrowleft']) state.p2.x = Math.max(width * 0.52, state.p2.x - PLAYER_SPEED * dt);
        if (keys.current['arrowright']) state.p2.x = Math.min(width - 50, state.p2.x + PLAYER_SPEED * dt);
        if (keys.current['arrowdown'] && !state.p2.recharging && !state.bullets.some(b => b.owner === 'p2' && b.y > height - 150)) {
          state.bullets.push({ id: Math.random(), x: state.p2.x + 22, y: height - 90, owner: 'p2' });
          if (!isP2Easy) {
            state.p2.bullets--;
            if (state.p2.bullets <= 0) {
              state.p2.recharging = true;
              setTimeout(() => {
                if (physicsState.current.p2) {
                  physicsState.current.p2.bullets = MAX_BULLETS;
                  physicsState.current.p2.recharging = false;
                }
              }, RECHARGE_TIME);
            }
          }
        }
      }
    }

    // Bullets movement
    state.bullets.forEach(b => { b.y -= BULLET_SPEED * dt; });
    state.bullets = state.bullets.filter(b => b.y > -50);

    // Update Particles
    if (state.particles) {
      state.particles.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.0004 * dt; // gravity
        p.life -= 0.0028 * dt;
      });
      state.particles = state.particles.filter(p => p.life > 0);
    }

    // Update Floating text
    if (state.floatingTexts) {
      state.floatingTexts.forEach(f => {
        f.y -= 0.05 * dt;
        f.life -= 0.0025 * dt;
      });
      state.floatingTexts = state.floatingTexts.filter(f => f.life > 0);
    }

    // Balloons logic
    state.balloons.forEach(b => {
      if (b.popping) {
        b.popTime += dt;
        return;
      }
      b.y += b.speed * dt;
      b.x += Math.sin(b.y / 45) * b.sway;

      // Check bullet collisions
      for (let i = 0; i < state.bullets.length; i++) {
        const bul = state.bullets[i];
        const dx = bul.x - (b.x + 22);
        const dy = bul.y - (b.y + 25);
        if (dx * dx + dy * dy < 1350) { // Collision range
          const addedScore = state.level * 10;
          if (bul.owner === 'p1') {
            state.p1.score += addedScore;
            if (b.special) {
              state.p1.lives = Math.min(5, state.p1.lives + 1);
              state.p1.alive = true;
            }
          } else {
            state.p2.score += addedScore;
            if (b.special) {
              state.p2.lives = Math.min(5, state.p2.lives + 1);
              state.p2.alive = true;
            }
          }

          // Trigger Particle Pop Effects
          for (let p = 0; p < 9; p++) {
            const angle = (p / 9) * Math.PI * 2 + Math.random() * 0.4;
            const spd = 0.12 + Math.random() * 0.15;
            state.particles.push({
              id: Math.random(),
              x: b.x + 22,
              y: b.y + 25,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: b.color,
              size: 3 + Math.random() * 4,
              life: 1.0
            });
          }

          // Trigger Floating Score
          state.floatingTexts.push({
            id: Math.random(),
            x: b.x + 22,
            y: b.y - 10,
            text: `+${addedScore}`,
            color: b.special ? '#FFD700' : (bul.owner === 'p1' ? '#00d2ff' : '#ff007f'),
            life: 1.0
          });

          state.levelProgress++;
          if (state.levelProgress >= 10) {
            state.level++;
            state.levelProgress = 0;
            playSound('levelup');
          }
          state.bullets.splice(i, 1);
          b.popping = true;
          playSound('pop');
          break;
        }
      }

      // Player Damage Hit
      if (!b.popping && b.y > height - 100) {
        if (state.p1.alive && Math.abs((b.x + 22) - (state.p1.x + 25)) < 42) {
          state.p1.lives--;
          state.p1.alive = state.p1.lives > 0;
          b.popping = true;
          playSound('hit');
        } else if (state.p2.alive && Math.abs((b.x + 22) - (state.p2.x + 25)) < 42) {
          state.p2.lives--;
          state.p2.alive = state.p2.lives > 0;
          b.popping = true;
          playSound('hit');
        }
      }

      // Out of screen bounds penalty
      if (!b.popping && b.y > height) {
        if (b.x < width / 2) {
          state.p1.score = Math.max(0, state.p1.score - 5);
        } else {
          state.p2.score = Math.max(0, state.p2.score - 5);
        }
        b.popping = true;
        b.popTime = 1000; // Skip animations
      }
    });

    state.balloons = state.balloons.filter(b => b.y < height + 100 && (!b.popping || b.popTime < 200));

    // Game Over condition
    if (!state.p1.alive && !state.p2.alive && !state.isGameOver) {
      state.isGameOver = true;
      playSound('gameover');
      playMusic(false);
    }

    // Sync to state variables
    setRenderState({
      p1: { ...state.p1 }, 
      p2: { ...state.p2 }, 
      bullets: [...state.bullets], 
      balloons: [...state.balloons], 
      particles: [...state.particles],
      floatingTexts: [...state.floatingTexts],
      isGameOver: state.isGameOver,
      gameStarted: state.gameStarted,
      level: state.level,
      levelProgress: state.levelProgress,
      startTime: state.startTime
    });
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [difficulty]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameLoop]);

  const { p1, p2, balloons, bullets, particles, floatingTexts, isGameOver, gameStarted, level } = renderState;

  return (
    <div className="game-container" ref={gameAreaRef}>
      <div className="stars" />
      <div className="hud">
        <div className="p1-stats">
          <div className="label">P1 (A/D/S) - Cyan</div>
          <div className="score">SCORE: {p1.score}</div>
          <div className="lives">LIVES: {'❤️'.repeat(p1.lives)}</div>
          <div className={`bullets-info ${p1.recharging ? 'recharging' : ''}`}>
            {p1.recharging ? 'RECHARGING...' : (difficulty === 'p2_hard' ? 'BULLETS: ∞' : `BULLETS: ${p1.bullets}/${MAX_BULLETS}`)}
          </div>
        </div>
        <div className="level-info">
          LEVEL {level}
        </div>
        <div className="p2-stats">
          <div className="label">{difficulty === 'vs_cpu' ? 'CPU (AI)' : 'P2 (←/→/↓) - Pink'}</div>
          <div className="score">SCORE: {p2.score}</div>
          <div className="lives">LIVES: {'❤️'.repeat(p2.lives)}</div>
          <div className={`bullets-info ${p2.recharging ? 'recharging' : ''}`}>
            {p2.recharging ? 'RECHARGING...' : (difficulty === 'p1_hard' ? 'BULLETS: ∞' : `BULLETS: ${p2.bullets}/${MAX_BULLETS}`)}
          </div>
        </div>
      </div>

      {(!gameStarted || isGameOver) && (
        <div className="overlay">
          <h1 className="title-glow">{isGameOver ? "GAME OVER!" : "BALLOON DEFENDER"}</h1>
          {isGameOver && (
            <div className="results">
              <p>P1 SCORE: {p1.score} | P2 SCORE: {p2.score}</p>
              <h2 className="victory-announcement">
                {p1.score > p2.score ? "P1 WINS!" : p2.score > p1.score ? (difficulty === 'vs_cpu' ? "CPU WINS!" : "P2 WINS!") : "IT'S A TIE!"}
              </h2>
            </div>
          )}
          <div className="menu-buttons">
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              style={{ backgroundColor: musicEnabled ? '#00ff87' : '#ff0055', color: '#000' }}
            >
              MUSIC: {musicEnabled ? "ON" : "OFF"}
            </button>
            <button onClick={() => initGame('equal')}>2P LOCAL (EQUAL)</button>
            <button onClick={() => initGame('vs_cpu')}>SINGLE PLAYER VS CPU</button>
            <button onClick={() => initGame('p1_hard')}>P1 HARD | P2 EASY</button>
            <button onClick={() => initGame('p2_hard')}>P1 EASY | P2 HARD</button>
          </div>
        </div>
      )}

      {p1.alive && (
        <div className="gun p1" style={{ left: p1.x }}>
          <div className="gun-barrel cyan-barrel"></div>
        </div>
      )}
      {p2.alive && (
        <div className={`gun p2 ${difficulty === 'vs_cpu' ? 'cpu-gun' : ''}`} style={{ left: p2.x }}>
          <div className="gun-barrel pink-barrel"></div>
        </div>
      )}

      {bullets.map(b => (
        <div key={b.id} className={`bullet ${b.owner}`} style={{ left: b.x, top: b.y }} />
      ))}

      {balloons.map(b => (
        <div
          key={b.id}
          className={`balloon ${b.popping ? 'popping' : ''} ${b.special ? 'special' : ''}`}
          style={{
            left: b.x,
            top: b.y,
            backgroundColor: b.color,
            width: b.size,
            height: b.size * 1.2,
            boxShadow: `0 0 15px ${b.color}`
          }}
        >
          <div className="balloon-glare"></div>
          <div className="balloon-string"></div>
        </div>
      ))}

      {/* Render Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 5px ${p.color}`,
            position: 'absolute',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Render Floating Texts */}
      {floatingTexts.map(f => (
        <div
          key={f.id}
          className="floating-score"
          style={{
            left: f.x,
            top: f.y,
            color: f.color,
            opacity: f.life,
            textShadow: `0 0 8px ${f.color}`
          }}
        >
          {f.text}
        </div>
      ))}

      <div className="divider" />
    </div>
  );
}

export default App;
