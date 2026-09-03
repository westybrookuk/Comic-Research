export type StatType = 'strength' | 'agility' | 'intellect' | 'fortitude' | 'willpower' | 'charisma';

export interface CharacterStats {
  strength: number;    // Physical damage, melee force, lifting capacity
  agility: number;     // Dodge, turn speed, critical chance, evasion
  intellect: number;   // Gadget effectiveness, investigation, tactical energy
  fortitude: number;   // Max HP, damage reduction, physical resilience
  willpower: number;   // Mental resistance, super meter gain, status recovery
  charisma: number;    // Comic sales, media PR, ally morale, intimidation
}

export type PowerCategory = 'Energy' | 'Brawn' | 'Tech' | 'Mystic' | 'Psionic' | 'Agility' | 'Cosmic';
export type PowerType = 'Melee' | 'Ranged' | 'Buff' | 'Debuff' | 'Heal' | 'Shield' | 'Ultimate' | 'Utility';
export type StatusEffectType = 'Stun' | 'Burn' | 'Freeze' | 'Bleed' | 'Weakened' | 'Empowered' | 'Webbed' | 'Confused' | 'Shielded' | 'Regenerating';

export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  duration: number; // turns
  potency: number;
  description: string;
}

export interface SuperPower {
  id: string;
  name: string;
  category: PowerCategory;
  type: PowerType;
  energyCost: number;
  cooldown: number;
  currentCooldown?: number;
  damage: number;
  healing?: number;
  shield?: number;
  accuracy: number;
  critChance: number;
  statusEffects?: StatusEffectType[];
  statusDuration?: number;
  statusPotency?: number;
  description: string;
  flavorQuote?: string;
  unlocked: boolean;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  animationType: 'punch' | 'laser' | 'lightning' | 'shield' | 'fire' | 'psychic' | 'darkness' | 'sonic' | 'ice' | 'tech';
}

export type OriginArchetype = 
  | 'Cosmic Awakening'
  | 'Billionaire Vigilante'
  | 'Genetic Mutation'
  | 'Arcane Pact'
  | 'High-Tech Prodigy'
  | 'Bio-Accident'
  | 'Alien Exile'
  | 'Street Brawler';

export type DayJobType =
  | 'Investigative Journalist'
  | 'Tech CEO'
  | 'Paramedic / Doctor'
  | 'Forensic Detective'
  | 'High School Teacher'
  | 'Café Barista'
  | 'Research Scientist'
  | 'Independent Artist';

export interface DayJob {
  type: DayJobType;
  title: string;
  salary: number;
  intelBonus: number;
  suspicionRisk: number;
  workSatisfaction: number;
  performance: number;
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  slot: 'Suit' | 'Gadget' | 'Mask' | 'Vehicle' | 'Relic';
  statBonuses: Partial<CharacterStats>;
  bonusHp?: number;
  bonusEnergy?: number;
  bonusArmor?: number;
  cost: number;
  unlocked: boolean;
  equipped: boolean;
  description: string;
  iconName: string;
}

export type AlignmentType = 'Golden Age Paragon' | 'Urban Dark Vigilante' | 'Ruthless Anti-Hero';

export interface SidekickCharacter {
  id: string;
  heroAlias: string;
  civilianName: string;
  role: 'Speedster Striker' | 'Tech Hacker' | 'Mystic Warder' | 'Heavy Brawler';
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: CharacterStats;
  avatarIcon: string;
  customImageUrl?: string;
  color: string;
  backstory: string;
  status: 'Active Companion' | 'Training' | 'Graduated Independent';
  synergyMove: {
    name: string;
    damage: number;
    apCost: number;
    description: string;
  };
  spinOffComicRevenue?: number;
  patrolDistrictId?: string;
}

// Civilian Romance & Social Life Models
export interface CivilianMilestone {
  id: string;
  title: string;
  category: 'Romance' | 'Career' | 'Personal' | 'Social';
  dayAchieved?: number;
  isUnlocked: boolean;
  description: string;
  rewardPerk: string;
  icon: string;
}

export interface DualTechSynergy {
  id: string;
  name: string;
  heroRequired?: string; // Hero name or any
  partnerName: string;   // Sidekick or Confidant name
  partnerAvatar: string;
  partnerColor: string;
  superCost: number;     // Super meter percentage required (e.g. 50%)
  apCost: number;
  damage: number;
  healing?: number;
  shield?: number;
  statusEffects: StatusEffectType[];
  description: string;
  comicBannerQuote: string;
  animationType: 'solar' | 'shadow' | 'tech' | 'mystic' | 'brawl';
}

export interface RomanceCrisisDilemma {
  title: string;
  premise: string;
  sirenDescription: string;
  choices: {
    id: 'restroom_hero' | 'stay_date' | 'confess_identity' | 'subtle_wits';
    label: string;
    description: string;
    heroismGain: number;
    affinityGain: number;
    stressChange: number;
    suspicionChange: number;
    statCheckRequired?: {
      stat: StatType;
      threshold: number;
    };
    outcomeDialogue: string;
  }[];
}

export interface RomanceDateChoice {
  label: string;
  affinityGain: number;
  stressReduction: number;
  perk: string;
}

export interface RomanceDateOption {
  id: string;
  name: string;
  partnerName: string;
  partnerId: string;
  location: string;
  cost: number;
  energyCost: number;
  dialogueScenario: string;
  dialogueResponses?: {
    text: string;
    partnerReply: string;
    affinityGain: number;
  }[];
  crisisDilemma?: RomanceCrisisDilemma;
  choices: RomanceDateChoice[];
}

// City Hall Politics & Civic Damage Models
export interface MayoralCandidate {
  id: string;
  name: string;
  title: string;
  avatar: string;
  platform: string;
  stance: 'Superhero Advocate' | 'Law & Order Hardliner' | 'Corporate Technocrat';
  pollRating: number; // 0 - 100%
  perksGranted: string;
  campaignQuote: string;
  endorsed: boolean;
}

