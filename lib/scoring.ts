import {
  GitHubStats,
  CricketStats,
  PlayerCardData,
  PlayerTier,
  PlayerRole,
  FormTrend,
  PlaystyleTag,
  DuelComparison,
  DuelRound,
} from './types';

function clamp01(val: number): number {
  if (isNaN(val) || val <= 0) return 0;
  if (val >= 1) return 1;
  return val;
}

export function computeCricketStats(github: GitHubStats): CricketStats {
  const innings = Math.max(0, github.activeDays || 0);
  const runs = Math.max(0, github.totalContributions || 0);

  // Batting Average: runs per active day
  const battingAverage = innings > 0 ? Number((runs / innings).toFixed(2)) : 0;

  // Strike Rate: scaled velocity (around 100 for 4 commits/active day, up to 250)
  const strikeRate = innings > 0 ? Math.min(250, Math.round((runs / innings) * 25)) : 0;

  // Fifties (50-99 contributions in a month) & Centuries (100+ contributions in a month)
  let fifties = 0;
  let centuries = 0;
  (github.monthlyContributions || []).forEach((m) => {
    if (m.count >= 100) {
      centuries += 1;
    } else if (m.count >= 50) {
      fifties += 1;
    }
  });

  // Not Outs: current daily streak
  const notOuts = Math.max(0, github.currentStreak || 0);

  // Fours: merged PRs
  const fours = Math.max(0, github.prsMerged || 0);

  // Sixes: repos with 10+ stars; 100+ star repos count as huge six (+1 bonus)
  let baseSixes = 0;
  let hugeSixes = 0;
  // If individual repo breakdown is available, we calculate accurately:
  // We can also estimate from starsReceived if individual repos aren't parsed
  // We'll calculate based on starsReceived / top repos
  if (github.starsReceived > 0) {
    // Basic sixes estimation if repos not enumerated:
    // Repos with >= 10 stars and >= 100 stars
    const estimated10Stars = Math.min(github.reposOwned, Math.floor(github.starsReceived / 10));
    baseSixes = Math.max(0, estimated10Stars);
    if (github.starsReceived >= 100) {
      hugeSixes = Math.floor(github.starsReceived / 100);
    }
  }
  const sixes = baseSixes + hugeSixes;

  // Wickets: reviews given + issues closed (helping the team)
  const wickets = Math.max(0, (github.reviewsGiven || 0) + (github.issuesClosed || 0));

  // Bowling average (runs conceded per wicket)
  const bowlingAverage = wickets > 0 ? Number((runs / wickets).toFixed(2)) : 0;
  const catches = Math.max(0, github.issuesOpened || 0);

  // Form: 30-day pace vs yearly pace
  const pace30 = (github.last30DaysContributions || 0) / 30;
  const paceYearly = runs / 365;

  let formTrend: FormTrend = 'steady';
  let formPercentage = 0;

  if (paceYearly === 0) {
    if (pace30 > 0) {
      formTrend = 'blazing';
      formPercentage = 100;
    } else {
      formTrend = 'steady';
      formPercentage = 0;
    }
  } else {
    const ratio = pace30 / paceYearly;
    formPercentage = Math.round((ratio - 1) * 100);
    if (ratio >= 1.25) {
      formTrend = 'blazing';
    } else if (ratio <= 0.75) {
      formTrend = 'slump';
    } else {
      formTrend = 'steady';
    }
  }

  // --- Sub-scores (0 to 100) ---
  // 1. Volume & Consistency (Runs ceiling 2500, Innings ceiling 250)
  const volumeScore = Math.round(
    (0.6 * clamp01(runs / 2500) + 0.4 * clamp01(innings / 250)) * 100
  );

  // 2. Impact & Boundaries (Fours ceiling 60, Sixes ceiling 12)
  const impactScore = Math.round(
    (0.6 * clamp01(fours / 60) + 0.4 * clamp01(sixes / 12)) * 100
  );

  // 3. Teamwork & Bowling (Wickets ceiling 60)
  const teamworkScore = Math.round(clamp01(wickets / 60) * 100);

  // 4. Pace & Strike Rate (Batting Avg ceiling 8, Strike Rate ceiling 180)
  const paceScore = Math.round(
    (0.5 * clamp01(battingAverage / 8) + 0.5 * clamp01(strikeRate / 180)) * 100
  );

  // 5. Stardom & Longevity (Followers ceiling 150, Age ceiling 6 years)
  const stardomScore = Math.round(
    (0.65 * clamp01(github.followers / 150) + 0.35 * clamp01(github.accountAgeYears / 6)) * 100
  );

  // Composite raw rating (0 to 100)
  const rawRating =
    0.25 * volumeScore +
    0.20 * impactScore +
    0.20 * teamworkScore +
    0.20 * paceScore +
    0.15 * stardomScore;

  // Scale to 40 - 99
  let overallRating = Math.round(45 + (rawRating / 100) * 54);
  if (runs === 0 && innings === 0) {
    overallRating = 40;
  }
  overallRating = Math.min(99, Math.max(40, overallRating));

  // Determine Tier
  let tier: PlayerTier = 'Rookie';
  let tierColor = '#94A3B8';
  let tierBorderColor = '#CBD5E1';

  if (overallRating >= 92) {
    tier = 'Legend';
    tierColor = '#F59E0B'; // Amber Gold
    tierBorderColor = '#FBBF24';
  } else if (overallRating >= 82) {
    tier = 'National';
    tierColor = '#10B981'; // Neon Emerald
    tierBorderColor = '#34D399';
  } else if (overallRating >= 70) {
    tier = 'State';
    tierColor = '#06B6D4'; // Sapphire Cyan
    tierBorderColor = '#22D3EE';
  } else if (overallRating >= 55) {
    tier = 'Club';
    tierColor = '#8B5CF6'; // Amethyst Violet
    tierBorderColor = '#A78BFA';
  } else {
    tier = 'Rookie';
    tierColor = '#94A3B8'; // Titanium Slate
    tierBorderColor = '#CBD5E1';
  }

  // Determine Role
  let role: PlayerRole = 'All-rounder';
  let roleDescription = 'Balanced maestro contributing with bat, ball, and in the field.';

  if (volumeScore >= 40 && impactScore >= 35 && teamworkScore >= 35) {
    role = 'All-rounder';
    roleDescription = 'Dominates every facet of the game: builds repos, lands PRs, and reviews teammates.';
  } else if (wickets >= 20 && wickets / Math.max(1, fours) >= 1.4) {
    role = 'Bowler';
    roleDescription = 'Guardian of code quality. Takes crucial wickets by clearing issues and reviewing PRs.';
  } else if (fours >= 20 && fours / Math.max(1, github.reposOwned) >= 1.8) {
    role = 'Finisher';
    roleDescription = 'Clinical closer. Merges high volumes of critical pull requests and ships under pressure.';
  } else if (github.reposOwned >= 8 && strikeRate >= 110) {
    role = 'Opener';
    roleDescription = 'Attacking initiator. Sets up new projects from ball one and establishes the innings.';
  } else if (github.longestStreak >= 28 || innings >= 150) {
    role = 'Anchor';
    roleDescription = 'Rock-solid defense. High stamina, relentless streaks, and unwavering reliability.';
  } else {
    // Default fallback to highest individual skill
    const scores = [
      { r: 'Anchor' as PlayerRole, s: volumeScore, d: 'Consistent contributor holding the innings together.' },
      { r: 'Finisher' as PlayerRole, s: impactScore, d: 'Impact player driving projects across the line.' },
      { r: 'Bowler' as PlayerRole, s: teamworkScore, d: 'Support champion maintaining repository health.' },
      { r: 'Opener' as PlayerRole, s: paceScore, d: 'High velocity builder driving upfront momentum.' },
    ].sort((a, b) => b.s - a.s);

    role = scores[0].r;
    roleDescription = scores[0].d;
  }

  // Determine Playstyle Tags
  const playstyleTags: PlaystyleTag[] = [];

  if ((github.topLanguages || []).length >= 5) {
    playstyleTags.push({
      id: 'polyglot',
      label: 'Polyglot',
      description: 'Master of 5+ programming languages across the stack.',
      iconName: 'Languages',
    });
  }

  if (github.longestStreak >= 50) {
    playstyleTags.push({
      id: 'marathon',
      label: 'Marathon Runner',
      description: `Built an epic ${github.longestStreak}-day unbroken coding streak.`,
      iconName: 'Flame',
    });
  }

  if (github.prsOpened >= 5 && github.prsMerged / github.prsOpened >= 0.8) {
    playstyleTags.push({
      id: 'clean-hitter',
      label: 'Clean Hitter',
      description: 'High PR acceptance rate (>80% merge ratio).',
      iconName: 'CheckCircle2',
    });
  }

  if (hugeSixes >= 1 || github.starsReceived >= 100) {
    playstyleTags.push({
      id: 'big-match-player',
      label: 'Big Match Player',
      description: 'Authored repos that crossed 100+ GitHub stars.',
      iconName: 'Trophy',
    });
  }

  if (github.followers >= 100 && (github.reviewsGiven || 0) >= 15) {
    playstyleTags.push({
      id: 'skipper',
      label: 'Skipper',
      description: 'Respected team captain guiding community and code reviews.',
      iconName: 'Crown',
    });
  }

  if (strikeRate >= 160 && innings <= 120) {
    playstyleTags.push({
      id: 'pinch-hitter',
      label: 'Pinch Hitter',
      description: 'Explosive scoring rate in compact, high-impact bursts.',
      iconName: 'Zap',
    });
  }

  if (wickets >= 15 && (github.reviewsGiven || 0) > (github.issuesClosed || 0)) {
    playstyleTags.push({
      id: 'spin-wizard',
      label: 'Spin Wizard',
      description: 'Tactical code reviewer unraveling complex pull requests.',
      iconName: 'Sparkles',
    });
  }

  if (github.currentStreak >= 14) {
    playstyleTags.push({
      id: 'night-watchman',
      label: 'Night Watchman',
      description: 'Steadfast guard currently batting on an active streak.',
      iconName: 'Shield',
    });
  }

  // Ensure at least 1-2 tags exist for every player
  if (playstyleTags.length === 0) {
    playstyleTags.push({
      id: 'rising-talent',
      label: 'Rising Talent',
      description: 'Stepping onto the GitHub pitch with promise and ambition.',
      iconName: 'Star',
    });
  }

  return {
    innings,
    runs,
    battingAverage,
    strikeRate,
    fifties,
    centuries,
    notOuts,
    fours,
    sixes,
    hugeSixes,
    wickets,
    bowlingAverage,
    catches,
    overallRating,
    tier,
    tierColor,
    tierBorderColor,
    role,
    roleDescription,
    formTrend,
    formPercentage,
    playstyleTags,
    volumeScore,
    impactScore,
    teamworkScore,
    paceScore,
    stardomScore,
  };
}

