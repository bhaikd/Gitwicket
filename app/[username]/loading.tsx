import React from 'react';
import { CricketBallIcon } from '@/components/icons/CricketIcons';

export default function Loading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-800 rounded-md" />
        <div className="h-10 w-64 bg-slate-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Player Card Skeleton */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 w-full">
          <div className="w-full max-w-sm sm:max-w-md h-[580px] rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800" />
              <div className="w-24 h-6 rounded-full bg-slate-800" />
            </div>

            <div className="flex flex-col items-center gap-3 my-6">
              <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center">
                <CricketBallIcon className="w-8 h-8 text-slate-700 animate-spin" />
              </div>
              <div className="h-6 w-44 bg-slate-800 rounded-md" />
              <div className="h-3 w-28 bg-slate-800 rounded-md" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-800 rounded-xl" />
              ))}
            </div>

            <div className="h-4 w-full bg-slate-800 rounded mt-4" />
          </div>

          <div className="w-full max-w-sm sm:max-w-md h-12 bg-slate-800 rounded-xl" />
        </div>

        {/* Right Column: Scorecard Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-64 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-56 bg-slate-900 rounded-2xl border border-slate-800" />
        </div>
      </div>
    </div>
  );
}
