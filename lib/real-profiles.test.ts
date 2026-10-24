import { describe, it, expect } from 'vitest';
import { getGitHubStats } from './github';
import { buildPlayerCard } from './scoring';

describe('Real Profile Verification', () => {
  it('fetches and scores torvalds (heavy contributor / legend)', async () => {
    try {
      const stats = await getGitHubStats('torvalds');
      const card = buildPlayerCard(stats);

      expect(card.github.handle.toLowerCase()).toBe('torvalds');
      expect(card.cricket.runs).toBeGreaterThan(0);
      expect(card.cricket.innings).toBeGreaterThan(0);
      expect(card.cricket.overallRating).toBeGreaterThanOrEqual(70);
      expect(['Legend', 'National', 'State']).toContain(card.cricket.tier);
      expect(card.cricket.playstyleTags.length).toBeGreaterThan(0);
      expect(card.github.monthlyContributions.length).toBeGreaterThan(0);
      console.log(`[Verified torvalds] OVR: ${card.cricket.overallRating} | Tier: ${card.cricket.tier} | Role: ${card.cricket.role} | Runs: ${card.cricket.runs} | SR: ${card.cricket.strikeRate}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'GitHubRateLimitError') {
        console.warn('GitHub rate limit reached during test, passing test gracefully.');
        expect(true).toBe(true);
      } else {
        throw err;
      }
    }
  }, 15000);

  it('fetches and scores shadcn (popular modern dev)', async () => {
    try {
      const stats = await getGitHubStats('shadcn');
      const card = buildPlayerCard(stats);

      expect(card.github.handle.toLowerCase()).toBe('shadcn');
      expect(card.cricket.runs).toBeGreaterThan(0);
      expect(card.cricket.overallRating).toBeGreaterThanOrEqual(55);
      expect(card.cricket.playstyleTags.length).toBeGreaterThan(0);
      console.log(`[Verified shadcn] OVR: ${card.cricket.overallRating} | Tier: ${card.cricket.tier} | Role: ${card.cricket.role} | Runs: ${card.cricket.runs} | 6s: ${card.cricket.sixes}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'GitHubRateLimitError') {
        console.warn('GitHub rate limit reached during test, passing test gracefully.');
        expect(true).toBe(true);
      } else {
        throw err;
      }
    }
  }, 15000);

  it('fetches and scores octocat (baseline reference account)', async () => {
    try {
      const stats = await getGitHubStats('octocat');
      const card = buildPlayerCard(stats);

      expect(card.github.handle.toLowerCase()).toBe('octocat');
      expect(card.cricket.overallRating).toBeGreaterThanOrEqual(40);
      expect(card.cricket.playstyleTags.length).toBeGreaterThan(0);
      console.log(`[Verified octocat] OVR: ${card.cricket.overallRating} | Tier: ${card.cricket.tier} | Role: ${card.cricket.role} | Runs: ${card.cricket.runs}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'GitHubRateLimitError') {
        console.warn('GitHub rate limit reached during test, passing test gracefully.');
        expect(true).toBe(true);
      } else {
        throw err;
      }
    }
  }, 15000);
});
