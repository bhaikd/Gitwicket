import { PlayerTier } from './types';

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
}

export function getTierTheme(tier: PlayerTier) {
  switch (tier) {
    case 'Legend':
      return {
        badgeBg: 'bg-amber-500/15',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/40',
        accentGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        cardBorder: 'border-amber-500/50 hover:border-amber-400',
        gradientHeader: 'from-amber-500/20 via-amber-600/5 to-transparent',
        accentColor: '#F59E0B',
        ringColor: 'ring-amber-500/30',
        ratingBg: 'from-amber-500 to-yellow-600',
      };
    case 'National':
      return {
        badgeBg: 'bg-emerald-500/15',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/40',
        accentGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
        cardBorder: 'border-emerald-500/50 hover:border-emerald-400',
        gradientHeader: 'from-emerald-500/20 via-emerald-600/5 to-transparent',
        accentColor: '#10B981',
        ringColor: 'ring-emerald-500/30',
        ratingBg: 'from-emerald-500 to-teal-600',
      };
    case 'State':
      return {
        badgeBg: 'bg-cyan-500/15',
        badgeText: 'text-cyan-400',
        badgeBorder: 'border-cyan-500/40',
        accentGlow: 'shadow-[0_0_35px_rgba(6,182,212,0.25)]',
        cardBorder: 'border-cyan-500/50 hover:border-cyan-400',
        gradientHeader: 'from-cyan-500/20 via-cyan-600/5 to-transparent',
        accentColor: '#06B6D4',
        ringColor: 'ring-cyan-500/30',
        ratingBg: 'from-cyan-500 to-blue-600',
      };
    case 'Club':
      return {
        badgeBg: 'bg-purple-500/15',
        badgeText: 'text-purple-400',
        badgeBorder: 'border-purple-500/40',
        accentGlow: 'shadow-[0_0_35px_rgba(139,92,246,0.25)]',
        cardBorder: 'border-purple-500/50 hover:border-purple-400',
        gradientHeader: 'from-purple-500/20 via-purple-600/5 to-transparent',
        accentColor: '#8B5CF6',
        ringColor: 'ring-purple-500/30',
        ratingBg: 'from-purple-500 to-indigo-600',
      };
    case 'Rookie':
    default:
      return {
        badgeBg: 'bg-slate-500/15',
        badgeText: 'text-slate-300',
        badgeBorder: 'border-slate-500/40',
        accentGlow: 'shadow-[0_0_25px_rgba(148,163,184,0.15)]',
        cardBorder: 'border-slate-600/50 hover:border-slate-500',
        gradientHeader: 'from-slate-500/20 via-slate-600/5 to-transparent',
        accentColor: '#94A3B8',
        ringColor: 'ring-slate-500/30',
        ratingBg: 'from-slate-500 to-zinc-600',
      };
  }
}

export interface CollectibleCardTheme {
  tier: PlayerTier;
  foilClass: string;
  outerBorderClass: string;
  cardGlowClass: string;
  bannerGradient: string;
  bannerBorder: string;
  roleBg: string;
  roleText: string;
  ribbonText?: string;
  ribbonBg: string;
  ribbonBorder: string;
  ribbonTextColor: string;
  crestStarColor: string;
  crestBorderColor: string;
  shieldBg: string;
  shieldBorder: string;
  shieldRibbonBg: string;
  avatarRimColor: string;
  bowlingNumberColor: string;
  battingNumberColor: string;
  accentHex: string;
}