export interface DistrictRebuildingProject {
  id: string;
  districtId: string;
  districtName: string;
  facilityName: string;
  damageLevel: number; // 0 - 100%
  repairCost: number;
  heroTokenCost: number;
  civicRewardApproval: number;
  isRepaired: boolean;
  description: string;
}

export type SoundPackType = '60s TV Vintage' | '90s Animated Synth' | 'Modern Cinematic' | '8-Bit Arcade';

// Mantle Succession & Next-Gen Legacy Models (Era 2)
export interface MentorHeirloom {
  id: string;
  name: string;
  slot: 'Relic' | 'Suit' | 'Gadget' | 'Mask';
  bonusStats: Partial<CharacterStats>;
  perkEffect: string;
  lore: string;
  icon: string;
}

export interface SuccessionPedigree {
  generationNumber: number;
  originalHeroName: string;
  originalCivilianName: string;
  retiredDay: number;
  torchPassedTo: string;
  legacyPerks: string[];
  totalVillainsDefeated: number;
  finalRankGrade: string;
}

// Live Press Conferences & PR Spin Hub Models
export interface ReporterQuestion {
  id: string;
  outletName: string;
  reporterName: string;
  outletBias: 'Pro-Hero' | 'Sensationalist' | 'Law-and-Order' | 'Investigative';
  avatar: string;
  topic: string;
  questionText: string;
  responses: {
    label: string;
    stance: 'Humble Defender' | 'Intimidating Enforcer' | 'Charming Celebrity' | 'Transparent Partner';
    approvalDelta: number;
    suspicionDelta: number;
    comicSalesDelta: number;
    mediaRatingDelta: number;
    quote: string;
  }[];
}

export interface MediaPressConference {
  id: string;
  headline: string;
  topic: string;
  questions: ReporterQuestion[];
  completed: boolean;
  pressScoreRating?: number;
}

// Multiverse Incursions & Parallel Universe Models (Endgame / NG+)
export interface MultiverseTimeline {
  id: string;
  name: string;
  universeCode: string;
  description: string;
  threatLevel: number;
  bossVariant: {
    name: string;
    title: string;
    origin: string;
    hp: number;
    attack: number;
    defense: number;
    powers: string[];
    avatar: string;
    color: string;
    dialogue: string;
  };
  riftOpen: boolean;
  defeated: boolean;
  shardReward: number;
  uniqueCostumeReward?: string;
  recruitedChampion?: string;
}

export interface MultiverseProfile {
  multiverseShards: number;
  unlockedTimelines: string[];
  defeatedIncursions: string[];
  ngPlusCount: number;
  prestigePassives: string[];
}

// Comic Panel Story Cutscene Models (Visual Novel Engine)
export type EmotionExpression = 'heroic' | 'angry' | 'smirking' | 'shocked' | 'somber' | 'determined' | 'terrified' | 'romantic';

export interface CutsceneChoice {
  id: string;
  label: string;
  previewQuote?: string;
  moralType?: 'Paragon' | 'Vigilante' | 'AntiHero' | 'Romance' | 'Tactical';
  alignmentDelta?: number;
  approvalDelta?: number;
  suspicionDelta?: number;
  stressDelta?: number;
  affinityDelta?: number;
  nextPanelId?: string;
  combatBuffGranted?: {
    bonusArmor?: number;
    bonusCrit?: number;
    bonusSuper?: number;
  };
  outcomeNarrative?: string;
}

export interface CutsceneDialoguePanel {
  id: string;
  speakerName: string;
  speakerRole: 'Hero' | 'Villain' | 'Sidekick' | 'Confidant' | 'Commissioner' | 'Narrator' | 'Hostage';
  speakerAvatar: string;
  expression: EmotionExpression;
  backdropTheme: 'RooftopRain' | 'BankVault' | 'VolcanoLair' | 'SkylineDawn' | 'PoliceHq' | 'CafeInterior' | 'QuantumCore';
  comicPanelLayout: 'full-splash' | 'diagonal-split' | 'dramatic-close' | 'wide-cinematic';
  dialogueText: string;
  onomatopoeiaOverlay?: string;
  sfxCue?: 'punch' | 'laser' | 'alarm' | 'super' | 'camera' | 'page';
  choices?: CutsceneChoice[];
  nextPanelId?: string;
}

export interface ComicStoryCutscene {
  id: string;
  title: string;
  actTitle: string;
  premise: string;
  initialPanelId: string;
  panels: CutsceneDialoguePanel[];
  triggerContext: 'PreBossClash' | 'PostCrimeVictory' | 'CivicDilemma' | 'ConfidantDate' | 'OriginsPrologue';
  villainId?: string;
}

// Nemesis Lair Infiltration Dungeon Models
export type LairRoomType = 
  | 'Laser Security Grid'
  | 'Guard Sentry Barracks'
  | 'Doomsday Reactor Room'
  | 'Classified Tech Vault'
  | 'Cryo-Containment Cell'
  | 'Inner Sanctum Throneroom';

export interface LairActionChoice {
  id: string;
  label: string;
  description: string;
  tacticType: 'Stealth' | 'Hack' | 'Brawn' | 'Acrobatics' | 'Gadget';
  energyCost: number;
  alarmDelta: number; // e.g. -20% or +35%
  successChance: number; // base 0 - 100%
  requiredStat?: {
    stat: StatType;
    threshold: number;
  };
  rewardLoot?: {
    money?: number;
    heroTokens?: number;
    intelClues?: number;
    hpHeal?: number;
    equipmentDrop?: Equipment;
  };
  failureHpDamage?: number;
  narrativeSuccess: string;
  narrativeFailure: string;
}

export interface LairRoom {
  id: string;
  roomNumber: number;
  title: string;
  type: LairRoomType;
  hazardDescription: string;
  roomVisualIcon: string;
  isCleared: boolean;
  choices: LairActionChoice[];
}

