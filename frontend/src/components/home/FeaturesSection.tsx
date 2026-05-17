

import { useTheme } from "../../context/ThemeContext";

export const FeaturesSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: "🧠",
      title: "NLP Behavioral Analysis",
      desc: "Real-time analysis of fluency, clarity, confidence, relevance and depth using advanced natural language processing.",
      tag: "Core",
      color: "#8b5cf6",
    },
    {
      icon: "🎙️",
      title: "Filler Word Detection",
      desc: "Identifies overused filler words like 'um', 'uh', 'like', 'basically' so you can eliminate them before the real interview.",
      tag: "NLP",
      color: "#ec4899",
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      desc: "Score trend charts across all sessions. See how your fluency, clarity and depth improve over time.",
      tag: "Analytics",
      color: "#10b981",
    },
    {
      icon: "🎯",
      title: "Role-Specific Questions",
      desc: "AI generates questions tailored to your role — from React hooks for Frontend to CAP theorem for System Design.",
      tag: "AI",
      color: "#f59e0b",
    },
    {
      icon: "🔥",
      title: "Streak & Performance",
      desc: "Track your daily practice streaks and maintain consistency. The platform rewards disciplined preparation.",
      tag: "Gamification",
      color: "#ef4444",
    },
    {
      icon: "💾",
      title: "Firebase-Backed History",
      desc: "Every answer, every question, every score — stored securely in Firebase and accessible from any device.",
      tag: "Storage",
      color: "#06b6d4",
    },
  ];

  return (
    <section 
      className={`relative py-24 transition-colors duration-500 overflow-hidden
        ${isDark ? "bg-[#030308]" : "bg-stone-50"}`}
    >
      {/* Background Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute right-[-10%] top-0 w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000
          ${isDark ? "bg-fuchsia-600/5" : "bg-fuchsia-500/10"}`} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className={`text-[10px] uppercase tracking-[0.3em] font-bold font-['Syne',sans-serif] px-4 py-1.5 rounded-full border
            ${isDark ? "text-violet-400 border-white/5 bg-white/5" : "text-violet-600 border-violet-100 bg-violet-50"}`}>
            Platform Features
          </span>
          <h2 className={`text-4xl lg:text-6xl font-black mt-6 font-['Syne',sans-serif] leading-tight tracking-tight
            ${isDark ? "text-white" : "text-stone-900"}`}>
            Everything You Need to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500">
              Ace Any Interview
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-[2rem] border p-8 transition-all duration-500 cursor-default
                ${isDark 
                  ? "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] shadow-2xl shadow-black/20" 
                  : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/50 shadow-sm"
                }`}
            >
              <div className="flex items-start justify-between mb-8">
                {/* Icon Container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                  style={{ 
                    background: isDark ? `${f.color}15` : `${f.color}10`, 
                    border: `1px solid ${f.color}30` 
                  }}
                >
                  {f.icon}
                </div>
                
                {/* Tag */}
                <span
                  className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest font-['Syne',sans-serif]"
                  style={{ 
                    background: isDark ? `${f.color}10` : `${f.color}05`, 
                    color: f.color, 
                    border: `1px solid ${f.color}30` 
                  }}
                >
                  {f.tag}
                </span>
              </div>

              <h3 className={`text-xl font-extrabold mb-3 font-['Syne',sans-serif] tracking-tight
                ${isDark ? "text-white" : "text-stone-900"}`}>
                {f.title}
              </h3>
              
              <p className={`text-sm leading-relaxed font-medium transition-colors mb-6
                ${isDark ? "text-stone-500 group-hover:text-stone-400" : "text-stone-500 group-hover:text-stone-600"}`}>
                {f.desc}
              </p>

              {/* Progress Bar (Hover Effect) */}
              <div className={`h-[2px] rounded-full overflow-hidden transition-all duration-500
                ${isDark ? "bg-white/5" : "bg-stone-100"}`}>
                <div
                  className="h-full rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"
                  style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                />
              </div>

              {/* Subtle background glow on hover */}
              <div 
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: f.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};