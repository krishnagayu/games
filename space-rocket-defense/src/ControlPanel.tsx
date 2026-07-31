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
      width: '320px',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      color: '#fff'
    }}>
      {/* Header & Score Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Score</span>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00f0ff' }}>{score}</div>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Wave</span>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffbb00' }}>{wave} / 10</div>
        </div>
      </div>

      {/* Credits & Rocket Base HP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px 16px',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>💎</span>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>CREDITS</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ffaa' }}>{credits}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>BASE HP</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff0055' }}>{lives}</div>
          </div>
        </div>
      </div>

      {/* Build Defense Towers */}
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#94a3b8', letterSpacing: '1px' }}>
          BUILD DEFENSES
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
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${config.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  opacity: canAfford ? 1 : 0.4,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '24px' }}>{config.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>{config.name}</span>
                <span style={{ fontSize: '11px', color: '#00ffaa', marginTop: '2px' }}>💎 {config.cost}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ultimate Ability: Star Orbital Strike */}
      <button
        onClick={onTriggerOrbitalStrike}
        disabled={orbitalStrikeCooldown}
        style={{
          padding: '12px',
          borderRadius: '12px',
          border: 'none',
          background: orbitalStrikeCooldown
            ? 'rgba(255, 255, 255, 0.1)'
            : 'linear-gradient(135deg, #ff0055, #ffbb00)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          cursor: orbitalStrikeCooldown ? 'not-allowed' : 'pointer',
          boxShadow: orbitalStrikeCooldown ? 'none' : '0 4px 15px rgba(255, 0, 85, 0.4)',
          transition: 'all 0.2s'
        }}
      >
        {orbitalStrikeCooldown ? '⏳ Star Strike Cooldown' : '⭐ Orbital Star Strike'}
      </button>

      {/* Speed, Pause & Sound Controls */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button
          onClick={onTogglePause}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: isPaused ? '#ffbb00' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </button>

        <button
          onClick={onToggleSpeed}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          ⚡ {gameSpeed}x Speed
        </button>

        <button
          onClick={onToggleSound}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: soundEnabled ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 0, 85, 0.2)',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
};
