import { describe, it, expect } from 'vitest';
import { computeCricketStats, calculateDuel, buildPlayerCard } from './scoring';
import { GitHubStats } from './types';

function createMockGitHub(overrides: Partial<GitHubStats> = {}): GitHubStats {
  return {
    handle: 'mockdev',
    name: 'Mock Developer',
    avatar: 'https://github.com/ghost.png',
    accountAgeYears: 2,
    createdAt: '2022-01-01T00:00:00Z',
    followers: 15,
    following: 10,
    totalContributions: 600,
    activeDays: 120,
    longestStreak: 20,
    currentStreak: 5,
    commitsLastYear: 500,
    prsOpened: 15,
    prsMerged: 12,
    reviewsGiven: 8,
    issuesOpened: 5,
    issuesClosed: 6,
    reposOwned: 6,
    starsReceived: 25,
    topLanguages: [
      { name: 'TypeScript', color: '#3178c6', count: 10, percentage: 60 },
      { name: 'Python', color: '#3572A5', count: 5, percentage: 30 },
      { name: 'Rust', color: '#dea584', count: 2, percentage: 10 },
    ],
    monthlyContributions: [
      { month: 'Jan', year: 2026, count: 55 },
      { month: 'Feb', year: 2026, count: 65 },
      { month: 'Mar', year: 2026, count: 40 },
    ],
    last30DaysContributions: 80,
    ...overrides,
  };
}

