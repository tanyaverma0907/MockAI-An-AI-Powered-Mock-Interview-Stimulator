
import React from "react";
import { getScoreColor } from "../../utils/scoring";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 72,
  strokeWidth = 5,
  showLabel = false,
}) => {
  const r     = size / 2 - strokeWidth - 2;
  const circ  = 2 * Math.PI * r;
  const fill  = (score / 100) * circ;
  const color = getScoreColor(score);
  const cx    = size / 2;

  return (
    <div className="relative flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
      >
        {/* Track */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth={strokeWidth} />
        {/* Glow */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={strokeWidth + 3}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" opacity={0.15} />
        {/* Arc */}
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 1.3s cubic-bezier(0.34,1.56,0.64,1)",
            filter: `drop-shadow(0 0 5px ${color}80)`,
          }}
        />
        {/* Score text */}
        <text
          x={cx} y={cx + 5}
          textAnchor="middle"
          fill={color}
          fontSize={size < 55 ? 10 : size < 80 ? 13 : 16}
          fontWeight="800"
          fontFamily="'JetBrains Mono', monospace"
          style={{ transform: "rotate(90deg)", transformOrigin: `${cx}px ${cx}px` }}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <span className="text-[9px] font-black tracking-widest uppercase font-mono" style={{ color }}>
          {score >= 80 ? "Strong" : score >= 60 ? "Solid" : "Needs Work"}
        </span>
      )}
    </div>
  );
};