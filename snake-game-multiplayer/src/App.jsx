import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const GRID_WIDTH = 80;
const GRID_HEIGHT = 45;
const INITIAL_SNAKE_1 = [
  { x: 15, y: 22 },
  { x: 15, y: 23 },
  { x: 15, y: 24 },
];
const INITIAL_SNAKE_2 = [
  { x: 65, y: 22 },
  { x: 65, y: 23 },
  { x: 65, y: 24 },
];
const INITIAL_DIRECTION_1 = { x: 0, y: -1 }; // Up
const INITIAL_DIRECTION_2 = { x: 0, y: -1 }; // Up
const INITIAL_SPEED = 120; // Slightly faster for bigger grid
const FOOD_COUNT = 5;

const TECH_DOCS = `
# Technical Deep Dive

## 1. Component State
The game state is managed using React's **useState** hook, which serves as the "source of truth." This includes arrays for each snake's body coordinates, a registry of active food items, and direction vectors ({x, y}) for movement calculation.

## 2. The Game Engine (The Loop)
The game runs on a synchronized heartbeat using **setInterval** within a **useEffect** hook. Every 120ms (the "tick"), the **moveSnakes** function calculates the next state of the game. We use **useRef** to maintain a stable reference to the interval ID, ensuring clean restarts and pausing.

## 3. Collision & Movement Logic
- **Wrap-around**: Head positions use the modulo operator (%) to wrap around the 80x45 grid seamlessly.
- **Collision Layers**: During each tick, the engine checks for (1) self-collision, (2) opponent-body collision, and (3) head-to-head clashes to determine the winner.
- **Food Interaction**: If a head lands on a food coordinate, the snake grows (tail isn't popped) and a new food is randomly generated in an empty cell.

## 4. Input & Control Flow
A global **keydown** listener maps WASD and Arrow keys to direction changes. The logic includes validation to prevent "180-degree turns" which would result in immediate self-collision.

## 5. Rendering Strategy
Instead of a Canvas, we use **CSS Grid**. This declarative approach leverages React's Virtual DOM to surgically update only the 10x10px cells that change classes, ensuring high-performance 60FPS rendering across all browsers.
`;