describe('Gitwicket Scoring Engine', () => {
  it('handles zero contributions / fresh account cleanly without NaN or division by zero', () => {
    const freshAccount = createMockGitHub({
      totalContributions: 0,
      activeDays: 0,
      longestStreak: 0,
      currentStreak: 0,
      commitsLastYear: 0,
      prsOpened: 0,
      prsMerged: 0,
      reviewsGiven: 0,
      issuesOpened: 0,
      issuesClosed: 0,
      reposOwned: 0,
      starsReceived: 0,
      followers: 0,
      accountAgeYears: 0,
      monthlyContributions: [],
      last30DaysContributions: 0,
      topLanguages: [],
    });

    const stats = computeCricketStats(freshAccount);

    expect(stats.innings).toBe(0);
    expect(stats.runs).toBe(0);
    expect(stats.battingAverage).toBe(0);
    expect(stats.strikeRate).toBe(0);
    expect(stats.overallRating).toBe(40);
    expect(stats.tier).toBe('Rookie');
    expect(isNaN(stats.battingAverage)).toBe(false);
    expect(isNaN(stats.overallRating)).toBe(false);
    expect(stats.playstyleTags.length).toBeGreaterThan(0);
  });

  it('calculates average, strike rate, and boundaries for a student dev', () => {
    const dev = createMockGitHub({
      totalContributions: 600,
      activeDays: 150,
      prsMerged: 15,
      starsReceived: 35,
    });

    const stats = computeCricketStats(dev);

    expect(stats.innings).toBe(150);
    expect(stats.runs).toBe(600);
    expect(stats.battingAverage).toBe(4); // 600 / 150
    expect(stats.strikeRate).toBe(100); // 4 * 25
    expect(stats.fours).toBe(15);
    expect(stats.sixes).toBeGreaterThanOrEqual(3);
    expect(stats.overallRating).toBeGreaterThanOrEqual(55);
  });

  it('awards Legend tier to prolific open-source contributors', () => {
    const legendDev = createMockGitHub({
      handle: 'open_source_god',
      totalContributions: 4200,
      activeDays: 320,
      longestStreak: 120,
      currentStreak: 45,
      prsOpened: 180,
      prsMerged: 160,
      reviewsGiven: 95,
      issuesClosed: 80,
      reposOwned: 25,
      starsReceived: 3500,
      followers: 850,
      accountAgeYears: 8,
      last30DaysContributions: 380,
      topLanguages: [
        { name: 'TypeScript', color: '#3178c6', count: 20, percentage: 40 },
        { name: 'Rust', color: '#dea584', count: 15, percentage: 30 },
        { name: 'Go', color: '#00ADD8', count: 10, percentage: 20 },
        { name: 'Python', color: '#3572A5', count: 5, percentage: 5 },
        { name: 'C', color: '#555555', count: 3, percentage: 5 },
      ],
    });

    const stats = computeCricketStats(legendDev);

    expect(stats.overallRating).toBeGreaterThanOrEqual(92);
    expect(stats.overallRating).toBeLessThanOrEqual(99);
    expect(stats.tier).toBe('Legend');
    expect(stats.tierColor).toBe('#F59E0B');
  });

  it('assigns Bowler role when reviews and closed issues dominate', () => {
    const bowlerDev = createMockGitHub({
      totalContributions: 700,
      activeDays: 110,
      prsMerged: 5,
      reviewsGiven: 45,
      issuesClosed: 30,
      reposOwned: 4,
    });

    const stats = computeCricketStats(bowlerDev);
    expect(stats.wickets).toBe(75);
    expect(stats.role).toBe('Bowler');
  });

  it('assigns Finisher role when merged PRs dominate repo count', () => {
    const finisherDev = createMockGitHub({
      totalContributions: 1200,
      activeDays: 130,
      prsMerged: 60,
      reposOwned: 5,
      reviewsGiven: 8,
      issuesClosed: 5,
    });

    const stats = computeCricketStats(finisherDev);
    expect(stats.fours).toBe(60);
    expect(stats.role).toBe('Finisher');
  });

  it('assigns Anchor role for high streaks and steady volume', () => {
    const anchorDev = createMockGitHub({
      totalContributions: 900,
      activeDays: 200,
      longestStreak: 55,
      currentStreak: 25,
      prsMerged: 8,
      reviewsGiven: 4,
      issuesClosed: 2,
      reposOwned: 4,
    });

    const stats = computeCricketStats(anchorDev);
    expect(stats.role).toBe('Anchor');
  });

  it('detects playstyle tags accurately', () => {
    const polyglotDev = createMockGitHub({
      longestStreak: 65,
      prsOpened: 20,
      prsMerged: 18,
      starsReceived: 500,
      followers: 120,
      reviewsGiven: 25,
      topLanguages: [
        { name: 'JS', color: '#f1e05a', count: 1, percentage: 20 },
        { name: 'TS', color: '#3178c6', count: 1, percentage: 20 },
        { name: 'Go', color: '#00add8', count: 1, percentage: 20 },
        { name: 'Rust', color: '#dea584', count: 1, percentage: 20 },
        { name: 'Python', color: '#3572a5', count: 1, percentage: 20 },
      ],
    });

    const stats = computeCricketStats(polyglotDev);
    const tagIds = stats.playstyleTags.map((t) => t.id);

    expect(tagIds).toContain('polyglot');
    expect(tagIds).toContain('marathon');
    expect(tagIds).toContain('clean-hitter');
    expect(tagIds).toContain('big-match-player');
    expect(tagIds).toContain('skipper');
  });

  it('calculates head-to-head duel rounds and declares accurate cricket winner', () => {
    const playerA = buildPlayerCard(
      createMockGitHub({
        handle: 'virat_coder',
        totalContributions: 2500,
        activeDays: 240,
        prsMerged: 50,
        starsReceived: 200,
        reviewsGiven: 40,
        issuesClosed: 30,
        longestStreak: 80,
      })
    );

    const playerB = buildPlayerCard(
      createMockGitHub({
        handle: 'rookie_sharma',
        totalContributions: 400,
        activeDays: 80,
        prsMerged: 8,
        starsReceived: 10,
        reviewsGiven: 5,
        issuesClosed: 2,
        longestStreak: 12,
      })
    );

    const duel = calculateDuel(playerA, playerB);

    expect(duel.winner).toBe('a');
    expect(duel.scoreA).toBeGreaterThan(duel.scoreB);
    expect(duel.verdictText).toContain('@virat_coder won');
    expect(duel.rounds.length).toBe(6);
  });
});
