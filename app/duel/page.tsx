import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGitHubStats } from '@/lib/github';
import { buildPlayerCard, calculateDuel } from '@/lib/scoring';
import { DuelArena } from '@/components/duel/DuelArena';
import { Swords, ArrowLeft, Users, Trophy } from 'lucide-react';
import { CricketBallIcon } from '@/components/icons/CricketIcons';

interface DuelPageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export const metadata: Metadata = {
  title: 'Cricket Duel Arena • Gitwicket',
  description:
    'Compare two GitHub developers head-to-head in a 6-round cricket match showdown.',
};

const CLASSIC_MATCHUPS = [
  { a: 'shadcn', b: 'leerob', label: 'shadcn vs leerob' },
  { a: 'antfu', b: 'gaearon', label: 'antfu vs Dan Abramov' },
  { a: 'torvalds', b: 'sindresorhus', label: 'Linus vs Sindre' },
];

export default async function DuelPage({ searchParams }: DuelPageProps) {
  const { a, b } = await searchParams;

  const playerAHandle = a?.trim().replace(/^@/, '');
  const playerBHandle = b?.trim().replace(/^@/, '');

  // If both players are provided, compute duel
  if (playerAHandle && playerBHandle) {
    let errorMsg: string | null = null;
    let duelData = null;

    try {
      const [statsA, statsB] = await Promise.all([
        getGitHubStats(playerAHandle),
        getGitHubStats(playerBHandle),
      ]);

      const cardA = buildPlayerCard(statsA);
      const cardB = buildPlayerCard(statsB);
      duelData = calculateDuel(cardA, cardB);
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : 'Failed to retrieve duel players.';
    }

    if (errorMsg || !duelData) {
      return (
        <div className="w-full max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-rose-500/30 flex items-center justify-center mb-4">
            <Swords className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-white">Duel Match Postponed</h2>
          <p className="mt-2 text-sm text-slate-400">{errorMsg}</p>
          <Link
            href="/duel"
            className="mt-6 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            Pick New Contestants
          </Link>
        </div>
      );
    }

    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pavilion Home</span>
          </Link>

          <Link
            href="/duel"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 font-mono transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Rematch or Change Players</span>
          </Link>
        </div>

        <DuelArena duel={duelData} />
      </div>
    );
  }

  // Interactive Duel Matchmaker form when 0 or 1 player selected
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-300 mb-6">
        <CricketBallIcon className="w-3.5 h-3.5 text-red-500" />
        <span>Head-to-Head Developer Showdown</span>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span className="text-rose-400 font-bold">6-Round Match</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
        Cricket <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Duel Arena</span>
      </h1>

      <p className="mt-4 text-base text-slate-400 max-w-lg">
        Pit two GitHub accounts against each other. Runs, Strike Rate, Boundaries, Wickets, Streaks, and Overall Rating decide the winner.
      </p>

      {/* Duel Form */}
      <form
        action="/duel"
        method="GET"
        className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Player A Input */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
              Striker (Player 1)
            </label>
            <input
              type="text"
              name="a"
              defaultValue={playerAHandle || ''}
              placeholder="e.g. shadcn"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-medium"
            />
          </div>

          {/* Player B Input */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Challenger (Player 2)
            </label>
            <input
              type="text"
              name="b"
              defaultValue={playerBHandle || ''}
              placeholder="e.g. leerob"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-rose-500 via-amber-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Swords className="w-4 h-4" />
          <span>Commence Cricket Duel</span>
        </button>
      </form>

      {/* Classic Matchup Shortcuts */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Featured Rivalries
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CLASSIC_MATCHUPS.map((m, idx) => (
            <Link
              key={idx}
              href={`/duel?a=${m.a}&b=${m.b}`}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 text-xs font-mono font-bold text-slate-300 transition-colors"
            >
              {m.label} &rarr;
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