export function getCollectibleCardTheme(tier: PlayerTier): CollectibleCardTheme {
  switch (tier) {
    case 'Legend':
      return {
        tier,
        foilClass: 'foil-pattern-legend',
        outerBorderClass: 'border-[#FBBF24]',
        cardGlowClass: 'shadow-[0_0_40px_rgba(245,158,11,0.35)]',
        bannerGradient: 'from-[#2E1065] via-[#1E1B4B] to-[#3B0764]',
        bannerBorder: 'border-amber-400/60',
        roleBg: 'bg-[#EA580C]',
        roleText: 'text-white',
        ribbonText: 'LIMITED EDITION',
        ribbonBg: 'bg-[#1E1B4B]/95',
        ribbonBorder: 'border-amber-400/60',
        ribbonTextColor: 'text-amber-300',
        crestStarColor: '#DC2626',
        crestBorderColor: 'border-amber-400',
        shieldBg: 'bg-[#1E1B4B]',
        shieldBorder: 'border-amber-400',
        shieldRibbonBg: 'from-amber-600 to-amber-700',
        avatarRimColor: '#F59E0B',
        bowlingNumberColor: 'text-[#FDE047]',
        battingNumberColor: 'text-[#67E8F9]',
        accentHex: '#F59E0B',
      };
    case 'National':
      return {
        tier,
        foilClass: 'foil-pattern-national',
        outerBorderClass: 'border-[#34D399]',
        cardGlowClass: 'shadow-[0_0_40px_rgba(16,185,129,0.35)]',
        bannerGradient: 'from-[#064E3B] via-[#022C22] to-[#064E3B]',
        bannerBorder: 'border-emerald-400/60',
        roleBg: 'bg-[#059669]',
        roleText: 'text-white',
        ribbonText: 'NATIONAL STAR',
        ribbonBg: 'bg-[#022C22]/95',
        ribbonBorder: 'border-emerald-400/60',
        ribbonTextColor: 'text-emerald-300',
        crestStarColor: '#10B981',
        crestBorderColor: 'border-emerald-400',
        shieldBg: 'bg-[#022C22]',
        shieldBorder: 'border-emerald-400',
        shieldRibbonBg: 'from-emerald-600 to-emerald-700',
        avatarRimColor: '#10B981',
        bowlingNumberColor: 'text-[#FDE047]',
        battingNumberColor: 'text-[#34D399]',
        accentHex: '#10B981',
      };
    case 'State':
      return {
        tier,
        foilClass: 'foil-pattern-state',
        outerBorderClass: 'border-[#22D3EE]',
        cardGlowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.35)]',
        bannerGradient: 'from-[#164E63] via-[#083344] to-[#164E63]',
        bannerBorder: 'border-cyan-400/60',
        roleBg: 'bg-[#0891B2]',
        roleText: 'text-white',
        ribbonText: 'STATE ELITE',
        ribbonBg: 'bg-[#083344]/95',
        ribbonBorder: 'border-cyan-400/60',
        ribbonTextColor: 'text-cyan-300',
        crestStarColor: '#06B6D4',
        crestBorderColor: 'border-cyan-400',
        shieldBg: 'bg-[#083344]',
        shieldBorder: 'border-cyan-400',
        shieldRibbonBg: 'from-cyan-600 to-cyan-700',
        avatarRimColor: '#06B6D4',
        bowlingNumberColor: 'text-[#FDE047]',
        battingNumberColor: 'text-[#22D3EE]',
        accentHex: '#06B6D4',
      };
    case 'Club':
      return {
        tier,
        foilClass: 'foil-pattern-club',
        outerBorderClass: 'border-[#C084FC]',
        cardGlowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.3)]',
        bannerGradient: 'from-[#3B0764] via-[#1E1B4B] to-[#3B0764]',
        bannerBorder: 'border-purple-400/50',
        roleBg: 'bg-[#7E22CE]',
        roleText: 'text-white',
        ribbonText: 'CLUB WARRIOR',
        ribbonBg: 'bg-[#1E1B4B]/95',
        ribbonBorder: 'border-purple-400/50',
        ribbonTextColor: 'text-purple-300',
        crestStarColor: '#C084FC',
        crestBorderColor: 'border-purple-400',
        shieldBg: 'bg-[#1E1B4B]',
        shieldBorder: 'border-purple-400',
        shieldRibbonBg: 'from-purple-600 to-purple-700',
        avatarRimColor: '#C084FC',
        bowlingNumberColor: 'text-[#FDE047]',
        battingNumberColor: 'text-[#C084FC]',
        accentHex: '#8B5CF6',
      };
    case 'Rookie':
    default:
      return {
        tier,
        foilClass: 'foil-pattern-rookie',
        outerBorderClass: 'border-[#94A3B8]',
        cardGlowClass: 'shadow-[0_0_25px_rgba(148,163,184,0.2)]',
        bannerGradient: 'from-[#334155] via-[#1E293B] to-[#334155]',
        bannerBorder: 'border-slate-400/50',
        roleBg: 'bg-[#475569]',
        roleText: 'text-slate-200',
        ribbonText: undefined,
        ribbonBg: 'bg-[#1E293B]/95',
        ribbonBorder: 'border-slate-500/50',
        ribbonTextColor: 'text-slate-300',
        crestStarColor: '#94A3B8',
        crestBorderColor: 'border-slate-400',
        shieldBg: 'bg-[#1E293B]',
        shieldBorder: 'border-slate-400',
        shieldRibbonBg: 'from-slate-600 to-slate-700',
        avatarRimColor: '#94A3B8',
        bowlingNumberColor: 'text-[#FDE047]',
        battingNumberColor: 'text-[#CBD5E1]',
        accentHex: '#94A3B8',
      };
  }
}

export function generateShareLinks(
  username: string,
  rating: number,
  tier: string,
  role: string,
  origin: string = 'https://gitwicket.vercel.app'
) {
  const playerUrl = `${origin}/${username}`;
  const shareText = `🏏 Check out my GitHub Cricket Player Card! Rated ${rating} OVR (${tier} ${role}) on Gitwicket: ${playerUrl}`;

  return {
    url: playerUrl,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(playerUrl)}`,
  };
}