export interface NemesisLairDungeon {
  id: string;
  villainId: string;
  villainName: string;
  lairTitle: string;
  theme: 'Quantum Citadel' | 'Volcanic Foundry' | 'AI Megatower' | 'Underground Catacombs';
  recommendedLevel: number;
  bgGradient: string;
  threatLevel: 'High' | 'Catastrophic' | 'Omega-Level';
  loreDescription: string;
  rooms: LairRoom[];
  bossEncounter: CrimeEncounter;
  cutsceneId?: string;
}

// Music Jukebox Models (Suno Suite)
export interface SunoMusicTrack {
  id: string;
  title: string;
  trackNumber: number;
  sceneContext: string;
  mood: string;
  filePath: string;
  fallbackSynthCategory: 'heroic' | 'noir' | 'battle' | 'boss' | 'lofi' | 'cyber' | 'cosmic' | 'thriller' | 'fanfare' | 'requiem';
  durationSeconds: number;
  bpm: number;
}

// Procedural Narrative Event Deck Models
export interface PatrolStoryChoice {
  id: string;
  label: string;
  description: string;
  requiredStat?: {
    stat: StatType;
    threshold: number;
  };
  requiredAlignment?: AlignmentType;
  energyCost?: number;
  alignmentScoreDelta?: number;
  successChance?: number; // 0 to 100 base percentage if stat check is close
  successOutcome: {
    title: string;
    description: string;
    xp: number;
    money: number;
    approval: number;
    suspicionChange: number;
    stressChange: number;
    cluesGained?: number;
    tokenReward?: number;
  };
  failureOutcome: {
    title: string;
    description: string;
    hpLoss: number;
    approvalChange: number;
    suspicionChange: number;
    stressChange: number;
  };
}

export interface PatrolStoryEvent {
  id: string;
  title: string;
  category: 'Hostage Dilemma' | 'Catastrophic Hazard' | 'Undercover Sting' | 'Moral Ambiguity' | 'Civic Rescue' | 'Occult Anomaly';
  districtId?: string; // Optional: specific district or universal
  artIcon: string;
  comicBanner: string;
  premise: string;
  choices: PatrolStoryChoice[];
}

export interface HeroCharacter {
  id: string;
  heroName: string;
  civilianName: string;
  origin: OriginArchetype;
  gender: string;
  tagline: string;
  backstory: string;
  avatarIcon: string;
  customImageUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  level: number;
  xp: number;
  xpToNextLevel: number;
  statPointsAvailable: number;
  stats: CharacterStats;
  baseHp: number;
  currentHp: number;
  maxHp: number;
  baseEnergy: number;
  currentEnergy: number;
  maxEnergy: number;
  superMeter: number;
  armor: number;
  
  // Alignment & Morality
  alignment: AlignmentType;
  alignmentScore: number;
  reputation: number;
  publicApproval: number;
  identitySuspicion: number;
  
  // Economy & Resources
  money: number;
  heroTokens: number;
  
  // Skills & Kit
  powers: SuperPower[];
  inventory: Equipment[];
  equippedPowers: string[];
  
  // Sidekicks & Mentorship
  sidekicks: SidekickCharacter[];
  activeSidekickId?: string;
  
  // Romance & Social Life
  partnerRelationshipId?: string;
  relationshipStatus?: string;
  milestones: CivilianMilestone[];
  
  // Life & Job
  job: DayJob;
  stress: number;
  
  // Mantle Succession & Generation (Era 2)
  generation?: number;
  pedigreeHistory?: SuccessionPedigree[];
  heirlooms?: MentorHeirloom[];

  // PR & Media
  mediaRating?: number;

  // Multiverse & NG+
  multiverseShards?: number;
  ngPlusCount?: number;
  prestigePassives?: string[];

  // Faction
  allianceId?: string;
  isCustom?: boolean;
}

export type VillainAdaptationType = 
  | 'Thermal Kinetic Coating'
  | 'Hydraulic Muscle Weave'
  | 'Anti-EM Faraday Plating'
  | 'Obsidian Mind Aegis'
  | 'Runic Warding Glyphs'
  | 'Reflex Neural Enhancers';

export interface VillainAdaptation {
  type: VillainAdaptationType;
  description: string;
  counterCategory: PowerCategory;
}

export interface DefeatRecord {
  day: number;
  heroName: string;
  primaryPowerUsed: string;
  injuryInflicted: string;
}

export interface VillainCharacter {
  id: string;
  name: string;
  civilianName?: string;
  alias: string;
  dangerTier: 'Street Thug' | 'Local Menace' | 'Supervillain' | 'City Scourge' | 'Cosmic Threat';
  category: PowerCategory;
  backstory: string;
  motive: string;
  stats: CharacterStats;
  maxHp: number;
  currentHp: number;
  armor: number;
  powers: SuperPower[];
  avatarIcon: string;
  customImageUrl?: string;
  color: string;
  status: 'At Large' | 'Incarcerated' | 'Plotting' | 'Defeated' | 'Reformed';
  timesDefeated: number;
  escapedCount: number;
  nemesisScore: number;
  grudgeLevel: number;
  adaptations: VillainAdaptation[];
  defeatHistory: DefeatRecord[];
  incarceratedDaysLeft?: number;
  breakoutRisk: number;
  isNemesisPrime?: boolean;
  activeMasterplanId?: string;
  quips: string[];
}

export interface Masterplan {
  id: string;
  villainId: string;
  name: string;
  description: string;
  progress: number;
  cluesDiscovered: number;
  maxClues: number;
  districtId: string;
  doomPenalty: string;
  bossEncounterReady: boolean;
  rewardMoney: number;
  rewardXp: number;
  rewardTokens: number;
}

export interface CrisisStage {
  id: string;
  name: string;
  description: string;
  objectiveType: 'Combat' | 'Evacuate' | 'Investigation' | 'AllianceCoordination';
  targetCount: number;
  currentCount: number;
  bossVillainId?: string;
  completed: boolean;
}

