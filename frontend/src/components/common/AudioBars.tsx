
import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface AudioBarsProps {
  active: boolean;
  color?: string;
  bars?: number;
  height?: number;
}

const HEIGHTS = [3, 5, 8, 6, 11, 7, 13, 9, 7, 5, 9, 4, 10, 6, 8, 4];

export const AudioBars: React.FC<AudioBarsProps> = ({
  active,
  color = "#818cf8",
  bars = 12,
  height = 28,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        @keyframes audio-bar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      <div className="flex items-end gap-0.5" style={{ height }} aria-hidden="true">
        {Array.from({ length: bars }).map((_, i) => {
          const h = HEIGHTS[i % HEIGHTS.length];
          return (
            <div
              key={i}
              className="rounded-full origin-bottom"
              style={{
                width: 2.5,
                background: active ? color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                height: active ? `${h * 2}px` : "3px",
                transition: "height 0.12s ease, background 0.3s ease",
                animation: active
                  ? `audio-bar ${0.3 + i * 0.055}s ease-in-out infinite alternate`
                  : "none",
                animationDelay: `${i * 0.035}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};