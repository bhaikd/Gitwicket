import React from 'react';
import { DuelComparison } from '@/lib/types';
import { PlayerCard } from '../card/PlayerCard';
import { MatchVerdict } from './MatchVerdict';
import { Swords, Check, Trophy } from 'lucide-react';
import Link from 'next/link';

interface DuelArenaProps {
  duel: DuelComparison;
}

export function DuelArena({ duel }: DuelArenaProps) {
  const { playerA, playerB, rounds, winner } = duel;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Top Match Verdict */}
      <MatchVerdict duel={duel} />

      {/* Side-by-Side Cards Face-off */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
        {/* Player A Column */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Team A (Striker)
            </span>
            {winner === 'a' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Trophy className="w-3.5 h-3.5" /> Winner
              </span>
            )}
          </div>
          <PlayerCard data={playerA} cardId="card-player-a" />
          <Link
            href={`/${playerA.github.handle}`}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-mono transition-colors"
          >
            View full scorecard for @{playerA.github.handle} &rarr;
          </Link>
        </div>

        {/* Player B Column */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Team B (Challenger)
            </span>
            {winner === 'b' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                <Trophy className="w-3.5 h-3.5" /> Winner
              </span>
            )}
          </div>
          <PlayerCard data={playerB} cardId="card-player-b" />
          <Link
            href={`/${playerB.github.handle}`}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-mono transition-colors"
          >
            View full scorecard for @{playerB.github.handle} &rarr;
          </Link>
        </div>
      </div>

      {/* Round-by-Round Breakdown Table */}
      <div className="w-full rounded-2xl bg-slate-900/90 border border-white/10 p-5 sm:p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Head-to-Head Round Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 text-left font-sans">Contest Category</th>
                <th className="pb-3 text-right">@{playerA.github.handle}</th>
                <th className="pb-3 text-center">Outcome</th>
                <th className="pb-3 text-left">@{playerB.github.handle}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rounds.map((r, i) => {
                const aWon = r.winner === 'a';
                const bWon = r.winner === 'b';

                return (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-sans">
                      <div className="font-bold text-white text-xs">{r.title}</div>
                      <div className="text-[11px] text-slate-400">{r.description}</div>
                    </td>

                    {/* Stat A */}
                    <td className="py-3.5 text-right font-bold">
                      <span
                        className={`px-2 py-1 rounded ${
                          aWon ? 'bg-amber-500/20 text-amber-300 font-black' : 'text-slate-300'
                        }`}
                      >
                        {r.valA} {r.unit}
                      </span>
                    </td>

                    {/* Result */}
                    <td className="py-3.5 text-center">
                      {aWon && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Check className="w-3 h-3" /> A Won
                        </span>
                      )}
                      {bWon && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          B Won <Check className="w-3 h-3" />
                        </span>
                      )}
                      {r.winner === 'tie' && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          Tie
                        </span>
                      )}
                    </td>

                    {/* Stat B */}
                    <td className="py-3.5 text-left font-bold">
                      <span
                        className={`px-2 py-1 rounded ${
                          bWon ? 'bg-cyan-500/20 text-cyan-300 font-black' : 'text-slate-300'
                        }`}
                      >
                        {r.valB} {r.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
