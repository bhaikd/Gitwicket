import React from 'react';
import { DuelComparison } from '@/lib/types';
import { Trophy, Swords } from 'lucide-react';
import { CricketBallIcon } from '../icons/CricketIcons';

interface MatchVerdictProps {
  duel: DuelComparison;
}

export function MatchVerdict({ duel }: MatchVerdictProps) {
  const { playerA, playerB, scoreA, scoreB, winner, verdictText, marginText } = duel;

  const winnerData = winner === 'a' ? playerA : winner === 'b' ? playerB : null;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 p-6 text-center shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Match Result</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {verdictText}
        </h2>

        <p className="mt-2 text-sm text-slate-300 font-mono">
          Final Rounds: <strong className="text-amber-400">@{playerA.github.handle}</strong> ({scoreA}) —{' '}
          <strong className="text-cyan-400">@{playerB.github.handle}</strong> ({scoreB}) • {marginText}
        </p>

        {winnerData && (
          <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs">
            <CricketBallIcon className="w-4 h-4 text-red-500" />
            <span className="text-slate-400">Player of the Match:</span>
            <strong className="text-white font-bold">{winnerData.github.name}</strong>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
              {winnerData.cricket.role}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
