'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { validateGitHubUsername } from '@/lib/github';
import { Search, Loader2 } from 'lucide-react';
import { CricketBatIcon } from '../icons/CricketIcons';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}

export function SearchBar({
  initialValue = '',
  placeholder = 'Enter GitHub username (e.g. torvalds, antfu, shadcn)...',
  size = 'lg',
  autoFocus = false,
}: SearchBarProps) {
  const [username, setUsername] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Reset input and clear errors whenever navigating back or arriving at Home
  useEffect(() => {
    if (pathname === '/') {
      setUsername('');
      setError(null);
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [pathname, autoFocus]);

  // Handle browser Back / Forward cache (bfcache) pageshow event
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      // Regardless of whether restored from bfcache or standard navigation, ensure fresh state
      setUsername('');
      setError(null);
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, '');

    if (!clean) {
      setError('Please enter a GitHub username');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    if (!validateGitHubUsername(clean)) {
      setError('Invalid GitHub username format (letters, numbers, single hyphens)');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/${encodeURIComponent(clean)}`);
    });
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col gap-2">
      <div
        className={`relative flex items-center w-full rounded-2xl bg-slate-900/90 border transition-all ${
          error
            ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
            : 'border-white/15 focus-within:border-amber-400 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.25)]'
        }`}
      >
        <div className="pl-4 sm:pl-5 text-slate-400">
          <Search className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
        </div>

        {/* Note: The input is NEVER disabled, ensuring it can never freeze across bfcache or Back navigation */}
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={`w-full bg-transparent text-white placeholder-slate-500 focus:outline-none font-medium ${
            isLarge ? 'px-4 py-4 text-base sm:text-lg' : 'px-3 py-2.5 text-sm'
          }`}
        />

        <div className="pr-2 sm:pr-3">
          <button
            type="submit"
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isLarge ? 'px-5 py-2.5 text-sm' : 'px-3.5 py-1.5 text-xs'
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Batting...</span>
              </>
            ) : (
              <>
                <CricketBatIcon className="w-4 h-4" />
                <span>Play Card</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-medium px-4">{error}</p>
      )}
    </form>
  );
}
