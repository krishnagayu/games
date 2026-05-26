import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Up
const INITIAL_SPEED = 400; // Slower default speed

// Neon/Retro Wall Obstacles for Maze Mode (safe from starting path at column 10)
const MAZE_WALLS = [
  // Corner barriers
  { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
  { x: 15, y: 4 }, { x: 14, y: 4 }, { x: 13, y: 4 }, { x: 15, y: 5 }, { x: 15, y: 6 },
  { x: 4, y: 15 }, { x: 5, y: 15 }, { x: 6, y: 15 }, { x: 4, y: 14 }, { x: 4, y: 13 },
  { x: 15, y: 15 }, { x: 14, y: 15 }, { x: 13, y: 15 }, { x: 15, y: 14 }, { x: 15, y: 13 }
];

// Audio synthesizer using Web Audio API
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playSynthSound = (type) => {
  initAudio();
  if (!audioCtx || audioCtx.state === 'suspended') {
    audioCtx?.resume();
  }
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'eat') {
    // Pleasant high pitch arpeggio chime
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start();
    osc.stop(now + 0.3);
  } else if (type === 'die') {
    // Low frequency slide down (explosion-like crash)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
    osc.start();
    osc.stop(now + 0.5);
  } else if (type === 'turn') {
    // Subtle wooden-like click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.start();
    osc.stop(now + 0.03);
  } else if (type === 'pause') {
    // Quick pause sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(330, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.start();
    osc.stop(now + 0.2);
  }
};

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [gameMode, setGameMode] = useState('classic'); // 'classic' or 'maze'
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  );

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  // Compute speed dynamically based on score (slower progression)
  const speed = Math.max(90, INITIAL_SPEED - Math.floor(score / 45) * 15);

  const generateFood = useCallback((currentSnake, currentMode) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake body
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      // Check if food spawned on maze walls
      const onWall = currentMode === 'maze' && MAZE_WALLS.some(
        (wall) => wall.x === newFood.x && wall.y === newFood.y
      );

      if (!onSnake && !onWall) break;
    }
    return newFood;
  }, []);

  const resetGame = (mode = gameMode) => {
    const freshSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(freshSnake);
    setFood(generateFood(freshSnake, mode));
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    initAudio();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const dir = nextDirectionRef.current;
      
      const newHead = {
        x: (head.x + dir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + dir.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y) ||
          (gameMode === 'maze' && MAZE_WALLS.some((w) => w.x === newHead.x && w.y === newHead.y))) {
        setIsGameOver(true);
        setIsPaused(true);
        playSynthSound('die');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const ns = s + 10;
          if (ns > highScore) { setHighScore(ns); localStorage.setItem('snakeHighScore', ns); }
          return ns;
        });
        playSynthSound('eat');
        setFood(generateFood(newSnake, gameMode));
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
    // Update visual direction (snake eyes) after movement
    setDirection(nextDirectionRef.current);
  }, [food, isGameOver, isPaused, gameMode, generateFood, highScore]);

  const handleKeyDown = useCallback((e) => {
    if (isGameOver) return;
    if (e.key === ' ') {
      if (!isGameOver) {
        setIsPaused(!isPaused);
        if (!isPaused) playSynthSound('pause');
      }
      return;
    }
    if (isPaused) return;

    const newDir = { x: 0, y: 0 };
    switch (e.key) {
      case 'ArrowUp': newDir.y = -1; break;
      case 'ArrowDown': newDir.y = 1; break;
      case 'ArrowLeft': newDir.x = -1; break;
      case 'ArrowRight': newDir.x = 1; break;
      default: return;
    }

    if (newDir.x !== -direction.x || newDir.y !== -direction.y) {
      nextDirectionRef.current = newDir;
      playSynthSound('turn');
    }
  }, [direction, isGameOver, isPaused]);

  // Handle keys
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  // Timer interval for ticks
  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, isPaused, isGameOver, speed]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cellW = canvas.width / GRID_SIZE;
    const cellH = canvas.height / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle neon grid background lines
    ctx.strokeStyle = 'rgba(140, 163, 62, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(canvas.width, i * cellH);
      ctx.stroke();
    }

    // Draw maze walls if enabled
    if (gameMode === 'maze') {
      MAZE_WALLS.forEach((wall) => {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#d35400';
        ctx.fillStyle = '#e67e22';
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 2;
        ctx.fillRect(wall.x * cellW + 1, wall.y * cellH + 1, cellW - 2, cellH - 2);
        ctx.strokeRect(wall.x * cellW + 1, wall.y * cellH + 1, cellW - 2, cellH - 2);
        ctx.restore();
      });
    }

    // Draw food pulsing neon
    ctx.save();
    const time = Date.now() / 150;
    const foodPulse = Math.sin(time) * 2 + 10;
    ctx.shadowBlur = foodPulse;
    ctx.shadowColor = '#e74c3c';
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
      food.x * cellW + cellW / 2,
      food.y * cellH + cellH / 2,
      cellW / 2.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // Draw Snake with Canvas Neon Glow
    snake.forEach((segment, i) => {
      ctx.save();
      const isHead = i === 0;

      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8ca33e';
        ctx.fillStyle = '#a8bc4a';
      } else {
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#607325';
        ctx.fillStyle = '#8ca33e';
      }

      const x = segment.x * cellW;
      const y = segment.y * cellH;
      const r = cellW / 2;

      // Draw rounded segment
      ctx.beginPath();
      if (isHead) {
        ctx.arc(x + r, y + r, r - 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes pointing to movement direction
        ctx.fillStyle = '#000';
        ctx.beginPath();
        const eyeOffset = r / 2;
        const eyeRadius = r / 5;
        let eyeX1, eyeY1, eyeX2, eyeY2;

        if (direction.x === 0 && direction.y === -1) { // Up
          eyeX1 = x + r - eyeOffset; eyeY1 = y + r - eyeOffset;
          eyeX2 = x + r + eyeOffset; eyeY2 = y + r - eyeOffset;
        } else if (direction.x === 0 && direction.y === 1) { // Down
          eyeX1 = x + r - eyeOffset; eyeY1 = y + r + eyeOffset;
          eyeX2 = x + r + eyeOffset; eyeY2 = y + r + eyeOffset;
        } else if (direction.x === -1 && direction.y === 0) { // Left
          eyeX1 = x + r - eyeOffset; eyeY1 = y + r - eyeOffset;
          eyeX2 = x + r - eyeOffset; eyeY2 = y + r + eyeOffset;
        } else { // Right
          eyeX1 = x + r + eyeOffset; eyeY1 = y + r - eyeOffset;
          eyeX2 = x + r + eyeOffset; eyeY2 = y + r + eyeOffset;
        }

        ctx.arc(eyeX1, eyeY1, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw body segments with soft circles connected
        ctx.arc(x + r, y + r, r - 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }, [snake, food, direction, gameMode]);

  const handleModeChange = (mode) => {
    setGameMode(mode);
    resetGame(mode);
  };

  return (
    <div className="game-container">
      <div className="header">
        <h1>SNAKE CYBER</h1>
        <div className="mode-selection">
          <button 
            className={`mode-btn ${gameMode === 'classic' ? 'active' : ''}`}
            onClick={() => handleModeChange('classic')}
          >
            CLASSIC
          </button>
          <button 
            className={`mode-btn ${gameMode === 'maze' ? 'active' : ''}`}
            onClick={() => handleModeChange('maze')}
          >
            MAZE
          </button>
        </div>
        <div className="stats">
          <div className="score">SCORE: {score}</div>
          <div className="high-score">BEST: {highScore}</div>
        </div>
      </div>

      <div className="canvas-wrapper" style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            border: '5px solid #8ca33e',
            boxShadow: '0 0 20px rgba(140, 163, 98, 0.4)',
            display: 'block'
          }}
          onClick={() => {
            initAudio();
            if (isGameOver) resetGame();
          }}
        />

        {(isGameOver || isPaused) && (
          <div className="overlay">
            {isGameOver ? (
              <>
                <h2>GAME OVER</h2>
                <button onClick={() => resetGame()}>RETRY</button>
              </>
            ) : (
              <>
                <h2>PAUSED</h2>
                <button onClick={() => {
                  initAudio();
                  setIsPaused(false);
                  playSynthSound('pause');
                }}>
                  PLAY
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="controls-info">
        <p>Use Arrows or WASD to Move</p>
        <p>Space to Pause / Resume</p>
      </div>
    </div>
  );
}

export default App;
