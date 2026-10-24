import React from 'react';
import { PlaystyleTag } from '@/lib/types';
import {
  Flame,
  Languages,
  CheckCircle2,
  Trophy,
  Crown,
  Zap,
  Sparkles,
  Shield,
  Star,
} from 'lucide-react';

interface PlaystylePillsProps {
  tags: PlaystyleTag[];
}

export function PlaystylePills({ tags }: PlaystylePillsProps) {
  if (!tags || tags.length === 0) return null;

  const renderIcon = (name: string) => {
    const cls = 'w-4 h-4 shrink-0';
    switch (name) {
      case 'Flame':
        return <Flame className={`${cls} text-amber-400`} />;
      case 'Languages':
        return <Languages className={`${cls} text-cyan-400`} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={`${cls} text-emerald-400`} />;
      case 'Trophy':
        return <Trophy className={`${cls} text-yellow-400`} />;
      case 'Crown':
        return <Crown className={`${cls} text-amber-300`} />;
      case 'Zap':
        return <Zap className={`${cls} text-rose-400`} />;
      case 'Sparkles':
        return <Sparkles className={`${cls} text-purple-400`} />;
      case 'Shield':
        return <Shield className={`${cls} text-blue-400`} />;
      case 'Star':
      default:
        return <Star className={`${cls} text-slate-300`} />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-white/10 p-5 text-white shadow-xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span>Player Special Abilities & Badges</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-white/5 hover:border-white/15 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              {renderIcon(tag.iconName)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">{tag.label}</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{tag.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
