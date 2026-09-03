import { ComicIssue, HeroCharacter, VillainCharacter } from '../types/game';

const COMIC_TITLES = [
  'VANGUARD CHRONICLES',
  'THE RADIANT CRUSADER',
  'APEX HORIZON',
  'SHADOWS OF THE NIGHT',
  'KNIGHTS OF METRO NOVA',
  'TALES OF VALOR',
  'CRISIS INFINITE',
  'DEFENDERS OF TOMORROW'
];

const SUBTITLES = [
  'Dawn of the Dark Singularity',
  'When Shadows Collide',
  'Trial by Fire and Steel',
  'Secrets of the Underbelly',
  'The Fall of Olympus',
  'Unbreakable Vow',
  'A City on the Edge'
];

const FAN_NAMES = [
  'Stan L.', 'Roy T.', 'Gwen S.', 'Clark K.', 'Bruce W.', 'Peter P.', 'Tony S.', 'Diana P.',
  'Miles M.', 'Barry A.', 'Hal J.', 'Steve R.', 'Wanda M.', 'Ororo M.'
];

const POSITIVE_REVIEWS = [
  'The artwork and fight choreo in this issue were unmatched!',
  'Instant classic! The villain showdown had me on the edge of my seat.',
  'Love the balance between heroics and civilian secret identity drama!',
  'Best superhero run currently on comic stands. 10/10!',
  'That climax splash page was worth every single dollar.'
];

const NEUTRAL_REVIEWS = [
  'Solid fight scenes, but I wanted more dialogue with the sidekick.',
  'Good pacing, though the city damage cleanup felt rushed.',
  'Fun action beats, looking forward to the next monthly arc.'
];

export function generateComicIssue(
  issueNum: number,
  hero: HeroCharacter,
  villains: VillainCharacter[],
  recentCrimesSolved: number,
  villainDefeatedName?: string
): ComicIssue {
  const baseTitle = COMIC_TITLES[(issueNum - 1) % COMIC_TITLES.length];
  const subtitle = SUBTITLES[(issueNum - 1) % SUBTITLES.length];
  
  // Calculate grade based on hero charisma, public approval, and crimes solved
  const score = hero.stats.charisma * 3 + hero.publicApproval * 0.4 + recentCrimesSolved * 10;
  
  let ratingGrade: ComicIssue['ratingGrade'] = 'B';
  let salesMultiplier = 1.0;
  let badge = 'Standard Edition';

  if (score > 85 || villainDefeatedName) {
    ratingGrade = 'S+';
    salesMultiplier = 2.8;
    badge = '🌟 Collector\'s Gold Edition';
  } else if (score > 70) {
    ratingGrade = 'S';
    salesMultiplier = 2.2;
    badge = '🔥 Blockbuster Hit';
  } else if (score > 55) {
    ratingGrade = 'A';
    salesMultiplier = 1.6;
    badge = '⚡ Fan Favorite';
  } else if (score > 40) {
    ratingGrade = 'B';
    salesMultiplier = 1.2;
    badge = '🗞️ Newsstand Pick';
  } else if (score > 25) {
    ratingGrade = 'C';
    salesMultiplier = 0.9;
    badge = '📦 Regular Run';
  } else {
    ratingGrade = 'D';
    salesMultiplier = 0.6;
    badge = '📉 Discount Rack';
  }

  const baseSales = 25000 + issueNum * 3000;
  const salesCount = Math.floor(baseSales * salesMultiplier + (Math.random() * 5000));
  const coverPrice = 3.99;
  const royaltyRate = 0.08 + (hero.stats.charisma * 0.005);
  const revenue = Math.floor(salesCount * coverPrice * royaltyRate);

  const fanLetters = [
    {
      author: FAN_NAMES[Math.floor(Math.random() * FAN_NAMES.length)],
      message: POSITIVE_REVIEWS[Math.floor(Math.random() * POSITIVE_REVIEWS.length)],
      rating: 5
    },
    {
      author: FAN_NAMES[Math.floor(Math.random() * FAN_NAMES.length)],
      message: score > 50 ? POSITIVE_REVIEWS[Math.floor(Math.random() * POSITIVE_REVIEWS.length)] : NEUTRAL_REVIEWS[Math.floor(Math.random() * NEUTRAL_REVIEWS.length)],
      rating: score > 50 ? 4 : 3
    }
  ];

  const primaryVillain = villainDefeatedName || (villains.length > 0 ? villains[Math.floor(Math.random() * villains.length)].name : 'Syndicate Boss');

  const highlightStory = villainDefeatedName
    ? `${hero.heroName} engaged in a cataclysmic battle against ${villainDefeatedName}, pushing their powers to the absolute limit to save thousands of citizens across the metropolis!`
    : `${hero.heroName} patrolled the neon-lit rooftops of Metro Nova, breaking up illegal weapon shipments and rescuing civilians in the nick of time.`;

  return {
    issueNumber: issueNum,
    title: `${baseTitle} #${issueNum}`,
    subtitle,
    coverHeroName: hero.heroName,
    primaryVillainFought: primaryVillain,
    ratingGrade,
    salesCount,
    revenue,
    fanLetters,
    highlightStory,
    coverColor: hero.colors.primary,
    unlockedCoverBadge: badge,
    datePublished: `Week ${Math.ceil(issueNum / 2)}, Day ${(issueNum * 3) % 28 + 1}`
  };
}
