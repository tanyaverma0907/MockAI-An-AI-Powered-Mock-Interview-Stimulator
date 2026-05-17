
// import React, { useState, useEffect } from "react";
// import { ROLE_QUESTIONS } from "../../constants/roles";
// import type { RoleConfig } from "../../constants/roles";
// import type { InterviewMode } from "../../services/interviewService";
// import { useTheme } from "../../context/ThemeContext";

// interface IntroScreenProps {
//   roleData: RoleConfig;
//   questionCount: number;
//   interviewMode: InterviewMode;
//   useTyping: boolean;
//   onToggleTyping: () => void;
//   onBack: () => void;
//   onNext: () => void;
// }

// const FEATURES = [
//   { label: "Voice-first", desc: "Natural conversation flow", icon: "🎙️" },
//   { label: "Adaptive probing", desc: "AI-driven deep dives", icon: "🧠" },
//   { label: "STAR analysis", desc: "Structured performance metrics", icon: "📈" },
// ];

// // ── AI Greeting Modal ────────────────────────────────────────────────────────
// const GreetingModal: React.FC<{
//   roleData: RoleConfig;
//   questionCount: number;
//   interviewMode: InterviewMode;
//   isDark: boolean;
//   onProceed: () => void;
// }> = ({ roleData, questionCount, interviewMode, isDark, onProceed }) => {
//   const [displayedText, setDisplayedText] = useState("");
//   const [isTypingDone, setIsTypingDone] = useState(false);

//   const greetingText = `Hello! 👋 I'm your AI interviewer today. We'll be doing a ${roleData.label} interview with ${questionCount} questions in ${interviewMode} mode.\n\nTake a deep breath — there are no trick questions here. Just speak naturally, be specific with examples, and structure your answers using the STAR method when possible.\n\nI'm here to help you grow. Ready when you are! 🚀`;

//   useEffect(() => {
//     let i = 0;
//     setDisplayedText("");
//     setIsTypingDone(false);

//     const interval = setInterval(() => {
//       if (i < greetingText.length) {
//         setDisplayedText(greetingText.slice(0, i + 1));
//         i++;
//       } else {
//         setIsTypingDone(true);
//         clearInterval(interval);
//       }
//     }, 18);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4"
//       style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
//     >
//       <div
//         className="w-full max-w-lg rounded-3xl p-8 relative overflow-hidden"
//         style={{
//           background: isDark
//             ? "linear-gradient(135deg, #0d111c, #0a0d18)"
//             : "linear-gradient(135deg, #ffffff, #f8f9ff)",
//           border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
//           boxShadow: isDark
//             ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
//             : "0 32px 80px rgba(0,0,0,0.12)",
//           animation: "greet-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
//         }}
//       >
//         <style>{`
//           @keyframes greet-in {
//             from { opacity: 0; transform: scale(0.94) translateY(12px); }
//             to   { opacity: 1; transform: scale(1) translateY(0); }
//           }
//           @keyframes cursor-blink {
//             0%,100% { opacity: 1; } 50% { opacity: 0; }
//           }
//         `}</style>

//         {/* Top glow */}
//         <div
//           className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-24 rounded-full pointer-events-none"
//           style={{
//             background: `radial-gradient(ellipse, ${roleData.color}40, transparent)`,
//             filter: "blur(30px)",
//           }}
//         />

