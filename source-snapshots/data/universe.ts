import { 
  HeroCharacter, 
  VillainCharacter, 
  SuperPower, 
  District, 
  HQUpgrade, 
  Alliance, 
  Relationship, 
  Equipment,
  DayJob,
  OriginArchetype,
  Masterplan,
  MegaCrisisEvent,
  SidekickCharacter,
  CivilianMilestone,
  RomanceDateOption,
  MayoralCandidate,
  DistrictRebuildingProject,
  DualTechSynergy
} from '../types/game';

export const ALL_POWERS: SuperPower[] = [
  // --- ENERGY POWERS ---
  {
    id: 'power-solar-beam',
    name: 'Solar Beam',
    category: 'Energy',
    type: 'Ranged',
    energyCost: 20,
    cooldown: 0,
    damage: 28,
    accuracy: 95,
    critChance: 15,
    statusEffects: ['Burn'],
    statusDuration: 2,
    statusPotency: 6,
    description: 'Channels concentrated solar radiation into a devastating focused beam.',
    flavorQuote: 'Taste the brilliance of a thousand suns!',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 150,
    animationType: 'laser'
  },
  {
    id: 'power-plasma-burst',
    name: 'Plasma Burst',
    category: 'Energy',
    type: 'Ranged',
    energyCost: 35,
    cooldown: 2,
    damage: 48,
    accuracy: 90,
    critChance: 25,
    statusEffects: ['Burn'],
    statusDuration: 3,
    statusPotency: 10,
    description: 'Fires an unstable sphere of superheated plasma that explodes on impact.',
    flavorQuote: 'Warning: volatile thermal reaction imminent.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 250,
    animationType: 'fire'
  },
  {
    id: 'power-supernova-blast',
    name: 'Supernova Genesis',
    category: 'Energy',
    type: 'Ultimate',
    energyCost: 75,
    cooldown: 4,
    damage: 110,
    accuracy: 100,
    critChance: 35,
    statusEffects: ['Burn', 'Stun'],
    statusDuration: 2,
    statusPotency: 15,
    description: 'Ultimate Power: Gathers cosmic energy and releases a blinding cataclysmic blast.',
    flavorQuote: 'Behold the dawn of total victory!',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 500,
    animationType: 'laser'
  },
  {
    id: 'power-energy-shield',
    name: 'Photon Barrier',
    category: 'Energy',
    type: 'Shield',
    energyCost: 25,
    cooldown: 2,
    damage: 0,
    shield: 45,
    accuracy: 100,
    critChance: 0,
    statusEffects: ['Shielded'],
    statusDuration: 2,
    statusPotency: 45,
    description: 'Creates a shimmering hard-light barrier that absorbs incoming attacks.',
    flavorQuote: 'Your attacks will not pierce this light.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 200,
    animationType: 'shield'
  },

  // --- BRAWN / PHYSICAL POWERS ---
  {
    id: 'power-heavy-strike',
    name: 'Meteor Punch',
    category: 'Brawn',
    type: 'Melee',
    energyCost: 15,
    cooldown: 0,
    damage: 26,
    accuracy: 95,
    critChance: 20,
    statusEffects: ['Weakened'],
    statusDuration: 2,
    statusPotency: 5,
    description: 'A thunderous punch delivered with superhuman kinetic force.',
    flavorQuote: 'Feel the weight of raw justice!',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 150,
    animationType: 'punch'
  },
  {
    id: 'power-ground-slam',
    name: 'Tectonic Slam',
    category: 'Brawn',
    type: 'Melee',
    energyCost: 35,
    cooldown: 2,
    damage: 42,
    accuracy: 90,
    critChance: 15,
    statusEffects: ['Stun'],
    statusDuration: 1,
    statusPotency: 0,
    description: 'Smashes both fists into the pavement, creating shockwaves that rattle all foes.',
    flavorQuote: 'Earthquake incoming!',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 250,
    animationType: 'punch'
  },
  {
    id: 'power-titanic-crush',
    name: 'World Breaker Rush',
    category: 'Brawn',
    type: 'Ultimate',
    energyCost: 70,
    cooldown: 4,
    damage: 120,
    accuracy: 95,
    critChance: 30,
    statusEffects: ['Stun', 'Weakened'],
    statusDuration: 2,
    statusPotency: 20,
    description: 'Ultimate Power: A brutal relentless barrage ending in an earth-shattering suplex.',
    flavorQuote: 'Nothing in this city can withstand my might!',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 500,
    animationType: 'punch'
  },
  {
    id: 'power-iron-fortitude',
    name: 'Adamantine Stance',
    category: 'Brawn',
    type: 'Buff',
    energyCost: 20,
    cooldown: 3,
    damage: 0,
    healing: 25,
    shield: 30,
    accuracy: 100,
    critChance: 0,
    statusEffects: ['Empowered', 'Regenerating'],
    statusDuration: 3,
    statusPotency: 10,
    description: 'Hardens muscles to steel density, recovering health and increasing defense.',
    flavorQuote: 'I can do this all day.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 220,
    animationType: 'shield'
  },

  // --- TECH / GADGET POWERS ---
  {
    id: 'power-emp-grenade',
    name: 'Volt EMP Grenade',
    category: 'Tech',
    type: 'Ranged',
    energyCost: 20,
    cooldown: 1,
    damage: 24,
    accuracy: 95,
    critChance: 15,
    statusEffects: ['Stun'],
    statusDuration: 1,
    statusPotency: 0,
    description: 'Hurls an electro-magnetic pulse grenade that scrambles tech and shocks nervous systems.',
    flavorQuote: 'System reboot in 3... 2... 1.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 150,
    animationType: 'lightning'
  },
  {
    id: 'power-micro-missiles',
    name: 'Swarm Micro-Missiles',
    category: 'Tech',
    type: 'Ranged',
    energyCost: 40,
    cooldown: 2,
    damage: 52,
    accuracy: 92,
    critChance: 25,
    statusEffects: ['Burn', 'Bleed'],
    statusDuration: 2,
    statusPotency: 8,
    description: 'Fires a volley of heat-seeking micro-warheads with surgical precision.',
    flavorQuote: 'Target lock confirmed. Firing full payload.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 280,
    animationType: 'tech'
  },
  {
    id: 'power-orbital-cannon',
    name: 'Orbital Strike Protocol',
    category: 'Tech',
    type: 'Ultimate',
    energyCost: 80,
    cooldown: 4,
    damage: 130,
    accuracy: 95,
    critChance: 40,
    statusEffects: ['Burn', 'Stun'],
    statusDuration: 2,
    statusPotency: 15,
    description: 'Ultimate Power: Designates coordinates for an Apex satellite particle beam bombardment.',
    flavorQuote: 'Orbital beam calibrated. Cleanse the grid.',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 550,
    animationType: 'tech'
  },
  {
    id: 'power-nano-repair',
    name: 'Nanite Infusion',
    category: 'Tech',
    type: 'Heal',
    energyCost: 25,
    cooldown: 2,
    damage: 0,
    healing: 50,
    accuracy: 100,
    critChance: 0,
    statusEffects: ['Regenerating'],
    statusDuration: 2,
    statusPotency: 15,
    description: 'Deploys medical nanobots to instantly stitch tissue and reboot power systems.',
    flavorQuote: 'Cellular regeneration initiated.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 200,
    animationType: 'tech'
  },

  // --- MYSTIC / ARCANE POWERS ---
  {
    id: 'power-eldritch-bolt',
    name: 'Eldritch Flame',
    category: 'Mystic',
    type: 'Ranged',
    energyCost: 22,
    cooldown: 0,
    damage: 30,
    accuracy: 90,
    critChance: 20,
    statusEffects: ['Burn', 'Confused'],
    statusDuration: 2,
    statusPotency: 6,
    description: 'Casts an otherworldly purple flame that burns both body and soul.',
    flavorQuote: 'By the ancient seals, be purged!',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 160,
    animationType: 'darkness'
  },
  {
    id: 'power-astral-chains',
    name: 'Astral Binding Chains',
    category: 'Mystic',
    type: 'Debuff',
    energyCost: 30,
    cooldown: 2,
    damage: 22,
    accuracy: 95,
    critChance: 10,
    statusEffects: ['Webbed', 'Weakened'],
    statusDuration: 3,
    statusPotency: 10,
    description: 'Summons spectral sigil chains that entangle and sap the foe of their strength.',
    flavorQuote: 'You cannot sever chains forged in the Nether-Realm.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 240,
    animationType: 'darkness'
  },
  {
    id: 'power-cosmic-vortex',
    name: 'Void Rift Singularity',
    category: 'Mystic',
    type: 'Ultimate',
    energyCost: 80,
    cooldown: 4,
    damage: 125,
    accuracy: 95,
    critChance: 35,
    statusEffects: ['Confused', 'Weakened', 'Burn'],
    statusDuration: 3,
    statusPotency: 12,
    description: 'Ultimate Power: Opens a tear to the dimensional void, devouring enemy resistance.',
    flavorQuote: 'Gaze into infinity and weep!',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 550,
    animationType: 'darkness'
  },
  {
    id: 'power-mystic-restoration',
    name: 'Sanctuary Ward',
    category: 'Mystic',
    type: 'Heal',
    energyCost: 30,
    cooldown: 3,
    damage: 0,
    healing: 45,
    shield: 35,
    accuracy: 100,
    critChance: 0,
    statusEffects: ['Shielded', 'Regenerating'],
    statusDuration: 2,
    statusPotency: 12,
    description: 'Conjures a protective arcane rune circle that heals allies and repels dark malice.',
    flavorQuote: 'Light protects the righteous.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 220,
    animationType: 'shield'
  },

  // --- PSIONIC / MENTAL POWERS ---
  {
    id: 'power-mind-flay',
    name: 'Psionic Spike',
    category: 'Psionic',
    type: 'Ranged',
    energyCost: 20,
    cooldown: 0,
    damage: 27,
    accuracy: 98,
    critChance: 20,
    statusEffects: ['Confused'],
    statusDuration: 2,
    statusPotency: 8,
    description: 'Drives a sharp spear of pure psychic willpower straight into the mind.',
    flavorQuote: 'Your thoughts betray you.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 150,
    animationType: 'psychic'
  },
  {
    id: 'power-telekinetic-toss',
    name: 'Telekinetic Crush',
    category: 'Psionic',
    type: 'Ranged',
    energyCost: 35,
    cooldown: 2,
    damage: 46,
    accuracy: 92,
    critChance: 22,
    statusEffects: ['Stun'],
    statusDuration: 1,
    statusPotency: 0,
    description: 'Lifts a chunk of concrete or a parked vehicle and hurls it with telekinetic velocity.',
    flavorQuote: 'Mind over matter!',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 260,
    animationType: 'psychic'
  },
  {
    id: 'power-psychic-cataclysm',
    name: 'Synaptic Supernova',
    category: 'Psionic',
    type: 'Ultimate',
    energyCost: 75,
    cooldown: 4,
    damage: 115,
    accuracy: 100,
    critChance: 30,
    statusEffects: ['Confused', 'Stun'],
    statusDuration: 2,
    statusPotency: 15,
    description: 'Ultimate Power: Radiates an overwhelming psionic wave that overwhelms all enemy mental faculties.',
    flavorQuote: 'Total neurological collapse!',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 520,
    animationType: 'psychic'
  },

  // --- AGILITY / MARTIAL POWERS ---
  {
    id: 'power-shadow-strike',
    name: 'Shadow Flurry',
    category: 'Agility',
    type: 'Melee',
    energyCost: 18,
    cooldown: 0,
    damage: 26,
    accuracy: 95,
    critChance: 30,
    statusEffects: ['Bleed'],
    statusDuration: 2,
    statusPotency: 7,
    description: 'A rapid series of martial arts strikes exploiting weak points.',
    flavorQuote: 'Too slow to see it coming.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 150,
    animationType: 'punch'
  },
  {
    id: 'power-lightning-kick',
    name: 'Hyper-Sonic Sweep',
    category: 'Agility',
    type: 'Melee',
    energyCost: 32,
    cooldown: 1,
    damage: 44,
    accuracy: 94,
    critChance: 25,
    statusEffects: ['Stun'],
    statusDuration: 1,
    statusPotency: 0,
    description: 'Executes a spinning roundhouse kick at near supersonic speed.',
    flavorQuote: 'Did the breeze catch you?',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 240,
    animationType: 'sonic'
  },
  {
    id: 'power-assassin-blitz',
    name: 'Ghost Blade Requiem',
    category: 'Agility',
    type: 'Ultimate',
    energyCost: 70,
    cooldown: 4,
    damage: 120,
    accuracy: 98,
    critChance: 45,
    statusEffects: ['Bleed', 'Weakened'],
    statusDuration: 3,
    statusPotency: 15,
    description: 'Ultimate Power: Vanishes into shadow and delivers twelve surgical strikes in the blink of an eye.',
    flavorQuote: 'You were already defeated before you turned around.',
    unlocked: false,
    level: 1,
    maxLevel: 5,
    upgradeCost: 500,
    animationType: 'darkness'
  },
  {
    id: 'power-smoke-vanish',
    name: 'Smoke Shroud Evade',
    category: 'Agility',
    type: 'Buff',
    energyCost: 20,
    cooldown: 2,
    damage: 0,
    shield: 35,
    accuracy: 100,
    critChance: 0,
    statusEffects: ['Shielded', 'Empowered'],
    statusDuration: 2,
    statusPotency: 20,
    description: 'Drops a high-density smoke canister, confusing attackers and bolstering counter-attacks.',
    flavorQuote: 'Now you see me... now you don\'t.',
    unlocked: true,
    level: 1,
    maxLevel: 5,
    upgradeCost: 180,
    animationType: 'darkness'
  }
];

