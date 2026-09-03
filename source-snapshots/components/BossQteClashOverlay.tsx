import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Award, 
  Target,
  Smartphone,
  Users,
  Shield,
  Layers,
  Crosshair
} from 'lucide-react';
import { 
  HeroCharacter, 
  VillainCharacter, 
  QteClashMode, 
  QteClashDifficulty, 
  DirectionKey, 
  QteClashResult,
  SidekickCharacter
} from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import confetti from 'canvas-confetti';

interface BossQteClashOverlayProps {
  hero: HeroCharacter;
  boss: {
    name: string;
    avatar: string;
    color?: string;
    powerName?: string;
    stats?: any;
  };
  sidekick?: SidekickCharacter;
  mode?: QteClashMode;
  difficulty?: QteClashDifficulty;
  customHeroPowerName?: string;
  customBossPowerName?: string;
  onClashComplete: (result: QteClashResult) => void;
  onCancel?: () => void;
}

export const BossQteClashOverlay: React.FC<BossQteClashOverlayProps> = ({
  hero,
  boss,
  sidekick: initialSidekick,
  mode: initialMode = 'BeamStruggle',
  difficulty = 'Heroic',
  customHeroPowerName,
  customBossPowerName,
  onClashComplete,
  onCancel
}) => {
  const [currentMode, setCurrentMode] = useState<QteClashMode>(initialMode);
  const [phase, setPhase] = useState<'Intro' | 'Active' | 'Result'>('Intro');
  
  // Clocks & Timers
  const totalDuration = difficulty === 'GodTier' ? 5.0 : difficulty === 'OmegaLevel' ? 6.0 : difficulty === 'Heroic' ? 7.0 : 8.0;
  const [timeLeft, setTimeLeft] = useState<number>(totalDuration);

  // Active Sidekick (Companion Partner)
  const activeSidekick = initialSidekick || hero.sidekicks?.find(s => s.status === 'Active Companion') || {
    id: 'sidekick-bolt',
    heroAlias: 'Apex Cadet',
    civilianName: 'Sam',
    role: 'Speedster Striker',
    level: hero.level,
    xp: 0,
    xpToNextLevel: 100,
    stats: hero.stats,
    avatarIcon: '⚡',
    color: '#06B6D4',
    backstory: '',
    status: 'Active Companion',
    synergyMove: {
      name: 'Twin Surge Pulse',
      damage: 120,
      apCost: 20,
      description: ''
    }
  } as SidekickCharacter;

  // Beam Struggle State (Tug-of-War: 0 = Boss Victory, 100 = Hero Victory, Starts at 50)
  const [beamPosition, setBeamPosition] = useState<number>(50);
  const [clickCount, setClickCount] = useState<number>(0);
  const [cps, setCps] = useState<number>(0);
  const [maxCps, setMaxCps] = useState<number>(0);
  const [bossSurgeActive, setBossSurgeActive] = useState<boolean>(false);

  // Directional Reflex State
  const [arrowSequence, setArrowSequence] = useState<DirectionKey[]>([]);
  const [currentArrowIdx, setCurrentArrowIdx] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxComboStreak, setMaxComboStreak] = useState<number>(0);
  const [perfectHits, setPerfectHits] = useState<number>(0);
  const [feedbackEffect, setFeedbackEffect] = useState<{ text: string; color: string; id: number } | null>(null);

  // Precision Sweet-Spot Dial State
  const [needleAngle, setNeedleAngle] = useState<number>(0);
  const [sweetSpotStart, setSweetSpotStart] = useState<number>(65);
  const [sweetSpotWidth, setSweetSpotWidth] = useState<number>(20);
  const [dialRoundsWon, setDialRoundsWon] = useState<number>(0);
  const [dialTotalRounds] = useState<number>(3);

  // 1. DUAL-TOUCH OVERDRIVE BURST STATE
  const [overdriveCharge, setOverdriveCharge] = useState<number>(0);
  const [isHoldingLeft, setIsHoldingLeft] = useState<boolean>(false);
  const [isHoldingRight, setIsHoldingRight] = useState<boolean>(false);

  // 2. BULLET-TIME DEFLECTION STATE
  const [bulletTimeActive, setBulletTimeActive] = useState<boolean>(false);
  const [projectilePos, setProjectilePos] = useState<number>(10);
  const [deflectTargets, setDeflectTargets] = useState<{ id: number; x: number; y: number; hit: boolean }[]>([
    { id: 1, x: 30, y: 40, hit: false },
    { id: 2, x: 50, y: 60, hit: false },
    { id: 3, x: 70, y: 35, hit: false }
  ]);

  // Touch Swipe Trajectory State
  const touchStartCoord = useRef<{ x: number; y: number } | null>(null);
  const [swipeVisualTrail, setSwipeVisualTrail] = useState<string | null>(null);

  // Visual FX State
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [resultState, setResultState] = useState<QteClashResult | null>(null);

  const heroPower = customHeroPowerName || hero.powers[0]?.name || 'Limit Break Plasma Beam';
  const bossPower = customBossPowerName || boss.powerName || 'Dark Matter Annihilation Ray';

  const pressTimestamps = useRef<number[]>([]);

  // Difficulty Parameters
  const getBossPushRate = useCallback(() => {
    switch (difficulty) {
      case 'GodTier': return 14;
      case 'OmegaLevel': return 10;
      case 'Heroic': return 7.5;
      case 'Novice': return 4.5;
    }
  }, [difficulty]);

  const getPlayerPushPower = useCallback(() => {
    const base = currentMode === 'SidekickDualBeam' ? 5.8 : 4.2;
    const strengthBonus = Math.min(2.5, (hero.stats?.strength || 30) / 40);
    return base + strengthBonus;
  }, [hero.stats?.strength, currentMode]);

  // Generate random directional arrows
  const generateNewArrow = (): DirectionKey => {
    const keys: DirectionKey[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  // Initialize Arrow Sequence
  useEffect(() => {
    const count = difficulty === 'GodTier' ? 14 : difficulty === 'OmegaLevel' ? 10 : 8;
    const seq: DirectionKey[] = [];
    for (let i = 0; i < count; i++) {
      seq.push(generateNewArrow());
    }
    setArrowSequence(seq);
  }, [difficulty]);

  // Start Active Phase after dramatic Intro
  useEffect(() => {
    sound.playLaser();
    const introTimer = setTimeout(() => {
      setPhase('Active');
      if (currentMode === 'BulletTimeDeflection') {
        sound.playBulletTimeSlow();
        setBulletTimeActive(true);
      } else {
        sound.playSuper();
      }
    }, 1200);
    return () => clearTimeout(introTimer);
  }, [currentMode]);

  // Main Game Loop
  useEffect(() => {
    if (phase !== 'Active') return;

    const interval = 50; // ms
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const nextTime = Math.max(0, prev - interval / 1000);

        // Update CPS meter
        const now = Date.now();
        pressTimestamps.current = pressTimestamps.current.filter(t => now - t <= 1000);
        const currentCps = pressTimestamps.current.length;
        setCps(currentCps);
        setMaxCps(m => Math.max(m, currentCps));

        // Random Boss Surge triggers
        if (Math.random() < 0.04 && !bossSurgeActive && nextTime > 1.5) {
          setBossSurgeActive(true);
          sound.playAlarm();
          setTimeout(() => setBossSurgeActive(false), 1200);
        }

        // BEAM STRUGGLE & SIDEKICK DUAL-BEAM UPDATE
        if (currentMode === 'BeamStruggle' || currentMode === 'SidekickDualBeam') {
          const bossPush = (getBossPushRate() * (bossSurgeActive ? 2.0 : 1.0) * (interval / 1000));
          setBeamPosition(pos => {
            const newPos = Math.max(0, Math.min(100, pos - bossPush));
            if (newPos >= 100) {
              triggerClashOutcome(true, 100);
            } else if (newPos <= 0) {
              triggerClashOutcome(false, 0);
            }
            return newPos;
          });
        }

        // DUAL-TOUCH OVERDRIVE CHARGING
        if (currentMode === 'DualTouchOverdrive') {
          if (isHoldingLeft && isHoldingRight) {
            setOverdriveCharge(charge => {
              const nextCharge = Math.min(100, charge + 2.5);
              if (nextCharge >= 100) {
                sound.playOverdriveCharge();
              }
              return nextCharge;
            });
          } else {
            setOverdriveCharge(charge => Math.max(0, charge - 1.5));
          }
        }

        // BULLET-TIME PROJECTILE ADVANCE
        if (currentMode === 'BulletTimeDeflection') {
          setProjectilePos(p => {
            const nextP = p + 0.8;
            if (nextP >= 95) {
              const allHit = deflectTargets.every(t => t.hit);
              triggerClashOutcome(allHit, allHit ? 100 : 30);
            }
            return nextP;
          });
        }

        // PRECISION DIAL OSCILLATION
        if (currentMode === 'PrecisionDial') {
          const speed = difficulty === 'GodTier' ? 4 : difficulty === 'OmegaLevel' ? 3 : 2;
          setNeedleAngle(angle => (angle + speed * 4) % 100);
        }

        // Check Time Out
        if (nextTime <= 0) {
          if (currentMode === 'BeamStruggle' || currentMode === 'SidekickDualBeam') {
            triggerClashOutcome(beamPosition >= 50, beamPosition);
          } else if (currentMode === 'DirectionalReflex') {
            const won = currentArrowIdx >= arrowSequence.length * 0.7;
            triggerClashOutcome(won, (currentArrowIdx / arrowSequence.length) * 100);
          } else if (currentMode === 'PrecisionDial') {
            const won = dialRoundsWon >= 2;
            triggerClashOutcome(won, (dialRoundsWon / dialTotalRounds) * 100);
          } else if (currentMode === 'DualTouchOverdrive') {
            triggerClashOutcome(overdriveCharge >= 90, overdriveCharge);
          } else if (currentMode === 'BulletTimeDeflection') {
            const allHit = deflectTargets.every(t => t.hit);
            triggerClashOutcome(allHit, allHit ? 100 : 25);
          }
        }

        return nextTime;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [phase, currentMode, bossSurgeActive, getBossPushRate, beamPosition, currentArrowIdx, arrowSequence.length, dialRoundsWon, dialTotalRounds, isHoldingLeft, isHoldingRight, overdriveCharge, deflectTargets, difficulty]);

  // Handle Player Mash Input
  const handlePlayerMash = useCallback(() => {
    if (phase !== 'Active') return;

    sound.playQteMashTap();
    pressTimestamps.current.push(Date.now());
    setClickCount(c => c + 1);

    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 80);

    if (currentMode === 'BeamStruggle' || currentMode === 'SidekickDualBeam' || currentMode === 'MultiTapSurge') {
      const push = getPlayerPushPower();
      setBeamPosition(pos => {
        const next = Math.min(100, pos + push);
        if (next >= 100) {
          triggerClashOutcome(true, 100);
        }
        return next;
      });
    }
  }, [phase, currentMode, getPlayerPushPower]);

  // Handle Directional Arrow Input (with Swipe support)
  const handleDirectionPress = useCallback((key: DirectionKey) => {
    if (phase !== 'Active' || currentMode !== 'DirectionalReflex') return;

    const expected = arrowSequence[currentArrowIdx];

    if (key === expected) {
      const newCombo = comboStreak + 1;
      setComboStreak(newCombo);
      setMaxComboStreak(m => Math.max(m, newCombo));
      setPerfectHits(p => p + 1);
      sound.playQteArrowHit(newCombo);

      setFeedbackEffect({
        text: newCombo > 5 ? 'PERFECT! x' + newCombo : 'GREAT!',
        color: 'text-yellow-400',
        id: Date.now()
      });

      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 90);

      const nextIdx = currentArrowIdx + 1;
      setCurrentArrowIdx(nextIdx);

      if (nextIdx >= arrowSequence.length) {
        triggerClashOutcome(true, 100);
      }
    } else {
      sound.playQteMiss();
      setComboStreak(0);
      setFeedbackEffect({
        text: 'MISS!',
        color: 'text-red-500',
        id: Date.now()
      });
    }
  }, [phase, currentMode, arrowSequence, currentArrowIdx, comboStreak]);

  // TOUCH SWIPE GESTURE HANDLER
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartCoord.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoord.current || phase !== 'Active' || currentMode !== 'DirectionalReflex') return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartCoord.current.x;
    const dy = touch.clientY - touchStartCoord.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      sound.playSwipeSwoosh();
      let direction: DirectionKey = 'RIGHT';

      if (absX > absY) {
        direction = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        direction = dy > 0 ? 'DOWN' : 'UP';
      }

      setSwipeVisualTrail(`SWIPE ${direction}!`);
      setTimeout(() => setSwipeVisualTrail(null), 400);
      handleDirectionPress(direction);
    }
    touchStartCoord.current = null;
  };

  // Handle Precision Lock Input
  const handlePrecisionLock = useCallback(() => {
    if (phase !== 'Active' || currentMode !== 'PrecisionDial') return;

    const inSweetSpot = needleAngle >= sweetSpotStart && needleAngle <= (sweetSpotStart + sweetSpotWidth);

    if (inSweetSpot) {
      sound.playVictory();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 200);

      const nextWon = dialRoundsWon + 1;
      setDialRoundsWon(nextWon);
      setFeedbackEffect({ text: 'CRITICAL DEFLECT!', color: 'text-green-400', id: Date.now() });

      setSweetSpotStart(Math.floor(Math.random() * 60) + 15);

      if (nextWon >= dialTotalRounds) {
        triggerClashOutcome(true, 100);
      }
    } else {
      sound.playQteMiss();
      setFeedbackEffect({ text: 'PARRY FAILED!', color: 'text-red-500', id: Date.now() });
    }
  }, [phase, currentMode, needleAngle, sweetSpotStart, sweetSpotWidth, dialRoundsWon, dialTotalRounds]);

  // Handle Bullet-Time Node Tap
  const handleHitBulletTimeNode = (targetId: number) => {
    if (phase !== 'Active' || currentMode !== 'BulletTimeDeflection') return;

    sound.playQteArrowHit(targetId);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 100);

    setDeflectTargets(prev => prev.map(t => t.id === targetId ? { ...t, hit: true } : t));

    const updated = deflectTargets.map(t => t.id === targetId ? { ...t, hit: true } : t);
    if (updated.every(t => t.hit)) {
      sound.playHeavySmash();
      triggerClashOutcome(true, 100);
    }
  };

  // Handle Overdrive Burst Release
  const handleReleaseOverdrive = () => {
    if (overdriveCharge >= 90) {
      sound.playQteClashBreakthrough();
      triggerClashOutcome(true, 100);
    } else {
      sound.playQteMiss();
      setFeedbackEffect({ text: 'NOT FULLY CHARGED!', color: 'text-red-400', id: Date.now() });
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'Active') return;

      if (currentMode === 'BeamStruggle' || currentMode === 'SidekickDualBeam' || currentMode === 'MultiTapSurge') {
        if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyX' || e.code === 'Enter') {
          e.preventDefault();
          handlePlayerMash();
        }
      } else if (currentMode === 'DirectionalReflex') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          handleDirectionPress('UP');
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          handleDirectionPress('DOWN');
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          handleDirectionPress('LEFT');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          handleDirectionPress('RIGHT');
        }
      } else if (currentMode === 'PrecisionDial') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handlePrecisionLock();
        }
      } else if (currentMode === 'DualTouchOverdrive') {
        if (e.code === 'KeyQ' || e.code === 'ArrowLeft') {
          setIsHoldingLeft(true);
        }
        if (e.code === 'KeyE' || e.code === 'ArrowRight') {
          setIsHoldingRight(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (currentMode === 'DualTouchOverdrive') {
        if (e.code === 'KeyQ' || e.code === 'ArrowLeft') {
          setIsHoldingLeft(false);
        }
        if (e.code === 'KeyE' || e.code === 'ArrowRight') {
          setIsHoldingRight(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, currentMode, handlePlayerMash, handleDirectionPress, handlePrecisionLock]);

  // Trigger Clash Outcome & Calculate Grade
  const triggerClashOutcome = (victory: boolean, scorePercentage: number) => {
    setPhase('Result');

    if (victory) {
      sound.playQteClashBreakthrough();
      try {
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    } else {
      sound.playDefeat();
    }

    let grade: QteClashResult['grade'] = 'C';
    if (scorePercentage >= 95 || (currentMode === 'DirectionalReflex' && comboStreak >= arrowSequence.length)) {
      grade = 'S+';
    } else if (scorePercentage >= 80) {
      grade = 'S';
    } else if (scorePercentage >= 65) {
      grade = 'A';
    } else if (victory) {
      grade = 'B';
    } else if (scorePercentage >= 30) {
      grade = 'C';
    } else {
      grade = 'D';
    }

    const multiplier = currentMode === 'SidekickDualBeam' ? 1.3 : currentMode === 'DualTouchOverdrive' ? 1.4 : 1.0;
    const calculatedDamage = victory
      ? Math.floor((180 + (hero.stats?.strength || 30) * 2.5 + (grade === 'S+' ? 100 : grade === 'S' ? 60 : 20)) * multiplier)
      : 30;

    const result: QteClashResult = {
      victory,
      score: Math.round(scorePercentage),
      maxCps,
      totalPresses: clickCount,
      perfectHits,
      grade,
      damageDealt: calculatedDamage,
      moralBonusApproval: victory ? (currentMode === 'SidekickDualBeam' ? 12 : 8) : 0
    };

    setResultState(result);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-hidden ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Background Energy Vortex */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-purple-950/40 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[repeating-conic-gradient(rgba(255,255,255,0.03)_0_15deg,transparent_15deg_30deg)] animate-spin pointer-events-none" />

      {/* Swipe Trail Indicator */}
      {swipeVisualTrail && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-pow">
          <div className="bg-yellow-400 text-black border-4 border-black px-6 py-2 rounded-2xl font-comic text-2xl font-black shadow-comic-lg">
            {swipeVisualTrail}
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between bg-[#151928]/90 border-3 border-black p-3 sm:p-4 rounded-2xl shadow-comic">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-red-600 border-2 border-black flex items-center justify-center text-2xl shadow-comic animate-pulse">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider rounded border border-black">
                {currentMode === 'SidekickDualBeam' 
                  ? '👥 TEAM-UP DUAL BEAM STRUGGLE' 
                  : currentMode === 'DualTouchOverdrive' 
                  ? '🌪️ DUAL-TOUCH OVERDRIVE CHARGE'
                  : currentMode === 'BulletTimeDeflection'
                  ? '⏳ BULLET-TIME VECTOR DEFLECTION'
                  : currentMode === 'BeamStruggle' 
                  ? 'BEAM STRUGGLE TUG-OF-WAR' 
                  : currentMode === 'DirectionalReflex' 
                  ? 'REFLEX RUSH CLASH' 
                  : 'PRECISION COUNTER-LOCK'}
              </span>
              <span className="text-xs font-bold text-gray-400">
                Difficulty: <strong className="text-yellow-400">{difficulty}</strong>
              </span>
            </div>
            <h2 className="font-comic text-lg sm:text-2xl text-yellow-300 font-black tracking-wide">
              {hero.heroName} {currentMode === 'SidekickDualBeam' ? `& ${activeSidekick.heroAlias}` : ''} vs {boss.name}
            </h2>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center gap-3 bg-black/80 px-4 py-2 rounded-xl border border-gray-700">
          <Clock size={16} className={`${timeLeft <= 2 ? 'text-red-500 animate-spin' : 'text-cyan-400'}`} />
          <div className="text-right font-mono">
            <div className="text-[10px] text-gray-400 uppercase font-bold">TIME REMAINING</div>
            <div className={`text-xl font-black ${timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft.toFixed(1)}s
            </div>
          </div>
        </div>
      </div>

      {/* INTRO PHASE */}
      {phase === 'Intro' && (
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4 my-auto animate-pow">
          <div className="font-comic text-4xl sm:text-6xl text-yellow-400 font-black tracking-widest text-center drop-shadow-[4px_4px_0px_#000]">
            ⚡ CLASH INITIATED! ⚡
          </div>
          <p className="font-comic text-xl text-cyan-300 font-bold text-center">
            "{heroPower.toUpperCase()} COLLIDES WITH {bossPower.toUpperCase()}!"
          </p>
          <div className="px-6 py-2 bg-red-600 text-white font-comic text-2xl rounded-2xl border-3 border-black shadow-comic animate-bounce">
            GET READY!
          </div>
        </div>
      )}

      {/* ACTIVE PHASE: MODE 1 & 6 — BEAM STRUGGLE / SIDEKICK DUAL-BEAM */}
      {phase === 'Active' && (currentMode === 'BeamStruggle' || currentMode === 'SidekickDualBeam') && (
        <div className="relative z-10 w-full max-w-5xl my-auto space-y-6">
          {/* Sidekick Banter Badge */}
          {currentMode === 'SidekickDualBeam' && (
            <div className="bg-cyan-950/80 border-2 border-cyan-400 p-2.5 rounded-xl text-center text-xs text-cyan-200 font-bold font-comic animate-pulse">
              💬 {activeSidekick.heroAlias}: "Focus your core energy, {hero.heroName}! Synchronizing my power cells with yours!" (+25% Push Force)
            </div>
          )}

          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            {/* HERO & SIDEKICK SIDE */}
            <div className="col-span-3 sm:col-span-3 bg-gradient-to-r from-blue-950 to-[#151928] border-3 border-black p-3 sm:p-4 rounded-2xl shadow-comic flex flex-col items-center text-center">
              <div className="flex items-center gap-1">
                <span className="text-4xl sm:text-5xl p-2 bg-black/60 rounded-2xl border-2 border-yellow-400 shadow-inner">
                  {hero.avatarIcon}
                </span>
                {currentMode === 'SidekickDualBeam' && (
                  <span className="text-3xl sm:text-4xl p-1.5 bg-black/60 rounded-xl border-2 border-cyan-400 shadow-inner animate-bounce">
                    {activeSidekick.avatarIcon}
                  </span>
                )}
              </div>
              <h3 className="font-comic text-base sm:text-lg text-yellow-400 font-black mt-2 truncate w-full">
                {hero.heroName}
              </h3>
              <span className="text-[10px] font-mono font-bold text-cyan-300 mt-0.5 truncate">
                ⚡ {heroPower}
              </span>
            </div>

            {/* CENTRAL COLLISION VORTEX */}
            <div className="col-span-6 sm:col-span-6 flex flex-col items-center space-y-3">
              {bossSurgeActive && (
                <div className="px-4 py-1 bg-red-600 text-white font-comic text-xs sm:text-sm font-black rounded-full border border-black animate-pulse shadow-comic flex items-center gap-1.5">
                  <Flame size={15} /> ⚠️ BOSS POWER SURGE: PUSH HARDER!
                </div>
              )}

              <div className="w-full bg-black/90 p-2.5 rounded-2xl border-3 border-black shadow-comic relative overflow-hidden">
                <div 
                  className="h-8 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-cyan-400 shadow-[0_0_25px_rgba(250,204,21,0.8)] transition-all duration-75 relative"
                  style={{ width: `${beamPosition}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-yellow-300 shadow-[0_0_35px_#fff] animate-spin flex items-center justify-center text-lg">
                    💥
                  </div>
                </div>

                <div 
                  className="absolute right-2.5 top-2.5 bottom-2.5 bg-gradient-to-l from-red-600 via-purple-700 to-pink-500 rounded-xl pointer-events-none opacity-80"
                  style={{ width: `${100 - beamPosition}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full px-2 text-xs font-mono font-bold">
                <span className="text-yellow-400 flex items-center gap-1">
                  <Activity size={14} /> MASH SPEED: {cps} CPS
                </span>
                <span className={`${beamPosition > 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {beamPosition > 50 ? `ADVANTAGE +${Math.round(beamPosition - 50)}%` : `DANGER -${Math.round(50 - beamPosition)}%`}
                </span>
              </div>
            </div>

            {/* BOSS SIDE */}
            <div className="col-span-3 sm:col-span-3 bg-gradient-to-l from-red-950 to-[#151928] border-3 border-black p-3 sm:p-4 rounded-2xl shadow-comic flex flex-col items-center text-center">
              <span className="text-4xl sm:text-6xl p-2 bg-black/60 rounded-2xl border-2 border-red-500 shadow-inner">
                {boss.avatar}
              </span>
              <h3 className="font-comic text-base sm:text-xl text-red-400 font-black mt-2 truncate w-full">
                {boss.name}
              </h3>
              <span className="text-[10px] font-mono font-bold text-red-300 mt-0.5 truncate">
                🔥 {bossPower}
              </span>
            </div>
          </div>

          {/* TOUCH MASH BUTTON */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <button
              onClick={handlePlayerMash}
              onTouchStart={(e) => {
                e.preventDefault();
                handlePlayerMash();
              }}
              className="w-full max-w-md py-6 sm:py-8 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-black font-comic text-2xl sm:text-4xl font-black rounded-3xl border-4 border-black shadow-comic-lg transform active:scale-95 transition-transform flex items-center justify-center gap-3 cursor-pointer select-none hover:shadow-2xl"
            >
              <Zap size={32} className="fill-black animate-pulse" />
              <span>RAPID TAP / MASH!</span>
              <Zap size={32} className="fill-black animate-pulse" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Smartphone size={14} className="text-cyan-400" />
              <span>Multi-finger touch supported on mobile • Spacebar on keyboard</span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PHASE: MODE 2 — DIRECTIONAL REFLEX (WITH SWIPE & D-PAD) */}
      {phase === 'Active' && currentMode === 'DirectionalReflex' && (
        <div className="relative z-10 w-full max-w-3xl my-auto space-y-6 text-center">
          <div className="h-8">
            {feedbackEffect && (
              <div className={`font-comic text-2xl font-black ${feedbackEffect.color} animate-pow`}>
                {feedbackEffect.text}
              </div>
            )}
          </div>

          <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-3">
            <div className="text-xs font-mono font-bold text-gray-400 uppercase">
              FOLLOW INPUT RHYTHM ({currentArrowIdx}/{arrowSequence.length} HIT) • SWIPE OR TAP!
            </div>

            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
              {arrowSequence.map((arrow, idx) => {
                const isCurrent = idx === currentArrowIdx;
                const isDone = idx < currentArrowIdx;

                const getIcon = (dir: DirectionKey) => {
                  switch (dir) {
                    case 'UP': return <ArrowUp size={28} />;
                    case 'DOWN': return <ArrowDown size={28} />;
                    case 'LEFT': return <ArrowLeft size={28} />;
                    case 'RIGHT': return <ArrowRight size={28} />;
                  }
                };

                return (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded-2xl border-3 flex items-center justify-center font-comic font-black text-xl transition-all ${
                      isCurrent
                        ? 'bg-yellow-400 text-black border-black scale-125 shadow-comic animate-pulse ring-4 ring-yellow-400'
                        : isDone
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500 opacity-60'
                        : 'bg-gray-900 text-gray-500 border-gray-800'
                    }`}
                  >
                    {getIcon(arrow)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* D-PAD */}
          <div className="flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto">
            <button
              onClick={() => handleDirectionPress('UP')}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('UP');
              }}
              className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-amber-500 text-black border-3 border-black rounded-2xl font-comic text-2xl shadow-comic flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowUp size={32} />
            </button>

            <div className="flex items-center gap-12">
              <button
                onClick={() => handleDirectionPress('LEFT')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDirectionPress('LEFT');
                }}
                className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-3 border-black rounded-2xl font-comic text-2xl shadow-comic flex items-center justify-center active:scale-90 transition-transform"
              >
                <ArrowLeft size={32} />
              </button>

              <button
                onClick={() => handleDirectionPress('RIGHT')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDirectionPress('RIGHT');
                }}
                className="w-16 h-16 bg-gradient-to-l from-yellow-400 to-amber-500 text-black border-3 border-black rounded-2xl font-comic text-2xl shadow-comic flex items-center justify-center active:scale-90 transition-transform"
              >
                <ArrowRight size={32} />
              </button>
            </div>

            <button
              onClick={() => handleDirectionPress('DOWN')}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('DOWN');
              }}
              className="w-16 h-16 bg-gradient-to-t from-yellow-400 to-amber-500 text-black border-3 border-black rounded-2xl font-comic text-2xl shadow-comic flex items-center justify-center active:scale-90 transition-transform"
            >
              <ArrowDown size={32} />
            </button>
          </div>

          <div className="text-xs font-mono text-gray-400">
            Swipe anywhere across the screen or use Arrow Keys / D-Pad!
          </div>
        </div>
      )}

      {/* ACTIVE PHASE: MODE 4 — DUAL-TOUCH OVERDRIVE BURST */}
      {phase === 'Active' && currentMode === 'DualTouchOverdrive' && (
        <div className="relative z-10 w-full max-w-xl my-auto space-y-6 text-center">
          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5">
            <div className="text-xs font-mono font-bold text-yellow-300 uppercase">
              🌪️ HOLD DUAL ANCHORS SIMULTANEOUSLY TO CONDENSE OVERDRIVE!
            </div>

            {/* Circular Gauge */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-8 border-yellow-400 transition-all duration-100 shadow-[0_0_30px_#facc15]"
                style={{
                  clipPath: `inset(${100 - overdriveCharge}% 0 0 0)`
                }}
              />
              <div className="w-36 h-36 rounded-full bg-black/80 border-3 border-black flex flex-col items-center justify-center shadow-inner">
                <span className="text-4xl animate-pulse">⚡</span>
                <span className="font-comic text-2xl text-yellow-400 font-black">{Math.round(overdriveCharge)}%</span>
              </div>
            </div>

            {/* Dual Touch Anchor Targets */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onMouseDown={() => setIsHoldingLeft(true)}
                onMouseUp={() => setIsHoldingLeft(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setIsHoldingLeft(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setIsHoldingLeft(false);
                }}
                className={`py-6 rounded-2xl border-3 font-comic text-lg font-black transition-all ${
                  isHoldingLeft
                    ? 'bg-cyan-500 text-black border-black scale-105 shadow-comic'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-500'
                }`}
              >
                {isHoldingLeft ? 'CHARGING [LEFT] ⚡' : 'HOLD LEFT (Q / Touch)'}
              </button>

              <button
                onMouseDown={() => setIsHoldingRight(true)}
                onMouseUp={() => setIsHoldingRight(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setIsHoldingRight(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setIsHoldingRight(false);
                }}
                className={`py-6 rounded-2xl border-3 font-comic text-lg font-black transition-all ${
                  isHoldingRight
                    ? 'bg-amber-500 text-black border-black scale-105 shadow-comic'
                    : 'bg-amber-950 text-amber-300 border-amber-500'
                }`}
              >
                {isHoldingRight ? 'CHARGING [RIGHT] ⚡' : 'HOLD RIGHT (E / Touch)'}
              </button>
            </div>

            {overdriveCharge >= 90 && (
              <button
                onClick={handleReleaseOverdrive}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-yellow-400 to-pink-600 text-black font-comic text-2xl font-black rounded-2xl border-3 border-black shadow-comic-lg animate-bounce"
              >
                💥 RELEASE OVERDRIVE BURST!
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE PHASE: MODE 5 — BULLET-TIME VECTOR DEFLECTION */}
      {phase === 'Active' && currentMode === 'BulletTimeDeflection' && (
        <div className="relative z-10 w-full max-w-2xl my-auto space-y-6 text-center">
          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-400">
              <span className="text-cyan-400 font-black">⏳ SLOW-MO MATRIX BULLET-TIME (25% SPEED)</span>
              <span className="text-yellow-400">TAP ALL 3 WEAK-POINT NODES TO DEFLECT!</span>
            </div>

            {/* Flight Arena */}
            <div className="relative h-64 bg-black/90 rounded-2xl border-3 border-black overflow-hidden shadow-inner flex items-center justify-center">
              {/* Incoming Projectile */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-amber-400 border-2 border-white shadow-[0_0_25px_#ef4444] flex items-center justify-center text-xl transition-all duration-75"
                style={{ left: `${projectilePos}%` }}
              >
                🔥
              </div>

              {/* 3 Clickable Deflection Nodes */}
              {deflectTargets.map(t => (
                <button
                  key={t.id}
                  disabled={t.hit}
                  onClick={() => handleHitBulletTimeNode(t.id)}
                  className={`absolute w-14 h-14 rounded-full border-3 flex items-center justify-center font-comic font-black text-lg transition-transform ${
                    t.hit
                      ? 'bg-emerald-500 text-black border-black scale-90'
                      : 'bg-yellow-400 text-black border-black animate-ping shadow-[0_0_20px_#facc15] hover:scale-110'
                  }`}
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                >
                  {t.hit ? '✓' : `🎯 ${t.id}`}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-gray-300">
              Click or tap all 3 target nodes before the projectile breaches your perimeter!
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PHASE: MODE 3 — PRECISION SWEET-SPOT COUNTER-LOCK */}
      {phase === 'Active' && currentMode === 'PrecisionDial' && (
        <div className="relative z-10 w-full max-w-xl my-auto space-y-6 text-center">
          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-400">
              <span>ROUND {dialRoundsWon + 1} OF {dialTotalRounds}</span>
              <span className="text-yellow-400">LOCK SWEET-SPOT TO PARRY</span>
            </div>

            <div className="h-10 bg-black rounded-2xl border-3 border-black relative overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 bottom-0 bg-yellow-400/90 border-x-2 border-white shadow-[0_0_20px_#facc15] flex items-center justify-center"
                style={{ left: `${sweetSpotStart}%`, width: `${sweetSpotWidth}%` }}
              >
                <Target size={18} className="text-black animate-spin" />
              </div>

              <div 
                className="absolute top-0 bottom-0 w-3 bg-red-500 border border-white shadow-[0_0_15px_#ef4444]"
                style={{ left: `${needleAngle}%` }}
              />
            </div>

            {feedbackEffect && (
              <div className={`font-comic text-xl font-black ${feedbackEffect.color} animate-pow`}>
                {feedbackEffect.text}
              </div>
            )}

            <button
              onClick={handlePrecisionLock}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-2xl font-black rounded-2xl border-3 border-black shadow-comic flex items-center justify-center gap-2 active:scale-95"
            >
              <Target size={24} /> PARRY / COUNTER STRIKE!
            </button>
          </div>
        </div>
      )}

      {/* RESULT OVERLAY */}
      {phase === 'Result' && resultState && (
        <div className="relative z-10 w-full max-w-lg bg-[#151928] p-6 sm:p-8 rounded-3xl border-4 border-yellow-400 shadow-comic-lg text-center space-y-5 my-auto animate-pow">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 border-3 border-black flex items-center justify-center text-4xl shadow-comic">
            {resultState.victory ? '🏆' : '💥'}
          </div>

          <h2 className="font-comic text-4xl sm:text-5xl text-yellow-400 drop-shadow-[3px_3px_0px_#000]">
            {resultState.victory ? 'BREAKTHROUGH VICTORY!' : 'CLASH REPUDIATED!'}
          </h2>

          <div className="inline-block px-6 py-2 bg-gradient-to-r from-red-600 to-amber-500 border-3 border-black rounded-2xl text-white font-comic text-3xl font-black shadow-comic">
            GRADE: {resultState.grade}
          </div>

          <div className="bg-black/60 p-4 rounded-xl border border-gray-800 space-y-2 text-xs font-mono text-left">
            <div className="flex justify-between text-gray-300">
              <span>Cataclysmic Damage Dealt:</span>
              <span className="font-bold text-red-400">💥 {resultState.damageDealt} DMG</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Max Tap Velocity (CPS):</span>
              <span className="font-bold text-cyan-400">⚡ {resultState.maxCps} Clicks/Sec</span>
            </div>
            {resultState.victory && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Public Approval Surge:</span>
                <span>+{resultState.moralBonusApproval}% Moral Bonus</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onClashComplete(resultState)}
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-2xl font-black rounded-2xl border-3 border-black shadow-comic transition-transform hover:scale-105 active:scale-95"
          >
            CONTINUE BATTLE ➔
          </button>
        </div>
      )}

      {/* Quick Mode Switcher Bar */}
      <div className="relative z-10 flex items-center gap-2 bg-[#151928] p-2 rounded-xl border-2 border-black text-xs font-mono overflow-x-auto max-w-full">
        <span className="text-gray-400 px-2 font-bold shrink-0">CLASH MODE:</span>
        {(['BeamStruggle', 'SidekickDualBeam', 'DirectionalReflex', 'DualTouchOverdrive', 'BulletTimeDeflection', 'PrecisionDial'] as QteClashMode[]).map(m => (
          <button
            key={m}
            onClick={() => {
              sound.playClick();
              setCurrentMode(m);
              setPhase('Active');
              setTimeLeft(totalDuration);
              setBeamPosition(50);
              setCurrentArrowIdx(0);
              setOverdriveCharge(0);
              setProjectilePos(10);
              setDeflectTargets(prev => prev.map(t => ({ ...t, hit: false })));
            }}
            className={`px-2.5 py-1 rounded-lg font-bold border shrink-0 transition-all ${
              currentMode === m
                ? 'bg-yellow-400 text-black border-black shadow'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:text-white'
            }`}
          >
            {m === 'BeamStruggle' 
              ? '⚡ Beam Struggle' 
              : m === 'SidekickDualBeam' 
              ? '👥 Team-Up Dual Beam' 
              : m === 'DirectionalReflex' 
              ? '🎯 Arrow Reflex & Swipe' 
              : m === 'DualTouchOverdrive'
              ? '🌪️ Dual-Touch Overdrive'
              : m === 'BulletTimeDeflection'
              ? '⏳ Bullet-Time Parry'
              : '⏱️ Precision Sweet-Spot'}
          </button>
        ))}
      </div>
    </div>
  );
};
