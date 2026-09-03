import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Swords, CheckCircle2 } from 'lucide-react';
import { HeroCharacter, OriginArchetype } from '../types/game';
import { BASE_XP_TO_NEXT_LEVEL } from '../utils/progression';
import { ALL_POWERS, DAY_JOBS, RECRUITABLE_SIDEKICKS, DEFAULT_CIVILIAN_MILESTONES } from '../data/universe';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { ORIGIN_STORY_CLIPS } from '../data/voiceClips';

interface OriginStorySelectorProps {
  onHeroCreated: (hero: HeroCharacter) => void;
  onCancel: () => void;
}

interface Scenario {
  title: string;
  origin: OriginArchetype;
  premise: string;
  choices: {
    text: string;
    heroName: string;
    alias: string;
    avatar: string;
    color: string;
    statBonus: string;
    tagline: string;
    powers: string[];
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    title: 'The Quantum Incident at Apex Labs',
    origin: 'High-Tech Prodigy',
    premise: 'During a rogue particle accelerator experiment, containment failed. You had 10 seconds to act before the core breached.',
    choices: [
      {
        text: 'Deploy your prototype nanite mesh suit to absorb the tachyon blast.',
        heroName: 'Cyber Valkyrie',
        alias: 'Dr. Elena Vance',
        avatar: '🤖',
        color: '#00F0FF',
        statBonus: '+4 Intellect, +2 Fortitude',
        tagline: 'The Silicon Sentinel',
        powers: ['power-emp-grenade', 'power-micro-missiles', 'power-nano-repair', 'power-orbital-cannon']
      },
      {
        text: 'Manually override the containment turbines with sheer kinetic force.',
        heroName: 'Apex Dynamo',
        alias: 'Marcus Chen',
        avatar: '⚡',
        color: '#FFDE59',
        statBonus: '+4 Strength, +2 Agility',
        tagline: 'The Living Reactor',
        powers: ['power-plasma-burst', 'power-heavy-strike', 'power-energy-shield', 'power-supernova-blast']
      }
    ]
  },
  {
    title: 'Shadows of the Blood Alley',
    origin: 'Billionaire Vigilante',
    premise: 'Ten years ago, a mob syndicate ambush took your mentor. Tonight, you cornered the syndicate\'s lead lieutenant in an abandoned subway station.',
    choices: [
      {
        text: 'Disarm and interrogate them with high-tech batons, handing them to the police.',
        heroName: 'Shadow Knight',
        alias: 'Bruce Kensington',
        avatar: '🦇',
        color: '#1E1E2E',
        statBonus: '+4 Agility, +2 Charisma',
        tagline: 'Vengeance in the Mist',
        powers: ['power-shadow-strike', 'power-smoke-vanish', 'power-emp-grenade', 'power-assassin-blitz']
      },
      {
        text: 'Unleash relentless martial arts wrath, putting fear into every criminal in Metro Nova.',
        heroName: 'Ronin Reaper',
        alias: 'Kaelen Cross',
        avatar: '⚔️',
        color: '#E63946',
        statBonus: '+4 Strength, +2 Agility',
        tagline: 'Judgment of the Silent Blade',
        powers: ['power-shadow-strike', 'power-lightning-kick', 'power-smoke-vanish', 'power-assassin-blitz']
      }
    ]
  },
  {
    title: 'The Fallen Cosmic Fragment',
    origin: 'Cosmic Awakening',
    premise: 'A meteor of pulsating crystalline gold crashed in your backyard. Touching it bonded an ancient stellar entity to your soul.',
    choices: [
      {
        text: 'Embrace the solar light as a beacon of justice and hope for all humanity.',
        heroName: 'Astra Lumina',
        alias: 'Lyra Solis',
        avatar: '☀️',
        color: '#FFD700',
        statBonus: '+4 Fortitude, +3 Willpower',
        tagline: 'The Radiant Dawn',
        powers: ['power-solar-beam', 'power-plasma-burst', 'power-energy-shield', 'power-supernova-blast']
      },
      {
        text: 'Channel the psychic resonance of the stars to bend thoughts and reality.',
        heroName: 'Cosmic Mind',
        alias: 'Aiden Stargazer',
        avatar: '🔮',
        color: '#8A2BE2',
        statBonus: '+4 Willpower, +3 Intellect',
        tagline: 'Architect of the Astral Realm',
        powers: ['power-mind-flay', 'power-telekinetic-toss', 'power-mystic-restoration', 'power-psychic-cataclysm']
      }
    ]
  }
];