export const RECRUITABLE_SIDEKICKS: SidekickCharacter[] = [
  {
    id: 'sidekick-spark',
    heroAlias: 'Volt Spark',
    civilianName: 'Kit Morales',
    role: 'Speedster Striker',
    level: 2,
    xp: 80,
    xpToNextLevel: 250,
    stats: {
      strength: 10,
      agility: 18,
      intellect: 12,
      fortitude: 11,
      willpower: 12,
      charisma: 14
    },
    avatarIcon: '⚡👦',
    color: '#FFDE59',
    backstory: 'An eager high-school prodigy with natural electro-kinetic speed. Loyal, fast-talking, and eager to learn.',
    status: 'Active Companion',
    synergyMove: {
      name: 'Twin Lightning Barrage',
      damage: 48,
      apCost: 25,
      description: 'Volt Spark dashes behind the target, pinning them with electricity while you strike.'
    }
  },
  {
    id: 'sidekick-nova-swift',
    heroAlias: 'Cyber Hawk',
    civilianName: 'Maya Vance',
    role: 'Tech Hacker',
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    stats: {
      strength: 8,
      agility: 15,
      intellect: 18,
      fortitude: 10,
      willpower: 13,
      charisma: 12
    },
    avatarIcon: '🦅💻',
    color: '#00F0FF',
    backstory: 'A teenage robotics genius who built reconnaissance drones to patrol alleyways in the Neon District.',
    status: 'Training',
    synergyMove: {
      name: 'Drone EMP Disruption',
      damage: 42,
      apCost: 20,
      description: 'Deploys a shock drone that stuns the target and shreds 15 armor points.'
    }
  },
  {
    id: 'sidekick-shadow-kuroda',
    heroAlias: 'Nightblade',
    civilianName: 'Ren Kuroda',
    role: 'Heavy Brawler',
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    stats: {
      strength: 17,
      agility: 12,
      intellect: 10,
      fortitude: 16,
      willpower: 14,
      charisma: 10
    },
    avatarIcon: '⚔️🥋',
    color: '#E63946',
    backstory: 'A disciplined dojo prodigy with immense physical fortitude, determined to clear his family name.',
    status: 'Training',
    synergyMove: {
      name: 'Tectonic Double Strike',
      damage: 55,
      apCost: 30,
      description: 'Unleashes a devastating synchronized seismic slam with heavy kinetic force.'
    }
  },
  {
    id: 'sidekick-aura-mystic',
    heroAlias: 'Aura',
    civilianName: 'Selene Vance',
    role: 'Mystic Warder',
    level: 1,
    xp: 0,
    xpToNextLevel: 200,
    stats: {
      strength: 8,
      agility: 11,
      intellect: 16,
      fortitude: 12,
      willpower: 18,
      charisma: 15
    },
    avatarIcon: '🔮✨',
    color: '#8A2BE2',
    backstory: 'An arcane novice gifted with rare healing sigils and shielding leylines.',
    status: 'Training',
    synergyMove: {
      name: 'Sanctuary Aegis Pulse',
      damage: 35,
      apCost: 25,
      description: 'Heals the hero for 35 HP and inflicts Confused status upon the target.'
    }
  }
];

export const DEFAULT_CIVILIAN_MILESTONES: CivilianMilestone[] = [
  {
    id: 'milestone-apartment',
    title: 'Downtown Penthouse / Loft Lease',
    category: 'Personal',
    isUnlocked: true,
    dayAchieved: 1,
    description: 'Secured a personal civilian residence in Metro Nova with a secret rooftop access hatch.',
    rewardPerk: '-10% Daily Stress accumulation',
    icon: 'Home'
  },
  {
    id: 'milestone-promotion',
    title: 'Senior Career Promotion',
    category: 'Career',
    isUnlocked: false,
    description: 'Achieved high performance reviews at your civilian workplace, earning elevated salary bonuses.',
    rewardPerk: '+25% Weekly Day Job Salary',
    icon: 'Briefcase'
  },
  {
    id: 'milestone-first-date',
    title: 'First Romantic Skyline Date',
    category: 'Romance',
    isUnlocked: false,
    description: 'Shared an intimate candlelit rooftop evening with your civilian love interest.',
    rewardPerk: 'Homemade lunch box restores +20 AP daily',
    icon: 'Heart'
  },
  {
    id: 'milestone-birthday',
    title: 'Surprise Birthday Party',
    category: 'Social',
    isUnlocked: false,
    description: 'Celebrated with childhood friends and colleagues, grounding your human identity.',
    rewardPerk: 'Reduces Identity Suspicion by 20%',
    icon: 'Gift'
  },
  {
    id: 'milestone-mayoral-medal',
    title: 'Mayor’s Key to Metro Nova',
    category: 'Social',
    isUnlocked: false,
    description: 'Received official municipal recognition for outstanding civic contributions.',
    rewardPerk: '+15% Public Approval and +10% Comic Sales',
    icon: 'Award'
  }
];

export const ROMANCE_DATE_OPTIONS: RomanceDateOption[] = [
  {
    id: 'date-stargazing',
    name: 'Stargazing at Helios Observatory',
    partnerName: 'Dr. Sarah Sterling',
    partnerId: 'rel-love-interest-elena',
    location: 'Helios Celestial Observatory',
    cost: 80,
    energyCost: 15,
    dialogueScenario: 'Sarah points out a distant nebula through the telescope and mentions how much pressure both of your careers bring.',
    choices: [
      {
        label: 'Open up emotionally about the weight of your dual identity.',
        affinityGain: 20,
        stressReduction: 35,
        perk: '+20 Affinity with Sarah & -35% Stress'
      },
      {
        label: 'Make a witty scientific joke to lighten the evening mood.',
        affinityGain: 15,
        stressReduction: 25,
        perk: '+15 Affinity with Sarah & -25% Stress'
      }
    ]
  },
  {
    id: 'date-coffee-bakery',
    name: 'Late-Night Artisan Coffee & Pastries',
    partnerName: 'Chloe Rivera',
    partnerId: 'rel-civilian-chloe',
    location: 'Roaster\'s Haven Café',
    cost: 40,
    energyCost: 10,
    dialogueScenario: 'Chloe locks up the cafe after hours and pours two cups of fresh espresso, laughing about old childhood school days.',
    choices: [
      {
        label: 'Reminisce about growing up before superpowers changed everything.',
        affinityGain: 25,
        stressReduction: 40,
        perk: '+25 Affinity with Chloe & -40% Stress'
      },
      {
        label: 'Help her brainstorm new specialty pastry recipes.',
        affinityGain: 18,
        stressReduction: 30,
        perk: '+18 Affinity with Chloe & -30% Stress'
      }
    ]
  },
  {
    id: 'date-jazz-lounge',
    name: 'Velvet Midnight Jazz Club',
    partnerName: 'Liam Vance',
    partnerId: 'rel-reporter-vance',
    location: 'The Blue Note Lounge, Neon District',
    cost: 120,
    energyCost: 15,
    dialogueScenario: 'Over smooth saxophone melodies, Liam questions whether any vigilante in Metro Nova can truly balance normal love with the cape.',
    choices: [
      {
        label: 'Argue passionately that love is the very anchor that keeps heroes humane.',
        affinityGain: 22,
        stressReduction: 25,
        perk: '+22 Affinity with Liam & -15% Suspicion'
      },
      {
        label: 'Challenge him to a friendly philosophical debate over drinks.',
        affinityGain: 16,
        stressReduction: 20,
        perk: '+16 Affinity with Liam & -20% Stress'
      }
    ]
  }
];

export const MAYORAL_CANDIDATES: MayoralCandidate[] = [
  {
    id: 'candidate-thomas-sterling',
    name: 'Thomas Sterling',
    title: 'Former District Judge & Civic Philanthropist',
    avatar: '👨‍⚖️🏛️',
    platform: 'Hero-Civic Partnership & Transparent Justice',
    stance: 'Superhero Advocate',
    pollRating: 38,
    perksGranted: '+30% Police Dispatch Intel, -25% HQ Upgrade Construction costs, and +15% Public Approval gains.',
    campaignQuote: 'Our heroes are the shield that guards our future. City Hall should stand with them, not against them!',
    endorsed: true
  },
  {
    id: 'candidate-victor-vance',
    name: 'Victor Vance Sr.',
    title: 'Ex-Commissioner of Municipal Police',
    avatar: '👮‍♂️⚖️',
    platform: 'Zero Tolerance Law & Order & Anti-Vigilante Sanctions',
    stance: 'Law & Order Hardliner',
    pollRating: 34,
    perksGranted: 'Natural district crime rates decrease by 20%, but superhero suspicion increases twice as fast.',
    campaignQuote: 'Unaccountable masked vigilantes cannot replace the rule of law. Order must be restored by badge and law!',
    endorsed: false
  },
  {
    id: 'candidate-evelyn-cross',
    name: 'Evelyn Cross-Sterling',
    title: 'CEO of Apex Global Technologies',
    avatar: '💼🤖',
    platform: 'Smart-City Automation & High-Tech Infrastructure',
    stance: 'Corporate Technocrat',
    pollRating: 28,
    perksGranted: '+40% Day Job Salaries and +20% Gadget fabrication speed, but cyber-crime rates increase.',
    campaignQuote: 'Through innovation, automated defense grids, and corporate prosperity, Metro Nova will lead the world.',
    endorsed: false
  }
];

export const DISTRICT_REBUILDING_PROJECTS: DistrictRebuildingProject[] = [
  {
    id: 'proj-downtown-bridge',
    districtId: 'district-downtown',
    districtName: 'Downtown Metropolis',
    facilityName: 'Metro Central Sky-Bridge & Monorail',
    damageLevel: 65,
    repairCost: 1500,
    heroTokenCost: 3,
    civicRewardApproval: 15,
    isRepaired: false,
    description: 'Repair structural steel spans damaged during heavy battle with supervillains.'
  },
  {
    id: 'proj-docklands-filtration',
    districtId: 'district-docklands',
    districtName: 'The Iron Docklands',
    facilityName: 'Harbor Water & Chemical Detox Grid',
    damageLevel: 50,
    repairCost: 1200,
    heroTokenCost: 2,
    civicRewardApproval: 12,
    isRepaired: false,
    description: 'Cleanse contaminated runoff tanks following arms syndicate clashes.'
  },
  {
    id: 'proj-gothic-cathedral',
    districtId: 'district-gothic',
    districtName: 'Gothic Quarter & Asylum',
    facilityName: 'St. Jude Heritage Medical Clinic',
    damageLevel: 75,
    repairCost: 1800,
    heroTokenCost: 4,
    civicRewardApproval: 20,
    isRepaired: false,
    description: 'Restore emergency trauma center serving low-income families and asylum staff.'
  },
  {
    id: 'proj-neon-grid',
    districtId: 'district-neon',
    districtName: 'Neon District',
    facilityName: 'Holographic Communications Sub-Station',
    damageLevel: 40,
    repairCost: 1000,
    heroTokenCost: 2,
    civicRewardApproval: 10,
    isRepaired: false,
    description: 'Reboot fiber-optic relays disrupted by cybernetic EMP grenades.'
  }
];

