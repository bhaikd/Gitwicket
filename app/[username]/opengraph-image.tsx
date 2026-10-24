import { ImageResponse } from 'next/og';
import { getGitHubStats } from '@/lib/github';
import { buildPlayerCard } from '@/lib/scoring';
import { formatNumber } from '@/lib/utils';

export const alt = 'Gitwicket Collectible Trading Card';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OgProps {
  params: Promise<{ username: string }>;
}

async function fetchAvatarAsDataUrl(avatarUrl: string): Promise<string> {
  try {
    const res = await fetch(avatarUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return avatarUrl;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = res.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return avatarUrl;
  }
}

export default async function Image({ params }: OgProps) {
  const { username } = await params;

  let card;
  try {
    const stats = await getGitHubStats(username);
    card = buildPlayerCard(stats);
  } catch {
    card = null;
  }

  const name = card?.github.name || username;
  const handle = card?.github.handle || username;
  const rating = card?.cricket.overallRating || 40;
  const tier = card?.cricket.tier || 'Rookie';
  const role = card?.cricket.role || 'ALL-ROUND';
  const runs = card?.cricket.runs || 0;
  const innings = card?.cricket.innings || 0;
  const wickets = card?.cricket.wickets || 0;
  const battingAvg = card?.cricket.battingAverage || 0;
  const bowlingScore = card?.cricket.teamworkScore || 50;
  const battingScore = card?.cricket.volumeScore || 50;
  const avatarRaw = card?.github.avatar || `https://github.com/${username}.png`;
  const avatar = await fetchAvatarAsDataUrl(avatarRaw);

  const tierColors: Record<string, { border: string; glow: string; ribbon: string; ribbonText: string }> = {
    Legend: { border: '#FBBF24', glow: 'rgba(245,158,11,0.4)', ribbon: '#1E1B4B', ribbonText: 'LIMITED EDITION' },
    National: { border: '#34D399', glow: 'rgba(16,185,129,0.4)', ribbon: '#022C22', ribbonText: 'NATIONAL STAR' },
    State: { border: '#22D3EE', glow: 'rgba(6,182,212,0.4)', ribbon: '#083344', ribbonText: 'STATE ELITE' },
    Club: { border: '#C084FC', glow: 'rgba(168,85,247,0.4)', ribbon: '#1E1B4B', ribbonText: 'CLUB WARRIOR' },
    Rookie: { border: '#94A3B8', glow: 'rgba(148,163,184,0.3)', ribbon: '#1E293B', ribbonText: 'ROOKIE CARD' },
  };

  const theme = tierColors[tier] || tierColors.Rookie;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0B0F19',
          backgroundImage: 'radial-gradient(circle at 30% 30%, #1e1b4b 0%, #0B0F19 75%)',
          padding: '40px 60px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ======================================================== */}
        {/* LEFT: COLLECTIBLE TRADING CARD (SATORI-COMPATIBLE) */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '390px',
            height: '550px',
            borderRadius: '24px',
            border: `3px solid ${theme.border}`,
            backgroundColor: '#1E1B4B',
            backgroundImage: 'linear-gradient(to bottom, #2E1065, #0B0F19)',
            padding: '14px',
            boxShadow: `0 0 50px ${theme.glow}`,
            justifyContent: 'space-between',
          }}
        >
          {/* Top Bar: Country Box & Circular Crest */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '1px',
              }}
            >
              GH
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#DC2626',
                width: '34px',
                height: '34px',
                borderRadius: '9999px',
                border: '2px solid #FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '18px',
              }}
            >
              ★
            </div>
          </div>

          {/* Middle: Player Section */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0' }}>
            {/* Left Name Tag */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#111827',
                border: '1.5px solid #FBBF24',
                borderRadius: '8px',
                padding: '8px 10px',
                maxWidth: '120px',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', lineHeight: '1.1' }}>
                {name}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                @{handle}
              </span>
              <div
                style={{
                  backgroundColor: '#EA580C',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  textAlign: 'center',
                  marginTop: '6px',
                  textTransform: 'uppercase',
                }}
              >
                {role}
              </div>
            </div>

            {/* Avatar Cutout */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '160px',
                height: '180px',
                borderRadius: '16px',
                border: `3px solid ${theme.border}`,
                overflow: 'hidden',
                backgroundColor: '#0f172a',
                boxShadow: `0 0 25px ${theme.glow}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={name}
                width={160}
                height={180}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Right Tier Ribbon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#0B0F19',
                border: '1px solid #FBBF24',
                borderRadius: '6px',
                padding: '6px 4px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#FBBF24',
                letterSpacing: '1px',
                textAlign: 'center',
              }}
            >
              <span>{theme.ribbonText}</span>
            </div>
          </div>

          {/* Mid Strip: Total Runs */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0B0F19',
              border: '1.5px solid #FBBF24',
              borderRadius: '6px',
              padding: '4px',
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#FBBF24', letterSpacing: '2px' }}>
              GITWICKET LEAGUE
            </span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff' }}>
              {formatNumber(runs)} RUNS
            </span>
          </div>

          {/* Dual Stat Rows & Rating Center Shield */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            {/* Left 3 Stats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '105px',
                backgroundColor: '#0B0F19',
                borderRadius: '8px',
                padding: '6px 8px',
                border: '1px solid #334155',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#FBBF24' }}>Matches</span>
                <span style={{ fontWeight: 800 }}>{innings}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span style={{ color: '#FBBF24' }}>Wickets</span>
                <span style={{ fontWeight: 800 }}>{wickets}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#FBBF24' }}>Bat Avg</span>
                <span style={{ fontWeight: 800 }}>{battingAvg}</span>
              </div>
            </div>

            {/* Center OVR Shield */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '74px',
                height: '84px',
                backgroundColor: '#2E1065',
                border: '2.5px solid #FBBF24',
                borderRadius: '12px',
                boxShadow: '0 0 15px rgba(245,158,11,0.5)',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', lineHeight: '1' }}>
                {rating}
              </span>
              <div
                style={{
                  backgroundColor: '#EA580C',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 900,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  marginTop: '4px',
                }}
              >
                RATING
              </div>
            </div>

            {/* Right 3 Stats */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '105px',
                backgroundColor: '#0B0F19',
                borderRadius: '8px',
                padding: '6px 8px',
                border: '1px solid #334155',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#FBBF24' }}>Runs</span>
                <span style={{ fontWeight: 800 }}>{formatNumber(runs)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                <span style={{ color: '#FBBF24' }}>Bowling</span>
                <span style={{ fontWeight: 800, color: '#FDE047' }}>{bowlingScore}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#FBBF24' }}>Batting</span>
                <span style={{ fontWeight: 800, color: '#67E8F9' }}>{battingScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: BRANDING & HEADLINE PRESENTATION */}
        {/* ======================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '580px',
            justifyContent: 'center',
            paddingLeft: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 900,
                color: '#FBBF24',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              🏏 Official T20 Collectible Trading Card
            </span>
          </div>

          <h1
            style={{
              fontSize: '46px',
              fontWeight: 900,
              lineHeight: '1.15',
              letterSpacing: '-1px',
              margin: '0 0 16px 0',
              color: '#ffffff',
            }}
          >
            {name}&apos;s Player Card
          </h1>

          <p
            style={{
              fontSize: '20px',
              color: '#94a3b8',
              lineHeight: '1.4',
              margin: '0 0 28px 0',
            }}
          >
            {tier} Tier • Rated {rating} OVR with {formatNumber(runs)} total runs and {wickets} community wickets.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#1e293b',
              padding: '12px 20px',
              borderRadius: '12px',
              width: 'fit-content',
              border: '1px solid #334155',
            }}
          >
            <span style={{ fontSize: '15px', color: '#ffffff', fontWeight: 800 }}>
              gitwicket.vercel.app/{handle}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
