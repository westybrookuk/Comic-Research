# Vanguard: The Greatest Hero — Character & Location Research Pack

Packaged on 2026-09-03 from branch `arena/01a0638c-comic` of the private repo
`westybrookuk/Comic` (commit `759043c`) for the character/location audit.
**Nothing in here is modified** — the docs and source are byte-for-byte copies, the JSON is a
direct serialisation of the game's data modules. Character data on that branch is identical to
`main` except one word in a Null Void cutscene line ("die" → "fall", for the voice recording).

## Start here

| File | What it is |
|------|-----------|
| `data/CHARACTER_SHEET.json` | **Compact roster across every cast list** — heroes, villains, sidekicks, confidants/relationships, mayoral candidates, alliances, multiverse boss variants, cutscene speakers. Identity fields only (names, aliases, gender, origin, colours, emoji avatar, backstory, powers, quips). |
| `data/LOCATION_SHEET.json` | **Every named place** — districts, rebuilding sites, alliance HQs, date venues, nemesis lair dungeons, cutscene backdrops. |
| `docs/character_roster_and_visual_prompts.txt` | The design bible for the cast: civilian vs. super identities, costume descriptions and AI-art prompts (39 KB). |
| `docs/city_locations_ai_prompts.txt` | Architectural dossiers + art prompts for the 10 iconic Metro City locations. |

## Layout

```
research-pack/
├── README.md                     ← this file
├── docs/                         ← design documents (copied verbatim from repo root)
├── data/                         ← game data as JSON (one file per export) + the two sheets
├── artwork/                      ← see "Artwork" below — there is almost none
└── source-snapshots/             ← the TypeScript the JSON came from, plus hubs with hard-coded names
    ├── data/                     ← universe.ts, storyCutscenes.ts, patrolEvents.ts, lairDungeons.ts
    ├── types/game.ts             ← every interface (HeroCharacter, VillainCharacter, District, …)
    ├── comicGenerator.ts         ← procedural comic titles/blurbs that name characters
    └── components/               ← 14 hubs whose character names live in the component, not in data
```

### docs/

| File | Contents |
|------|----------|
| `character_roster_and_visual_prompts.txt` | Complete character roster & visual guide (dual identities, costumes, prompts) |
| `city_locations_ai_prompts.txt` | Metro City locations & architectural prompt guide |
| `CINEMATIC_VIDEO_AND_IMAGE_PROMPT_BIBLE.md` | Master video/image prompt bible (16:9 cutscenes, trailers) |
| `VIBES_AI_9_16_MASTER_PROMPT_SUITE.md` | 9:16 portrait prompt suite — heroes, sidekicks, confidants, villains, locations |
| `VIBES_AI_ACTOR_LOCKED_9_16_PROMPTS.md` | Same cast in the "Timeless Neo-Deco" unified aesthetic (actor-locked looks) |
| `THEME_ENGINE_CREATOR_GUIDE.md` | How the data-driven engine is re-themed (useful for knowing which names are load-bearing ids) |
| `suno_music_sound_prompts.txt` | Music/audio prompt suite (included for completeness — track names reference characters) |
| `VOICE_CAST.md` | Which characters currently have a recorded voice and which lines |
| `README.md` | The game's own README (feature list, alignment ranges) |

### data/ (JSON)

Full, unmodified game data: `heroes`, `villains`, `sidekicks`, `relationships`, `districts`,
`district_rebuilding_projects`, `mayoral_candidates`, `alliances`, `multiverse_timelines`,
`mega_crises`, `masterplans`, `origin_stories`, `day_jobs`, `legacy_heirlooms`, `romance_dates`,
`romance_date_options_legacy`, `civilian_milestones`, `press_conference_scenarios`, `news_items`,
`hq_upgrades`, `shop_equipment`, `powers`, `dual_tech_synergies`, `story_cutscenes`,
`patrol_story_events`, `nemesis_lair_dungeons`. Field meanings are in `source-snapshots/types/game.ts`.

Counts: 5 preset heroes · 6 villains · 4 sidekicks · 5 relationships · 3 mayoral candidates ·
4 alliances · 3 multiverse timelines (each with a boss variant) · 6 districts · 2 mega-crises ·
3 story cutscenes · 8 patrol events · 2 lair dungeons.

### source-snapshots/components/ — names that are NOT in the data files

These hubs define their cast inline. An audit of names/costumes must read them too:

