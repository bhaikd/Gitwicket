import React from 'react';
import { Swords } from 'lucide-react';

export default function DuelLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center gap-8 animate-pulse">
      {/* Verdict Skeleton */}
      <div className="w-full h-36 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
        <Swords className="w-8 h-8 text-slate-700 animate-spin" />
      </div>

      {/* Side-by-Side Skeletons */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[550px] rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="h-[550px] rounded-3xl bg-slate-900 border border-slate-800" />
      </div>

      {/* Table Skeleton */}
      <div className="w-full h-64 rounded-2xl bg-slate-900 border border-slate-800" />
    </div>
  );
}
