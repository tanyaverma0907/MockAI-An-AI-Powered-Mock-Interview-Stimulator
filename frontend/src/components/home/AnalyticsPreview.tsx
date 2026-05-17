
import { useTheme } from "../../context/ThemeContext";

export const AnalyticsPreview = () => {
  // Yahan check karein ki context return kya kar raha hai
  const context = useTheme();
  const theme = context?.theme || "dark";
  const isDark = theme === "dark";

  const bars = [
    { label: "Clarity", val: 82, color: "#8b5cf6" },
    { label: "Fluency", val: 74, color: "#06b6d4" },
    { label: "Confidence", val: 68, color: "#10b981" },
    { label: "Relevance", val: 88, color: "#f59e0b" },
    { label: "Depth", val: 61, color: "#ec4899" },
  ];

  const trend = [45, 52, 48, 61, 67, 72, 74, 82];

  return (
    <section 
      className={`relative py-24 transition-colors duration-500 overflow-hidden ${
        isDark ? "bg-[#030308]" : "bg-white"
      }`}
    >
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute left-[-10%] bottom-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000 ${
          isDark ? "bg-violet-600/5 opacity-100" : "bg-violet-500/10 opacity-70"
        }`} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="space-y-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md ${
              isDark ? "text-violet-400 border-white/5 bg-white/5" : "text-violet-600 border-violet-100 bg-violet-50"
            }`}>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold font-['Syne',sans-serif]">Analytics Preview</span>
            </div>
            
            <h2 className={`text-4xl lg:text-6xl font-black font-['Syne',sans-serif] leading-[1.1] tracking-tight ${
              isDark ? "text-white" : "text-stone-900"
            }`}>
              Deep Behavioral<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-cyan-500 to-indigo-500">
                Metrics Dashboard
              </span>
            </h2>
            
            <p className={`text-lg leading-relaxed font-medium transition-colors max-w-md ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}>
              After every interview, our NLP engine breaks down your performance into five key dimensions 
              and tracks your trajectory over time.
            </p>

            <ul className="space-y-4">
              {["Per-session NLP score breakdown", "Filler word frequency heatmap", "Score trend over last 8 sessions"].map(item => (
                <li key={item} className={`flex items-center gap-4 text-sm font-semibold transition-colors ${
                  isDark ? "text-stone-300" : "text-stone-700"
                }`}>
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                    isDark ? "bg-violet-500/10 border-white/5" : "bg-violet-50 border-violet-100"
                  }`}>
                    <svg className={`w-3.5 h-3.5 ${isDark ? "text-violet-400" : "text-violet-600"}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Mock Dashboard Widget */}
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-[2.5rem] blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-50 ${
              isDark ? "bg-violet-600/10" : "bg-violet-500/5"
            }`} />
            
            <div className={`relative rounded-[2.5rem] border p-8 space-y-8 backdrop-blur-xl transition-all duration-500 ${
              isDark 
                ? "bg-white/[0.03] border-white/10 shadow-2xl shadow-black/40" 
                : "bg-white border-stone-200 shadow-xl shadow-stone-200/50"
            }`}>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                    isDark ? "text-stone-500" : "text-stone-400"
                  }`}>Latest Session</p>
                  <p className={`text-xl font-black font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
                    Frontend Interview
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-emerald-500 font-['Syne',sans-serif]">82%</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-stone-500" : "text-stone-400"}`}>Overall Score</p>
                </div>
              </div>

              <div className="grid gap-5">
                {bars.map((b) => (
                  <div key={b.label} className="group/bar">
                    <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-tighter">
                      <span className={isDark ? "text-stone-400" : "text-stone-500"}>{b.label}</span>
                      <span style={{ color: b.color }}>{b.val}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden transition-colors ${isDark ? "bg-white/5" : "bg-stone-100"}`}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 group-hover/bar:brightness-110"
                        style={{ width: `${b.val}%`, background: b.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? "bg-black/20 border-white/5" : "bg-stone-50 border-stone-100"}`}>
                <div className="flex items-end gap-1.5 h-20">
                  {trend.map((v, i) => (
                    <div 
                      key={i} 
                      className="flex-1 rounded-t-md transition-all duration-700 relative group/item"
                      style={{
                        height: `${v}%`,
                        background: i === trend.length - 1
                          ? "#8b5cf6"
                          : isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.25)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};