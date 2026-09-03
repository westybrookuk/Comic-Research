import React, { useMemo, useState } from 'react';
import { 
  Scale, 
  Gavel, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Users, 
  Flame, 
  ShieldAlert, 
  RotateCcw,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  HeroCharacter, 
  VillainCharacter, 
  CourtroomEvidenceItem, 
  DefenseAttorneyObjection, 
  CourtroomTrialCase,
  CourtroomProgress,
  HubProgressUpdater
} from '../types/game';
import { sound } from '../utils/audio';
import { applyRewards } from '../utils/progression';
import confetti from 'canvas-confetti';

interface CourtroomTrialHubProps {
  playerHero: HeroCharacter;
  villains?: VillainCharacter[];
  progress: CourtroomProgress;
  onUpdateProgress: HubProgressUpdater<'courtroom'>;
  onUpdateHero: (updated: HeroCharacter) => void;
  onUpdateVillains?: (villains: VillainCharacter[]) => void;
}

const VERDICT_REWARDS = { xp: 300, money: 500, approval: 10, heroTokens: 2 } as const;

const PRESET_TRIAL_CASE: CourtroomTrialCase = {
  id: 'trial-polaris-01',
  villainId: 'villain-dr-polaris',
  villainName: 'Dr. Magneto Polaris',
  crimeCharges: [
    'Treason against Metro Nova Municipal Grid',
    'Mass Endangerment via Magnetic Pulse Substation Detonation',
    'Unlawful Possession of Weaponized Tachyon Coils'
  ],
  judgeName: 'Chief Justice Vance Sterling',
  juryFavorPct: 45,
  currentObjectionIdx: 0,
  isConcluded: false,
  evidenceList: [
    {
      id: 'ev-1',
      name: 'Tachyon Coil Forensic Residue',
      type: 'Forensic',
      relevanceScore: 95,
      description: 'Micro-spectrometry scans proving the isotope matched Polaris personal laboratory centrifuge.',
      icon: '🧪',
      presented: false
    },
    {
      id: 'ev-2',
      name: 'Substation Surveillance Blackbox',
      type: 'VideoRecord',
      relevanceScore: 90,
      description: 'Time-stamped 4K rooftop feed capturing Polaris disabling the emergency coolant valves.',
      icon: '📹',
      presented: false
    },
    {
      id: 'ev-3',
      name: 'Syndicate Offshore Ledger',
      type: 'Financial',
      relevanceScore: 85,
      description: 'Encrypted Cayman bank accounts paying $4.2M to corrupt harbor logistics dockmasters.',
      icon: '💳',
      presented: false
    },
    {
      id: 'ev-4',
      name: 'Eyewitness Power Technician Testimony',
      type: 'Witness',
      relevanceScore: 80,
      description: 'Sworn affidavit from the chief engineer whom Polaris threatened with magnetic levitation.',
      icon: '🗣️',
      presented: false
    }
  ],
  objections: [
    {
      id: 'obj-1',
      attorneyName: 'Defense Attorney Richard Vance',
      statement: '"Your Honor! The prosecution has zero concrete physical proof linking my client to the explosive residue at the substation!"',
      objectionCounterType: 'Forensic',
      correctEvidenceId: 'ev-1',
      narrativeRefutation: 'OBJECTION OVERRULED! The Tachyon isotope matches Polaris registered quantum patent signature uniquely!',
      isOverruled: false
    },
    {
      id: 'obj-2',
      attorneyName: 'Defense Attorney Richard Vance',
      statement: '"My client was never at the scene! He was attending a charity gala downtown during the blackout!"',
      objectionCounterType: 'VideoRecord',
      correctEvidenceId: 'ev-2',
      narrativeRefutation: 'TAKE THAT! The blackbox surveillance feed clearly identifies Polaris levitating in the generator room at 00:04 AM!',
      isOverruled: false
    },
    {
      id: 'obj-3',
      attorneyName: 'Defense Attorney Richard Vance',
      statement: '"Even if he was nearby, there is no proof of premeditated funding or criminal conspiracy!"',
      objectionCounterType: 'Financial',
      correctEvidenceId: 'ev-3',
      narrativeRefutation: 'HOLD IT! The offshore ledger records a direct wire transfer to buy the sabotage coils 48 hours prior!',
      isOverruled: false
    }
  ]
};

