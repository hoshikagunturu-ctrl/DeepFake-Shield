import React from 'react';

interface GaugeProps {
  percentage: number;
  label: string;
  color?: 'cyan' | 'red' | 'purple' | 'green';
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
  percentage,
  label,
  color = 'cyan',
  size = 130,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc covering ~240 degrees like in screenshot
  const arcLength = circumference * 0.75;
  const progressLength = arcLength * (Math.min(100, Math.max(0, percentage)) / 100);

  const colorMap = {
    cyan: {
      stroke: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
    red: {
      stroke: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
    },
    purple: {
      stroke: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
    },
    green: {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
  };

  const activeColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[135deg]"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated active arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={activeColor.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${activeColor.glow})`,
              transition: 'stroke-dasharray 0.8s ease-out',
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-white">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="mt-1 text-xs font-medium text-slate-400">
        {label}
      </span>
    </div>
  );
};
