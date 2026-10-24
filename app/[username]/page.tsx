import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGitHubStats } from '@/lib/github';
import { buildPlayerCard } from '@/lib/scoring';
import { PlayerCard } from '@/components/card/PlayerCard';
import { CardDownloadButton } from '@/components/card/CardDownloadButton';
import { CardShareBar } from '@/components/card/CardShareBar';
import { ScorecardTable } from '@/components/scorecard/ScorecardTable';
import { RunRateGraph } from '@/components/scorecard/RunRateGraph';
import { PlaystylePills } from '@/components/scorecard/PlaystylePills';
import { SearchBar } from '@/components/ui/SearchBar';
import { Swords, ArrowLeft, Trophy, ExternalLink } from 'lucide-react';

interface PlayerPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const stats = await getGitHubStats(username);
    const card = buildPlayerCard(stats);
    return {
      title: `${card.github.name} (@${card.github.handle}) • Rated ${card.cricket.overallRating} OVR (${card.cricket.tier} ${card.cricket.role}) • Gitwicket`,
      description: `@${card.github.handle} has ${card.cricket.runs} runs, ${card.cricket.strikeRate} SR, ${card.cricket.wickets} wickets, and ${card.cricket.fours + card.cricket.sixes} boundaries on Gitwicket!`,
      openGraph: {
        title: `@${card.github.handle}'s Cricket Player Card • Gitwicket`,
        description: `Rated ${card.cricket.overallRating} OVR • ${card.cricket.tier} ${card.cricket.role} with ${card.cricket.runs} runs!`,
      },
    };
  } catch {
    return {
      title: `${username}'s Player Card • Gitwicket`,
    };
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { username } = await params;
  const stats = await getGitHubStats(username);
  const cardData = buildPlayerCard(stats);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">
      {/* Top Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arena Home</span>
        </Link>

        {/* Compact Search Bar */}
        <div className="w-full sm:w-auto min-w-[280px]">
          <SearchBar size="md" placeholder="Look up another player..." />
        </div>
      </div>

      {/* Main Player Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Portrait Player Card & Action Buttons */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 w-full">
          <PlayerCard data={cardData} cardId="player-cricket-card" />

          {/* Action Row: PNG Download & Challenge in Duel */}
          <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between gap-3">
            <CardDownloadButton
              cardId="player-cricket-card"
              filename={`${cardData.github.handle}-gitwicket-card`}
            />

            <Link
              href={`/duel?a=${encodeURIComponent(cardData.github.handle)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition-all cursor-pointer shadow-md"
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Duel Player</span>
            </Link>
          </div>

          {/* Social Share Bar */}
          <div className="w-full max-w-sm sm:max-w-md">
            <CardShareBar data={cardData} />
          </div>
        </div>

        {/* Right Column: Scorecard, Abilities, Run-Rate Graph */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* Headline Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {cardData.github.name}
                </h1>
                <a
                  href={`https://github.com/${cardData.github.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                GitHub Veteran of {cardData.github.accountAgeYears} years • {cardData.github.followers} followers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-mono">Assigned Role:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 uppercase tracking-wider">
                {cardData.cricket.role}
              </span>
            </div>
          </div>

          {/* Special Abilities & Badges */}
          <PlaystylePills tags={cardData.cricket.playstyleTags} />

          {/* Official Cricket Scorecard Table */}
          <ScorecardTable data={cardData} />

          {/* Run-Rate Manhattan & Worm Graph */}
          <RunRateGraph
            monthlyContributions={cardData.github.monthlyContributions}
            totalRuns={cardData.cricket.runs}
          />
        </div>
      </div>
    </div>
  );
}
