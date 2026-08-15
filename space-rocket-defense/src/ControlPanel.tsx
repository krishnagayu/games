import React from 'react';
import type { TowerType } from './types';
import { TOWER_CONFIGS } from './types';

interface ControlPanelProps {
  credits: number;
  lives: number;
  wave: number;
  score: number;
  selectedBuildType: TowerType | null;
  onSelectBuildType: (type: TowerType | null) => void;
  allowedTowers?: Record<TowerType, boolean>;
  gameSpeed: number;
  onToggleSpeed: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerOrbitalStrike: () => void;
  orbitalStrikeCooldown: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  credits,
  lives,
  wave,
  score,
  selectedBuildType,
  onSelectBuildType,
  allowedTowers,
  gameSpeed,
  onToggleSpeed,
  isPaused,
  onTogglePause,
  soundEnabled,
  onToggleSound,
  onTriggerOrbitalStrike,
  orbitalStrikeCooldown
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '330px',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      padding: '22px',
      borderRadius: '24px',
      border: '2px solid #cbd5e1',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
      color: '#0f172a'
    }}>
      {/* Header & Score Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score</span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0284c7', fontFamily: 'Fredoka, cursive' }}>{score}</div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wave</span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', fontFamily: 'Fredoka, cursive' }}>{wave} / 10</div>
        </div>
      </div>

      {/* Credits & Rocket Base HP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: '#f1f5f9',
        padding: '12px 16px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🪙</span>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800 }}>GOLD COINS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>{credits}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🏝️</span>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800 }}>ISLAND HP</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#e11d48' }}>{lives}</div>
          </div>
        </div>
      </div>

      {/* Build Defense Towers */}
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', fontWeight: 800, letterSpacing: '1px' }}>
          BUILD ISLAND DEFENSES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {(Object.keys(TOWER_CONFIGS) as TowerType[])
            .filter(type => allowedTowers ? allowedTowers[type] : true)
            .map(type => {
            const config = TOWER_CONFIGS[type];
            const isSelected = selectedBuildType === type;
            const canAfford = credits >= config.cost;

            return (
              <button
                key={type}
                onClick={() => onSelectBuildType(isSelected ? null : type)}
                disabled={!canAfford}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 10px',
                  borderRadius: '16px',
                  border: isSelected ? `2px solid ${config.color}` : '2px solid #e2e8f0',
                  background: isSelected ? '#f0fdf4' : canAfford ? '#ffffff' : '#f8fafc',
                  opacity: canAfford ? 1 : 0.5,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  boxShadow: isSelected ? `0 4px 14px ${config.color}40` : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '26px', marginBottom: '4px' }}>{config.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>{config.name}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', marginTop: '2px' }}>
                  🪙 {config.cost}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Ability: Sun Strike */}
      <button
        onClick={onTriggerOrbitalStrike}
        disabled={orbitalStrikeCooldown}
        style={{
          padding: '14px',
          borderRadius: '16px',
          border: 'none',
          background: orbitalStrikeCooldown ? '#cbd5e1' : 'linear-gradient(135deg, #f59e0b, #ea580c)',
          color: '#fff',
          fontWeight: '800',
          fontSize: '14px',
          cursor: orbitalStrikeCooldown ? 'not-allowed' : 'pointer',
          boxShadow: orbitalStrikeCooldown ? 'none' : '0 6px 18px rgba(245, 158, 11, 0.4)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span>☀️</span>
        {orbitalStrikeCooldown ? 'SUN STRIKE COOLDOWN...' : 'SOLAR SUN STRIKE!'}
      </button>

      {/* Game Speed & Pause Controls */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button
          onClick={onTogglePause}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            background: isPaused ? '#fef3c7' : '#ffffff',
            color: isPaused ? '#b45309' : '#334155',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          onClick={onToggleSpeed}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            background: gameSpeed > 1 ? '#e0f2fe' : '#ffffff',
            color: gameSpeed > 1 ? '#0369a1' : '#334155',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ⚡ {gameSpeed}x Speed
        </button>
        <button
          onClick={onToggleSound}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            background: soundEnabled ? '#f0fdf4' : '#f8fafc',
            color: soundEnabled ? '#15803d' : '#64748b',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
};
