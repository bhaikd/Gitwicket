import React from 'react';

export function CricketBatIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Handle */}
      <line x1="18.5" y1="5.5" x2="21" y2="3" />
      <line x1="16" y1="8" x2="18.5" y2="5.5" strokeWidth="2.5" />
      {/* Grip wraps */}
      <line x1="17" y1="7" x2="18" y2="6" strokeWidth="1" />
      {/* Blade */}
      <path d="M16 8L8 16c-1.5 1.5-3 2-4.5 2s-1.5-1.5 0-3l8-8 4.5 1z" fill="currentColor" fillOpacity="0.15" />
      <line x1="5" y1="19" x2="7" y2="17" />
    </svg>
  );
}

export function CricketBallIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
      {/* Ball seam */}
      <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="1.5 2" />
      <path d="M12 3a9 9 0 0 0 0 18" strokeDasharray="1.5 2" />
      <line x1="12" y1="3" x2="12" y2="21" strokeWidth="1.5" />
    </svg>
  );
}

export function StumpsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 3 Stumps */}
      <line x1="7" y1="7" x2="7" y2="21" />
      <line x1="12" y1="7" x2="12" y2="21" />
      <line x1="17" y1="7" x2="17" y2="21" />
      {/* Bails */}
      <line x1="5.5" y1="6" x2="13.5" y2="6" strokeWidth="2.5" />
      <line x1="10.5" y1="6" x2="18.5" y2="6" strokeWidth="2.5" />
      {/* Ground crease */}
      <line x1="3" y1="21" x2="21" y2="21" strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );
}

export function BoundaryIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fillOpacity="0.15" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
    </svg>
  );
}