export const PRESET_HEROES: HeroCharacter[] = [
  {
    id: 'hero-solaris',
    heroName: 'Solaris',
    civilianName: 'Marcus Bennett',
    origin: 'Cosmic Awakening',
    gender: 'masculine',
    tagline: 'The Radiant Guardian of Metro Nova',
    backstory: 'Infused with the solar heart of an interstellar flare during an orbital research mission, Marcus returned to Earth as a beacon of unstoppable solar radiance.',
    avatarIcon: '☀️',
    colors: {
      primary: '#FFD700',
      secondary: '#FF3B30',
      accent: '#FFFFFF'
    },
    level: 3,
    xp: 220,
    xpToNextLevel: 500,
    statPointsAvailable: 2,
    stats: {
      strength: 16,
      agility: 12,
      intellect: 14,
      fortitude: 18,
      willpower: 15,
      charisma: 16
    },
    baseHp: 160,
    currentHp: 160,
    maxHp: 160,
    baseEnergy: 100,
    currentEnergy: 100,
    maxEnergy: 100,
    superMeter: 35,
    armor: 15,
    alignment: 'Golden Age Paragon',
    alignmentScore: 65,
    reputation: 60,
    publicApproval: 82,
    identitySuspicion: 12,
    money: 1200,
    heroTokens: 5,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-solar-beam')!,
      ALL_POWERS.find(p => p.id === 'power-plasma-burst')!,
      ALL_POWERS.find(p => p.id === 'power-energy-shield')!,
      ALL_POWERS.find(p => p.id === 'power-supernova-blast')!
    ],
    equippedPowers: ['power-solar-beam', 'power-plasma-burst', 'power-energy-shield', 'power-supernova-blast'],
    inventory: [],
    sidekicks: [RECRUITABLE_SIDEKICKS[0]],
    activeSidekickId: 'sidekick-spark',
    milestones: DEFAULT_CIVILIAN_MILESTONES,
    job: {
      type: 'Research Scientist',
      title: 'Senior Astrophysicist at Helios Labs',
      salary: 850,
      intelBonus: 15,
      suspicionRisk: 8,
      workSatisfaction: 85,
      performance: 90,
      description: 'Analyze cosmic radiation data while secretly calibrating your own solar abilities.'
    },
    stress: 15,
    allianceId: 'alliance-apex'
  },
  {
    id: 'hero-nocturne',
    heroName: 'Nocturne',
    civilianName: 'Cassandra Vance',
    origin: 'Billionaire Vigilante',
    gender: 'feminine',
    tagline: 'The Silent Justice in the Dark',
    backstory: 'Heir to the Vance Industrial empire, Cassandra trained in martial mastery across six continents to avenge her father and dismantle corruption from the shadows.',
    avatarIcon: '🦇',
    colors: {
      primary: '#1E1E2E',
      secondary: '#00F0FF',
      accent: '#A0AEC0'
    },
    level: 3,
    xp: 280,
    xpToNextLevel: 500,
    statPointsAvailable: 2,
    stats: {
      strength: 13,
      agility: 18,
      intellect: 18,
      fortitude: 13,
      willpower: 16,
      charisma: 14
    },
    baseHp: 140,
    currentHp: 140,
    maxHp: 140,
    baseEnergy: 110,
    currentEnergy: 110,
    maxEnergy: 110,
    superMeter: 45,
    armor: 12,
    alignment: 'Urban Dark Vigilante',
    alignmentScore: 0,
    reputation: 25,
    publicApproval: 68,
    identitySuspicion: 20,
    money: 4500,
    heroTokens: 8,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-shadow-strike')!,
      ALL_POWERS.find(p => p.id === 'power-emp-grenade')!,
      ALL_POWERS.find(p => p.id === 'power-smoke-vanish')!,
      ALL_POWERS.find(p => p.id === 'power-assassin-blitz')!
    ],
    equippedPowers: ['power-shadow-strike', 'power-emp-grenade', 'power-smoke-vanish', 'power-assassin-blitz'],
    inventory: [],
    sidekicks: [RECRUITABLE_SIDEKICKS[1]],
    activeSidekickId: 'sidekick-nova-swift',
    milestones: DEFAULT_CIVILIAN_MILESTONES,
    job: {
      type: 'Tech CEO',
      title: 'CEO of Vance Dynamics',
      salary: 1800,
      intelBonus: 25,
      suspicionRisk: 18,
      workSatisfaction: 75,
      performance: 88,
      description: 'Manage boardrooms by day, diverting top-secret tactical prototypes for your night crusade.'
    },
    stress: 25,
    allianceId: 'alliance-street'
  },
  {
    id: 'hero-titanix',
    heroName: 'Titanix',
    civilianName: 'Derrick Hall',
    origin: 'Genetic Mutation',
    gender: 'masculine',
    tagline: 'The Unbreakable Juggernaut of Steel',
    backstory: 'Born with dense hyper-cellular muscle fibers and bone density harder than diamond, Derrick works as an EMT, saving lives both with defibrillators and sheer muscle.',
    avatarIcon: '🛡️',
    colors: {
      primary: '#E63946',
      secondary: '#457B9D',
      accent: '#F1FAEE'
    },
    level: 3,
    xp: 190,
    xpToNextLevel: 500,
    statPointsAvailable: 2,
    stats: {
      strength: 20,
      agility: 10,
      intellect: 11,
      fortitude: 20,
      willpower: 14,
      charisma: 12
    },
    baseHp: 190,
    currentHp: 190,
    maxHp: 190,
    baseEnergy: 90,
    currentEnergy: 90,
    maxEnergy: 90,
    superMeter: 20,
    armor: 25,
    alignment: 'Golden Age Paragon',
    alignmentScore: 70,
    reputation: 70,
    publicApproval: 88,
    identitySuspicion: 10,
    money: 850,
    heroTokens: 4,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-heavy-strike')!,
      ALL_POWERS.find(p => p.id === 'power-ground-slam')!,
      ALL_POWERS.find(p => p.id === 'power-iron-fortitude')!,
      ALL_POWERS.find(p => p.id === 'power-titanic-crush')!
    ],
    equippedPowers: ['power-heavy-strike', 'power-ground-slam', 'power-iron-fortitude', 'power-titanic-crush'],
    inventory: [],
    sidekicks: [RECRUITABLE_SIDEKICKS[2]],
    activeSidekickId: 'sidekick-shadow-kuroda',
    milestones: DEFAULT_CIVILIAN_MILESTONES,
    job: {
      type: 'Paramedic / Doctor',
      title: 'Senior Paramedic - Metro Central EMS',
      salary: 700,
      intelBonus: 10,
      suspicionRisk: 6,
      workSatisfaction: 90,
      performance: 95,
      description: 'First on the scene of accidents and villain attacks, rescuing victims in plain sight.'
    },
    stress: 20,
    allianceId: 'alliance-apex'
  },
  {
    id: 'hero-circuit-breaker',
    heroName: 'Circuit Breaker',
    civilianName: 'Maya Lin',
    origin: 'High-Tech Prodigy',
    gender: 'feminine',
    tagline: 'The Digital Storm over the Skyline',
    backstory: 'A prodigal cyberneticist who built her own powered exosuit with micro-missile arrays and cyber-disruption dampeners after her university lab was raided by cyber-terrorists.',
    avatarIcon: '⚡',
    colors: {
      primary: '#00F0FF',
      secondary: '#FFDE59',
      accent: '#111827'
    },
    level: 3,
    xp: 250,
    xpToNextLevel: 500,
    statPointsAvailable: 2,
    stats: {
      strength: 12,
      agility: 15,
      intellect: 19,
      fortitude: 14,
      willpower: 13,
      charisma: 14
    },
    baseHp: 145,
    currentHp: 145,
    maxHp: 145,
    baseEnergy: 120,
    currentEnergy: 120,
    maxEnergy: 120,
    superMeter: 30,
    armor: 18,
    alignment: 'Golden Age Paragon',
    alignmentScore: 50,
    reputation: 50,
    publicApproval: 78,
    identitySuspicion: 14,
    money: 1100,
    heroTokens: 6,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-emp-grenade')!,
      ALL_POWERS.find(p => p.id === 'power-micro-missiles')!,
      ALL_POWERS.find(p => p.id === 'power-nano-repair')!,
      ALL_POWERS.find(p => p.id === 'power-orbital-cannon')!
    ],
    equippedPowers: ['power-emp-grenade', 'power-micro-missiles', 'power-nano-repair', 'power-orbital-cannon'],
    inventory: [],
    sidekicks: [RECRUITABLE_SIDEKICKS[1]],
    activeSidekickId: 'sidekick-nova-swift',
    milestones: DEFAULT_CIVILIAN_MILESTONES,
    job: {
      type: 'Investigative Journalist',
      title: 'Tech Columnist at The Daily Chronicle',
      salary: 620,
      intelBonus: 22,
      suspicionRisk: 12,
      workSatisfaction: 80,
      performance: 85,
      description: 'Investigate corporate corruption and track villain movements under the cover of press credentials.'
    },
    stress: 18,
    allianceId: 'alliance-aegis'
  },
  {
    id: 'hero-dr-mythos',
    heroName: 'Dr. Mythos',
    civilianName: 'Julian Blackwood',
    origin: 'Arcane Pact',
    gender: 'masculine',
    tagline: 'Master of the Mystic Leylines',
    backstory: 'An antique scholar who unlocked the forbidden Grimoire of Aethelgard, gaining the power to bend eldritch dimensions and ward the mortal plane from cosmic horrors.',
    avatarIcon: '🔮',
    colors: {
      primary: '#8A2BE2',
      secondary: '#FFD700',
      accent: '#1A0B2E'
    },
    level: 3,
    xp: 210,
    xpToNextLevel: 500,
    statPointsAvailable: 2,
    stats: {
      strength: 10,
      agility: 12,
      intellect: 18,
      fortitude: 13,
      willpower: 19,
      charisma: 15
    },
    baseHp: 135,
    currentHp: 135,
    maxHp: 135,
    baseEnergy: 130,
    currentEnergy: 130,
    maxEnergy: 130,
    superMeter: 40,
    armor: 10,
    alignment: 'Urban Dark Vigilante',
    alignmentScore: 10,
    reputation: 40,
    publicApproval: 72,
    identitySuspicion: 15,
    money: 950,
    heroTokens: 5,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-eldritch-bolt')!,
      ALL_POWERS.find(p => p.id === 'power-astral-chains')!,
      ALL_POWERS.find(p => p.id === 'power-mystic-restoration')!,
      ALL_POWERS.find(p => p.id === 'power-cosmic-vortex')!
    ],
    equippedPowers: ['power-eldritch-bolt', 'power-astral-chains', 'power-mystic-restoration', 'power-cosmic-vortex'],
    inventory: [],
    sidekicks: [RECRUITABLE_SIDEKICKS[3]],
    activeSidekickId: 'sidekick-aura-mystic',
    milestones: DEFAULT_CIVILIAN_MILESTONES,
    job: {
      type: 'Independent Artist',
      title: 'Curator & Rare Antiquities Appraiser',
      salary: 580,
      intelBonus: 18,
      suspicionRisk: 5,
      workSatisfaction: 90,
      performance: 82,
      description: 'Examine ancient artifacts and arcane texts while uncovering supernatural conspiracies.'
    },
    stress: 12,
    allianceId: 'alliance-cosmic'
  }
];

