import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Award, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Sliders, 
  Trophy, 
  Activity, 
  Target, 
  Compass,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { 
  HeroCharacter, 
  VillainCharacter, 
  QteClashMode, 
  QteClashDifficulty, 
  QteClashResult,
  BossClashRecord,
  BossClashProgress,
  HubProgressUpdater
} from '../types/game';
import { sound } from '../utils/audio';
import { applyRewards } from '../utils/progression';
import { BossQteClashOverlay } from './BossQteClashOverlay';
import confetti from 'canvas-confetti';

interface BossClashDojoProps {
  playerHero: HeroCharacter;
  villains: VillainCharacter[];
  progress: BossClashProgress;
  onUpdateProgress: HubProgressUpdater<'bossClash'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

type ClashRecord = BossClashRecord;

/** Demo entries shown on the leaderboard before the player has any records of their own. */
const SAMPLE_RECORDS: ClashRecord[] = [
  {
    id: 'rec-sample-1',
    villainName: 'Null Void',
    mode: 'BeamStruggle',
    difficulty: 'Heroic',
    grade: 'S',
    maxCps: 11.4,
    score: 92,
    date: 'Sim Session #01'
  },
  {
    id: 'rec-sample-2',
    villainName: 'Queen Pyre',
    mode: 'DirectionalReflex',
    difficulty: 'OmegaLevel',
    grade: 'S+',
    maxCps: 8.2,
    score: 98,
    date: 'Sim Session #02'
  }
];

export const BossClashDojo: React.FC<BossClashDojoProps> = ({
  playerHero,
  villains,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  const [selectedVillainId, setSelectedVillainId] = useState<string>(villains[0]?.id || '');
  const [clashMode, setClashMode] = useState<QteClashMode>('BeamStruggle');
  const [difficulty, setDifficulty] = useState<QteClashDifficulty>('Heroic');
  const [activeClashOpen, setActiveClashOpen] = useState<boolean>(false);
  // Personal clash records are persistent; sample records fill the board until you have your own.
  const records: ClashRecord[] = progress.records.length > 0 ? progress.records : SAMPLE_RECORDS;
  const [lastResultBanner, setLastResultBanner] = useState<string | null>(null);

  const selectedVillain = villains.find(v => v.id === selectedVillainId) || villains[0];

  const handleStartClash = () => {
    sound.playSuper();
    setActiveClashOpen(true);
  };

  const handleClashComplete = (result: QteClashResult) => {
    setActiveClashOpen(false);

    // Save Record
    const newRecord: ClashRecord = {
      id: `rec-${Date.now()}`,
      villainName: selectedVillain.name,
      mode: clashMode,
      difficulty,
      grade: result.grade,
      maxCps: result.maxCps,
      score: result.score,
      date: `Sim Session #${String(progress.records.length + 1).padStart(2, '0')}`
    };
    onUpdateProgress(prev => ({ records: [newRecord, ...prev.records].slice(0, 25) }));

    if (result.victory) {
      const xpReward = difficulty === 'GodTier' ? 150 : difficulty === 'OmegaLevel' ? 100 : 60;
      const tokenReward = difficulty === 'GodTier' || difficulty === 'OmegaLevel' ? 2 : 1;
      const { hero: updated } = applyRewards(playerHero, {
        xp: xpReward,
        heroTokens: tokenReward,
        approval: result.moralBonusApproval
      });
      onUpdateHero(updated);

      setLastResultBanner(`🏆 CLASH WON! Grade: ${result.grade} • +${xpReward} XP, +${tokenReward} Hero Token, +${result.moralBonusApproval}% Approval!`);
    } else {
      setLastResultBanner(`💥 CLASH DRAW / LOSS: Refine your reflex timing and attempt higher CPS mashing!`);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Studio Banner */}
      <div className="bg-gradient-to-r from-red-950 via-[#151928] to-purple-950 p-6 rounded-2xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-600 border-2 border-black rounded-lg text-xs font-black tracking-widest text-white shadow-comic uppercase flex items-center gap-1.5">
              <Flame size={14} /> DANGER ROOM HOLOGRAPHIC CLASH SIMULATOR
            </span>
            <span className="text-xs font-bold text-yellow-300">QTE Tug-of-War Engine</span>
          </div>
          <h2 className="text-3xl font-black font-comic tracking-wider text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1">
            CINEMATIC BOSS CLASH & BEAM STRUGGLE DOJO
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mt-1">
            Engage in pulse-pounding beam struggles, high-speed directional arrow reflex rushes, and precision counter-parries with full keyboard, mouse, and mobile touch multi-tap support!
          </p>
        </div>

        <button
          onClick={handleStartClash}
          className="px-6 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:scale-105 transition-transform text-black font-comic text-2xl font-black rounded-2xl border-3 border-black shadow-comic-lg flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Play size={24} className="fill-black" /> LAUNCH CLASH!
        </button>
      </div>

      {lastResultBanner && (
        <div className="p-4 bg-yellow-950/90 border-2 border-yellow-400 rounded-xl text-xs sm:text-sm text-yellow-200 font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{lastResultBanner}</span>
          <button onClick={() => setLastResultBanner(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: CLASH MATCHMAKER & MECHANICS */}
        <div className="lg:col-span-7 bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5">
          <h3 className="font-comic text-xl text-yellow-400 flex items-center gap-2">
            <Sliders size={18} /> Clash Protocol Setup
          </h3>

          {/* 1. Clash Mechanics Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
              Select QTE Combat Mechanic (6 Unique Modes):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'BeamStruggle',
                  title: 'Beam Struggle Tug-of-War',
                  icon: '⚡',
                  desc: 'Rapid tap & Spacebar mashing. Push colliding energy beams into the boss!'
                },
                {
                  id: 'SidekickDualBeam',
                  title: '👥 Team-Up Dual Beam',
                  icon: '👥',
                  desc: 'Twin converging beams with your active sidekick. +25% Force Push buff!'
                },
                {
                  id: 'DirectionalReflex',
                  title: '🎯 Arrow Reflex & Swipe',
                  icon: '🎯',
                  desc: 'Sequence matching with Arrow Keys (↑ ↓ ← →) or Mobile Touch Swipes.'
                },
                {
                  id: 'DualTouchOverdrive',
                  title: '🌪️ Dual-Touch Overdrive',
                  icon: '🌪️',
                  desc: 'Hold 2 screen anchors simultaneously to condense 1000% Overdrive Burst!'
                },
                {
                  id: 'BulletTimeDeflection',
                  title: '⏳ Bullet-Time Parry',
                  icon: '⏳',
                  desc: 'Slow-motion matrix deflection! Tap all 3 weak-point nodes along the vector.'
                },
                {
                  id: 'PrecisionDial',
                  title: '⏱️ Precision Sweet-Spot',
                  icon: '⏱️',
                  desc: 'Time the oscillating dial perfectly inside the golden zone for an instant parry!'
                }
              ].map(m => {
                const isSelected = clashMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playClick();
                      setClashMode(m.id as QteClashMode);
                    }}
                    className={`p-3 rounded-xl border-3 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-300 text-black border-black font-bold shadow-comic scale-102 ring-2 ring-yellow-400'
                        : 'bg-[#121624] text-gray-300 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div>
                      <span className="text-2xl mb-1 block">{m.icon}</span>
                      <h4 className="font-comic text-xs font-black leading-tight">{m.title}</h4>
                      <p className="text-[10px] mt-1 opacity-80 leading-snug">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Supervillain Opponent Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
              Featured Supervillain Rival:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {villains.map(v => {
                const isSelected = selectedVillainId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedVillainId(v.id);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-red-600 text-white border-black font-bold shadow-comic scale-102'
                        : 'bg-[#121624] text-gray-300 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{v.avatarIcon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-comic text-xs truncate">{v.name}</div>
                      <div className="text-[9px] font-mono text-gray-400 truncate">{v.dangerTier}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Threat Level Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-wider block">
              Simulation Difficulty Level:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Novice', label: 'Novice', color: 'bg-green-600', push: 'Gentle (4.5/s)' },
                { id: 'Heroic', label: 'Heroic', color: 'bg-blue-600', push: 'Standard (7.5/s)' },
                { id: 'OmegaLevel', label: 'Omega Threat', color: 'bg-purple-600', push: 'Intense (10.0/s)' },
                { id: 'GodTier', label: 'God-Tier', color: 'bg-red-600', push: 'Extreme (14.0/s)' }
              ].map(d => {
                const isSelected = difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(d.id as QteClashDifficulty);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? `${d.color} text-white border-black font-black shadow-comic scale-105 ring-2 ring-white`
                        : 'bg-[#121624] text-gray-300 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-comic text-xs">{d.label}</div>
                    <div className="text-[9px] font-mono opacity-80 mt-0.5">{d.push}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: CLASH PREVIEW & LEADERBOARD RECORDS */}
        <div className="lg:col-span-5 space-y-5">
          {/* Clash Matchup Card Preview */}
          <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="font-comic text-lg text-yellow-400">Matchup Telemetry</h4>
              <span className="text-[10px] font-mono font-bold text-green-400">● READY FOR DEPLOYMENT</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-950/60 p-3 rounded-xl border-2 border-cyan-500 shadow-comic">
                <span className="text-4xl">{playerHero.avatarIcon}</span>
                <div className="font-comic text-sm text-yellow-300 mt-1">{playerHero.heroName}</div>
                <div className="text-[10px] font-mono text-cyan-300">Level {playerHero.level} Hero</div>
              </div>

              <div className="bg-red-950/60 p-3 rounded-xl border-2 border-red-500 shadow-comic">
                <span className="text-4xl">{selectedVillain.avatarIcon}</span>
                <div className="font-comic text-sm text-red-400 mt-1">{selectedVillain.name}</div>
                <div className="text-[10px] font-mono text-red-300">{selectedVillain.dangerTier}</div>
              </div>
            </div>

            {/* Input Hints */}
            <div className="bg-black/50 p-3 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1">
              <strong className="text-yellow-400 block font-comic">Supported Controls:</strong>
              <div className="text-[11px] font-mono">
                • <strong>Desktop:</strong> Spacebar mash / Arrow keys (↑, ↓, ←, →) / WASD.<br />
                • <strong>Mobile / Tablet:</strong> Rapid touch screen button (multi-finger support) & arcade D-Pad.
              </div>
            </div>

            <button
              onClick={handleStartClash}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-xl font-black rounded-xl border-3 border-black shadow-comic flex items-center justify-center gap-2 hover:scale-102 transition-transform active:scale-95"
            >
              <Zap size={20} className="fill-black" /> START CLASH (START SIM)
            </button>
          </div>

          {/* High Score History */}
          <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-3">
            <h4 className="font-comic text-base text-yellow-400 flex items-center gap-1.5">
              <Trophy size={16} /> Clash Record Hall of Fame
            </h4>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {records.map(r => (
                <div key={r.id} className="bg-[#0E1322] p-2.5 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-white block font-comic">{r.villainName}</span>
                    <span className="text-[10px] text-gray-400">{r.mode} • {r.difficulty}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-yellow-400 text-black font-black font-comic rounded text-xs">
                      GRADE {r.grade}
                    </span>
                    <span className="text-[10px] text-cyan-300 block mt-0.5">{r.maxCps} CPS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE QTE CLASH MODAL OVERLAY */}
      {activeClashOpen && (
        <BossQteClashOverlay
          hero={playerHero}
          boss={{
            name: selectedVillain.name,
            avatar: selectedVillain.avatarIcon,
            color: selectedVillain.color,
            powerName: selectedVillain.powers[0]?.name || 'Dark Annihilation Ray',
            stats: selectedVillain.stats
          }}
          mode={clashMode}
          difficulty={difficulty}
          onClashComplete={handleClashComplete}
          onCancel={() => setActiveClashOpen(false)}
        />
      )}
    </div>
  );
};
