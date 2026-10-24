'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { generateShareLinks } from '@/lib/utils';
import { PlayerCardData } from '@/lib/types';
import { Check, Copy, Share2, Swords } from 'lucide-react';

interface CardShareBarProps {
  data: PlayerCardData;
}

export function CardShareBar({ data }: CardShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [mountedOrigin, setMountedOrigin] = useState('https://gitwicket.vercel.app');
  const { github, cricket } = data;

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setMountedOrigin(window.location.origin);
    }
  }, []);

  const links = generateShareLinks(
    github.handle,
    cricket.overallRating,
    cricket.tier,
    cricket.role,
    mountedOrigin
  );

  const handleCopy = async () => {
    try {
      const copyUrl = typeof window !== 'undefined' ? `${window.location.origin}/${github.handle}` : links.url;
      await navigator.clipboard.writeText(copyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm w-full">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-300">Share Player Card:</span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Post</span>
        </a>

        {/* WhatsApp */}
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-colors"
        >
          <span>WhatsApp</span>
        </a>

        {/* LinkedIn */}
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60 transition-colors"
        >
          <span>LinkedIn</span>
        </a>

        {/* Duel Shortcut */}
        <Link
          href={`/duel?a=${encodeURIComponent(github.handle)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-colors"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Challenge</span>
        </Link>
      </div>
    </div>
  );
}
