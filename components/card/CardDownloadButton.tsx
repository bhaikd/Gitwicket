'use client';

import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Loader2 } from 'lucide-react';

interface CardDownloadButtonProps {
  cardId?: string;
  filename?: string;
}

export function CardDownloadButton({
  cardId = 'player-cricket-card',
  filename = 'gitwicket-card',
}: CardDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;

    try {
      setDownloading(true);

      // Trigger celebratory cricket confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      const dataUrl = await toPng(cardEl, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0B0F19',
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating PNG...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download Card PNG</span>
        </>
      )}
    </button>
  );
}
