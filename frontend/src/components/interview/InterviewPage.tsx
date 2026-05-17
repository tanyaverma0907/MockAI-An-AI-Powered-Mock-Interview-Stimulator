import React, { useRef } from "react";
import { AudioBars } from "../common/AudioBars";
import { STARBadge } from "../common/STARBadge";
import { LiveHint } from "../common/LiveHint";
import type { RoleConfig } from "../../constants/roles";
import type { Answer, Phase, InterviewMode } from "../../services/interviewService";
import type { STARResult } from "../../utils/starAnalysis";

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
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const InterviewPanel: React.FC<InterviewPanelProps> = ({
  phase,
  roleData,
  questions,
  currentQ,
  answers,
  aiMessage,
  aiSubMessage,
  isAiTalking,
  isListening,
  isProcessingFeedback,
  liveTranscript,
  transcript,
  thinkingDots,
  starLive,
  fillerAlert,
  eyeHint,
  showEyeHint,
  timeLeft,
  interviewMode,
  useTyping,
  typedAnswer,
  onSetTypedAnswer,
  onTypedSubmit,
  onMicToggle,
  videoRef,
}) => {
  const isActiveListening = phase === "listening";
  const maxTime = interviewMode === "strict" ? 90 : 120;
  const timerPct = (timeLeft / maxTime) * 100;
  const timerColor = timeLeft > 60 ? "#34d399" : timeLeft > 30 ? "#fbbf24" : "#f87171";
  const progress = questions.length ? (currentQ / questions.length) * 100 : 0;
  const liveWords = liveTranscript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#05080f] flex flex-col font-sans">
      <style>{`
        @keyframes audio-bar { from{transform:scaleY(0.25)} to{transform:scaleY(1)} }
        @keyframes think-dot { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
      `}</style>

      {/* Progress line */}
      <div className="h-[2px] w-full relative bg-white/[0.04]">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${roleData.color}aa, ${roleData.color})`,
            boxShadow: `0 0 12px ${roleData.color}60`,
          }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-white/[0.04] bg-[#05080f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{roleData.emoji}</span>
          <span className="font-bold text-white text-sm">{roleData.label}</span>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/8 border border-red-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[9px] font-bold text-red-400 tracking-widest">LIVE</span>
        </div>

        <div className="flex-1" />

        {/* Timer */}
        {isActiveListening && (
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all"
            style={{
              borderColor: `${timerColor}30`,
              background: `${timerColor}08`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle
                cx="9" cy="9" r="7" fill="none"
                stroke={timerColor} strokeWidth="2"
                strokeDasharray={`${(timerPct / 100) * 43.98} 43.98`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
              />
            </svg>
            <span className="font-mono text-xs font-bold" style={{ color: timerColor }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}

        {interviewMode === "strict" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/8 border border-orange-500/20">
            <span className="font-mono text-[9px] font-bold text-orange-400 tracking-widest">STRICT</span>
          </div>
        )}

        <div className="font-mono text-xs font-bold text-slate-600">
          {Math.min(currentQ + 1, questions.length)}
          <span className="text-slate-700">/{questions.length}</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Left sidebar — questions nav */}
        <aside className="w-52 border-r border-white/[0.04] p-4 hidden md:flex flex-col gap-1 overflow-y-auto">
          <div className="font-mono text-[9px] font-bold text-slate-700 tracking-[3px] mb-3 uppercase">
            Questions
          </div>
          {questions.map((q, i) => {
            const ans = answers[i];
            const isCurrent = i === currentQ;
            const isDone = i < currentQ;
            const scoreColor = ans?.score >= 75 ? "#34d399" : ans?.score >= 55 ? "#fbbf24" : "#f87171";
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-xl transition-all"
                style={{
                  background: isCurrent ? `rgba(${roleData.accentRgb},0.07)` : "transparent",
                  borderLeft: `2px solid ${isCurrent ? roleData.color : "transparent"}`,
                }}
              >
                <div
                  className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5"
                  style={{
                    background: isDone
                      ? `${scoreColor}22`
                      : isCurrent
                        ? `rgba(${roleData.accentRgb},0.2)`
                        : "rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    className="font-mono text-[8px] font-black"
                    style={{ color: isDone ? scoreColor : isCurrent ? roleData.color : "#374151" }}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                </div>
                <span
                  className="text-[10px] leading-tight line-clamp-3"
                  style={{
                    color: isCurrent ? "rgba(255,255,255,0.8)" : isDone ? "#374151" : "#1e293b",
                  }}
                >
                  {q.slice(0, 55)}{q.length > 55 ? "…" : ""}
                </span>
              </div>
            );
          })}
        </aside>

        {/* Center */}
        <main className="flex-1 flex flex-col gap-4 p-5 min-w-0 overflow-y-auto">

          {/* AI card */}
          <div className="bg-[#0b0f1a] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-start gap-4">
              {/* AI avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300"
                  style={{
                    background: isAiTalking
                      ? `rgba(${roleData.accentRgb},0.15)`
                      : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isAiTalking ? roleData.color : "rgba(255,255,255,0.07)"}`,
                    boxShadow: isAiTalking
                      ? `0 0 24px rgba(${roleData.accentRgb},0.25)`
                      : "none",
                  }}
                >
                  🤖
                </div>
                {isAiTalking && (
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      animation: "pulse-ring 1.5s ease-out infinite",
                      border: `2px solid ${roleData.color}`,
                    }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="font-mono text-[9px] font-bold text-slate-600 tracking-widest">
                    AI INTERVIEWER
                  </span>
                  {aiSubMessage && (
                    <span
                      className="px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        background:
                          phase === "followup" ? "rgba(251,191,36,0.1)"
                          : phase === "feedback" ? "rgba(52,211,153,0.1)"
                          : `rgba(${roleData.accentRgb},0.1)`,
                        color:
                          phase === "followup" ? "#fbbf24"
                          : phase === "feedback" ? "#34d399"
                          : roleData.color,
                        border: `1px solid ${
                          phase === "followup" ? "rgba(251,191,36,0.2)"
                          : phase === "feedback" ? "rgba(52,211,153,0.2)"
                          : `rgba(${roleData.accentRgb},0.2)`}`,
                      }}
                    >
                      {aiSubMessage}
                    </span>
                  )}
                </div>

                {isProcessingFeedback ? (
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-slate-600"
                          style={{
                            animation: "think-dot 1.2s ease-in-out infinite",
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 text-sm">Analyzing{thinkingDots}</span>
                  </div>
                ) : (
                  <p className="text-white text-sm leading-relaxed font-medium">{aiMessage}</p>
                )}

                {isAiTalking && (
                  <div className="mt-3">
                    <AudioBars active color={roleData.color} bars={18} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live transcript panel */}
          {isActiveListening && (
            <div className="bg-[#0b0f1a] border border-white/[0.06] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <AudioBars active={isListening} color="#34d399" bars={10} />
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest"
                    style={{ color: isListening ? "#34d399" : "#475569" }}
                  >
                    {isListening ? "RECORDING" : "PAUSED"}
                  </span>
                  {liveWords > 0 && (
                    <span className="font-mono text-[10px] text-slate-700">{liveWords}w</span>
                  )}
                </div>
                <STARBadge star={starLive} />
              </div>

              {liveTranscript ? (
                <p className="text-slate-300 text-sm leading-relaxed min-h-[40px]">
                  {liveTranscript}
                  <span className="inline-block w-[2px] h-4 bg-emerald-400 ml-0.5 animate-pulse rounded" />
                </p>
              ) : (
                <div className="flex items-center gap-2 min-h-[40px]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
                  <span className="text-slate-700 text-sm">Listening… speak your answer</span>
                </div>
              )}

              {fillerAlert && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2.5 bg-orange-500/6 border border-orange-500/20 rounded-xl">
                  <span className="text-orange-400 text-xs">⚠️</span>
                  <span className="text-orange-300/75 text-[11px] font-medium">
                    Filler words detected — try pausing instead of saying "um"
                  </span>
                </div>
              )}

              <LiveHint hint={eyeHint} visible={showEyeHint} />
            </div>
          )}

          {/* Typing input */}
          {isActiveListening && useTyping && (
            <div className="bg-[#0b0f1a] border border-white/[0.06] rounded-2xl p-4">
              <div className="font-mono text-[9px] font-bold text-slate-600 tracking-widest mb-2.5">
                TYPE YOUR ANSWER
              </div>
              <textarea
                value={typedAnswer}
                onChange={(e) => onSetTypedAnswer(e.target.value)}
                placeholder="Type your answer here…"
                className="w-full bg-transparent text-slate-300 text-sm leading-relaxed resize-none outline-none placeholder:text-slate-700 mb-3"
                rows={4}
              />
              <button
                onClick={onTypedSubmit}
                disabled={!typedAnswer.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                style={{
                  background: typedAnswer.trim()
                    ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                    : "rgba(255,255,255,0.04)",
                  color: typedAnswer.trim() ? "white" : "#334155",
                }}
              >
                Submit Answer →
              </button>
            </div>
          )}

          {/* Processing transcript */}
          {phase === "processing" && transcript && (
            <div className="bg-[#0b0f1a] border border-white/[0.06] rounded-2xl p-4">
              <div className="font-mono text-[9px] font-bold text-slate-600 tracking-widest mb-2">
                YOUR RESPONSE
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{transcript}</p>
            </div>
          )}

          {/* Mic control */}
          {isActiveListening && !useTyping && (
            <button
              onClick={onMicToggle}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all duration-200 border"
              style={{
                background: isListening ? "rgba(239,68,68,0.08)" : "rgba(52,211,153,0.08)",
                borderColor: isListening ? "rgba(239,68,68,0.25)" : "rgba(52,211,153,0.25)",
                color: isListening ? "#f87171" : "#34d399",
                boxShadow: isListening
                  ? "0 0 20px rgba(239,68,68,0.08)"
                  : "0 0 20px rgba(52,211,153,0.08)",
              }}
            >
              <span className="text-base">{isListening ? "⏹" : "🎙️"}</span>
              {isListening ? "Stop Recording" : "Resume Recording"}
            </button>
          )}
        </main>

        {/* Right — camera */}
        <aside className="w-60 border-l border-white/[0.04] flex flex-col">
          <div className="relative flex-1" style={{ minHeight: 210 }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)", background: "#05080f" }}
            />
            {/* Video overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between"
              style={{
                background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    background: isListening ? "#ef4444" : "#22c55e",
                    boxShadow: isListening ? "0 0 6px #ef4444" : "none",
                  }}
                />
                <span className="font-mono text-[9px] text-slate-400 font-bold">
                  {isListening ? "REC" : "LIVE"}
                </span>
              </div>
              <AudioBars active={isListening} color="#34d399" bars={7} height={20} />
            </div>
          </div>

          {/* Score ticker */}
          <div className="p-3.5 border-t border-white/[0.04]">
            <div className="font-mono text-[9px] font-bold text-slate-700 tracking-widest mb-2.5">
              SCORES
            </div>
            {answers.length === 0 ? (
              <span className="text-slate-800 text-xs font-medium">No answers yet</span>
            ) : (
              <div className="flex flex-col gap-2">
                {answers.map((a, i) => {
                  const c =
                    a.score >= 80 ? "#34d399" : a.score >= 60 ? "#fbbf24" : "#f87171";
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-slate-700 w-4">Q{i + 1}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${a.score}%`, background: c }}
                        />
                      </div>
                      <span
                        className="font-mono text-[9px] font-bold w-5 text-right"
                        style={{ color: c }}
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