export interface MegaCrisisEvent {
  id: string;
  title: string;
  codename: string;
  description: string;
  type: 'AlienInvasion' | 'OccultConvergence' | 'CyberPlague' | 'CosmicSingularity';
  threatLevel: number;
  isActive: boolean;
  resolved: boolean;
  stages: CrisisStage[];
  currentStageIndex: number;
  participatingVillains: string[];
  affectedDistricts: string[];
  loreHeadline: string;
  rewards: {
    xp: number;
    money: number;
    approval: number;
    heroTokens: number;
    commemorativeBadge: string;
  };
}

export interface District {
  id: string;
  name: string;
  theme: string;
  crimeRate: number;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  patrolCostEnergy: number;
  description: string;
  bgGradient: string;
  iconName: string;
  activeCrime?: CrimeEncounter;
  controlledBy?: string;
}

export interface CrimeEncounter {
  id: string;
  title: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Major' | 'Catastrophic';
  districtId: string;
  enemies: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    powers: string[];
    isBoss?: boolean;
    villainId?: string;
    avatar: string;
    adaptations?: VillainAdaptation[];
  }[];
  rewards: {
    xp: number;
    money: number;
    approval: number;
    heroTokens?: number;
    itemDrop?: Equipment;
  };
  civilianHostages?: number;
  environmentalHazard?: string;
  isNemesisAmbush?: boolean;
  isCrisisMission?: boolean;
  crisisId?: string;
}

export interface Relationship {
  id: string;
  name: string;
  role: 'Sidekick' | 'Civilian Friend' | 'Love Interest' | 'Police Chief' | 'Hero Mentor' | 'Journalist Rival';
  affinity: number;
  trustLevel: 'Stranger' | 'Acquaintance' | 'Trusted Ally' | 'Confidant' | 'Soulmate / Partner';
  knowsSecretIdentity: boolean;
  avatar: string;
  customImageUrl?: string;
  backstory: string;
  perkDescription: string;
  lastInteractedDay: number;
}

export interface Alliance {
  id: string;
  name: string;
  motto: string;
  headquarters: string;
  leader: string;
  members: string[];
  reputation: number;
  perk: string;
  icon: string;
  bannerColor: string;
}

export interface HQUpgrade {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  tokenCost: number;
  category: 'Tech' | 'Training' | 'Medical' | 'Defense' | 'Transport';
  description: string;
  currentBenefit: string;
  nextBenefit: string;
  icon: string;
}

export interface ComicIssue {
  issueNumber: number;
  title: string;
  subtitle: string;
  coverHeroName: string;
  primaryVillainFought: string;
  ratingGrade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  salesCount: number;
  revenue: number;
  fanLetters: { author: string; message: string; rating: number }[];
  highlightStory: string;
  coverColor: string;
  unlockedCoverBadge: string;
  datePublished: string;
}

export interface GameNewsItem {
  id: string;
  day: number;
  headline: string;
  district: string;
  category: 'Crime' | 'Heroism' | 'Public Opinion' | 'Crisis' | 'Social';
  snippet: string;
  isBreaking?: boolean;
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface CombatUnit {
  id: string;
  isPlayer: boolean;
  isAlly: boolean;
  name: string;
  avatar: string;
  color: string;
  currentHp: number;
  maxHp: number;
  currentEnergy: number;
  maxEnergy: number;
  superMeter: number;
  armor: number;
  stats: CharacterStats;
  powers: SuperPower[];
  statusEffects: StatusEffect[];
  position: 'Front' | 'Back';
  isDefending?: boolean;
  adaptations?: VillainAdaptation[];
  sidekickAssisting?: SidekickCharacter;
}

export interface CombatLogEntry {
  id: string;
  turn: number;
  attackerName: string;
  targetName: string;
  actionName: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isMiss?: boolean;
  soundCue?: string;
  comicExclamation?: string;
  text: string;
  type: 'attack' | 'heal' | 'buff' | 'defeat' | 'super' | 'environment';
}

export interface CombatState {
  isActive: boolean;
  turnNumber: number;
  activeUnitIndex: number;
  phase: 'PlayerTurn' | 'EnemyTurn' | 'Victory' | 'Defeat';
  playerUnits: CombatUnit[];
  enemyUnits: CombatUnit[];
  selectedPower?: SuperPower;
  selectedTargetId?: string;
  combatLogs: CombatLogEntry[];
  encounterRewards?: CrimeEncounter['rewards'];
  crimeId?: string;
  environmentName?: string;
  environmentalObjectUsed?: boolean;
}

// Superpower Fusion & Hybrid Crafting Lab Models
export interface FusedPowerRecipe {
  id: string;
  name: string;
  basePowerCategory1: PowerCategory;
  basePowerCategory2: PowerCategory;
  catalystName: string;
  category: PowerCategory;
  damage: number;
  energyCost: number;
  accuracy: number;
  critChance: number;
  healing?: number;
  shield?: number;
  statusEffects: StatusEffectType[];
  description: string;
  fusionQuote: string;
  icon: string;
  animationType: 'punch' | 'laser' | 'lightning' | 'shield' | 'fire' | 'psychic' | 'darkness' | 'sonic' | 'ice' | 'tech';
  unlocked: boolean;
}

// Live Radio Call-In Host Minigame Models
export interface RadioCallerResponse {
  id: string;
  label: string;
  hostDialogue: string;
  tone: 'Inspirational Hope' | 'Tough Realist' | 'Sarcastic Wit' | 'Heroic Oath';
  callerReaction: string;
  approvalDelta: number;
  suspicionDelta: number;
  listenerDelta: number;
  ratingDelta: number;
  clueUnlocked?: string;
  moneyEarned?: number;
}

export interface RadioCaller {
  id: string;
  callerName: string;
  callerRole: 'Concerned Citizen' | 'Skeptical Detective' | 'Fan Club Youth' | 'Disguised Supervillain' | 'City Council Member';
  callerDistrict: string;
  avatar: string;
  gender: 'masculine' | 'feminine';
  callerDialogue: string;
  topic: string;
  responses: RadioCallerResponse[];
}

// Dynamic Ambient Weather & Atmospheric Particle Engine
export type WeatherType = 'Clear' | 'GoldenHour' | 'Rain' | 'Thunderstorm' | 'NeonFog' | 'CosmicAurora';

export interface WeatherAtmosphereState {
  currentWeather: WeatherType;
  particlesEnabled: boolean;
  ambientAudioEnabled: boolean;
  rainIntensity: number; // 0 - 100
  lightningActive: boolean;
}

// Comic Book Cover Studio Models
export type ComicEraStyle = 'Retro1980' | 'GoldenAge' | 'ModernCinematic' | 'DarkNoir';
export type CcaStampType = 'CCA_Approved' | 'Special_Collectors' | 'Masterpiece_Certified' | 'None';

export interface CustomComicCoverDesign {
  id: string;
  seriesTitle: string;
  issueNumber: number;
  issueSlogan: string;
  topBannerText: string;
  priceTag: string;
  eraStyle: ComicEraStyle;
  ccaStamp: CcaStampType;
  villainId: string;
  foilHologram: boolean;
  halftoneEffect: boolean;
  heroPhotoUrl?: string;
  villainPhotoUrl?: string;
  dateCreated: string;
}

// Cinematic Boss QTE Clashes & Beam Struggle Models
export type QteClashMode = 
  | 'BeamStruggle' 
  | 'DirectionalReflex' 
  | 'PrecisionDial' 
  | 'MultiTapSurge' 
  | 'DualTouchOverdrive' 
  | 'BulletTimeDeflection' 
  | 'SidekickDualBeam';

export type QteClashDifficulty = 'Novice' | 'Heroic' | 'OmegaLevel' | 'GodTier';
export type DirectionKey = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface QteClashConfig {
  mode: QteClashMode;
  difficulty: QteClashDifficulty;
  timeLimitSeconds: number;
  bossName: string;
  bossAvatar: string;
  bossPowerName: string;
  heroPowerName: string;
  dialoguePreClash: string;
}

export interface QteClashResult {
  victory: boolean;
  score: number;
  maxCps: number;
  totalPresses: number;
  perfectHits: number;
  grade: 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
  damageDealt: number;
  moralBonusApproval: number;
}

// Achievement & Comic Milestone Badge Models
export type AchievementTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Cosmic';

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'Combat' | 'Publishing' | 'Moral' | 'Crafting' | 'EndlessTower' | 'QTE' | 'Legacy';
  description: string;
  tier: AchievementTier;
  icon: string;
  color: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  dateUnlocked?: string;
  reward: {
    xp: number;
    money: number;
    heroTokens: number;
    statBonus?: Partial<CharacterStats>;
    titleGranted?: string;
  };
}

