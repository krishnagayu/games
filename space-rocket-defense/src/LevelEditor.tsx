import React, { useState } from 'react';
import type { Position, TowerType, EnemyType, CustomChallenge } from './types';
import { TOWER_CONFIGS } from './types';
import { GRID_COLS, GRID_ROWS, CELL_SIZE } from './maps';

interface LevelEditorProps {
  onSaveChallenge: (challenge: CustomChallenge) => void;
  onCancel: () => void;
}

export const LevelEditor: React.FC<LevelEditorProps> = ({ onSaveChallenge, onCancel }) => {
  const [creatorName, setCreatorName] = useState<string>('Kid 1');
  const [path, setPath] = useState<Position[]>([
    { x: 0, y: 2 },
    { x: 5, y: 2 },
    { x: 5, y: 7 },
    { x: 10, y: 7 },
    { x: 10, y: 4 },
    { x: 15, y: 4 }
  ]);

  const [startingCredits, setStartingCredits] = useState<number>(400);
  const [maxTowers, setMaxTowers] = useState<number>(8);
  const [allowedTowers, setAllowedTowers] = useState<Record<TowerType, boolean>>({
    laser: true,
    cryo: true,
    plasma: true,
    magnet: true
  });

  const [enemyWave, setEnemyWave] = useState<Record<EnemyType, number>>({
    blobbot: 6,
    slime: 4,
    saucer: 2,
    boss: 1
  });

  // Track path editing mode
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    // Reset path starting at clicked position if valid
    setPath([{ x: col, y: row }]);
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    setPath(prev => {
      const last = prev[prev.length - 1];
      if (last && (last.x !== col || last.y !== row)) {
        // Prevent duplicate path nodes
        return [...prev, { x: col, y: row }];
      }
      return prev;
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (path.length < 2) {
      alert('Please draw a path with at least 2 points!');
      return;
    }

    onSaveChallenge({
      creatorName,
      path,
      startingCredits,
      maxTowers,
      allowedTowers,
      enemyWave
    });
  };

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      padding: '24px',
      borderRadius: '28px',
      border: '3px solid #fde047',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
      color: '#0f172a',
      maxWidth: '1000px',
      width: '100%'
    }}>
      {/* Left: Interactive Canvas Path Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', color: '#0d9488', fontFamily: 'Fredoka, cursive' }}>🎨 1. Paint Alien March Path</h2>
        <p style={{ fontSize: '13px', color: '#64748b' }}>Click and drag across tiles to draw custom invasion path!</p>

        <div
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          style={{
            width: `${GRID_COLS * CELL_SIZE}px`,
            height: `${GRID_ROWS * CELL_SIZE}px`,
            position: 'relative',
            background: '#0a0f24',
            borderRadius: '12px',
            border: '2px dashed rgba(0, 240, 255, 0.4)',
            cursor: 'crosshair',
            overflow: 'hidden'
          }}
        >
          {/* Grid lines */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: GRID_ROWS + 1 }).map((_, r) => (
              <line key={`r-${r}`} x1={0} y1={r * CELL_SIZE} x2={GRID_COLS * CELL_SIZE} y2={r * CELL_SIZE} stroke="rgba(255,255,255,0.05)" />
            ))}
            {Array.from({ length: GRID_COLS + 1 }).map((_, c) => (
              <line key={`c-${c}`} x1={c * CELL_SIZE} y1={0} x2={c * CELL_SIZE} y2={GRID_ROWS * CELL_SIZE} stroke="rgba(255,255,255,0.05)" />
            ))}

            {/* Path track line */}
            {path.length > 1 && (
              <polyline
                points={path.map(p => `${p.x * CELL_SIZE + CELL_SIZE / 2},${p.y * CELL_SIZE + CELL_SIZE / 2}`).join(' ')}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
            )}
          </svg>

          {/* Start Portal Icon */}
          {path[0] && (
            <div style={{
              position: 'absolute',
              left: `${path[0].x * CELL_SIZE + 6}px`,
              top: `${path[0].y * CELL_SIZE + 6}px`,
              fontSize: '24px'
            }}>
              🌀
            </div>
          )}

          {/* End Rocket Icon */}
          {path.length > 1 && (
            <div style={{
              position: 'absolute',
              left: `${path[path.length - 1].x * CELL_SIZE + 6}px`,
              top: `${path[path.length - 1].y * CELL_SIZE + 6}px`,
              fontSize: '24px'
            }}>
              🚀
            </div>
          )}
        </div>

        <button
          onClick={() => setPath([{ x: 0, y: 2 }, { x: 15, y: 2 }])}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          🧹 Reset Path
        </button>
      </div>

      {/* Right: Challenge Rules & Alien Wave Builder */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <h2 style={{ fontSize: '20px', color: '#ffbb00' }}>⚙️ 2. Set Challenge Rules</h2>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Creator Name:</label>
          <input
            type="text"
            value={creatorName}
            onChange={e => setCreatorName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
          />
        </div>

        {/* Budget & Limits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Starting Credits: 💎 {startingCredits}</label>
            <input
              type="range"
              min="150"
              max="800"
              step="50"
              value={startingCredits}
              onChange={e => setStartingCredits(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Max Towers Allowed: 🏰 {maxTowers}</label>
            <input
              type="range"
              min="3"
              max="15"
              value={maxTowers}
              onChange={e => setMaxTowers(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Allowed Tower Types */}
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Allowed Towers for Defender:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(Object.keys(TOWER_CONFIGS) as TowerType[]).map(type => (
              <button
                key={type}
                onClick={() => setAllowedTowers(prev => ({ ...prev, [type]: !prev[type] }))}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: allowedTowers[type] ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: allowedTowers[type] ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {TOWER_CONFIGS[type].icon} {TOWER_CONFIGS[type].name} {allowedTowers[type] ? '✓' : '✗'}
              </button>
            ))}
          </div>
        </div>

        {/* Enemy Wave Sliders */}
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Alien Wave Forces:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {([
              { key: 'blobbot', label: '🟢 Blobbots', max: 20 },
              { key: 'slime', label: '🔵 Space Slimes', max: 15 },
              { key: 'saucer', label: '💖 Speedy Saucers', max: 10 },
              { key: 'boss', label: '👑 Nebula Titan Bosses', max: 3 }
            ] as const).map(enemy => (
              <div key={enemy.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '150px', fontSize: '13px' }}>{enemy.label}: {enemyWave[enemy.key]}</span>
                <input
                  type="range"
                  min="0"
                  max={enemy.max}
                  value={enemyWave[enemy.key]}
                  onChange={e => setEnemyWave(prev => ({ ...prev, [enemy.key]: Number(e.target.value) }))}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 240, 255, 0.4)'
            }}
          >
            🚀 Launch Challenge for Defender!
          </button>
        </div>
      </div>
    </div>
  );
};
