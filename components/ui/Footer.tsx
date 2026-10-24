import React from 'react';
import Link from 'next/link';
import { CricketBallIcon } from '../icons/CricketIcons';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0B0F19] text-slate-400 py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row text-xs">
        <div className="flex items-center gap-2">
          <CricketBallIcon className="w-4 h-4 text-red-500" />
          <span className="font-bold text-white tracking-wide">Gitwicket</span>
          <span className="text-slate-500">•</span>
          <span>Turn your GitHub profile into a T20 cricket card</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/duel" className="hover:text-white transition-colors">
            Duel Arena
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/5 text-[11px] text-slate-500 text-center">
        Independent fan project for developers. Original design with generic sports terms. Not affiliated with GitHub, BCCI, IPL, or any official cricket board.
      </div>
    </footer>
  );
}
