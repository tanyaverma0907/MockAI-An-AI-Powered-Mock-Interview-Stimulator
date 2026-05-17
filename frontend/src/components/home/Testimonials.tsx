
import { useTheme } from "../../context/ThemeContext";

export const Testimonials = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const testimonials = [
    {
      name: "Aditya Sharma",
      role: "SDE-2 @ Flipkart",
      avatar: "AS",
      color: "#8b5cf6",
      text: "MockAI's filler word detection was a game changer. I didn't even realize I was saying 'basically' every sentence. After 10 sessions my fluency score went from 52 to 81.",
      score: "81% fluency",
    },
    {
      name: "Priya Nair",
      role: "Frontend Dev @ Razorpay",
      avatar: "PN",
      color: "#ec4899",
      text: "The NLP analysis tells you exactly what to fix. It scores clarity, depth, and relevance separately. I loved the granularity of the feedback.",
      score: "94% clarity",
    },
    {
      name: "Rohan Mehta",
      role: "Backend Eng @ Zepto",
      avatar: "RM",
      color: "#10b981",
      text: "Practiced DSA interviews for 3 weeks. The adaptive difficulty kept pushing me. By the time I sat for the real interview, nothing felt surprising.",
      score: "3 offers in 1 month",
    },
    {
      name: "Sneha Kapoor",
      role: "HR @ Swiggy",
      avatar: "SK",
      color: "#f59e0b",
      text: "Even for HR rounds, MockAI generates behavioral questions with STAR method alignment. The sentiment analysis is surprisingly accurate.",
      score: "Hired in 2 weeks",
    },
  ];

  return (
    <section className={`relative py-24 transition-colors duration-500 overflow-hidden ${
      isDark ? "bg-[#030308]" : "bg-white"
    }`}>
      
      {/* Background Glow */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none ${
        isDark ? "bg-[radial-gradient(circle_at_bottom_left,_#4c1d95_0%,_transparent_50%)]" : "bg-[radial-gradient(circle_at_bottom_left,_#ddd6fe_0%,_transparent_50%)]"
      }`} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase border mb-6 ${
            isDark ? "bg-white/5 border-white/10 text-violet-400" : "bg-violet-50 border-violet-100 text-violet-600"
          }`}>
            Wall of Love
          </span>
          <h2 className={`text-4xl lg:text-7xl font-black font-['Syne',sans-serif] tracking-tighter leading-none ${
            isDark ? "text-white" : "text-stone-900"
          }`}>
            The New Standard of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Preparation.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.01] ${
                isDark 
                  ? "bg-white/[0.02] border-white/10 hover:border-white/20" 
                  : "bg-white border-stone-200 shadow-xl shadow-stone-200/40"
              }`}
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.25 0C5.0625 0 0 5.0625 0 11.25C0 17.4375 5.0625 22.5 11.25 22.5H12.5C12.5 26.625 9.125 30 5 30H3.75V33.75H5C11.1875 33.75 16.25 28.6875 16.25 22.5V11.25C16.25 5.0625 11.1875 0 11.25 0ZM35 0C28.8125 0 23.75 5.0625 23.75 11.25C23.75 17.4375 28.8125 22.5 35 22.5H36.25C36.25 26.625 32.875 30 28.75 30H27.5V33.75H28.75C34.9375 33.75 40 28.6875 40 22.5V11.25C40 5.0625 34.9375 0 35 0Z" fill={isDark ? "white" : "black"} />
                </svg>
              </div>

              <div className="space-y-6">
                {/* Result Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm"
                  style={{ 
                    backgroundColor: isDark ? `${t.color}15` : `${t.color}10`, 
                    color: t.color,
                    border: `1px solid ${t.color}30`
                  }}
                >
                  <span className="animate-pulse">●</span> {t.score}
                </div>

                <p className={`text-lg font-medium leading-relaxed italic ${
                  isDark ? "text-stone-300" : "text-stone-700"
                }`}>
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-dashed border-stone-700/20">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-['Syne',sans-serif] ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}>
                      {t.name}
                    </h4>
                    <p className={`text-xs font-medium ${isDark ? "text-stone-500" : "text-stone-500"}`}>
                      {t.role}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};