export const PRESET_VILLAINS: VillainCharacter[] = [
  {
    id: 'villain-null-void',
    name: 'Null Void',
    alias: 'Victor Vance',
    dangerTier: 'City Scourge',
    category: 'Cosmic',
    backstory: 'Former particle physicist consumed by dark matter during an antimatter collider disaster. Believes the universe must return to peaceful absolute nothingness.',
    motive: 'Devour Metro Nova in a miniature black hole singularity.',
    stats: {
      strength: 14,
      agility: 15,
      intellect: 18,
      fortitude: 16,
      willpower: 18,
      charisma: 12
    },
    maxHp: 220,
    currentHp: 220,
    armor: 20,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-eldritch-bolt')!,
      ALL_POWERS.find(p => p.id === 'power-astral-chains')!,
      ALL_POWERS.find(p => p.id === 'power-cosmic-vortex')!
    ],
    avatarIcon: '🕳️',
    color: '#3B0764',
    status: 'Plotting',
    timesDefeated: 0,
    escapedCount: 1,
    nemesisScore: 35,
    grudgeLevel: 40,
    isNemesisPrime: true,
    breakoutRisk: 30,
    adaptations: [
      {
        type: 'Thermal Kinetic Coating',
        description: 'Absorbs 40% incoming Energy and Fire damage.',
        counterCategory: 'Energy'
      }
    ],
    defeatHistory: [],
    activeMasterplanId: 'plan-singularity',
    quips: [
      'Your light is merely a brief spark before eternal darkness!',
      'All atoms will bow before the void!',
      'You cannot punch an event horizon, hero!'
    ]
  },
  {
    id: 'villain-queen-pyre',
    name: 'Queen Pyre',
    alias: 'Ignacia Drake',
    dangerTier: 'Supervillain',
    category: 'Energy',
    backstory: 'A pyromancer who leads the Inferno Syndicate, ruling the underground black market with an iron and fiery fist.',
    motive: 'Extort the city government by threatening to ignite the subterranean fuel reserves.',
    stats: {
      strength: 12,
      agility: 16,
      intellect: 15,
      fortitude: 14,
      willpower: 16,
      charisma: 17
    },
    maxHp: 180,
    currentHp: 180,
    armor: 14,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-solar-beam')!,
      ALL_POWERS.find(p => p.id === 'power-plasma-burst')!,
      ALL_POWERS.find(p => p.id === 'power-supernova-blast')!
    ],
    avatarIcon: '🔥',
    color: '#DC2626',
    status: 'At Large',
    timesDefeated: 1,
    escapedCount: 1,
    nemesisScore: 30,
    grudgeLevel: 55,
    breakoutRisk: 45,
    adaptations: [
      {
        type: 'Reflex Neural Enhancers',
        description: '+25% Evasion against physical strikes.',
        counterCategory: 'Agility'
      }
    ],
    defeatHistory: [
      {
        day: 1,
        heroName: 'Solaris',
        primaryPowerUsed: 'Solar Beam',
        injuryInflicted: 'Third-degree retinal burn on right eye'
      }
    ],
    activeMasterplanId: 'plan-inferno',
    quips: [
      'Is it getting warm in here, or is that just your impending defeat?',
      'Metro Nova was built to burn!',
      'Bow before the queen of flames!'
    ]
  },
  {
    id: 'villain-cyber-gorgon',
    name: 'Cyber-Gorgon',
    alias: 'Dr. Evelyn Cross',
    dangerTier: 'Supervillain',
    category: 'Tech',
    backstory: 'An outcast cybernetics researcher who replaced her organic nervous system with a self-evolving neural network and venomous micro-drones.',
    motive: 'Infect the city\'s central AI grid and convert citizens into augmented drones.',
    stats: {
      strength: 15,
      agility: 14,
      intellect: 20,
      fortitude: 15,
      willpower: 14,
      charisma: 11
    },
    maxHp: 195,
    currentHp: 195,
    armor: 22,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-emp-grenade')!,
      ALL_POWERS.find(p => p.id === 'power-micro-missiles')!,
      ALL_POWERS.find(p => p.id === 'power-orbital-cannon')!
    ],
    avatarIcon: '🤖',
    color: '#059669',
    status: 'At Large',
    timesDefeated: 0,
    escapedCount: 0,
    nemesisScore: 25,
    grudgeLevel: 20,
    breakoutRisk: 25,
    adaptations: [
      {
        type: 'Anti-EM Faraday Plating',
        description: 'Immune to Stun and -40% Tech damage.',
        counterCategory: 'Tech'
      }
    ],
    defeatHistory: [],
    activeMasterplanId: 'plan-grid-lock',
    quips: [
      'Flesh is weak. Logic is eternal.',
      'Analyzing attack vector... probability of your survival: 0.04%.',
      'Uploading your obsolescence now.'
    ]
  },
  {
    id: 'villain-iron-juggernaut',
    name: 'Iron Juggernaut',
    alias: 'Boris Vance',
    dangerTier: 'Local Menace',
    category: 'Brawn',
    backstory: 'A disgraced mercenary clad in heavy hydraulic power-armor, specialized in high-risk armored bank heists and demolitions.',
    motive: 'Rob the Federal Depository and crush any cape who dares stand in his path.',
    stats: {
      strength: 19,
      agility: 9,
      intellect: 10,
      fortitude: 19,
      willpower: 13,
      charisma: 10
    },
    maxHp: 210,
    currentHp: 210,
    armor: 30,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-heavy-strike')!,
      ALL_POWERS.find(p => p.id === 'power-ground-slam')!,
      ALL_POWERS.find(p => p.id === 'power-iron-fortitude')!
    ],
    avatarIcon: '🦾',
    color: '#4B5563',
    status: 'At Large',
    timesDefeated: 0,
    escapedCount: 0,
    nemesisScore: 15,
    grudgeLevel: 15,
    breakoutRisk: 20,
    adaptations: [
      {
        type: 'Hydraulic Muscle Weave',
        description: '-40% damage from Melee & Brawn attacks.',
        counterCategory: 'Brawn'
      }
    ],
    defeatHistory: [],
    quips: [
      'You\'re like a fly on my reinforced titanium plating!',
      'Time to smash some superhero skulls!',
      'Out of my way, runt!'
    ]
  },
  {
    id: 'villain-madame-mirage',
    name: 'Madame Mirage',
    alias: 'Selene Moreau',
    dangerTier: 'Supervillain',
    category: 'Psionic',
    backstory: 'A master psionic illusionist and international jewel thief who manipulates memories and bends sensory reality to execute impossible heists.',
    motive: 'Steal the Astral Diamond and frame the city\'s superhero league for the crime.',
    stats: {
      strength: 10,
      agility: 18,
      intellect: 17,
      fortitude: 12,
      willpower: 19,
      charisma: 18
    },
    maxHp: 165,
    currentHp: 165,
    armor: 12,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-mind-flay')!,
      ALL_POWERS.find(p => p.id === 'power-smoke-vanish')!,
      ALL_POWERS.find(p => p.id === 'power-psychic-cataclysm')!
    ],
    avatarIcon: '🎭',
    color: '#9333EA',
    status: 'At Large',
    timesDefeated: 0,
    escapedCount: 0,
    nemesisScore: 20,
    grudgeLevel: 10,
    breakoutRisk: 35,
    adaptations: [
      {
        type: 'Obsidian Mind Aegis',
        description: 'Immune to Confusion and -40% Psionic damage.',
        counterCategory: 'Psionic'
      }
    ],
    defeatHistory: [],
    quips: [
      'Are you sure what you are seeing is real?',
      'A hero blinded by their own self-righteous illusions.',
      'You struck a phantom, darling.'
    ]
  },
  {
    id: 'villain-chronos-master',
    name: 'Chronos Master',
    alias: 'Professor Tiberius Vance',
    dangerTier: 'Cosmic Threat',
    category: 'Tech',
    backstory: 'A mad temporal physicist who created a localized tachyon time-distortion harness to manipulate entropy and conquer all timelines.',
    motive: 'Rewind Metro Nova to 1920 to rule it as an immortal temporal monarch.',
    stats: {
      strength: 11,
      agility: 19,
      intellect: 20,
      fortitude: 15,
      willpower: 17,
      charisma: 15
    },
    maxHp: 240,
    currentHp: 240,
    armor: 22,
    powers: [
      ALL_POWERS.find(p => p.id === 'power-lightning-kick')!,
      ALL_POWERS.find(p => p.id === 'power-orbital-cannon')!,
      ALL_POWERS.find(p => p.id === 'power-astral-chains')!
    ],
    avatarIcon: '⏳',
    color: '#CA8A04',
    status: 'Plotting',
    timesDefeated: 0,
    escapedCount: 0,
    nemesisScore: 40,
    grudgeLevel: 50,
    breakoutRisk: 50,
    adaptations: [
      {
        type: 'Runic Warding Glyphs',
        description: '-40% damage from Arcane and Mystic spells.',
        counterCategory: 'Mystic'
      }
    ],
    defeatHistory: [],
    quips: [
      'I have already seen every move you will ever make.',
      'Your defeat was written three minutes ago in my ledger.',
      'Time ticks onward, hero!'
    ]
  }
];

export const MEGA_CRISES: MegaCrisisEvent[] = [
  {
    id: 'crisis-dark-sun',
    title: 'THE BLACK SUN INCURSION',
    codename: 'CRISIS CODE: OBLIVION DAWN',
    description: 'An extraterrestrial dreadnought fleet under the command of Null Void has enveloped the upper atmosphere of Metro Nova, threatening to trigger a permanent dark matter eclipse!',
    type: 'CosmicSingularity',
    threatLevel: 35,
    isActive: true,
    resolved: false,
    currentStageIndex: 0,
    participatingVillains: ['villain-null-void', 'villain-queen-pyre'],
    affectedDistricts: ['district-downtown', 'district-underbelly', 'district-tech-park'],
    loreHeadline: 'COSMIC ANOMALY COVERS SKY: MAYOR DECLARES MARTIAL LAW',
    rewards: {
      xp: 2500,
      money: 10000,
      approval: 45,
      heroTokens: 25,
      commemorativeBadge: '🌟 Savior of the Black Sun Crossover'
    },
    stages: [
      {
        id: 'stage-1',
        name: 'Stage I: Downtown Civilian Evacuation & Shield Defenses',
        description: 'Evacuate 500 pinned civilians from collapsing skyscrapers and establish hard-light perimeter shields.',
        objectiveType: 'Evacuate',
        targetCount: 3,
        currentCount: 0,
        completed: false
      },
      {
        id: 'stage-2',
        name: 'Stage II: Dismantle the Dark Tachyon Generators',
        description: 'Raid the subterranean energy nodes powering the orbital invasion beam.',
        objectiveType: 'Combat',
        targetCount: 2,
        currentCount: 0,
        completed: false
      },
      {
        id: 'stage-3',
        name: 'Stage III: Alliance Orbital Flagship Strike (Climax)',
        description: 'Board the Dreadnought flagship with your alliance team and defeat Null Void in an epic showdown!',
        objectiveType: 'Combat',
        targetCount: 1,
        currentCount: 0,
        bossVillainId: 'villain-null-void',
        completed: false
      }
    ]
  },
  {
    id: 'crisis-nanite-surge',
    title: 'PROJECT GORGONNET: NANITE PLAGUEWAVE',
    codename: 'CRISIS CODE: CYBER-APOCALYPSE',
    description: 'Cyber-Gorgon has transmitted an infectious neural virus across the municipal smart-grid, converting city police mechs and transit trains into autonomous kill-bots.',
    type: 'CyberPlague',
    threatLevel: 20,
    isActive: false,
    resolved: false,
    currentStageIndex: 0,
    participatingVillains: ['villain-cyber-gorgon', 'villain-iron-juggernaut'],
    affectedDistricts: ['district-tech-park', 'district-neon', 'district-docklands'],
    loreHeadline: 'ROGUE AUTOMATED DEFENSES TURN AGAINST CIVILIANS',
    rewards: {
      xp: 2200,
      money: 8500,
      approval: 40,
      heroTokens: 20,
      commemorativeBadge: '⚡ Circuit Savior Medal'
    },
    stages: [
      {
        id: 'stage-gorgon-1',
        name: 'Stage I: Neutralize Infected Mech Patrols',
        description: 'Defeat 4 rogue cybernetic heavy drones rampaging through the Neon District.',
        objectiveType: 'Combat',
        targetCount: 4,
        currentCount: 0,
        completed: false
      },
      {
        id: 'stage-gorgon-2',
        name: 'Stage II: Upload EMP Firewall to Central Mainframe',
        description: 'Infiltrate Aero-Tech Park and upload the countermeasures.',
        objectiveType: 'Investigation',
        targetCount: 2,
        currentCount: 0,
        completed: false
      },
      {
        id: 'stage-gorgon-3',
        name: 'Stage III: Confront Cyber-Gorgon Prime at the Apex Core',
        description: 'Engage Cyber-Gorgon in the heart of the infected supercomputer chamber.',
        objectiveType: 'Combat',
        targetCount: 1,
        currentCount: 0,
        bossVillainId: 'villain-cyber-gorgon',
        completed: false
      }
    ]
  }
];

