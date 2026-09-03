import React, { useState } from 'react';
import { 
  Shield, 
  Server, 
  Dumbbell, 
  HeartPulse, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  ShoppingBag, 
  Check, 
  ArrowUpCircle,
  Eye,
  Wind,
  Car,
  Sparkles,
  Swords,
  Radio,
  Cpu,
  Activity,
  AlertTriangle,
  Play,
  RotateCcw,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Send
} from 'lucide-react';
import { HeroCharacter, HQUpgrade, Equipment, VillainCharacter, SidekickCharacter } from '../types/game';
import { SHOP_EQUIPMENT } from '../data/universe';
import { sound } from '../utils/audio';
import { applyRewards } from '../utils/progression';

interface BaseOfOperationsProps {
  playerHero: HeroCharacter;
  hqUpgrades: HQUpgrade[];
  villains?: VillainCharacter[];
  onUpgradeHQ: (upgradeId: string) => void;
  onUpdateHero: (updated: HeroCharacter) => void;
}

interface TrophyRelic {
  id: string;
  name: string;
  bossName: string;
  avatar: string;
  color: string;
  lore: string;
  passiveBonus: string;
  statBonus: string;
  isUnlocked: boolean;
}

interface HoloSimulationTarget {
  id: string;
  name: string;
  difficulty: 'Training Drone' | 'Mutated Brute' | 'Mirror Nemesis';
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  avatar: string;
  rewardXp: number;
  rewardTokens: number;
}