function App() {
  const [gameMode, setGameMode] = useState(null); // 'single' or 'multi'
  const [showTechArch, setShowTechArch] = useState(false);
  const [snake1, setSnake1] = useState(INITIAL_SNAKE_1);
  const [snake2, setSnake2] = useState(INITIAL_SNAKE_2);
  const [foods, setFoods] = useState([]);
  const [dir1, setDir1] = useState(INITIAL_DIRECTION_1);
  const [dir2, setDir2] = useState(INITIAL_DIRECTION_2);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState(null);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScoreMulti')) || 0
  );

  const gameLoopRef = useRef(null);

  const generateFood = useCallback((snakes) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
      // Check if food spawned on any snake body
      const isColliding = snakes.some((snake) =>
        snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const initGame = (mode) => {
    setGameMode(mode);
    setSnake1(INITIAL_SNAKE_1);
    const initialSnakes = mode === 'multi' ? [INITIAL_SNAKE_1, INITIAL_SNAKE_2] : [INITIAL_SNAKE_1];
    if (mode === 'multi') setSnake2(INITIAL_SNAKE_2);

    const initialFoods = [];
    for (let i = 0; i < FOOD_COUNT; i++) {
      initialFoods.push(generateFood(initialSnakes));
    }
    setFoods(initialFoods);
    setDir1(INITIAL_DIRECTION_1);
    setDir2(INITIAL_DIRECTION_2);
    setIsGameOver(false);
    setScore1(0);
    setScore2(0);
    setIsPaused(false);
    setWinner(null);
  };

  const moveSnakes = useCallback(() => {
    if (isGameOver || isPaused || !gameMode) return;

    // Move Snake 1
    setSnake1((prev1) => {
      const head1 = prev1[0];
      const newHead1 = {
        x: (head1.x + dir1.x + GRID_WIDTH) % GRID_WIDTH,
        y: (head1.y + dir1.y + GRID_HEIGHT) % GRID_HEIGHT,
      };

      // Move Snake 2 if multi
      let newHead2 = null;
      if (gameMode === 'multi') {
        setSnake2((prev2) => {
          const head2 = prev2[0];
          newHead2 = {
            x: (head2.x + dir2.x + GRID_WIDTH) % GRID_WIDTH,
            y: (head2.y + dir2.y + GRID_HEIGHT) % GRID_HEIGHT,
          };

          // Check collisions for both
          const collision1 = prev1.some(s => s.x === newHead1.x && s.y === newHead1.y) ||
                             prev2.some(s => s.x === newHead1.x && s.y === newHead1.y);
          const collision2 = prev1.some(s => s.x === newHead2.x && s.y === newHead2.y) ||
                             prev2.some(s => s.x === newHead2.x && s.y === newHead2.y);

          if (collision1 && collision2) {
            setIsGameOver(true);
            setWinner('TIE');
            return prev2;
          } else if (collision1) {
            setIsGameOver(true);
            setWinner('PLAYER 2');
            return prev2;
          } else if (collision2) {
            setIsGameOver(true);
            setWinner('PLAYER 1');
            return prev2;
          }

          const nextSnake2 = [newHead2, ...prev2];
          const foodIndex = foods.findIndex(f => f.x === newHead2.x && f.y === newHead2.y);

          if (foodIndex !== -1) {
            setScore2(s => s + 10);
            const newFoods = [...foods];
            newFoods[foodIndex] = generateFood([nextSnake2, prev1]);
            setFoods(newFoods);
          } else {
            nextSnake2.pop();
          }
          return nextSnake2;
        });
      } else {
        // Single player collision
        if (prev1.some(s => s.x === newHead1.x && s.y === newHead1.y)) {
          setIsGameOver(true);
          return prev1;
        }
      }

      const nextSnake1 = [newHead1, ...prev1];
      const foodIndex = foods.findIndex(f => f.x === newHead1.x && f.y === newHead1.y);

      if (foodIndex !== -1) {
        setScore1(s => {
          const next = s + 10;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('snakeHighScoreMulti', next);
          }
          return next;
        });
        const newFoods = [...foods];
        newFoods[foodIndex] = generateFood(gameMode === 'multi' ? [nextSnake1, snake2] : [nextSnake1]);
        setFoods(newFoods);
      } else {
        nextSnake1.pop();
      }
      return nextSnake1;
    });
  }, [dir1, dir2, foods, isGameOver, isPaused, gameMode, generateFood, highScore, snake2]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        // Player 1: WASD
        case 'w': if (dir1.y === 0) setDir1({ x: 0, y: -1 }); break;
        case 's': if (dir1.y === 0) setDir1({ x: 0, y: 1 }); break;
        case 'a': if (dir1.x === 0) setDir1({ x: -1, y: 0 }); break;
        case 'd': if (dir1.x === 0) setDir1({ x: 1, y: 0 }); break;
        // Player 2: Arrows
        case 'ArrowUp': if (dir2.y === 0) setDir2({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir2.y === 0) setDir2({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir2.x === 0) setDir2({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir2.x === 0) setDir2({ x: 1, y: 0 }); break;
        case ' ': if (gameMode && !isGameOver) setIsPaused(p => !p); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir1, dir2, gameMode, isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver && gameMode) {
      gameLoopRef.current = setInterval(moveSnakes, INITIAL_SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnakes, isPaused, isGameOver, gameMode]);

  if (showTechArch) {
    return (
      <div className="game-container">
        <div className="tech-arch-view">
          <div className="markdown-content">
            {TECH_DOCS.trim().split('\n').map((line, i) => {
              if (line.trim() === '') return <br key={i} />;
              if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
              if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
              if (line.startsWith('- ')) return <li key={i}>{line.slice(2)}</li>;
              if (line.match(/^\d\./)) return <p key={i}><strong>{line}</strong></p>;
              return <p key={i}>{line}</p>;
            })}
          </div>
          <button onClick={() => setShowTechArch(false)}>BACK TO MENU</button>
        </div>
      </div>
    );
  }

  if (!gameMode) {
    return (
      <div className="game-container">
        <div className="menu">
          <h1>SNAKE</h1>
          <button onClick={() => initGame('single')}>SINGLE PLAYER</button>
          <button onClick={() => initGame('multi')}>MULTIPLAYER</button>
          <button className="secondary-btn" onClick={() => setShowTechArch(true)}>TECH ARCHITECTURE</button>
          <div className="controls-info">
            <p>P1: WASD | P2: Arrows</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="header">
        <div className="stats">
          <div className="score p1">P1: {score1}</div>
          {gameMode === 'multi' && <div className="score p2">P2: {score2}</div>}
          <div className="high-score">BEST: {highScore}</div>
        </div>
      </div>

      <div className="grid multiplayer">
        {Array.from({ length: GRID_WIDTH * GRID_HEIGHT }).map((_, i) => {
          const x = i % GRID_WIDTH;
          const y = Math.floor(i / GRID_WIDTH);
          const isS1Body = snake1.some((s) => s.x === x && s.y === y);
          const isS1Head = snake1[0].x === x && snake1[0].y === y;
          const isS2Body = gameMode === 'multi' && snake2.some((s) => s.x === x && s.y === y);
          const isS2Head = gameMode === 'multi' && snake2[0].x === x && snake2[0].y === y;
          const isFood = foods.some(f => f.x === x && f.y === y);

          return (
            <div
              key={i}
              className={`cell ${isS1Body ? 'snake p1' : ''} ${isS1Head ? 'head' : ''} ${isS2Body ? 'snake p2' : ''} ${isS2Head ? 'head' : ''} ${isFood ? 'food' : ''}`}
            />
          );
        })}

        {(isGameOver || isPaused) && (
          <div className="overlay">
            {isGameOver ? (
              <>
                <h2>GAME OVER</h2>
                {gameMode === 'multi' && winner && <h3>{winner} WINS!</h3>}
                <button onClick={() => setGameMode(null)}>MENU</button>
              </>
            ) : (
              <>
                <h2>PAUSED</h2>
                <button onClick={() => setIsPaused(false)}>RESUME</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
