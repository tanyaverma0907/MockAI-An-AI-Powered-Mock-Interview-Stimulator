


import { useTheme } from "../../context/ThemeContext";

export const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const steps = [
    {
      num: "01",
      title: "Choose Your Role",
      desc: "Select from Frontend, Backend, DSA, System Design, HR, or Full Stack to get role-specific questions.",
      icon: "🎯",
      color: isDark ? "from-violet-500 to-violet-700" : "from-violet-400 to-violet-600",
    },
    {
      num: "02",
      title: "AI Interviews You",
      desc: "Our LLM-powered AI asks contextually relevant questions, adapting difficulty based on your responses.",
      icon: "🤖",
      color: isDark ? "from-fuchsia-500 to-fuchsia-700" : "from-fuchsia-400 to-fuchsia-600",
    },
    {
      num: "03",
      title: "Answer & Record",
      desc: "Type or speak your answers. Each response is saved to your profile for NLP behavioral analysis.",
      icon: "🎙️",
      color: isDark ? "from-pink-500 to-pink-700" : "from-pink-400 to-pink-600",
    },
    {
      num: "04",
      title: "Get Deep Insights",
      desc: "Receive clarity, fluency, confidence, and depth scores with actionable improvement tips.",
      icon: "📊",
      color: isDark ? "from-cyan-500 to-cyan-700" : "from-cyan-400 to-cyan-600",
    },
  ];

  return (
    <section 
      id="about" 
      className={`relative py-24 transition-colors duration-500 overflow-hidden
        ${isDark ? "bg-[#030308]" : "bg-white"}`}
    >
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] transition-opacity duration-1000
          ${isDark ? "bg-violet-600/10 opacity-100" : "bg-violet-200/40 opacity-70"}`} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className={`text-[10px] uppercase tracking-[0.3em] font-bold font-['Syne',sans-serif] px-4 py-1.5 rounded-full border
            ${isDark ? "text-violet-400 border-white/5 bg-white/5" : "text-violet-600 border-violet-100 bg-violet-50"}`}>
            The Process
          </span>
          <h2 className={`text-4xl lg:text-6xl font-black mt-6 font-['Syne',sans-serif] leading-[1.1] tracking-tight
            ${isDark ? "text-white" : "text-stone-900"}`}>
            Four Steps to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500">
              Interview Mastery
            </span>
          </h2>
          <p className={`mt-6 max-w-xl mx-auto text-base leading-relaxed font-medium
            ${isDark ? "text-stone-500" : "text-stone-500"}`}>
            From role selection to detailed behavioral analytics — the entire pipeline is automated and AI-driven.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Subtle Connector line (Visible on Desktop) */}
          <div className={`hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px]
            ${isDark ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-stone-200 to-transparent"}`} 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative group h-full"
              >
                <div className={`relative h-full rounded-[2.5rem] border p-8 transition-all duration-500 backdrop-blur-sm
                  ${isDark 
                    ? "bg-white/[0.02] border-white/5 hover:border-violet-500/40 hover:bg-white/[0.04] shadow-2xl shadow-black/20" 
                    : "bg-white border-stone-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 shadow-sm shadow-stone-200/50"
                  } group-hover:-translate-y-2`}
                >
                  {/* Step Number Badge */}
                  <span className={`absolute top-8 right-8 text-4xl font-black font-['Syne',sans-serif] transition-colors duration-500
                    ${isDark ? "text-white/5 group-hover:text-violet-500/10" : "text-stone-100 group-hover:text-violet-500/10"}`}>
                    {step.num}
                  </span>

                  {/* Icon Box */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.icon}
                  </div>

                  <h3 className={`text-xl font-extrabold mb-3 font-['Syne',sans-serif] tracking-tight
                    ${isDark ? "text-white" : "text-stone-900"}`}>
                    {step.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed font-medium transition-colors
                    ${isDark ? "text-stone-500 group-hover:text-stone-400" : "text-stone-500 group-hover:text-stone-600"}`}>
                    {step.desc}
                  </p>

                  {/* Bottom Highlight Line */}
                  <div className={`absolute bottom-0 left-12 right-12 h-1 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${step.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};