export const DISTRICTS: District[] = [
  {
    id: 'district-downtown',
    name: 'Downtown Metropolis',
    theme: 'Glass skyscrapers, financial towers, media headquarters, and crowded avenues.',
    crimeRate: 35,
    dangerLevel: 'Medium',
    patrolCostEnergy: 15,
    description: 'The bustling heart of Metro Nova. High public visibility, massive comic press exposure, but bank heists and hostage crises are frequent.',
    bgGradient: 'from-blue-900 to-indigo-950',
    iconName: 'Building2'
  },
  {
    id: 'district-docklands',
    name: 'The Iron Docklands',
    theme: 'Heavy industrial shipping yards, rusting cranes, cargo warehouses, and shadowy docks.',
    crimeRate: 58,
    dangerLevel: 'High',
    patrolCostEnergy: 20,
    description: 'A hotbed for arms smuggling, illicit tech trafficking, and brute mob enforcers.',
    bgGradient: 'from-zinc-900 to-slate-950',
    iconName: 'Anchor'
  },
  {
    id: 'district-neon',
    name: 'Neon District',
    theme: 'Cyberpunk glow, holographic billboards, underground clubs, and high-tech black markets.',
    crimeRate: 45,
    dangerLevel: 'Medium',
    patrolCostEnergy: 15,
    description: 'Vibrant nightlife paired with data heists, neural hacking, and flashy rogue turf wars.',
    bgGradient: 'from-purple-950 to-pink-950',
    iconName: 'Sparkles'
  },
  {
    id: 'district-gothic',
    name: 'Gothic Quarter & Asylum',
    theme: 'Victorian gargoyles, mist-draped alleys, ancient cathedrals, and the maximum-security Blackgate Asylum.',
    crimeRate: 68,
    dangerLevel: 'High',
    patrolCostEnergy: 22,
    description: 'Occult rituals, supervillain breakout attempts, and psychological terror lurk behind every foggy corner.',
    bgGradient: 'from-red-950 to-stone-950',
    iconName: 'Skull'
  },
  {
    id: 'district-tech-park',
    name: 'Aero-Tech Research Park',
    theme: 'Clean minimalist science campuses, fusion generators, cleanrooms, and orbital transport pads.',
    crimeRate: 25,
    dangerLevel: 'Low',
    patrolCostEnergy: 15,
    description: 'Frequent target of corporate espionage, high-end power prototype thefts, and rogue AI meltdowns.',
    bgGradient: 'from-cyan-950 to-blue-950',
    iconName: 'Cpu'
  },
  {
    id: 'district-underbelly',
    name: 'Subterranean Underbelly',
    theme: 'Abandoned subway tunnels, radioactive runoff conduits, toxic subterranean bunkers.',
    crimeRate: 75,
    dangerLevel: 'Extreme',
    patrolCostEnergy: 25,
    description: 'The lawless subterranean frontier where mutated renegades and exiled supervillains build doomsday machines.',
    bgGradient: 'from-emerald-950 to-neutral-950',
    iconName: 'Flame'
  }
];

export const MASTERPLANS: Masterplan[] = [
  {
    id: 'plan-singularity',
    villainId: 'villain-null-void',
    name: 'Operation Dark Horizon: Singularity Event',
    description: 'Null Void is stealing high-energy tachyon cores to trigger an artificial dark matter rift beneath Downtown.',
    progress: 45,
    cluesDiscovered: 1,
    maxClues: 4,
    districtId: 'district-downtown',
    doomPenalty: 'Downtown suffers catastrophic destruction and Public Approval drops by 40%.',
    bossEncounterReady: false,
    rewardMoney: 3000,
    rewardXp: 800,
    rewardTokens: 10
  },
  {
    id: 'plan-inferno',
    villainId: 'villain-queen-pyre',
    name: 'Wildfire Extortion: Sub-City Conflagration',
    description: 'Queen Pyre has rigged the natural gas mains in the Docklands with incendiary thermite charges.',
    progress: 30,
    cluesDiscovered: 2,
    maxClues: 3,
    districtId: 'district-docklands',
    doomPenalty: 'Docklands infrastructure collapses, crippling city economy and player daily salary.',
    bossEncounterReady: false,
    rewardMoney: 2200,
    rewardXp: 600,
    rewardTokens: 8
  },
  {
    id: 'plan-grid-lock',
    villainId: 'villain-cyber-gorgon',
    name: 'Neural Lockdown: Project GorgonNet',
    description: 'Cyber-Gorgon is compiling a viral backdoor into the Aero-Tech mainframe to enslave all city cybernetics.',
    progress: 20,
    cluesDiscovered: 0,
    maxClues: 4,
    districtId: 'district-tech-park',
    doomPenalty: 'All high-tech equipment jammed and city emergency response paralyzed.',
    bossEncounterReady: false,
    rewardMoney: 2500,
    rewardXp: 650,
    rewardTokens: 8
  }
];

export const ALLIANCES: Alliance[] = [
  {
    id: 'alliance-apex',
    name: 'The Apex Vanguard',
    motto: 'By Vigilance, We Illuminate the Horizon.',
    headquarters: 'Apex Citadel, Orbiting Sky-Tower',
    leader: 'Solaris',
    members: ['Solaris', 'Titanix', 'Zephyr'],
    reputation: 92,
    perk: '+15% Maximum Health & +20% Public Approval gains from heroic deeds.',
    icon: 'Shield',
    bannerColor: '#FFD700'
  },
  {
    id: 'alliance-street',
    name: 'Street Knights Coalition',
    motto: 'No Shadow Darker Than Our Resolve.',
    headquarters: 'The Belfry, Gothic Quarter',
    leader: 'Nocturne',
    members: ['Nocturne', 'Phantom Blade', 'Vanguard Ronin'],
    reputation: 74,
    perk: '+20% Critical Strike Chance and +25% Clue Discovery during patrols.',
    icon: 'Moon',
    bannerColor: '#00F0FF'
  },
  {
    id: 'alliance-aegis',
    name: 'Aegis Tech Syndicate',
    motto: 'Tomorrow’s Defense, Engineered Today.',
    headquarters: 'Helix Labs R&D Complex',
    leader: 'Circuit Breaker',
    members: ['Circuit Breaker', 'Pulse Vector', 'Exo-Centurion'],
    reputation: 80,
    perk: '+20 Max Energy and 15% discount on all HQ upgrades & gadgets.',
    icon: 'Zap',
    bannerColor: '#3B82F6'
  },
  {
    id: 'alliance-cosmic',
    name: 'The Arcane Enclave',
    motto: 'Guardians Beyond the Veiled Veil.',
    headquarters: 'Sanctum Arcanum',
    leader: 'Dr. Mythos',
    members: ['Dr. Mythos', 'Madame Astral', 'Spellweaver'],
    reputation: 85,
    perk: '+25% Resistance to all negative status effects and +30% Super Meter charge rate.',
    icon: 'Sparkle',
    bannerColor: '#8A2BE2'
  }
];

export const RELATIONSHIPS: Relationship[] = [
  {
    id: 'rel-sidekick-spark',
    name: 'Kit "Spark" Morales',
    role: 'Sidekick',
    affinity: 70,
    trustLevel: 'Trusted Ally',
    knowsSecretIdentity: true,
    avatar: '👦⚡',
    backstory: 'An eager teenage electro-kinetic speedster you took under your wing after saving his neighborhood.',
    perkDescription: 'Can be summoned to assist in combat, providing an extra attack each round.',
    lastInteractedDay: 1
  },
  {
    id: 'rel-civilian-chloe',
    name: 'Chloe Rivera',
    role: 'Civilian Friend',
    affinity: 85,
    trustLevel: 'Confidant',
    knowsSecretIdentity: true,
    avatar: '👩🎨',
    backstory: 'Your childhood best friend and local coffee shop owner who provides emotional support and grounds you in normal life.',
    perkDescription: 'Spending time together reduces Hero Stress by 50% and reduces Identity Suspicion by 15%.',
    lastInteractedDay: 1
  },
  {
    id: 'rel-reporter-vance',
    name: 'Liam Vance',
    role: 'Journalist Rival',
    affinity: 40,
    trustLevel: 'Acquaintance',
    knowsSecretIdentity: false,
    avatar: '📰🧑',
    backstory: 'A cynical Pulitzer-winning investigative journalist constantly digging into your civilian alibis.',
    perkDescription: 'Feeding exclusive scoops boosts Comic Issue sales by 30% and keeps media favor high.',
    lastInteractedDay: 1
  },
  {
    id: 'rel-police-chief-ramirez',
    name: 'Captain Elena Ramirez',
    role: 'Police Chief',
    affinity: 65,
    trustLevel: 'Trusted Ally',
    knowsSecretIdentity: false,
    avatar: '👮‍♀️🚨',
    backstory: 'A tough, honest precinct commander who secretly cooperates with capes to bypass corrupt bureaucracy.',
    perkDescription: 'Provides prioritized dispatch intel, revealing Masterplan Clues 50% faster during patrols.',
    lastInteractedDay: 1
  },
  {
    id: 'rel-love-interest-elena',
    name: 'Dr. Sarah Sterling',
    role: 'Love Interest',
    affinity: 60,
    trustLevel: 'Trusted Ally',
    knowsSecretIdentity: false,
    avatar: '🩺👩‍⚕️',
    backstory: 'Chief ER Trauma Surgeon at Metro General who repeatedly stitches up injured vigilantes and civilians alike.',
    perkDescription: 'Provides free emergency medical supplies, auto-healing 30% HP after difficult combats.',
    lastInteractedDay: 1
  }
];

export const HQ_UPGRADES: HQUpgrade[] = [
  {
    id: 'hq-supercomputer',
    name: 'Mainframe AI Supercomputer (Cerebro-Core)',
    level: 1,
    maxLevel: 5,
    cost: 800,
    tokenCost: 2,
    category: 'Tech',
    description: 'Monitors police bands, encrypted criminal comms, and satellite imagery across Metro Nova.',
    currentBenefit: '+10% chance to detect active villain masterplan clues during patrols.',
    nextBenefit: '+20% clue detection and unlocks District Danger Forecasts.',
    icon: 'Server'
  },
  {
    id: 'hq-danger-room',
    name: 'Holographic Combat Simulator (Danger Room)',
    level: 1,
    maxLevel: 5,
    cost: 1000,
    tokenCost: 3,
    category: 'Training',
    description: 'A hard-light combat simulator to test battle tactics and power synergies without injury.',
    currentBenefit: '+15% bonus XP gained from all combat encounters.',
    nextBenefit: '+30% bonus XP and grants +1 Stat Point upon upgrading.',
    icon: 'Dumbbell'
  },
  {
    id: 'hq-med-bay',
    name: 'Cryo-Regeneration Medical Bay',
    level: 1,
    maxLevel: 5,
    cost: 750,
    tokenCost: 2,
    category: 'Medical',
    description: 'Equipped with rapid cell-regenerating biocams and detox synthesizers.',
    currentBenefit: 'Recover +25% Health each day cycle and cures trauma fatigue.',
    nextBenefit: 'Recover +50% Health each day and grants automatic combat revive at 25% HP once per week.',
    icon: 'HeartPulse'
  },
  {
    id: 'hq-armory',
    name: 'Advanced Weapons & Suit Armory',
    level: 1,
    maxLevel: 5,
    cost: 1200,
    tokenCost: 4,
    category: 'Tech',
    description: 'Precision machining stations for suit composite weaving and tactical gadget fabrication.',
    currentBenefit: '+10 Base Armor and unlocks Tier II Gadget craft.',
    nextBenefit: '+20 Base Armor and +10% Power Damage output.',
    icon: 'ShieldCheck'
  },
  {
    id: 'hq-trophy-room',
    name: 'Hall of Victory & Comic Archives',
    level: 1,
    maxLevel: 5,
    cost: 600,
    tokenCost: 2,
    category: 'Defense',
    description: 'Displays defeated villain gear, framed historic comic covers, and citizen thank-you awards.',
    currentBenefit: '+15% Fame and Comic Book Issue Sales revenue.',
    nextBenefit: '+30% Fame, +25% Comic Royalties, and boosts Hero Morale.',
    icon: 'Trophy'
  },
  {
    id: 'hq-teleporter',
    name: 'Quantum Displacement Teleporter Pad',
    level: 0,
    maxLevel: 3,
    cost: 2000,
    tokenCost: 5,
    category: 'Transport',
    description: 'Instant transit beam across all city districts, bypassing traffic and ambush threats.',
    currentBenefit: 'Not built yet (Costs 0 Energy to travel between districts when active).',
    nextBenefit: 'Patrol Energy costs reduced by 50% across all districts.',
    icon: 'Zap'
  }
];