// Collectible Graphic Novel Volume Models
export interface GraphicNovelVolume {
  id: string;
  title: string;
  volumeNumber: number;
  authorHeroName: string;
  synopsis: string;
  era: ComicEraStyle;
  coverImage?: string;
  issuesIncluded: number[];
  customSpreadsCount: number;
  totalCirculation: number;
  lifetimeRoyalties: number;
  criticalRatingAverage: string;
  dedicationText: string;
  dateBound: string;
}

// Endless Danger Room Tower Roguelike Models
export interface TowerRelicPerk {
  id: string;
  name: string;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  icon: string;
  description: string;
  bonusArmor?: number;
  bonusDamagePct?: number;
  bonusApRegen?: number;
  bonusSuperPct?: number;
  bonusCritChance?: number;
  healOnHit?: number;
  burnOnHit?: boolean;
  freezeOnHit?: boolean;
}

export interface TowerRunState {
  currentFloor: number;
  maxFloorReached: number;
  enemiesDefeated: number;
  shardsEarned: number;
  selectedRelics: TowerRelicPerk[];
  isActive: boolean;
  score: number;
  runDate: string;
}

// Motion Comic & Visual FX Media Models
export type ComicFxFilter = 'none' | 'halftone' | 'speedlines' | 'kenburns' | 'lightningAura' | 'infernalFlames' | 'cyberGlitch';
export type MediaAspectRatio = 'square' | 'landscape' | 'portrait' | 'cinematic';

export interface MotionMediaAsset {
  id: string;
  title: string;
  type: 'image' | 'video';
  mediaUrl: string;
  fallbackIcon?: string;
  aspectRatio: MediaAspectRatio;
  activeFilter: ComicFxFilter;
  halftoneIntensity: number; // 0 to 100
  speedlinesActive: boolean;
  kenBurnsActive: boolean;
  glitchActive: boolean;
  auraColor?: string;
  caption?: string;
  sfxCue?: string;
}

// Action Figure Toyline & Merchandise Licensing Models
export type ToyPackagingStyle = 'Retro 1980s Blister Card' | 'Deluxe 90s Collector Box' | 'Modern Die-Cast Premium' | 'Chibi Mini-Vinyl';
export type ToyActionGimmick = 'Karate Chop Action' | 'Glowing LED Chest Reactor' | 'Spring-Loaded Rocket Fist' | 'Cape Swoosh Glider' | 'Sound FX Voice Chip';

export interface ActionFigureToyline {
  id: string;
  seriesName: string;
  figureName: string;
  packaging: ToyPackagingStyle;
  gimmick: ToyActionGimmick;
  accessories: string[];
  retailPrice: number;
  productionCost: number;
  unitsProduced: number;
  unitsSold: number;
  totalRevenue: number;
  marketHype: number; // 0 - 100%
  collectorGrade: 'Mint in Box' | 'Near Mint' | 'Play-Worn';
  counterfeitRisk: number; // 0 - 100%
  dateLaunched: string;
}

