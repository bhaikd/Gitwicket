export type PlayerTier = 'Legend' | 'National' | 'State' | 'Club' | 'Rookie';

export type PlayerRole = 'Opener' | 'Anchor' | 'Finisher' | 'Bowler' | 'All-rounder';

export type FormTrend = 'blazing' | 'steady' | 'slump';

export interface PlaystyleTag {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export interface MonthlyContribution {
  month: string; // e.g. "Jan", "Feb"
  year: number;
  count: number;
}

export interface LanguageStat {
  name: string;
  color: string;
  count: number;
  percentage: number;
}

export interface GitHubStats {
  handle: string;
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
  company?: string;
  accountAgeYears: number;
  createdAt: string;
  followers: number;
  following: number;
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  commitsLastYear: number;
  prsOpened: number;
  prsMerged: number;
  reviewsGiven: number;
  issuesOpened: number;
  issuesClosed: number;
  reposOwned: number;
  starsReceived: number;
  topLanguages: LanguageStat[];
  monthlyContributions: MonthlyContribution[];
  last30DaysContributions: number;
}

export interface CricketStats {
  // Batting stats
  innings: number;             // Active days in last year
  runs: number;                // Total contributions in last year
  battingAverage: number;      // Contributions per active day
  strikeRate: number;          // Pace / velocity (0-250 scale)
  fifties: number;             // Months with 50+ contributions
  centuries: number;           // Months with 100+ contributions
  notOuts: number;             // Current streak (days)
  fours: number;               // Merged pull requests
  sixes: number;               // Repos with 10+ stars (+ bonus for 100+ stars)
  hugeSixes: number;           // Repos with 100+ stars

  // Bowling & Fielding stats
  wickets: number;             // Code reviews given + issues closed
  bowlingAverage: number;      // Ratio of contributions to wickets
  catches: number;             // Issues opened / triaged

  // Meta & Classification
  overallRating: number;       // 40 - 99 scale
  tier: PlayerTier;
  tierColor: string;
  tierBorderColor: string;
  role: PlayerRole;
  roleDescription: string;
  formTrend: FormTrend;
  formPercentage: number;      // % change in last 30d vs yearly average
  playstyleTags: PlaystyleTag[];

  // Sub-scores (0 - 100) for radar / breakdown
  volumeScore: number;
  impactScore: number;
  teamworkScore: number;
  paceScore: number;
  stardomScore: number;
}

export interface PlayerCardData {
  github: GitHubStats;
  cricket: CricketStats;
}

export interface DuelRound {
  title: string;
  description: string;
  unit: string;
  valA: number | string;
  valB: number | string;
  winner: 'a' | 'b' | 'tie';
  scoreImpact: number;
}

export interface DuelComparison {
  playerA: PlayerCardData;
  playerB: PlayerCardData;
  rounds: DuelRound[];
  scoreA: number;
  scoreB: number;
  winner: 'a' | 'b' | 'tie';
  verdictText: string;
  marginText: string;
}
