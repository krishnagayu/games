import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

type ObjectType = 'obstacle' | 'fuel';
type GameOverReason = 'crashed' | 'fuel';
type Difficulty = 'easy' | 'medium' | 'hard';
type CarColor = 'red' | 'blue' | 'green';

interface GameObject {
  id: number;
  type: ObjectType;
  lane: number;
  top: number;
}

interface DifficultyConfig {
  speed: number;
  spawnInterval: number;
  fuelRate: number;
}

const LANES_COUNT = 3;
const PLAYER_HEIGHT = 100;
const PLAYER_BOTTOM_OFFSET = 50;

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  easy: { speed: 280, spawnInterval: 1800, fuelRate: 3.5 },
  medium: { speed: 420, spawnInterval: 1300, fuelRate: 6 },
  hard: { speed: 620, spawnInterval: 850, fuelRate: 9 },
};

const CAR_COLORS: Record<CarColor, string> = {
  red: '#FF2800',
  blue: '#00d2ff',
  green: '#39ff14'
};

function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('crashed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [carColor, setCarColor] = useState<CarColor>('red');
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [playerLane, setPlayerLane] = useState(1);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('neon-racer-highscore')) || 0);
  
  const objectsRef = useRef<GameObject[]>([]);
  const fuelRef = useRef(100);
  const scoreRef = useRef(0);
  const laneRef = useRef(1);
  const difficultyRef = useRef<Difficulty>('easy');
  const gameStateRef = useRef<'menu' | 'playing' | 'gameover'>('menu');
  
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { laneRef.current = playerLane; }, [playerLane]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const gameOver = useCallback((reason: GameOverReason) => {
    setGameState('gameover');
    setGameOverReason(reason);
    if (audioRef.current) audioRef.current.pause();
    
    const finalScore = Math.floor(scoreRef.current);
    setHighScore(prev => {
      const newHigh = Math.max(prev, finalScore);
      localStorage.setItem('neon-racer-highscore', newHigh.toString());
      return newHigh;
    });
  }, []);

  const spawnObjects = (now: number) => {
    const config = DIFFICULTY_SETTINGS[difficultyRef.current];
    if (now - lastSpawnRef.current > config.spawnInterval) {
      const lanesToFillCount = Math.random() > 0.8 ? 2 : 1;
      const filledLanes = new Set<number>();
      while (filledLanes.size < lanesToFillCount) {
        filledLanes.add(Math.floor(Math.random() * LANES_COUNT));
      }

      const newObjects: GameObject[] = Array.from(filledLanes).map(lane => {
        const rand = Math.random();
        // Increase fuel chance, especially for harder difficulties
        const fuelChance = difficultyRef.current === 'hard' ? 0.45 : (difficultyRef.current === 'medium' ? 0.35 : 0.25);
        const type: ObjectType = rand < fuelChance ? 'fuel' : 'obstacle';

        return {
          id: now + lane + Math.random(),
          type,
          lane,
          top: -150
        };
      });

      objectsRef.current = [...objectsRef.current, ...newObjects];
      lastSpawnRef.current = now;
    }
  };

  const update = (time: number) => {
    if (gameStateRef.current !== 'playing') return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    const config = DIFFICULTY_SETTINGS[difficultyRef.current];

    // 1. Update Fuel
    fuelRef.current -= config.fuelRate * deltaTime;
    if (fuelRef.current <= 0) {
      setFuel(0);
      gameOver('fuel');
      return;
    }
    setFuel(fuelRef.current);

    // 2. Spawn Objects
    spawnObjects(time);

    // 3. Collision Logic
    const playerBoxTop = window.innerHeight - PLAYER_BOTTOM_OFFSET - PLAYER_HEIGHT;
    const playerBoxBottom = window.innerHeight - PLAYER_BOTTOM_OFFSET;
    
    const updatedObjects = objectsRef.current
      .map(obj => ({ ...obj, top: obj.top + (config.speed * deltaTime) }))
      .filter(obj => {
        const objHeight = (obj.type === 'obstacle' ? 100 : 40);
        const margin = obj.type === 'obstacle' ? 15 : 0;
        const objTop = obj.top + margin;
        const objBottom = obj.top + objHeight - margin;

        if (obj.lane === laneRef.current) {
          const yOverlap = playerBoxBottom > objTop && playerBoxTop < objBottom;

          if (yOverlap) {
            if (obj.type === 'obstacle') {
              gameOver('crashed');
              return false;
            } else if (obj.type === 'fuel') {
              scoreRef.current += 100;
              fuelRef.current = Math.min(100, fuelRef.current + 35); // Now gives 35%
              setScore(Math.floor(scoreRef.current));
              return false;
            }
          }
        }

        return obj.top < window.innerHeight;
      });

    objectsRef.current = updatedObjects;
    setObjects(updatedObjects);
    scoreRef.current += 15 * deltaTime;
    setScore(Math.floor(scoreRef.current));

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setFuel(100);
    setPlayerLane(1);
    setObjects([]);
    objectsRef.current = [];
    fuelRef.current = 100;
    scoreRef.current = 0;
    lastTimeRef.current = 0;
    lastSpawnRef.current = performance.now();
    setGameState('playing');
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerLane(prev => Math.min(LANES_COUNT - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-container">
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" />
      
      <div className="lanes">
        <div className="lane-divider"></div>
        <div className="lane-divider"></div>
        <div className="lane-divider"></div>
      </div>

      <div className="hud">
        <div className="hud-item">SCORE: {Math.floor(score)}</div>
        <div className="hud-item">
          FUEL
          <div className="fuel-bar-container">
            <div className="fuel-bar" style={{ width: `${fuel}%` }}></div>
          </div>
        </div>
      </div>

      <div 
        className="car player-car" 
        style={{ 
          left: `calc(${playerLane * 33.33}% + 16.66% - 30px)`,
          bottom: `${PLAYER_BOTTOM_OFFSET}px`,
          backgroundColor: CAR_COLORS[carColor],
          boxShadow: `0 0 15px ${CAR_COLORS[carColor]}`
        }}
      ></div>

      {objects.map(obj => (
        <div
          key={obj.id}
          className={`game-object object-${obj.type} ${obj.type === 'obstacle' ? 'car' : ''}`}
          style={{ 
            top: `${obj.top}px`, 
            left: `calc(${obj.lane * 33.33}% + 16.66%)`,
            transform: 'translateX(-50%)'
          }}
        >
          {obj.type === 'fuel' && '⛽'}
        </div>
      ))}

      {gameState === 'menu' && (
        <div className="menu-overlay">
          <h1 className="ferrari-title">NEON RACER</h1>
          <h2 className="subtitle">THE ULTIMATE RACING EXPERIENCE</h2>
          
          <div className="menu-section">
            <p>SELECT DIFFICULTY</p>
            <div className="difficulty-container">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button 
                  key={d}
                  className={`diff-btn ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <p>CHOOSE YOUR MACHINE</p>
            <div className="difficulty-container">
              {(['red', 'blue', 'green'] as CarColor[]).map(c => (
                <button 
                  key={c}
                  className={`diff-btn ${carColor === c ? 'active' : ''}`}
                  style={{ 
                    borderColor: carColor === c ? 'var(--ferrari-yellow)' : CAR_COLORS[c], 
                    color: carColor === c ? 'black' : CAR_COLORS[c] 
                  }}
                  onClick={() => setCarColor(c)}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button className="start-btn" onClick={startGame}>START ENGINE</button>
          
          <div className="instructions">
            Use ARROW KEYS or A/D to switch lanes.<br/>
            Collect FUEL PUMPS (⛽) for Score & Fuel.<br/>
            Avoid OTHER CARS!
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="menu-overlay">
          <h1 className="ferrari-title">{gameOverReason === 'fuel' ? 'OUT OF FUEL' : 'CAR CRASHED'}</h1>
          <div className="hud-item" style={{ marginBottom: '20px' }}>FINAL SCORE: {Math.floor(score)}</div>
          <div className="hud-item" style={{ marginBottom: '30px' }}>HIGH SCORE: {Math.floor(highScore)}</div>
          <button className="start-btn" onClick={startGame}>RETRY RACE</button>
        </div>
      )}
    </div>
  );
}

export default App;