export const SHOP_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-kevlar-weave',
    name: 'Titanium-Kevlar Undersuit',
    slot: 'Suit',
    statBonuses: { fortitude: 3 },
    bonusHp: 25,
    bonusArmor: 8,
    cost: 600,
    unlocked: true,
    equipped: false,
    description: 'Lightweight ballistic weave that softens heavy kinetic blows and blade strikes.',
    iconName: 'Shield'
  },
  {
    id: 'eq-tactical-visor',
    name: 'Thermal HUD Tactical Visor',
    slot: 'Mask',
    statBonuses: { intellect: 3, agility: 2 },
    cost: 750,
    unlocked: true,
    equipped: false,
    description: 'Monitors opponent vital signs and calculates trajectory paths to boost accuracy.',
    iconName: 'Eye'
  },
  {
    id: 'eq-shock-gauntlets',
    name: 'Volt-Discharge Gauntlets',
    slot: 'Gadget',
    statBonuses: { strength: 3 },
    bonusEnergy: 15,
    cost: 850,
    unlocked: true,
    equipped: false,
    description: 'Gauntlets that channel 50,000 volts into melee strikes, shocking armored foes.',
    iconName: 'Zap'
  },
  {
    id: 'eq-stealth-glider',
    name: 'Shadow-Glide Cape',
    slot: 'Suit',
    statBonuses: { agility: 4 },
    bonusHp: 15,
    cost: 900,
    unlocked: true,
    equipped: false,
    description: 'Aerodynamic memory fabric allows silent gliding between skyscrapers.',
    iconName: 'Wind'
  },
  {
    id: 'eq-apex-motorcycle',
    name: 'Apex Turbo Cycle',
    slot: 'Vehicle',
    statBonuses: { agility: 3, charisma: 3 },
    cost: 1600,
    unlocked: true,
    equipped: false,
    description: 'Rocket-boosted stealth motorcycle that allows rapid crime scene arrivals and turns heads.',
    iconName: 'Car'
  },
  {
    id: 'eq-chronos-pendant',
    name: 'Amulet of the Leylines',
    slot: 'Relic',
    statBonuses: { willpower: 4, intellect: 2 },
    bonusEnergy: 30,
    cost: 1400,
    unlocked: true,
    equipped: false,
    description: 'An ancient obsidian relic that resonates with mystic energies to restore power faster.',
    iconName: 'Sparkles'
  }
];

export const ORIGIN_STORIES = [
  {
    origin: 'Cosmic Awakening' as OriginArchetype,
    title: 'Interstellar Destiny',
    summary: 'A freak solar flare or alien artifact infused you with celestial energy.',
    primaryStats: 'Fortitude +3, Willpower +3, Strength +2',
    startingPowers: ['Solar Beam', 'Photon Barrier'],
    lore: 'You were an ordinary person until an anomaly in the night sky chose you. Radiant light flows through your veins, demanding you stand as a guardian of Earth.'
  },
  {
    origin: 'Billionaire Vigilante' as OriginArchetype,
    title: 'The Dark Crusade',
    summary: 'Armed with vast wealth, peak human intellect, and cutting-edge military tech.',
    primaryStats: 'Intellect +4, Agility +3, Charisma +2',
    startingPowers: ['Shadow Flurry', 'Volt EMP Grenade'],
    lore: 'Tragedy took someone you loved in an alleyway. You swore an oath: never again will the innocent suffer while corrupt barons sleep soundly in their penthouses.'
  },
  {
    origin: 'Genetic Mutation' as OriginArchetype,
    title: 'Evolutionary Leap',
    summary: 'A spontaneous DNA divergence unlocked superhuman strength and impenetrable skin.',
    primaryStats: 'Strength +4, Fortitude +4',
    startingPowers: ['Meteor Punch', 'Adamantine Stance'],
    lore: 'As adolescence struck, your body changed. Metal bent against your skin; buildings shook when you jumped. You chose to use your unnatural power for good.'
  },
  {
    origin: 'Arcane Pact' as OriginArchetype,
    title: 'The Ancient Mystery',
    summary: 'Initiated into the occult arts by an ancient grimoire or mystical mentor.',
    primaryStats: 'Intellect +3, Willpower +4, Charisma +2',
    startingPowers: ['Eldritch Flame', 'Sanctuary Ward'],
    lore: 'You opened a door between realms that was never meant to be unlocked. Now the mystic mantle rests on your shoulders to banish shadowy horrors.'
  },
  {
    origin: 'High-Tech Prodigy' as OriginArchetype,
    title: 'The Cyber Architect',
    summary: 'A genius inventor who built their own exoskeleton armor and weapon systems.',
    primaryStats: 'Intellect +5, Agility +2, Fortitude +2',
    startingPowers: ['Swarm Micro-Missiles', 'Nanite Infusion'],
    lore: 'Why wait for the gods when human ingenuity can conquer anything? With your custom suit of powered armor, you take to the skies.'
  },
  {
    origin: 'Street Brawler' as OriginArchetype,
    title: 'Champion of the Blocks',
    summary: 'Master martial artist with iron willpower, defending everyday folks in the trenches.',
    primaryStats: 'Agility +4, Strength +3, Fortitude +2',
    startingPowers: ['Hyper-Sonic Sweep', 'Smoke Shroud Evade'],
    lore: 'You grew up fighting for every breath in the toughest neighborhood. Now you fight with lethal martial arts precision to keep your streets safe.'
  }
];

export const DAY_JOBS: DayJob[] = [
  {
    type: 'Investigative Journalist',
    title: 'Investigative Reporter - Metro Daily',
    salary: 650,
    intelBonus: 25,
    suspicionRisk: 12,
    workSatisfaction: 80,
    performance: 80,
    description: 'Uncover criminal rings and interview corrupt politicians while digging for villain clues.'
  },
  {
    type: 'Tech CEO',
    title: 'Chief Executive Officer - Apex Solutions',
    salary: 2200,
    intelBonus: 15,
    suspicionRisk: 22,
    workSatisfaction: 70,
    performance: 85,
    description: 'Manage massive corporate capital and divert secret R&D resources to your superhero crusade.'
  },
  {
    type: 'Paramedic / Doctor',
    title: 'Senior Emergency Physician - Metro Central',
    salary: 800,
    intelBonus: 12,
    suspicionRisk: 6,
    workSatisfaction: 90,
    performance: 90,
    description: 'Save lives in the ER by day, witnessing first-hand the collateral damage of supervillain rampages.'
  },
  {
    type: 'Forensic Detective',
    title: 'Lead Crime Scene Investigator - MCPD',
    salary: 720,
    intelBonus: 30,
    suspicionRisk: 15,
    workSatisfaction: 85,
    performance: 88,
    description: 'Analyze ballistic traces, mutant DNA samples, and villain calling cards before anyone else.'
  },
  {
    type: 'High School Teacher',
    title: 'Science & Physics Educator - Metro High',
    salary: 480,
    intelBonus: 5,
    suspicionRisk: 4,
    workSatisfaction: 85,
    performance: 92,
    description: 'Inspire the next generation while maintaining a quiet, unassuming civilian identity.'
  },
  {
    type: 'Café Barista',
    title: 'Head Barista - Roaster’s Haven',
    salary: 350,
    intelBonus: 10,
    suspicionRisk: 2,
    workSatisfaction: 75,
    performance: 95,
    description: 'Low-profile and casual. Perfect for overhearing street gossip and civilian rumors.'
  },
  {
    type: 'Research Scientist',
    title: 'Lead Particle Physicist - Quantum Corp',
    salary: 950,
    intelBonus: 20,
    suspicionRisk: 10,
    workSatisfaction: 90,
    performance: 86,
    description: 'Work with supercomputers, quantum colliders, and advanced energy shields.'
  }
];

export const INITIAL_NEWS_ITEMS = [
  {
    id: 'news-1',
    day: 1,
    headline: 'CRIME WAVE SWEEPS METRO NOVA: MAYOR CALLS FOR HEROIC ALLIANCE',
    district: 'Downtown Metropolis',
    category: 'Crime' as const,
    snippet: 'With syndicate activities rising in the Docklands and strange energy spikes detected near the Quantum collider, citizens call for caped protectors.',
    isBreaking: true
  },
  {
    id: 'news-2',
    day: 1,
    headline: 'APEX VANGUARD PATROL BOOSTS CIVIC MORALE',
    district: 'Neon District',
    category: 'Heroism' as const,
    snippet: 'Recent crime statistics show a 22% drop in armed muggings following coordinated superhero patrols.',
    isBreaking: false
  },
  {
    id: 'news-3',
    day: 1,
    headline: 'BLACKGATE ASYLUM REINFORCES SECURITY GRID AFTER RUMORED ESCAPE PLOT',
    district: 'Gothic Quarter & Asylum',
    category: 'Crisis' as const,
    snippet: 'Warden Vance assures the public that containment fields for high-tier supervillains remain fully operational.',
    isBreaking: false
  }
];

export const LEGACY_HEIRLOOMS = [
  {
    id: 'heirloom-solar-crest',
    name: 'The Aegis Solar Crest of Epochs',
    slot: 'Relic' as const,
    bonusStats: { fortitude: 4, willpower: 3 },
    perkEffect: '+30 Max HP, +15 Max Energy, and +20% Super Meter charge rate from all actions.',
    lore: 'Passed down from the founding champions of the Apex Vanguard. Resonates with generational heroic determination.',
    icon: '☀️'
  },
  {
    id: 'heirloom-shadow-cloak',
    name: 'Vanguard Shadow Weave Cloak',
    slot: 'Suit' as const,
    bonusStats: { agility: 5, intellect: 2 },
    perkEffect: '+15 Base Armor, +25% Evasion, and grants free Smoke Shroud on turn 1 of every combat.',
    lore: 'Woven from sound-dampening memory fibers tested across decades of midnight vigilantism.',
    icon: '🦇'
  },
  {
    id: 'heirloom-cerebro-visor',
    name: 'Cerebro-Core Quantum HUD Visor',
    slot: 'Mask' as const,
    bonusStats: { intellect: 5, charisma: 2 },
    perkEffect: '+30 AP capacity, +35% Clue Discovery, and reveals enemy weak points instantly.',
    lore: 'An advanced tactical optic synced directly with the city’s mainframe supercomputer.',
    icon: '👁️'
  },
  {
    id: 'heirloom-titan-gauntlets',
    name: 'Adamantine Kinetic Crush Gauntlets',
    slot: 'Gadget' as const,
    bonusStats: { strength: 5, fortitude: 2 },
    perkEffect: '+20 Melee Damage, +15% Critical Strike Chance, and punches ignore 30% enemy armor.',
    lore: 'Hydraulic kinetic servos that magnify the bearer’s physical force tenfold.',
    icon: '🥊'
  }
];

