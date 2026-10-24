import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const FAMOUS_DEVS = [
  { handle: 'torvalds', name: 'Linus Torvalds', role: 'Legend Opener' },
  { handle: 'antfu', name: 'Anthony Fu', role: 'All-Rounder' },
  { handle: 'shadcn', name: 'shadcn', role: 'Finisher' },
  { handle: 'gaearon', name: 'Dan Abramov', role: 'Anchor' },
  { handle: 'leerob', name: 'Lee Robinson', role: 'Opener' },
  { handle: 'sindresorhus', name: 'Sindre Sorhus', role: 'Legend Bowler' },
];

export function FamousDevsRow() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Or try legendary cricket innings from famous developers:</span>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-2.5">
        {FAMOUS_DEVS.map((dev) => (
          <Link
            key={dev.handle}
            href={`/${dev.handle}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-400/50 transition-all hover:scale-105 active:scale-95 group shadow-sm"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/20">
              <Image
                src={`https://github.com/${dev.handle}.png?size=40`}
                alt={dev.name}
                width={20}
                height={20}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
              @{dev.handle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
