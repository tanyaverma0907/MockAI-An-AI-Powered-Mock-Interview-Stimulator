
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const CTASection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="contact" className={`relative py-32 overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-[#030308]" : "bg-white"
    }`}>
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-20 ${
          isDark ? "bg-violet-600" : "bg-violet-200"
        }`} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className={`relative rounded-[3rem] overflow-hidden border transition-all duration-700 ${
          isDark 
            ? "bg-white/[0.03] border-white/10 shadow-2xl shadow-black" 
            : "bg-stone-50 border-stone-200 shadow-xl shadow-stone-200"
        }`}>
          
          {/* Internal Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[80px]" />

          <div className="relative px-8 py-20 text-center flex flex-col items-center">
            
            {/* Trust Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-10 backdrop-blur-md ${
              isDark ? "bg-white/5 border-white/10 text-stone-300" : "bg-white border-stone-200 text-stone-600"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-['Syne',sans-serif]">
                Free to start — No credit card needed
              </span>
            </div>

            <h2 className={`text-5xl lg:text-7xl font-black font-['Syne',sans-serif] leading-[1.1] tracking-tighter mb-8 ${
              isDark ? "text-white" : "text-stone-900"
            }`}>
              Ready to Ace Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                Next Interview?
              </span>
            </h2>

            <p className={`text-lg max-w-xl mx-auto leading-relaxed mb-12 ${
              isDark ? "text-stone-400" : "text-stone-500"
            }`}>
              Join thousands of candidates who use MockAI to practice smarter, get real-time feedback, and land their dream offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <button
                onClick={() => navigate("/interview/:role")}
                className="group relative px-10 py-5 rounded-2xl text-white font-black text-lg overflow-hidden font-['Syne',sans-serif] shadow-xl shadow-violet-500/20 active:scale-95 transition-transform"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-transform group-hover:scale-105" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Interview
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className={`px-10 py-5 rounded-2xl font-bold text-lg border transition-all active:scale-95 font-['Syne',sans-serif] ${
                  isDark 
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
                    : "bg-white border-stone-200 text-stone-900 hover:bg-stone-50"
                }`}
              >
                View Dashboard
              </button>
            </div>

            {/* Logo Section */}
            <div className="mt-20 pt-10 border-t border-dashed border-stone-500/20 w-full">
              <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-8 ${isDark ? "text-stone-600" : "text-stone-400"}`}>
                Empowering candidates at
              </p>
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                {["Google", "Amazon", "Flipkart", "Zepto", "Razorpay", "Swiggy"].map(co => (
                  <span key={co} className={`text-sm font-black font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
                    {co}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};