| File | Why it matters |
|------|---------------|
| `source-snapshots/components/BaseOfOperations.tsx` | Base/HQ hub — local roster of staff/NPC names and facility labels |
| `source-snapshots/components/BossClashDojo.tsx` | Boss Clash training dojo — hard-coded boss opponents (names, titles, quips) |
| `source-snapshots/components/BossQteClashOverlay.tsx` | Cinematic QTE beam-struggle overlay — boss dialogue and finisher names |
| `source-snapshots/components/CourtroomTrialHub.tsx` | Courtroom trial — defendant "Dr. Magneto Polaris", witnesses, prosecutor/judge |
| `source-snapshots/components/DualBossSyndicateHub.tsx` | Two-boss syndicate fights — paired villain names/titles |
| `source-snapshots/components/MantleLegacyHallOfFame.tsx` | Hall of Fame — legacy mantle holders and inductee names |
| `source-snapshots/components/MultiverseHub.tsx` | Multiverse rifts — alternate-timeline champions/bosses |
| `source-snapshots/components/NoirDetectiveBoardHub.tsx` | Noir cork-board case — suspects, witnesses, evidence labels |
| `source-snapshots/components/OriginStorySelector.tsx` | Origin scenarios — the three origin stories and their cast |
| `source-snapshots/components/RadioPodcastHub.tsx` | Metro Pulse 98.5 FM — five radio callers (names, roles, districts) |
| `source-snapshots/components/SecretLairBatcaveHub.tsx` | Secret lair — trophy/case references (vil-chronos, vil-oblivion, etc.) |
| `source-snapshots/components/SuccessionLegacyHub.tsx` | Succession — heir archetypes and mantle names |
| `source-snapshots/components/TrophyVaultHub.tsx` | Trophy Vault — relics attributed to villains incl. Cipher, Titanix variant |
| `source-snapshots/components/WhatIfMultiverseSimulator.tsx` | What-If simulator — alternate-history character variants |

`source-snapshots/comicGenerator.ts` is the procedural comic-issue generator (its title/blurb
templates name characters). Narrator lines scattered through the other 60-odd hubs are not copied;
grep the full repo for a specific name if needed.

## Artwork — please read

**The repository contains no character or location artwork.** Every character is represented
in-game by an emoji (`avatarIcon`, e.g. ☀️ 🕳️ 🔥) plus a colour palette; the optional
`customImageUrl` field is empty for every preset character and only holds player-supplied URLs at
runtime. The only raster image in the whole repo (or anywhere in its git history) is `src/assets/hero.png`,
which is the stock Vite template graphic (a purple isometric tile, 343×361) — copied here as
`artwork/vite-template-placeholder-hero.png` purely so you can confirm that for yourself.
`artwork/favicon.svg` is the browser tab icon.

What exists instead of artwork is the **prompt library**: the docs above describe each
character's civilian look, costume, colours and setting in detail as AI-image prompts. For a
visual audit those documents are the source of truth.

## Things the sheets already surface (starting points, not conclusions)

- Surname reuse is heavy: Vance ×8, Morales ×2, Sterling ×2, Bennett ×1. "Vance" alone covers a hero (Nocturne / Cassandra),
  Null Void (Victor), Iron Juggernaut (Boris), Chronos Master (Tiberius), two sidekicks (Maya,
  Selene), the journalist Liam Vance and mayoral candidate Victor Vance Sr.
- Chloe is **Chloe Rivera** in `relationships.json` and all docs, but **Chloe Roaster** as the
  speaker name in `story_cutscenes.json` (her café is Roaster's Haven).
- Sidekick **Maya Vance** (Cyber Hawk) vs. hero **Maya Lin** (Circuit Breaker) share a first name;
  villain **Dr. Evelyn Cross** (Cyber-Gorgon) vs. candidate **Evelyn Cross-Sterling**.
- The two Vibes.ai prompt suites use a different set of hero civilian names (Alex Cross, Victor
  Drake, Maya Lin, Darius Stone, Elena Vane, Marcus Brody) from the game data and the roster
  document (Marcus Bennett, Cassandra Vance, Derrick Hall, Maya Lin, Julian Blackwood) — only
  Maya Lin matches. Worth reconciling before any art is commissioned from those prompts.
- Villain ids are inconsistent between data (`villain-null-void`) and some hubs
  (`vil-chronos`, `vil-oblivion` in SecretLairBatcaveHub; `villain-dr-polaris` in Courtroom).

## Regenerating

From the game repo: the JSON was produced by importing `src/data/*.ts` with `tsx` and
`JSON.stringify`-ing each export; the docs/source are plain copies. Ask the Comic-branch agent to
refresh the pack if the data changes.
