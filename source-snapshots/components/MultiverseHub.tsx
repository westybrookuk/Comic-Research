import React, { useState } from 'react';
import { Sparkles, Globe, Orbit, ShieldAlert, Swords, Zap, Award, RefreshCw, CheckCircle2, Lock } from 'lucide-react';
import { HeroCharacter, MultiverseTimeline, CrimeEncounter } from '../types/game';
import { BASE_XP_TO_NEXT_LEVEL } from '../utils/progression';
import { MULTIVERSE_TIMELINES } from '../data/universe';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MultiverseHubProps {
  playerHero: HeroCharacter;
  onUpdateHero: (updated: HeroCharacter) => void;
  onStartCombat: (encounter: CrimeEncounter) => void;
  onLogMessage?: (msg: string) => void;
}

export const MultiverseHub: React.FC<MultiverseHubProps> = ({
  playerHero,
  onUpdateHero,
  onStartCombat,
  onLogMessage,
}) => {
  const [timelines, setTimelines] = useState<MultiverseTimeline[]>(MULTIVERSE_TIMELINES);
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(MULTIVERSE_TIMELINES[0].id);

  const shards = playerHero.multiverseShards || 25;
  const ngPlusCount = playerHero.ngPlusCount || 0;
  const prestigePassives = playerHero.prestigePassives || [];

  const selectedTimeline = timelines.find((t) => t.id === selectedTimelineId) || timelines[0];

  const PRESTIGE_UPGRADES = [
    {
      id: 'prestige-tachyon-reflexes',
      name: 'Tachyon Hyper-Reflexes',
      cost: 40,
      description: '+15% Permanent Evasion and +1 Action Point at start of every combat turn.',
      icon: '⚡'
    },
    {
      id: 'prestige-dimensional-armor',
      name: 'Dimensional Weave Armor',
      cost: 50,
      description: '+25 Base Armor and absorbs 20% incoming status effect damage.',
      icon: '🛡️'
    },
    {
      id: 'prestige-cosmic-resonance',
      name: 'Cosmic Leyline Resonance',
      cost: 60,
      description: '+30 Maximum Energy and +25% Super Meter charge speed across all heroes.',
      icon: '🌌'
    }
  ];

  const handleLaunchRaid = (t: MultiverseTimeline) => {
    sound.playAlarm();

    const incursionCrime: CrimeEncounter = {
      id: `incursion-${t.id}-${Date.now()}`,
      title: `DIMENSIONAL INCURSION: ${t.bossVariant.name}`,
      description: `Breach the tachyon rift into ${t.name} and defeat ${t.bossVariant.title}!`,
      severity: 'Catastrophic',
      districtId: 'district-tech-park',
      enemies: [
        {
          name: t.bossVariant.name,
          hp: t.bossVariant.hp,
          maxHp: t.bossVariant.hp,
          attack: t.bossVariant.attack,
          defense: t.bossVariant.defense,
          speed: 15,
          powers: t.bossVariant.powers,
          isBoss: true,
          avatar: t.bossVariant.avatar
        }
      ],
      rewards: {
        xp: 1500,
        money: 5000,
        approval: 30,
        heroTokens: 15
      }
    };

    onStartCombat(incursionCrime);
  };

  const handleBuyPrestige = (upgrade: typeof PRESTIGE_UPGRADES[0]) => {
    if (shards < upgrade.cost) {
      alert(`Not enough Multiverse Shards! You need ${upgrade.cost} Shards.`);
      return;
    }

    sound.playLevelUp();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    const updatedHero: HeroCharacter = {
      ...playerHero,
      multiverseShards: shards - upgrade.cost,
      prestigePassives: [...prestigePassives, upgrade.name],
    };

    onUpdateHero(updatedHero);
    if (onLogMessage) {
      onLogMessage(`🌌 Multiverse Prestige Acquired: ${upgrade.name}!`);
    }
  };

  const handleInitiateNGPlus = () => {
    const confirmNG = window.confirm(
      `Initiate New Game Plus Ascension (NG+ ${ngPlusCount + 1})?\n\nThis will reset day count to Day 1 while carrying over your Hero Stats, Heirlooms, Multiverse Shards, and Prestige Passives with an amplified +50% XP Multiplier!`
    );

    if (!confirmNG) return;

    sound.playVictory();
    try {
      confetti({ particleCount: 250, spread: 150, origin: { y: 0.4 } });
    } catch (e) {}

    const ngHero: HeroCharacter = {
      ...playerHero,
      ngPlusCount: ngPlusCount + 1,
      multiverseShards: shards + 50,
      level: 1,
      xp: 0,
      xpToNextLevel: BASE_XP_TO_NEXT_LEVEL,
      currentEnergy: playerHero.maxEnergy,
      currentHp: playerHero.maxHp,
      stress: 0,
      identitySuspicion: 0,
    };

    onUpdateHero(ngHero);
    if (onLogMessage) {
      onLogMessage(`🌟 COSMIC ASCENSION: Entered New Game Plus (NG+ ${ngPlusCount + 1}) with Multiverse Perks intact!`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-slate-900 to-cyan-950 p-6 rounded-2xl border-4 border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl">🌌</div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-black uppercase tracking-wider">
              <Orbit className="w-5 h-5 text-cyan-400 animate-spin" />
              Tachyon Rift Chamber & Multiverse Gateways
            </div>
            <h2 className="text-3xl font-black text-white tracking-wider font-comic">
              MULTIVERSE INCURSIONS & NG+ PRESTIGE
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Confront alternate reality boss variants across the multiverse, harvest celestial shards, and ascend into New Game Plus!
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/50 flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Multiverse Shards</div>
              <div className="text-lg font-black text-cyan-400 font-mono">✨ {shards}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Cosmic Ascension</div>
              <div className="text-lg font-black text-yellow-400 font-mono">NG+ {ngPlusCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incursion Timelines */}
        <div className="lg:col-span-2 bg-[#151928] border-2 border-black rounded-xl p-6 shadow-comic space-y-5">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-comic text-xl text-yellow-400 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Parallel Timeline Incursions
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              3 Dimensional Rifts Detected
            </span>
          </div>

          <div className="space-y-4">
            {timelines.map((t) => {
              const isSelected = t.id === selectedTimeline?.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTimelineId(t.id);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/70 to-[#1E243A] border-cyan-400 shadow-comic scale-[1.01]'
                      : 'bg-[#1E243A] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-3xl shadow-comic"
                        style={{ backgroundColor: t.bossVariant.color }}
                      >
                        {t.bossVariant.avatar}
                      </div>
                      <div>
                        <div className="font-black text-white text-base font-comic">{t.name}</div>
                        <div className="text-xs text-cyan-400 font-mono font-bold">
                          {t.universeCode} • Threat Level {t.threatLevel}
                        </div>
                      </div>
                    </div>

                    <span className="bg-purple-950/80 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-700">
                      ✨ {t.shardReward} Shards
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{t.description}</p>

                  <div className="bg-black/40 p-3 rounded-lg border border-gray-800 space-y-1 text-xs">
                    <div className="text-yellow-400 font-bold">
                      Dimensional Boss: {t.bossVariant.title} ({t.bossVariant.name})
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      "{t.bossVariant.dialogue}"
                    </div>
                  </div>

                  {/* Raid Action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchRaid(t);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-lg border border-black shadow-comic flex items-center gap-1.5"
                    >
                      <Swords className="w-4 h-4" /> Breach Dimension & Raid Boss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Prestige Shop & NG+ Ascension */}
        <div className="space-y-4">
          {/* Prestige Passives */}
          <div className="bg-[#151928] border-2 border-black rounded-xl p-5 shadow-comic space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 font-comic">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Multiverse Prestige Passives
            </h3>

            <div className="space-y-3">
              {PRESTIGE_UPGRADES.map((up) => {
                const isOwned = prestigePassives.includes(up.name);
                return (
                  <div
                    key={up.id}
                    className={`p-3.5 rounded-xl border-2 space-y-2 ${
                      isOwned
                        ? 'bg-emerald-950/40 border-emerald-500/50'
                        : 'bg-[#1E243A] border-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{up.icon}</span>
                        <div className="font-bold text-white text-xs">{up.name}</div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold">✨ {up.cost}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{up.description}</p>

                    <button
                      onClick={() => handleBuyPrestige(up)}
                      disabled={isOwned || shards < up.cost}
                      className={`w-full py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                        isOwned
                          ? 'bg-emerald-600/60 text-white border border-emerald-500 cursor-default'
                          : shards >= up.cost
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-comic'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acquired
                        </>
                      ) : (
                        'Unlock Passive'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Game Plus Portal */}
          <div className="bg-gradient-to-br from-amber-950/60 to-[#151928] border-2 border-amber-500 rounded-xl p-5 shadow-comic space-y-3">
            <h4 className="font-comic text-lg text-yellow-400 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-yellow-400" />
              New Game Plus Ascension
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ascend to NG+ {ngPlusCount + 1}. Retain your stats, heirlooms, and multiverse passives while re-experiencing the campaign with amplified challenges and +50% XP bonuses!
            </p>
            <button
              onClick={handleInitiateNGPlus}
              className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-comic text-base rounded-xl border-2 border-black shadow-comic flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Orbit className="w-4 h-4" /> ASCEND TO NG+ {ngPlusCount + 1}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