export const MULTIVERSE_TIMELINES = [
  {
    id: 'timeline-omega-tyrant',
    name: 'Earth-Omega: Cyber-Dystopia',
    universeCode: 'EARTH-Ω-902',
    description: 'A timeline where the Apex Vanguard fell, and an authoritarian sun-god crowned himself eternal emperor.',
    threatLevel: 45,
    bossVariant: {
      name: 'Emperor Solaris Rex',
      title: 'Tyrant Solar Imperator',
      origin: 'Corrupted Cosmic Godhood',
      hp: 350,
      attack: 28,
      defense: 25,
      powers: ['Solar Beam', 'Plasma Burst', 'Supernova Genesis'],
      avatar: '👑☀️',
      color: '#FF8C00',
      dialogue: 'Order requires absolute rule! This timeline shall kneel as mine did!'
    },
    riftOpen: true,
    defeated: false,
    shardReward: 50,
    uniqueCostumeReward: '👑 Imperial Sol Invictus Mantle',
    recruitedChampion: 'Rebel Cyber-Nocturne'
  },
  {
    id: 'timeline-nether-inquisition',
    name: 'Earth-Nether: The Inverted Void',
    universeCode: 'EARTH-Ψ-660',
    description: 'A dark dimension where arcane magic devoured civilization and the Grimoire purged the light.',
    threatLevel: 50,
    bossVariant: {
      name: 'Grand Inquisitor Dr. Mythos',
      title: 'Arch-Purifier of the Nether-Rift',
      origin: 'Forbidden Eldritch Pact',
      hp: 380,
      attack: 30,
      defense: 22,
      powers: ['Eldritch Flame', 'Astral Binding Chains', 'Void Rift Singularity'],
      avatar: '🔮💀',
      color: '#4B0082',
      dialogue: 'All dimensions must be cleansed in the purifying dark flame of the void!'
    },
    riftOpen: false,
    defeated: false,
    shardReward: 75,
    uniqueCostumeReward: '🔮 Void-Walker Astral Cloak',
    recruitedChampion: 'Saint Sarah the Redeemed'
  },
  {
    id: 'timeline-prime-clockwork',
    name: 'Earth-Steam: Chrono-Empire',
    universeCode: 'EARTH-Σ-1899',
    description: 'A steampunk timeline locked in an infinite temporal loop orchestrated by mechanical clockwork monoliths.',
    threatLevel: 60,
    bossVariant: {
      name: 'Chronos Prime Automaton',
      title: 'Infinite Master of Brass Entropy',
      origin: 'Tachyon Steam Engine Core',
      hp: 420,
      attack: 32,
      defense: 30,
      powers: ['Hyper-Sonic Sweep', 'Orbital Strike Protocol', 'Astral Binding Chains'],
      avatar: '⚙️🤖',
      color: '#B8860B',
      dialogue: 'Tick-tock, anomaly. Your existence is mathematically overdue for deletion.'
    },
    riftOpen: false,
    defeated: false,
    shardReward: 100,
    uniqueCostumeReward: '⚙️ Clockwork Chrono-Exosuit',
    recruitedChampion: 'Steampunk Titanix'
  }
];

export const PRESS_CONFERENCE_SCENARIOS = [
  {
    id: 'press-monorail-aftermath',
    headline: 'PRESS BRIEFING: DOWNTOWN TRANSIT CRISIS & VIGILANTE OVERSIGHT',
    topic: 'Addressing city journalists regarding the high-speed monorail derailment response and civilian safety.',
    questions: [
      {
        id: 'q-chronicle-damage',
        outletName: 'The Daily Chronicle',
        reporterName: 'Liam Vance',
        outletBias: 'Investigative' as const,
        avatar: '📰🧑',
        topic: 'District Property Damage vs Action',
        questionText: 'Hero, while the passengers survived, two city transit pillars suffered severe structural cracks. Who pays for the repairs—and shouldn\'t superheroes be bonded by municipal insurance?',
        responses: [
          {
            label: 'Humble Defender: "Every dollar of my comic royalties will aid public rebuilding."',
            stance: 'Humble Defender' as const,
            approvalDelta: 12,
            suspicionDelta: -5,
            comicSalesDelta: 15,
            mediaRatingDelta: 15,
            quote: 'Buildings can be rebuilt; human lives cannot. I have already pledged my publisher royalties directly to the Downtown Repair Fund.'
          },
          {
            label: 'Transparent Partner: "Let\'s look at the telemetry: the alternative was 300 lives lost."',
            stance: 'Transparent Partner' as const,
            approvalDelta: 8,
            suspicionDelta: -10,
            comicSalesDelta: 10,
            mediaRatingDelta: 10,
            quote: 'The data is indisputable: sabotaged magnetic brakes left seconds to act. City engineers and I are working hand in hand.'
          },
          {
            label: 'Intimidating Enforcer: "If the city council did its job catching sabotaging syndicates, I wouldn\'t have to catch trains."',
            stance: 'Intimidating Enforcer' as const,
            approvalDelta: -4,
            suspicionDelta: 15,
            comicSalesDelta: 20,
            mediaRatingDelta: 5,
            quote: 'Direct your inquiries to the criminals who cut the brake lines, not the person who kept three hundred people breathing.'
          }
        ]
      },
      {
        id: 'q-channel6-police',
        outletName: 'Channel 6 Action News',
        reporterName: 'Brenda Chase',
        outletBias: 'Sensationalist' as const,
        avatar: '📺👩',
        topic: 'Vigilantism vs Police Authority',
        questionText: 'Critics are calling this an unauthorized military-grade intervention. Are you cooperating with Police Chief Ramirez or running a private army?',
        responses: [
          {
            label: 'Transparent Partner: "Captain Ramirez and the precinct have my absolute respect and daily communication."',
            stance: 'Transparent Partner' as const,
            approvalDelta: 10,
            suspicionDelta: -10,
            comicSalesDelta: 8,
            mediaRatingDelta: 12,
            quote: 'I wear a mask because enemies target families, but my badge of service is bound to the lawful protection of Metro Nova.'
          },
          {
            label: 'Charming Celebrity: "Channel 6 always loves a dramatic headline! We\'re all on Team Metro Nova."',
            stance: 'Charming Celebrity' as const,
            approvalDelta: 8,
            suspicionDelta: 5,
            comicSalesDelta: 25,
            mediaRatingDelta: 10,
            quote: 'Smile for the cameras, Brenda! When danger strikes, red tape shouldn\'t stand between good people and safety.'
          }
        ]
      }
    ],
    completed: false
  },
  {
    id: 'press-asylum-breakout',
    headline: 'LIVE PRESS GALA: BLACKGATE ASYLUM SECURITY & ESCAPED ROGUES',
    topic: 'Addressing intense public anxiety after supervillain breakout threats and containment protocols.',
    questions: [
      {
        id: 'q-tribune-justice',
        outletName: 'Civic Watch Tribune',
        reporterName: 'Marcus Vance',
        outletBias: 'Law-and-Order' as const,
        avatar: '⚖️👨',
        topic: 'Lethal Force vs Containment',
        questionText: 'When supervillains break out again and again, citizens ask: why doesn\'t the city\'s superhero league end these threats permanently?',
        responses: [
          {
            label: 'Humble Defender: "If we become executioners, we surrender the very soul of the justice we swore to protect."',
            stance: 'Humble Defender' as const,
            approvalDelta: 15,
            suspicionDelta: -10,
            comicSalesDelta: 12,
            mediaRatingDelta: 15,
            quote: 'The law must never be replaced by vengeance. Our duty is to bring villains to justice, not act as judge, jury, and executioner.'
          },
          {
            label: 'Intimidating Enforcer: "Pushed too far, monsters will discover what true retribution looks like."',
            stance: 'Intimidating Enforcer' as const,
            approvalDelta: -5,
            suspicionDelta: 20,
            comicSalesDelta: 30,
            mediaRatingDelta: 5,
            quote: 'Let every rogue listening to this broadcast understand: my patience with recidivism is at its absolute breaking point.'
          }
        ]
      }
    ],
    completed: false
  }
];

export const DUAL_TECH_SYNERGIES: DualTechSynergy[] = [
  {
    id: 'syn-solar-volt',
    name: 'Solar Supernova Rush',
    heroRequired: 'Solaris',
    partnerName: 'Volt Spark',
    partnerAvatar: '⚡👦',
    partnerColor: '#FFDE59',
    superCost: 50,
    apCost: 35,
    damage: 145,
    statusEffects: ['Burn', 'Stun'],
    description: 'Solaris charges Volt Spark with radiant solar photon energy, propelling the speedster into a blinding supersonic blitz that engulfs the enemy in thermonuclear lightning!',
    comicBannerQuote: 'LIGHT AT SPEED OF SOUND! TASTE THE DUAL SOLAR SURGE!',
    animationType: 'solar'
  },
  {
    id: 'syn-nocturne-mythos',
    name: 'Shadow Rift Ambush',
    heroRequired: 'Nocturne',
    partnerName: 'Dr. Mythos',
    partnerAvatar: '🔮',
    partnerColor: '#8A2BE2',
    superCost: 50,
    apCost: 35,
    damage: 140,
    statusEffects: ['Webbed', 'Weakened'],
    description: 'Dr. Mythos tears open an astral nether portal behind the enemy, allowing Nocturne to execute a silent hyper-velocity glider drop-kick infused with eldritch binding seals.',
    comicBannerQuote: 'OUT OF THE SHADOWS AND BEYOND THE VEIL!',
    animationType: 'shadow'
  },
  {
    id: 'syn-titan-circuit',
    name: 'Seismic EMP Overload',
    heroRequired: 'Titanix',
    partnerName: 'Circuit Breaker',
    partnerAvatar: '⚡',
    partnerColor: '#00F0FF',
    superCost: 50,
    apCost: 40,
    damage: 155,
    statusEffects: ['Stun', 'Weakened'],
    description: 'Titanix smashes the tectonic plates while Circuit Breaker discharges an orbital EMP capacitor straight through his diamond-hard fists, electrocuting the entire frontline.',
    comicBannerQuote: 'GROUNDED VOLTAGE! CRUSH THE SYSTEM!',
    animationType: 'tech'
  },
  {
    id: 'syn-solaris-prism',
    name: 'Prismatic Nova Cascade',
    partnerName: 'Chloe Rivera (Prism)',
    partnerAvatar: '👩🎨💎',
    partnerColor: '#EC4899',
    superCost: 50,
    apCost: 30,
    damage: 160,
    shield: 50,
    statusEffects: ['Burn', 'Shielded'],
    description: 'Chloe projects hard-light crystal prism mirrors around the target while Solaris fires a solar beam, refracting the light into a thousand blinding laser blades that also grant a party-wide shield!',
    comicBannerQuote: 'LIGHT REFRACTED THROUGH AN UNBREAKABLE HEART!',
    animationType: 'solar'
  },
  {
    id: 'syn-nocturne-cyberhawk',
    name: 'Drone Swarm Assassination',
    partnerName: 'Cyber Hawk',
    partnerAvatar: '🦅💻',
    partnerColor: '#00F0FF',
    superCost: 50,
    apCost: 30,
    damage: 135,
    statusEffects: ['Bleed', 'Weakened'],
    description: 'Cyber Hawk blankets the arena in smoke-guided targeting lasers as her micro-drones bomb the enemy flank in unison with an acrobatic execution strike.',
    comicBannerQuote: 'SYNCHRONIZED AIR-TO-GROUND OVERWATCH!',
    animationType: 'tech'
  },
  {
    id: 'syn-titan-nightblade',
    name: 'Adamantine Dragon Cleave',
    partnerName: 'Nightblade',
    partnerAvatar: '⚔️🥋',
    partnerColor: '#E63946',
    superCost: 50,
    apCost: 35,
    damage: 150,
    statusEffects: ['Bleed', 'Stun'],
    description: 'Titanix launches Nightblade into the upper air with superhuman kinetic force, descending with twin carbon katanas burning with friction plasma.',
    comicBannerQuote: 'ONE HEAVY THROW, TWO LETHAL CUTS!',
    animationType: 'brawl'
  },
  {
    id: 'syn-mythos-aura',
    name: 'Celestial Aegis Sanctuary',
    partnerName: 'Aura',
    partnerAvatar: '🔮✨',
    partnerColor: '#A855F7',
    superCost: 50,
    apCost: 35,
    damage: 90,
    healing: 65,
    shield: 60,
    statusEffects: ['Regenerating', 'Shielded'],
    description: 'Dr. Mythos and Aura link their mystic leylines, raising a radiant lotus barrier that restores 65 HP to the entire heroic vanguard and cleanses all negative ailments.',
    comicBannerQuote: 'THE SACRED LEYLINES CANNOT BE SEVERED!',
    animationType: 'mystic'
  },
  {
    id: 'syn-universal-strike',
    name: 'Vanguard Double-Team Blitz',
    partnerName: 'Active Companion',
    partnerAvatar: '🤝⚡',
    partnerColor: '#EAB308',
    superCost: 50,
    apCost: 30,
    damage: 125,
    statusEffects: ['Weakened'],
    description: 'A seamless, perfectly timed double-team assault combining kinetic brawn with tactical distraction, driving the enemy back into the ropes!',
    comicBannerQuote: 'TWO HEROES, ONE UNIFIED BLOW!',
    animationType: 'brawl'
  }
];

