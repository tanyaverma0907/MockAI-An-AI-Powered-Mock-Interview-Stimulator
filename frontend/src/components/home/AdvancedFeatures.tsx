

import { useTheme } from "../../context/ThemeContext";

export const AdvancedFeatures = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: "⚡",
      title: "Real-time Scoring",
      desc: "NLP scoring happens instantly after each answer — no waiting, no batch processing.",
      color: "#f59e0b",
    },
    {
      icon: "🔄",
      title: "Adaptive Difficulty",
      desc: "AI escalates question complexity based on how well you're answering in the session.",
      color: "#8b5cf6",
    },
    {
      icon: "📱",
      title: "Cross-device Sync",
      desc: "Your interview history and analytics sync instantly across all your devices via Firebase.",
      color: "#06b6d4",
    },
    {
      icon: "🛡️",
      title: "Secure & Private",
      desc: "All data is stored with Firebase Auth protection. Your interview data is never shared.",
      color: "#10b981",
    },
    {
      icon: "🌐",
      title: "Offline Mode",
      desc: "Practice even without internet. Answers are queued and synced when you reconnect.",
      color: "#ec4899",
    },
    {
      icon: "📤",
      title: "Export Reports",
      desc: "Download your performance reports as PDF to share with mentors or track offline.",
      color: "#ef4444",
    },
  ];

  return (
    <section className={`relative py-24 transition-colors duration-500 overflow-hidden ${
      isDark ? "bg-[#030308]" : "bg-white"
    }`}>
      
      {/* Background radial glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none blur-[120px] ${
        isDark ? "bg-violet-900/30" : "bg-violet-100"
      }`} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className={`text-[10px] uppercase font-bold tracking-[0.3em] font-['Syne',sans-serif] px-4 py-1.5 rounded-full border mb-6 inline-block ${
            isDark ? "text-violet-400 border-white/5 bg-white/5" : "text-violet-600 border-violet-100 bg-violet-50"
          }`}>
            Core Capabilities
          </span>
          <h2 className={`text-4xl lg:text-6xl font-black font-['Syne',sans-serif] leading-tight tracking-tight ${
            isDark ? "text-white" : "text-stone-900"
          }`}>
            Built for Serious<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500">
              Preparation.
            </span>
          </h2>
        </div>

        {/* The Modern Grid Layout */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-[2.5rem] overflow-hidden border transition-colors ${
          isDark ? "bg-white/10 border-white/10" : "bg-stone-200 border-stone-200 shadow-xl shadow-stone-200/40"
        }`}>
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-10 transition-all duration-500 group relative overflow-hidden ${
                isDark ? "bg-[#06060f] hover:bg-[#090915]" : "bg-white hover:bg-stone-50"
              }`}
            >
              {/* Subtle hover icon glow */}
              <div 
                className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: f.color }}
              />

              <div className="relative z-10">
                <div 
                  className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-2xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ 
                    background: isDark ? `${f.color}15` : `${f.color}10`, 
                    border: `1px solid ${f.color}30` 
                  }}
                >
                  {f.icon}
                </div>
                
                <h3 className={`text-lg font-extrabold mb-3 font-['Syne',sans-serif] tracking-tight transition-colors ${
                  isDark ? "text-white group-hover:text-violet-400" : "text-stone-900 group-hover:text-violet-600"
                }`}>
                  {f.title}
                </h3>
                
                <p className={`text-sm leading-relaxed transition-colors ${
                  isDark ? "text-stone-500 group-hover:text-stone-400" : "text-stone-500 group-hover:text-stone-600"
                }`}>
                  {f.desc}
                </p>
              </div>

              {/* Modern "Bottom Line" decoration */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                <div 
                  className="h-full w-full" 
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};