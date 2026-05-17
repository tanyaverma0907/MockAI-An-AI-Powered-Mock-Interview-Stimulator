

import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export const DemoSection = () => {
  const [activeQ, setActiveQ] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const demoFlow = [
    {
      role: "Frontend",
      question: "Explain the difference between useMemo and useCallback in React, and when would you prefer one over the other?",
      answer: "useMemo memoizes the return value of a function — useful for expensive calculations. useCallback memoizes the function reference itself — useful when passing callbacks to child components.",
      scores: { clarity: 88, fluency: 82, depth: 79 },
    },
    {
      role: "DSA",
      question: "Walk me through how you'd find the longest palindromic substring in a string. What's the time complexity?",
      answer: "I'd use the expand-around-center approach. For each character, I expand outward checking if characters match. Time: O(n²), Space: O(1).",
      scores: { clarity: 91, fluency: 85, depth: 88 },
    },
    {
      role: "HR",
      question: "Describe a situation where you had to work with a difficult team member. How did you handle it?",
      answer: "I scheduled a private 1:1 to understand their blockers. Turned out they were overwhelmed. We redistributed tasks and delivered on time.",
      scores: { clarity: 85, fluency: 90, depth: 75 },
    },
  ];

  const current = demoFlow[activeQ];

  return (
    <section className={`relative py-24 transition-colors duration-500 overflow-hidden ${
      isDark ? "bg-[#030308]" : "bg-stone-50"
    }`}>
      {/* Decorative background element */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none ${
        isDark ? "bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_70%)]" : "bg-[radial-gradient(circle_at_center,_#ddd6fe_0%,_transparent_70%)]"
      }`} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border mb-4 ${
            isDark ? "bg-white/5 border-white/10 text-violet-400" : "bg-violet-100 border-violet-200 text-violet-700"
          }`}>
            Experience the AI
          </span>
          <h2 className={`text-4xl lg:text-6xl font-black font-['Syne',sans-serif] tracking-tighter leading-none ${
            isDark ? "text-white" : "text-stone-900"
          }`}>
            See MockAI in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 text-glow">Action</span>
          </h2>
        </div>

        {/* Dynamic Tabs */}
        <div className={`flex gap-1 p-1 rounded-2xl max-w-sm mx-auto mb-10 border transition-all ${
          isDark ? "bg-white/5 border-white/10" : "bg-stone-200/50 border-stone-200"
        }`}>
          {demoFlow.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveQ(i)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-['Syne',sans-serif] transition-all duration-300 ${
                activeQ === i
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                  : isDark ? "text-stone-500 hover:text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {d.role}
            </button>
          ))}
        </div>

        {/* Interview Interface */}
        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-2xl ${
          isDark 
            ? "bg-[#0a0a12] border-white/10 shadow-black/60" 
            : "bg-white border-stone-200 shadow-stone-200/50"
        }`}>
          
          {/* Window Header */}
          <div className={`px-6 py-4 flex items-center justify-between border-b ${
            isDark ? "bg-white/5 border-white/5" : "bg-stone-50 border-stone-100"
          }`}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-stone-500" : "text-stone-400"}`}>
              Session: {current.role} • 00:42
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Live NLP</span>
            </div>
          </div>

          {/* Chat Content */}
          <div className="p-8 space-y-8">
            
            {/* Question (AI) */}
            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-violet-600/20 shrink-0">
                AI
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl rounded-tl-none font-medium text-sm leading-relaxed ${
                isDark ? "bg-white/5 text-stone-200 border border-white/5" : "bg-violet-50 text-stone-800 border border-violet-100"
              }`}>
                {current.question}
              </div>
            </div>

            {/* Answer (User) */}
            <div className="flex gap-4 justify-end">
              <div className={`max-w-[80%] p-5 rounded-3xl rounded-tr-none font-medium text-sm leading-relaxed shadow-sm ${
                isDark ? "bg-violet-600/10 text-stone-300 border border-violet-500/20" : "bg-white text-stone-700 border border-stone-200"
              }`}>
                {current.answer}
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-md shrink-0 ${
                isDark ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-600"
              }`}>
                YOU
              </div>
            </div>

            {/* Real-time Result Card */}
            <div className={`mt-8 p-6 rounded-[2rem] border transition-all duration-700 ${
              isDark 
                ? "bg-emerald-500/[0.03] border-emerald-500/20" 
                : "bg-emerald-50 border-emerald-200/50"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"}`}>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  Behavioral Analytics
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {Object.entries(current.scores).map(([key, val]) => (
                  <div key={key} className="text-center group">
                    <div className={`text-3xl font-black font-['Syne',sans-serif] mb-1 transition-transform group-hover:scale-110 ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}>
                      {val}%
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      {key}
                    </div>
                    {/* Tiny Progress Bar */}
                    <div className={`h-1 w-8 mx-auto mt-2 rounded-full ${isDark ? "bg-white/10" : "bg-stone-200"}`}>
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};