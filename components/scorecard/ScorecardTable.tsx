import React from 'react';
import { PlayerCardData } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { CricketBatIcon, CricketBallIcon, StumpsIcon } from '../icons/CricketIcons';

interface ScorecardTableProps {
  data: PlayerCardData;
}

export function ScorecardTable({ data }: ScorecardTableProps) {
  const { github, cricket } = data;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden text-white shadow-xl">
      {/* Match Header Banner */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Official GitHub T20 Scorecard
          </h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Season: Last 365 Days • Venue: GitHub Public Arena
        </div>
      </div>

      {/* Batting Card Section */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <CricketBatIcon className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">
            Batting Card (Code Production)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="pb-2 font-sans">Batter</th>
                <th className="pb-2 font-sans">Dismissal / Status</th>
                <th className="pb-2 text-right">R (Runs)</th>
                <th className="pb-2 text-right">B (Days)</th>
                <th className="pb-2 text-right">4s (PRs)</th>
                <th className="pb-2 text-right">6s (Stars)</th>
                <th className="pb-2 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 font-sans font-bold text-white flex items-center gap-2">
                  <span>{github.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {cricket.role}
                  </span>
                </td>
                <td className="py-3 text-slate-300">
                  {cricket.notOuts > 0 ? (
                    <span className="text-emerald-400 font-sans font-medium">
                      not out ({cricket.notOuts}d streak)
                    </span>
                  ) : (
                    <span className="text-slate-400 font-sans">
                      c. Context Switch b. Break
                    </span>
                  )}
                </td>
                <td className="py-3 text-right font-black text-amber-400 text-sm">
                  {formatNumber(cricket.runs)}
                </td>
                <td className="py-3 text-right text-slate-300">{cricket.innings}</td>
                <td className="py-3 text-right text-slate-300">{cricket.fours}</td>
                <td className="py-3 text-right text-slate-300">{cricket.sixes}</td>
                <td className="py-3 text-right font-bold text-cyan-400">{cricket.strikeRate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Batting Milestones & Extras */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 font-mono">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block text-[10px] font-sans">Batting Avg</span>
            <span className="font-bold text-white">{cricket.battingAverage} runs/day</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block text-[10px] font-sans">Milestones (50s / 100s)</span>
            <span className="font-bold text-white">{cricket.fifties} fifties, {cricket.centuries} centuries</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block text-[10px] font-sans">Longest Innings</span>
            <span className="font-bold text-white">{github.longestStreak} days continuous</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block text-[10px] font-sans">Huge Sixes (100+ ⭐)</span>
            <span className="font-bold text-white">{cricket.hugeSixes} repositories</span>
          </div>
        </div>
      </div>

      {/* Bowling & Fielding Section */}
      <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2 mb-3">
          <CricketBallIcon className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Bowling & Fielding Card (Community & Reviews)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="pb-2 font-sans">Bowler</th>
                <th className="pb-2 text-right">Overs (Reviews)</th>
                <th className="pb-2 text-right">Mdns (Closed Issues)</th>
                <th className="pb-2 text-right">W (Wickets)</th>
                <th className="pb-2 text-right">Econ (Runs/Wkt)</th>
                <th className="pb-2 text-right">Catches (Issues)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 font-sans font-bold text-white">
                  @{github.handle}
                </td>
                <td className="py-3 text-right text-slate-300">{github.reviewsGiven}</td>
                <td className="py-3 text-right text-slate-300">{github.issuesClosed}</td>
                <td className="py-3 text-right font-black text-emerald-400 text-sm">
                  {cricket.wickets}
                </td>
                <td className="py-3 text-right text-slate-300">{cricket.bowlingAverage}</td>
                <td className="py-3 text-right text-slate-300">{github.issuesOpened}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Match Notes */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 font-sans">
          <strong className="text-slate-300">Umpire&apos;s Review:</strong> {cricket.roleDescription}
        </div>
      </div>
    </div>
  );
}
