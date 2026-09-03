import { NemesisLairDungeon } from '../types/game';

export const NEMESIS_LAIR_DUNGEONS: NemesisLairDungeon[] = [
  {
    id: 'lair-null-void',
    villainId: 'villain-null-void',
    villainName: 'Null Void',
    lairTitle: 'Quantum Graviton Citadel',
    theme: 'Quantum Citadel',
    recommendedLevel: 5,
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    threatLevel: 'Omega-Level',
    loreDescription: 'An inverted skyscraper hovering inside a localized spacetime rift. Gravity shifts violently between chambers.',
    cutsceneId: 'cutscene-nullvoid-preboss',
    rooms: [
      {
        id: 'null-r1',
        roomNumber: 1,
        title: 'Tachyon Laser Security Grid',
        type: 'Laser Security Grid',
        roomVisualIcon: '⚡',
        hazardDescription: 'High-frequency particle beams sweep across an anti-gravity chasm.',
        isCleared: false,
        choices: [
          {
            id: 'null-r1-hack',
            label: '💻 Hack Sub-Router Terminal (Intellect Check)',
            description: 'Bypass firewall nodes to disable security lasers silently.',
            tacticType: 'Hack',
            energyCost: 15,
            alarmDelta: -25,
            successChance: 85,
            requiredStat: { stat: 'intellect', threshold: 14 },
            rewardLoot: { intelClues: 2, heroTokens: 1 },
            failureHpDamage: 25,
            narrativeSuccess: 'You successfully decrypt the tachyon router, disabling all lasers with zero alarm!',
            narrativeFailure: 'Firewall counter-shock triggered! You took 25 electrical damage and raised the alarm.'
          },
          {
            id: 'null-r1-dash',
            label: '🏃 Acrobatics Laser Evasion (Agility Check)',
            description: 'Time gravity pulses to vault through beam gaps.',
            tacticType: 'Acrobatics',
            energyCost: 20,
            alarmDelta: 10,
            successChance: 80,
            requiredStat: { stat: 'agility', threshold: 15 },
            rewardLoot: { money: 150 },
            failureHpDamage: 20,
            narrativeSuccess: 'You execute a flawless aerial dive, clearing the perimeter unharmed.',
            narrativeFailure: 'A laser grazed your shoulder armor! Took 20 damage.'
          }
        ]
      },
      {
        id: 'null-r2',
        roomNumber: 2,
        title: 'Void Sentry Cyber-Hangar',
        type: 'Guard Sentry Barracks',
        roomVisualIcon: '🤖',
        hazardDescription: 'A squad of heavy quantum combat drones recharge on hover-pads.',
        isCleared: false,
        choices: [
          {
            id: 'null-r2-stealth',
            label: '🤫 Silent Power Cell Sabotage (Stealth / Agility)',
            description: 'Sneak behind charging racks and disconnect power conduits.',
            tacticType: 'Stealth',
            energyCost: 15,
            alarmDelta: -15,
            successChance: 85,
            requiredStat: { stat: 'agility', threshold: 14 },
            rewardLoot: { money: 200, heroTokens: 1 },
            failureHpDamage: 30,
            narrativeSuccess: 'Drones disabled in sleep mode! Quiet breach achieved.',
            narrativeFailure: 'A drone awakened and opened fire before you smashed it! Alarm raised.'
          },
          {
            id: 'null-r2-brawn',
            label: '💥 Overpowering Kinetic Slam (Strength Check)',
            description: 'Hurl heavy machinery into the sentry rack to crush them at once.',
            tacticType: 'Brawn',
            energyCost: 25,
            alarmDelta: 30,
            successChance: 90,
            requiredStat: { stat: 'strength', threshold: 16 },
            rewardLoot: { money: 250 },
            failureHpDamage: 15,
            narrativeSuccess: 'Massive impact pulverized the sentry squad instantly!',
            narrativeFailure: 'Debris rebounded and struck you, alerting the sector.'
          }
        ]
      },
      {
        id: 'null-r3',
        roomNumber: 3,
        title: 'Tachyon Singularity Reactor Core',
        type: 'Doomsday Reactor Room',
        roomVisualIcon: '☢️',
        hazardDescription: 'A swirling black-hole singularity core counting down to overload.',
        isCleared: false,
        choices: [
          {
            id: 'null-r3-defuse',
            label: '🔧 Calibrate Magnetic Containment Rods (Intellect / Tech)',
            description: 'Stabilize reactor flux before catastrophic spacetime rupture.',
            tacticType: 'Hack',
            energyCost: 25,
            alarmDelta: -30,
            successChance: 85,
            requiredStat: { stat: 'intellect', threshold: 16 },
            rewardLoot: { heroTokens: 3, money: 500, intelClues: 3 },
            failureHpDamage: 40,
            narrativeSuccess: 'Singularity stabilized! Spacetime collapsed safely into standby mode.',
            narrativeFailure: 'Gravity wave pulse hit you for 40 damage!'
          }
        ]
      },
      {
        id: 'null-r4',
        roomNumber: 4,
        title: 'Classified Dark-Matter Tech Vault',
        type: 'Classified Tech Vault',
        roomVisualIcon: '💎',
        hazardDescription: 'A reinforced quantum safe containing Null Void\'s secret schematics.',
        isCleared: false,
        choices: [
          {
            id: 'null-r4-loot',
            label: '🔓 Crack Quantum Encryption (Intellect / Tech)',
            description: 'Extract confidential schematics and prototype technology.',
            tacticType: 'Hack',
            energyCost: 15,
            alarmDelta: 0,
            successChance: 90,
            rewardLoot: { money: 1000, heroTokens: 4, hpHeal: 50 },
            narrativeSuccess: 'Vault cracked! Recovered $1,000, 4 Hero Tokens, and Med-Bay nanosutures (+50 HP)!',
            narrativeFailure: 'Anti-tamper static field discharged, but you recovered minor salvage.'
          }
        ]
      }
    ],
    bossEncounter: {
      id: 'enc-null-void-climax',
      title: 'Final Showdown: Null Void at the Singularity Apex',
      description: 'Face the master of gravity in his inner sanctuary!',
      severity: 'Catastrophic',
      districtId: 'district-financial',
      enemies: [
        {
          name: 'Null Void',
          hp: 260,
          maxHp: 260,
          attack: 34,
          defense: 18,
          speed: 18,
          powers: ['Singularity Crush', 'Event Horizon Shield', 'Gravity Well Pulse'],
          isBoss: true,
          avatar: '🌌',
          adaptations: [
            { type: 'Obsidian Mind Aegis', description: 'Resists psionic and mystic damage.', counterCategory: 'Psionic' }
          ]
        }
      ],
      rewards: {
        xp: 450,
        money: 1200,
        approval: 25,
        heroTokens: 5
      }
    }
  },
  {
    id: 'lair-queen-pyre',
    villainId: 'villain-queen-pyre',
    villainName: 'Queen Pyre',
    lairTitle: 'Volcanic Steel Foundry',
    theme: 'Volcanic Foundry',
    recommendedLevel: 4,
    bgGradient: 'from-red-950 via-amber-950 to-stone-950',
    threatLevel: 'Catastrophic',
    loreDescription: 'An abandoned steel mill retrofitted into an active geothermal magma foundry.',
    cutsceneId: 'cutscene-pyre-foundry',
    rooms: [
      {
        id: 'pyre-r1',
        roomNumber: 1,
        title: 'Thermal Vent Exhaust Shute',
        type: 'Laser Security Grid',
        roomVisualIcon: '💨',
        hazardDescription: 'Superheated steam jets blast through the ventilation ducts.',
        isCleared: false,
        choices: [
          {
            id: 'pyre-r1-agility',
            label: '🏃 Time Steam Exhaust Cycles (Agility)',
            description: 'Sprint between thermal burst intervals.',
            tacticType: 'Acrobatics',
            energyCost: 15,
            alarmDelta: -10,
            successChance: 85,
            requiredStat: { stat: 'agility', threshold: 13 },
            rewardLoot: { money: 120 },
            failureHpDamage: 20,
            narrativeSuccess: 'Slid past the steam vents without triggering heat sensors!',
            narrativeFailure: 'Steam scalded your suit for 20 heat damage.'
          }
        ]
      },
      {
        id: 'pyre-r2',
        roomNumber: 2,
        title: 'Molten Crucible Walkway',
        type: 'Guard Sentry Barracks',
        roomVisualIcon: '🔥',
        hazardDescription: 'Pyro-enforcers guard the catwalks over vat vats of liquid steel.',
        isCleared: false,
        choices: [
          {
            id: 'pyre-r2-stealth',
            label: '🤫 Shadow Catwalk Takedown (Stealth)',
            description: 'Neutralize guards from the overhead gantry.',
            tacticType: 'Stealth',
            energyCost: 15,
            alarmDelta: -20,
            successChance: 85,
            rewardLoot: { money: 250, heroTokens: 1 },
            failureHpDamage: 25,
            narrativeSuccess: 'Guards incapacitated silently before they could reach emergency sirens.',
            narrativeFailure: 'A flare gun was fired! Alarm raised.'
          }
        ]
      },
      {
        id: 'pyre-r3',
        roomNumber: 3,
        title: 'Geothermal Pressure Manifold',
        type: 'Doomsday Reactor Room',
        roomVisualIcon: '🌋',
        hazardDescription: 'Pressure valves redlining toward citywide pipeline detonation.',
        isCleared: false,
        choices: [
          {
            id: 'pyre-r3-turn',
            label: '💪 Force Coolant Valves Shut (Strength / Fortitude)',
            description: 'Manually wrench frozen emergency release levers.',
            tacticType: 'Brawn',
            energyCost: 20,
            alarmDelta: -25,
            successChance: 90,
            requiredStat: { stat: 'strength', threshold: 15 },
            rewardLoot: { money: 400, heroTokens: 2, hpHeal: 40 },
            narrativeSuccess: 'Valves locked! Magma flow safely diverted back underground.',
            narrativeFailure: 'Heat backdraft singed your gauntlets!'
          }
        ]
      }
    ],
    bossEncounter: {
      id: 'enc-queen-pyre-climax',
      title: 'Inferno Climax: Queen Pyre in the Molten Crucible',
      description: 'Face the scorching queen of the fire syndicate!',
      severity: 'Major',
      districtId: 'district-industrial',
      enemies: [
        {
          name: 'Queen Pyre',
          hp: 220,
          maxHp: 220,
          attack: 30,
          defense: 14,
          speed: 16,
          powers: ['Inferno Vortex', 'Magma Eruption', 'Flame Armor'],
          isBoss: true,
          avatar: '🔥',
          adaptations: [
            { type: 'Thermal Kinetic Coating', description: 'Absorbs flame and energy attacks.', counterCategory: 'Energy' }
          ]
        }
      ],
      rewards: {
        xp: 380,
        money: 950,
        approval: 20,
        heroTokens: 4
      }
    }
  }
];
