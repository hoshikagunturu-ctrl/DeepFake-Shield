import React from 'react';

interface FrequencyChartsProps {
  frequencyBands?: number[];
  mfccFeatures?: number[];
}

export const FrequencyCharts: React.FC<FrequencyChartsProps> = ({
  frequencyBands,
  mfccFeatures,
}) => {
  // Default values matching Screenshot 1
  const defaultFreqBands = [35, 60, 45, 80, 70, 50, 65, 85, 90, 75, 40, 60];
  const defaultMfcc = [80, 45, 90, 70, 30, 40, 85, 60, 50, 75, 65, 40, 55];

  const bands = frequencyBands && frequencyBands.length >= 8 ? frequencyBands.slice(0, 12) : defaultFreqBands;
  const mfcc = mfccFeatures && mfccFeatures.length >= 8 ? mfccFeatures.slice(0, 13) : defaultMfcc;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {/* Frequency Bands Chart (Cyan bars) */}
      <div className="rounded-xl border border-slate-800 bg-[#09101d] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Frequency Bands</span>
          <span className="text-[10px] font-mono text-cyan-400">12 Bands</span>
        </div>
        <div className="flex h-20 items-end justify-between gap-1.5 px-1 pt-2">
          {bands.map((val, idx) => (
            <div key={idx} className="flex flex-1 flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)] transition-all duration-500 hover:brightness-125"
                style={{ height: `${Math.max(10, Math.min(100, val))}%` }}
                title={`Band ${idx + 1}: ${val}%`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MFCC Features Chart (Purple/Magenta bars) */}
      <div className="rounded-xl border border-slate-800 bg-[#09101d] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">MFCC Features</span>
          <span className="text-[10px] font-mono text-purple-400">13 Cepstral Bins</span>
        </div>
        <div className="flex h-20 items-end justify-between gap-1 px-1 pt-2">
          {mfcc.map((val, idx) => (
            <div key={idx} className="flex flex-1 flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-purple-700 via-purple-500 to-fuchsia-400 shadow-[0_0_8px_rgba(168,85,247,0.3)] transition-all duration-500 hover:brightness-125"
                style={{ height: `${Math.max(10, Math.min(100, val))}%` }}
                title={`MFCC Bin ${idx + 1}: ${val}%`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
