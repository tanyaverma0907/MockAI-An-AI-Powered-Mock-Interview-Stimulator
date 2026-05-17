
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_QUESTIONS } from "../../constants/roles";
import { useTheme } from "../../context/ThemeContext"; // Context import kiya

const ROLES = Object.values(ROLE_QUESTIONS).map((r) => r.label);
const TYPING_SPEED = 100;
const DELETE_SPEED = 50;
const PAUSE = 2000;

const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  
  // Theme context se current state nikalna
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleStartInterview = () => {
    const roles = Object.keys(ROLE_QUESTIONS);
    navigate(`/interview/${roles[0]}`);
  };

  useEffect(() => {
    const current = ROLES[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && typed === current) {
      timeout = setTimeout(() => setDeleting(true), PAUSE);
    } else if (deleting && typed === "") {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    } else {
      timeout = setTimeout(() => {
        setTyped(deleting ? current.slice(0, typed.length - 1) : current.slice(0, typed.length + 1));
      }, deleting ? DELETE_SPEED : TYPING_SPEED);
    }
    return () => clearTimeout(timeout);
  }, [typed, deleting, roleIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Particle color according to theme
        ctx.fillStyle = isDark ? `rgba(167, 139, 250, ${p.alpha})` : `rgba(79, 70, 229, ${p.alpha})`; 
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]); // Re-draw when theme changes

  return (
    <section className={`relative min-h-screen flex items-start justify-center pt-30 md:pt-35 pb-16 transition-colors duration-500 overflow-hidden
      ${isDark ? "bg-[#030308]" : "bg-stone-50"}`}>
      
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />
      
      {/* Light Theme Background Accents */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/50 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[100px] rounded-full" />
        </div>
      )}

      {/* Dark Theme Background Accents */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[100px] rounded-full" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md mb-6 animate-fade-in
          ${isDark ? "bg-white/5 border-white/10" : "bg-violet-500/5 border-violet-500/20"}`}>
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDark ? "bg-violet-400" : "bg-violet-600"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? "bg-violet-500" : "bg-violet-700"}`}></span>
          </span>
          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold font-['Syne',sans-serif]
            ${isDark ? "text-violet-200/80" : "text-violet-700"}`}>
            The Future of Interviewing
          </span>
        </div>

        {/* Headline - Optimized Size */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter font-['Syne',sans-serif] leading-[1.1] mb-6
          ${isDark ? "text-white" : "text-stone-900"}`}>
          Master Your <br className="hidden md:block" />
          <span className="relative inline-block mt-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500">
              {typed}
            </span>
            <span className={`absolute -right-2 md:-right-4 top-0 w-[3px] md:w-[5px] h-full animate-blink ${isDark ? "bg-violet-500" : "bg-violet-600"}`} />
          </span>
          <br className="hidden md:block" />
          Interviews.
        </h1>

        {/* Subtext */}
        <p className={`max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-10 transition-colors
          ${isDark ? "text-stone-400" : "text-stone-600"}`}>
          Practice with realistic AI-driven prep. Get <span className={isDark ? "text-white" : "text-violet-700"}>behavioral insights</span> and actionable feedback before the real deal.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={handleStartInterview}
            className={`group relative px-8 py-4 rounded-2xl font-black text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
              ${isDark ? "bg-white text-stone-950 shadow-white/5" : "bg-stone-900 text-white shadow-stone-950/20"}`}
          >
            Start Free Interview
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className={`px-8 py-4 rounded-2xl border font-bold text-base transition-all active:scale-95 backdrop-blur-xl
              ${isDark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"}`}
          >
            Explore Dashboard
          </button>
        </div>

        {/* Modern Stats Strip - Scaled down for better fit */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { val: "50K+", label: "Interviews", icon: "🔥" },
            { val: "94%", label: "Success", icon: "🚀" },
            { val: "200+", label: "Patterns", icon: "🏢" },
            { val: "4.9/5", label: "Rating", icon: "⭐" },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-3xl border transition-all duration-500
              ${isDark ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]" : "border-stone-200 bg-white shadow-sm hover:shadow-md"}`}>
              <h3 className={`text-xl md:text-2xl font-black font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
                {stat.val}
              </h3>
              <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${isDark ? "text-stone-500" : "text-stone-400"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 0.8s step-end infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
      `}</style>
    </section>
  );
};

export default HeroSection;