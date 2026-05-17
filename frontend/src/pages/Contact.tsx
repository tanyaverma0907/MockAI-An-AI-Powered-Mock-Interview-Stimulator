

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const FAQ = [
  {
    q: "Is my interview data private?",
    a: "Yes. Audio transcription runs locally via the Web Speech API. No audio is uploaded to our servers. Only aggregate metrics are stored if you're signed in.",
  },
  {
    q: "Can I use MockAI without a camera?",
    a: "Absolutely. Camera access is optional — it just simulates a video environment. You can practice with mic-only or even typing mode.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "Our models are trained on 10M+ responses. Accuracy is ~91% vs human evaluators, focusing on structure (STAR) and clarity.",
  },
  {
    q: "What roles do you support?",
    a: "Software Engineering, PM, Data Science, UX Design, Marketing, Finance, HR, and Operations. More drop monthly.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — 3 full interviews per month, free forever. Pro unlocks unlimited sessions and advanced analytics.",
  },
];

const CHANNELS = [
  { icon: "✉️", label: "Email", value: "hello@mock-ai.io", sub: "Replies in 24h", href: "mailto:hello@mock-ai.io", color: "#818cf8" },
  { icon: "🐦", label: "Twitter", value: "@MockAI_io", sub: "Quick updates", href: "#", color: "#34d399" },
  { icon: "💬", label: "Discord", value: "Join Community", sub: "Peer support", href: "#", color: "#f472b6" },
];

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({ name: "", email: "", category: "general", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 ${isDark ? "bg-[#030308]" : "bg-stone-50"}`}>
      
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 ${
            isDark ? "bg-white/5 border-white/10 text-stone-400" : "bg-stone-100 border-stone-200 text-stone-600"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Support</span>
          </div>
          
          <h1 className={`text-6xl lg:text-8xl font-black tracking-tighter mb-8 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-400 italic">talk.</span>
          </h1>
          <p className={`text-lg lg:text-xl max-w-2xl leading-relaxed font-medium ${isDark ? "text-stone-500" : "text-stone-500"}`}>
            Have a question or just want to say hi? We're here to help you ace your next big thing. 
            Expect a reply within one business day.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT: Channels & FAQ */}
        <div className="lg:col-span-5 space-y-12">
          
          {/* Quick Channels */}
          <div className="grid grid-cols-1 gap-4">
            {CHANNELS.map((ch) => (
              <a key={ch.label} href={ch.href} className={`flex items-center gap-5 p-6 rounded-3xl border transition-all duration-300 group ${
                isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]" : "bg-white border-stone-200 hover:shadow-xl shadow-stone-200/50"
              }`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110"
                     style={{ background: `${ch.color}15`, border: `1px solid ${ch.color}30` }}>
                  {ch.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${isDark ? "text-stone-600" : "text-stone-400"}`}>{ch.label}</p>
                  <p className={`font-bold ${isDark ? "text-white" : "text-stone-900"}`}>{ch.value}</p>
                </div>
                <span className="text-stone-700 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
              </a>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className={`text-xl font-black mb-6 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>Common Questions</h3>
            {FAQ.map((item, i) => (
              <div key={i} className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                openFaq === i 
                  ? (isDark ? "bg-violet-500/10 border-violet-500/30" : "bg-violet-50 border-violet-200") 
                  : (isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-stone-100")
              }`}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                >
                  <span className={`font-bold text-sm ${isDark ? "text-stone-200" : "text-stone-800"}`}>{item.q}</span>
                  <span className={`text-xl transition-transform duration-300 ${openFaq === i ? "rotate-45 text-violet-500" : "text-stone-600"}`}>+</span>
                </button>
                <div className={`transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className={`px-6 pb-6 text-sm leading-relaxed ${isDark ? "text-stone-500" : "text-stone-500"}`}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="lg:col-span-7">
          <div className={`p-10 lg:p-14 rounded-[3rem] border sticky top-32 transition-all ${
            isDark ? "bg-white/[0.03] border-white/10 shadow-2xl" : "bg-white border-stone-200 shadow-2xl shadow-stone-200/60"
          }`}>
            {sent ? (
              <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 border border-emerald-500/20">✓</div>
                <h2 className={`text-3xl font-black mb-4 font-['Syne',sans-serif] ${isDark ? "text-white" : "text-stone-900"}`}>Message Recieved.</h2>
                <p className="text-stone-500 font-medium mb-10">We'll get back to you at {form.email} within 24 hours.</p>
                <button onClick={() => setSent(false)} className="text-violet-500 font-black text-sm uppercase tracking-widest hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-stone-600" : "text-stone-400"}`}>Your Name</label>
                    <input 
                      type="text" required placeholder="John Doe"
                      className={`w-full bg-transparent border-b py-3 outline-none transition-all focus:border-violet-500 ${
                        isDark ? "border-white/10 text-white placeholder:text-stone-800" : "border-stone-200 text-stone-900 placeholder:text-stone-300"
                      }`}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-stone-600" : "text-stone-400"}`}>Email Address</label>
                    <input 
                      type="email" required placeholder="john@company.com"
                      className={`w-full bg-transparent border-b py-3 outline-none transition-all focus:border-violet-500 ${
                        isDark ? "border-white/10 text-white placeholder:text-stone-800" : "border-stone-200 text-stone-900 placeholder:text-stone-300"
                      }`}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-stone-600" : "text-stone-400"}`}>Topic</label>
                  <select className={`w-full bg-transparent border-b py-3 outline-none cursor-pointer focus:border-violet-500 ${
                    isDark ? "border-white/10 text-white" : "border-stone-200 text-stone-900"
                  }`}>
                    <option className="bg-stone-900">General Inquiry</option>
                    <option className="bg-stone-900">Bug Report</option>
                    <option className="bg-stone-900">Feature Request</option>
                    <option className="bg-stone-900">Billing</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-stone-600" : "text-stone-400"}`}>Message</label>
                  <textarea 
                    rows={4} required placeholder="How can we help?"
                    className={`w-full bg-transparent border-b py-3 outline-none resize-none transition-all focus:border-violet-500 ${
                      isDark ? "border-white/10 text-white placeholder:text-stone-800" : "border-stone-200 text-stone-900 placeholder:text-stone-300"
                    }`}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button className="group relative w-full py-6 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 active:scale-95 transition-all">
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                  <span className="relative text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                    Send Message
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}