
import React from "react";
import type { STARResult } from "../../utils/starAnalysis";
import { useTheme } from "../../context/ThemeContext";

interface STARBadgeProps {
  star: STARResult;
  size?: "sm" | "md";
}

const LABELS = [
  { key: "situation" as const, short: "S", full: "Situation" },
  { key: "task"      as const, short: "T", full: "Task" },
  { key: "action"   as const, short: "A", full: "Action" },
  { key: "result"   as const, short: "R", full: "Result" },
];

export const STARBadge: React.FC<STARBadgeProps> = ({ star, size = "sm" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const dim  = size === "md" ? "w-7 h-7" : "w-5 h-5";
  const font = size === "md" ? "text-[11px]" : "text-[9px]";

  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[9px] font-black tracking-[3px] mr-0.5 font-mono ${isDark ? "text-slate-600" : "text-gray-400"}`}>
        STAR
      </span>
      {LABELS.map(({ key, short, full }) => {
        const active = star[key];
        return (
          <div
            key={key}
            title={full}
            className={`${dim} ${font} rounded flex items-center justify-center font-black transition-all duration-300 cursor-default`}
            style={{
              background: active
                ? "rgba(52,211,153,0.15)"
                : isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${active ? "rgba(52,211,153,0.45)" : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              color: active ? "#34d399" : isDark ? "#374151" : "#d1d5db",
              boxShadow: active ? "0 0 8px rgba(52,211,153,0.2)" : "none",
              transform: active ? "scale(1.05)" : "scale(1)",
            }}
          >
            {short}
          </div>
        );
      })}
    </div>
  );
};