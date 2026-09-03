import React, { useMemo, useState } from 'react';
import { 
  Orbit, 
  Sparkles, 
  Flame, 
  Zap, 
  AlertOctagon, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { HeroCharacter, WhatIfTimelineScenario, WhatIfDivergenceChoice, WhatIfProgress, HubProgressUpdater } from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { applyRewards } from '../utils/progression';
import confetti from 'canvas-confetti';

interface WhatIfMultiverseSimulatorProps {
  playerHero: HeroCharacter;
  progress: WhatIfProgress;
  onUpdateProgress: HubProgressUpdater<'whatIf'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

/** Fixed bounty for exploring a reality, on top of the choice's shard reward. */
const DIVERGENCE_REWARDS = { xp: 400, heroTokens: 2 } as const;

const WHAT_IF_SCENARIOS: WhatIfTimelineScenario[] = [
  {
    id: 'scen-tyrant-mayor',
    universeCode: 'Earth-982',
    title: 'What If The Hero Became The Tyrant Mayor?',
    premise: 'Following a catastrophic alien invasion, Metro Nova citizens elect you Mayor. Frustrated by bureaucratic delays, you deploy an automated kinetic peacekeeper army.',
    divergencePoint: 'The City Hall Security Decree Vote',
    isExplored: false,
    divergenceChoices: [
      {
        id: 'div-1',
        label: 'Enforce Absolute Robotic Curfew',
        description: 'Impose martial law with autonomous kinetic sentinels patrolling every rooftop.',
        timelineDistortionPct: 85,
        bossVariantName: 'Apex Tyrant Prime',
        outcomeNarrative: 'Crime drops to 0%, but the public lives in terrified obedience. You sit upon an iron throne in City Hall, feared as the supreme ruler of Metro Nova!',
        variantCostumeUnlocked: 'Obsidian Tyrant Mantle',
        shardReward: 150
      },
      {
        id: 'div-2',
        label: 'Establish Citizen Hero Council',
        description: 'Share supreme executive power with elected civilian representatives and reformed vigilantes.',
        timelineDistortionPct: 40,
        bossVariantName: 'Syndicate Shadow Infiltrator',
        outcomeNarrative: 'A flourishing golden age of civic democracy dawns. Metro Nova becomes the beacon of global peace and superhuman cooperation!',
        variantCostumeUnlocked: 'Golden Chancellor Regalia',
        shardReward: 200
      }
    ]
  },
  {
    id: 'scen-powerless-world',
    universeCode: 'Earth-414',
    title: 'What If Superpowers Were Outlawed 10 Years Ago?',
    premise: 'Doctor Chronos successfully passed the Anti-Metahuman Gene Act in 2016. All heroes operate in the shadows as underground cyber-insurgents.',
    divergencePoint: 'The Blackgate Gene Registration Strike',
    isExplored: false,
    divergenceChoices: [
      {
        id: 'div-3',
        label: 'Lead Underground Cyber-Guerilla Front',
        description: 'Equip rogue heroes with untraceable EMP weapons and stealth cloaks.',
        timelineDistortionPct: 70,
        bossVariantName: 'Inquisitor Chronos Mk. IX',
        outcomeNarrative: 'From the steam tunnels beneath Downtown, your insurgent network dismantles the syndicate surveillance towers one by one!',
        variantCostumeUnlocked: 'Cyber-Rebel Trenchcoat',
        shardReward: 175
      }
    ]
  },
  {
    id: 'scen-magic-renaissance',
    universeCode: 'Earth-777',
    title: 'What If Magic & Alchemy Replaced All Modern Technology?',
    premise: 'A dimensional rift replaced all microchips and electricity with arcane runic leylines. Metro Nova is an enchanted neon-fantasy metropolis.',
    divergencePoint: 'The Great Leyline Convergence of 1999',
    isExplored: false,
    divergenceChoices: [
      {
        id: 'div-4',
        label: 'Forge the Solar Excalibur Blade',
        description: 'Channel celestial solar energy into an indestructible runic broadsword.',
        timelineDistortionPct: 95,
        bossVariantName: 'Arch-Demon Malakor the Void',
        outcomeNarrative: 'With blade ignited by the fire of a thousand stars, you banish the shadow leviathan back into the Nether Void!',
        variantCostumeUnlocked: 'Solar Paladin Armor',
        shardReward: 250
      }
    ]
  }
];

export const WhatIfMultiverseSimulator: React.FC<WhatIfMultiverseSimulatorProps> = ({
  playerHero,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  // Which realities have been explored (and with which choice) is persistent; each pays out once.
  const scenarios = useMemo<WhatIfTimelineScenario[]>(
    () => WHAT_IF_SCENARIOS.map(s => {
      const chosen = progress.exploredChoices[s.id];
      return chosen ? { ...s, isExplored: true, selectedChoiceId: chosen } : s;
    }),
    [progress.exploredChoices]
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-tyrant-mayor');
  const [divergenceResult, setDivergenceResult] = useState<string | null>(null);

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleSimulateChoice = (choice: WhatIfDivergenceChoice) => {
    if (activeScenario.isExplored) {
      sound.playAlarm();
      setDivergenceResult(`🔒 This reality has already been mapped (you chose "${activeScenario.divergenceChoices.find(c => c.id === activeScenario.selectedChoiceId)?.label ?? 'a divergence'}"). Explore another timeline to earn more shards.`);
      return;
    }

    sound.playKraakoom();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    onUpdateProgress(prev => ({
      exploredChoices: { ...prev.exploredChoices, [activeScenario.id]: choice.id }
    }));

    // Reward hero
    const { hero: updated } = applyRewards(playerHero, {
      ...DIVERGENCE_REWARDS,
      multiverseShards: choice.shardReward
    });
    onUpdateHero(updated);

    narratorTts.speak(`Timeline Diverged! In ${activeScenario.universeCode}: ${choice.outcomeNarrative}`, 'cosmic_herald');

    setDivergenceResult(`🌌 REALITY DIVERGENCE SIMULATED: ${choice.outcomeNarrative} Unlocked Costume: [${choice.variantCostumeUnlocked}] • +${choice.shardReward} Multiverse Shards!`);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-[#151928] to-indigo-950 p-6 rounded-2xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-400 text-black border-2 border-black rounded-lg text-xs font-black tracking-widest shadow-comic uppercase flex items-center gap-1.5">
              <Orbit size={14} /> MULTIVERSE TIMELINE DIVERGENCE ENGINE
            </span>
            <span className="text-xs font-bold text-yellow-300">
              {scenarios.filter(s => s.isExplored).length} / {scenarios.length} Realities Explored
            </span>
          </div>
          <h2 className="text-3xl font-black font-comic tracking-wider text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1">
            "WHAT IF...?" ALTERNATE REALITY SIMULATOR
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mt-1">
            Explore parallel dimensions where history took a radical turn! Make critical reality divergence decisions, battle dark mirror variant bosses, and claim unique multiverse costumes!
          </p>
        </div>
      </div>

      {divergenceResult && (
        <div className="p-4 bg-purple-950/90 border-2 border-purple-400 rounded-xl text-xs sm:text-sm text-purple-200 font-mono font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{divergenceResult}</span>
          <button onClick={() => setDivergenceResult(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Scenario Selection List (4 Cols) */}
        <div className="lg:col-span-4 bg-[#151928] border-3 border-black rounded-2xl p-5 shadow-comic space-y-3">
          <h3 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest border-b border-gray-800 pb-2.5">
            🌌 PARALLEL TIMELINE REGISTRY
          </h3>

          <div className="space-y-2.5">
            {scenarios.map(scen => (
              <div
                key={scen.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedScenarioId(scen.id);
                  setDivergenceResult(null);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedScenarioId === scen.id
                    ? 'bg-purple-950/80 border-purple-400 scale-102 shadow-comic'
                    : 'bg-[#101422] border-black hover:border-gray-600'
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black uppercase rounded font-mono">
                    {scen.universeCode}
                  </span>
                  <h4 className="font-comic font-black text-xs text-yellow-300 mt-1 leading-tight">
                    {scen.title}
                  </h4>
                </div>

                <span className="text-xs">
                  {scen.isExplored ? '✓' : '➔'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Scenario Detail & Divergence Decision Arena (8 Cols) */}
        <div className="lg:col-span-8 bg-[#151928] border-3 border-black rounded-2xl p-6 shadow-comic space-y-5">
          <div className="border-b border-gray-800 pb-3 flex items-start justify-between">
            <div>
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                {activeScenario.universeCode} // DIVERGENCE POINT: {activeScenario.divergencePoint}
              </span>
              <h3 className="text-2xl font-black font-comic text-yellow-400 mt-1">
                {activeScenario.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-gray-200 font-mono bg-black/50 p-4 rounded-xl border border-gray-800 leading-relaxed">
            "{activeScenario.premise}"
          </p>

          {/* Divergence Decision Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase">
              Choose Your Reality Divergence Path:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeScenario.divergenceChoices.map(choice => {
                const wasChosen = activeScenario.selectedChoiceId === choice.id;
                const locked = activeScenario.isExplored;
                return (
                <div
                  key={choice.id}
                  onClick={() => handleSimulateChoice(choice)}
                  className={`border-3 p-4 rounded-xl shadow-comic transition-all flex flex-col justify-between space-y-3 ${
                    wasChosen
                      ? 'bg-purple-950/60 border-purple-400 cursor-default'
                      : locked
                        ? 'bg-[#101422] border-black opacity-50 cursor-not-allowed'
                        : 'bg-[#101422] hover:bg-[#1c1830] border-black hover:border-purple-400 cursor-pointer hover:scale-102'
                  }`}
                >
                  <div>
                    <h5 className="font-comic font-black text-base text-yellow-300">
                      {choice.label}
                    </h5>
                    <p className="text-xs text-gray-300 mt-1 leading-snug">
                      {choice.description}
                    </p>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-lg border border-gray-800 text-[10px] font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeline Distortion:</span>
                      <span className="text-purple-400 font-bold">{choice.timelineDistortionPct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shard Bounty:</span>
                      <span className="text-cyan-400 font-bold">+{choice.shardReward} Shards</span>
                    </div>
                  </div>

                  <button
                    disabled={locked}
                    className={`w-full py-2 text-white font-comic font-black text-xs rounded-lg border border-black shadow-comic flex items-center justify-center gap-1.5 ${
                      wasChosen
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                        : locked
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    }`}
                  >
                    <Orbit size={14} /> {wasChosen ? 'REALITY MAPPED ✓' : locked ? 'TIMELINE LOCKED' : 'SIMULATE DIVERGENCE ➔'}
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
