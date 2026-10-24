import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/ui/SearchBar';
import { FamousDevsRow } from '@/components/ui/FamousDevsRow';
import { PlayerCard } from '@/components/card/PlayerCard';
import { buildPlayerCard } from '@/lib/scoring';
import { CricketBatIcon, CricketBallIcon, StumpsIcon } from '@/components/icons/CricketIcons';
import { Swords, Trophy, Sparkles, Flame, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  // Demo card for the hero showcase
  const demoCardData = buildPlayerCard({
    handle: 'gitwicket',
    name: 'Rohit Sharma (Dev Edition)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    accountAgeYears: 5.4,
    createdAt: '2020-03-15T00:00:00Z',
    followers: 240,
    following: 45,
    totalContributions: 2150,
    activeDays: 235,
    longestStreak: 48,
    currentStreak: 18,
    commitsLastYear: 1820,
    prsOpened: 55,
    prsMerged: 48,
    reviewsGiven: 38,
    issuesOpened: 14,
    issuesClosed: 26,
    reposOwned: 12,
    starsReceived: 620,
    topLanguages: [
      { name: 'TypeScript', color: '#3178c6', count: 18, percentage: 55 },
      { name: 'Rust', color: '#dea584', count: 8, percentage: 25 },
      { name: 'Python', color: '#3572A5', count: 4, percentage: 20 },
    ],
    monthlyContributions: [
      { month: 'Nov', year: 2025, count: 140 },
      { month: 'Dec', year: 2025, count: 185 },
      { month: 'Jan', year: 2026, count: 210 },
      { month: 'Feb', year: 2026, count: 195 },
      { month: 'Mar', year: 2026, count: 240 },
      { month: 'Apr', year: 2026, count: 220 },
      { month: 'May', year: 2026, count: 175 },
      { month: 'Jun', year: 2026, count: 190 },
      { month: 'Jul', year: 2026, count: 160 },
      { month: 'Aug', year: 2026, count: 205 },
      { month: 'Sep', year: 2026, count: 230 },
      { month: 'Oct', year: 2026, count: 215 },
    ],
    last30DaysContributions: 215,
  });

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden">
      {/* Background Stadium Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Top Announcement Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-300 mb-6 shadow-md">
          <CricketBallIcon className="w-3.5 h-3.5 text-red-500" />
          <span>The Cricket Scorecard for GitHub Developers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-400 font-bold">T20 Edition</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Turn your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300">GitHub Profile</span> into a Cricket Player Card
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Step up to the crease. Convert your commits into runs, streaks into not-outs, merged PRs into boundaries, and code reviews into bowling wickets.
        </p>

        {/* Search Bar Input */}
        <div className="w-full mt-8 sm:mt-10">
          <SearchBar key="home-search" size="lg" autoFocus={true} />
        </div>

        {/* Famous Developers Chips */}
        <div className="mt-8">
          <FamousDevsRow />
        </div>
      </div>

      {/* Hero Demo Showcase */}
      <div className="w-full max-w-5xl mx-auto mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Explanation Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>How Gitwicket Scores Your Profile</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            Your Git commits, pull requests, and reviews mapped into T20 stats.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <CricketBatIcon className="w-4 h-4" />
                <span>Runs & Innings</span>
              </div>
              <p className="text-xs text-slate-400">
                1 contribution = 1 run. Active days count as innings played. Calculated batting average and velocity strike rate.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                <Flame className="w-4 h-4" />
                <span>Boundaries (4s & 6s)</span>
              </div>
              <p className="text-xs text-slate-400">
                Merged PRs are scored as crisp boundaries (4s). Starred repositories (10+ ⭐) are hit out of the park for sixes!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <StumpsIcon className="w-4 h-4" />
                <span>Bowling Wickets</span>
              </div>
              <p className="text-xs text-slate-400">
                Code reviews submitted and resolved issues count as vital wickets, honoring community support.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
                <Swords className="w-4 h-4" />
                <span>Duel Match Mode</span>
              </div>
              <p className="text-xs text-slate-400">
                Put two developers in the ring across 6 rounds with cricket match verdicts like &quot;antfu won by 4 wickets!&quot;
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/duel?a=shadcn&b=leerob"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Watch Demo Duel: shadcn vs leerob</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Right Card Showcase Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            {/* Shimmer label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-md z-20">
              Interactive Sample Card
            </div>
            <PlayerCard data={demoCardData} cardId="sample-hero-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