export function buildPlayerCard(github: GitHubStats): PlayerCardData {
  const cricket = computeCricketStats(github);
  return { github, cricket };
}

export function calculateDuel(playerA: PlayerCardData, playerB: PlayerCardData): DuelComparison {
  const cA = playerA.cricket;
  const cB = playerB.cricket;

  const rounds: DuelRound[] = [
    {
      title: 'Batting Runs',
      description: 'Total contributions in the last 12 months',
      unit: 'runs',
      valA: cA.runs,
      valB: cB.runs,
      winner: cA.runs > cB.runs ? 'a' : cA.runs < cB.runs ? 'b' : 'tie',
      scoreImpact: Math.abs(cA.runs - cB.runs),
    },
    {
      title: 'Strike Rate',
      description: 'Contribution velocity per active day',
      unit: 'SR',
      valA: cA.strikeRate,
      valB: cB.strikeRate,
      winner: cA.strikeRate > cB.strikeRate ? 'a' : cA.strikeRate < cB.strikeRate ? 'b' : 'tie',
      scoreImpact: Math.abs(cA.strikeRate - cB.strikeRate),
    },
    {
      title: 'Boundaries (4s & 6s)',
      description: 'Merged PRs (4s) + Starred Repos (6s)',
      unit: 'bdys',
      valA: cA.fours + cA.sixes,
      valB: cB.fours + cB.sixes,
      winner: cA.fours + cA.sixes > cB.fours + cB.sixes ? 'a' : cA.fours + cA.sixes < cB.fours + cB.sixes ? 'b' : 'tie',
      scoreImpact: Math.abs(cA.fours + cA.sixes - (cB.fours + cB.sixes)),
    },
    {
      title: 'Bowling (Wickets)',
      description: 'Code reviews completed + issues solved',
      unit: 'wkts',
      valA: cA.wickets,
      valB: cB.wickets,
      winner: cA.wickets > cB.wickets ? 'a' : cA.wickets < cB.wickets ? 'b' : 'tie',
      scoreImpact: Math.abs(cA.wickets - cB.wickets),
    },
    {
      title: 'Stamina & Streaks',
      description: 'Longest unbroken active streak',
      unit: 'days',
      valA: playerA.github.longestStreak,
      valB: playerB.github.longestStreak,
      winner:
        playerA.github.longestStreak > playerB.github.longestStreak
          ? 'a'
          : playerA.github.longestStreak < playerB.github.longestStreak
          ? 'b'
          : 'tie',
      scoreImpact: Math.abs(playerA.github.longestStreak - playerB.github.longestStreak),
    },
    {
      title: 'Overall Rating',
      description: 'Master T20 Card Rating out of 99',
      unit: 'OVR',
      valA: cA.overallRating,
      valB: cB.overallRating,
      winner: cA.overallRating > cB.overallRating ? 'a' : cA.overallRating < cB.overallRating ? 'b' : 'tie',
      scoreImpact: Math.abs(cA.overallRating - cB.overallRating),
    },
  ];

  let scoreA = 0;
  let scoreB = 0;

  rounds.forEach((r) => {
    if (r.winner === 'a') scoreA += 1;
    if (r.winner === 'b') scoreB += 1;
  });

  let winner: 'a' | 'b' | 'tie' = 'tie';
  let verdictText = 'Match Tied! A thrilling super over finish.';
  let marginText = 'Level on points';

  if (scoreA > scoreB) {
    winner = 'a';
    const margin = scoreA - scoreB;
    const wicketLead = Math.max(1, Math.min(10, cA.wickets - cB.wickets));
    const runLead = Math.max(5, cA.runs - cB.runs);
    if (cA.role === 'Bowler') {
      verdictText = `@${playerA.github.handle} won by ${wicketLead} wickets!`;
      marginText = `Led ${scoreA} rounds to ${scoreB}`;
    } else {
      verdictText = `@${playerA.github.handle} won by ${margin > 2 ? `${runLead} runs` : `${margin * 2} wickets`}!`;
      marginText = `Secured ${scoreA} of 6 rounds`;
    }
  } else if (scoreB > scoreA) {
    winner = 'b';
    const margin = scoreB - scoreA;
    const wicketLead = Math.max(1, Math.min(10, cB.wickets - cA.wickets));
    const runLead = Math.max(5, cB.runs - cA.runs);
    if (cB.role === 'Bowler') {
      verdictText = `@${playerB.github.handle} won by ${wicketLead} wickets!`;
      marginText = `Led ${scoreB} rounds to ${scoreA}`;
    } else {
      verdictText = `@${playerB.github.handle} won by ${margin > 2 ? `${runLead} runs` : `${margin * 2} wickets`}!`;
      marginText = `Secured ${scoreB} of 6 rounds`;
    }
  }

  return {
    playerA,
    playerB,
    rounds,
    scoreA,
    scoreB,
    winner,
    verdictText,
    marginText,
  };
}
