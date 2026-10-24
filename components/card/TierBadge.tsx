import React from 'react';
import { PlayerTier } from '@/lib/types';
import { getTierTheme } from '@/lib/utils';
import { Trophy, Shield, Award, Sparkles, Star } from 'lucide-react';

interface TierBadgeProps {
  tier: PlayerTier;
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const theme = getTierTheme(tier);

  const getTierIcon = () => {
    switch (tier) {
      case 'Legend':
        return <Trophy className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'National':
        return <Award className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'State':
        return <Shield className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'Club':
        return <Sparkles className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'Rookie':
      default:
        return <Star className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider font-bold border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} ${sizeClasses[size]}`}
    >
      {getTierIcon()}
      <span>{tier}</span>
    </span>
  );
}
