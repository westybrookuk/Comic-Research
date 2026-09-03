import React, { useState } from 'react';
import { 
  Radio, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Headphones, 
  Users, 
  DollarSign, 
  Flame, 
  ShieldAlert, 
  CheckCircle2,
  Bell,
  Play
} from 'lucide-react';
import { HeroCharacter, RadioCaller, RadioCallerResponse, RadioProgress, HubProgressUpdater } from '../types/game';
import { sound } from '../utils/audio';
import { narratorTts } from '../utils/narratorTts';
import { VOICE_CLIPS } from '../data/voiceClips';
import confetti from 'canvas-confetti';

interface RadioPodcastHubProps {
  playerHero: HeroCharacter;
  progress: RadioProgress;
  onUpdateProgress: HubProgressUpdater<'radio'>;
  onUpdateHero: (updated: HeroCharacter) => void;
}

export const RadioPodcastHub: React.FC<RadioPodcastHubProps> = ({ playerHero, progress, onUpdateProgress, onUpdateHero }) => {
  const [selectedCallerIdx, setSelectedCallerIdx] = useState<number>(0);
  const [activeCallState, setActiveCallState] = useState<'idle' | 'onAir' | 'answered'>('idle');
  const [selectedResponse, setSelectedResponse] = useState<RadioCallerResponse | null>(null);
  // Station stats + answered callers are persistent; the live call flow is ephemeral.
  const listenersCount = progress.listenersCount;
  const stationRating = progress.stationRating;
  const resolvedCallerIds = progress.resolvedCallerIds;
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);

  const CALLERS: RadioCaller[] = [
    {
      id: 'call-evelyn',
      callerName: 'Mrs. Evelyn Harper',
      callerRole: 'Concerned Citizen',
      callerDistrict: 'Old Town Heights',
      avatar: '👵',
      gender: 'feminine',
      topic: 'Rolling Power Outages & Street Safety',
      callerDialogue:
        "Hello Vanguard? Thank God I got through! The streetlamps in Sector 3 went dark again, and we saw masked looters near the bakery. Are the police coming, or are you watching over us tonight?",
      responses: [
        {
          id: 'resp-hope',
          label: 'Inspirational Assurance',
          hostDialogue:
            "Stay indoors and lock your doors, Mrs. Harper. I have already triangulated the grid outage in Sector 3. Vanguard is patrolling your street right now. You are not alone.",
          tone: 'Inspirational Hope',
          callerReaction:
            "Oh, bless you! I can hear your sirens in the distance now. Thank you, Vanguard!",
          approvalDelta: 8,
          suspicionDelta: -2,
          listenerDelta: 8500,
          ratingDelta: 0.1,
          moneyEarned: 250
        },
        {
          id: 'resp-tough',
          label: 'Direct Tactical Advisory',
          hostDialogue:
            "Keep your flashlights ready and do not confront anyone outside. Backup generators are being deployed to Old Town. Metro Police and I have a perimeter established.",
          tone: 'Tough Realist',
          callerReaction:
            "Understood! We'll stay put and alert the neighbors. Keep up the good fight!",
          approvalDelta: 5,
          suspicionDelta: 0,
          listenerDelta: 5200,
          ratingDelta: 0.05,
          moneyEarned: 180
        },
        {
          id: 'resp-wit',
          label: 'Humorous De-escalation',
          hostDialogue:
            "If those looters try taking Mrs. Harper's famous cinnamon pastries, they're dealing with my fist and a twenty-year sentence. Sit tight, Evelyn—I've got this.",
          tone: 'Sarcastic Wit',
          callerReaction:
            "(Laughs softly) You always know how to lighten the mood! Thank you, hero!",
          approvalDelta: 6,
          suspicionDelta: 1,
          listenerDelta: 11000,
          ratingDelta: 0.15,
          moneyEarned: 300
        }
      ]
    },
    {
      id: 'call-detective',
      callerName: 'Detective Marcus Sterling',
      callerRole: 'Skeptical Detective',
      callerDistrict: 'Metro Police 4th Precinct',
      avatar: '🕵️‍♂️',
      gender: 'masculine',
      topic: 'Vigilante Protocol & Structural Damage',
      callerDialogue:
        "Vanguard, this is Detective Sterling. Look, we appreciate you taking down Queen Pyre's crew last night, but you cracked the main sewer main in the Financial Core. City Hall is sending us the bill. What do you have to say for yourself?",
      responses: [
        {
          id: 'resp-partner',
          label: 'Professional Cooperation',
          hostDialogue:
            "Detective Sterling, the alternative was a thermal magma blast that would have leveled three city blocks. I've already pledged 25% of my comic royalties to the city reconstruction fund. Let's work together.",
          tone: 'Tough Realist',
          callerReaction:
            "Fair point. Can't argue with that accounting. Just watch the concrete next time, Vanguard.",
          approvalDelta: 7,
          suspicionDelta: -4,
          listenerDelta: 14000,
          ratingDelta: 0.2,
          moneyEarned: 350
        },
        {
          id: 'resp-oath',
          label: 'Heroic Public Defense',
          hostDialogue:
            "Concrete can be rebuilt in a week, Detective. Human lives cannot. As long as innocent citizens are in danger, I will prioritize saving them over asphalt every single time.",
          tone: 'Heroic Oath',
          callerReaction:
            "(Pause on the line) That's why the city believes in you, hero. Keep them safe out there.",
          approvalDelta: 10,
          suspicionDelta: -2,
          listenerDelta: 21000,
          ratingDelta: 0.25,
          moneyEarned: 450
        }
      ]
    },
    {
      id: 'call-fan',
      callerName: 'Leo (Age 11)',
      callerRole: 'Fan Club Youth',
      callerDistrict: 'Silicon Heights',
      avatar: '👦',
      gender: 'masculine',
      topic: 'How to Stand Up to Bullies',
      callerDialogue:
        "Hi Vanguard! I collect all your comic books! Some older kids at school were picking on my friend today and took his backpack. How do you find the courage not to be scared when villains are bigger than you?",
      responses: [
        {
          id: 'resp-inspire',
          label: 'Heartfelt Mentorship',
          hostDialogue:
            "Courage isn't about not feeling fear, Leo. Courage is feeling scared and doing what's right anyway. Standing up for your friend makes you just as much of a hero as anyone in a cape. Tell a teacher, stay strong, and never let them change your kind heart.",
          tone: 'Inspirational Hope',
          callerReaction:
            "WOW! Vanguard talked to me! I'm going to help him get his backpack back tomorrow! You're the best!",
          approvalDelta: 12,
          suspicionDelta: -3,
          listenerDelta: 25000,
          ratingDelta: 0.3,
          moneyEarned: 400
        }
      ]
    },
    {
      id: 'call-villain',
      callerName: '"Unknown Caller" (Shadow Intercept)',
      callerRole: 'Disguised Supervillain',
      callerDistrict: 'Scrambled Coordinates',
      avatar: '☠️',
      gender: 'feminine',
      topic: 'Live Airwave Ultimatum & Riddle',
      callerDialogue:
        "(Distorted voice over static) Enjoying your little radio show, 'Hero'? While you sit in that cozy padded booth, my thermite drones are circling the Apex Transit Bridge. Solve my riddle in three minutes, or the 9:00 train won't make its destination!",
      responses: [
        {
          id: 'resp-defy',
          label: 'Defiant Live Counter-Threat',
          hostDialogue:
            "I know that modulated voice frequency, Queen Pyre. Your signal bounce just gave away your relay tower in the Industrial Basin. Metro SWAT is en route, and I'll be waiting at the bridge. Your game ends tonight.",
          tone: 'Heroic Oath',
          callerReaction:
            "(Hiss of fury) How did you...?! This isn't over, Vanguard! (Call abruptly disconnected)",
          approvalDelta: 15,
          suspicionDelta: 5,
          listenerDelta: 35000,
          ratingDelta: 0.4,
          clueUnlocked: 'Apex Transit Bridge Drone Coordinates Discovered!',
          moneyEarned: 600
        }
      ]
    },
    {
      id: 'call-council',
      callerName: 'Councilwoman Diana Vance',
      callerRole: 'City Council Member',
      callerDistrict: 'City Hall Plaza',
      avatar: '🏛️',
      gender: 'feminine',
      topic: 'Super-Hero Registration & Tax Credits',
      callerDialogue:
        "Vanguard, City Hall is voting on the Meta-Human Civil Defense Bill tomorrow. We want to know: will you endorse our program to train municipal rescue squads alongside your alliance?",
      responses: [
        {
          id: 'resp-endorse',
          label: 'Civic Partnership Endorsement',
          hostDialogue:
            "I fully endorse any initiative that gives our first responders the tools, training, and armor they need. True heroism belongs to every paramedic, firefighter, and citizen who steps up.",
          tone: 'Inspirational Hope',
          callerReaction:
            "That endorsement means the world to our first responders. Thank you, Vanguard!",
          approvalDelta: 10,
          suspicionDelta: -5,
          listenerDelta: 18000,
          ratingDelta: 0.2,
          moneyEarned: 500
        }
      ]
    }
  ];

  const currentCaller = CALLERS[selectedCallerIdx] || CALLERS[0];

  const handlePlaySoundFX = (fxName: string) => {
    sound.playClick();
    if (fxName === 'jingle') {
      sound.playFanfare();
      narratorTts.speak("Metro Pulse ninety-eight point five. The voice of Metro Nova! You're on the air.", 'news_anchor', {
        clip: VOICE_CLIPS.radio_jingle
      });
    } else if (fxName === 'applause') {
      sound.playVictory();
    } else if (fxName === 'bleep') {
      sound.playAlarm();
    } else if (fxName === 'dramatic') {
      sound.playKraakoom();
    }
  };

  const handlePickUpLine = () => {
    sound.playClick();
    setActiveCallState('onAir');
    setSelectedResponse(null);
    narratorTts.speak(
      currentCaller.callerDialogue, 
      currentCaller.gender === 'feminine' ? 'oracle_female' : 'news_anchor'
    );
  };

  const handleSelectHostResponse = (resp: RadioCallerResponse) => {
    sound.playClick();
    setSelectedResponse(resp);
    setActiveCallState('answered');

    // Narrate Host reply
    narratorTts.speak(
      resp.hostDialogue,
      playerHero.gender === 'Female' ? 'oracle_female' : 'golden_age',
      undefined,
      () => {
        // Play caller reaction
        setTimeout(() => {
          narratorTts.speak(
            resp.callerReaction,
            currentCaller.gender === 'feminine' ? 'oracle_female' : 'news_anchor'
          );
        }, 400);
      }
    );

    // Apply gameplay rewards
    const updated = { ...playerHero };
    updated.publicApproval = Math.min(100, updated.publicApproval + resp.approvalDelta);
    updated.identitySuspicion = Math.max(0, updated.identitySuspicion + resp.suspicionDelta);
    if (resp.moneyEarned) {
      updated.money += resp.moneyEarned;
    }
    onUpdateHero(updated);

    onUpdateProgress(prev => ({
      listenersCount: prev.listenersCount + resp.listenerDelta,
      stationRating: Math.min(5.0, Number((prev.stationRating + resp.ratingDelta).toFixed(2))),
      resolvedCallerIds: prev.resolvedCallerIds.includes(currentCaller.id)
        ? prev.resolvedCallerIds
        : [...prev.resolvedCallerIds, currentCaller.id]
    }));

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleNextCaller = () => {
    sound.playClick();
    const nextIdx = (selectedCallerIdx + 1) % CALLERS.length;
    setSelectedCallerIdx(nextIdx);
    setActiveCallState('idle');
    setSelectedResponse(null);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Studio Header Bar */}
      <div className="bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-comic text-2xl sm:text-3xl text-yellow-400 flex items-center gap-2">
              <Radio className="text-yellow-400" /> METRO PULSE 98.5 FM: LATE NIGHT TALK RADIO
            </h2>
            <span className="px-2.5 py-0.5 bg-red-600 text-white font-mono text-xs font-black rounded border border-black animate-pulse flex items-center gap-1">
              ● ON AIR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Step behind the microphone as <span className="font-bold text-yellow-300">{playerHero.heroName}</span> to take live citizen calls, debate detectives, confront supervillains, and boost city listenership!
          </p>
        </div>

        {/* Live Broadcast Stats */}
        <div className="flex items-center gap-3 bg-black/60 p-3 rounded-xl border border-gray-800 text-xs shrink-0 font-mono">
          <div>
            <div className="text-[10px] text-gray-400">LISTENERSHIP</div>
            <div className="font-bold text-cyan-300 flex items-center gap-1">
              <Users size={12} /> {listenersCount.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-gray-700 pl-3">
            <div className="text-[10px] text-gray-400">STATION RATING</div>
            <div className="font-bold text-yellow-400 flex items-center gap-1">
              <Award size={12} /> ⭐ {stationRating} / 5.0
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 4 COLS: INCOMING CALL SWITCHBOARD */}
        <div className="lg:col-span-4 bg-[#151928] p-5 rounded-2xl border-3 border-black shadow-comic space-y-4">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <h3 className="font-comic text-lg text-yellow-400 flex items-center gap-1.5">
              <PhoneCall size={16} /> Incoming Caller Lines
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {resolvedCallerIds.length}/{CALLERS.length} ANSWERED
            </span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {CALLERS.map((caller, idx) => {
              const isSelected = selectedCallerIdx === idx;
              const isResolved = resolvedCallerIds.includes(caller.id);

              return (
                <button
                  key={caller.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCallerIdx(idx);
                    setActiveCallState('idle');
                    setSelectedResponse(null);
                  }}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-black font-bold shadow-comic scale-[1.02]'
                      : isResolved
                      ? 'bg-[#101422] text-gray-400 border-gray-800'
                      : 'bg-[#1A1F33] text-gray-200 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <span className="text-3xl p-1 bg-black/40 rounded-xl shrink-0">
                    {caller.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-comic text-sm truncate">{caller.callerName}</div>
                      {isResolved && <CheckCircle2 size={13} className="text-green-500 shrink-0" />}
                    </div>
                    <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-black/80' : 'text-cyan-400'}`}>
                      {caller.callerRole} • {caller.callerDistrict}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Studio Soundboard Buttons */}
          <div className="pt-2 border-t border-gray-700 space-y-2">
            <div className="text-[11px] font-mono font-bold text-yellow-300 uppercase">
              🎙️ On-Air Soundboard FX:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => handlePlaySoundFX('jingle')}
                className="p-1.5 bg-purple-900/70 hover:bg-purple-800 text-purple-200 rounded-lg border border-purple-500 font-bold"
              >
                📻 Station Jingle
              </button>
              <button
                onClick={() => handlePlaySoundFX('applause')}
                className="p-1.5 bg-green-900/70 hover:bg-green-800 text-green-200 rounded-lg border border-green-500 font-bold"
              >
                👏 Applause
              </button>
              <button
                onClick={() => handlePlaySoundFX('bleep')}
                className="p-1.5 bg-red-900/70 hover:bg-red-800 text-red-200 rounded-lg border border-red-500 font-bold"
              >
                🔔 Censor Bleep
              </button>
              <button
                onClick={() => handlePlaySoundFX('dramatic')}
                className="p-1.5 bg-amber-900/70 hover:bg-amber-800 text-amber-200 rounded-lg border border-amber-500 font-bold"
              >
                🥁 Dramatic Stab
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 8 COLS: ON-AIR BROADCAST STAGE */}
        <div className="lg:col-span-8 bg-[#151928] p-6 rounded-2xl border-3 border-black shadow-comic space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Active Caller Profile Banner */}
            <div className="p-4 rounded-xl border-2 border-black bg-gradient-to-r from-[#1A1F33] via-[#151928] to-[#121624] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-black/60 rounded-xl border border-white/20">
                  {currentCaller.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-comic text-xl text-yellow-400">{currentCaller.callerName}</h3>
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-600 rounded text-[10px] font-mono font-bold">
                      {currentCaller.callerRole}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    📍 {currentCaller.callerDistrict} // Topic: <span className="text-white font-bold">{currentCaller.topic}</span>
                  </p>
                </div>
              </div>

              {activeCallState === 'idle' ? (
                <button
                  onClick={handlePickUpLine}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl border-2 border-black shadow-comic flex items-center gap-1.5 animate-pulse shrink-0"
                >
                  <PhoneCall size={15} /> PATCH CALLER ON-AIR
                </button>
              ) : (
                <button
                  onClick={handleNextCaller}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-xl border border-black shadow flex items-center gap-1 shrink-0"
                >
                  NEXT CALLER ➔
                </button>
              )}
            </div>

            {/* Caller Spoken Dialogue Box */}
            <div className="bg-[#0D101A] p-4 rounded-xl border-2 border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <Headphones size={14} /> Live Caller Audio Stream:
                </span>
                <span className="text-[10px] font-mono text-gray-500">LINE 1: ACTIVE</span>
              </div>
              <p className="font-comic text-base text-gray-200 leading-relaxed italic p-2 bg-black/50 rounded-lg border border-gray-900">
                "{currentCaller.callerDialogue}"
              </p>
            </div>

            {/* Host Response Options Wheel */}
            {activeCallState !== 'idle' && (
              <div className="space-y-2.5">
                <h4 className="font-comic text-base text-yellow-300 flex items-center gap-1.5">
                  <Mic size={15} /> Select Host Broadcast Response:
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentCaller.responses.map(resp => (
                    <button
                      key={resp.id}
                      onClick={() => handleSelectHostResponse(resp)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                        selectedResponse?.id === resp.id
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-300 text-black border-black font-bold shadow-comic'
                          : 'bg-[#181D2E] text-gray-200 border-gray-700 hover:border-yellow-400/80 hover:bg-[#1E243A]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-comic text-sm text-yellow-300 group-hover:text-black">
                          🎙️ [{resp.tone.toUpperCase()}] {resp.label}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-green-400 font-bold">+{resp.approvalDelta}% Approval</span>
                          <span className="text-cyan-400 font-bold">+{resp.listenerDelta.toLocaleString()} Listeners</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic mt-0.5">
                        "{resp.hostDialogue}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved Outcome & Reaction Display */}
            {selectedResponse && (
              <div className="bg-emerald-950/60 p-4 rounded-xl border-2 border-emerald-500 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-emerald-400 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} /> Live Caller Reaction & Broadcast Outcome:
                  </span>
                  <span className="text-xs font-bold text-yellow-300">+${selectedResponse.moneyEarned} Syndication Royalty!</span>
                </div>
                <p className="text-xs text-gray-200 italic bg-black/40 p-2.5 rounded-lg border border-emerald-800">
                  "{selectedResponse.callerReaction}"
                </p>
                {selectedResponse.clueUnlocked && (
                  <div className="p-2 bg-red-950 text-red-300 border border-red-500 rounded text-xs font-bold font-mono">
                    🚨 INTEL UNLOCKED: {selectedResponse.clueUnlocked}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
