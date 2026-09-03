import React, { useState } from 'react';
import { Crown, Sparkles, Award, ShieldCheck, ArrowRight, History, Zap, UserCheck, Flame } from 'lucide-react';
import { HeroCharacter, SidekickCharacter, MentorHeirloom, SuccessionPedigree } from '../types/game';
import { BASE_XP_TO_NEXT_LEVEL } from '../utils/progression';
import { LEGACY_HEIRLOOMS, RECRUITABLE_SIDEKICKS } from '../data/universe';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SuccessionLegacyHubProps {
  playerHero: HeroCharacter;
  onUpdateHero: (updated: HeroCharacter) => void;
  onLogMessage?: (msg: string) => void;
}

export const SuccessionLegacyHub: React.FC<SuccessionLegacyHubProps> = ({
  playerHero,
  onUpdateHero,
  onLogMessage,
}) => {
  const currentGen = playerHero.generation || 1;
  const sidekicks = playerHero.sidekicks && playerHero.sidekicks.length > 0 ? playerHero.sidekicks : RECRUITABLE_SIDEKICKS;
  const heirlooms = playerHero.heirlooms || [];
  const pedigree = playerHero.pedigreeHistory || [];

  const [selectedSidekickId, setSelectedSidekickId] = useState<string>(sidekicks[0]?.id || '');
  const [selectedHeirloomId, setSelectedHeirloomId] = useState<string>(LEGACY_HEIRLOOMS[0].id);
  const [torchPassed, setTorchPassed] = useState<boolean>(false);

  const selectedSidekick = sidekicks.find((s) => s.id === selectedSidekickId) || sidekicks[0];
  const selectedHeirloom = LEGACY_HEIRLOOMS.find((h) => h.id === selectedHeirloomId) || LEGACY_HEIRLOOMS[0];

  const canPassTorch = playerHero.level >= 2 || currentGen > 1;

  const handlePassTheTorch = () => {
    if (!selectedSidekick) return;

    sound.playVictory();
    try {
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
    } catch (e) {}

    const newPedigreeEntry: SuccessionPedigree = {
      generationNumber: currentGen,
      originalHeroName: playerHero.heroName,
      originalCivilianName: playerHero.civilianName,
      retiredDay: playerHero.level * 7,
      torchPassedTo: selectedSidekick.heroAlias,
      legacyPerks: [
        `Inherited ${selectedHeirloom.name}`,
        `Mentored by Legendary Champion ${playerHero.heroName}`,
        `+25% Generation ${currentGen + 1} XP Mastery Bonus`
      ],
      totalVillainsDefeated: 5 + (playerHero.level * 2),
      finalRankGrade: playerHero.alignmentScore >= 50 ? 'S+ Paragon Laureate' : playerHero.alignmentScore <= -50 ? 'A+ Dread Anti-Hero' : 'S Urban Shadow Vanguard'
    };

    // Calculate inherited stats for successor
    const successorStats = {
      strength: Math.floor(selectedSidekick.stats.strength + (playerHero.stats.strength * 0.3)),
      agility: Math.floor(selectedSidekick.stats.agility + (playerHero.stats.agility * 0.3)),
      intellect: Math.floor(selectedSidekick.stats.intellect + (playerHero.stats.intellect * 0.3)),
      fortitude: Math.floor(selectedSidekick.stats.fortitude + (playerHero.stats.fortitude * 0.3)),
      willpower: Math.floor(selectedSidekick.stats.willpower + (playerHero.stats.willpower * 0.3)),
      charisma: Math.floor(selectedSidekick.stats.charisma + (playerHero.stats.charisma * 0.3)),
    };

    const maxHp = 130 + successorStats.fortitude * 5;
    const maxEnergy = 90 + successorStats.intellect * 3;

    const newGenHero: HeroCharacter = {
      ...playerHero,
      id: `hero-gen-${currentGen + 1}-${Date.now()}`,
      heroName: `${selectedSidekick.heroAlias} (Era ${currentGen + 1})`,
      civilianName: selectedSidekick.civilianName,
      tagline: `Successor to the Mantle of ${playerHero.heroName}`,
      backstory: `Having graduated under the mentorship of the legendary ${playerHero.heroName}, ${selectedSidekick.civilianName} now steps forward as Metro Nova's primary champion!`,
      avatarIcon: selectedSidekick.avatarIcon,
      generation: currentGen + 1,
      level: 1,
      xp: 0,
      xpToNextLevel: BASE_XP_TO_NEXT_LEVEL,
      stats: successorStats,
      baseHp: maxHp,
      currentHp: maxHp,
      maxHp,
      baseEnergy: maxEnergy,
      currentEnergy: maxEnergy,
      maxEnergy,
      armor: Math.floor(successorStats.fortitude * 0.8) + 5,
      publicApproval: Math.min(100, Math.max(50, playerHero.publicApproval + 5)),
      reputation: Math.max(30, playerHero.reputation - 20),
      money: playerHero.money + 1500,
      heroTokens: playerHero.heroTokens + 5,
      heirlooms: [...heirlooms, selectedHeirloom],
      pedigreeHistory: [newPedigreeEntry, ...pedigree],
      stress: 5,
      identitySuspicion: 5
    };

    onUpdateHero(newGenHero);
    setTorchPassed(true);
    if (onLogMessage) {
      onLogMessage(`👑 HISTORIC RELAUNCH: ${playerHero.heroName} has passed the mantle to ${selectedSidekick.heroAlias}! Era ${currentGen + 1} begins!`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900/80 via-slate-900 to-yellow-950 p-6 rounded-2xl border-4 border-yellow-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl">👑</div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-400 text-sm font-black uppercase tracking-wider">
              <Crown className="w-5 h-5 text-yellow-400 animate-pulse" />
              Superhero Dynasty & Legacy Succession • Era {currentGen}
            </div>
            <h2 className="text-3xl font-black text-white tracking-wider font-comic">
              PASSING THE TORCH: NEXT-GEN LEGACY
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Pass your cowl, secret headquarters, and legendary relics to your chosen sidekick protégé to launch Era {currentGen + 1}!
            </p>
          </div>

          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-yellow-500/50 flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Mantle Bearer</div>
              <div className="text-sm font-black text-yellow-400 font-comic">{playerHero.heroName} (Gen {currentGen})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Successor Selection & Heirloom Bestowal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Select Sidekick Successor */}
        <div className="bg-[#151928] border-2 border-black rounded-xl p-6 shadow-comic space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h3 className="text-base font-black text-white flex items-center gap-2 font-comic">
              <UserCheck className="w-5 h-5 text-yellow-400" />
              1. Designate Protégé Successor
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {sidekicks.length} Sidekicks Available
            </span>
          </div>

          <div className="space-y-3">
            {sidekicks.map((sidekick) => {
              const isSelected = sidekick.id === selectedSidekick?.id;
              return (
                <div
                  key={sidekick.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSidekickId(sidekick.id);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-yellow-950/60 to-[#1E243A] border-yellow-400 shadow-comic scale-[1.01]'
                      : 'bg-[#1E243A] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-2xl shadow-comic"
                        style={{ backgroundColor: sidekick.color }}
                      >
                        {sidekick.avatarIcon}
                      </div>
                      <div>
                        <div className="font-black text-white text-base font-comic">{sidekick.heroAlias}</div>
                        <div className="text-xs text-yellow-400 font-medium">Civilian: {sidekick.civilianName} • {sidekick.role}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-cyan-300 border border-gray-700">
                      LV {sidekick.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{sidekick.backstory}</p>

                  <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-gray-800">
                    <div><span className="text-red-400">STR</span> {sidekick.stats.strength}</div>
                    <div><span className="text-yellow-400">AGI</span> {sidekick.stats.agility}</div>
                    <div><span className="text-blue-400">INT</span> {sidekick.stats.intellect}</div>
                    <div><span className="text-green-400">FOR</span> {sidekick.stats.fortitude}</div>
                    <div><span className="text-purple-400">WIL</span> {sidekick.stats.willpower}</div>
                    <div><span className="text-pink-400">CHA</span> {sidekick.stats.charisma}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Bestow Legendary Heirloom Relic */}
        <div className="bg-[#151928] border-2 border-black rounded-xl p-6 shadow-comic space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h3 className="text-base font-black text-white flex items-center gap-2 font-comic">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              2. Bestow Generational Heirloom
            </h3>
            <span className="text-xs font-mono text-yellow-400 font-bold">
              Legendary Relics
            </span>
          </div>

          <div className="space-y-3">
            {LEGACY_HEIRLOOMS.map((heirloom) => {
              const isSelected = heirloom.id === selectedHeirloom?.id;
              return (
                <div
                  key={heirloom.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedHeirloomId(heirloom.id);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/60 to-[#1E243A] border-amber-400 shadow-comic scale-[1.01]'
                      : 'bg-[#1E243A] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{heirloom.icon}</span>
                      <div>
                        <div className="font-black text-white text-sm font-comic">{heirloom.name}</div>
                        <div className="text-[10px] text-amber-400 uppercase font-mono">{heirloom.slot} Relic</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 my-2">{heirloom.lore}</p>

                  <div className="text-[11px] font-bold text-amber-300 bg-black/40 p-2 rounded border border-gray-800">
                    ⚡ <strong>Legacy Perk:</strong> {heirloom.perkEffect}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ceremony Launch Button */}
          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={handlePassTheTorch}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-comic text-xl rounded-xl border-3 border-black shadow-comic flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Crown className="w-5 h-5" /> PASS THE TORCH TO {selectedSidekick?.heroAlias.toUpperCase()}!
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Initiates Era {currentGen + 1} with a relaunch Comic Issue #1 and inherited stat bonuses.
            </p>
          </div>
        </div>
      </div>

      {/* Dynasty Pedigree Archive */}
      {pedigree.length > 0 && (
        <div className="bg-[#151928] border-2 border-black rounded-xl p-6 shadow-comic space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2 font-comic">
            <History className="w-5 h-5 text-amber-400" />
            Hall of Heroes: Generational Dynasty Archive
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedigree.map((p, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#1E243A] rounded-xl border-2 border-black shadow-comic space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-comic text-yellow-400 text-sm">Generation {p.generationNumber}</span>
                  <span className="bg-black/60 text-green-300 px-2 py-0.5 rounded border border-gray-700 font-bold">
                    {p.finalRankGrade}
                  </span>
                </div>
                <div className="text-white font-black text-base">{p.originalHeroName} ({p.originalCivilianName})</div>
                <div className="text-xs text-slate-400">Passed mantle to: <strong className="text-cyan-300">{p.torchPassedTo}</strong></div>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4 pt-1">
                  {p.legacyPerks.map((perk, pIdx) => (
                    <li key={pIdx}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
