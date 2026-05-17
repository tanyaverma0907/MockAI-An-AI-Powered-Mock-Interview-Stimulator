
import React from "react";
import { ScoreRing } from "../common/ScoreRing";
import { STARBadge } from "../common/STARBadge";
import type { RoleConfig } from "../../constants/roles";
import type { Answer } from "../../services/interviewService";
import { getScoreColor } from "../../utils/scoring";
import { useTheme } from "../../context/ThemeContext";

interface ResultScreenProps {
  roleData: RoleConfig;
  answers: Answer[];
  overallScore: number;
  saved: boolean;
  onChangeRole: () => void;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  roleData, answers, overallScore, saved, onChangeRole, onRestart,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const t = {
    pageBg:      isDark ? "bg-[#05080f]"        : "bg-[#f5f5f3]",
    cardBg:      isDark ? "bg-[#0b0f1a]"        : "bg-white",
    cardBorder:  isDark ? "border-white/[0.07]" : "border-black/[0.05]",
    cardHover:   isDark ? "hover:border-white/9": "hover:border-black/9",
    shadow:      isDark ? "shadow-black/30"     : "shadow-black/6",
    heading:     isDark ? "text-white"          : "text-gray-900",
    subText:     isDark ? "text-slate-600"      : "text-gray-400",
    savedText:   isDark ? "text-emerald-500"    : "text-emerald-600",
    dividerLine: isDark ? "bg-white/5"          : "bg-black/[0.05]",
    dividerText: isDark ? "text-slate-700"      : "text-gray-400",
    ansHeader:   isDark ? "text-slate-700"      : "text-gray-400",
    ansQ:        isDark ? "text-white"          : "text-gray-900",
    ansYourBg:   isDark ? "bg-black/25"         : "bg-black/[0.02]",
    ansYourLabel:isDark ? "text-slate-700"      : "text-gray-400",
    ansYourText: isDark ? "text-slate-500"      : "text-gray-500",
    ansNoAnswer: isDark ? "text-slate-700"      : "text-gray-300",
    ansFeedbackBg: isDark ? "rgba(0,0,0,0.2)"  : "rgba(0,0,0,0.02)",
    ansFeedbackText: isDark ? "text-slate-300"  : "text-gray-600",
    fillerText:  isDark ? "text-orange-500/60"  : "text-orange-400/80",
    backBtn:     isDark ? "border-white/5 text-slate-500 hover:bg-white/3 hover:text-slate-400" : "border-black/[0.05] text-gray-400 hover:bg-black/[0.02] hover:text-gray-600",
    statBg:      isDark ? "bg-[#0b0f1a] border-white/5" : "bg-white border-black/[0.05]",
    statLabel:   isDark ? "text-slate-600"      : "text-gray-400",
  };

  const sColor = getScoreColor(overallScore);
  const allFillers = answers.reduce((s, a) => s + (a.fillerCount || 0), 0);
  const starScores = answers.reduce(
    (acc, a) => {
      if (!a.starAnalysis) return acc;
      return {
        s: acc.s + (a.starAnalysis.situation ? 1 : 0),
        t: acc.t + (a.starAnalysis.task ? 1 : 0),
        a: acc.a + (a.starAnalysis.action ? 1 : 0),
        r: acc.r + (a.starAnalysis.result ? 1 : 0),
      };
    },
    { s: 0, t: 0, a: 0, r: 0 }
  );

  const headline =
    overallScore >= 80 ? "Outstanding Performance"
    : overallScore >= 60 ? "Solid Showing"
    : "Good Practice Session";

