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
  onStatsUpdate: (credits: number, lives: number, wave: number, score: number, towerCount: number) => void;
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
  
  const selectedTowerRef = useRef<Tower | null>(null);
  const hoverGridRef = useRef<{ col: number; row: number } | null>(null);
  const selectedBuildTypeRef = useRef<TowerType | null>(selectedBuildType);
  selectedBuildTypeRef.current = selectedBuildType;

  // Use map path or custom painted challenge path
  const currentMap = MAPS[currentMapIndex] || MAPS[0];
  const activePath = customChallenge ? customChallenge.path : currentMap.path;
  const currentThemeColor = currentMap.themeColor;

  sounds.enabled = soundEnabled;

  const [selectedTower, setSelectedTowerState] = useState<Tower | null>(null);
  const setSelectedTower = (val: Tower | null) => {
    selectedTowerRef.current = val;
    setSelectedTowerState(val);
  };

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

    const waveMult = 1 + (waveRef.current - 1) * 0.28; // Increased HP scaling per wave

    let hp = 55 * waveMult;
    let speed = 1.8;
    let color = '#33ff57';
    let size = 14;
    let reward = 10; // Reduced reward
    let name = 'Blobbot';

    if (type === 'slime') {
      hp = 45 * waveMult;
      speed = 2.7;
      color = '#00f0ff';
      size = 11;
      reward = 12;
      name = 'Space Slime';
    } else if (type === 'saucer') {
      hp = 95 * waveMult;
      speed = 2.2;
      color = '#ff00aa';
      size = 16;
      reward = 18;
      name = 'Speedy Saucer';
    } else if (type === 'boss') {
      hp = 650 * waveMult;
      speed = 1.2;
      color = '#ffbb00';
      size = 24;
      reward = 80;
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
        if (particlesRef.current.length > 200) {
          particlesRef.current.splice(0, particlesRef.current.length - 200);
        }
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.03 * Math.max(0.1, gameSpeed);
          if (pt.life <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }

        // Sync React Stats UI (throttled to 10 FPS to prevent React re-render lag during 60 FPS canvas loop)
        if (Math.floor(Date.now() / 100) !== Math.floor((Date.now() - 16) / 100)) {
          onStatsUpdate(
            creditsRef.current,
            livesRef.current,
            waveRef.current,
            scoreRef.current,
            towersRef.current.length
          );
        }
      }

      // --- 7. RENDERING CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Island Base Terrain (Grass & Ocean Shore)
      ctx.fillStyle = currentThemeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grass texture dots/blades
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      // Soft Grid Outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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

      // Decorative Palm Trees & Shore Rocks
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Fixed spots for island decorations
      [
        { c: 1, r: 1, icon: '🌴' },
        { c: 8, r: 0, icon: '🌴' },
        { c: 14, r: 1, icon: '🌴' },
        { c: 0, r: 8, icon: '🌺' },
        { c: 15, r: 5, icon: '🌴' },
        { c: 6, r: 9, icon: '🌺' },
        { c: 12, r: 9, icon: '🌴' },
      ].forEach(decor => {
        const isPathCell = activePath.some(p => p.x === decor.c && p.y === decor.r);
        if (!isPathCell) {
          ctx.fillText(decor.icon, decor.c * CELL_SIZE + CELL_SIZE / 2, decor.r * CELL_SIZE + CELL_SIZE / 2);
        }
      });

      // 2. Draw Sandy Beach Path Track
      if (activePath.length > 1) {
        // Outer Sand Path Border
        ctx.strokeStyle = '#fde047'; // bright sunny sand border
        ctx.lineWidth = CELL_SIZE * 0.75;
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

        // Inner Warm Sandy Beach Track
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = CELL_SIZE * 0.6;
        ctx.stroke();

        // Path Direction Arrows / Footprints
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw End Goal Island Resort Base
      const endPt = activePath[activePath.length - 1];
      const resortX = endPt.x * CELL_SIZE + CELL_SIZE / 2;
      const resortY = endPt.y * CELL_SIZE + CELL_SIZE / 2;

      // Base Halo
      ctx.fillStyle = 'rgba(254, 243, 199, 0.8)';
      ctx.beginPath();
      ctx.arc(resortX, resortY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚀', resortX, resortY);

      // Draw Hover Build Indicator & Tower Placement Preview
      const currentHover = hoverGridRef.current;
      const currentBuildType = selectedBuildTypeRef.current;
      if (currentHover && currentBuildType) {
        const isPathCell = activePath.some(p => p.x === currentHover.col && p.y === currentHover.row);
        const mapGridBuildable = currentMap.buildableGrid[currentHover.row]?.[currentHover.col] ?? true;
        const canBuild = !isPathCell && (customChallenge ? true : mapGridBuildable) &&
          !towersRef.current.some(t => Math.floor(t.x / CELL_SIZE) === currentHover.col && Math.floor(t.y / CELL_SIZE) === currentHover.row);
        
        const px = currentHover.col * CELL_SIZE;
        const py = currentHover.row * CELL_SIZE;

        // High contrast grid cell highlight box
        ctx.fillStyle = canBuild ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        
        // Thick white outline around target tile
        ctx.strokeStyle = canBuild ? '#ffffff' : '#dc2626';
        ctx.lineWidth = 3;
        ctx.strokeRect(px + 1.5, py + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);

        const cfg = TOWER_CONFIGS[currentBuildType];
        const centerX = px + CELL_SIZE / 2;
        const centerY = py + CELL_SIZE / 2;

        if (canBuild) {
          // Semi-transparent ghost tower icon preview
          ctx.save();
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = cfg.color;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cfg.icon, centerX, centerY);
          ctx.restore();
        }

        // Dashed attack range preview circle
        ctx.strokeStyle = canBuild ? '#0284c7' : '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, cfg.range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Island Defense Towers
      towersRef.current.forEach(t => {
        // Wooden/Stone Pedestal
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner Color Ring
        ctx.fillStyle = TOWER_CONFIGS[t.type].color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Turret Barrel Angle
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.angle);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, -4, 18, 8);
        ctx.restore();

        // Tower Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(TOWER_CONFIGS[t.type].icon, t.x, t.y);

        // Selected Tower Range ring
        if (selectedTower?.id === t.id) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw Invading Aliens/Monsters
      enemiesRef.current.forEach(e => {
        // Shadow underneath
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(e.x, e.y + e.size * 0.5, e.size * 0.8, e.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Monster Body
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Slow/Stun Effect aura
        if (e.slowTimer > 0) {
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // HP Bar
        const barW = e.size * 2.2;
        const barH = 5;
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(e.x - barW / 2 - 1, e.y - e.size - 10 - 1, barW + 2, barH + 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(e.x - barW / 2, e.y - e.size - 10, barW, barH);
        ctx.fillStyle = hpPercent > 0.5 ? '#10b981' : hpPercent > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(e.x - barW / 2, e.y - e.size - 10, barW * hpPercent, barH);
      });

      // Draw Projectiles
      projectilesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
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
  }, [currentMap, gameSpeed, isPaused, onStatsUpdate, onGameOver, onVictory]);

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
      const maxAllowed = customChallenge ? customChallenge.maxTowers : 7;

      if (towersRef.current.length >= maxAllowed) {
        alert(`Maximum tower limit (${maxAllowed}) reached! Sell or plan strategically!`);
        return;
      }

      // Cost increases by +15% per placed tower
      const dynamicCost = Math.round(config.cost * (1 + towersRef.current.length * 0.15));

      if (creditsRef.current < dynamicCost) {
        return; // Not enough credits
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
        creditsRef.current -= dynamicCost;
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
    hoverGridRef.current = { col, row };
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={GRID_COLS * CELL_SIZE}
        height={GRID_ROWS * CELL_SIZE}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { hoverGridRef.current = null; }}
        style={{
          borderRadius: '20px',
          boxShadow: '0 12px 36px rgba(2, 132, 199, 0.3), 0 2px 0 rgba(255, 255, 255, 0.4)',
          border: '4px solid #ffffff',
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
            bottom: '24px',
            right: '24px',
            padding: '14px 28px',
            fontSize: '18px',
            fontWeight: '800',
            fontFamily: 'Fredoka, cursive',
            color: '#fff',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '35px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          🏖️ Launch Wave {waveRef.current}
        </button>
      )}
    </div>
  );
};
