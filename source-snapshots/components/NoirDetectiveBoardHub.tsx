import React, { useMemo, useState } from 'react';
import { 
  Search, 
  MapPin, 
  FileText, 
  Mic, 
  DollarSign, 
  FlaskConical, 
  Users, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  RotateCcw,
  Compass,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  HeroCharacter, 
  VillainCharacter, 
  District, 
  DetectiveClue, 
  DetectiveYarnConnection, 
  SyndicateConspiracyCase,
  NoirDetectiveProgress,
  HubProgressUpdater
} from '../types/game';
import { sound } from '../utils/audio';
import { applyRewards } from '../utils/progression';
import confetti from 'canvas-confetti';

interface NoirDetectiveBoardHubProps {
  playerHero: HeroCharacter;
  villains: VillainCharacter[];
  districts: District[];
  progress: NoirDetectiveProgress;
  onUpdateProgress: HubProgressUpdater<'noirDetective'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

const INITIAL_CONSPIRACY_CASE: SyndicateConspiracyCase = {
  id: 'case-shadow-cabal',
  title: 'Operation Nightfall: The Underground Syndicate Web',
  mastermindVillainId: 'villain-dr-polaris',
  mastermindName: 'Dr. Magneto Polaris',
  leadNarrative: 'A labyrinth of offshore dummy corporations and corrupted GCPD supply manifests point to a catastrophic grid sabotage plot.',
  rewardXp: 280,
  rewardMoney: 650,
  rewardTokens: 2,
  solved: false,
  clues: [
    {
      id: 'clue-1',
      title: 'Corrupt Harbor Manifest',
      category: 'FinancialRecord',
      district: 'Industrial Waterfront',
      description: 'Shipment #8812 listed as "agricultural fertilizer" was loaded with military-grade tachyon coils.',
      pinnedX: 20,
      pinnedY: 25,
      photoEmoji: '📦',
      isKeyEvidence: true,
      discovered: true
    },
    {
      id: 'clue-2',
      title: 'Intercepted Burner Audio',
      category: 'Wiretap',
      district: 'Neon Boulevard',
      description: '"The boss wants the substation blackout timed precisely at midnight on the 15th."',
      pinnedX: 45,
      pinnedY: 18,
      photoEmoji: '🎙️',
      isKeyEvidence: true,
      discovered: true
    },
    {
      id: 'clue-3',
      title: 'Mutagenic Residue Sample',
      category: 'ForensicSample',
      district: 'Downtown Core',
      description: 'Heavy isotope traces found on the vault door matching Dr. Polaris private laboratory.',
      pinnedX: 75,
      pinnedY: 30,
      photoEmoji: '🧪',
      isKeyEvidence: true,
      discovered: true
    },
    {
      id: 'clue-4',
      title: 'Undercover Informant Tip',
      category: 'Suspect',
      district: 'Old Town Heritage',
      description: 'The mob enforcer "Iron Jack" met a mystery scientist in an abandoned subway station.',
      pinnedX: 30,
      pinnedY: 65,
      photoEmoji: '🕵️',
      isKeyEvidence: false,
      discovered: true
    },
    {
      id: 'clue-5',
      title: 'Substation Blueprint Cache',
      category: 'CrimeScene',
      district: 'Financial District',
      description: 'Marked schematics detailing the primary cooling intake for Metro Nova Central Reactor.',
      pinnedX: 65,
      pinnedY: 68,
      photoEmoji: '🗺️',
      isKeyEvidence: true,
      discovered: true
    }
  ],
  connections: [
    { id: 'conn-1', fromClueId: 'clue-1', toClueId: 'clue-2', color: '#EF4444', label: 'Funded Blackout' },
    { id: 'conn-2', fromClueId: 'clue-2', toClueId: 'clue-5', color: '#EF4444', label: 'Target Selected' }
  ]
};

export const NoirDetectiveBoardHub: React.FC<NoirDetectiveBoardHubProps> = ({
  playerHero,
  villains,
  districts,
  progress,
  onUpdateProgress,
  onUpdateHero
}) => {
  // The static case content comes from the preset; only the player's yarn connections and
  // the solved flag are persisted. Progress for a different case id is ignored (fresh board).
  const savedForThisCase = progress.caseId === INITIAL_CONSPIRACY_CASE.id;
  const activeCase = useMemo<SyndicateConspiracyCase>(() => ({
    ...INITIAL_CONSPIRACY_CASE,
    solved: savedForThisCase ? progress.solved : INITIAL_CONSPIRACY_CASE.solved,
    connections: savedForThisCase
      ? [...INITIAL_CONSPIRACY_CASE.connections, ...progress.connections]
      : INITIAL_CONSPIRACY_CASE.connections
  }), [savedForThisCase, progress.solved, progress.connections]);

  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [pinnedFilter, setPinnedFilter] = useState<'All' | 'Suspect' | 'Forensic' | 'Wiretap'>('All');
  const [isDeducing, setIsDeducing] = useState<boolean>(false);
  const [deductionMessage, setDeductionMessage] = useState<string | null>(null);

  const selectedClue = activeCase.clues.find(c => c.id === selectedClueId);

  const handleConnectClues = (targetClueId: string) => {
    if (!selectedClueId || selectedClueId === targetClueId) return;

    sound.playClick();
    const existing = activeCase.connections.find(
      c => (c.fromClueId === selectedClueId && c.toClueId === targetClueId) ||
           (c.fromClueId === targetClueId && c.toClueId === selectedClueId)
    );

    if (!existing) {
      const newConn: DetectiveYarnConnection = {
        id: `conn-${Date.now()}`,
        fromClueId: selectedClueId,
        toClueId: targetClueId,
        color: '#DC2626',
        label: 'Linked Evidence'
      };
      onUpdateProgress(prev => ({
        caseId: INITIAL_CONSPIRACY_CASE.id,
        solved: prev.caseId === INITIAL_CONSPIRACY_CASE.id ? prev.solved : false,
        connections: [...(prev.caseId === INITIAL_CONSPIRACY_CASE.id ? prev.connections : []), newConn]
      }));
    }
    setSelectedClueId(null);
  };

  const handleExecuteMasterDeduction = () => {
    if (activeCase.solved || isDeducing) return;

    sound.playSuper();
    setIsDeducing(true);

    setTimeout(() => {
      sound.playVictory();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      const { hero: updated } = applyRewards(playerHero, {
        xp: activeCase.rewardXp,
        money: activeCase.rewardMoney,
        heroTokens: activeCase.rewardTokens,
        approval: 8
      });
      onUpdateHero(updated);

      onUpdateProgress(prev => ({
        caseId: INITIAL_CONSPIRACY_CASE.id,
        solved: true,
        connections: prev.caseId === INITIAL_CONSPIRACY_CASE.id ? prev.connections : []
      }));
      setIsDeducing(false);
      setDeductionMessage(`🎯 CASE CRACKED! Mastermind ${activeCase.mastermindName} syndicate ring fully exposed! Gained +${activeCase.rewardXp} XP, +$${activeCase.rewardMoney}, and +${activeCase.rewardTokens} Hero Tokens!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 1. TOP NOIR DETECTIVE HEADER */}
      <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-slate-950 p-6 rounded-3xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            <Search size={16} className="text-amber-400" />
            <span>VIGILANTE INVESTIGATION // STRING & PIN CONSPIRACY WEB</span>
          </div>
          <h2 className="font-comic text-3xl sm:text-4xl text-white font-black tracking-wide drop-shadow-[2px_2px_0px_#000]">
            NOIR DETECTIVE CLUE BOARD
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            Pin forensic samples, intercepted wiretaps, and suspect photos to your corkboard. Connect red yarn to expose the mastermind’s syndicate ring before they execute their masterplan!
          </p>
        </div>

        {/* Case Status Badge */}
        <div className="bg-black/60 p-3 rounded-2xl border-2 border-black/80 shadow-comic shrink-0 text-xs">
          <div className="text-[10px] font-mono text-gray-400 font-bold uppercase">CASE STATUS</div>
          <div className={`font-comic text-lg font-bold flex items-center gap-1.5 ${
            activeCase.solved ? 'text-green-400' : 'text-yellow-400 animate-pulse'
          }`}>
            {activeCase.solved ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
            <span>{activeCase.solved ? 'CRACKED & DISMANTLED' : 'ACTIVE CONSPIRACY'}</span>
          </div>
        </div>
      </div>

      {/* Deduction Success Alert */}
      {deductionMessage && (
        <div className="bg-yellow-400 p-4 rounded-2xl border-4 border-black shadow-comic text-black font-comic text-lg font-bold animate-pow flex items-center justify-between">
          <span>{deductionMessage}</span>
          <button
            onClick={() => setDeductionMessage(null)}
            className="px-3 py-1 bg-black text-yellow-400 rounded-lg text-xs uppercase"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* 2. THE CORKBOARD (PINNED EVIDENCE & RED YARN WEB) */}
      <div className="bg-[#2D1F13] p-6 sm:p-8 rounded-3xl border-8 border-[#4A3525] shadow-comic-lg relative overflow-hidden min-h-[460px]">
        {/* Cork Texture Simulation Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#5C4033_1px,transparent_1px)] [background-size:8px_8px] opacity-40 pointer-events-none" />

        {/* Board Header Tape */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="px-4 py-1.5 bg-yellow-100 text-black font-comic text-xl font-bold uppercase transform -rotate-1 shadow-md border border-gray-400">
            📌 {activeCase.title}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExecuteMasterDeduction}
              disabled={activeCase.solved || isDeducing}
              className={`px-5 py-2.5 rounded-xl border-3 border-black font-comic text-base shadow-comic flex items-center gap-2 transition-transform ${
                activeCase.solved
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 cursor-pointer animate-pulse font-black'
              }`}
            >
              <Zap size={18} />
              <span>{activeCase.solved ? 'CASE CONCLUDED' : isDeducing ? 'ANALYZING THREADS...' : 'SOLVE DEDUCTION MATRIX'}</span>
            </button>
          </div>
        </div>

        {/* Clues Scattered Across Corkboard */}
        <div className="relative min-h-[340px] z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {activeCase.clues.map(clue => {
            const isSelected = clue.id === selectedClueId;

            return (
              <div
                key={clue.id}
                onClick={() => {
                  if (selectedClueId && selectedClueId !== clue.id) {
                    handleConnectClues(clue.id);
                  } else {
                    sound.playClick();
                    setSelectedClueId(isSelected ? null : clue.id);
                  }
                }}
                className={`p-3.5 rounded-xl border-3 border-black cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-yellow-300 text-black scale-105 shadow-comic-lg ring-4 ring-red-500'
                    : clue.isKeyEvidence
                    ? 'bg-amber-50 text-black hover:scale-102 shadow-comic'
                    : 'bg-stone-200 text-black hover:scale-102 shadow-comic'
                }`}
                style={{ transform: `rotate(${((clue.pinnedX % 6) - 3)}deg)` }}
              >
                {/* Red Pushpin Icon */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-black shadow-sm" />

                <div>
                  <div className="flex items-center justify-between mb-1 pt-1">
                    <span className="text-2xl">{clue.photoEmoji}</span>
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 bg-black text-white rounded">
                      {clue.category}
                    </span>
                  </div>
                  <h4 className="font-comic text-sm font-black leading-tight mb-1">
                    {clue.title}
                  </h4>
                  <p className="text-[11px] text-gray-800 leading-snug line-clamp-3">
                    {clue.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-black/30 text-[9px] font-mono font-bold text-gray-700 flex items-center justify-between">
                  <span>📍 {clue.district}</span>
                  {clue.isKeyEvidence && <span className="text-red-700 font-black">★ PRIME CLUE</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Red Yarn Connections Summary Bar */}
        <div className="mt-6 pt-4 border-t border-black/40 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-100 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span>Active Yarn Threads: {activeCase.connections.length} Connected Leads</span>
          </div>
          <div>
            Click a pinned clue, then click another clue to string red yarn between suspects & crime locations!
          </div>
        </div>
      </div>
    </div>
  );
};
