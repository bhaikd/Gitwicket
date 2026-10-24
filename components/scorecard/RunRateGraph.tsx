'use client';

import React, { useState } from 'react';
import { MonthlyContribution } from '@/lib/types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface RunRateGraphProps {
  monthlyContributions: MonthlyContribution[];
  totalRuns: number;
}

export function RunRateGraph({ monthlyContributions, totalRuns }: RunRateGraphProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!monthlyContributions || monthlyContributions.length === 0) {
    return null;
  }

  const maxMonthCount = Math.max(...monthlyContributions.map((m) => m.count), 20);

  // SVG dimensions
  const width = 640;
  const height = 200;
  const paddingBottom = 30;
  const paddingTop = 20;
  const chartHeight = height - paddingBottom - paddingTop;
  const barWidth = 28;
  const stepX = width / monthlyContributions.length;

  // Calculate cumulative run curve points
  let runningSum = 0;
  const linePoints = monthlyContributions.map((m, idx) => {
    runningSum += m.count;
    const x = idx * stepX + stepX / 2;
    const y = paddingTop + chartHeight - (totalRuns > 0 ? (runningSum / totalRuns) * chartHeight : 0);
    return { x, y, runningSum };
  });

  const pathD = linePoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-white/10 p-5 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Over-by-Over Worm & Manhattan Chart
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500/80 inline-block" />
            <span className="text-slate-400">Monthly Runs (Bars)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span className="text-slate-400">Run-Rate Worm (Line)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Horizontal Grid lines */}
            <line
              x1="0"
              y1={paddingTop}
              x2={width}
              y2={paddingTop}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
            <line
              x1="0"
              y1={paddingTop + chartHeight / 2}
              x2={width}
              y2={paddingTop + chartHeight / 2}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
            <line
              x1="0"
              y1={paddingTop + chartHeight}
              x2={width}
              y2={paddingTop + chartHeight}
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Bars */}
            {monthlyContributions.map((m, idx) => {
              const barH = (m.count / maxMonthCount) * chartHeight;
              const x = idx * stepX + (stepX - barWidth) / 2;
              const y = paddingTop + chartHeight - barH;
              const isHovered = hoveredIdx === idx;
              const isCentury = m.count >= 100;
              const isFifty = m.count >= 50 && m.count < 100;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer transition-opacity"
                >
                  {/* Bar rect */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="4"
                    fill={isCentury ? '#F59E0B' : isFifty ? '#10B981' : isHovered ? '#38BDF8' : '#0284C7'}
                    fillOpacity={isHovered ? 1 : 0.75}
                  />

                  {/* Over milestone badge (50 or 100) */}
                  {isCentury && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fill="#F59E0B"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      100
                    </text>
                  )}
                  {isFifty && !isCentury && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fill="#10B981"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      50
                    </text>
                  )}

                  {/* Month Label */}
                  <text
                    x={x + barWidth / 2}
                    y={height - 8}
                    textAnchor="middle"
                    fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {m.month}
                  </text>
                </g>
              );
            })}

            {/* Run Rate Curve (Worm line) */}
            <path
              d={pathD}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"
            />

            {/* Points on Worm line */}
            {linePoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 5 : 3}
                fill="#F59E0B"
                stroke="#0B0F19"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      <div className="mt-2 min-h-[28px] text-xs font-mono text-center text-slate-300">
        {hoveredIdx !== null ? (
          <span className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 inline-flex items-center gap-2">
            <span className="font-bold text-white">
              Over {hoveredIdx + 1} ({monthlyContributions[hoveredIdx].month}):
            </span>
            <span className="text-cyan-400 font-bold">{monthlyContributions[hoveredIdx].count} runs scored</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400">
              Cumulative: {linePoints[hoveredIdx]?.runningSum} runs
            </span>
          </span>
        ) : (
          <span className="text-slate-500">
            Hover over any monthly over to inspect batting pace and cumulative run tally
          </span>
        )}
      </div>
    </div>
  );
}
