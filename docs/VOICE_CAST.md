# 🎭 Voice Cast — Vanguard: The Greatest Hero

Voices auditioned and chosen by the game's owner on 2026-09-02 using Arena Agent Mode's
`add_voice` tool (two candidates per role, owner picked one). **Reuse these `voice_id`s for every
future `generate_speech` call — do not re-audition** unless the owner asks for a recast.

| Role | `voice_id` | Identity | Used for |
|------|-----------|----------|----------|
| Narrator | `voice-00` | masculine · narration | Origin stories, level-ups, story captions, cutscene narration |
| Hero (masculine) | `voice-01` | masculine · characters | Player hero lines when `hero.gender !== 'Female'` |
| Hero (feminine) | `voice-02` | feminine · characters | Player hero lines when `hero.gender === 'Female'` |
| Tactical Oracle | `voice-03` | feminine · educational | HQ AI advisor greeting / directives |
| Radio Host | `voice-04` | masculine · entertainment | Metro Pulse 98.5 FM jingle & station lines |
| Villain — Null Void | `voice-05` | masculine · characters | Null Void (cosmic); default masculine rogue |
| Villain — Queen Pyre | `voice-06` | feminine · characters | Queen Pyre (inferno); default feminine rogue |
| Confidant — Chloe Rivera | `voice-07` | feminine · conversational | Chloe (Roaster's Haven café); chosen 2026-09-03 |

## Clip inventory

Files live in `public/audio/cast/<role>/<slug>.mp3` and are listed in `src/data/voiceClips.ts`.
The game plays a clip when one exists for a line and falls back to the browser speech engine
(`narratorTts`) otherwise, so a missing file is never fatal.

| Clip | Voice | Where it plays |
|------|-------|----------------|
| `narrator/origin_quantum.mp3` | voice-00 | Origin Story screen — "The Quantum Incident at Apex Labs" selected |
| `narrator/origin_blood_alley.mp3` | voice-00 | Origin Story screen — "Shadows of the Blood Alley" selected |
| `narrator/origin_cosmic_fragment.mp3` | voice-00 | Origin Story screen — "The Fallen Cosmic Fragment" selected |
| `narrator/level_up.mp3` | voice-00 | Whenever the hero gains a level (with the Level-Up toast) |
| `radio_host/jingle.mp3` | voice-04 | Metro Pulse hub — station jingle button |
| `oracle/greeting.mp3` | voice-03 | Tactical Advisor — "speak directive" (greeting, then live analysis) |
| `villains/null_void_trophy.mp3` | voice-05 | Trophy Vault — Null Void relic quote |
| `villains/queen_pyre_trophy.mp3` | voice-06 | Trophy Vault — Queen Pyre relic quote |
| `hero_m/entrance.mp3` | voice-01 | Battle Cry Studio — default entrance cry (masculine hero) |
| `hero_f/entrance.mp3` | voice-02 | Battle Cry Studio — default entrance cry (feminine hero) |
| `villains/null_void_cs_1.mp3` | voice-05 | Cutscene "The Event Horizon Mandate" — panel 1 (first Null Void boss fight) |
| `villains/null_void_cs_3.mp3` | voice-05 | Cutscene — panel 3 (the moral-choice taunt) |
| `villains/null_void_cs_4_vigilante.mp3` | voice-05 | Cutscene — reaction to the Vigilante stance |
| `villains/null_void_cs_4_antihero.mp3` | voice-05 | Cutscene — reaction to the Anti-Hero stance |
| `villains/queen_pyre_cs_1.mp3` | voice-06 | Cutscene "Ashes of the High-Rise" — panel 1 (first Queen Pyre boss fight) |
| `villains/queen_pyre_cs_3.mp3` | voice-06 | Cutscene — closing splash line |
| `chloe/cs_1.mp3` | voice-07 | Cutscene "Over Steaming Espresso" — panel 1 (first date with Chloe) |
| `chloe/cs_3.mp3` | voice-07 | Cutscene — panel 3 (the confession) |
| `chloe/cs_4.mp3` | voice-07 | Cutscene — panel 4 (closing line) |
| `villains/null_void_cs_4_paragon.mp3` | voice-05 | Cutscene — reaction to the Paragon stance ("Then fall as an idol…" — script softened from "die" to pass the speech service's content filter) |
| `hero_m/cs_nullvoid_2.mp3`, `hero_f/cs_nullvoid_2.mp3` | voice-01 / voice-02 | Cutscene — hero's reply to Null Void |
| `hero_m/cs_pyre_2.mp3`, `hero_f/cs_pyre_2.mp3` | voice-01 / voice-02 | Cutscene — hero's reply to Queen Pyre |
| `hero_m/cs_chloe_2.mp3`, `hero_f/cs_chloe_2.mp3` | voice-01 / voice-02 | Cutscene — hero's deflection to Chloe |

All 13 cutscene panels are now voiced by the cast (hero panels resolve by hero gender via
`CUTSCENE_PANEL_CLIPS` in `src/data/voiceClips.ts`).

## Where the cutscenes play

`ComicStoryCutscenePlayer` is mounted in two places (it was previously orphaned):

- **App → `handleStartCombat`**: the first boss fight against Null Void or Queen Pyre opens on
  their `PreBossClash` cutscene (any hub that builds the encounter — district raid, Nemesis,
  Villain Tracker, Mega-Crisis…). The stance chosen there is applied to the hero's combat unit
  for that one fight (armor / crit chance / super meter — see `src/utils/cutscenes.ts`) and is
  noted in the battle log. Danger Room simulations never trigger cutscenes.
- **Social hub → first date with Chloe**: `cutscene-chloe-confession` plays before the date
  itself; the chosen reply's `affinityDelta` is applied to her relationship.

Each cutscene plays once per campaign; `hubProgress.story.seenCutsceneIds` is saved with the game.
Panels are voiced as they appear (cast clip → speech synthesis fallback) and the floating caption
bar stays hidden because the speech bubble already shows the line.

## Backlog (fixed lines still worth recording)

- Remaining Trophy Vault quotes (Cipher, Circuit Breaker variant, Titanix) — need a masculine
  villain voice; reuse voice-05 or audition a third rogue.
- Remaining default battle cries (super attack, victory, taunt) ×2 genders.
- Radio callers (5, mixed gender) — would need 2–3 more "citizen" voices.
- Mega-crisis alerts and boss-fight intros (partly dynamic — record the fixed stinger, TTS the rest).

## Legacy clips

`public/audio/*.mp3` (8 files: `narrator_intro`, `hero_oath`, `radio_broadcast`,
`villain_monologue` + `female_*` variants) predate this cast and were never wired into a screen.
Their voice ids are unknown. Treat the cast above as canonical.
