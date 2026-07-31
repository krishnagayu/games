import { useState } from 'react';
import { GameBoard } from './GameBoard';
import { ControlPanel } from './ControlPanel';
import { LevelEditor } from './LevelEditor';
import type { TowerType, CustomChallenge } from './types';
import { MAPS } from './maps';
import './App.css';

export function App() {
  const [gameState, setGameState] = useState<'menu' | 'editor' | 'playing' | 'gameover' | 'victory'>('menu');
  const [currentMapIndex, setCurrentMapIndex] = useState<number>(0);
  const [customChallenge, setCustomChallenge] = useState<CustomChallenge | null>(null);

  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedBuildType, setSelectedBuildType] = useState<TowerType | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Live HUD Stats
  const [stats, setStats] = useState({
    credits: 350,
    lives: 20,
    wave: 1,
    score: 0
  });

  const [orbitalStrikeRequested, setOrbitalStrikeRequested] = useState<boolean>(false);
  const [orbitalStrikeCooldown, setOrbitalStrikeCooldown] = useState<boolean>(false);

  const handleStatsUpdate = (credits: number, lives: number, wave: number, score: number) => {
    setStats({ credits, lives, wave, score });
  };

  const handleGameOver = (finalScore: number) => {
    setStats(prev => ({ ...prev, score: finalScore }));
    setGameState('gameover');
  };

  const handleVictory = (finalScore: number) => {
    setStats(prev => ({ ...prev, score: finalScore }));
    setGameState('victory');
  };

  const handleSaveCustomChallenge = (challenge: CustomChallenge) => {
    setCustomChallenge(challenge);
    setStats(prev => ({ ...prev, credits: challenge.startingCredits }));
    setGameState('playing');
  };

  const triggerOrbitalStrike = () => {
    if (orbitalStrikeCooldown) return;
    setOrbitalStrikeRequested(true);
    setOrbitalStrikeCooldown(true);

    // 15 second cooldown
    setTimeout(() => {
      setOrbitalStrikeCooldown(false);
    }, 15000);
  };

  return (
    <div className="game-container">
      {/* Top Navigation Header */}
      <header className="game-header">
        <h1>🚀 SPACE ROCKET DEFENSE</h1>
        <div className="header-badge">
          {customChallenge ? `🎯 Challenge by ${customChallenge.creatorName}` : MAPS[currentMapIndex].name}
        </div>
      </header>

      {/* Main Game Screen */}
      {gameState === 'menu' && (
        <div className="modal-screen">
          <h2>Defend the Space Base!</h2>
          <p>Build laser towers, frost beams, and plasma cannons to defend the rocket!</p>
          
          <div className="map-selector">
            <h3>Select Mode / Planet Map:</h3>
            <div className="map-buttons">
              {MAPS.map((map, idx) => (
                <button
                  key={map.id}
                  className={`map-btn ${currentMapIndex === idx && !customChallenge ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentMapIndex(idx);
                    setCustomChallenge(null);
                  }}
                >
                  🪐 {map.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button
              className="primary-btn"
              onClick={() => {
                setCustomChallenge(null);
                setGameState('playing');
              }}
            >
              🎮 CAMPAIGN MODE
            </button>

            <button
              className="primary-btn"
              style={{ background: 'linear-gradient(135deg, #ff00aa, #ffbb00)' }}
              onClick={() => setGameState('editor')}
            >
              🖌️ 2-PLAYER LEVEL CREATOR
            </button>
          </div>
        </div>
      )}

      {gameState === 'editor' && (
        <LevelEditor
          onSaveChallenge={handleSaveCustomChallenge}
          onCancel={() => setGameState('menu')}
        />
      )}

      {gameState === 'playing' && (
        <div className="game-layout">
          <GameBoard
            currentMapIndex={currentMapIndex}
            customChallenge={customChallenge}
            gameSpeed={gameSpeed}
            isPaused={isPaused}
            selectedBuildType={selectedBuildType}
            soundEnabled={soundEnabled}
            onStatsUpdate={handleStatsUpdate}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            orbitalStrikeRequested={orbitalStrikeRequested}
            onOrbitalStrikeUsed={() => setOrbitalStrikeRequested(false)}
          />

          <ControlPanel
            credits={stats.credits}
            lives={stats.lives}
            wave={stats.wave}
            score={stats.score}
            selectedBuildType={selectedBuildType}
            onSelectBuildType={setSelectedBuildType}
            allowedTowers={customChallenge?.allowedTowers}
            gameSpeed={gameSpeed}
            onToggleSpeed={() => setGameSpeed(prev => (prev === 1 ? 2 : 1))}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(prev => !prev)}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(prev => !prev)}
            onTriggerOrbitalStrike={triggerOrbitalStrike}
            orbitalStrikeCooldown={orbitalStrikeCooldown}
          />
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="modal-screen">
          <h2 style={{ color: '#ff0055' }}>💥 MISSION FAILED!</h2>
          <p>
            {customChallenge
              ? `The custom alien wave created by ${customChallenge.creatorName} broke through!`
              : 'The space base was overwhelmed by alien invaders!'}
          </p>
          <div className="final-score">Final Score: {stats.score}</div>
          <button className="primary-btn" onClick={() => setGameState('playing')}>
            🔄 TRY AGAIN
          </button>
          <button
            className="map-btn"
            style={{ marginTop: '8px' }}
            onClick={() => setGameState('menu')}
          >
            🏠 MAIN MENU
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="modal-screen">
          <h2 style={{ color: '#00ffaa' }}>🏆 VICTORY! COLONY SAVED!</h2>
          <p>
            {customChallenge
              ? `You successfully defeated ${customChallenge.creatorName}'s custom challenge!`
              : 'You successfully repelled all 10 alien waves!'}
          </p>
          <div className="final-score">Final Score: {stats.score}</div>
          <button className="primary-btn" onClick={() => setGameState('menu')}>
            🌌 MAIN MENU
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