//         {/* AI Avatar */}
//         <div className="flex items-center gap-4 mb-6 relative z-10">
//           <div
//             className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
//             style={{
//               background: `linear-gradient(135deg, rgba(${roleData.accentRgb},0.2), rgba(${roleData.accentRgb},0.06))`,
//               border: `1px solid rgba(${roleData.accentRgb},0.3)`,
//               boxShadow: `0 0 24px rgba(${roleData.accentRgb},0.2)`,
//             }}
//           >
//             🤖
//           </div>
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span
//                 className="text-[9px] font-bold tracking-[3px] uppercase"
//                 style={{
//                   fontFamily: "'DM Mono', monospace",
//                   color: isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.7)",
//                 }}
//               >
//                 AI Interviewer
//               </span>
//               <span
//                 className="px-2 py-0.5 rounded-full text-[8px] font-bold"
//                 style={{
//                   background: `rgba(${roleData.accentRgb},0.12)`,
//                   color: roleData.color,
//                   border: `1px solid rgba(${roleData.accentRgb},0.2)`,
//                   fontFamily: "'DM Mono', monospace",
//                 }}
//               >
//                 {roleData.label}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//               <span
//                 className="text-[9px] font-bold text-emerald-400"
//                 style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}
//               >
//                 Online · Ready
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Greeting text with typewriter effect */}
//         <div
//           className="relative z-10 rounded-2xl p-5 mb-6 min-h-[160px]"
//           style={{
//             background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
//             border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
//           }}
//         >
//           <p
//             className="text-sm leading-7"
//             style={{
//               color: isDark ? "rgba(248,250,252,0.85)" : "rgba(15,23,42,0.85)",
//               fontFamily: "'DM Sans', sans-serif",
//               whiteSpace: "pre-line",
//             }}
//           >
//             {displayedText}
//             {!isTypingDone && (
//               <span
//                 className="inline-block w-0.5 h-4 ml-0.5 rounded-sm align-middle"
//                 style={{
//                   background: roleData.color,
//                   animation: "cursor-blink 0.8s ease-in-out infinite",
//                 }}
//               />
//             )}
//           </p>
//         </div>

//         {/* Session info pills */}
//         <div className="flex gap-2 mb-6 relative z-10 flex-wrap">
//           {[
//             { label: `${questionCount} Questions`, icon: "❓" },
//             { label: interviewMode === "strict" ? "Strict Mode" : "Normal Mode", icon: interviewMode === "strict" ? "⚡" : "✅" },
//             { label: roleData.label, icon: roleData.emoji },
//           ].map((pill) => (
//             <div
//               key={pill.label}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
//               style={{
//                 background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
//                 border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
//                 color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)",
//                 fontFamily: "'DM Mono', monospace",
//               }}
//             >
//               <span>{pill.icon}</span>
//               <span>{pill.label}</span>
//             </div>
//           ))}
//         </div>

//         {/* CTA Button */}
//         <button
//           onClick={onProceed}
//           disabled={!isTypingDone}
//           className="relative z-10 w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300"
//           style={{
//             background: isTypingDone
//               ? `linear-gradient(135deg, ${roleData.color}, #6d28d9)`
//               : isDark
//                 ? "rgba(255,255,255,0.05)"
//                 : "rgba(0,0,0,0.05)",
//             color: isTypingDone ? "white" : isDark ? "#374151" : "#9ca3af",
//             boxShadow: isTypingDone
//               ? `0 8px 28px rgba(${roleData.accentRgb},0.35)`
//               : "none",
//             cursor: isTypingDone ? "pointer" : "not-allowed",
//             letterSpacing: "0.05em",
//           }}
//         >
//           {isTypingDone ? "I'm Ready — Let's Begin 🎯" : "Please wait…"}
//         </button>
//       </div>
//     </div>
//   );
// };

// // ── Main IntroScreen ──────────────────────────────────────────────────────────
// export const IntroScreen: React.FC<IntroScreenProps> = ({
//   roleData,
//   questionCount,
//   interviewMode,
//   useTyping,
//   onToggleTyping,
//   onBack,
//   onNext,
// }) => {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [showGreeting, setShowGreeting] = useState(false);

//   return (
//     <>
//       {/* ── Greeting Modal ── */}
//       {showGreeting && (
//         <GreetingModal
//           roleData={roleData}
//           questionCount={questionCount}
//           interviewMode={interviewMode}
//           isDark={isDark}
//           onProceed={() => {
//             setShowGreeting(false);
//             onNext(); // proceeds to camera permission
//           }}
//         />
//       )}

//       {/* ── Main Layout ── */}
//       <div
//         className={`min-h-screen flex flex-col lg:flex-row font-['DM Sans',sans-serif] transition-colors duration-500 ${
//           isDark ? "bg-[#030308] text-white" : "bg-white text-slate-900"
//         }`}
//       >
//         {/* ── LEFT SIDE: Branding Stage ── */}
//         <div
//           className={`hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center border-r pt-32 transition-colors duration-500 ${
//             isDark ? "bg-[#060612] border-white/5" : "bg-slate-50 border-slate-200"
//           }`}
//         >
//           <div
//             className="absolute top-0 left-0 w-full h-full blur-[120px] rounded-full transition-opacity duration-1000 opacity-20"
//             style={{ backgroundColor: roleData.color }}
//           />

