
import { useTheme } from "../../context/ThemeContext";

export const BenefitsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const benefits = [
    {
      metric: "3×",
      label: "More Confident",
      desc: "Users report exponential confidence growth after 5 MockAI sessions.",
      icon: "💪",
      color: "from-violet-500 to-indigo-500",
    },
    {
      metric: "68%",
      label: "Offer Rate",
      desc: "Success stories of users landing dream roles within 90 days of practice.",
      icon: "🎉",
      color: "from-emerald-400 to-cyan-500",
    },
    {
      metric: "∞",
      label: "Practice Rounds",
      desc: "Unlimited simulation cycles. Practice until you dominate the role.",
      icon: "🔁",
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      metric: "5m",
      label: "Setup Time",
      desc: "Zero config. Select your path and start your journey instantly.",
      icon: "⚡",
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <section className={`relative py-24 transition-colors duration-500 overflow-hidden ${
      isDark ? "bg-[#030308]" : "bg-white"
    }`}>
      
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-1000 ${
          isDark ? "bg-emerald-600/5" : "bg-emerald-500/10"
        }`} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 ${
            isDark ? "bg-white/5 border-white/10" : "bg-stone-50 border-stone-200"
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse bg-emerald-500`} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-stone-400" : "text-stone-600"}`}>
              Proven Results
            </span>
          </div>
          
          <h2 className={`text-4xl lg:text-7xl font-black font-['Syne',sans-serif] tracking-tighter leading-none ${
            isDark ? "text-white" : "text-stone-900"
          }`}>
            The Impact of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">
              Smart Practice
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 ${
                isDark 
                  ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10" 
                  : "bg-white border-stone-100 hover:shadow-2xl hover:shadow-stone-200"
              }`}
            >
              {/* Subtle Icon Background */}
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-stone-500/5 text-2xl group-hover:scale-110 transition-transform duration-500">
                {b.icon}
              </div>

              <div className="space-y-2">
                <div className={`text-5xl font-black font-['Syne',sans-serif] tracking-tighter bg-gradient-to-br ${b.color} bg-clip-text text-transparent transition-all`}>
                  {b.metric}
                </div>
                
                <h3 className={`text-lg font-extrabold font-['Syne',sans-serif] transition-colors ${
                  isDark ? "text-white" : "text-stone-900"
                }`}>
                  {b.label}
                </h3>
                
                <p className={`text-sm leading-relaxed transition-colors ${
                  isDark ? "text-stone-500" : "text-stone-600"
                }`}>
                  {b.desc}
                </p>
              </div>

              {/* Modern Decorative Accent */}
              <div className={`absolute top-8 right-8 w-1 h-8 rounded-full bg-gradient-to-b ${b.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};