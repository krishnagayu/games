import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Tower, Enemy, Projectile, Particle, TowerType, EnemyType, CustomChallenge } from './types';
import { TOWER_CONFIGS } from './types';
import { MAPS, CELL_SIZE, GRID_COLS, GRID_ROWS } from './maps';
import { sounds } from './sounds';

interface GameBoardProps {
  currentMapIndex: number;
  customChallenge?: CustomChallenge | null;
  gameSpeed: number;
  isPaused: boolean;
  selectedBuildType: TowerType | null;
  soundEnabled: boolean;
  onStatsUpdate: (credits: number, lives: number, wave: number, score: number) => void;
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
  orbitalStrikeRequested: boolean;
  onOrbitalStrikeUsed: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  currentMapIndex,
  customChallenge,
  gameSpeed,
  isPaused,
  selectedBuildType,
  soundEnabled,
  onStatsUpdate,
  onGameOver,
  onVictory,
  orbitalStrikeRequested,
  onOrbitalStrikeUsed
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state held in refs for 60FPS canvas animation loop without triggering React re-renders every frame
  const towersRef = useRef<Tower[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  const creditsRef = useRef<number>(customChallenge ? customChallenge.startingCredits : 350);
  const livesRef = useRef<number>(20);
  const scoreRef = useRef<number>(0);
  const waveRef = useRef<number>(1);
  const waveInProgressRef = useRef<boolean>(false);
  const enemiesToSpawnRef = useRef<EnemyType[]>([]);
  const spawnTimerRef = useRef<number>(0);
  
  const [selectedTower, setSelectedTower] = useRefState<Tower | null>(null);
  const [hoverGrid, setHoverGrid] = useState<{ col: number; row: number } | null>(null);

  // Use map path or custom painted challenge path
  const currentMap = MAPS[currentMapIndex] || MAPS[0];
  const activePath = customChallenge ? customChallenge.path : currentMap.path;
  const currentThemeColor = currentMap.themeColor;

  sounds.enabled = soundEnabled;

  // Custom helper for state with immediate ref access
  function useRefState<T>(initialValue: T): [T, (val: T) => void] {
    const [state, setState] = useState<T>(initialValue);
    const ref = useRef<T>(initialValue);
    const update = (val: T) => {
      ref.current = val;
      setState(val);
    };
    return [state, update];
  }

  // Generate enemy waves dynamically based on wave number
  const startNextWave = useCallback(() => {
    if (waveInProgressRef.current) return;

    const enemyList: EnemyType[] = [];

    if (customChallenge) {
      // Use custom alien wave created by Kid 1
      const wave = customChallenge.enemyWave;
      for (let i = 0; i < wave.blobbot; i++) enemyList.push('blobbot');
      for (let i = 0; i < wave.slime; i++) enemyList.push('slime');
      for (let i = 0; i < wave.saucer; i++) enemyList.push('saucer');
      for (let i = 0; i < wave.boss; i++) enemyList.push('boss');
    } else {
      const wave = waveRef.current;
      const blobbotCount = Math.floor(4 + wave * 2);
      const slimeCount = Math.floor(wave > 2 ? (wave - 2) * 2 : 0);
      const saucerCount = Math.floor(wave > 4 ? (wave - 4) * 1.5 : 0);
      const isBossWave = wave % 5 === 0;

      for (let i = 0; i < blobbotCount; i++) enemyList.push('blobbot');
      for (let i = 0; i < slimeCount; i++) enemyList.push('slime');
      for (let i = 0; i < saucerCount; i++) enemyList.push('saucer');
      if (isBossWave) enemyList.push('boss');
    }

    enemiesToSpawnRef.current = enemyList;
    waveInProgressRef.current = true;
    spawnTimerRef.current = 0;
  }, [customChallenge]);

  // Spawn an individual enemy along the map path
  const spawnEnemy = (type: EnemyType) => {
    const startPos = activePath[0];
    const pixelX = startPos.x * CELL_SIZE + CELL_SIZE / 2;
    const pixelY = startPos.y * CELL_SIZE + CELL_SIZE / 2;

    const waveMult = 1 + (waveRef.current - 1) * 0.18;

    let hp = 40 * waveMult;
    let speed = 1.6;
    let color = '#33ff57';
    let size = 14;
    let reward = 15;
    let name = 'Blobbot';

    if (type === 'slime') {
      hp = 30 * waveMult;
      speed = 2.4;
      color = '#00f0ff';
      size = 11;
      reward = 20;
      name = 'Space Slime';
    } else if (type === 'saucer') {
      hp = 70 * waveMult;
      speed = 1.9;
      color = '#ff00aa';
      size = 16;
      reward = 30;
      name = 'Speedy Saucer';
    } else if (type === 'boss') {
      hp = 450 * waveMult;
      speed = 1.0;
      color = '#ffbb00';
      size = 24;
      reward = 150;
      name = 'Nebula Titan Boss';
    }

    enemiesRef.current.push({
      id: Math.random().toString(36).substring(2, 9),
      type,
      name,
      x: pixelX,
      y: pixelY,
      hp,
      maxHp: hp,
      speed,
      baseSpeed: speed,
      reward,
      color,
      size,
      pathIndex: 0,
      slowTimer: 0,
      stunTimer: 0
    });
  };

  // Trigger Orbital Strike
  useEffect(() => {
    if (orbitalStrikeRequested) {
      sounds.playOrbitalStrike();
      
      // Damage all enemies currently on screen
      enemiesRef.current.forEach(e => {
        e.hp -= 150;
        // Spawn orbital particles
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            x: e.x,
            y: e.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            maxLife: 1.0,
            color: '#ffff00',
            size: 4 + Math.random() * 4
          });
        }
      });

      onOrbitalStrikeUsed();
    }
  }, [orbitalStrikeRequested, onOrbitalStrikeUsed]);

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      if (!isPaused) {
        // --- 1. WAVE SPAWNING LOGIC ---
        if (waveInProgressRef.current) {
          spawnTimerRef.current += gameSpeed;
          if (spawnTimerRef.current >= 45 && enemiesToSpawnRef.current.length > 0) {
            spawnTimerRef.current = 0;
            const nextType = enemiesToSpawnRef.current.shift();
            if (nextType) spawnEnemy(nextType);
          }

          // Check if wave complete
          if (enemiesToSpawnRef.current.length === 0 && enemiesRef.current.length === 0) {
            waveInProgressRef.current = false;
            creditsRef.current += 75 + waveRef.current * 15;
            scoreRef.current += 100 * waveRef.current;

            if (waveRef.current >= 10) {
              sounds.playVictory();
              onVictory(scoreRef.current);
            } else {
              waveRef.current += 1;
            }
          }
        }

        // --- 2. UPDATE ENEMIES ---
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const enemy = enemiesRef.current[i];

          // Handle stuns & slows
          if (enemy.stunTimer > 0) {
            enemy.stunTimer -= gameSpeed;
            continue;
          }

          let currentSpeed = enemy.baseSpeed * gameSpeed;
          if (enemy.slowTimer > 0) {
            enemy.slowTimer -= gameSpeed;
            currentSpeed *= 0.5; // 50% slow
          }

          const targetNode = activePath[enemy.pathIndex + 1];
          if (!targetNode) {
            // Reached rocket base!
            livesRef.current -= enemy.type === 'boss' ? 5 : 1;
            sounds.playGameOver();
            enemiesRef.current.splice(i, 1);

            if (livesRef.current <= 0) {
              onGameOver(scoreRef.current);
            }
            continue;
          }

          const targetX = targetNode.x * CELL_SIZE + CELL_SIZE / 2;
          const targetY = targetNode.y * CELL_SIZE + CELL_SIZE / 2;

          const dx = targetX - enemy.x;
          const dy = targetY - enemy.y;
          const dist = Math.hypot(dx, dy);

          if (dist < currentSpeed) {
            enemy.x = targetX;
            enemy.y = targetY;
            enemy.pathIndex += 1;
          } else {
            enemy.x += (dx / dist) * currentSpeed;
            enemy.y += (dy / dist) * currentSpeed;
          }
        }

        // --- 3. UPDATE TOWERS & TARGETING ---
        const now = Date.now();
        towersRef.current.forEach(tower => {
          const cooldown = (1000 / tower.fireRate) / gameSpeed;

          // Find target enemy in range
          let closestEnemy: Enemy | null = null;
          let minDistance = Infinity;

          enemiesRef.current.forEach(e => {
            const d = Math.hypot(e.x - tower.x, e.y - tower.y);
            if (d <= tower.range && d < minDistance) {
              minDistance = d;
              closestEnemy = e;
            }
          });

          const target = closestEnemy as Enemy | null;

          if (target) {
            tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);

            if (now - tower.lastFired >= cooldown) {
              tower.lastFired = now;

              // Fire projectile
              projectilesRef.current.push({
                id: Math.random().toString(36).substring(2, 9),
                x: tower.x,
                y: tower.y,
                targetX: target.x,
                targetY: target.y,
                targetEnemyId: target.id,
                speed: 8 * gameSpeed,
                damage: tower.damage,
                towerType: tower.type,
                color: TOWER_CONFIGS[tower.type].color,
                splashRadius: tower.type === 'plasma' ? 55 : undefined
              });

              if (tower.type === 'laser') sounds.playLaser();
              else if (tower.type === 'cryo') sounds.playFreeze();
              else if (tower.type === 'plasma') sounds.playPlasma();
              else if (tower.type === 'magnet') sounds.playMagnet();
            }
          }
        });

        // --- 4. UPDATE PROJECTILES ---
        for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
          const proj = projectilesRef.current[i];
          const targetEnemy = enemiesRef.current.find(e => e.id === proj.targetEnemyId);

          const destX = targetEnemy ? targetEnemy.x : proj.targetX;
          const destY = targetEnemy ? targetEnemy.y : proj.targetY;

          const dx = destX - proj.x;
          const dy = destY - proj.y;
          const dist = Math.hypot(dx, dy);

          if (dist <= proj.speed) {
            // Hit target!
            if (proj.splashRadius) {
              // Plasma splash damage
              sounds.playExplosion();
              enemiesRef.current.forEach(e => {
                const splashDist = Math.hypot(e.x - destX, e.y - destY);
                if (splashDist <= proj.splashRadius!) {
                  e.hp -= proj.damage;
                }
              });
            } else if (targetEnemy) {
              targetEnemy.hp -= proj.damage;
              if (proj.towerType === 'cryo') targetEnemy.slowTimer = 90; // Apply frost freeze
              if (proj.towerType === 'magnet') targetEnemy.stunTimer = 40; // Apply electro stun
            }

            // Spawn visual hit particles
            for (let p = 0; p < 4; p++) {
              particlesRef.current.push({
                x: destX,
                y: destY,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 0.6,
                maxLife: 0.6,
                color: proj.color,
                size: 2 + Math.random() * 3
              });
            }

            projectilesRef.current.splice(i, 1);
          } else {
            proj.x += (dx / dist) * proj.speed;
            proj.y += (dy / dist) * proj.speed;
          }
        }

        // --- 5. CLEANUP DEAD ENEMIES & REWARDS ---
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const enemy = enemiesRef.current[i];
          if (enemy.hp <= 0) {
            creditsRef.current += enemy.reward;
            scoreRef.current += enemy.reward * 10;
            
            // Explosion particles
            for (let p = 0; p < 8; p++) {
              particlesRef.current.push({
                x: enemy.x,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0.8,
                maxLife: 0.8,
                color: enemy.color,
                size: 3 + Math.random() * 4
              });
            }
            sounds.playExplosion();
            enemiesRef.current.splice(i, 1);
          }
        }

        // --- 6. UPDATE PARTICLES ---
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.03 * gameSpeed;
          if (pt.life <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }

        // Sync React Stats UI
        onStatsUpdate(
          creditsRef.current,
          livesRef.current,
          waveRef.current,
          scoreRef.current
        );
      }

      // --- 7. RENDERING CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid & Map Terrain
      ctx.fillStyle = currentThemeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 0; r <= GRID_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL_SIZE);
        ctx.lineTo(GRID_COLS * CELL_SIZE, r * CELL_SIZE);
        ctx.stroke();
      }
      for (let c = 0; c <= GRID_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL_SIZE, 0);
        ctx.lineTo(c * CELL_SIZE, GRID_ROWS * CELL_SIZE);
        ctx.stroke();
      }

      // Draw Path Track
      if (activePath.length > 1) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.lineWidth = CELL_SIZE * 0.65;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const startPoint = activePath[0];
        ctx.moveTo(startPoint.x * CELL_SIZE + CELL_SIZE / 2, startPoint.y * CELL_SIZE + CELL_SIZE / 2);
        for (let i = 1; i < activePath.length; i++) {
          const pt = activePath[i];
          ctx.lineTo(pt.x * CELL_SIZE + CELL_SIZE / 2, pt.y * CELL_SIZE + CELL_SIZE / 2);
        }
        ctx.stroke();

        // Inner glowing path core
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Draw End Base Rocket
      const endPt = activePath[activePath.length - 1];
      const rocketX = endPt.x * CELL_SIZE + CELL_SIZE / 2;
      const rocketY = endPt.y * CELL_SIZE + CELL_SIZE / 2;

      ctx.fillStyle = '#ff3366';
      ctx.beginPath();
      ctx.arc(rocketX, rocketY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚀', rocketX, rocketY);

      // Draw Hover Build Indicator
      if (hoverGrid && selectedBuildType) {
        const isPathCell = activePath.some(p => p.x === hoverGrid.col && p.y === hoverGrid.row);
        const mapGridBuildable = currentMap.buildableGrid[hoverGrid.row]?.[hoverGrid.col] ?? true;
        const canBuild = !isPathCell && (customChallenge ? true : mapGridBuildable) &&
          !towersRef.current.some(t => Math.floor(t.x / CELL_SIZE) === hoverGrid.col && Math.floor(t.y / CELL_SIZE) === hoverGrid.row);
        
        ctx.fillStyle = canBuild ? 'rgba(0, 255, 170, 0.3)' : 'rgba(255, 0, 85, 0.3)';
        ctx.fillRect(hoverGrid.col * CELL_SIZE, hoverGrid.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        // Draw Range Outline Preview
        const cfg = TOWER_CONFIGS[selectedBuildType];
        ctx.strokeStyle = canBuild ? cfg.color : '#ff0055';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hoverGrid.col * CELL_SIZE + CELL_SIZE / 2, hoverGrid.row * CELL_SIZE + CELL_SIZE / 2, cfg.range, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Towers
      towersRef.current.forEach(t => {
        // Base
        ctx.fillStyle = TOWER_CONFIGS[t.type].color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Turret Barrel Angle
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.angle);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -4, 16, 8);
        ctx.restore();

        // Tower Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(TOWER_CONFIGS[t.type].icon, t.x, t.y);

        // Selected Tower Range ring
        if (selectedTower?.id === t.id) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw Enemies
      enemiesRef.current.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow/Stun Effect aura
        if (e.slowTimer > 0) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // HP Bar
        const barW = e.size * 2;
        const barH = 4;
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(e.x - barW / 2, e.y - e.size - 8, barW, barH);
        ctx.fillStyle = hpPercent > 0.5 ? '#00ffaa' : hpPercent > 0.25 ? '#ffbb00' : '#ff0055';
        ctx.fillRect(e.x - barW / 2, e.y - e.size - 8, barW * hpPercent, barH);
      });

      // Draw Projectiles
      projectilesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      particlesRef.current.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentMap, gameSpeed, isPaused, selectedBuildType, selectedTower, hoverGrid, onStatsUpdate, onGameOver, onVictory]);

  // Handle Canvas Clicking (Building & Selecting Towers)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const col = Math.floor(clickX / CELL_SIZE);
    const row = Math.floor(clickY / CELL_SIZE);

    // Check if clicked an existing tower
    const clickedTower = towersRef.current.find(t => 
      Math.floor(t.x / CELL_SIZE) === col && Math.floor(t.y / CELL_SIZE) === row
    );

    if (clickedTower) {
      setSelectedTower(clickedTower);
      return;
    }

    // Try building a new tower
    if (selectedBuildType) {
      const config = TOWER_CONFIGS[selectedBuildType];

      if (creditsRef.current < config.cost) {
        return; // Not enough credits
      }

      // Max towers limit for custom challenge
      if (customChallenge && towersRef.current.length >= customChallenge.maxTowers) {
        alert(`Max tower limit (${customChallenge.maxTowers}) reached for this challenge!`);
        return;
      }

      const isPathCell = activePath.some(p => p.x === col && p.y === row);
      const canBuildOnGrid = !isPathCell && (customChallenge ? true : (currentMap.buildableGrid[row]?.[col] ?? true));

      if (canBuildOnGrid) {
        // Build tower
        const newTower: Tower = {
          id: Math.random().toString(36).substring(2, 9),
          type: selectedBuildType,
          x: col * CELL_SIZE + CELL_SIZE / 2,
          y: row * CELL_SIZE + CELL_SIZE / 2,
          level: 1,
          lastFired: 0,
          range: config.range,
          damage: config.damage,
          fireRate: config.fireRate,
          targetId: null,
          angle: 0
        };

        towersRef.current.push(newTower);
        creditsRef.current -= config.cost;
        setSelectedTower(newTower);
        sounds.playLaser();
      }
    } else {
      setSelectedTower(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    setHoverGrid({ col, row });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={GRID_COLS * CELL_SIZE}
        height={GRID_ROWS * CELL_SIZE}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverGrid(null)}
        style={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 240, 255, 0.2)',
          border: '2px solid rgba(0, 240, 255, 0.4)',
          cursor: selectedBuildType ? 'crosshair' : 'pointer',
          display: 'block'
        }}
      />

      {/* Start Wave Floating Overlay Button */}
      {!waveInProgressRef.current && (
        <button
          onClick={startNextWave}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fff',
            background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
            border: 'none',
            borderRadius: '30px',
            boxShadow: '0 4px 20px rgba(0, 240, 255, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          🚀 Launch Wave {waveRef.current}
        </button>
      )}
    </div>
  );
};