export const BaseOfOperations: React.FC<BaseOfOperationsProps> = ({
  playerHero,
  hqUpgrades,
  villains = [],
  onUpgradeHQ,
  onUpdateHero
}) => {
  const [activeTab, setActiveTab] = useState<'Blueprint' | 'Trophies' | 'DangerRoom' | 'Supercomputer' | 'Medbay' | 'Armory' | 'WarRoom'>('Blueprint');
  const [selectedRoom, setSelectedRoom] = useState<string>('hq-command');
  const [message, setMessage] = useState<string | null>(null);

  // Danger Room State
  const [selectedSim, setSelectedSim] = useState<number>(0);
  const [simActive, setSimActive] = useState<boolean>(false);
  const [simHp, setSimHp] = useState<number>(100);
  const [simMaxHp, setSimMaxHp] = useState<number>(100);
  const [simHeroHp, setSimHeroHp] = useState<number>(playerHero.currentHp);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simWon, setSimWon] = useState<boolean>(false);

  // Supercomputer scan state
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Defeated Boss Trophy Relics
  const trophies: TrophyRelic[] = [
    {
      id: 'trophy-null-void',
      name: 'Singularity Event Horizon Core',
      bossName: 'Null Void',
      avatar: '🌌',
      color: '#A855F7',
      lore: 'The extracted gravitational containment sphere from Victor Vance’s void armor. Emits a faint cosmic hum.',
      passiveBonus: '+20% Void & Cosmic Energy Resistance',
      statBonus: '+10 Willpower',
      isUnlocked: (villains.find(v => v.name.includes('Null Void'))?.timesDefeated || 0) > 0
    },
    {
      id: 'trophy-queen-pyre',
      name: 'Dragonscale Molten Gauntlet',
      bossName: 'Queen Pyre',
      avatar: '🔥',
      color: '#EF4444',
      lore: 'Forged from titanium-carbon dragonscale plates capable of withstanding 5,000°C thermite plasma.',
      passiveBonus: '+25% Fire & Burn Damage Output',
      statBonus: '+8 Strength',
      isUnlocked: (villains.find(v => v.name.includes('Queen Pyre'))?.timesDefeated || 0) > 0
    },
    {
      id: 'trophy-cyber-gorgon',
      name: 'Neural Hivemind Overclock Tendril',
      bossName: 'Cyber-Gorgon',
      avatar: '🐍',
      color: '#10B981',
      lore: 'Severed cybernetic neural tendril containing subroutines that can decode quantum encryption in seconds.',
      passiveBonus: '+30% Gadget & EMP Hack Effectiveness',
      statBonus: '+12 Intellect',
      isUnlocked: (villains.find(v => v.name.includes('Cyber-Gorgon'))?.timesDefeated || 0) > 0
    },
    {
      id: 'trophy-chronos-master',
      name: 'Tachyon Flux Hourglass Scepter',
      bossName: 'Chronos Master',
      avatar: '⏳',
      color: '#F59E0B',
      lore: 'An intricate brass chronometer housing stable tachyon particles that ripple micro-eddies in local time.',
      passiveBonus: '+15 Turn Initiative / Speed Bonus',
      statBonus: '+10 Agility',
      isUnlocked: (villains.find(v => v.name.includes('Chronos Master'))?.timesDefeated || 0) > 0
    },
    {
      id: 'trophy-iron-juggernaut',
      name: 'Hydraulic Piston Knuckle Core',
      bossName: 'Iron Juggernaut',
      avatar: '🦾',
      color: '#6B7280',
      lore: 'The pneumatic knuckle driver salvaged from Boris Vance’s seismic hydraulic armor rig.',
      passiveBonus: '+20% Melee Brawn Impact Damage',
      statBonus: '+10 Fortitude',
      isUnlocked: (villains.find(v => v.name.includes('Iron Juggernaut'))?.timesDefeated || 0) > 0
    },
    {
      id: 'trophy-madame-mirage',
      name: 'Prismatic Psionic Masquerade Mask',
      bossName: 'Madame Mirage',
      avatar: '🎭',
      color: '#EC4899',
      lore: 'An ornate silver-filigree ocular visor infused with psionic crystals that distort sensory perception.',
      passiveBonus: '+35% Resistance to Mind Confusion & Fear',
      statBonus: '+10 Charisma',
      isUnlocked: (villains.find(v => v.name.includes('Madame Mirage'))?.timesDefeated || 0) > 0
    }
  ];

  // Danger Room Simulation Targets
  const simTargets: HoloSimulationTarget[] = [
    {
      id: 'sim-drone',
      name: 'Holo-Drone Swarm (Agility & Reflex)',
      difficulty: 'Training Drone',
      hp: 120,
      maxHp: 120,
      attack: 14,
      defense: 8,
      avatar: '🛸',
      rewardXp: 80,
      rewardTokens: 1
    },
    {
      id: 'sim-brute',
      name: 'Simulated Mutated Enforcer (Heavy Armor)',
      difficulty: 'Mutated Brute',
      hp: 240,
      maxHp: 240,
      attack: 26,
      defense: 20,
      avatar: '👹',
      rewardXp: 160,
      rewardTokens: 2
    },
    {
      id: 'sim-mirror',
      name: `Dark Inverted Avatar of ${playerHero.heroName}`,
      difficulty: 'Mirror Nemesis',
      hp: 380,
      maxHp: 380,
      attack: 38,
      defense: 30,
      avatar: '👤',
      rewardXp: 300,
      rewardTokens: 4
    }
  ];

  const getHQIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server': return <Server size={22} className="text-cyan-400" />;
      case 'Dumbbell': return <Dumbbell size={22} className="text-red-400" />;
      case 'HeartPulse': return <HeartPulse size={22} className="text-green-400" />;
      case 'ShieldCheck': return <ShieldCheck size={22} className="text-yellow-400" />;
      case 'Trophy': return <Trophy size={22} className="text-amber-400" />;
      case 'Zap': return <Zap size={22} className="text-purple-400" />;
      default: return <Server size={22} className="text-cyan-400" />;
    }
  };

  const handleUpgradeFacility = (facility: HQUpgrade) => {
    if (facility.level >= facility.maxLevel) return;

    if (playerHero.money < facility.cost || playerHero.heroTokens < facility.tokenCost) {
      sound.playAlarm();
      setMessage(`⚠️ Insufficient resources! Requires $${facility.cost} and ${facility.tokenCost} Hero Tokens.`);
      return;
    }

    sound.playLevelUp();
    const updated = { ...playerHero };
    updated.money -= facility.cost;
    updated.heroTokens -= facility.tokenCost;

    if (facility.id === 'hq-armory') {
      updated.armor += 5;
    } else if (facility.id === 'hq-training') {
      updated.maxEnergy += 10;
    } else if (facility.id === 'hq-medical') {
      updated.maxHp += 25;
    }

    onUpdateHero(updated);
    onUpgradeHQ(facility.id);
    setMessage(`🌟 Successfully upgraded ${facility.name} to Level ${facility.level + 1}!`);
  };

  // Start Danger Room Simulation
  const handleStartSim = (target: HoloSimulationTarget) => {
    sound.playSuper();
    setSimHp(target.hp);
    setSimMaxHp(target.hp);
    setSimHeroHp(playerHero.currentHp);
    setSimLogs([`[HOLO-SIM READY]: ${target.name} materializing inside Danger Room Grid.`]);
    setSimActive(true);
    setSimWon(false);
  };

  // Execute Simulation Attack
  const handleSimAttack = (powerIdx: number = 0) => {
    if (!simActive || simWon) return;

    const power = playerHero.powers[powerIdx] || playerHero.powers[0];
    const target = simTargets[selectedSim];

    sound.playPunch();
    const dmg = Math.max(15, Math.floor((power.damage + playerHero.stats.strength + playerHero.stats.intellect) * (Math.random() * 0.4 + 0.8)));
    const newSimHp = Math.max(0, simHp - dmg);
    setSimHp(newSimHp);

    let newLogs = [`💥 You strike ${target.name} with ${power.name} for ${dmg} damage!`, ...simLogs];

    if (newSimHp <= 0) {
      sound.playLevelUp();
      setSimWon(true);
      newLogs = [`🏆 SIMULATION CLEARED! +${target.rewardXp} XP, +${target.rewardTokens} Hero Tokens awarded!`, ...newLogs];
      
      const { hero: updated } = applyRewards(playerHero, {
        xp: target.rewardXp,
        heroTokens: target.rewardTokens
      });
      onUpdateHero(updated);
    } else {
      const retDmg = Math.max(5, Math.floor(target.attack * (Math.random() * 0.5 + 0.75) - playerHero.armor * 0.2));
      const newHeroHp = Math.max(10, simHeroHp - retDmg);
      setSimHeroHp(newHeroHp);
      newLogs = [`⚡ ${target.name} retaliates for ${retDmg} holographic damage!`, ...newLogs];
    }

    setSimLogs(newLogs.slice(0, 6));
  };

  // Run Supercomputer Scan
  const handleRunPredictiveScan = () => {
    if (playerHero.currentEnergy < 15) {
      sound.playAlarm();
      setMessage('⚠️ Supercomputer telemetry scan requires at least 15 Energy.');
      return;
    }

    sound.playRadio();
    const updated = { ...playerHero, currentEnergy: playerHero.currentEnergy - 15 };
    onUpdateHero(updated);

    const scanMessages = [
      '🛰️ [SATELLITE SCAN COMPLETE]: Detected illicit tachyon telemetry spike in Downtown District! Masterplan progress slowed by 15%.',
      '🛰️ [UNDERWORLD INTERCEPT]: High-threat arms convoy moving through The Docks at 23:00. Police checkpoints reinforced.',
      '🛰️ [ASYLUM RADAR ALERT]: Blackgate electromagnetic null-collars holding steady. No imminent breakout detected.',
      '🛰️ [CIVILIAN THREAT GRID]: High-frequency scanning prevented a planned ambush on your civilian workplace!'
    ];
    setScanResult(scanMessages[Math.floor(Math.random() * scanMessages.length)]);
  };

  // Medbay Cryo-Stasis
  const handleCryoStasis = () => {
    if (playerHero.money < 100) {
      sound.playAlarm();
      setMessage('⚠️ Cryogenic stasis treatment requires $100 in bio-fluid replenishment.');
      return;
    }

    sound.playHeal();
    const updated = {
      ...playerHero,
      money: playerHero.money - 100,
      currentHp: playerHero.maxHp,
      currentEnergy: playerHero.maxEnergy,
      stress: 0
    };
    onUpdateHero(updated);
    setMessage('🧪 Full Cryogenic Regeneration cycle complete! 100% HP, AP, and 0% Stress restored!');
  };

  // Deploy Sidekick on Patrol
  const handleDeploySidekick = (sidekick: SidekickCharacter) => {
    sound.playClick();
    setMessage(`🚀 Dispatched ${sidekick.heroAlias} on autonomous district patrol! Generating civic goodwill and crime suppression.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-[#151928] to-slate-900 p-6 rounded-2xl border-3 border-black shadow-comic flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <ShieldCheck className="text-yellow-400" /> SECURE SANCTUARY COMMAND & TACTICAL HUB
          </div>
          <h2 className="font-comic text-3xl sm:text-4xl text-yellow-400 tracking-wider">
            INTERACTIVE BASE OF OPERATIONS
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
            Upgrade tactical sanctuary wings, inspect defeated nemesis trophies, train in the Danger Room Holo-Simulator, and run predictive crime algorithms.
          </p>
        </div>

        {/* Room Navigation Pill Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'Blueprint', label: '📐 Blueprint & Wings', icon: <Layers size={14} /> },
            { id: 'Trophies', label: `🏆 Trophy Vault (${trophies.filter(t => t.isUnlocked).length})`, icon: <Trophy size={14} /> },
            { id: 'DangerRoom', label: '⚡ Danger Room (Sim)', icon: <Swords size={14} /> },
            { id: 'Supercomputer', label: '🛰️ Supercomputer', icon: <Cpu size={14} /> },
            { id: 'Medbay', label: '🧪 Cryo-Medbay', icon: <HeartPulse size={14} /> },
            { id: 'Armory', label: '🛡️ Gear Armory', icon: <ShoppingBag size={14} /> },
            { id: 'WarRoom', label: '📡 War Room', icon: <Radio size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-2 rounded-xl border-2 border-black font-bold text-xs shadow-comic transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black scale-105'
                  : 'bg-[#0D101A] text-gray-300 hover:bg-[#1E243A]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="p-4 bg-yellow-950/90 border-2 border-yellow-400 rounded-xl text-xs sm:text-sm text-yellow-200 font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: INTERACTIVE 2D BLUEPRINT & SANCTUARY FACILITIES */}
      {activeTab === 'Blueprint' && (
        <div className="space-y-6">
          <div className="bg-[#0A0D14] p-6 rounded-2xl border-3 border-cyan-500/60 shadow-comic relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e2238_1px,transparent_1px),linear-gradient(to_bottom,#0e2238_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-cyan-900 pb-3">
              <div>
                <h3 className="font-comic text-xl text-cyan-300 flex items-center gap-2">
                  <Layers className="text-cyan-400" /> SANCTUARY ARCHITECTURAL BLUEPRINT (LEVEL 2 SUB-LEVEL)
                </h3>
                <p className="text-xs text-gray-400">Click any facility chamber to inspect tactical status and initiate upgrades.</p>
              </div>
              <div className="text-xs text-yellow-400 font-mono font-bold bg-black/60 px-3 py-1 rounded-lg border border-yellow-500/40">
                DEFENSE RATING: {hqUpgrades.reduce((a, b) => a + b.level, 0) * 15}%
              </div>
            </div>

            {/* Interactive Blueprint Floorplan Rooms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {hqUpgrades.map(facility => {
                const isSelected = selectedRoom === facility.id;
                const isMaxed = facility.level >= facility.maxLevel;
                const canAfford = playerHero.money >= facility.cost && playerHero.heroTokens >= facility.tokenCost;

                return (
                  <div
                    key={facility.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRoom(facility.id);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-400/40 shadow-comic scale-[1.02]'
                        : 'bg-[#151928]/90 border-gray-800 hover:border-cyan-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-black/60 border border-gray-700">
                          {getHQIcon(facility.icon)}
                        </div>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                          LV {facility.level}/{facility.maxLevel}
                        </span>
                      </div>
                      <h4 className="font-comic text-lg text-yellow-400">{facility.name}</h4>
                      <p className="text-xs text-gray-300 line-clamp-2 mt-1">{facility.description}</p>
                    </div>

                    <div className="bg-[#0D101A] p-2.5 rounded-lg border border-gray-800 text-[11px] space-y-1">
                      <div className="text-green-400 font-medium">✓ Active: {facility.currentBenefit}</div>
                      {!isMaxed && <div className="text-cyan-400">⚡ Next: {facility.nextBenefit}</div>}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeFacility(facility);
                      }}
                      disabled={isMaxed || !canAfford}
                      className={`w-full py-2 rounded-lg font-bold text-xs border-2 border-black shadow-comic flex items-center justify-center gap-1.5 ${
                        isMaxed
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                          : 'bg-gray-800 text-gray-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle size={14} />
                      {isMaxed ? 'MAX LEVEL' : `UPGRADE ($${facility.cost} + ${facility.tokenCost} 🪙)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TROPHY VAULT */}
      {activeTab === 'Trophies' && (
        <div className="space-y-4">
          <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-2">
            <h3 className="font-comic text-2xl text-yellow-400 flex items-center gap-2">
              <Trophy className="text-amber-400" /> TROPHY ROOM & DEFEATED NEMESIS RELIC VAULT
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Artifacts and weapon cores claimed from defeated supervillains. Equipping and analyzing trophies unlocks permanent passive combat buffs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trophies.map(trophy => (
              <div
                key={trophy.id}
                className={`p-5 rounded-2xl border-3 border-black shadow-comic flex flex-col justify-between space-y-4 ${
                  trophy.isUnlocked
                    ? 'bg-gradient-to-br from-[#1E243A] to-[#151928] border-amber-500'
                    : 'bg-[#0D101A] border-gray-800 opacity-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-3xl shadow-comic"
                      style={{ backgroundColor: trophy.color }}
                    >
                      {trophy.avatar}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      trophy.isUnlocked ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-gray-900 text-gray-500 border border-gray-800'
                    }`}>
                      {trophy.isUnlocked ? 'CLAIMED TROPHY' : 'LOCKED - DEFEAT BOSS'}
                    </span>
                  </div>

                  <h4 className="font-comic text-xl text-yellow-400">{trophy.name}</h4>
                  <div className="text-xs text-red-400 font-bold mb-2">Source: {trophy.bossName}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{trophy.lore}</p>
                </div>

                <div className="bg-[#0D101A] p-3 rounded-xl border border-gray-800 text-xs space-y-1">
                  <div className="text-green-400 font-bold flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-400" /> {trophy.passiveBonus}
                  </div>
                  <div className="text-yellow-400 font-semibold">{trophy.statBonus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DANGER ROOM */}
      {activeTab === 'DangerRoom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <h3 className="font-comic text-xl text-yellow-400 flex items-center gap-2">
              <Swords className="text-red-400" /> Holographic Combat Protocols
            </h3>
            <p className="text-xs text-gray-400">
              Test power combinations and combat timing without risking permanent injury.
            </p>

            <div className="space-y-3">
              {simTargets.map((target, idx) => {
                const isSelected = selectedSim === idx;

                return (
                  <div
                    key={target.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSim(idx);
                      setSimActive(false);
                    }}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 shadow-comic scale-[1.02]'
                        : 'bg-[#1E243A] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{target.avatar}</span>
                      <div>
                        <h4 className="font-comic text-base text-white">{target.name}</h4>
                        <span className="text-[10px] font-bold text-red-400">{target.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-800">
                      <span>HP: {target.hp} • ATK: {target.attack}</span>
                      <span className="text-yellow-400 font-bold">+{target.rewardXp} XP / +{target.rewardTokens} 🪙</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0A0D14] p-6 rounded-2xl border-3 border-cyan-500 shadow-comic flex flex-col justify-between space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-comic text-2xl text-cyan-300">DANGER ROOM SIMULATION GRID</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded border border-cyan-700">
                HOLOGRAPHIC MODE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center bg-[#151928]/80 p-5 rounded-xl border-2 border-cyan-900">
              <div className="text-center space-y-2">
                <div
                  className="w-16 h-16 mx-auto rounded-xl border-2 border-black flex items-center justify-center text-4xl shadow-comic"
                  style={{ backgroundColor: playerHero.colors.primary }}
                >
                  {playerHero.avatarIcon}
                </div>
                <div className="font-comic text-lg text-yellow-400">{playerHero.heroName}</div>
                <div className="w-full bg-gray-900 h-2.5 rounded-full border border-black overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: `${(simHeroHp / playerHero.maxHp) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-mono text-gray-400">HP: {simHeroHp} / {playerHero.maxHp}</div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-xl border-2 border-cyan-400 bg-cyan-950/80 flex items-center justify-center text-4xl shadow-comic animate-pulse">
                  {simTargets[selectedSim].avatar}
                </div>
                <div className="font-comic text-lg text-cyan-300">{simTargets[selectedSim].name}</div>
                <div className="w-full bg-gray-900 h-2.5 rounded-full border border-black overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full transition-all"
                    style={{ width: `${(simHp / simMaxHp) * 100}%` }}
                  />
                </div>
                <div className="text-xs font-mono text-gray-400">HP: {simHp} / {simMaxHp}</div>
              </div>
            </div>

            <div className="bg-[#05070B] p-3 rounded-xl border border-cyan-900 font-mono text-xs text-gray-300 space-y-1 min-h-[100px]">
              {simLogs.length > 0 ? (
                simLogs.map((log, i) => (
                  <div key={i} className="text-cyan-300">{log}</div>
                ))
              ) : (
                <div className="text-gray-500 italic">Select a target and initialize the simulation...</div>
              )}
            </div>

            <div>
              {!simActive ? (
                <button
                  onClick={() => handleStartSim(simTargets[selectedSim])}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-comic text-lg rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-2"
                >
                  <Play size={18} /> INITIALIZE HOLO-BATTLE
                </button>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {playerHero.powers.slice(0, 3).map((p, pIdx) => (
                    <button
                      key={p.id}
                      onClick={() => handleSimAttack(pIdx)}
                      disabled={simWon}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white font-bold text-xs rounded-xl border-2 border-black shadow-comic truncate"
                    >
                      ⚡ {p.name}
                    </button>
                  ))}
                  <button
                    onClick={() => handleStartSim(simTargets[selectedSim])}
                    className="py-2.5 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-1"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPERCOMPUTER */}
      {activeTab === 'Supercomputer' && (
        <div className="space-y-6">
          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div>
                <h3 className="font-comic text-2xl text-cyan-400 flex items-center gap-2">
                  <Cpu className="text-cyan-400" /> C.E.R.E.B.R.U.S. PREDICTIVE SURVEILLANCE GRID
                </h3>
                <p className="text-xs text-gray-400">
                  Orbital satellite telemetry system that predicts supervillain heists, traces dark-matter signatures, and prevents ambushes.
                </p>
              </div>
              <button
                onClick={handleRunPredictiveScan}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl border-2 border-black shadow-comic flex items-center gap-2 shrink-0"
              >
                <Radio size={16} /> Run Orbital Telemetry Scan (-15 AP)
              </button>
            </div>

            {scanResult && (
              <div className="p-4 bg-cyan-950/80 border-2 border-cyan-400 rounded-xl text-xs sm:text-sm text-cyan-200 font-bold flex items-center gap-2 shadow-comic animate-fadeIn">
                <span>{scanResult}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <h4 className="font-comic text-lg text-yellow-400">Active Villain Threat Intercepts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {villains.slice(0, 4).map(v => (
                  <div key={v.id} className="p-4 bg-[#0D101A] rounded-xl border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-comic text-base text-yellow-400">{v.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        v.status === 'Incarcerated' ? 'bg-blue-950 text-cyan-300' : 'bg-red-950 text-red-300'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Grudge Level: <span className="text-red-400 font-bold">{v.grudgeLevel}%</span> • Breakout Risk: <span className="text-yellow-400 font-bold">{v.breakoutRisk}%</span>
                    </div>
                    <div className="text-xs text-cyan-400 italic">
                      Counter-adaptations logged: {v.adaptations.length > 0 ? v.adaptations.map(a => a.type).join(', ') : 'None detected'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEDBAY */}
      {activeTab === 'Medbay' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5">
            <h3 className="font-comic text-2xl text-green-400 flex items-center gap-2">
              <HeartPulse className="text-green-400" /> Cryogenic Regeneration Pods
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Submerge in nutrient-dense liquid oxygen cryo-stasis to rapidly repair tissue trauma, eliminate combat exhaustion, and reset mental stress to 0.
            </p>

            <div className="bg-[#0D101A] p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Health:</span>
                <span className="text-green-400 font-bold">{playerHero.currentHp} / {playerHero.maxHp} HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current AP:</span>
                <span className="text-cyan-400 font-bold">{playerHero.currentEnergy} / {playerHero.maxEnergy} AP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mental Stress:</span>
                <span className="text-amber-400 font-bold">{playerHero.stress}%</span>
              </div>
            </div>

            <button
              onClick={handleCryoStasis}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-comic text-base rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-2"
            >
              <HeartPulse size={18} /> ENTER CRYO-STASIS CHAMBER ($100)
            </button>
          </div>

          <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-4">
            <h3 className="font-comic text-2xl text-yellow-400 flex items-center gap-2">
              <Activity className="text-yellow-400" /> Permanent Bio-Nanite Enhancements
            </h3>
            <p className="text-xs text-gray-300">
              Upgrade cellular physiology using gathered Hero Tokens to gain permanent baseline stat increases.
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Synthetic Muscle Weave', cost: 3, bonus: '+5 Max HP & +2 Strength' },
                { name: 'Neural Synapse Overclock', cost: 3, bonus: '+5 Max AP & +2 Intellect' },
                { name: 'Subdermal Dermis Plating', cost: 4, bonus: '+4 Base Armor' },
              ].map((bio, idx) => (
                <div key={idx} className="p-3 bg-[#0D101A] rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{bio.name}</div>
                    <div className="text-green-400">{bio.bonus}</div>
                  </div>
                  <button
                    disabled={playerHero.heroTokens < bio.cost}
                    onClick={() => {
                      if (playerHero.heroTokens < bio.cost) return;
                      sound.playLevelUp();
                      const updated = {
                        ...playerHero,
                        heroTokens: playerHero.heroTokens - bio.cost,
                        maxHp: playerHero.maxHp + 5,
                        armor: playerHero.armor + 2
                      };
                      onUpdateHero(updated);
                      setMessage(`🧬 Installed ${bio.name}! Permanent enhancements applied.`);
                    }}
                    className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold rounded-lg border border-black shadow-comic"
                  >
                    Install ({bio.cost} 🪙)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GEAR ARMORY */}
      {activeTab === 'Armory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_EQUIPMENT.map(item => {
            const isOwned = playerHero.inventory.some(i => i.id === item.id);
            const canAfford = playerHero.money >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border-3 border-black shadow-comic flex flex-col justify-between space-y-4 ${
                  isOwned ? 'bg-gradient-to-br from-green-950/40 to-[#151928] border-green-500' : 'bg-[#151928]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🛡️</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-500 text-blue-300">
                      {item.slot}
                    </span>
                  </div>

                  <h3 className="font-comic text-xl text-yellow-400">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                </div>

                <div className="bg-[#0D101A] p-3 rounded-xl border border-gray-800 text-xs space-y-1">
                  {item.bonusArmor && <div className="text-blue-400 font-bold">+{item.bonusArmor} Base Armor</div>}
                  {item.bonusHp && <div className="text-red-400 font-bold">+{item.bonusHp} Max HP</div>}
                  {item.bonusEnergy && <div className="text-cyan-400 font-bold">+{item.bonusEnergy} Max AP</div>}
                </div>

                <button
                  onClick={() => {
                    if (playerHero.money < item.cost) {
                      sound.playAlarm();
                      setMessage(`⚠️ Insufficient funds! ${item.name} costs $${item.cost}.`);
                      return;
                    }
                    sound.playCash();
                    const updated = {
                      ...playerHero,
                      money: playerHero.money - item.cost,
                      armor: playerHero.armor + (item.bonusArmor || 0),
                      maxHp: playerHero.maxHp + (item.bonusHp || 0),
                      currentHp: playerHero.currentHp + (item.bonusHp || 0),
                      inventory: [...playerHero.inventory, { ...item, unlocked: true, equipped: true }]
                    };
                    onUpdateHero(updated);
                    setMessage(`🛡️ Purchased & equipped ${item.name}!`);
                  }}
                  disabled={isOwned || !canAfford}
                  className={`w-full py-2.5 rounded-xl border-2 border-black font-bold text-xs shadow-comic flex items-center justify-center gap-1.5 ${
                    isOwned
                      ? 'bg-green-600 text-white cursor-default'
                      : canAfford
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                      : 'bg-gray-800 text-gray-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? (
                    <>
                      <Check size={16} /> EQUIPPED
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> BUY & EQUIP (${item.cost})
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 7: WAR ROOM */}
      {activeTab === 'WarRoom' && (
        <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5">
          <div>
            <h3 className="font-comic text-2xl text-yellow-400 flex items-center gap-2">
              <Radio className="text-yellow-400" /> WAR ROOM & ALLIANCE DISPATCH
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Command your protégé sidekicks and coordinate joint patrol sorties across Metro Nova districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerHero.sidekicks.map(sidekick => (
              <div key={sidekick.id} className="p-4 bg-[#0D101A] rounded-xl border-2 border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-3xl shadow-comic"
                    style={{ backgroundColor: sidekick.color }}
                  >
                    {sidekick.avatarIcon}
                  </div>
                  <div>
                    <h4 className="font-comic text-lg text-white">{sidekick.heroAlias}</h4>
                    <span className="text-xs text-yellow-400">{sidekick.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeploySidekick(sidekick)}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5"
                >
                  <Send size={14} /> Dispatch Patrol
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
