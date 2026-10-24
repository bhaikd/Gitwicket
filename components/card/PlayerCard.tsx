'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PlayerCardData } from '@/lib/types';
import { getCollectibleCardTheme, formatNumber } from '@/lib/utils';
import { Star } from 'lucide-react';

interface PlayerCardProps {
  data: PlayerCardData;
  cardId?: string;
  className?: string;
  interactive?: boolean;
}

export function PlayerCard({
  data,
  cardId = 'player-cricket-card',
  className = '',
  interactive = true,
}: PlayerCardProps) {
  const { github, cricket } = data;
  const theme = getCollectibleCardTheme(cricket.tier);

  // 3D Tilt & Glare State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to +1
    const normY = (y / rect.height) * 2 - 1; // -1 to +1

    const rotX = -normY * 12;
    const rotY = normX * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotX, rotY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // Deterministic serial number
  const serialNum = (
    Math.abs(
      github.handle.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ) % 9000 + 1000
  ).toString();

  // Role translation to cricket classic format
  const getCricketRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'opener':
        return 'OPENER';
      case 'finisher':
        return 'FINISHER';
      case 'bowler':
        return 'BOWLER';
      case 'anchor':
        return 'BATSMAN';
      case 'all-rounder':
      default:
        return 'ALL-ROUND';
    }
  };

  const roleLabel = getCricketRoleLabel(cricket.role);

  return (
    <div
      className={`card-perspective w-full max-w-[340px] sm:max-w-[360px] mx-auto select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        id={cardId}
        ref={cardRef}
        className={`card-preserve-3d relative w-full aspect-[5/7.2] rounded-[24px] p-2.5 sm:p-3 bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 border-2 ${theme.outerBorderClass} ${theme.cardGlowClass} transition-transform ease-out`}
        style={{
          transform: tilt.isHovered
            ? `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          // @ts-expect-error CSS custom properties for glare
          '--glare-x': `${tilt.glareX}%`,
          '--glare-y': `${tilt.glareY}%`,
        }}
      >
        {/* Outer Metallic Card Border with Prismatic Pattern */}
        <div className="relative w-full h-full rounded-[18px] overflow-hidden border border-amber-200/50 bg-[#0B0F19] flex flex-col justify-between">
          
          {/* Holographic Prismatic Foil Background */}
          <div className={`absolute inset-0 ${theme.foilClass} opacity-95 pointer-events-none`} />

          {/* Dynamic Interactive Glare Layer */}
          <div
            className={`card-glare absolute inset-0 transition-opacity duration-300 pointer-events-none ${
              tilt.isHovered ? 'opacity-90' : 'opacity-0'
            }`}
          />

          {/* Vignette behind player */}
          <div className="absolute top-10 left-10 right-10 bottom-24 bg-radial from-red-600/40 via-purple-950/60 to-transparent pointer-events-none blur-lg" />

          {/* ======================================================== */}
          {/* TOP BAR: COUNTRY PILL (LEFT) & CIRCULAR CREST (RIGHT) */}
          {/* ======================================================== */}
          <div className="relative z-20 flex items-center justify-between px-3 pt-2.5">
            {/* Top-Left Country/Platform Box */}
            <div className="px-2.5 py-0.5 rounded-[4px] bg-white text-slate-950 shadow-md border border-slate-300 font-card font-black text-xs tracking-wider">
              GH
            </div>

            {/* Top-Right Circular Crest with Red Star */}
            <div className="relative w-8 h-8 rounded-full bg-white p-0.5 shadow-lg border-2 border-amber-400 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Star className="w-4 h-4 fill-red-600 text-red-600 drop-shadow-[0_0_4px_rgba(220,38,38,0.9)]" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MIDDLE: LEFT BANNER, AVATAR CUTOUT, RIGHT RIBBON */}
          {/* ======================================================== */}
          <div className="relative z-10 flex-1 flex items-stretch mt-1 px-1.5">
            {/* Left Vertical Player Name Banner */}
            <div className="relative z-20 flex flex-col items-center justify-between w-9 sm:w-10 rounded-lg bg-gradient-to-b from-[#2E1065] via-[#1E1B4B] to-[#3B0764] border-2 border-amber-400/80 shadow-2xl py-2 shrink-0">
              {/* Name rotated vertically */}
              <div className="flex-1 w-full flex items-center justify-center relative min-h-[170px] overflow-visible">
                <span
                  className="font-card font-black text-xs sm:text-sm text-white tracking-widest uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none transform -rotate-90 origin-center absolute"
                  style={{ width: 'max-content' }}
                >
                  {github.name || github.handle}
                </span>
              </div>

              {/* Role Tag underneath name */}
              <div className="w-full px-0.5 mt-2 z-30">
                <div className="w-full py-0.5 text-center rounded-[3px] bg-[#EA580C] text-white font-card font-black text-[9px] uppercase tracking-wider shadow border border-amber-300/40">
                  {roleLabel}
                </div>
              </div>
            </div>

            {/* Center: Cutout Player Avatar with Rim Glow */}
            <div className="relative flex-1 flex items-center justify-center overflow-visible -ml-2 -mr-2">
              <div className="relative w-40 h-48 sm:w-46 sm:h-52">
                {/* Colored Rim-Light Glow */}
                <div
                  className="absolute inset-2 rounded-2xl blur-lg opacity-85 bg-current"
                  style={{ color: theme.avatarRimColor }}
                />

                {/* Avatar Cutout Frame */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <Image
                    src={github.avatar}
                    alt={github.name}
                    fill
                    sizes="(max-width: 640px) 180px, 200px"
                    className="object-cover object-top scale-105"
                    priority
                    unoptimized
                  />
                  {/* Highlight gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-white/15 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Vertical Ribbon */}
            <div className="relative z-20 flex items-center justify-center w-6 shrink-0">
              {theme.ribbonText ? (
                <div className="h-full min-h-[170px] w-6 rounded-md bg-[#1E1B4B]/95 border-2 border-amber-400/80 shadow-2xl flex items-center justify-center relative overflow-visible">
                  <span
                    className="font-card font-black text-[9px] sm:text-[10px] text-amber-300 tracking-widest uppercase whitespace-nowrap select-none transform rotate-90 origin-center absolute drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    style={{ width: 'max-content' }}
                  >
                    {theme.ribbonText}
                  </span>
                </div>
              ) : (
                <div className="w-5" />
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MID-STRIP: FANTASY LEAGUE / TOTAL RUNS BANNER */}
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center my-1">
            <span className="font-card font-extrabold text-[9px] uppercase tracking-widest text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              GITWICKET LEAGUE
            </span>
            <div className="mt-0.5 px-4 py-0.5 rounded-[4px] bg-gradient-to-r from-purple-950 via-[#1E1B4B] to-purple-950 border-2 border-amber-400/90 shadow-lg">
              <span className="font-card font-black text-sm sm:text-base text-white tracking-wider">
                {formatNumber(cricket.runs)} RUNS
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM SECTION: DUAL STAT TABLES + CENTER OVR SHIELD */}
          {/* ======================================================== */}
          <div className="relative z-20 px-2 pb-1.5">
            <div className="grid grid-cols-12 items-center gap-1">
              
              {/* Left 3-Row Stat Panel (Matches, Wickets, Bowl SR) */}
              <div className="col-span-4 rounded-md bg-[#1E1B4B]/95 border border-amber-400/60 p-1 flex flex-col justify-between text-[10px] font-card font-bold text-white shadow-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-0.5">
                  <span className="text-amber-200">Matches</span>
                  <span className="font-mono text-white text-[11px]">{cricket.innings}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 py-0.5">
                  <span className="text-amber-200">Wickets</span>
                  <span className="font-mono text-white text-[11px]">{cricket.wickets}</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-amber-200">Bowl SR</span>
                  <span className="font-mono text-white text-[11px]">{cricket.bowlingAverage || 0}</span>
                </div>
              </div>

              {/* Center Hexagonal Rating Shield */}
              <div className="col-span-4 flex flex-col items-center justify-center -my-2 relative z-30">
                <div className="relative w-16 h-18 sm:w-18 sm:h-20 rounded-xl bg-gradient-to-b from-[#2E1065] via-[#1E1B4B] to-[#3B0764] border-2 border-amber-400 shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-1 overflow-hidden">
                  {/* Rating Number */}
                  <span className="font-card font-black text-2xl sm:text-3xl text-white leading-none mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {cricket.overallRating}
                  </span>

                  {/* Arched Ribbon Label */}
                  <div className="w-full py-0.5 rounded-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-center text-[9px] font-card font-black uppercase text-slate-950 tracking-wider shadow">
                    RATING
                  </div>

                  {/* 5 Stars row */}
                  <div className="flex items-center gap-0.5 pb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-1.5 h-1.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 3-Row Stat Panel (Runs, HI Score, Bat Avg) */}
              <div className="col-span-4 rounded-md bg-[#1E1B4B]/95 border border-amber-400/60 p-1 flex flex-col justify-between text-[10px] font-card font-bold text-white shadow-lg">
                <div className="flex justify-between items-center border-b border-white/10 pb-0.5">
                  <span className="text-amber-200">Total Runs</span>
                  <span className="font-mono text-white text-[11px]">{formatNumber(cricket.runs)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 py-0.5">
                  <span className="text-amber-200">HI Streak</span>
                  <span className="font-mono text-white text-[11px]">{github.longestStreak}d</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-amber-200">Bat AVG</span>
                  <span className="font-mono text-white text-[11px]">{cricket.battingAverage}</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BOTTOM DUAL PILLARS: BOWLING (LEFT) & BATTING (RIGHT) */}
            {/* ======================================================== */}
            <div className="grid grid-cols-12 gap-1 mt-1.5 items-center">
              {/* Bowling Pillar */}
              <div className="col-span-4 rounded-md bg-[#1E1B4B] border border-amber-400/70 overflow-hidden shadow">
                <div className="text-center py-0.5">
                  <span className={`font-card font-black text-lg sm:text-xl ${theme.bowlingNumberColor} leading-none`}>
                    {cricket.teamworkScore}
                  </span>
                </div>
                <div className="bg-[#0B0F19] text-center py-0.5 border-t border-amber-400/40">
                  <span className="font-card font-black text-[8px] uppercase tracking-wider text-slate-300">
                    BOWLING
                  </span>
                </div>
              </div>

              {/* Center Serial / Brand Code */}
              <div className="col-span-4 flex flex-col items-center justify-center text-center">
                <span className="font-mono font-bold text-[8px] text-amber-300 tracking-widest uppercase">
                  GW-{serialNum}
                </span>
                <span className="font-card font-extrabold text-[8px] text-slate-400 tracking-wider uppercase">
                  T20 EDITION
                </span>
              </div>

              {/* Batting Pillar */}
              <div className="col-span-4 rounded-md bg-[#1E1B4B] border border-amber-400/70 overflow-hidden shadow">
                <div className="text-center py-0.5">
                  <span className={`font-card font-black text-lg sm:text-xl ${theme.battingNumberColor} leading-none`}>
                    {cricket.volumeScore}
                  </span>
                </div>
                <div className="bg-[#0B0F19] text-center py-0.5 border-t border-amber-400/40">
                  <span className="font-card font-black text-[8px] uppercase tracking-wider text-slate-300">
                    BATTING
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