//           <div className="relative z-10 px-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
//             <div className="mb-10 inline-block">
//               <div
//                 className={`w-64 h-64 rounded-[2.5rem] border flex items-center justify-center relative group transition-all duration-500 shadow-2xl ${
//                   isDark ? "bg-[#1a1333] border-white/10" : "bg-white border-slate-200"
//                 }`}
//               >
//                 <span className="text-9xl transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl">
//                   🤖
//                 </span>
//                 <div
//                   className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
//                   style={{
//                     backgroundImage: `radial-gradient(circle, ${roleData.color} 1px, transparent 1px)`,
//                     backgroundSize: "24px 24px",
//                   }}
//                 />
//                 <div className="absolute -bottom-4 px-6 py-2 rounded-full bg-black border border-white/10 flex items-center gap-3 shadow-2xl">
//                   <div
//                     className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_#fff]"
//                     style={{ backgroundColor: roleData.color }}
//                   />
//                   <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">
//                     Ready_Session
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <h1 className="text-5xl font-black font-['Syne'] tracking-tighter mb-4 leading-none">
//               Master the <br />
//               <span
//                 className="text-transparent bg-clip-text"
//                 style={{
//                   backgroundImage: `linear-gradient(to r, ${roleData.color}, #8b5cf6)`,
//                 }}
//               >
//                 {roleData.label}.
//               </span>
//             </h1>
//             <p
//               className={`${
//                 isDark ? "text-gray-500" : "text-slate-500"
//               } max-w-sm mx-auto leading-relaxed font-medium`}
//             >
//               Your high-fidelity simulation is prepared. Step into your{" "}
//               {roleData.label} role and begin.
//             </p>
//           </div>
//         </div>

//         {/* ── RIGHT SIDE: Session Configuration ── */}
//         <div className="w-full lg:w-1/2 flex justify-center p-8 sm:p-12 pt-24 lg:pt-32">
//           <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
//             <div className="mb-10 flex items-center gap-4">
//               <span
//                 className={`text-[10px] font-black uppercase tracking-[0.4em] ${
//                   isDark ? "text-gray-500" : "text-slate-400"
//                 }`}
//               >
//                 Protocol_Config
//               </span>
//               <div
//                 className={`h-[1px] flex-1 ${isDark ? "bg-white/5" : "bg-slate-200"}`}
//               />
//             </div>

//             <div className="space-y-8">
//               {/* Mode & Question Stats */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div
//                   className={`p-6 rounded-3xl border transition-all ${
//                     isDark
//                       ? "bg-white/[0.02] border-white/5"
//                       : "bg-slate-50 border-slate-100"
//                   }`}
//                 >
//                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
//                     Mode
//                   </p>
//                   <p className="text-lg font-black uppercase tracking-tight">
//                     {interviewMode}
//                   </p>
//                 </div>
//                 <div
//                   className={`p-6 rounded-3xl border transition-all ${
//                     isDark
//                       ? "bg-white/[0.02] border-white/5"
//                       : "bg-slate-50 border-slate-100"
//                   }`}
//                 >
//                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
//                     Scope
//                   </p>
//                   <p className="text-lg font-black uppercase tracking-tight">
//                     {questionCount} Qs
//                   </p>
//                 </div>
//               </div>

//               {/* Feature Highlights */}
//               <div className="space-y-3">
//                 {FEATURES.map((f) => (
//                   <div
//                     key={f.label}
//                     className={`p-4 rounded-2xl border flex items-center gap-5 transition-all ${
//                       isDark
//                         ? "bg-[#0a0a15] border-white/5"
//                         : "bg-white border-slate-200 shadow-sm"
//                     }`}
//                   >
//                     <div className="text-xl">{f.icon}</div>
//                     <div>
//                       <p className="text-xs font-black uppercase tracking-wider opacity-90">
//                         {f.label}
//                       </p>
//                       <p
//                         className={`text-[11px] font-medium ${
//                           isDark ? "text-gray-500" : "text-slate-500"
//                         }`}
//                       >
//                         {f.desc}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Input Preference Toggle */}
//               <div
//                 onClick={onToggleTyping}
//                 className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex items-center justify-between ${
//                   useTyping
//                     ? "border-violet-500/50 bg-violet-500/5"
//                     : "border-white/5 bg-transparent hover:bg-white/[0.02]"
//                 }`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
//                       useTyping ? "bg-violet-600 shadow-lg shadow-violet-900/40" : "bg-white/5"
//                     }`}
//                   >
//                     {useTyping ? "⌨️" : "🎙️"}
//                   </div>
//                   <div>
//                     <p className="text-sm font-black uppercase tracking-tight">
//                       {useTyping ? "Keyboard Mode" : "Voice Mode"}
//                     </p>
//                     <p className="text-[10px] font-bold text-slate-500 uppercase">
//                       Recommended for speed
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
//                     useTyping ? "border-violet-500 bg-violet-500" : "border-white/10"
//                   }`}
//                 >
//                   {useTyping && (
//                     <span className="text-[10px] font-bold text-white">✓</span>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="pt-4 space-y-4">
//                 {/* ── Changed: onClick now shows greeting instead of going straight to onNext ── */}
//                 <button
//                   onClick={() => setShowGreeting(true)}
//                   className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98]"
//                   style={{
//                     background: `linear-gradient(135deg, ${roleData.color} 0%, #000 150%)`,
//                   }}
//                 >
//                   Start Simulation
//                 </button>

