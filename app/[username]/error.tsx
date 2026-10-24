'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/ui/SearchBar';
import { FamousDevsRow } from '@/components/ui/FamousDevsRow';
import { CricketBatIcon, CricketBallIcon, StumpsIcon } from '@/components/icons/CricketIcons';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Gitwicket profile error:', error);
  }, [error]);

  const isRateLimit =
    error.name === 'GitHubRateLimitError' ||
    error.message.toLowerCase().includes('rate limit');

  const isNotFound =
    error.name === 'GitHubUserNotFoundError' ||
    error.message.toLowerCase().includes('not found');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
      {/* Sporty Error Icon */}
      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.2)] flex items-center justify-center mb-6">
        {isRateLimit ? (
          <CricketBallIcon className="w-10 h-10 text-amber-400" />
        ) : (
          <StumpsIcon className="w-10 h-10 text-rose-500" />
        )}
      </div>

      {isRateLimit ? (
        <>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
            Rain Delay • Match Paused
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            GitHub API Rate Limit Reached
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-md">
            GitHub temporarily paused public requests. Please wait a few minutes or provide a free personal read-only GitHub token in your <code className="text-amber-300 font-mono">.env.local</code>.
          </p>
        </>
      ) : isNotFound ? (
        <>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-3">
            Out for a Duck • User Not Found
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Player Never Stepped onto the Pitch
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-md">
            We couldn&apos;t find that GitHub username. Check for typos or search another player below.
          </p>
        </>
      ) : (
        <>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-3">
            Third Umpire Review
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Unexpected Match Interruption
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-md">
            {error.message || 'An error occurred while fetching player statistics.'}
          </p>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Pavilion</span>
        </Link>
      </div>

      {/* Quick Search */}
      <div className="w-full mt-10">
        <SearchBar size="md" placeholder="Search another GitHub user..." />
      </div>

      <div className="mt-8">
        <FamousDevsRow />
      </div>
    </div>
  );
}
