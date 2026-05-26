import { useState, useEffect, useCallback, useRef } from 'react';
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
  easy: { speed: 300, spawnInterval: 1700, fuelRate: 4 },
  medium: { speed: 450, spawnInterval: 1200, fuelRate: 6 },
  hard: { speed: 650, spawnInterval: 800, fuelRate: 9 },
};

const CAR_COLORS: Record<CarColor, string> = {
  red: '#FF2800',
  blue: '#00d2ff',
  green: '#39ff14'
};

// Web Audio API Synth Engine
class SynthEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.osc = this.ctx.createOscillator();
      this.osc.type = 'sawtooth';
      
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.osc.connect(this.filter);
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      this.osc.start();
    } catch (e) {
      console.error("Failed to initialize Web Audio", e);
    }
  }

  setEnginePitch(speedRatio: number, isBoosting: boolean) {
    this.init();
    if (!this.osc || !this.filter || !this.gain || !this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Base pitch depends on speedRatio (0 to 1)
    const baseFreq = 50 + speedRatio * 80; // 50Hz to 130Hz
    const pitch = isBoosting ? baseFreq * 1.6 : baseFreq;
    const volume = isBoosting ? 0.09 : 0.05;

    this.osc.frequency.setTargetAtTime(pitch, this.ctx.currentTime, 0.15);
    this.filter.frequency.setTargetAtTime(pitch * 2.5, this.ctx.currentTime, 0.15);
    this.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
  }

  playFuelSound() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12); // C6
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.start();
    osc.stop(now + 0.12);
  }

  playCrashSound() {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(25, now + 0.6);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.start();
    osc.stop(now + 0.6);
  }

  stop() {
    if (this.gain && this.ctx) {
      this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }
  }
}

const synth = new SynthEngine();