// Detective Forensic Crime Scene Models
export type ForensicEvidenceType = 'DNA Mutagen' | 'Thermal Residue' | 'Encrypted Cyber Drive' | 'Ballistics Trajectory' | 'Cipher Note' | 'Mystic Rune';

export interface ForensicClue {
  id: string;
  name: string;
  type: ForensicEvidenceType;
  description: string;
  icon: string;
  analyzed: boolean;
  requiredStat: StatType;
  difficulty: number;
  cluePoints: number;
  analysisLog?: string;
}

export interface CrimeSceneInvestigation {
  id: string;
  districtId: string;
  districtName: string;
  title: string;
  premise: string;
  evidenceClues: ForensicClue[];
  linkedVillainId?: string;
  isSolved: boolean;
  bonusRewardXp: number;
  bonusRewardTokens: number;
  corkboardConnected: boolean;
}

// AI Voice Battle Cry & Quip Soundboard Models
export interface HeroBattleCry {
  id: string;
  category: 'Entrance' | 'SuperAttack' | 'Victory' | 'Taunt' | 'Defeat';
  sloganText: string;
  persona: 'golden_age' | 'dark_detective' | 'cosmic_herald' | 'oracle' | 'oracle_female' | 'news_anchor';
  pitch: number;
  rate: number;
  unlocked: boolean;
  sfxCue?: string;
  onomatopoeia?: string;
}

// Secret Lair & Batcave Customizer Models
export type LairModuleType = 'Supercomputer' | 'TrophyHall' | 'DangerDojo' | 'MedCryo' | 'VehicleBay' | 'ArmoryForge';

export interface LairRoomModule {
  id: string;
  type: LairModuleType;
  name: string;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  tokenCost: number;
  icon: string;
  description: string;
  perkEffect: string;
  isUnlocked: boolean;
}

export interface LairTrophy {
  id: string;
  name: string;
  villainId: string;
  villainName: string;
  lore: string;
  icon: string;
  dateAcquired: string;
}

export interface SecretLairState {
  lairName: string;
  theme: 'Subterranean Batcave' | 'High-Tech Penthouse' | 'Orbital Satellite' | 'Sanctum Arcanum';
  defenseShieldLevel: number;
  rooms: LairRoomModule[];
  trophies: LairTrophy[];
}

// Quick-Change Suspicion Dilemma Models
export type CivilianSituation = 'Corporate Board Meeting' | 'Hospital Trauma Shift' | 'Romantic Dinner Date' | 'University Lecture' | 'Crowded Subway Commute';

export interface QuickChangeChoice {
  id: string;
  label: string;
  location: string;
  statUsed: StatType;
  difficulty: number;
  riskSuspicion: number;
  energyCost: number;
  successOutcome: {
    dialogue: string;
    suspicionDelta: number;
    surpriseBuffPct: number;
    stressDelta: number;
  };
  failureOutcome: {
    dialogue: string;
    suspicionDelta: number;
    approvalDelta: number;
    stressDelta: number;
  };
}

export interface QuickChangeScenario {
  id: string;
  situation: CivilianSituation;
  title: string;
  premise: string;
  timeLimitSeconds: number;
  crimeUrgency: 'High' | 'Catastrophic' | 'Moderate';
  districtId: string;
  choices: QuickChangeChoice[];
}

// Combat Dynamic Weather Hazard Models
export type CombatWeatherHazardType = 'ClearSkies' | 'AcidRain' | 'Thunderstorm' | 'DenseNeonFog' | 'SolarSurge' | 'BlizzardFrost';

export interface CombatWeatherEffect {
  type: CombatWeatherHazardType;
  name: string;
  icon: string;
  description: string;
  armorDecayPerTurn?: number;
  bonusCritEnergyPct?: number;
  rangedAccuracyPenalty?: number;
  bonusSuperChargePct?: number;
  apRegenPenalty?: number;
  ambientColor: string;
}

// Mantle Legacy Hall of Fame Models
export interface GenerationalLegacyRecord {
  /** Set for player inductions; identifies which hero was immortalized (undefined for founding lore entries). */
  inductedHeroId?: string;
  generation: number;
  heroAlias: string;
  civilianName: string;
  origin: string;
  reignYears: string;
  totalCrimesSolved: number;
  villainsJailed: number;
  finalRank: 'Living Legend (S+)' | 'Grand Paragon (S)' | 'City Protector (A)';
  statueLocation: string;
  signaturePower: string;
  heirloomLeft: string;
  dateArchived: string;
}

// Super-Vehicle Garage & Pursuit Minigame Models
export type VehicleClassType = 'Armored Super-Car' | 'Stealth Sky-Jet' | 'Cybernetic Superbike' | 'Aquatic Hydro-Cutter';

export interface SuperVehicle {
  id: string;
  name: string;
  classType: VehicleClassType;
  topSpeedMph: number;
  armorIntegrity: number; // 0 - 100
  handling: number;
  nitroBoostCharges: number;
  equippedGadgets: ('EMP Harpoon' | 'Kinetic Bumper Ram' | 'Micro-Missile Pod' | 'Oil Slick Dispenser')[];
  level: number;
  icon: string;
  unlocked: boolean;
  cost: number;
}

export interface VehiclePursuitState {
  isActive: boolean;
  distanceToTargetMeters: number;
  playerSpeedMph: number;
  targetSpeedMph: number;
  playerHull: number;
  targetHull: number;
  currentLane: 0 | 1 | 2; // Left, Center, Right
  nitroAvailable: number;
  score: number;
  timeRemainingSeconds: number;
}

// "What If...?" Alternate Reality Multiverse Simulator Models
export interface WhatIfDivergenceChoice {
  id: string;
  label: string;
  description: string;
  timelineDistortionPct: number;
  bossVariantName: string;
  outcomeNarrative: string;
  variantCostumeUnlocked?: string;
  shardReward: number;
}