export const ENHANCED_ROMANCE_DATES: RomanceDateOption[] = [
  {
    id: 'date-chloe-cafe',
    name: 'Candlelit Espresso & Sketching at Roaster\'s Haven',
    partnerName: 'Chloe Rivera',
    partnerId: 'rel-civilian-chloe',
    location: 'Roaster\'s Haven Café, Downtown',
    cost: 50,
    energyCost: 15,
    dialogueScenario: 'Chloe turns off the neon "Open" sign, locks the front door, and brings out two steaming artisan hazelnut lattes along with her sketchbook of stained-glass crystal designs. She looks at you with a gentle, questioning smile.',
    dialogueResponses: [
      {
        text: '"Your glass artwork is stunning, Chloe. It feels like it belongs in an ancient cathedral or a superhero temple."',
        partnerReply: 'Chloe blushes, tracing her sketchbook: "Thanks... whenever the city gets crazy with supervillain headlines, sketching helps me believe there’s still pure beauty worth protecting."',
        affinityGain: 15
      },
      {
        text: '"Remember when we were kids and got caught climbing the water tower?"',
        partnerReply: 'Chloe laughs softly, resting her chin on her hand: "You almost fell, and you promised you\'d never do anything crazy high up again! Look at you now, always running off..."',
        affinityGain: 12
      }
    ],
    crisisDilemma: {
      title: 'CRISIS: 3-ALARM CHEMICAL FIRE & SYNDICATE HEIST 2 BLOCKS AWAY!',
      premise: 'Just as Chloe leans in to show you her latest sketch, police sirens shriek down 5th Avenue and an orange fireball illuminates the café windows!',
      sirenDescription: 'The radio scanner on the counter crackles: "ALL UNITS: Petro-chemical tanks ignited by masked saboteurs! Pinned workers on roof!"',
      choices: [
        {
          id: 'restroom_hero',
          label: '🏃 Slip Out to the Restroom & Suit Up',
          description: 'Excuse yourself ("I need to wash up"), slip out the back alley, suit up, and extinguish the fire.',
          heroismGain: 20,
          affinityGain: -10,
          stressChange: -5,
          suspicionChange: 15,
          outcomeDialogue: 'You dive into the flames, saving 6 workers! But when you return 30 minutes later, Chloe is packing up her sketchbook with a quiet sigh: "I guess your stomach really acted up again..."'
        },
        {
          id: 'stay_date',
          label: '☕ Stay & Prioritize Chloe (Ignore the Sirens)',
          description: 'Take Chloe\'s hand, ignore the wailing sirens, and assure her that first responders have it handled.',
          heroismGain: -10,
          affinityGain: 30,
          stressChange: 25,
          suspicionChange: -15,
          outcomeDialogue: 'Chloe squeezes your hand tightly, touched that you stayed by her side. You share a deeply romantic moment, though your conscience burns with hero guilt.'
        },
        {
          id: 'confess_identity',
          label: '🎭 CONFESS YOUR SECRET IDENTITY RIGHT NOW!',
          description: 'Look Chloe in the eyes, show her your costume under your coat, and tell her the whole truth.',
          heroismGain: 15,
          affinityGain: 50,
          stressChange: -30,
          suspicionChange: -100,
          outcomeDialogue: 'Chloe’s eyes widen in awe and relief: "I... I always suspected! You don\'t have to lie to me ever again. Go save them—I\'ll be waiting right here for you!"'
        },
        {
          id: 'subtle_wits',
          label: '🧠 Subtle Civilian Hack / Wits (No Suit Up)',
          description: 'Use your phone to hack the municipal fire-sprinkler water pressure grid while staying seated.',
          heroismGain: 15,
          affinityGain: 20,
          stressChange: -10,
          suspicionChange: -5,
          statCheckRequired: { stat: 'intellect', threshold: 14 },
          outcomeDialogue: 'You secretly override the water main pressure on your phone. Minutes later, the sirens subside as automated deluge cannons extinguish the blaze!'
        }
      ]
    },
    choices: [
      {
        label: 'Reminisce about growing up before superpowers changed everything.',
        affinityGain: 25,
        stressReduction: 40,
        perk: '+25 Affinity with Chloe & -40% Stress'
      },
      {
        label: 'Help her brainstorm new specialty pastry recipes.',
        affinityGain: 18,
        stressReduction: 30,
        perk: '+18 Affinity with Chloe & -30% Stress'
      }
    ]
  },
  {
    id: 'date-sarah-observatory',
    name: 'Helios Celestial Observatory Rooftop Gala',
    partnerName: 'Dr. Sarah Sterling',
    partnerId: 'rel-love-interest-elena',
    location: 'Helios Observatory, High District',
    cost: 100,
    energyCost: 15,
    dialogueScenario: 'Sarah leans against the glass balustrade overlooking the twinkling city lights, holding two glasses of sparkling cider after a grueling 14-hour trauma shift.',
    dialogueResponses: [
      {
        text: '"You saved three lives in surgery today, Sarah. You\'re the real superhero of this city."',
        partnerReply: 'Sarah smiles warmly, clinking her glass against yours: "It takes a team. But it means the world coming from you."',
        affinityGain: 18
      },
      {
        text: '"Look through the telescope—that star cluster has been stable for 4 billion years."',
        partnerReply: 'Sarah chuckles softly: "I wish human heart rates were that predictable during an emergency."',
        affinityGain: 14
      }
    ],
    crisisDilemma: {
      title: 'CRISIS: HELICOPTER ROTOR FAILURE OVER THE OBSERVATORY SKYLINE!',
      premise: 'A news traffic helicopter suffers mechanical failure directly above the observatory, spinning dangerously toward the crowded viewing terrace!',
      sirenDescription: 'The pilot’s distress beacon blares over the PA: "MAYDAY! TAIL ROTOR SEVERED! CRASH IMMINENT!"',
      choices: [
        {
          id: 'restroom_hero',
          label: '🏃 Leap Over the Terrace & Suit Up in Mid-Air',
          description: 'Vault off the balcony into the clouds, catch the spinning helicopter, and guide it to safety.',
          heroismGain: 25,
          affinityGain: -10,
          stressChange: 0,
          suspicionChange: 20,
          outcomeDialogue: 'You catch the 4-ton helicopter in mid-air to thunderous applause! But Sarah is left standing alone at the terrace railing, searching the crowd for you.'
        },
        {
          id: 'stay_date',
          label: '☕ Protect Sarah & Shield Her from Shrapnel',
          description: 'Pull Sarah behind the reinforced marble column, shielding her body with your own.',
          heroismGain: 5,
          affinityGain: 35,
          stressChange: 15,
          suspicionChange: -10,
          outcomeDialogue: 'You shield Sarah as debris skids past. She gazes into your eyes, feeling the unnatural strength of your arms, deeply touched by your protective devotion.'
        },
        {
          id: 'confess_identity',
          label: '🎭 REVEAL IDENTITY: "Sarah, trust me. I have to catch that chopper!"',
          description: 'Look Sarah in the eyes, let your powers flare, and leap into action in front of her.',
          heroismGain: 25,
          affinityGain: 45,
          stressChange: -20,
          suspicionChange: -100,
          outcomeDialogue: 'Sarah gasps in realization: "It’s been you all along... Be careful!" She watches with fierce pride as you save the pilot, knowing your sacred secret.'
        },
        {
          id: 'subtle_wits',
          label: '🧠 Target Drone Tractor Beam via Smart-Watch',
          description: 'Override the observatory magnetic crane beacon to guide the helicopter onto the helipad.',
          heroismGain: 20,
          affinityGain: 25,
          stressChange: -10,
          suspicionChange: -5,
          statCheckRequired: { stat: 'intellect', threshold: 15 },
          outcomeDialogue: 'You interface with the rooftop crane sensors, safely tethering the descending chopper without revealing your superhero alter-ego!'
        }
      ]
    },
    choices: [
      {
        label: 'Open up emotionally about the weight of your dual identity.',
        affinityGain: 20,
        stressReduction: 35,
        perk: '+20 Affinity with Sarah & -35% Stress'
      },
      {
        label: 'Make a witty scientific joke to lighten the evening mood.',
        affinityGain: 15,
        stressReduction: 25,
        perk: '+15 Affinity with Sarah & -25% Stress'
      }
    ]
  },
  {
    id: 'date-liam-jazz',
    name: 'Midnight Vinyl & Drinks at The Blue Note',
    partnerName: 'Liam Vance',
    partnerId: 'rel-reporter-vance',
    location: 'The Blue Note Lounge, Neon District',
    cost: 90,
    energyCost: 15,
    dialogueScenario: 'Liam slides a glass of bourbon across the booth, adjusting his press badge with a smirk: "Alright, let\'s skip the pleasantries. How does someone with your schedule always manage to be absent during the biggest break-ins?"',
    dialogueResponses: [
      {
        text: '"A good investigative mind shouldn\'t see a conspiracy behind every late worker, Liam."',
        partnerReply: 'Liam grins, tapping his pen: "Fair enough. But you have to admit, your timing is Pulitzer-worthy."',
        affinityGain: 14
      },
      {
        text: '"Maybe I just enjoy the nightlife as much as you do."',
        partnerReply: 'Liam raises his glass: "Then to the nightlife, and the secrets that keep Metro Nova interesting."',
        affinityGain: 16
      }
    ],
    crisisDilemma: {
      title: 'CRISIS: ARMED MOB ENFORCERS RAID THE JAZZ CLUB!',
      premise: 'Four syndicate enforcers kick through the front entrance of the lounge demanding the night\'s cash and hostage valuables!',
      sirenDescription: 'The lead mobster fires a shotgun into the ceiling: "NOBODY MOVE! PHONES AND WALLETS ON THE TABLE!"',
      choices: [
        {
          id: 'restroom_hero',
          label: '🏃 Duck Into the Back Kitchen & Suit Up',
          description: 'Duck into the kitchen pantry, don your cowl, and smash the gangsters through the entrance.',
          heroismGain: 15,
          affinityGain: -5,
          stressChange: 0,
          suspicionChange: 25,
          outcomeDialogue: 'You defeat the mobsters in 10 seconds! Liam snaps photos with his camera, but writes in his notebook: "Vigilante arrived suspiciously 3 seconds after civilian excused himself."'
        },
        {
          id: 'stay_date',
          label: '☕ Play the Cowardly Civilian to Deflect Liam\'s Suspicion',
          description: 'Crouch under the table with Liam, handing over a fake wallet while memorizing gang tattoo insignias.',
          heroismGain: 0,
          affinityGain: 20,
          stressChange: 15,
          suspicionChange: -30,
          outcomeDialogue: 'The thugs take the wallet and leave. Liam chuckles: "Well, you certainly don\'t handle danger like a superhero." Suspicion drastically falls!'
        },
        {
          id: 'confess_identity',
          label: '🎭 REVEAL IDENTITY: Disarm Gang in Front of Liam',
          description: 'Stand up, catch the shotgun barrel in your bare fist, and bend the steel in two before Liam\'s eyes.',
          heroismGain: 20,
          affinityGain: 40,
          stressChange: -20,
          suspicionChange: -100,
          outcomeDialogue: 'Liam drops his camera in disbelief: "Holy... it was you the whole time! You saved my life. I swear on my Pulitzer, your secret dies with me."'
        },
        {
          id: 'subtle_wits',
          label: '🧠 Martial Disarm disguised as "Bar Brawl Stumble"',
          description: 'Pretend to trip and spill drinks, sweeping the mobster\'s legs and kicking the gun under the bar.',
          heroismGain: 15,
          affinityGain: 25,
          stressChange: -10,
          suspicionChange: -10,
          statCheckRequired: { stat: 'agility', threshold: 14 },
          outcomeDialogue: 'You "accidentally" knock the lead thug unconscious with an ice bucket while tripping. Liam laughs: "Craziest luck I\'ve ever seen in a bar!"'
        }
      ]
    },
    choices: [
      {
        label: 'Argue passionately that love is the very anchor that keeps heroes humane.',
        affinityGain: 22,
        stressReduction: 25,
        perk: '+22 Affinity with Liam & -15% Suspicion'
      },
      {
        label: 'Challenge him to a friendly philosophical debate over drinks.',
        affinityGain: 16,
        stressReduction: 20,
        perk: '+16 Affinity with Liam & -20% Stress'
      }
    ]
  }
];