  return (
    <div className={`min-h-screen ${t.pageBg} flex flex-col items-center p-6 overflow-auto transition-colors duration-300`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-80"
          style={{
            background: `radial-gradient(ellipse, ${sColor} 0%, transparent 60%)`,
            filter: "blur(90px)",
            opacity: isDark ? 0.07 : 0.04,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            opacity: isDark ? 0.015 : 0.025,
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full pt-10 pb-24">

        {/* Score Hero */}
        <div className={`flex items-center gap-6 ${t.cardBg} border ${t.cardBorder} rounded-3xl p-7 mb-4 shadow-xl ${t.shadow} transition-colors duration-300`}>
          <ScoreRing score={overallScore} size={96} showLabel />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-[9px] font-bold ${t.subText} tracking-widest`}>INTERVIEW COMPLETE</span>
              {saved && <span className={`font-mono text-[9px] ${t.savedText} tracking-wide`}>· SAVED</span>}
            </div>
            <h2 className={`text-2xl font-black ${t.heading} mb-1 tracking-tight transition-colors duration-300`}>{headline}</h2>
            <p className={`${t.subText} text-sm`}>{roleData.emoji} {roleData.label} · {answers.length} questions answered</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          {[
            { label: "Overall",      value: `${overallScore}%`, color: sColor },
            { label: "Strong (≥75)", value: answers.filter((a) => a.score >= 75).length, color: "#34d399" },
            { label: "Needs Work",   value: answers.filter((a) => a.score < 55).length,  color: "#f87171" },
            { label: "Filler Words", value: allFillers, color: allFillers > 10 ? "#fbbf24" : isDark ? "#64748b" : "#9ca3af" },
          ].map((s) => (
            <div key={s.label} className={`${t.statBg} border rounded-2xl p-4 text-center ${t.cardHover} transition-colors`}>
              <div className="text-2xl font-black mb-0.5 font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className={`text-[10px] ${t.statLabel} font-medium`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* STAR Analysis */}
        <div className={`${t.cardBg} border ${t.cardBorder} rounded-2xl p-5 mb-4 transition-colors duration-300`}>
          <div className={`font-mono text-[9px] font-bold ${t.subText} tracking-widest mb-4`}>STAR METHOD COVERAGE</div>
          <div className="grid grid-cols-4 gap-3">
            {([
              { label: "Situation", val: starScores.s },
              { label: "Task",      val: starScores.t },
              { label: "Action",    val: starScores.a },
              { label: "Result",    val: starScores.r },
            ]).map(({ label, val }) => {
              const pct = answers.length ? Math.round((val / answers.length) * 100) : 0;
              const c = pct >= 75 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171";
              return (
                <div key={label} className="text-center">
                  <div className="font-mono text-sm font-black mb-1.5" style={{ color: c }}>{pct}%</div>
                  <div className={`h-1.5 ${isDark ? "bg-white/4" : "bg-black/[0.04]"} rounded-full overflow-hidden mb-1.5`}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`, background: c,
                      transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: `0 0 6px ${c}60`,
                    }} />
                  </div>
                  <div className={`text-[10px] ${t.subText} font-medium`}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`flex-1 h-px ${t.dividerLine}`} />
          <span className={`font-mono text-[9px] font-bold ${t.dividerText} tracking-widest`}>ANSWER BREAKDOWN</span>
          <span className={`flex-1 h-px ${t.dividerLine}`} />
        </div>

        {/* Answers */}
        <div className="flex flex-col gap-3 mb-9">
          {answers.map((a, i) => {
            const c = getScoreColor(a.score);
            return (
              <div key={i} className={`${t.cardBg} border ${t.cardBorder} rounded-2xl p-5 ${t.cardHover} transition-all duration-200 group`}>
                <div className="flex items-start gap-4 mb-4">
                  <ScoreRing score={a.score} size={52} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-mono text-[9px] font-bold ${t.ansHeader} mb-1`}>Q{i + 1}</div>
                    <p className={`${t.ansQ} text-sm font-semibold leading-snug`}>{a.question}</p>
                    {a.starAnalysis && <div className="mt-2"><STARBadge star={a.starAnalysis} /></div>}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className={`${t.ansYourBg} rounded-xl p-3.5`}>
                    <span className={`font-mono text-[9px] font-bold ${t.ansYourLabel} block mb-1.5`}>YOUR ANSWER</span>
                    <p className={`${t.ansYourText} text-xs leading-relaxed`}>
                      {a.answer || <em className={t.ansNoAnswer}>No answer recorded</em>}
                    </p>
                  </div>

                  {a.followUpAsked && (
                    <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3.5">
                      <span className="font-mono text-[9px] font-bold text-amber-600 block mb-1">FOLLOW-UP ASKED</span>
                      <p className="text-amber-300/70 text-xs mb-2.5">{a.followUpAsked}</p>
                      {a.followUpAnswer && (
                        <>
                          <span className={`font-mono text-[9px] font-bold ${t.ansYourLabel} block mb-1`}>YOUR FOLLOW-UP ANSWER</span>
                          <p className={`${t.ansYourText} text-xs leading-relaxed`}>{a.followUpAnswer}</p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl p-3.5" style={{ background: t.ansFeedbackBg, borderLeft: `3px solid ${c}` }}>
                    <span className="font-mono text-[9px] font-bold block mb-1.5" style={{ color: `${c}80` }}>AI FEEDBACK</span>
                    <p className={`${t.ansFeedbackText} text-xs leading-relaxed`}>{a.feedback}</p>
                    {(a.fillerCount || 0) > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className={`font-mono text-[9px] ${t.fillerText}`}>
                          {a.fillerCount} filler word{(a.fillerCount || 0) > 1 ? "s" : ""} detected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button onClick={onChangeRole} className={`flex-1 py-4 rounded-2xl border ${t.backBtn} font-semibold text-sm transition-all`}>
            Change Role
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              boxShadow: "0 8px 28px rgba(79,70,229,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            New Interview ↻
          </button>
        </div>
      </div>
    </div>
  );
};