function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('crashed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [carColor, setCarColor] = useState<CarColor>('red');
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [playerLane, setPlayerLane] = useState(1);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [isBoosting, setIsBoosting] = useState(false);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('neon-racer-highscore')) || 0);

  const objectsRef = useRef<GameObject[]>([]);
  const fuelRef = useRef(100);
  const scoreRef = useRef(0);
  const laneRef = useRef(1);
  const difficultyRef = useRef<Difficulty>('easy');
  const gameStateRef = useRef<'menu' | 'playing' | 'gameover'>('menu');
  const isBoostingRef = useRef(false);

  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  useEffect(() => { laneRef.current = playerLane; }, [playerLane]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { isBoostingRef.current = isBoosting; }, [isBoosting]);

  const gameOver = useCallback((reason: GameOverReason) => {
    setGameState('gameover');
    setGameOverReason(reason);
    setIsBoosting(false);
    isBoostingRef.current = false;
    
    synth.playCrashSound();
    synth.stop();

    const finalScore = Math.floor(scoreRef.current);
    setHighScore(prev => {
      const newHigh = Math.max(prev, finalScore);
      localStorage.setItem('neon-racer-highscore', newHigh.toString());
      return newHigh;
    });
  }, []);

  const spawnObjects = (now: number) => {
    const config = DIFFICULTY_SETTINGS[difficultyRef.current];
    // Slightly faster spawn checks when boosting
    const interval = isBoostingRef.current ? config.spawnInterval * 0.8 : config.spawnInterval;
    if (now - lastSpawnRef.current > interval) {
      const lanesToFillCount = Math.random() > 0.85 ? 2 : 1;
      const filledLanes = new Set<number>();
      while (filledLanes.size < lanesToFillCount) {
        filledLanes.add(Math.floor(Math.random() * LANES_COUNT));
      }

      const newObjects: GameObject[] = Array.from(filledLanes).map(lane => {
        const rand = Math.random();
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
    const speedMultiplier = isBoostingRef.current ? 1.7 : 1.0;
    const speed = config.speed * speedMultiplier;
    const fuelRate = isBoostingRef.current ? config.fuelRate * 2.2 : config.fuelRate;

    // 1. Synth pitch update
    const speedRatio = speed / (DIFFICULTY_SETTINGS['hard'].speed * 1.7);
    synth.setEnginePitch(speedRatio, isBoostingRef.current);

    // 2. Update Fuel
    fuelRef.current -= fuelRate * deltaTime;
    if (fuelRef.current <= 0) {
      setFuel(0);
      gameOver('fuel');
      return;
    }
    setFuel(fuelRef.current);

    // 3. Spawn Objects
    spawnObjects(time);

    // 4. Collision Logic
    const playerBoxTop = window.innerHeight - PLAYER_BOTTOM_OFFSET - PLAYER_HEIGHT;
    const playerBoxBottom = window.innerHeight - PLAYER_BOTTOM_OFFSET;

    const updatedObjects = objectsRef.current
      .map(obj => ({ ...obj, top: obj.top + (speed * deltaTime) }))
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
              synth.playFuelSound();
              scoreRef.current += 150;
              fuelRef.current = Math.min(100, fuelRef.current + 30);
              setScore(Math.floor(scoreRef.current));
              return false;
            }
          }
        }

        return obj.top < window.innerHeight;
      });

    objectsRef.current = updatedObjects;
    setObjects(updatedObjects);
    scoreRef.current += (isBoostingRef.current ? 45 : 15) * deltaTime;
    setScore(Math.floor(scoreRef.current));

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
      synth.stop();
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
      synth.stop();
    };
  }, [gameState]);

  const startGame = () => {
    synth.init();
    setScore(0);
    setFuel(100);
    setPlayerLane(1);
    setObjects([]);
    setIsBoosting(false);
    objectsRef.current = [];
    fuelRef.current = 100;
    scoreRef.current = 0;
    lastTimeRef.current = 0;
    lastSpawnRef.current = performance.now();
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerLane(prev => Math.min(LANES_COUNT - 1, prev + 1));
      } else if (e.key === ' ') {
        setIsBoosting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsBoosting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={`game-container ${isBoosting ? 'nitro-boost' : ''}`}>
      <div className="lanes-wrapper">
        <div className="lanes">
          <div className="lane-divider"></div>
          <div className="lane-divider"></div>
          <div className="lane-divider"></div>
        </div>
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
          boxShadow: `0 0 25px ${CAR_COLORS[carColor]}`
        }}
      >
        <div className="car-cabin"></div>
        <div className="car-thrusters">
          <div className={`flame ${isBoosting ? 'large-flame' : ''}`}></div>
        </div>
      </div>

      {objects.map(obj => (
        <div
          key={obj.id}
          className={`game-object object-${obj.type} ${obj.type === 'obstacle' ? 'enemy-car' : ''}`}
          style={{ 
            top: `${obj.top}px`, 
            left: `calc(${obj.lane * 33.33}% + 16.66%)`,
            transform: 'translateX(-50%)'
          }}
        >
          {obj.type === 'obstacle' && <div className="car-cabin enemy"></div>}
          {obj.type === 'fuel' && <span className="fuel-icon">⚡</span>}
        </div>
      ))}

      {gameState === 'menu' && (
        <div className="menu-overlay">
          <h1 className="cyber-racer-title">NEON RACER</h1>
          <h2 className="subtitle">THE CYBERPUNK DRIVE</h2>
          
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
                    borderColor: CAR_COLORS[c], 
                    boxShadow: carColor === c ? `0 0 15px ${CAR_COLORS[c]}` : 'none'
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
            Hold SPACEBAR for Nitro Boost (Fast Score, High Fuel Drain).<br/>
            Avoid OTHER CYBERCARS!
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="menu-overlay">
          <h1 className="gameover-title">{gameOverReason === 'fuel' ? 'OUT OF FUEL' : 'CRASHED'}</h1>
          <div className="hud-item" style={{ marginBottom: '20px' }}>FINAL SCORE: {Math.floor(score)}</div>
          <div className="hud-item" style={{ marginBottom: '30px' }}>HIGH SCORE: {Math.floor(highScore)}</div>
          <button className="start-btn" onClick={startGame}>RETRY RACE</button>
        </div>
      )}
    </div>
  );
}

export default App;