export const CourtroomTrialHub: React.FC<CourtroomTrialHubProps> = ({
  playerHero,
  villains = [],
  progress,
  onUpdateProgress,
  onUpdateHero,
  onUpdateVillains
}) => {
  // Static case content lives in the preset; only trial *progress* is persisted.
  // Progress saved for a different case id is ignored so the player starts this case fresh.
  const savedForThisCase = progress.caseId === PRESET_TRIAL_CASE.id;
  const trialCase = useMemo<CourtroomTrialCase>(() => {
    if (!savedForThisCase) return PRESET_TRIAL_CASE;
    return {
      ...PRESET_TRIAL_CASE,
      juryFavorPct: progress.juryFavorPct,
      currentObjectionIdx: progress.currentObjectionIdx,
      isConcluded: progress.isConcluded,
      verdict: progress.verdict,
      objections: PRESET_TRIAL_CASE.objections.map(o => ({
        ...o,
        isOverruled: o.isOverruled || progress.overruledObjectionIds.includes(o.id)
      }))
    };
  }, [savedForThisCase, progress]);

  /** Seeds progress from the preset the first time this case is touched. */
  const progressForThisCase = (prev: CourtroomProgress): CourtroomProgress =>
    prev.caseId === PRESET_TRIAL_CASE.id
      ? prev
      : {
          caseId: PRESET_TRIAL_CASE.id,
          juryFavorPct: PRESET_TRIAL_CASE.juryFavorPct,
          currentObjectionIdx: PRESET_TRIAL_CASE.currentObjectionIdx,
          overruledObjectionIds: [],
          isConcluded: false,
          verdict: undefined,
          sentenceEnforced: false
        };

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [courtShout, setCourtShout] = useState<string | null>(null);
  const [verdictModal, setVerdictModal] = useState<boolean>(false);

  const activeObjection = trialCase.objections[trialCase.currentObjectionIdx];

  const handlePresentEvidence = () => {
    if (!selectedEvidenceId || trialCase.isConcluded || !activeObjection) return;

    sound.playPunch();
    const isCorrect = selectedEvidenceId === activeObjection.correctEvidenceId;

    if (isCorrect) {
      sound.playVictory();
      setCourtShout('💥 OBJECTION OVERRULED! 💥');

      const updatedFavor = Math.min(100, trialCase.juryFavorPct + 25);
      const nextIdx = trialCase.currentObjectionIdx + 1;
      const isFinished = nextIdx >= trialCase.objections.length;

      onUpdateProgress(prev => {
        const base = progressForThisCase(prev);
        return {
          ...base,
          juryFavorPct: updatedFavor,
          currentObjectionIdx: nextIdx,
          overruledObjectionIds: base.overruledObjectionIds.includes(activeObjection.id)
            ? base.overruledObjectionIds
            : [...base.overruledObjectionIds, activeObjection.id],
          isConcluded: isFinished,
          verdict: isFinished ? 'GuiltyMaxSentence' : undefined
        };
      });

      if (isFinished) {
        setTimeout(() => {
          try {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
          } catch (e) {}
          setVerdictModal(true);
        }, 1200);
      }
    } else {
      sound.playAlarm();
      setCourtShout('⚠️ EVIDENCE REJECTED BY COURT!');
      onUpdateProgress(prev => {
        const base = progressForThisCase(prev);
        return { ...base, juryFavorPct: Math.max(10, base.juryFavorPct - 15) };
      });
    }

    setTimeout(() => setCourtShout(null), 2000);
    setSelectedEvidenceId(null);
  };

  const handleFinalizeVerdict = () => {
    // Rewards are paid exactly once per case, even if the modal is somehow re-opened.
    if (savedForThisCase && progress.sentenceEnforced) {
      setVerdictModal(false);
      return;
    }

    const { hero: updatedHero } = applyRewards(playerHero, VERDICT_REWARDS);
    onUpdateHero(updatedHero);
    onUpdateProgress(prev => ({ ...progressForThisCase(prev), sentenceEnforced: true }));

    if (villains.length > 0 && onUpdateVillains) {
      const updatedVillains = villains.map(v => {
        if (v.name.includes('Polaris') || v.id === trialCase.villainId) {
          return {
            ...v,
            status: 'Incarcerated' as const,
            incarceratedDaysLeft: 30,
            breakoutRisk: 5
          };
        }
        return v;
      });
      onUpdateVillains(updatedVillains);
    }

    setVerdictModal(false);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 1. TOP COURTROOM HEADER */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-slate-950 p-6 rounded-3xl border-4 border-black shadow-comic flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            <Scale size={16} className="text-amber-400" />
            <span>METRO NOVA SUPREME COURT // PROSECUTION MINIGAME</span>
          </div>
          <h2 className="font-comic text-3xl sm:text-4xl text-white font-black tracking-wide drop-shadow-[2px_2px_0px_#000]">
            COURTROOM TRIAL & LAW HUB
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            Testify as the city lead superhero! Present forensic samples, time-stamped surveillance, and financial ledgers to crush corrupt defense objections and lock villains in deep cryo-containment!
          </p>
        </div>

        {/* Jury Favorability Meter */}
        <div className="bg-black/60 p-3.5 rounded-2xl border-2 border-black/80 shadow-comic shrink-0 text-xs min-w-[200px]">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 mb-1">
            <span>JURY FAVORABILITY</span>
            <span className="text-yellow-400 font-black">{trialCase.juryFavorPct}%</span>
          </div>
          <div className="w-full bg-gray-900 h-3 rounded-full border border-black overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 via-amber-400 to-green-400 h-full transition-all duration-500"
              style={{ width: `${trialCase.juryFavorPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Comic Interjection Burst Overlay */}
      {courtShout && (
        <div className="p-4 bg-yellow-400 text-black font-comic text-2xl font-black text-center rounded-2xl border-4 border-black shadow-comic animate-pow uppercase">
          {courtShout}
        </div>
      )}

      {/* 2. MAIN COURTROOM BENCH & OBJECTION CLASH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Courtroom Drama Chamber */}
        <div className="lg:col-span-2 bg-[#151928] p-6 rounded-3xl border-4 border-black shadow-comic space-y-5">
          {/* Judge Bench Banner */}
          <div className="bg-stone-900 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👨‍⚖️</span>
              <div>
                <h4 className="font-comic text-lg text-yellow-300">{trialCase.judgeName}</h4>
                <p className="text-xs text-gray-400 font-mono">PRESIDING OVER: {trialCase.villainName}</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-black text-amber-400 font-mono text-xs rounded border border-gray-700 font-bold">
              STAGE {Math.min(trialCase.currentObjectionIdx + 1, trialCase.objections.length)} / {trialCase.objections.length}
            </div>
          </div>

          {/* Defense Attorney Objection Stand */}
          {!trialCase.isConcluded && activeObjection ? (
            <div className="bg-red-950/70 p-5 rounded-2xl border-3 border-red-500 shadow-comic space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400 uppercase">
                <span className="flex items-center gap-1.5"><AlertTriangle size={15} /> DEFENSE OBJECTION</span>
                <span>{activeObjection.attorneyName}</span>
              </div>
              <p className="font-comic text-xl text-white font-bold leading-snug">
                {activeObjection.statement}
              </p>
              <div className="text-[11px] font-mono text-gray-300">
                REQUIRED COUNTER EVIDENCE: <span className="text-yellow-400 font-black">{activeObjection.objectionCounterType.toUpperCase()} EVIDENCE</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-950/70 p-6 rounded-2xl border-3 border-green-500 shadow-comic text-center space-y-2">
              <span className="text-4xl">⚖️</span>
              <h3 className="font-comic text-3xl text-green-400 font-black">ALL OBJECTIONS OVERRULED!</h3>
              <p className="text-sm text-gray-200">The jury has reached an unanimous conviction verdict against {trialCase.villainName}!</p>
            </div>
          )}

          {/* Selected Evidence Presentation Bar */}
          {!trialCase.isConcluded && (
            <div className="pt-2">
              <button
                disabled={!selectedEvidenceId}
                onClick={handlePresentEvidence}
                className={`w-full py-4 rounded-2xl border-4 border-black font-comic text-2xl shadow-comic flex items-center justify-center gap-3 transition-transform ${
                  selectedEvidenceId
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-black font-black hover:scale-[1.02] cursor-pointer'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Gavel size={24} />
                <span>{selectedEvidenceId ? 'PRESENT SELECTED EVIDENCE TO COURT!' : 'SELECT AN EVIDENCE ITEM FROM YOUR DOCKET'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Hero Evidence Docket */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-comic text-lg text-yellow-400 flex items-center gap-2">
              <FileText size={18} /> Hero Evidence Docket
            </h4>
            <span className="text-[10px] font-mono text-gray-400">4 EXHIBITS</span>
          </div>

          <div className="space-y-2.5">
            {trialCase.evidenceList.map(ev => {
              const isSelected = ev.id === selectedEvidenceId;

              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    if (!trialCase.isConcluded) {
                      sound.playClick();
                      setSelectedEvidenceId(isSelected ? null : ev.id);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-3 border-black cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-yellow-400 text-black shadow-comic scale-[1.02]'
                      : 'bg-[#151928] text-white hover:bg-[#1E2540]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{ev.icon}</span>
                      <span className="font-comic text-sm font-bold truncate">{ev.name}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                      isSelected ? 'bg-black text-yellow-400' : 'bg-black/60 text-cyan-300'
                    }`}>
                      {ev.type}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${
                    isSelected ? 'text-zinc-900 font-medium' : 'text-gray-300'
                  }`}>
                    {ev.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* VERDICT CONVICTION MODAL */}
      {verdictModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151928] max-w-md w-full p-6 sm:p-8 rounded-3xl border-4 border-yellow-400 shadow-comic-lg text-center space-y-4 animate-pow">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-400 border-3 border-black flex items-center justify-center text-4xl shadow-comic">
              ⚖️
            </div>
            <h2 className="font-comic text-3xl text-yellow-400">UNANIMOUS GUILTY VERDICT!</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dr. Magneto Polaris has been sentenced to 30 days in Maximum Deep-Freeze Containment at Blackgate Asylum. Breakout risk reduced to 5%!
            </p>

            <div className="bg-[#0E1220] p-3 rounded-xl border border-gray-700 text-xs font-mono font-bold text-green-400 flex justify-between">
              <span>+{VERDICT_REWARDS.xp} Hero XP</span>
              <span>+${VERDICT_REWARDS.money} Civic Reward</span>
              <span>+{VERDICT_REWARDS.heroTokens} Hero Tokens</span>
            </div>

            <button
              onClick={handleFinalizeVerdict}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-comic text-xl rounded-xl border-2 border-black shadow-comic font-bold cursor-pointer"
            >
              ENFORCE SENTENCE & RETURN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