export interface WhatIfTimelineScenario {
  id: string;
  universeCode: string;
  title: string;
  premise: string;
  divergencePoint: string;
  divergenceChoices: WhatIfDivergenceChoice[];
  isExplored: boolean;
  selectedChoiceId?: string;
}

export interface GameSaveData {
  version: string;
  saveName: string;
  saveDate: string;
  day: number;
  timeOfDay: TimeOfDay;
  week: number;
  player: HeroCharacter;
  villains: VillainCharacter[];
  masterplans: Masterplan[];
  megaCrises?: MegaCrisisEvent[];
  mayoralCandidates?: MayoralCandidate[];
  rebuildingProjects?: DistrictRebuildingProject[];
  districts: District[];
  relationships: Relationship[];
  alliances: Alliance[];
  hqUpgrades: HQUpgrade[];
  comicIssues: ComicIssue[];
  newsFeed: GameNewsItem[];
  gameHistory: string[];
  /** Persistent progress for dashboard hubs. Optional so pre-1.1 saves still load (defaults are applied). */
  hubProgress?: Partial<HubProgressState>;
}

// 5. "Midnight Patrol" Roguelike Event Card Deck Models
export type PatrolCardType = 
  | 'CrimeInProgress' 
  | 'CrisisRescue' 
  | 'UnderworldIntel' 
  | 'CivilianDilemma' 
  | 'MysticAnomaly' 
  | 'TechHeist';

export type PatrolStatRequirement = 'strength' | 'agility' | 'intellect' | 'fortitude' | 'willpower' | 'charisma';

export interface PatrolCardOption {
  id: string;
  label: string;
  tacticName: string;
  statUsed: PatrolStatRequirement;
  dcThreshold: number; // Difficulty class (e.g. 10 - 20)
  description: string;
  successOutcome: {
    narrative: string;
    xp: number;
    money: number;
    approval: number;
    heroTokens?: number;
    stressChange?: number;
    comicPanelQuote: string;
    comicExclamation: string;
  };
  failureOutcome: {
    narrative: string;
    hpDamage?: number;
    stressChange?: number;
    suspicionChange?: number;
    comicPanelQuote: string;
    comicExclamation: string;
  };
}

export interface PatrolCard {
  id: string;
  title: string;
  district: string;
  severity: 'Minor' | 'Moderate' | 'Critical' | 'Legendary';
  type: PatrolCardType;
  illustrationEmoji: string;
  bgGradient: string;
  briefing: string;
  flavorQuote: string;
  options: PatrolCardOption[];
}

export interface PatrolComicPanelVignette {
  id: string;
  cardTitle: string;
  district: string;
  choiceLabel: string;
  statUsed: PatrolStatRequirement;
  d20Roll: number;
  statBonus: number;
  totalRoll: number;
  dcThreshold: number;
  success: boolean;
  exclamation: string;
  quote: string;
  narrative: string;
  rewardsSummary: string;
}

export interface PatrolDeckRunState {
  activeHand: PatrolCard[];
  completedCardsCount: number;
  totalShiftCards: number;
  currentStreak: number;
  totalXpGained: number;
  totalCashGained: number;
  totalTokensGained: number;
  vignetteHistory: PatrolComicPanelVignette[];
}

// 6. Universal Character Suit & Wardrobe Forge Models
export type SuitMaterialType = 
  | 'KevlarBallistic' 
  | 'VibraniumNanite' 
  | 'ArcaneSilk' 
  | 'CryoInsulated' 
  | 'SolarWeave';

export interface CharacterSuitPreset {
  id: string;
  name: string;
  targetCharacterType: 'Hero' | 'Sidekick' | 'Villain' | 'Alliance';
  targetCharacterName: string;
  cowlType: string;
  chestEmblem: string;
  capeStyle: string;
  armorMaterial: SuitMaterialType;
  materialPerk: string;
  primaryColor: string;
  secondaryColor: string;
  neonAccentColor: string;
  battleWearLevel: number; // 0 (pristine) to 100 (battle-torn)
  icon: string;
  bonusArmor: number;
  bonusHp: number;
  bonusCritPct: number;
}

// 7. Noir Detective Clue Board & Syndicate Web Models
export interface DetectiveClue {
  id: string;
  title: string;
  category: 'Suspect' | 'CrimeScene' | 'Wiretap' | 'FinancialRecord' | 'ForensicSample';
  district: string;
  description: string;
  pinnedX: number; // percentage coordinate 0-100
  pinnedY: number; // percentage coordinate 0-100
  photoEmoji: string;
  isKeyEvidence: boolean;
  discovered: boolean;
}

export interface DetectiveYarnConnection {
  id: string;
  fromClueId: string;
  toClueId: string;
  color: string;
  label?: string;
}

export interface SyndicateConspiracyCase {
  id: string;
  title: string;
  mastermindVillainId: string;
  mastermindName: string;
  clues: DetectiveClue[];
  connections: DetectiveYarnConnection[];
  solved: boolean;
  rewardXp: number;
  rewardMoney: number;
  rewardTokens: number;
  leadNarrative: string;
}

// 8. Multi-Format Comic Cover Exporter Models
export type ComicCoverAspectRatio = '16:9-landscape' | '9:16-portrait' | '1:1-square' | '4:3-vintage';
export type ComicCoverThemeStyle = 'SilverAge1970' | 'ModernCinematic' | 'NoirDark' | 'NeonCyberpunk' | 'MangaHalftone';

export interface ComicCoverExportConfig {
  aspectRatio: ComicCoverAspectRatio;
  themeStyle: ComicCoverThemeStyle;
  issueNo: number;
  title: string;
  subtitle: string;
  heroAlias: string;
  villainAlias: string;
  dialogueQuote: string;
  priceTag: string;
  showBarcode: boolean;
  showComicsCodeBadge: boolean;
  coverBannerEmoji: string;
  filterHalftone: boolean;
  filterFoilGlow: boolean;
}

