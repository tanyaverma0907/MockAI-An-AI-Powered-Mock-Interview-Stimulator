
import React from "react";
import { ROLE_QUESTIONS } from "../../constants/roles";
import type { InterviewMode } from "../../services/interviewService";
import { useTheme } from "../../context/ThemeContext";

interface RoleSelectProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
  interviewMode: InterviewMode;
  onSetMode: (mode: InterviewMode) => void;
  onNext: () => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  selectedRole,
  onSelectRole,
  interviewMode,
  onSetMode,
  onNext,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen w-full flex justify-center py-20 px-6 lg:px-24 transition-colors duration-700 relative overflow-hidden font-sans ${isDark ? "bg-[#030303] text-slate-200" : "bg-[#fafafa] text-slate-900"}`}>
      
      {/* --- Modern Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] mix-blend-screen transition-opacity duration-1000 ${isDark ? "bg-indigo-600/20 opacity-40" : "bg-indigo-200/50 opacity-60"}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] transition-opacity duration-1000 ${isDark ? "bg-fuchsia-600/10 opacity-20" : "bg-fuchsia-100/40 opacity-50"}`} />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        
        {/* --- Top Navigation Bar --- */}
        {/* <div className="flex items-center justify-between mb-20 backdrop-blur-md bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 pl-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030303] animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">System Status</p>
              <p className="text-xs font-bold font-mono">NEURAL_CORE_ACTIVE</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={toggleTheme} 
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:shadow-md"}`}
            >
               {isDark ? "󱐋" : "󰖨"}
            </button>
          </div>
        </div> */}

        {/* --- Hero Section --- */}
        <div className="mb-16 text-center lg:text-left py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-ping" />
            Next Gen Interviewing
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none mb-8">
            Select Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Trajectory.</span>
          </h1>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
              Our AI engine generates dynamic, role-specific pressure tests designed to identify the top 1% of talent.
            </p>
            
            <div className={`flex p-1.5 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200"}`}>
              {(["normal", "strict"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onSetMode(m)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${interviewMode === m ? (isDark ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white text-slate-900 shadow-xl") : "text-slate-500 hover:text-slate-400"}`}
                >
                  {m.toUpperCase()}
                  <span className={`w-1 h-1 rounded-full ${interviewMode === m ? "bg-indigo-500" : "bg-transparent"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Bento Grid Roles --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {Object.entries(ROLE_QUESTIONS).map(([key, role]) => {
            const isSelected = selectedRole === key;
            return (
              <button
                key={key}
                onClick={() => onSelectRole(key)}
                className={`group relative flex flex-col items-start p-8 rounded-[2.5rem] border transition-all duration-500 text-left overflow-hidden
                  ${isSelected 
                    ? (isDark ? "bg-white/[0.08] border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[1.02]" : "bg-white border-indigo-400 shadow-2xl scale-[1.02]") 
                    : (isDark ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-white border-slate-100 hover:shadow-lg hover:border-slate-300")
                  }`}
              >
                {/* Selection Glow Effect */}
                {isSelected && (
                  <div className="absolute -inset-2 opacity-30 blur-2xl transition-opacity duration-500" 
                       style={{ background: `radial-gradient(circle at center, rgba(${role.accentRgb}, 0.8), transparent)` }} />
                )}

                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-inner`}
                     style={{ 
                       background: isSelected ? role.color : `rgba(${role.accentRgb}, 0.1)`, 
                       color: isSelected ? '#fff' : role.color,
                       boxShadow: isSelected ? `0 10px 25px -5px rgba(${role.accentRgb}, 0.5)` : 'none'
                     }}>
                  {role.label.slice(0, 1)}
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">{role.tag}</p>
                  <h3 className="font-black text-xl mb-6">{role.label}</h3>
                </div>

                <div className="relative z-10 mt-auto flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.color }} />
                   <span className="text-[10px] font-bold opacity-60 uppercase">{role.questions.length} Sessions</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* --- Final Action Footer --- */}
        <div className={`p-8 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedRole ? "bg-indigo-500 scale-100 rotate-0" : "bg-slate-500/10 scale-90 rotate-12"}`}>
              <span className={`text-2xl transition-opacity duration-300 ${selectedRole ? "opacity-100" : "opacity-20"}`}>⚡</span>
            </div>
            <div>
              <h4 className="font-black text-lg">Ready for deployment?</h4>
              <p className="text-sm text-slate-500">Your custom environment will be generated upon initialization.</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => selectedRole && onNext()}
              disabled={!selectedRole}
              className={`group px-12 py-5 rounded-2xl text-xs font-black tracking-[0.2em] transition-all duration-500 flex items-center gap-4
                ${selectedRole 
                  ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:shadow-[0_10px_40px_rgba(99,102,241,0.4)] hover:-translate-y-1 cursor-pointer" 
                  : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-20"}`}
            >
              INITIALIZE SESSION
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            {!selectedRole && (
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest animate-pulse">Waiting for role selection...</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};