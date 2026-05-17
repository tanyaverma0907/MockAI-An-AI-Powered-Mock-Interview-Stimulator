
import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface CameraPermissionProps {
  error: string;
  onAllow: () => void;
  onBack: () => void;
}

export const CameraPermission: React.FC<CameraPermissionProps> = ({
  error,
  onAllow,
  onBack,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const TRUST_ITEMS = [
    { text: "Video stays in your browser", icon: "🛡️", detail: "Never leaves your device" },
    { text: "No recordings are stored",    icon: "🔒", detail: "Session-only processing"  },
    { text: "Local audio processing",      icon: "🎤", detail: "On-device speech-to-text" },
  ];

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-center px-6 transition-colors duration-500 relative overflow-hidden ${isDark ? "bg-[#06080f]" : "bg-[#f0f1f4]"}`}
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes float-slow  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes scan-line   { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes fade-up     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bracket-in  { from{opacity:0;transform:scale(1.06)} to{opacity:1;transform:scale(1)} }

        .cam-card    { animation: bracket-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .trust-row   { animation: fade-up 0.4s ease-out both; }
        .trust-row:hover { transform: translateX(3px); transition: transform 0.2s ease; }
      `}</style>

      {/* ── Background atmosphere ───────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft glow orb */}
        <div
          className="absolute -top-1/4 right-0 w-[50vw] h-[50vw] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 -left-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">

        {/* ── LEFT: Controls ───────────────────────────────────────────── */}
        <div className="order-2 lg:order-1 flex flex-col" style={{ animation: "fade-up 0.6s ease-out both" }}>

          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full mb-6"
            style={{
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
            <span
              className="text-[8px] font-bold tracking-[3px] uppercase"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: isDark ? "rgba(148,163,184,0.7)" : "rgba(71,85,105,0.7)",
              }}
            >
              Permissions Required
            </span>
          </div>

          {/* Heading */}
          <h1
            className={`text-3xl lg:text-4xl font-semibold tracking-tight mb-3 ${isDark ? "text-slate-50" : "text-slate-900"}`}
            style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Enable your
            <br />
            <span style={{ color: "#6366f1" }}>camera</span>
          </h1>

          <p
            className="text-sm leading-7 mb-8 max-w-xs"
            style={{ color: isDark ? "rgba(148,163,184,0.65)" : "rgba(71,85,105,0.7)" }}
          >
            We analyze your presence and body language in real-time. Audio is processed locally and never stored.
          </p>

          {/* Trust items */}
          <div className="flex flex-col gap-2 mb-8">
            {TRUST_ITEMS.map((item, i) => (
              <div
                key={item.text}
                className="trust-row flex items-center gap-3.5 px-4 py-3 rounded-xl cursor-default"
                style={{
                  animationDelay: `${0.1 + i * 0.07}s`,
                  background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.8)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold leading-none mb-0.5"
                    style={{ color: isDark ? "rgba(248,250,252,0.85)" : "rgba(15,23,42,0.85)" }}
                  >
                    {item.text}
                  </p>
                  <p
                    className="text-[10px] leading-none"
                    style={{ color: isDark ? "rgba(100,116,139,0.8)" : "rgba(100,116,139,0.9)" }}
                  >
                    {item.detail}
                  </p>
                </div>
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: isDark ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.5)" }}
                />
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <span className="text-red-400 text-xs shrink-0 mt-0.5">⚠</span>
              <p className="text-[11px] font-medium text-red-400/80 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onAllow}
              className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-semibold text-white transition-all duration-200 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)",
                boxShadow: "0 4px 20px rgba(79,70,229,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                letterSpacing: "0.02em",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Grant Camera Access
            </button>

            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                color: isDark ? "rgba(148,163,184,0.7)" : "rgba(100,116,139,0.9)",
                letterSpacing: "0.02em",
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── RIGHT: Camera preview visual ─────────────────────────────── */}
        <div
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
          style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
        >
          <div
            className="cam-card relative w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden"
            style={{
              background: isDark ? "#0a0d16" : "#e8eaef",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              boxShadow: isDark
                ? "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
                : "0 32px 64px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            {/* Scan line */}
            <div
              className="absolute inset-x-0 h-16 pointer-events-none z-10"
              style={{
                background: `linear-gradient(to bottom, transparent, rgba(99,102,241,0.06), transparent)`,
                animation: "scan-line 4s linear infinite",
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              {/* Pulsing rings */}
              <div className="relative flex items-center justify-center mb-6">
                <div
                  className="absolute w-28 h-28 rounded-full"
                  style={{ border: "1px solid rgba(99,102,241,0.12)", animation: "float-slow 4s ease-in-out infinite" }}
                />
                <div
                  className="absolute w-20 h-20 rounded-full"
                  style={{ border: "1px solid rgba(99,102,241,0.08)", animation: "float-slow 4s ease-in-out 0.5s infinite" }}
                />

                {/* Camera icon */}
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))"
                      : "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))",
                    border: "1px solid rgba(99,102,241,0.2)",
                    boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
                    animation: "float-slow 4s ease-in-out 0.25s infinite",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>

              {/* Status chip */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: isDark ? "rgba(10,13,22,0.8)" : "rgba(232,234,239,0.8)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span
                  className="text-[9px] font-bold tracking-[3px] uppercase"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: isDark ? "rgba(99,102,241,0.9)" : "rgba(79,70,229,0.9)",
                  }}
                >
                  Awaiting Access
                </span>
              </div>
            </div>

            {/* Corner brackets — top left */}
            <div className="absolute top-4 left-4 z-30 pointer-events-none">
              <div className="w-5 h-5" style={{ borderTop: "1.5px solid rgba(99,102,241,0.4)", borderLeft: "1.5px solid rgba(99,102,241,0.4)", borderTopLeftRadius: 3 }} />
            </div>
            {/* top right */}
            <div className="absolute top-4 right-4 z-30 pointer-events-none">
              <div className="w-5 h-5" style={{ borderTop: "1.5px solid rgba(99,102,241,0.4)", borderRight: "1.5px solid rgba(99,102,241,0.4)", borderTopRightRadius: 3 }} />
            </div>
            {/* bottom left */}
            <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
              <div className="w-5 h-5" style={{ borderBottom: "1.5px solid rgba(99,102,241,0.4)", borderLeft: "1.5px solid rgba(99,102,241,0.4)", borderBottomLeftRadius: 3 }} />
            </div>
            {/* bottom right */}
            <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
              <div className="w-5 h-5" style={{ borderBottom: "1.5px solid rgba(99,102,241,0.4)", borderRight: "1.5px solid rgba(99,102,241,0.4)", borderBottomRightRadius: 3 }} />
            </div>

            {/* Bottom HUD strip */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between z-20"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
            >
              <span
                className="text-[8px] font-bold tracking-[2px] uppercase text-white/30"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Camera_Idle
              </span>
              <div className="flex gap-1">
                {[1,2,3].map(i => (
                  <div key={i} className="w-0.5 h-2 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};