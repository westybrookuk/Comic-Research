import React, { useMemo, useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Shield, 
  Zap, 
  Award, 
  Flame, 
  Eye, 
  Volume2, 
  Check, 
  Crown,
  Layers,
  Lock,
  Compass
} from 'lucide-react';
import { HeroCharacter, VillainCharacter, TrophyVaultProgress, TrophyVaultTheme, HubProgressUpdater } from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { applyRewards } from '../utils/progression';
import { TROPHY_QUOTE_CLIPS } from '../data/voiceClips';
import confetti from 'canvas-confetti';

interface TrophyVaultHubProps {
  playerHero: HeroCharacter;
  villains: VillainCharacter[];
  progress: TrophyVaultProgress;
  onUpdateProgress: HubProgressUpdater<'trophyVault'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

export type LairTheme = TrophyVaultTheme;

const TROPHY_MOUNT_TOKEN_COST = 2;
const TROPHY_MOUNT_REPUTATION = 8;

interface VillainRelicTrophy {
  id: string;
  name: string;
  villainOrigin: string;
  avatar: string;
  perkStat: string;
  lore: string;
  voiceQuote: string;
  unlocked: boolean;
  color: string;
}

export const TrophyVaultHub: React.FC<TrophyVaultHubProps> = ({
  playerHero,
  villains,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  // Persistent: chosen lair theme + which relics have been mounted.
  const selectedLairTheme = progress.vaultTheme;
  const setSelectedLairTheme = (vaultTheme: LairTheme) => onUpdateProgress(prev => ({ ...prev, vaultTheme }));

  const [selectedTrophyId, setSelectedTrophyId] = useState<string>('trophy-void');
  const [message, setMessage] = useState<string | null>(null);

  const TROPHY_CATALOGUE: VillainRelicTrophy[] = [
    {
      id: 'trophy-void',
      name: 'Null Void’s Singularity Core',
      villainOrigin: 'Null Void',
      avatar: '🕳️',
      perkStat: '+15% Cosmic & Energy Power Damage',
      lore: 'A miniature contained black hole sphere pulsating with zero-point spatial distortion.',
      voiceQuote: 'The singularity cannot be contained by mortal hands. You are only delaying the void.',
      unlocked: true,
      color: 'border-purple-500'
    },
    {
      id: 'trophy-pyre',
      name: 'Queen Pyre’s Molten Obsidian Scepter',
      villainOrigin: 'Queen Pyre',
      avatar: '👑',
      perkStat: '+20% Thermal & Burn Damage',
      lore: 'Forged in the molten depths of Mount Vesuvius, capable of channeling liquid magma.',
      voiceQuote: 'You may have taken my crown, hero, but fire is eternal!',
      unlocked: true,
      color: 'border-red-500'
    },
    {
      id: 'trophy-cyber',
      name: 'Cyber-Shade’s Neural Cloak Matrix',
      villainOrigin: 'Cyber-Shade',
      avatar: '🤖',
      perkStat: '+15% Evasion & Clue Discovery Speed',
      lore: 'Liquid-crystal fiber optic weave that bends light waves and intercepts digital communications.',
      voiceQuote: 'My consciousness exists in the network. You destroyed a mere shell.',
      unlocked: false,
      color: 'border-cyan-500'
    },
    {
      id: 'trophy-megawatt',
      name: 'Doctor Megawatt’s Tesla Super-Capacitor',
      villainOrigin: 'Doctor Megawatt',
      avatar: '⚡',
      perkStat: '+20 Max Action Points (AP)',
      lore: 'High-density galvanic accumulator storing over 50 million volts of bio-electric energy.',
      voiceQuote: 'A shocking outcome... but the circuit is never truly broken!',
      unlocked: false,
      color: 'border-yellow-500'
    },
    {
      id: 'trophy-titanix',
      name: 'Colossal Titanix’s Hydraulic Fist Plating',
      villainOrigin: 'Colossal Titanix',
      avatar: '🦾',
      perkStat: '+25 Armor & Melee Knockback Force',
      lore: 'Reinforced titanium pneumatic gauntlet engineered to shatter skyscraper foundations.',
      voiceQuote: 'Nothing stands in the way of Titanix! Next time, I crush you whole!',
      unlocked: false,
      color: 'border-amber-500'
    }
  ];

  // Catalogue entries flagged `unlocked: true` are starter relics; the rest unlock via persisted ids.
  const trophies = useMemo(
    () => TROPHY_CATALOGUE.map(t => ({ ...t, unlocked: t.unlocked || progress.unlockedTrophyIds.includes(t.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress.unlockedTrophyIds]
  );

  const LAIR_THEMES: { id: LairTheme; name: string; desc: string; perk: string; icon: string; bg: string }[] = [
    {
      id: 'GothicBatcave',
      name: 'Subterranean Gothic Spire Sanctuary',
      desc: 'Carved deep below Metro Nova’s bedrock with waterfall cooling systems and supercomputing bays.',
      perk: '+15% Stealth & -15% Secret Identity Suspicion',
      icon: '🦇',
      bg: 'from-slate-950 via-zinc-950 to-[#0A0D18]'
    },
    {
      id: 'OrbitalCitadel',
      name: 'Low-Earth Orbit Watchtower',
      desc: 'Floating satellite fortress with 360-degree global surveillance windows and laser weapon relays.',
      perk: '+20 Max AP & Global Incursion Readiness',
      icon: '🛰️',
      bg: 'from-blue-950 via-indigo-950 to-black'
    },
    {
      id: 'PenthouseLab',
      name: 'Skyline Apex Quantum Penthouse',
      desc: 'Top 3 floors of Lexington Tower equipped with private helipad and nanotech research labs.',
      perk: '+20% Comic Royalties & Day Job Salary',
      icon: '🏙️',
      bg: 'from-amber-950/70 via-slate-900 to-[#101424]'
    },
    {
      id: 'AncientCatacomb',
      name: 'Mystic Sanctum of the Elders',
      desc: 'Chambers illuminated by mystic braziers, arcane library tomes, and dimensional leyline nexus.',
      perk: '+25% Super Meter Charge Rate',
      icon: '🔮',
      bg: 'from-purple-950 via-slate-950 to-black'
    }
  ];

  const selectedTrophy = trophies.find(t => t.id === selectedTrophyId) || trophies[0];
  const activeLair = LAIR_THEMES.find(l => l.id === selectedLairTheme) || LAIR_THEMES[0];

  const handleSpeakTrophyQuote = (trophy: VillainRelicTrophy) => {
    sound.playClick();
    // Villains with a cast voice speak the quote themselves; others go through the noir narrator.
    const clip = TROPHY_QUOTE_CLIPS[trophy.id];
    if (clip) {
      narratorTts.speak(trophy.voiceQuote, 'dark_detective', { clip });
    } else {
      narratorTts.speak(`${trophy.villainOrigin}'s seized relic speaks: "${trophy.voiceQuote}"`, 'dark_detective');
    }
  };

  const handleClaimTrophy = (trophy: VillainRelicTrophy) => {
    if (trophy.unlocked) return;
    if (playerHero.heroTokens < TROPHY_MOUNT_TOKEN_COST) {
      sound.playAlarm();
      setMessage(`⚠️ Restoring and mounting this villain trophy requires ${TROPHY_MOUNT_TOKEN_COST} Hero Tokens.`);
      return;
    }

    sound.playLevelUp();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}

    const { hero: updatedHero } = applyRewards(playerHero, {
      heroTokens: -TROPHY_MOUNT_TOKEN_COST,
      reputation: TROPHY_MOUNT_REPUTATION
    });

    onUpdateProgress(prev => ({ ...prev, unlockedTrophyIds: [...prev.unlockedTrophyIds, trophy.id] }));
    onUpdateHero(updatedHero);
    setMessage(`🏆 TROPHY MOUNTED: ${trophy.name} now prominently displayed in the Rogues' Gallery! Passive bonus active.`);
  };

  const handleSelectLairTheme = (themeId: LairTheme) => {
    sound.playClick();
    setSelectedLairTheme(themeId);
    setMessage(`🏰 Secret Lair Theme set to ${LAIR_THEMES.find(l => l.id === themeId)?.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-comic text-2xl sm:text-3xl text-yellow-400 flex items-center gap-2">
            <Trophy className="text-yellow-400" /> ROGUES' GALLERY TROPHY VAULT & LAIR CUSTOMIZER
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Display confiscated supervillain relics in your secret sanctuary to unlock permanent passive perks and character audio lore!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D101A] px-3.5 py-2 rounded-xl border-2 border-black shadow-comic text-xs">
          <span className="text-2xl">{activeLair.icon}</span>
          <div>
            <div className="text-[10px] text-gray-400 font-mono">ACTIVE LAIR</div>
            <div className="font-bold text-yellow-400 font-comic">{activeLair.name.split(' ')[0]}</div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-yellow-950/80 border-2 border-yellow-400 rounded-xl text-xs sm:text-sm text-yellow-200 font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Lair Theme Selector */}
      <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-3">
        <h3 className="font-comic text-xl text-yellow-400 flex items-center gap-2">
          <Compass size={18} /> Secret Sanctuary Lair Architectural Theme
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LAIR_THEMES.map(theme => {
            const isSelected = selectedLairTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectLairTheme(theme.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-black font-bold shadow-comic scale-102'
                    : 'bg-[#0D101A] text-gray-300 border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-3xl">{theme.icon}</span>
                  {isSelected && (
                    <span className="text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded bg-black text-yellow-300">
                      CURRENT LAIR
                    </span>
                  )}
                </div>
                <h4 className="font-comic text-base mt-2">{theme.name}</h4>
                <p className={`text-xs mt-1 leading-snug ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>{theme.desc}</p>
                <div className={`text-xs font-bold mt-2 ${isSelected ? 'text-blue-950 font-black' : 'text-cyan-400'}`}>
                  ★ {theme.perk}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Rogues' Gallery Trophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: TROPHY PEDESTAL SHOWCASE */}
        <div className="lg:col-span-7 bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-comic text-2xl text-yellow-400">Rogues' Gallery Pedestals</h3>
            <span className="text-xs font-mono font-bold text-gray-400">
              {trophies.filter(t => t.unlocked).length} / {trophies.length} Relics Mounted
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {trophies.map(trophy => {
              const isSelected = selectedTrophyId === trophy.id;
              return (
                <div
                  key={trophy.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTrophyId(trophy.id);
                  }}
                  className={`p-4 rounded-2xl border-3 cursor-pointer transition-all flex flex-col items-center justify-between text-center space-y-2 relative ${
                    isSelected
                      ? 'bg-gradient-to-b from-yellow-950/80 to-[#101321] border-yellow-400 shadow-comic scale-105'
                      : trophy.unlocked
                      ? 'bg-[#0D101A] border-gray-700 hover:border-gray-500'
                      : 'bg-black/40 border-gray-900 opacity-60'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/60 border-2 border-black flex items-center justify-center text-3xl shadow-inner">
                    {trophy.unlocked ? trophy.avatar : '🔒'}
                  </div>

                  <div>
                    <h4 className="font-comic text-sm text-yellow-400 leading-tight">{trophy.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">({trophy.villainOrigin})</span>
                  </div>

                  {trophy.unlocked ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                      ACTIVE PERK
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                      LOCKED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 5 COLS: SELECTED RELIC DOSSIER & AUDIO LORE */}
        <div className="lg:col-span-5 bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
              <span className="text-5xl p-2 bg-black/60 rounded-2xl border-2 border-yellow-400 shadow-comic">
                {selectedTrophy.avatar}
              </span>
              <div>
                <h4 className="font-comic text-2xl text-yellow-400 leading-tight">{selectedTrophy.name}</h4>
                <div className="text-xs text-gray-400 font-bold">Origin: {selectedTrophy.villainOrigin}</div>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#0D101A] p-3 rounded-xl border border-gray-800">
              "{selectedTrophy.lore}"
            </p>

            {/* Stat Perk Badge */}
            <div className="bg-gradient-to-r from-yellow-950/60 to-amber-950/60 p-3.5 rounded-xl border-2 border-yellow-500 text-xs font-bold text-yellow-300 space-y-1 shadow-comic">
              <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-yellow-400">
                <Sparkles size={14} /> Relic Permanent Passive:
              </div>
              <div className="text-sm text-white font-comic">{selectedTrophy.perkStat}</div>
            </div>

            {/* Audio Voice Lore */}
            <div className="bg-black/50 p-3.5 rounded-xl border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase">
                  CONFISCATED AUDIO RECORDING:
                </span>
                <button
                  onClick={() => handleSpeakTrophyQuote(selectedTrophy)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] rounded-lg border border-black flex items-center gap-1 shadow-comic"
                >
                  <Volume2 size={12} /> PLAY VOICE (TTS)
                </button>
              </div>
              <p className="text-xs text-gray-300 italic">
                "{selectedTrophy.voiceQuote}"
              </p>
            </div>
          </div>

          {!selectedTrophy.unlocked ? (
            <button
              onClick={() => handleClaimTrophy(selectedTrophy)}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-lg rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-2 font-black"
            >
              <Award size={18} /> RESTORE & MOUNT TROPHY (2 Hero Tokens)
            </button>
          ) : (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center text-xs text-emerald-300 font-bold font-mono">
              ✓ RELIC ACTIVE & MOUNTED IN VAULT
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