export const OriginStorySelector: React.FC<OriginStorySelectorProps> = ({ onHeroCreated, onCancel }) => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState(0);

  const scenario = SCENARIOS[selectedScenarioIdx];
  const choice = scenario.choices[selectedChoiceIdx];

  // The Narrator (cast voice) reads the incident's premise; falls back to speech synthesis if the clip can't play.
  const narrateScenario = (sc: Scenario) => {
    narratorTts.speak(`${sc.title}. ${sc.premise}`, 'golden_age', { clip: ORIGIN_STORY_CLIPS[sc.title] });
  };

  const handleLaunch = () => {
    narratorTts.stop();
    sound.playLevelUp();
    const job = DAY_JOBS[0];
    const heroPowers = ALL_POWERS.filter(p => choice.powers.includes(p.id)).map(p => ({ ...p, unlocked: true }));

    const hero: HeroCharacter = {
      id: `hero-origin-${Date.now()}`,
      heroName: choice.heroName,
      civilianName: choice.alias,
      origin: scenario.origin,
      gender: 'neutral',
      tagline: choice.tagline,
      backstory: `${scenario.premise} ${choice.text}`,
      avatarIcon: choice.avatar,
      colors: {
        primary: choice.color,
        secondary: '#000000',
        accent: '#FFFFFF'
      },
      level: 1,
      xp: 0,
      xpToNextLevel: BASE_XP_TO_NEXT_LEVEL,
      statPointsAvailable: 0,
      stats: {
        strength: 13,
        agility: 13,
        intellect: 13,
        fortitude: 14,
        willpower: 14,
        charisma: 13
      },
      baseHp: 160,
      currentHp: 160,
      maxHp: 160,
      baseEnergy: 100,
      currentEnergy: 100,
      maxEnergy: 100,
      superMeter: 0,
      armor: 12,
      reputation: 60,
      publicApproval: 80,
      identitySuspicion: 5,
      alignment: 'Golden Age Paragon',
      alignmentScore: 60,
      money: 1200,
      heroTokens: 5,
      powers: heroPowers,
      equippedPowers: heroPowers.map(p => p.id),
      inventory: [],
      sidekicks: [RECRUITABLE_SIDEKICKS[0]],
      activeSidekickId: 'sidekick-spark',
      milestones: DEFAULT_CIVILIAN_MILESTONES,
      job: { ...job },
      stress: 10,
      allianceId: undefined,
      isCustom: true
    };

    onHeroCreated(hero);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-comic text-4xl sm:text-5xl text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] tracking-wider">
          ORIGIN STORY CHRONICLES
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Make pivotal decisions during fateful comic origin incidents to forge your destiny!
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.title}
            onClick={() => {
              sound.playClick();
              setSelectedScenarioIdx(i);
              setSelectedChoiceIdx(0);
              narrateScenario(sc);
            }}
            className={`px-4 py-2 rounded-xl border-2 border-black font-bold text-xs sm:text-sm shadow-comic transition-all ${
              selectedScenarioIdx === i
                ? 'bg-yellow-400 text-black scale-105'
                : 'bg-[#151928] text-gray-300 hover:bg-[#1E243A]'
            }`}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Narrative Card */}
      <div className="bg-[#151928] p-6 sm:p-8 rounded-2xl border-3 border-black shadow-comic space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400">
              ORIGIN: {scenario.origin}
            </span>
            <span className="text-xs text-gray-400">Fateful Incident Arc</span>
          </div>
          <h2 className="font-comic text-3xl text-yellow-400">{scenario.title}</h2>
          <p className="text-base text-gray-300 mt-2 bg-[#0D101A] p-4 rounded-xl border-2 border-black leading-relaxed">
            "{scenario.premise}"
          </p>
        </div>

        {/* Branching Choices */}
        <div>
          <h3 className="font-comic text-xl text-yellow-300 mb-3">Choose Your Heroic Response:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenario.choices.map((c, idx) => (
              <div
                key={c.heroName}
                onClick={() => {
                  sound.playClick();
                  setSelectedChoiceIdx(idx);
                }}
                className={`p-4 rounded-xl border-3 border-black cursor-pointer transition-all flex flex-col justify-between ${
                  selectedChoiceIdx === idx
                    ? 'bg-gradient-to-br from-yellow-950/70 to-[#101321] border-yellow-400 shadow-comic scale-[1.02]'
                    : 'bg-[#101321] hover:bg-[#191D30]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-2xl shadow-comic"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.avatar}
                    </div>
                    <div>
                      <h4 className="font-comic text-lg text-yellow-400">{c.heroName}</h4>
                      <p className="text-xs text-gray-400">Alias: {c.alias}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 italic mb-3">"{c.text}"</p>
                </div>

                <div className="border-t border-gray-700 pt-2 text-[11px] font-bold text-cyan-400 flex items-center justify-between">
                  <span>{c.statBonus}</span>
                  {selectedChoiceIdx === idx && <CheckCircle2 size={16} className="text-yellow-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border-2 border-black font-bold text-sm shadow-comic flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Main Menu
          </button>

          <button
            onClick={handleLaunch}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-xl rounded-xl border-3 border-black shadow-comic flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Swords size={20} /> BEGIN YOUR SAGA
          </button>
        </div>
      </div>
    </div>
  );
};
