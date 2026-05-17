

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const Footer = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const links = {
    Platform: ["Features", "Dashboard", "How It Works", "Integrations"],
    Resources: ["Interview Guide", "DSA Patterns", "HR Questions", "Blog"],
    Company: ["About Us", "Careers", "Press Kit", "Contact"],
    Legal: ["Privacy", "Terms", "Cookies"],
  };

  return (
    <footer className={`relative pt-32 pb-16 transition-colors duration-500 ${
      isDark ? "bg-[#030308]" : "bg-white"
    }`}>
      
      {/* Top Subtle Line - Edge to Edge */}
      <div className={`h-px w-full ${isDark ? "bg-white/5" : "bg-stone-100"}`} />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-20">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">

          {/* LEFT: BRAND BLOCK (More Space & Presence) */}
          <div className="lg:max-w-sm space-y-10">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-4 group transition-all"
            >
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left">
                <p className={`text-2xl font-black font-['Syne',sans-serif] tracking-tighter leading-none ${isDark ? "text-white" : "text-stone-900"}`}>
                  Mock<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">AI</span>
                </p>
                <p className={`text-[10px] uppercase tracking-[0.4em] font-bold mt-1 ${isDark ? "text-stone-600" : "text-stone-400"}`}>Next-Gen Prep</p>
              </div>
            </button>
            
            <p className={`text-base leading-relaxed font-medium ${isDark ? "text-stone-500" : "text-stone-500"}`}>
              Master your next interview with the world's most advanced AI-driven behavioral analysis platform. Built for professionals.
            </p>

            {/* Social Icons with Minimal Borders */}
            <div className="flex gap-4">
              {["𝕏", "in", "gh"].map((s, i) => (
                <button key={i} className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDark 
                    ? "bg-white/5 text-stone-400 hover:text-white hover:bg-white/10" 
                    : "bg-stone-50 text-stone-500 hover:text-stone-900 hover:shadow-xl hover:shadow-stone-200"
                }`}>
                  <span className="text-sm font-bold">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: NAVIGATION LINKS (Organized Grid) */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="space-y-6">
                <p className={`text-[11px] font-black uppercase tracking-[0.25em] font-['Syne',sans-serif] ${
                  isDark ? "text-white/40" : "text-stone-400"
                }`}>
                  {group}
                </p>
                <ul className="space-y-4">
                  {items.map(item => (
                    <li key={item}>
                      <a href="#" className={`text-sm font-semibold transition-all hover:translate-x-1 inline-block ${
                        isDark ? "text-stone-500 hover:text-white" : "text-stone-500 hover:text-violet-600"
                      }`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR: ULTRA THIN & CLEAN */}
        <div className={`mt-32 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
          isDark ? "border-white/5" : "border-stone-100"
        }`}>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <p className={`text-xs font-bold tracking-tight ${isDark ? "text-stone-800" : "text-stone-300"}`}>
              © 2026 MOCKAI TECHNOLOGY GROUP
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-stone-700" : "text-stone-400"}`}>
                Engine API: V3.4 Stable
              </span>
            </div>
          </div>
          
          <div className="flex gap-6">
             <button className={`text-[10px] font-black uppercase tracking-widest hover:text-violet-500 transition-colors ${isDark ? "text-stone-700" : "text-stone-400"}`}>
               Privacy Policy
             </button>
             <button className={`text-[10px] font-black uppercase tracking-widest hover:text-violet-500 transition-colors ${isDark ? "text-stone-700" : "text-stone-400"}`}>
               Terms of Service
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};