// 9. Metro Nova Courtroom Trial Models
export interface CourtroomEvidenceItem {
  id: string;
  name: string;
  type: 'Forensic' | 'VideoRecord' | 'Witness' | 'Financial';
  relevanceScore: number;
  description: string;
  icon: string;
  presented: boolean;
}

export interface DefenseAttorneyObjection {
  id: string;
  attorneyName: string;
  statement: string;
  objectionCounterType: 'Forensic' | 'VideoRecord' | 'Witness' | 'Financial';
  correctEvidenceId: string;
  narrativeRefutation: string;
  isOverruled: boolean;
}

export interface CourtroomTrialCase {
  id: string;
  villainId: string;
  villainName: string;
  crimeCharges: string[];
  judgeName: string;
  juryFavorPct: number; // 0 - 100%
  objections: DefenseAttorneyObjection[];
  evidenceList: CourtroomEvidenceItem[];
  currentObjectionIdx: number;
  isConcluded: boolean;
  verdict?: 'GuiltyMaxSentence' | 'GuiltyStandard' | 'Mistrial';
}


// ═══════════════════════════════════════════════════════════════════════════
// PERSISTENT HUB PROGRESS
// ═══════════════════════════════════════════════════════════════════════════
// Dashboard tabs are unmounted when the player switches away, so any progress
// a hub keeps in local React state is destroyed. Everything below is the
// *dynamic* part of each hub's state (ids, counters, levels, player-created
// records). It lives in App state, is threaded down to the hub, and is written
// into GameSaveData so it survives tab switches, reloads and save/load.
//
// Static content (module descriptions, trial dialogue, trophy lore, etc.) is
// intentionally NOT stored here — hubs rebuild it from their preset
// definitions, which keeps saves small and lets content be edited without
// freezing old text into existing saves.

export type SecretLairTheme = 'Subterranean Batcave' | 'High-Tech Penthouse' | 'Orbital Satellite' | 'Sanctum Arcanum';

export interface SecretLairProgress {
  theme: SecretLairTheme;
  /** moduleId -> current level (costs are derived from level) */
  moduleLevels: Record<string, number>;
}

export interface EndlessTowerProgress {
  bestFloor: number;
  shards: number;
}

export interface AchievementsProgress {
  claimedIds: string[];
}

export type TrophyVaultTheme = 'GothicBatcave' | 'OrbitalCitadel' | 'PenthouseLab' | 'AncientCatacomb';

export interface TrophyVaultProgress {
  vaultTheme: TrophyVaultTheme;
  unlockedTrophyIds: string[];
}

export interface NoirDetectiveProgress {
  /** Case the stored connections belong to; a mismatch means "start fresh". */
  caseId: string;
  solved: boolean;
  connections: DetectiveYarnConnection[];
}

export interface CourtroomProgress {
  caseId: string;
  juryFavorPct: number;
  currentObjectionIdx: number;
  overruledObjectionIds: string[];
  isConcluded: boolean;
  verdict?: 'GuiltyMaxSentence' | 'GuiltyStandard' | 'Mistrial';
  /** Rewards have been paid out; prevents the verdict from being enforced twice. */
  sentenceEnforced: boolean;
}

export interface WhatIfProgress {
  /** scenarioId -> the divergence choice that was simulated */
  exploredChoices: Record<string, string>;
}

export interface HallOfFameProgress {
  inductedRecords: GenerationalLegacyRecord[];
}

export interface BossClashRecord {
  id: string;
  villainName: string;
  mode: QteClashMode;
  difficulty: QteClashDifficulty;
  grade: string;
  maxCps: number;
  score: number;
  date: string;
}

export interface BossClashProgress {
  records: BossClashRecord[];
}

export interface GraphicNovelProgress {
  /** null = library not yet seeded for this hero */
  volumes: GraphicNovelVolume[] | null;
}

export interface RadioProgress {
  listenersCount: number;
  stationRating: number;
  resolvedCallerIds: string[];
}

export interface PressConferenceProgress {
  answeredQuestionIds: string[];
}

export interface PatrolDeckProgress {
  /** Remaining card ids in draw order; null = fresh, unshuffled preset deck */
  remainingCardIds: string[] | null;
  completedCount: number;
  shiftTotalXp: number;
  shiftTotalCash: number;
  streak: number;
  history: PatrolComicPanelVignette[];
}

export interface BattleCryProgress {
  customCries: HeroBattleCry[];
  removedDefaultIds: string[];
}

export interface CrimeSceneProgress {
  analyzedClueIds: string[];
  solvedSceneIds: string[];
}

export interface ToylineProgress {
  /** null = toy catalogue not yet seeded for this hero */
  toylines: ActionFigureToyline[] | null;
}

export interface StoryProgress {
  /** Comic story cutscenes already played this campaign (each plays once). */
  seenCutsceneIds: string[];
}

export interface HubProgressState {
  secretLair: SecretLairProgress;
  endlessTower: EndlessTowerProgress;
  achievements: AchievementsProgress;
  trophyVault: TrophyVaultProgress;
  noirDetective: NoirDetectiveProgress;
  courtroom: CourtroomProgress;
  whatIf: WhatIfProgress;
  hallOfFame: HallOfFameProgress;
  bossClash: BossClashProgress;
  graphicNovels: GraphicNovelProgress;
  radio: RadioProgress;
  pressConferences: PressConferenceProgress;
  patrolDeck: PatrolDeckProgress;
  battleCries: BattleCryProgress;
  crimeScenes: CrimeSceneProgress;
  toylines: ToylineProgress;
  story: StoryProgress;
}

export type HubProgressKey = keyof HubProgressState;

/** A new value, or a functional update from the previous value (like React's setState). */
export type HubProgressUpdate<T> = T | ((prev: T) => T);

/** Setter for one slice of HubProgressState, handed to the hub that owns it. */
export type HubProgressUpdater<K extends HubProgressKey> = (next: HubProgressUpdate<HubProgressState[K]>) => void;
