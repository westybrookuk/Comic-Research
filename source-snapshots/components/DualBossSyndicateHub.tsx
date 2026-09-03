import React, { useState } from 'react';
import { 
  Skull, 
  Swords, 
  Zap, 
  Shield, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Users, 
  Award,
  DollarSign,
  Activity
} from 'lucide-react';
import { HeroCharacter, VillainCharacter, CrimeEncounter } from '../types/game';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DualBossSyndicateHubProps {
  playerHero: HeroCharacter;
  villains: VillainCharacter[];
  onUpdateHero: (updated: HeroCharacter) => void;
  onStartCombat: (encounter: CrimeEncounter) => void;
}

interface DualBossPair {
  id: string;
  title: string;
  codename: string;
  villain1: { name: string; avatar: string; role: string; hp: number; attack: number; power: string };
  villain2: { name: string; avatar: string; role: string; hp: number; attack: number; power: string };
  synergyAttack: { name: string; damage: number; description: string };
  threatLevel: 'Omega-Level' | 'Apocalyptic' | 'Critical Crisis';
  rewardMoney: number;
  rewardXp: number;
  rewardTokens: number;
  lore: string;
  cleared: boolean;
}

export const DualBossSyndicateHub: React.FC<DualBossSyndicateHubProps> = ({
  playerHero,
  villains,
  onUpdateHero,
  onStartCombat
}) => {
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  const [dualBosses, setDualBosses] = useState<DualBossPair[]>([
    {
      id: 'dual-pyre-void',
      title: 'Molten Singularity Convergence',
      codename: 'OPERATION: PYRO-VOID ECLIPSE',
      villain1: { name: 'Queen Pyre', avatar: '🔥', role: 'Molten Pyrokinetic Empress', hp: 380, attack: 45, power: 'Magma Cataclysm' },
      villain2: { name: 'Null Void', avatar: '🕳️', role: 'Singularity Cosmic Mastermind', hp: 420, attack: 50, power: 'Event Horizon Tear' },
      synergyAttack: {
        name: 'Molten Singularity Black Hole Blast',
        damage: 120,
        description: 'Queen Pyre infuses Null Void’s gravitic singularity with superheated plasma, collapsing space and dealing massive AoE damage.'
      },
      threatLevel: 'Omega-Level',
      rewardMoney: 1500,
      rewardXp: 800,
      rewardTokens: 4,
      lore: 'Interception reports confirm Queen Pyre and Null Void have formed an apocalyptic pact. Their combined particle energies threaten to incinerate Metro Nova’s core.',
      cleared: false
    },
    {
      id: 'dual-mega-cyber',
      title: 'High-Voltage EMP Cyber-Plague',
      codename: 'OPERATION: BLACKOUT PROTOCOL',
      villain1: { name: 'Doctor Megawatt', avatar: '⚡', role: 'High-Voltage Galvanic Tyrant', hp: 320, attack: 40, power: 'Tesla Arc Overload' },
      villain2: { name: 'Cyber-Shade', avatar: '🤖', role: 'Neural Nanotech Infiltrator', hp: 350, attack: 42, power: 'Systemic Malware Drain' },
      synergyAttack: {
        name: 'Gigawatt Neural Shockwave',
        damage: 95,
        description: 'Megawatt channels millions of volts directly into Cyber-Shade’s nanite cloud, frying all electronic suits and stunning targets.'
      },
      threatLevel: 'Critical Crisis',
      rewardMoney: 1200,
      rewardXp: 650,
      rewardTokens: 3,
      lore: 'The power grid and defense mainframes across Sector 2 have been seized. Emergency containment protocols are immediately required.',
      cleared: false
    }
  ]);

  const currentPair = dualBosses[selectedPairIdx] || dualBosses[0];

  const handleLaunchDualBossRaid = (pair: DualBossPair) => {
    if (playerHero.currentEnergy < 35) {
      sound.playAlarm();
      setMessage('⚠️ Engaging a Dual-Boss Syndicate Incursion requires 35 AP.');
      return;
    }

    sound.playSuper();
    const updatedHero = {
      ...playerHero,
      currentEnergy: playerHero.currentEnergy - 35
    };
    onUpdateHero(updatedHero);

    const dualEncounter: CrimeEncounter = {
      id: `dual-${pair.id}-${Date.now()}`,
      title: `SYN-DUAL INCURSION: ${pair.title}`,
      description: pair.lore,
      severity: 'Catastrophic',
      districtId: 'district-financial',
      enemies: [
        {
          name: pair.villain1.name,
          hp: pair.villain1.hp,
          maxHp: pair.villain1.hp,
          attack: pair.villain1.attack,
          defense: 25,
          speed: 18,
          powers: [pair.villain1.power, 'Syndicate Combo Strike'],
          isBoss: true,
          avatar: pair.villain1.avatar
        },
        {
          name: pair.villain2.name,
          hp: pair.villain2.hp,
          maxHp: pair.villain2.hp,
          attack: pair.villain2.attack,
          defense: 30,
          speed: 20,
          powers: [pair.villain2.power, pair.synergyAttack.name],
          isBoss: true,
          avatar: pair.villain2.avatar
        }
      ],
      rewards: {
        xp: pair.rewardXp,
        money: pair.rewardMoney,
        approval: 15,
        heroTokens: pair.rewardTokens
      }
    };

    onStartCombat(dualEncounter);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-comic text-2xl sm:text-3xl text-yellow-400 flex items-center gap-2">
            <Skull className="text-red-500 animate-pulse" /> SINISTER SYNDICATE DUAL-BOSS INCURSIONS
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Confront coordinated supervillain alliances in tag-team battles with dual health bars and devastating double-team synergy strikes!
          </p>
        </div>

        <div className="flex bg-[#0D101A] p-1 rounded-xl border-2 border-black">
          {dualBosses.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick();
                setSelectedPairIdx(idx);
                setMessage(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                selectedPairIdx === idx ? 'bg-red-600 text-white shadow-comic' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{p.villain1.avatar}</span>
              <span>+</span>
              <span>{p.villain2.avatar}</span>
              <span className="hidden sm:inline font-comic">{p.title.split(' ')[0]}</span>
            </button>
          ))}
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

      {/* Main Dual Incursion Stage */}
      <div className="bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
              {currentPair.codename} // {currentPair.threatLevel}
            </span>
            <h3 className="font-comic text-3xl text-yellow-400">{currentPair.title}</h3>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-950 text-green-300 font-mono font-bold text-xs rounded-xl border border-green-700">
              Reward: +${currentPair.rewardMoney}
            </span>
            <span className="px-3 py-1 bg-yellow-950 text-yellow-300 font-mono font-bold text-xs rounded-xl border border-yellow-700">
              +{currentPair.rewardTokens} Hero Tokens
            </span>
          </div>
        </div>

        {/* Dual Boss Clash Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Boss 1 */}
          <div className="bg-gradient-to-br from-red-950/80 to-[#101321] p-5 rounded-2xl border-3 border-red-500 shadow-comic space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-black/60 rounded-xl border border-red-500">{currentPair.villain1.avatar}</span>
              <div>
                <h4 className="font-comic text-2xl text-red-400">{currentPair.villain1.name}</h4>
                <div className="text-xs text-gray-300 font-bold">{currentPair.villain1.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold pt-2 border-t border-red-900/60">
              <span className="text-gray-300">HP: <strong className="text-red-400">{currentPair.villain1.hp}</strong></span>
              <span className="text-gray-300">Attack: <strong className="text-yellow-400">{currentPair.villain1.attack}</strong></span>
            </div>
            <div className="text-xs text-yellow-300 bg-black/40 p-2 rounded-lg border border-red-900">
              Signature: {currentPair.villain1.power}
            </div>
          </div>

          {/* Boss 2 */}
          <div className="bg-gradient-to-br from-purple-950/80 to-[#101321] p-5 rounded-2xl border-3 border-purple-500 shadow-comic space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-black/60 rounded-xl border border-purple-500">{currentPair.villain2.avatar}</span>
              <div>
                <h4 className="font-comic text-2xl text-purple-400">{currentPair.villain2.name}</h4>
                <div className="text-xs text-gray-300 font-bold">{currentPair.villain2.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold pt-2 border-t border-purple-900/60">
              <span className="text-gray-300">HP: <strong className="text-purple-400">{currentPair.villain2.hp}</strong></span>
              <span className="text-gray-300">Attack: <strong className="text-yellow-400">{currentPair.villain2.attack}</strong></span>
            </div>
            <div className="text-xs text-yellow-300 bg-black/40 p-2 rounded-lg border border-purple-900">
              Signature: {currentPair.villain2.power}
            </div>
          </div>
        </div>

        {/* Synergy Finisher Info */}
        <div className="bg-gradient-to-r from-red-950/60 via-black to-purple-950/60 p-4 rounded-2xl border-2 border-red-400 shadow-comic space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Flame size={16} /> CO-OP SYNERGY FINISHER: {currentPair.synergyAttack.name}
            </span>
            <span className="text-xs font-mono font-bold text-yellow-400">
              ~{currentPair.synergyAttack.damage} AoE Damage
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {currentPair.synergyAttack.description}
          </p>
        </div>

        {/* Launch Raid Command */}
        <button
          onClick={() => handleLaunchDualBossRaid(currentPair)}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-comic text-2xl font-black rounded-2xl border-3 border-black shadow-comic flex items-center justify-center gap-3 hover:scale-101 transition-transform"
        >
          <Swords size={24} /> ENGAGE DUAL-BOSS BATTLE (35 AP)
        </button>
      </div>
    </div>
  );
};
