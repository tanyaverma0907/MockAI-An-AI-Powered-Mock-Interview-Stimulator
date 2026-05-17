
import React, { useEffect } from "react"; 
import { AudioBars } from "../common/AudioBars";
import { STARBadge } from "../common/STARBadge";
import { LiveHint } from "../common/LiveHint";
import type { RoleConfig } from "../../constants/roles";
import type { Answer, Phase, InterviewMode } from "../../services/interviewService";
import type { STARResult } from "../../utils/starAnalysis";
import { useTheme } from "../../context/ThemeContext";

interface InterviewPanelProps {
  phase: Phase;
  roleData: RoleConfig;
  questions: string[];
  currentQ: number;
  answers: Answer[];
  aiMessage: string;
  aiSubMessage: string;
  isAiTalking: boolean;
  isListening: boolean;
  isProcessingFeedback: boolean;
  liveTranscript: string;
  transcript: string;
  thinkingDots: string;
  starLive: STARResult;
  fillerAlert: boolean;
  eyeHint: string;
  showEyeHint: boolean;
  timeLeft: number;
  interviewMode: InterviewMode;
  useTyping: boolean;
  typedAnswer: string;
  onSetTypedAnswer: (v: string) => void;
  onTypedSubmit: () => void;
  onMicToggle: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const InterviewPanel: React.FC<InterviewPanelProps> = ({
  phase, roleData, questions, currentQ, answers, aiMessage, aiSubMessage,
  isAiTalking, isListening, isProcessingFeedback, liveTranscript, transcript,
  thinkingDots, starLive, fillerAlert, eyeHint, showEyeHint, timeLeft,
  interviewMode, useTyping, typedAnswer, onSetTypedAnswer, onTypedSubmit,
  onMicToggle, videoRef,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ── Premium design tokens ──────────────────────────────────────────────
  const t = {
    pageBg:       isDark ? "bg-[#080b12]"        : "bg-[#f0f1f3]",
    headerBg:     isDark ? "bg-[#080b12]/90 border-white/[0.06]" : "bg-[#f0f1f3]/90 border-black/[0.07]",
    sidebarBorder:isDark ? "border-white/[0.05]" : "border-black/[0.07]",
    sidebarLabel: isDark ? "text-slate-600"      : "text-gray-400",
    cardBg:       isDark ? "bg-[#0d111c]/80 border-white/[0.07]" : "bg-white/80 border-black/[0.06]",
    aiLabel:      isDark ? "text-slate-500"      : "text-gray-400",
    aiText:       isDark ? "text-slate-100"      : "text-gray-900",
    thinking:     isDark ? "text-slate-500"      : "text-gray-400",
    thinkDot:     isDark ? "bg-slate-600"        : "bg-gray-300",
    liveLabel:    isDark ? "text-slate-500"      : "text-gray-400",
    liveText:     isDark ? "text-slate-300"      : "text-gray-600",
    liveIdle:     isDark ? "text-slate-600"      : "text-gray-400",
    typeLabel:    isDark ? "text-slate-500"      : "text-gray-400",
    typeArea:     isDark ? "text-slate-300 placeholder:text-slate-700" : "text-gray-700 placeholder:text-gray-300",
    transcriptLabel: isDark ? "text-slate-500"  : "text-gray-400",
    transcriptText:  isDark ? "text-slate-400"  : "text-gray-500",
    scoreSidebarBg:  isDark ? "border-white/[0.05]" : "border-black/[0.07]",
    scoreLabel:      isDark ? "text-slate-600"  : "text-gray-400",
    scoreEmpty:      isDark ? "text-slate-700"  : "text-gray-300",
    scoreBar:        isDark ? "bg-white/[0.05]" : "bg-black/[0.04]",
    roleText:        isDark ? "text-slate-100"  : "text-gray-800",
    qText:           isDark ? "text-slate-400"  : "text-gray-500",
    qNum:            isDark ? "text-slate-600"  : "text-gray-400",
    divider:         isDark ? "bg-white/[0.05]" : "bg-black/[0.05]",
    noise:           isDark ? "opacity-[0.025]" : "opacity-[0.018]",
  };

useEffect(() => {
  let stream: MediaStream | null = null;

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false, // audio handled separately by your mic logic
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
    }
  };

  startCamera();

  return () => {
    stream?.getTracks().forEach((track) => track.stop());
  };
}, [videoRef]);


