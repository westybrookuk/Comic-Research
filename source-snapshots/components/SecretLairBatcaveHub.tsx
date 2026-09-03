import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Award, 
  Zap, 
  Heart, 
  Flame, 
  Car, 
  Sparkles, 
  Plus, 
  Volume2, 
  CheckCircle2, 
  ArrowUpCircle,
  Lock,
  Compass
} from 'lucide-react';
import {
  HeroCharacter,
  LairRoomModule,
  LairTrophy,
  SecretLairProgress,
  SecretLairTheme,
  HubProgressUpdater
} from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { applyRewards } from '../utils/progression';
import confetti from 'canvas-confetti';

interface SecretLairBatcaveHubProps {
  playerHero: HeroCharacter;
  progress: SecretLairProgress;
  onUpdateProgress: HubProgressUpdater<'secretLair'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

const LAIR_THEMES: SecretLairTheme[] = ['Subterranean Batcave', 'High-Tech Penthouse', 'Orbital Satellite', 'Sanctum Arcanum'];

/** Upgrade price scales ×1.5 per level; token cost +1 per level (matches the original in-place mutation). */
const UPGRADE_COST_GROWTH = 1.5;
const XP_PER_MODULE_UPGRADE = 300;

/** Applies the persisted level to a module and derives the level-scaled costs from it. */
function resolveModule(base: LairRoomModule, level: number): LairRoomModule {
  const levelsGained = Math.max(0, level - base.level);
  let upgradeCost = base.upgradeCost;
  for (let i = 0; i < levelsGained; i++) upgradeCost = Math.round(upgradeCost * UPGRADE_COST_GROWTH);
  return {
    ...base,
    level,
    upgradeCost,
    tokenCost: base.tokenCost + levelsGained,
    isUnlocked: base.isUnlocked || levelsGained > 0
  };
}

const DEFAULT_MODULES: LairRoomModule[] = [
  {
    id: 'mod-supercomputer',
    type: 'Supercomputer',
    name: 'Quantum Oracle Supercomputer',
    level: 1,
    maxLevel: 5,
    upgradeCost: 2000,
    tokenCost: 2,
    icon: '🖥️',
    description: 'Intercepts encrypted syndicate satellite comms and scans for masterplan activity.',
    perkEffect: '+1 Clue automatically discovered each day on active masterplans.',
    isUnlocked: true
  },
  {
    id: 'mod-trophy',
    type: 'TrophyHall',
    name: 'Supervillain Trophy Vault',
    level: 1,
    maxLevel: 5,
    upgradeCost: 1500,
    tokenCost: 1,
    icon: '🏆',
    description: 'Displays relics, broken weapons, and containment helmets of defeated supervillains.',
    perkEffect: '+10% Public Approval & Morale boost when defeating boss nemeses.',
    isUnlocked: true
  },
  {
    id: 'mod-dojo',
    type: 'DangerDojo',
    name: 'Holographic Danger Simulator',
    level: 1,
    maxLevel: 5,
    upgradeCost: 2500,
    tokenCost: 2,
    icon: '🥋',
    description: 'Danger room simulation chamber with hard-light combat drones.',
    perkEffect: '+25% Extra XP gained from all training sessions and combat victories.',
    isUnlocked: true
  },
  {
    id: 'mod-cryo',
    type: 'MedCryo',
    name: 'Nanotech Medical Cryo-Chamber',
    level: 1,
    maxLevel: 5,
    upgradeCost: 3000,
    tokenCost: 3,
    icon: '🧪',
    description: 'Rapid regenerative pod filled with bio-synthetic recovery gel.',
    perkEffect: 'Restores +100% HP and AP instantly during time advances without resting.',
    isUnlocked: true
  },
  {
    id: 'mod-vehicle',
    type: 'VehicleBay',
    name: 'Vanguard-Mobile Launch Silo',
    level: 1,
    maxLevel: 5,
    upgradeCost: 3500,
    tokenCost: 3,
    icon: '🏎️',
    description: 'Hydraulic launch tunnel with high-speed stealth pursuit vehicle.',
    perkEffect: 'Reduces district patrol AP energy cost by -2 AP per patrol.',
    isUnlocked: true
  },
  {
    id: 'mod-forge',
    type: 'ArmoryForge',
    name: 'Titanium Nanoforge & Armory',
    level: 1,
    maxLevel: 5,
    upgradeCost: 4000,
    tokenCost: 4,
    icon: '⚔️',
    description: 'Molecular fabricator for high-tech superhero suits and kinetic gadgets.',
    perkEffect: '+20 Max Armor and +15% critical strike damage across all attacks.',
    isUnlocked: false
  }
];

const DEFAULT_TROPHIES: LairTrophy[] = [
  {
    id: 'trophy-1',
    name: "Doctor Chronos's Shattered Time-Dial",
    villainId: 'vil-chronos',
    villainName: 'Doctor Chronos',
    lore: 'Recovered from the Downtown Bank Vault Meltdown. Emits faint chronometer ticking sounds.',
    icon: '⏱️',
    dateAcquired: '2026-08-20'
  },
  {
    id: 'trophy-2',
    name: "Lord Oblivion's Singularity Core Shard",
    villainId: 'vil-oblivion',
    villainName: 'Lord Oblivion',
    lore: 'Contained inside magnetic stasis glass. A tiny fragment of collapsing dark matter.',
    icon: '🌌',
    dateAcquired: '2026-08-28'
  }
];

export const SecretLairBatcaveHub: React.FC<SecretLairBatcaveHubProps> = ({
  playerHero,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  // Persistent: theme + module levels (in `progress`). Ephemeral: selection + toast.
  const lairTheme = progress.theme;
  const modules = useMemo(
    () => DEFAULT_MODULES.map(m => resolveModule(m, progress.moduleLevels[m.id] ?? m.level)),
    [progress.moduleLevels]
  );
  const trophies: LairTrophy[] = DEFAULT_TROPHIES;
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-supercomputer');
  const [notification, setNotification] = useState<string | null>(null);

  const setLairTheme = (theme: SecretLairTheme) => onUpdateProgress(prev => ({ ...prev, theme }));

  const activeModule = modules.find(m => m.id === selectedModuleId) || modules[0];

  const handleUpgradeModule = (mod: LairRoomModule) => {
    if (playerHero.money < mod.upgradeCost || playerHero.heroTokens < mod.tokenCost) {
      sound.playAlarm();
      setNotification(`❌ INSUFFICIENT FUNDS: You need $${mod.upgradeCost.toLocaleString()} and ${mod.tokenCost} Hero Tokens to upgrade ${mod.name}!`);
      return;
    }

    sound.playLevelUp();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    const { hero: updated } = applyRewards(playerHero, {
      money: -mod.upgradeCost,
      heroTokens: -mod.tokenCost,
      xp: XP_PER_MODULE_UPGRADE
    });
    onUpdateHero(updated);

    onUpdateProgress(prev => ({
      ...prev,
      moduleLevels: { ...prev.moduleLevels, [mod.id]: mod.level + 1 }
    }));

    narratorTts.speak(`Lair Module Upgraded: ${mod.name} is now Level ${mod.level + 1}!`, 'oracle');
    setNotification(`✨ UPGRADE COMPLETE: ${mod.name} boosted to Level ${mod.level + 1}! Active Perk: ${mod.perkEffect}`);
    setTimeout(() => setNotification(null), 5000);
  };

  const getThemeBg = () => {
    switch (lairTheme) {
      case 'High-Tech Penthouse': return 'from-sky-950 via-[#151928] to-slate-900';
      case 'Orbital Satellite': return 'from-indigo-950 via-purple-950 to-black';
      case 'Sanctum Arcanum': return 'from-amber-950 via-rose-950 to-[#101422]';
      case 'Subterranean Batcave':
      default: return 'from-slate-950 via-[#121624] to-[#0a0d18]';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${getThemeBg()} p-6 rounded-2xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-400 text-black border-2 border-black rounded-lg text-xs font-black tracking-widest shadow-comic uppercase flex items-center gap-1.5">
              <ShieldCheck size={14} /> SUBTERRANEAN HEADQUARTERS
            </span>
            <span className="text-xs font-bold text-yellow-300">
              {lairTheme.toUpperCase()}
            </span>
          </div>
          <h2 className="text-3xl font-black font-comic tracking-wider text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1">
            SECRET LAIR & BATCAVE CUSTOMIZER
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mt-1">
            Build and upgrade subterranean headquarters modules! Deploy quantum supercomputers, display defeated villain boss trophies, and park high-speed pursuit vehicles!
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2">
          {LAIR_THEMES.map(theme => (
            <button
              key={theme}
              onClick={() => {
                sound.playClick();
                setLairTheme(theme);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border-2 border-black transition-all ${
                lairTheme === theme ? 'bg-yellow-400 text-black scale-105 shadow-comic' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {theme.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-indigo-950/90 border-2 border-cyan-400 rounded-xl text-xs sm:text-sm text-cyan-200 font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Lair Blueprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Modules Blueprint Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-[#151928] border-3 border-black rounded-2xl p-5 shadow-comic space-y-4">
          <h3 className="text-lg font-black font-comic text-yellow-400 flex items-center gap-2 border-b border-gray-800 pb-2.5">
            <Cpu size={18} /> HEADQUARTERS ROOM MODULES ({modules.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map(mod => (
              <div
                key={mod.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedModuleId(mod.id);
                }}
                className={`p-4 rounded-xl border-3 shadow-comic cursor-pointer transition-all flex flex-col justify-between min-h-[140px] relative ${
                  selectedModuleId === mod.id
                    ? 'bg-yellow-950/70 border-yellow-400 scale-[1.02]'
                    : 'bg-[#101422] border-black hover:border-gray-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-2xl mb-1">
                    <span>{mod.icon}</span>
                    <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded font-mono">
                      LV {mod.level}/{mod.maxLevel}
                    </span>
                  </div>
                  <h4 className="font-comic font-black text-sm text-yellow-300 leading-tight">
                    {mod.name}
                  </h4>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mt-1">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800 text-[10px] font-mono text-cyan-400 font-bold">
                  {mod.perkEffect}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Module Detail & Upgrade Bay + Trophy Vault (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Module Detail Card */}
          <div className="bg-[#151928] border-3 border-black rounded-2xl p-5 shadow-comic space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
              <span className="text-4xl p-2 bg-black/60 rounded-xl border border-gray-700">
                {activeModule.icon}
              </span>
              <div>
                <h4 className="font-comic font-black text-base text-yellow-400">
                  {activeModule.name}
                </h4>
                <span className="text-xs font-mono text-gray-400 font-bold">
                  Level {activeModule.level} of {activeModule.maxLevel}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {activeModule.description}
            </p>

            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-xs font-mono space-y-1">
              <span className="text-yellow-400 font-bold block">ACTIVE HEADQUARTERS BUFF:</span>
              <p className="text-emerald-300 font-bold text-[11px]">{activeModule.perkEffect}</p>
            </div>

            <button
              disabled={activeModule.level >= activeModule.maxLevel}
              onClick={() => handleUpgradeModule(activeModule)}
              className={`w-full py-3 font-comic text-sm font-black rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-2 ${
                activeModule.level >= activeModule.maxLevel
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-102 text-black active:scale-95'
              }`}
            >
              <ArrowUpCircle size={18} /> {activeModule.level >= activeModule.maxLevel ? 'MAX LEVEL REACHED' : `UPGRADE ROOM ($${activeModule.upgradeCost.toLocaleString()} + ${activeModule.tokenCost} TOKENS)`}
            </button>
          </div>

          {/* Trophy Hall of Fame */}
          <div className="bg-[#151928] border-3 border-black rounded-2xl p-5 shadow-comic space-y-3">
            <h4 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award size={16} /> BOSS TROPHY VAULT ({trophies.length})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {trophies.map(trophy => (
                <div key={trophy.id} className="p-3 bg-[#101422] rounded-xl border border-gray-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-comic font-black text-yellow-300 flex items-center gap-1.5">
                      <span>{trophy.icon}</span> {trophy.name}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">{trophy.dateAcquired}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 italic">"{trophy.lore}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
