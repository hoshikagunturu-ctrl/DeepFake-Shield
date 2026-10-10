import React from 'react';

interface SpectralHeatmapProps {
  heatmapData?: number[][];
}

export const SpectralHeatmap: React.FC<SpectralHeatmapProps> = ({ heatmapData }) => {
  // 16 columns x 8 rows default grid matching screenshot 1
  const rows = 8;
  const cols = 16;

  // Fallback pattern if no live data provided
  const defaultGrid: number[][] = Array(rows).fill(0).map((_, r) =>
    Array(cols).fill(0).map((_, c) => {
      const v = Math.sin((r + c) * 0.6) * 0.35 + 0.55;
      return parseFloat(v.toFixed(2));
    })
  );

  const grid = heatmapData && heatmapData.length >= rows ? heatmapData : defaultGrid;

  // Map intensity 0.0 - 1.0 to rich cyan-teal colors
  const getColor = (val: number) => {
    if (val > 0.8) return 'bg-[#34d399] opacity-95 shadow-[0_0_8px_rgba(52,211,153,0.5)]'; // Bright emerald/cyan
    if (val > 0.65) return 'bg-[#2dd4bf] opacity-90 shadow-[0_0_6px_rgba(45,212,191,0.4)]'; // Teal
    if (val > 0.5) return 'bg-[#06b6d4] opacity-80'; // Cyan
    if (val > 0.35) return 'bg-[#0891b2] opacity-75'; // Darker cyan
    if (val > 0.2) return 'bg-[#0e7490] opacity-65'; // Deep cyan
    return 'bg-[#155e75] opacity-50'; // Low intensity
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300 tracking-wide">
          Spectral Analysis Heatmap
        </h4>
        <span className="text-[10px] font-mono text-cyan-400">16x8 Time-Frequency Bins</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#09101d] p-2.5 shadow-inner">
        <div className="grid grid-rows-8 gap-1.5 w-full h-36">
          {grid.slice(0, rows).map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-16 gap-1 w-full h-full">
              {row.slice(0, cols).map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`h-full w-full rounded-sm transition-all duration-300 ${getColor(val)} hover:scale-110`}
                  title={`Freq bin ${rows - rIdx}, Time step ${cIdx + 1}: ${Math.round(val * 100)}%`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