  const isActiveListening = phase === "listening";
  const maxTime = interviewMode === "strict" ? 90 : 120;
  const timerPct = (timeLeft / maxTime) * 100;
  const timerColor = timeLeft > 60 ? "#34d399" : timeLeft > 30 ? "#f59e0b" : "#f87171";
  const progress = questions.length ? (currentQ / questions.length) * 100 : 0;
  const liveWords = liveTranscript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className={`min-h-screen ${t.pageBg} flex flex-col transition-colors duration-500 px-15 py-25`}
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes audio-bar  { from{transform:scaleY(0.2)} to{transform:scaleY(1)} }
        @keyframes think-dot  { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes shimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes glow-in    { 0%{opacity:0;transform:translateY(4px)} 100%{opacity:1;transform:translateY(0)} }

        .interview-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .score-pill:hover { transform: translateX(2px); }
        .mic-btn:hover    { transform: translateY(-1px); }
      `}</style>

      {/* ── Hairline progress track ───────────────────────────────────── */}
      <div className="h-px w-full relative overflow-hidden"
        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)" }}>
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${roleData.color}66, ${roleData.color}ff)`,
            boxShadow: `0 0 20px ${roleData.color}80`,
          }}
        />
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className={`flex items-center gap-4 px-6 py-3.5 border-b ${t.headerBg} backdrop-blur-xl sticky top-0 z-20 transition-colors duration-500`}
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{
              background: `linear-gradient(135deg, rgba(${roleData.accentRgb},0.2), rgba(${roleData.accentRgb},0.06))`,
              border: `1px solid rgba(${roleData.accentRgb},0.25)`,
              boxShadow: `0 2px 8px rgba(${roleData.accentRgb},0.15)`,
            }}
          >
            {roleData.emoji}
          </div>
          <span className={`text-xs font-semibold tracking-tight ${t.roleText}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {roleData.label}
          </span>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-bold text-red-400 tracking-[3px]">LIVE</span>
        </div>

        <div className="flex-1" />

        {/* Timer */}
        {isActiveListening && (
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-500"
            style={{ background: `${timerColor}0c`, border: `1px solid ${timerColor}25` }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
              <circle cx="9" cy="9" r="7" fill="none"
                stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"} strokeWidth="2" />
              <circle cx="9" cy="9" r="7" fill="none" stroke={timerColor} strokeWidth="2"
                strokeDasharray={`${(timerPct / 100) * 43.98} 43.98`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
              />
            </svg>
            <span className="text-[11px] font-bold tabular-nums" style={{ color: timerColor }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Strict badge */}
        {interviewMode === "strict" && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
            style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)" }}>
            <span className="text-[8px] font-bold text-amber-400 tracking-[3px]">STRICT</span>
          </div>
        )}

        {/* Q counter */}
        <div className="flex items-center gap-0.5">
          <span className={`text-[11px] font-semibold ${t.qText}`}>
            {Math.min(currentQ + 1, questions.length)}
          </span>
          <span className={`text-[11px] ${t.qNum}`}>/{questions.length}</span>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`w-56 border-r ${t.sidebarBorder} hidden md:flex flex-col gap-0 overflow-y-auto transition-colors duration-500`}
          style={{ background: isDark ? "rgba(8,11,18,0.4)" : "rgba(240,241,243,0.4)" }}
        >
          <div className="px-4 pt-5 pb-3">
            <span
              className={`text-[8px] font-bold tracking-[3px] uppercase ${t.sidebarLabel}`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Questions
            </span>
          </div>

          <div className="flex flex-col px-2 pb-4 gap-0.5">
            {questions.map((q, i) => {
              const ans = answers[i];
              const isCurrent = i === currentQ;
              const isDone = i < currentQ;
              const scoreColor = ans?.score >= 75 ? "#34d399" : ans?.score >= 55 ? "#f59e0b" : "#f87171";

              return (
                <div
                  key={i}
                  className="flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-300 score-pill"
                  style={{
                    background: isCurrent
                      ? `linear-gradient(135deg, rgba(${roleData.accentRgb},0.1), rgba(${roleData.accentRgb},0.04))`
                      : "transparent",
                    borderLeft: `1.5px solid ${isCurrent ? roleData.color : "transparent"}`,
                  }}
                >
                  {/* Indicator */}
                  <div
                    className="shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5"
                    style={{
                      background: isDone
                        ? `${scoreColor}1a`
                        : isCurrent
                          ? `rgba(${roleData.accentRgb},0.18)`
                          : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                      border: `1px solid ${isDone ? `${scoreColor}30` : isCurrent ? `rgba(${roleData.accentRgb},0.3)` : "transparent"}`,
                    }}
                  >
                    <span
                      className="font-bold text-[7px]"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: isDone ? scoreColor : isCurrent ? roleData.color : isDark ? "#2d3748" : "#d1d5db",
                      }}
                    >
                      {isDone ? "✓" : i + 1}
                    </span>
                  </div>

                  {/* Text */}
                  <span
                    className="text-[10px] leading-relaxed line-clamp-3 transition-colors duration-300"
                    style={{
                      color: isCurrent
                        ? isDark ? "rgba(248,250,252,0.85)" : "rgba(15,23,42,0.85)"
                        : isDone
                          ? isDark ? "#2d3748" : "#d1d5db"
                          : isDark ? "#1a2035" : "#e2e8f0",
                    }}
                  >
                    {q.slice(0, 60)}{q.length > 60 ? "…" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Center main ──────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col gap-3.5 p-5 min-w-0 overflow-y-auto">

          {/* ── AI Card ─────────────────────────────────────────────── */}
          <div
            className={`interview-card border rounded-2xl transition-all duration-500 ${t.cardBg}`}
            style={{
              boxShadow: isAiTalking
                ? `0 0 0 1px rgba(${roleData.accentRgb},0.15), 0 8px 40px rgba(${roleData.accentRgb},0.08), 0 2px 8px rgba(0,0,0,0.2)`
                : isDark
                  ? "0 2px 20px rgba(0,0,0,0.3)"
                  : "0 2px 20px rgba(0,0,0,0.04)",
              animation: "glow-in 0.4s ease-out",
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-px w-full rounded-t-2xl"
              style={{
                background: isAiTalking
                  ? `linear-gradient(90deg, transparent, ${roleData.color}60, transparent)`
                  : "transparent",
                transition: "background 0.5s",
              }}
            />

            <div className="flex items-start gap-4 p-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-500"
                  style={{
                    background: isAiTalking
                      ? `linear-gradient(135deg, rgba(${roleData.accentRgb},0.18), rgba(${roleData.accentRgb},0.06))`
                      : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                    border: `1px solid ${isAiTalking ? `rgba(${roleData.accentRgb},0.3)` : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                    boxShadow: isAiTalking ? `0 0 20px rgba(${roleData.accentRgb},0.2)` : "none",
                  }}
                >
                  🤖
                </div>
                {isAiTalking && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ animation: "pulse-ring 1.8s ease-out infinite", border: `1.5px solid ${roleData.color}` }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[8px] font-bold tracking-[3px] uppercase ${t.aiLabel}`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    AI Interviewer
                  </span>
                  {aiSubMessage && (
                    <span
                      className="px-2 py-0.5 rounded-md text-[8px] font-bold tracking-widest uppercase"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        background: phase === "followup"
                          ? "rgba(245,158,11,0.1)"
                          : phase === "feedback"
                            ? "rgba(52,211,153,0.1)"
                            : `rgba(${roleData.accentRgb},0.1)`,
                        color: phase === "followup" ? "#f59e0b" : phase === "feedback" ? "#34d399" : roleData.color,
                        border: `1px solid ${phase === "followup" ? "rgba(245,158,11,0.2)" : phase === "feedback" ? "rgba(52,211,153,0.2)" : `rgba(${roleData.accentRgb},0.2)`}`,
                      }}
                    >
                      {aiSubMessage}
                    </span>
                  )}
                </div>

                {isProcessingFeedback ? (
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${t.thinkDot}`}
                          style={{ animation: "think-dot 1.4s ease-in-out infinite", animationDelay: `${i * 0.22}s` }}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${t.thinking}`}>Analyzing{thinkingDots}</span>
                  </div>
                ) : (
                  <p className={`text-sm leading-7 font-normal ${t.aiText} transition-colors duration-300`}>
                    {aiMessage}
                  </p>
                )}

                {isAiTalking && (
                  <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <AudioBars active color={roleData.color} bars={20} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Live transcript card ─────────────────────────────── */}
          {isActiveListening && (
            <div
              className={`interview-card border rounded-2xl transition-all duration-500 ${t.cardBg}`}
              style={{
                boxShadow: isListening
                  ? "0 0 0 1px rgba(52,211,153,0.12), 0 8px 30px rgba(52,211,153,0.05)"
                  : isDark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="h-px w-full rounded-t-2xl"
                style={{
                  background: isListening
                    ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)"
                    : "transparent",
                  transition: "background 0.5s",
                }}
              />

              <div className="p-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <AudioBars active={isListening} color="#34d399" bars={10} />
                    <span
                      className="text-[8px] font-bold tracking-[3px] uppercase transition-colors duration-300"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: isListening ? "#34d399" : isDark ? "#374151" : "#9ca3af",
                      }}
                    >
                      {isListening ? "Recording" : "Paused"}
                    </span>
                    {liveWords > 0 && (
                      <span
                        className={`text-[8px] font-medium ${t.liveLabel} tabular-nums`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {liveWords}w
                      </span>
                    )}
                  </div>
                  <STARBadge star={starLive} />
                </div>

                {/* Transcript content */}
                {liveTranscript ? (
                  <p className={`${t.liveText} text-sm leading-7 min-h-10 transition-colors duration-300`}>
                    {liveTranscript}
                    <span
                      className="inline-block w-0.5 h-4 ml-1 rounded-sm animate-pulse align-middle"
                      style={{ background: "#34d399" }}
                    />
                  </p>
                ) : (
                  <div className="flex items-center gap-2.5 min-h-10">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "rgba(52,211,153,0.6)" }}
                    />
                    <span className={`${t.liveIdle} text-sm`}>Listening… speak your answer</span>
                  </div>
                )}

                {/* Filler alert */}
                {fillerAlert && (
                  <div
                    className="mt-3.5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
                  >
                    <span className="text-amber-400 text-xs shrink-0">⚠</span>
                    <span className="text-[11px] font-medium" style={{ color: "rgba(251,191,36,0.75)" }}>
                      Filler words detected — try pausing instead of saying "um"
                    </span>
                  </div>
                )}

                <LiveHint hint={eyeHint} visible={showEyeHint} />
              </div>
            </div>
          )}

          {/* ── Typing input ─────────────────────────────────────── */}
          {isActiveListening && useTyping && (
            <div className={`interview-card border rounded-2xl ${t.cardBg} transition-colors duration-500`}
              style={{ boxShadow: isDark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.04)" }}>
              <div className="p-4">
                <span
                  className={`text-[8px] font-bold tracking-[3px] uppercase ${t.typeLabel} block mb-3`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Type Your Answer
                </span>
                <textarea
                  value={typedAnswer}
                  onChange={(e) => onSetTypedAnswer(e.target.value)}
                  placeholder="Type your answer here…"
                  rows={4}
                  className={`w-full bg-transparent text-sm leading-7 resize-none outline-none ${t.typeArea} transition-colors duration-300`}
                />
                <div className="flex justify-end mt-3 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                  <button
                    onClick={onTypedSubmit}
                    disabled={!typedAnswer.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: typedAnswer.trim()
                        ? "linear-gradient(135deg, #4f46e5, #6d28d9)"
                        : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                      color: typedAnswer.trim() ? "white" : isDark ? "#2d3748" : "#9ca3af",
                      boxShadow: typedAnswer.trim() ? "0 4px 16px rgba(79,70,229,0.3)" : "none",
                    }}
                  >
                    Submit Answer
                    <span style={{ opacity: typedAnswer.trim() ? 1 : 0.4 }}>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Processing transcript ────────────────────────────── */}
          {phase === "processing" && transcript && (
            <div className={`interview-card border rounded-2xl ${t.cardBg} transition-colors duration-500`}
              style={{ boxShadow: isDark ? "0 2px 20px rgba(0,0,0,0.3)" : "0 2px 20px rgba(0,0,0,0.04)" }}>
              <div className="p-4">
                <span
                  className={`text-[8px] font-bold tracking-[3px] uppercase ${t.transcriptLabel} block mb-2.5`}
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Your Response
                </span>
                <p className={`${t.transcriptText} text-sm leading-7`}>{transcript}</p>
              </div>
            </div>
          )}

          {/* ── Mic button ───────────────────────────────────────── */}
          {isActiveListening && !useTyping && (
            <button
              onClick={onMicToggle}
              className="mic-btn flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 border"
              style={{
                background: isListening
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(52,211,153,0.06)",
                borderColor: isListening ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)",
                color: isListening ? "#f87171" : "#34d399",
                boxShadow: isListening
                  ? "0 4px 24px rgba(239,68,68,0.07), inset 0 1px 0 rgba(239,68,68,0.07)"
                  : "0 4px 24px rgba(52,211,153,0.07), inset 0 1px 0 rgba(52,211,153,0.07)",
              }}
            >
              <span className="text-base">{isListening ? "⏹" : "🎙️"}</span>
              {isListening ? "Stop Recording" : "Resume Recording"}
            </button>
          )}
        </main>

        {/* ── Right — camera + scores ───────────────────────────────────── */}
        <aside
          className={`w-60 border-l ${t.scoreSidebarBg} flex flex-col transition-colors duration-500`}
          style={{ background: isDark ? "rgba(8,11,18,0.4)" : "rgba(240,241,243,0.4)" }}
        >
          {/* Camera */}
          <div className="relative" style={{ minHeight: 220 }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                transform: "scaleX(-1)",
                background: isDark ? "#06080f" : "#e2e4e6",
                minHeight: 220,
              }}
            />

            {/* Camera overlay UI */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)",
              }}
            >
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "1.5px solid rgba(255,255,255,0.25)", borderLeft: "1.5px solid rgba(255,255,255,0.25)", borderTopLeftRadius: 4 }} />
              <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "1.5px solid rgba(255,255,255,0.25)", borderRight: "1.5px solid rgba(255,255,255,0.25)", borderTopRightRadius: 4 }} />
              <div className="absolute bottom-12 left-3 w-5 h-5" style={{ borderBottom: "1.5px solid rgba(255,255,255,0.25)", borderLeft: "1.5px solid rgba(255,255,255,0.25)", borderBottomLeftRadius: 4 }} />
              <div className="absolute bottom-12 right-3 w-5 h-5" style={{ borderBottom: "1.5px solid rgba(255,255,255,0.25)", borderRight: "1.5px solid rgba(255,255,255,0.25)", borderBottomRightRadius: 4 }} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: isListening ? "#ef4444" : "#22c55e",
                    boxShadow: isListening ? "0 0 6px #ef4444" : "0 0 6px #22c55e",
                  }}
                />
                <span
                  className="text-[8px] text-white/60 font-bold tracking-[2px]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {isListening ? "REC" : "LIVE"}
                </span>
              </div>
              <AudioBars active={isListening} color="#34d399" bars={7} height={18} />
            </div>
          </div>

          {/* Score panel */}
          <div className="p-4 flex-1" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)"}` }}>
            <span
              className={`text-[8px] font-bold tracking-[3px] uppercase ${t.scoreLabel} block mb-3`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Scores
            </span>

            {answers.length === 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-full h-px" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }} />
                <span className={`${t.scoreEmpty} text-[10px] font-medium whitespace-nowrap`}>No answers yet</span>
                <div className="w-full h-px" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }} />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {answers.map((a, i) => {
                  const c = a.score >= 80 ? "#34d399" : a.score >= 60 ? "#f59e0b" : "#f87171";
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <span
                        className={`font-bold text-[9px] ${t.scoreLabel} w-5 shrink-0`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        Q{i + 1}
                      </span>
                      <div
                        className={`flex-1 h-0.5 rounded-full ${t.scoreBar} overflow-hidden`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${a.score}%`, background: c, boxShadow: `0 0 6px ${c}80` }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-bold w-6 text-right tabular-nums"
                        style={{ fontFamily: "'DM Mono', monospace", color: c }}
                      >
                        {a.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
