import React, { useMemo, useState } from 'react';
import { 
  Crown, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Flame, 
  BookOpen, 
  Star, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  Landmark
} from 'lucide-react';
import { HeroCharacter, GenerationalLegacyRecord, HallOfFameProgress, HubProgressUpdater } from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { applyRewards } from '../utils/progression';
import confetti from 'canvas-confetti';

interface MantleLegacyHallOfFameProps {
  playerHero: HeroCharacter;
  progress: HallOfFameProgress;
  onUpdateProgress: HubProgressUpdater<'hallOfFame'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

const INDUCTION_REWARDS = { xp: 1000, heroTokens: 5, money: 5000, approval: 10 } as const;

const DEFAULT_DYNASTY: GenerationalLegacyRecord[] = [
  {
    generation: 1,
    heroAlias: 'Apex Prime (The Founder)',
    civilianName: 'Jonathan Sterling Vance',
    origin: 'Cosmic Awakening',
    reignYears: '1985 – 2005 (20 Years of Vigilance)',
    totalCrimesSolved: 342,
    villainsJailed: 28,
    finalRank: 'Living Legend (S+)',
    statueLocation: 'Central Memorial Plaza, Metro Nova',
    signaturePower: 'Solar Supernova Blast',
    heirloomLeft: 'Ring of the Golden Sun (+15 Fortitude)',
    dateArchived: '2005-09-12'
  },
  {
    generation: 2,
    heroAlias: 'Vanguard Titan (The Rebuilder)',
    civilianName: 'Marcus Alexander Kane',
    origin: 'High-Tech Prodigy',
    reignYears: '2006 – 2024 (18 Years of Vigilance)',
    totalCrimesSolved: 289,
    villainsJailed: 22,
    finalRank: 'Grand Paragon (S)',
    statueLocation: 'S.T.A.R. Labs Memorial Gardens',
    signaturePower: 'Nanotech Hyper-Armor',
    heirloomLeft: 'Chronometer Tachyon Aegis (+20 Armor)',
    dateArchived: '2024-04-18'
  }
];

export const MantleLegacyHallOfFame: React.FC<MantleLegacyHallOfFameProps> = ({
  playerHero,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  // The founding generations are static lore; player inductions are persisted and appended.
  const dynasty = useMemo<GenerationalLegacyRecord[]>(
    () => [...DEFAULT_DYNASTY, ...progress.inductedRecords],
    [progress.inductedRecords]
  );
  const [selectedGenIdx, setSelectedGenIdx] = useState<number>(0);
  const [successionMessage, setSuccessionMessage] = useState<string | null>(null);

  const activeGen = dynasty[selectedGenIdx] || dynasty[0];

  // Each hero can be immortalized once. A successor (new hero id after passing the torch) may be inducted again.
  const alreadyInducted = progress.inductedRecords.some(r => r.inductedHeroId === playerHero.id);

  const handleInductCurrentHeroToHallOfFame = () => {
    if (alreadyInducted) {
      sound.playAlarm();
      setSuccessionMessage(`👑 ${playerHero.heroName} already stands in the Hall of Heroes. Pass the mantle to a successor to add the next generation.`);
      return;
    }

    sound.playLevelUp();
    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}

    const newGenRecord: GenerationalLegacyRecord = {
      inductedHeroId: playerHero.id,
      generation: dynasty.length + 1,
      heroAlias: `${playerHero.heroName} (The Sovereign)`,
      civilianName: playerHero.civilianName,
      origin: playerHero.origin,
      reignYears: `2024 – Present (Level ${playerHero.level} Hero)`,
      totalCrimesSolved: 150 + playerHero.level * 15,
      villainsJailed: 6 + Math.floor(playerHero.level / 2),
      finalRank: playerHero.level > 10 ? 'Living Legend (S+)' : 'Grand Paragon (S)',
      statueLocation: 'Metro Hall of Heroes Rotunda',
      signaturePower: playerHero.powers[0]?.name || 'Kinetic Solar Strike',
      heirloomLeft: 'Vanguard Sovereign Crest (+25 All Stats)',
      dateArchived: new Date().toISOString().split('T')[0]
    };

    onUpdateProgress(prev => ({ inductedRecords: [...prev.inductedRecords, newGenRecord] }));
    setSelectedGenIdx(dynasty.length);

    // Grant Legacy buffs to the player hero
    const { hero: updated } = applyRewards(playerHero, INDUCTION_REWARDS);
    onUpdateHero(updated);

    narratorTts.speak(`Mantle Succession Immortalized! ${playerHero.heroName} has been permanently inducted into the Hall of Heroes as Generation ${dynasty.length + 1}!`, 'golden_age');

    setSuccessionMessage(`👑 SUCCESSION IMMORTALIZED: ${playerHero.heroName} inducted as Generation #${dynasty.length + 1}! +1,000 XP, +5 Tokens, +$5,000 Legacy Trust Fund!`);
    setTimeout(() => setSuccessionMessage(null), 6000);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#151928] to-yellow-950 p-6 rounded-2xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-400 text-black border-2 border-black rounded-lg text-xs font-black tracking-widest shadow-comic uppercase flex items-center gap-1.5">
              <Crown size={14} /> DYNASTIC HALL OF HEROES
            </span>
            <span className="text-xs font-bold text-yellow-300">
              {dynasty.length} Hero Generations Immortalized
            </span>
          </div>
          <h2 className="text-3xl font-black font-comic tracking-wider text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1">
            MANTLE LEGACY HALL OF FAME
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mt-1">
            Celebrate the unbroken lineage of guardians defending Metro Nova across decades! Review ancestral statues, claim mentor heirlooms, and immortalize the current generation into legend!
          </p>
        </div>

        <button
          onClick={handleInductCurrentHeroToHallOfFame}
          disabled={alreadyInducted}
          className={`px-5 py-3 font-comic text-base font-black rounded-2xl border-3 border-black shadow-comic flex items-center gap-2 shrink-0 transition-transform ${
            alreadyInducted
              ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:scale-105 text-black active:scale-95'
          }`}
        >
          <Crown size={18} className={alreadyInducted ? '' : 'fill-black'} /> {alreadyInducted ? 'MANTLE IMMORTALIZED ✓' : 'IMMORTALIZE MANTLE ➔'}
        </button>
      </div>

      {successionMessage && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-400 rounded-xl text-xs sm:text-sm text-emerald-200 font-bold flex items-center justify-between shadow-comic animate-fadeIn">
          <span>{successionMessage}</span>
          <button onClick={() => setSuccessionMessage(null)} className="text-white hover:text-yellow-400 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Main Pedigree Wall & Plaque View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Generational Timeline Selector (4 Cols) */}
        <div className="lg:col-span-4 bg-[#151928] border-3 border-black rounded-2xl p-5 shadow-comic space-y-3">
          <h3 className="text-sm font-mono font-black text-yellow-400 uppercase tracking-widest border-b border-gray-800 pb-2.5">
            🏛️ GENERATIONAL DYNASTY LINEAGE
          </h3>

          <div className="space-y-2.5">
            {dynasty.map((record, idx) => (
              <div
                key={record.generation}
                onClick={() => {
                  sound.playClick();
                  setSelectedGenIdx(idx);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedGenIdx === idx
                    ? 'bg-yellow-950/80 border-yellow-400 shadow-comic scale-102'
                    : 'bg-[#101422] border-black hover:border-gray-600'
                }`}
              >
                <div>
                  <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] font-black uppercase rounded font-mono">
                    GEN #{record.generation}
                  </span>
                  <h4 className="font-comic font-black text-sm text-yellow-300 mt-1 leading-tight">
                    {record.heroAlias}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                    {record.reignYears}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-amber-400">
                  {record.finalRank.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Deluxe Bronze Memorial Statue & Plaque (8 Cols) */}
        <div className="lg:col-span-8 bg-[#201a14] border-4 border-amber-900/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6">
          {/* Bronze Plaque Header */}
          <div className="border-b-2 border-amber-900/60 pb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="px-3 py-1 bg-amber-600 text-black font-comic font-black text-xs uppercase rounded border border-black shadow-comic">
                OFFICIAL MEMORIAL STATUE • GENERATION {activeGen.generation}
              </span>
              <h2 className="text-3xl font-black font-comic text-amber-200 mt-2">
                {activeGen.heroAlias}
              </h2>
              <p className="text-xs font-mono text-amber-300/80 mt-0.5">
                Civilian Identity: {activeGen.civilianName} • Origin: {activeGen.origin}
              </p>
            </div>

            <span className="px-3 py-1 bg-yellow-400 text-black font-comic font-black text-xs rounded border border-black">
              {activeGen.finalRank}
            </span>
          </div>

          {/* Central Memorial Inscription Card */}
          <div className="bg-black/60 border-2 border-amber-900/60 rounded-xl p-5 space-y-3 shadow-inner">
            <h4 className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Landmark size={15} /> Monument Inscription & Location:
            </h4>
            <p className="text-sm font-comic text-gray-200 italic leading-relaxed">
              "Erected with eternal gratitude at {activeGen.statueLocation}. Dedicated to the guardian whose courage shielded Metro Nova from the darkest villain incursions."
            </p>
          </div>

          {/* Historical Legacy Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#101422] p-3 rounded-xl border border-gray-800 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Crimes Thwarted</span>
              <strong className="font-comic text-xl text-yellow-400">{activeGen.totalCrimesSolved}</strong>
            </div>
            <div className="bg-[#101422] p-3 rounded-xl border border-gray-800 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Bosses Jailed</span>
              <strong className="font-comic text-xl text-cyan-400">{activeGen.villainsJailed}</strong>
            </div>
            <div className="bg-[#101422] p-3 rounded-xl border border-gray-800 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Signature Power</span>
              <strong className="font-comic text-xs text-yellow-300 block truncate mt-1">{activeGen.signaturePower}</strong>
            </div>
            <div className="bg-[#101422] p-3 rounded-xl border border-gray-800 text-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase block">Heirloom Relic</span>
              <strong className="font-comic text-xs text-emerald-400 block truncate mt-1">{activeGen.heirloomLeft}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
