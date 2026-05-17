

import { useTheme } from "../context/ThemeContext";

const STATS = [
  { val: "50K+", label: "Interviews", icon: "🎯" },
  { val: "94%", label: "Success Rate", icon: "📈" },
  { val: "200+", label: "Companies", icon: "🏢" },
  { val: "4.9★", label: "Rating", icon: "⭐" },
];

const TEAM = [
  {
    name: "Aria Chen",
    role: "AI Research Lead",
    avatar: "AC",
    color: "#818cf8",
    bio: "Former ML engineer at DeepMind. Designed the STAR-analysis and filler-word detection engine.",
  },
  {
    name: "Marcus Webb",
    role: "Product & Growth",
    avatar: "MW",
    color: "#34d399",
    bio: "Previously at Y Combinator. Obsessed with making interview prep accessible to everyone.",
  },
  {
    name: "Priya Nair",
    role: "NLP Engineer",
    avatar: "PN",
    color: "#f472b6",
    bio: "PhD in Computational Linguistics. Trained the behavioral-analysis models from 1M+ interviews.",
  },
  {
    name: "Ethan Park",
    role: "Full-Stack Engineering",
    avatar: "EP",
    color: "#fbbf24",
    bio: "Ex-Amazon SDE. Built the real-time transcription pipeline and latency-optimized AI scoring.",
  },
];

const TIMELINE = [
  { year: "2022", label: "Idea Born", desc: "Founders prototyping an AI that could actually push back." },
  { year: "2023", label: "First Model", desc: "Launched STAR-analysis engine with 500 beta testers." },
  { year: "2024", label: "Public Launch", desc: "10,000 users in the first month. Real-time detection shipped." },
  { year: "2025", label: "Global Scale", desc: "Expanded to 200+ companies. Multi-modal feedback added." },
];

const VALUES = [
  { icon: "🔬", title: "Rigour", desc: "Every feedback point is grounded in research, not vibes." },
  { icon: "🌍", title: "Access", desc: "World-class coaching for everyone, zero coaches needed." },
  { icon: "🔒", title: "Privacy", desc: "Your audio stays on your device. Zero cloud recordings." },
  { icon: "🔁", title: "Iteration", desc: "User feedback drives our weekly model updates." },
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      isDark ? "bg-[#030308]" : "bg-stone-50"
    }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 ${isDark ? "bg-violet-600" : "bg-violet-200"}`} />
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 ${isDark ? "bg-fuchsia-600" : "bg-fuchsia-200"}`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-32 pb-32">

        {/* ── Hero Section ── */}
        <div className="mb-32">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
            isDark ? "bg-white/5 border-white/10" : "bg-stone-100 border-stone-200"
          }`}>
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span className={`font-black text-[10px] uppercase tracking-[0.3em] ${isDark ? "text-stone-400" : "text-stone-500"}`}>
              Mission Brief
            </span>
          </div>

          <h1 className={`text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-10 ${isDark ? "text-white" : "text-stone-900"}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Built by people who <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 italic">
              hated bad prep.
            </span>
          </h1>

          <p className={`text-xl lg:text-2xl font-medium max-w-3xl leading-relaxed ${isDark ? "text-stone-400" : "text-stone-600"}`}>
            MockAI was born from a simple frustration: interview prep was either too scripted, too expensive, or too easy. 
            We built the interviewer we always wished existed — one that listens, adapts, and tells the uncomfortable truth.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {STATS.map((s) => (
            <div key={s.label} className={`group p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 ${
              isDark ? "bg-white/[0.03] border-white/10 hover:border-white/20" : "bg-white border-stone-200 shadow-xl shadow-stone-200/40"
            }`}>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className={`text-4xl font-black mb-1 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
                {s.val}
              </div>
              <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-stone-600" : "text-stone-400"}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Our Journey (Timeline) ── */}
        <div className="mb-40">
          <h2 className={`text-3xl font-black mb-16 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
            The Evolution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
             {/* Desktop Connector Line */}
            <div className={`hidden md:block absolute top-6 left-0 right-0 h-px border-t border-dashed ${isDark ? "border-white/10" : "border-stone-200"}`} />
            
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pt-12 group">
                <div className={`absolute top-4 left-0 w-4 h-4 rounded-full border-4 transition-colors ${
                  isDark ? "bg-stone-900 border-stone-700 group-hover:border-violet-500" : "bg-white border-stone-300 group-hover:border-violet-500"
                }`} />
                <span className="block font-black text-violet-500 text-sm mb-4 font-mono">{item.year}</span>
                <h3 className={`font-black mb-3 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>{item.label}</h3>
                <p className={`text-sm leading-relaxed font-medium ${isDark ? "text-stone-500" : "text-stone-500"}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team Grid ── */}
        <div className="mb-40">
          <h2 className={`text-3xl font-black mb-16 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
            Engineered by Experts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className={`p-8 rounded-[2.5rem] border flex flex-col sm:flex-row gap-6 items-start transition-all ${
                isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-white border-stone-200 hover:shadow-2xl"
              }`}>
                <div 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl text-white shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}
                >
                  {member.avatar}
                </div>
                <div>
                  <div className={`text-lg font-black mb-1 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>{member.name}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500 mb-4">{member.role}</div>
                  <p className={`text-sm leading-relaxed font-medium ${isDark ? "text-stone-500" : "text-stone-600"}`}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack Footer ── */}
        <div className={`rounded-[3rem] p-12 text-center border overflow-hidden relative ${
          isDark ? "bg-white/[0.02] border-white/10" : "bg-stone-900 border-stone-800"
        }`}>
          <div className="relative z-10">
            <h3 className={`text-2xl font-black mb-4 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-white"}`}>
              Built for sub-200ms latency.
            </h3>
            <p className="text-stone-500 text-sm max-w-2xl mx-auto mb-10 font-medium">
              Our architecture combines Web Speech API, fine-tuned LLM scoring, and custom STAR-detection NLP 
              to give you feedback in real-time. No cloud recordings, no delays.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Web Speech API", "LLM Scoring", "STAR NLP", "Filler Detection", "React"].map((tag) => (
                <span key={tag} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-stone-400 text-[10px] font-black uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        </div>

      </div>
    </div>
  );
}