//                 <button
//                   onClick={onBack}
//                   className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-100 ${
//                     isDark ? "text-gray-600" : "text-slate-400"
//                   }`}
//                 >
//                   Change Career Path
//                 </button>
//               </div>
//             </div>

//             <p className="mt-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-40">
//               Powered by MockAI Neural Engine v2.0
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };









import React, { useState, useEffect } from "react";
import { ROLE_QUESTIONS } from "../../constants/roles";
import type { RoleConfig } from "../../constants/roles";
import type { InterviewMode } from "../../services/interviewService";
import { useTheme } from "../../context/ThemeContext";

interface IntroScreenProps {
  roleData: RoleConfig;
  questionCount: number;
  interviewMode: InterviewMode;
  useTyping: boolean;
  onToggleTyping: () => void;
  onBack: () => void;
  onNext: () => void;
}

const FEATURES = [
  { label: "Voice-first", desc: "Natural conversation flow", icon: "🎙️" },
  { label: "Adaptive probing", desc: "AI-driven deep dives", icon: "🧠" },
  { label: "STAR analysis", desc: "Structured performance metrics", icon: "📈" },
];

const BACKEND_URL = "http://localhost:5000";

// ── AI Greeting Modal ────────────────────────────────────────────────────────
const GreetingModal: React.FC<{
  roleData: RoleConfig;
  questionCount: number;
  interviewMode: InterviewMode;
  isDark: boolean;
  onProceed: () => void;
}> = ({ roleData, questionCount, interviewMode, isDark, onProceed }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const FALLBACK_GREETING = `Hello! 👋 I'm your AI interviewer today. We'll be doing a ${roleData.label} interview with ${questionCount} questions in ${interviewMode} mode.\n\nTake a deep breath — there are no trick questions here. Just speak naturally, be specific with examples, and structure your answers using the STAR method when possible.\n\nI'm here to help you grow. Ready when you are! 🚀`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Step 1: Fetch greeting from Groq via backend
      let greetingText = FALLBACK_GREETING;

      try {
        const res = await fetch(`${BACKEND_URL}/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // route validation requires these fields; send dummies for intro mode
            question: "-",
            answer: "-",
            role: roleData.label,
            questionCount,
            interviewMode,
            mode: "intro",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.greeting && data.greeting.trim().length > 10) {
            greetingText = data.greeting;
          }
        }
      } catch (err) {
        console.warn("⚠️ Greeting fetch failed, using fallback:", err);
      }

      if (cancelled) return;
      setIsLoading(false);

      // Step 2: Typewriter animation
      let i = 0;
      const interval = setInterval(() => {
        if (cancelled) return clearInterval(interval);
        if (i < greetingText.length) {
          setDisplayedText(greetingText.slice(0, i + 1));
          i++;
        } else {
          setIsTypingDone(true);
          clearInterval(interval);
        }
      }, 18);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #0d111c, #0a0d18)"
            : "linear-gradient(135deg, #ffffff, #f8f9ff)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: isDark
            ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 32px 80px rgba(0,0,0,0.12)",
          animation: "greet-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        <style>{`
          @keyframes greet-in {
            from { opacity: 0; transform: scale(0.94) translateY(12px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes cursor-blink {
            0%,100% { opacity: 1; } 50% { opacity: 0; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        {/* Top glow */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-24 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${roleData.color}40, transparent)`,
            filter: "blur(30px)",
          }}
        />

        {/* AI Avatar */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{
              background: `linear-gradient(135deg, rgba(${roleData.accentRgb},0.2), rgba(${roleData.accentRgb},0.06))`,
              border: `1px solid rgba(${roleData.accentRgb},0.3)`,
              boxShadow: `0 0 24px rgba(${roleData.accentRgb},0.2)`,
            }}
          >
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-bold tracking-[3px] uppercase"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: isDark ? "rgba(148,163,184,0.6)" : "rgba(100,116,139,0.7)",
                }}
              >
                AI Interviewer
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[8px] font-bold"
                style={{
                  background: `rgba(${roleData.accentRgb},0.12)`,
                  color: roleData.color,
                  border: `1px solid rgba(${roleData.accentRgb},0.2)`,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {roleData.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: isLoading ? "#f59e0b" : "#34d399" }}
              />
              <span
                className="text-[9px] font-bold"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.1em",
                  color: isLoading ? "#f59e0b" : "#34d399",
                }}
              >
                {isLoading ? "Connecting…" : "Online · Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Greeting text box */}
        <div
          className="relative z-10 rounded-2xl p-5 mb-6 min-h-[160px] flex items-start"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          {isLoading ? (
            /* Loading skeleton */
            <div className="w-full space-y-3 pt-1">
              {[100, 85, 70, 90, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full"
                  style={{
                    width: `${w}%`,
                    background: isDark
                      ? "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)"
                      : "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.04) 75%)",
                    backgroundSize: "200% auto",
                    animation: `shimmer 1.4s linear infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
              <p
                className="text-[10px] font-semibold pt-1"
                style={{
                  color: isDark ? "rgba(148,163,184,0.4)" : "rgba(100,116,139,0.5)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Generating your personalised greeting…
              </p>
            </div>
          ) : (
            <p
              className="text-sm leading-7"
              style={{
                color: isDark ? "rgba(248,250,252,0.85)" : "rgba(15,23,42,0.85)",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "pre-line",
              }}
            >
              {displayedText}
              {!isTypingDone && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 rounded-sm align-middle"
                  style={{
                    background: roleData.color,
                    animation: "cursor-blink 0.8s ease-in-out infinite",
                  }}
                />
              )}
            </p>
          )}
        </div>

        {/* Session info pills */}
        <div className="flex gap-2 mb-6 relative z-10 flex-wrap">
          {[
            { label: `${questionCount} Questions`, icon: "❓" },
            {
              label: interviewMode === "strict" ? "Strict Mode" : "Normal Mode",
              icon: interviewMode === "strict" ? "⚡" : "✅",
            },
            { label: roleData.label, icon: roleData.emoji },
          ].map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                color: isDark ? "rgba(148,163,184,0.8)" : "rgba(71,85,105,0.8)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onProceed}
          disabled={!isTypingDone}
          className="relative z-10 w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300"
          style={{
            background: isTypingDone
              ? `linear-gradient(135deg, ${roleData.color}, #6d28d9)`
              : isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
            color: isTypingDone ? "white" : isDark ? "#374151" : "#9ca3af",
            boxShadow: isTypingDone
              ? `0 8px 28px rgba(${roleData.accentRgb},0.35)`
              : "none",
            cursor: isTypingDone ? "pointer" : "not-allowed",
            letterSpacing: "0.05em",
          }}
        >
          {isLoading
            ? "Loading your session…"
            : isTypingDone
            ? "I'm Ready — Let's Begin 🎯"
            : "Please wait…"}
        </button>
      </div>
    </div>
  );
};

// ── Main IntroScreen ──────────────────────────────────────────────────────────
export const IntroScreen: React.FC<IntroScreenProps> = ({
  roleData,
  questionCount,
  interviewMode,
  useTyping,
  onToggleTyping,
  onBack,
  onNext,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showGreeting, setShowGreeting] = useState(false);

  return (
    <>
      {/* ── Greeting Modal ── */}
      {showGreeting && (
        <GreetingModal
          roleData={roleData}
          questionCount={questionCount}
          interviewMode={interviewMode}
          isDark={isDark}
          onProceed={() => {
            setShowGreeting(false);
            onNext();
          }}
        />
      )}

      {/* ── Main Layout ── */}
      <div
        className={`min-h-screen flex flex-col lg:flex-row font-['DM Sans',sans-serif] transition-colors duration-500 ${
          isDark ? "bg-[#030308] text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* ── LEFT SIDE: Branding Stage ── */}
        <div
          className={`hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center border-r pt-32 transition-colors duration-500 ${
            isDark ? "bg-[#060612] border-white/5" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div
            className="absolute top-0 left-0 w-full h-full blur-[120px] rounded-full transition-opacity duration-1000 opacity-20"
            style={{ backgroundColor: roleData.color }}
          />

          <div className="relative z-10 px-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-10 inline-block">
              <div
                className={`w-64 h-64 rounded-[2.5rem] border flex items-center justify-center relative group transition-all duration-500 shadow-2xl ${
                  isDark ? "bg-[#1a1333] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-9xl transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl">
                  🤖
                </span>
                <div
                  className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${roleData.color} 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute -bottom-4 px-6 py-2 rounded-full bg-black border border-white/10 flex items-center gap-3 shadow-2xl">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_#fff]"
                    style={{ backgroundColor: roleData.color }}
                  />
                  <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase">
                    Ready_Session
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-black font-['Syne'] tracking-tighter mb-4 leading-none">
              Master the <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to r, ${roleData.color}, #8b5cf6)`,
                }}
              >
                {roleData.label}.
              </span>
            </h1>
            <p
              className={`${
                isDark ? "text-gray-500" : "text-slate-500"
              } max-w-sm mx-auto leading-relaxed font-medium`}
            >
              Your high-fidelity simulation is prepared. Step into your{" "}
              {roleData.label} role and begin.
            </p>
          </div>
        </div>

        {/* ── RIGHT SIDE: Session Configuration ── */}
        <div className="w-full lg:w-1/2 flex justify-center p-8 sm:p-12 pt-24 lg:pt-32">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="mb-10 flex items-center gap-4">
              <span
                className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                  isDark ? "text-gray-500" : "text-slate-400"
                }`}
              >
                Protocol_Config
              </span>
              <div
                className={`h-[1px] flex-1 ${isDark ? "bg-white/5" : "bg-slate-200"}`}
              />
            </div>

            <div className="space-y-8">
              {/* Mode & Question Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? "bg-white/[0.02] border-white/5"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Mode
                  </p>
                  <p className="text-lg font-black uppercase tracking-tight">
                    {interviewMode}
                  </p>
                </div>
                <div
                  className={`p-6 rounded-3xl border transition-all ${
                    isDark
                      ? "bg-white/[0.02] border-white/5"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Scope
                  </p>
                  <p className="text-lg font-black uppercase tracking-tight">
                    {questionCount} Qs
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3">
                {FEATURES.map((f) => (
                  <div
                    key={f.label}
                    className={`p-4 rounded-2xl border flex items-center gap-5 transition-all ${
                      isDark
                        ? "bg-[#0a0a15] border-white/5"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    <div className="text-xl">{f.icon}</div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider opacity-90">
                        {f.label}
                      </p>
                      <p
                        className={`text-[11px] font-medium ${
                          isDark ? "text-gray-500" : "text-slate-500"
                        }`}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Preference Toggle */}
              <div
                onClick={onToggleTyping}
                className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex items-center justify-between ${
                  useTyping
                    ? "border-violet-500/50 bg-violet-500/5"
                    : "border-white/5 bg-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      useTyping ? "bg-violet-600 shadow-lg shadow-violet-900/40" : "bg-white/5"
                    }`}
                  >
                    {useTyping ? "⌨️" : "🎙️"}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">
                      {useTyping ? "Keyboard Mode" : "Voice Mode"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      Recommended for speed
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                    useTyping ? "border-violet-500 bg-violet-500" : "border-white/10"
                  }`}
                >
                  {useTyping && (
                    <span className="text-[10px] font-bold text-white">✓</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-4">
                <button
                  onClick={() => setShowGreeting(true)}
                  className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${roleData.color} 0%, #000 150%)`,
                  }}
                >
                  Start Simulation
                </button>

                <button
                  onClick={onBack}
                  className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-100 ${
                    isDark ? "text-gray-600" : "text-slate-400"
                  }`}
                >
                  Change Career Path
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-40">
              Powered by MockAI Neural Engine v2.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

