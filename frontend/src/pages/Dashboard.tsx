


import { useEffect, useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, CartesianGrid, Cell, AreaChart, Area,
} from "recharts";
import { useNavigate } from "react-router-dom";

const LS_KEY = "mock_interview_records";

interface InterviewRecord {
  id: string;
  role: string;
  questions: string[];
  answers: string[];
  feedbacks?: string[];
  scores?: number[];
  overallScore: number;
  clarityScore?: number;
  fluencyScore?: number;
  confidenceScore?: number;
  relevanceScore?: number;
  depthScore?: number;
  createdAt: string;
}

function loadRecords(): InterviewRecord[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function deleteRecord(id: string) {
  const updated = loadRecords().filter((r) => r.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

const ROLE_META: Record<string, { color: string; bg: string; icon: string; short: string; label: string }> = {
  "frontend-dev":    { color: "#a78bfa", bg: "from-violet-500/20 to-purple-600/10", icon: "⬡", short: "Frontend", label: "Frontend Dev" },
  "backend-dev":     { color: "#38bdf8", bg: "from-sky-500/20 to-blue-600/10",     icon: "◈", short: "Backend",  label: "Backend Dev" },
  "data-scientist":  { color: "#34d399", bg: "from-emerald-500/20 to-green-600/10",icon: "◎", short: "Data",     label: "Data Scientist" },
  "product-manager": { color: "#fbbf24", bg: "from-amber-500/20 to-yellow-600/10", icon: "◆", short: "PM",       label: "Product Manager" },
  "ux-designer":     { color: "#f472b6", bg: "from-pink-500/20 to-rose-600/10",    icon: "◉", short: "UX",       label: "UX Designer" },
  devops:            { color: "#c084fc", bg: "from-purple-500/20 to-fuchsia-600/10",icon: "⬟", short: "DevOps",  label: "DevOps" },
  "ml-engineer":     { color: "#2dd4bf", bg: "from-teal-500/20 to-cyan-600/10",    icon: "◐", short: "ML",       label: "ML Engineer" },
  general:           { color: "#94a3b8", bg: "from-slate-500/20 to-gray-600/10",   icon: "●", short: "General",  label: "General" },
};

function fmtDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function scoreColor(n: number): string {
  if (n >= 75) return "#34d399";
  if (n >= 50) return "#fbbf24";
  return "#f87171";
}

function scoreLabel(n: number): string {
  if (n >= 80) return "Excellent";
  if (n >= 65) return "Good";
  if (n >= 50) return "Fair";
  return "Needs Work";
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const SlickTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1e]/95 border border-white/10 rounded-xl px-4 py-3 text-xs backdrop-blur-xl shadow-2xl">
      {label && <p className="text-slate-500 mb-2 font-semibold tracking-wide uppercase text-[10px]">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2 my-1" style={{ color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <strong className="text-slate-100">{Math.round(p.value)}{p.name?.includes("Score") || ["Overall","Fluency","Clarity","Score"].includes(p.name) ? "%" : ""}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1000;
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target]);
  return <>{val}{suffix}</>;
}

// ── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ * 0.75;
  const color = scoreColor(score);
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size * 0.075}
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={size * 0.075}
        strokeDasharray={`${fill} ${circ - fill}`} strokeDashoffset={circ * 0.125} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}80)` }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize={size * 0.2} fontWeight="700" fontFamily="'DM Mono', monospace">{score}</text>
    </svg>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, suffix = "", icon }: {
  label: string; value: number | string; sub?: string; color: string; suffix?: string; icon: string;
}) {
  const isNum = typeof value === "number";
  return (
    <div className="group relative rounded-2xl p-6 bg-white/2 border border-white/6 overflow-hidden hover:border-white/12 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
      <div className="absolute bottom-4 right-5 text-3xl opacity-[0.06] font-mono">{icon}</div>
      <p className="text-[10px] font-bold tracking-[2px] uppercase mb-3" style={{ color: "#64748b" }}>{label}</p>
      <p className="text-4xl font-black leading-none mb-2 tabular-nums" style={{ color, fontFamily: "'DM Mono', monospace" }}>
        {isNum ? <AnimatedNumber target={value as number} suffix={suffix} /> : value}
      </p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
  );
}

// ── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-4 h-px bg-slate-700 inline-block" />
      <span className="text-[10px] font-bold tracking-[2px] uppercase text-slate-500">{children}</span>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ msg = "Complete an interview to see data" }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3">
      <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-lg text-violet-400 font-mono">◌</div>
      <p className="text-slate-600 text-xs tracking-wide text-center">{msg}</p>
    </div>
  );
}

// ── Skill Bar ───────────────────────────────────────────────────────────────
function SkillBar({ label, value, color, rank }: { label: string; value: number; color: string; rank?: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}60` }} />
          <span className="text-sm font-semibold text-slate-200">{label}</span>
          {rank && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ color: rank === "Weakest" ? "#f87171" : "#34d399", background: rank === "Weakest" ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.1)" }}>
              {rank}
            </span>
          )}
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color, fontFamily: "'DM Mono', monospace" }}>{value}%</span>
      </div>
      <div className="h-2 bg-white/4 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 12px ${color}40` }} />
      </div>
    </div>
  );
}

// ── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ iv, idx, onDelete }: { iv: InterviewRecord; idx: number; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[iv.role] || { color: "#94a3b8", bg: "from-slate-500/20 to-gray-600/10", icon: "●", short: iv.role, label: iv.role };
  const overall = iv.overallScore ?? 0;
  const perQScores = iv.scores || [];

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${open ? "border-white/10" : "border-white/5"} bg-white/2`}>
      <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={() => setOpen(o => !o)}>
        {/* Role icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 font-mono border"
          style={{ background: `${meta.color}12`, borderColor: `${meta.color}30`, color: meta.color }}>
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-100 text-sm tracking-tight">
            {(meta.label || iv.role).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{iv.questions.length} questions</span>
            <span className="text-slate-700">·</span>
            <span>{iv.answers.filter(a => a && a !== "SKIPPED").length} answered</span>
            <span className="text-slate-700">·</span>
            <span>{fmtDate(iv.createdAt)}</span>
          </div>
        </div>

        {/* Score pills */}
        <div className="hidden sm:flex gap-5 items-center shrink-0">
          {[{ l: "Clarity", v: iv.clarityScore }, { l: "Fluency", v: iv.fluencyScore }, { l: "Depth", v: iv.depthScore }]
            .map(({ l, v }) => v !== undefined ? (
              <div key={l} className="text-center">
                <div className="text-sm font-bold tabular-nums" style={{ color: scoreColor(v), fontFamily: "'DM Mono', monospace" }}>{v}</div>
                <div className="text-[9px] text-slate-600 tracking-wide mt-0.5">{l}</div>
              </div>
            ) : null)}
          <ScoreRing score={overall} size={48} />
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all text-xs"
            onClick={e => { e.stopPropagation(); if (confirm("Delete this interview record?")) onDelete(iv.id); }}>
            ✕
          </button>
          <span className="text-slate-600 text-xs transition-transform duration-300 inline-block" style={{ transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/6 px-6 pb-6 pt-5">
          {/* Score badge row */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { l: "Overall", v: iv.overallScore }, { l: "Clarity", v: iv.clarityScore },
              { l: "Fluency", v: iv.fluencyScore }, { l: "Confidence", v: iv.confidenceScore },
              { l: "Relevance", v: iv.relevanceScore }, { l: "Depth", v: iv.depthScore },
            ].map(s => s.v !== undefined ? (
              <span key={s.l} className="text-xs px-3 py-1 rounded-full font-bold border tabular-nums"
                style={{ color: scoreColor(s.v), background: `${scoreColor(s.v)}12`, borderColor: `${scoreColor(s.v)}25`, fontFamily: "'DM Mono', monospace" }}>
                {s.l} {s.v}%
              </span>
            ) : null)}
          </div>

          {/* Per-question bars */}
          {perQScores.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-3">Per-question scores</p>
              <div className="flex gap-1.5 items-end h-12">
                {perQScores.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-bold" style={{ color: scoreColor(s) }}>{s}</div>
                    <div className="w-full rounded-sm min-h-0.75 transition-all duration-700"
                      style={{ height: `${(s / 100) * 32}px`, background: `${scoreColor(s)}80`, border: `1px solid ${scoreColor(s)}40` }} />
                    <div className="text-[9px] text-slate-600">Q{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A */}
          <div className="flex flex-col gap-3">
            {iv.questions.map((q, i) => (
              <div key={i} className="rounded-xl p-4 bg-black/20 border border-white/4"
                style={{ borderLeft: `3px solid ${meta.color}40` }}>
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: meta.color }}>Q{i + 1}</span>
                    <p className="text-slate-100 font-semibold text-sm mt-1 leading-relaxed">{q}</p>
                  </div>
                  {iv.scores?.[i] !== undefined && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0 tabular-nums"
                      style={{ color: scoreColor(iv.scores[i]), background: `${scoreColor(iv.scores[i])}12`, fontFamily: "'DM Mono', monospace" }}>
                      {iv.scores[i]}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  {iv.answers[i] === "SKIPPED" ? <em className="text-amber-700">Skipped</em> : iv.answers[i] || <em className="text-slate-700">No answer recorded</em>}
                </p>
                {iv.feedbacks?.[i] && (
                  <div className="rounded-lg px-3 py-2 mt-2" style={{ background: `${meta.color}08` }}>
                    <p className="text-xs text-emerald-400 leading-relaxed">↳ {iv.feedbacks[i]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Insights Tab ──────────────────────────────────────────────────────────────
function InsightsTab({ interviews, loading, navigate }: { interviews: InterviewRecord[]; loading: boolean; navigate: any }) {
  if (loading) return (
    <div className="flex flex-col gap-4">
      {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl bg-white/2 animate-pulse" />)}
    </div>
  );
  if (!interviews.length) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4 opacity-20 font-mono">◎</div>
      <p className="text-slate-500 mb-6 tracking-wide">No data yet — complete your first interview</p>
      <button className="px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity"
        onClick={() => navigate("/")}>Begin Interview</button>
    </div>
  );

  const total = interviews.length;
  const avg = (field: keyof InterviewRecord) =>
    Math.round(interviews.reduce((a, iv) => a + ((iv[field] as number) ?? 0), 0) / total);

  const skills = [
    { label: "Clarity",    val: avg("clarityScore"),    tip: "Structure answers with intro–body–conclusion.", color: "#818cf8" },
    { label: "Fluency",    val: avg("fluencyScore"),    tip: "Reduce filler words and practice pacing.",      color: "#38bdf8" },
    { label: "Confidence", val: avg("confidenceScore"), tip: "Use assertive language — avoid 'I think maybe'.", color: "#34d399" },
    { label: "Relevance",  val: avg("relevanceScore"),  tip: "Stay on topic; use the STAR method.",           color: "#fbbf24" },
    { label: "Depth",      val: avg("depthScore"),      tip: "Go deeper — add examples, numbers, outcomes.",  color: "#f472b6" },
  ].sort((a, b) => a.val - b.val);

  const weakAreas   = skills.filter(s => s.val < 60);
  const strongAreas = skills.filter(s => s.val >= 70);

  const heatmapData = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = interviews.filter(iv => iv.createdAt?.slice(0, 10) === dateStr).length;
    return { date: dateStr, count };
  });



  // Streak calculation
  const sortedDates = [...new Set(interviews.map(iv => iv.createdAt?.slice(0, 10)))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (sortedDates[i] === d.toISOString().slice(0, 10)) streak++;
    else break;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Quick insight pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Current Streak", value: `${streak}d`, color: "#f472b6", icon: "🔥" },
          { label: "Sessions This Week", value: interviews.filter(iv => {
            const d = new Date(iv.createdAt); const now = new Date();
            return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
          }).length, color: "#818cf8", icon: "📅" },
          { label: "Top Skill", value: skills[skills.length - 1]?.label, color: "#34d399", icon: "⭐" },
          { label: "Focus Area", value: skills[0]?.label, color: "#fbbf24", icon: "🎯" },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white/2 border border-white/6 hover:border-white/10 transition-all">
            <div className="text-xl mb-2">{item.icon}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{item.label}</div>
            <div className="text-lg font-black" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Skill breakdown */}
      <div className="rounded-2xl p-6 bg-white/2 border border-white/6">
        <SectionTitle>Skill Breakdown</SectionTitle>
        <div className="flex flex-col gap-5">
          {skills.map((s, i) => (
            <div key={s.label}>
              <SkillBar label={s.label} value={s.val} color={s.color}
                rank={i === 0 ? "Weakest" : i === skills.length - 1 ? "Strongest" : undefined} />
              {s.val < 60 && <p className="text-[11px] text-slate-600 mt-1.5">↳ {s.tip}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Weak + Strong */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {weakAreas.length > 0 && (
          <div className="rounded-2xl p-5 bg-red-500/3 border border-red-500/15">
            <SectionTitle>Areas to Improve</SectionTitle>
            {weakAreas.map(s => (
              <div key={s.label} className="flex justify-between items-center py-3 border-b border-white/4">
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />{s.label}
                </span>
                <span className="text-sm font-bold text-red-400 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{s.val}%</span>
              </div>
            ))}
          </div>
        )}
        {strongAreas.length > 0 && (
          <div className="rounded-2xl p-5 bg-emerald-500/3 border border-emerald-500/15">
            <SectionTitle>Strong Areas</SectionTitle>
            {strongAreas.map(s => (
              <div key={s.label} className="flex justify-between items-center py-3 border-b border-white/4">
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />{s.label}
                </span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>{s.val}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity heatmap */}
      <div className="rounded-2xl p-6 bg-white/2 border border-white/6">
        <SectionTitle>Practice Activity — Last 28 Days</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {heatmapData.map((d, i) => (
            <div key={i} title={`${d.date}: ${d.count} session${d.count !== 1 ? "s" : ""}`}
              className="w-5 h-5 rounded-sm border border-white/4 hover:scale-125 transition-transform cursor-default"
              style={{ background: d.count === 0 ? "rgba(255,255,255,0.04)" : d.count === 1 ? "rgba(124,58,237,0.3)" : d.count === 2 ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.9)" }} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-600">
          <span>Less</span>
          {[0.04, 0.3, 0.6, 0.9].map((o, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ background: i === 0 ? "rgba(255,255,255,0.04)" : `rgba(124,58,237,${o})` }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* AI recommendation */}
      <div className="rounded-2xl p-6 bg-violet-500/4 border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <SectionTitle>AI Recommendation</SectionTitle>
        <p className="text-sm text-slate-400 leading-relaxed">
          {weakAreas.length === 0
            ? "Excellent performance across all dimensions. Focus on consistency and increase answer depth with real-world examples and measurable outcomes."
            : `Your primary growth area is ${weakAreas[0].label}. ${weakAreas[0].tip} Consider daily practice with ${weakAreas[0].label === "Depth" ? "technical deep-dive" : "behavioral"} question sets targeting this dimension.`}
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "insights">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  useEffect(() => {
    try { setInterviews(loadRecords()); }
    catch (e) { console.error("Error loading:", e); }
    finally { setLoading(false); }
  }, []);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setInterviews(prev => prev.filter(iv => iv.id !== id));
  };

  const total = interviews.length;
  const avgScore = total ? Math.round(interviews.reduce((a, iv) => a + (iv.overallScore ?? 0), 0) / total) : 0;
  const bestScore = total ? Math.max(...interviews.map(iv => iv.overallScore ?? 0)) : 0;
  const totalAnswered = interviews.reduce((a, iv) => a + iv.answers.filter(x => x && x !== "SKIPPED").length, 0);

  const roleDist = interviews.reduce((acc, iv) => { acc[iv.role] = (acc[iv.role] || 0) + 1; return acc; }, {} as Record<string, number>);
  const roleChartData = Object.entries(roleDist).map(([role, count]) => ({
    role: ROLE_META[role]?.short || role, count, color: ROLE_META[role]?.color || "#8b5cf6",
  }));

  const trendData = [...interviews].slice(0, 12).reverse().map((iv, i) => ({
    name: `#${i + 1}`, score: iv.overallScore ?? 0,
    fluency: iv.fluencyScore ?? 0, clarity: iv.clarityScore ?? 0,
    confidence: iv.confidenceScore ?? 0,
  }));

  const safeAvg = (field: keyof InterviewRecord) =>
    total ? Math.round(interviews.reduce((a, iv) => a + ((iv[field] as number) ?? 0), 0) / total) : 0;

  const radarData = [
    { skill: "Clarity",    val: safeAvg("clarityScore"),    fullMark: 100 },
    { skill: "Fluency",    val: safeAvg("fluencyScore"),    fullMark: 100 },
    { skill: "Confidence", val: safeAvg("confidenceScore"), fullMark: 100 },
    { skill: "Relevance",  val: safeAvg("relevanceScore"),  fullMark: 100 },
    { skill: "Depth",      val: safeAvg("depthScore"),      fullMark: 100 },
  ];

  const roleScores: Record<string, number[]> = {};
  interviews.forEach(iv => { if (!roleScores[iv.role]) roleScores[iv.role] = []; roleScores[iv.role].push(iv.overallScore ?? 0); });
  const roleAvgScores = Object.entries(roleScores)
    .map(([role, scores]) => ({ role, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length }))
    .sort((a, b) => b.avg - a.avg);

  const buckets = [
    { range: "0–25",   count: 0, color: "#f87171" },
    { range: "25–50",  count: 0, color: "#fb923c" },
    { range: "50–75",  count: 0, color: "#fbbf24" },
    { range: "75–100", count: 0, color: "#34d399" },
  ];
  interviews.forEach(iv => {
    const s = iv.overallScore ?? 0;
    if (s < 25) buckets[0].count++;
    else if (s < 50) buckets[1].count++;
    else if (s < 75) buckets[2].count++;
    else buckets[3].count++;
  });

  const filteredInterviews = interviews
    .filter(iv => iv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iv.questions.some(q => q.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => sortBy === "score"
      ? (b.overallScore ?? 0) - (a.overallScore ?? 0)
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const glassCard = "rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-[#070c1a] text-slate-100" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-150 h-150 rounded-full opacity-[0.07] blur-3xl bg-violet-500" />
        <div className="absolute bottom-[-10%] right-[10%] w-150 h-150 rounded-full opacity-[0.05] blur-3xl bg-purple-600" />
        <div className="absolute top-[40%] left-[-10%] w-100 h-100 rounded-full opacity-[0.04] blur-3xl bg-sky-400" />
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 pb-20">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-5">
          <div>
            <div className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
              Performance Analytics
            </div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight leading-tight">Interview Dashboard</h1>
            <p className="text-slate-500 text-sm mt-2">
              {total > 0 ? `${total} session${total !== 1 ? "s" : ""} recorded · Avg score ${avgScore}%` : "Start your first interview to see analytics"}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 border border-white/8 bg-white/3 hover:border-white/15 hover:text-slate-200 transition-all">
              Refresh
            </button>
            <button onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity flex items-center gap-2">
              <span>+</span> New Interview
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Sessions" value={loading ? 0 : total} sub="All time" color="#818cf8" icon="Σ" />
          <StatCard label="Average Score" value={loading ? 0 : avgScore} sub={scoreLabel(avgScore)} color={scoreColor(avgScore)} suffix="%" icon="~" />
          <StatCard label="Best Score" value={loading ? 0 : bestScore} sub="Personal record" color="#fbbf24" suffix="%" icon="↑" />
          <StatCard label="Total Answers" value={loading ? 0 : totalAnswered} sub="Questions answered" color="#34d399" icon="#" />
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex gap-1 bg-white/3 border border-white/6 rounded-2xl p-1 w-fit mb-8">
          {(["overview", "history", "insights"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25"
                  : "text-slate-500 hover:text-slate-300"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ════════════════ OVERVIEW ════════════════ */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-5">

            {/* Row 1: Radar + Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5">
              <div className={glassCard}>
                <SectionTitle>Skill Radar</SectionTitle>
                {loading ? <div className="h-60 rounded-xl bg-white/2 animate-pulse" /> : total === 0 ? <EmptyState /> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <defs>
                        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                      <Radar dataKey="val" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={2}
                        dot={{ fill: "#818cf8", r: 4 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className={glassCard}>
                <SectionTitle>Score Trend</SectionTitle>
                {loading ? <div className="h-60 rounded-xl bg-white/2 animate-pulse" /> : trendData.length < 2 ? <EmptyState msg="Complete 2+ interviews to see trend" /> : (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gFluency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<SlickTooltip />} />
                      <Area type="monotone" dataKey="score" name="Overall" stroke="#818cf8" strokeWidth={2.5} fill="url(#gScore)"
                        dot={{ fill: "#818cf8", r: 5 }} activeDot={{ r: 7, fill: "#818cf8" }} />
                      <Area type="monotone" dataKey="fluency" name="Fluency" stroke="#38bdf8" strokeWidth={1.5} fill="url(#gFluency)" dot={false} strokeDasharray="5 3" />
                      <Line type="monotone" dataKey="clarity" name="Clarity" stroke="#34d399" strokeWidth={1.5} dot={false} strokeDasharray="3 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {!loading && trendData.length >= 2 && (
                  <div className="flex gap-5 mt-3 text-[11px] text-slate-500">
                    {[["Overall", "#818cf8"], ["Fluency", "#38bdf8"], ["Clarity", "#34d399"]].map(([l, c]) => (
                      <span key={l} className="flex items-center gap-1.5">
                        <span className="w-4 h-px inline-block rounded" style={{ background: c }} />{l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Distribution + Role bars + Ranking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={glassCard}>
                <SectionTitle>Score Distribution</SectionTitle>
                {loading ? <div className="h-44 rounded-xl bg-white/2 animate-pulse" /> : total === 0 ? <EmptyState /> : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={buckets} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={28}>
                      <XAxis dataKey="range" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<SlickTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                      <Bar dataKey="count" name="Sessions" radius={[6, 6, 0, 0]}>
                        {buckets.map((b, i) => <Cell key={i} fill={b.color} fillOpacity={0.8} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className={glassCard}>
                <SectionTitle>Practice by Role</SectionTitle>
                {loading ? <div className="h-44 rounded-xl bg-white/2 animate-pulse" /> : roleChartData.length === 0 ? <EmptyState /> : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={roleChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }} barSize={18}>
                      <XAxis dataKey="role" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<SlickTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                      <Bar dataKey="count" name="Sessions" radius={[5, 5, 0, 0]}>
                        {roleChartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className={glassCard}>
                <SectionTitle>Role Performance</SectionTitle>
                {loading ? <div className="h-44 rounded-xl bg-white/2 animate-pulse" /> : roleAvgScores.length === 0 ? <EmptyState /> : (
                  <div className="flex flex-col gap-3">
                    {roleAvgScores.map((r, i) => {
                      const meta = ROLE_META[r.role];
                      return (
                        <div key={r.role} className="flex items-center gap-3">
                          <span className="text-xs w-4 text-center font-mono" style={{ color: meta?.color || "#94a3b8" }}>{meta?.icon || "●"}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-slate-400">{meta?.short || r.role}</span>
                              <span className="text-xs font-bold tabular-nums" style={{ color: scoreColor(r.avg), fontFamily: "'DM Mono', monospace" }}>{r.avg}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${r.avg}%`, background: meta?.color || "#818cf8", opacity: 0.85 }} />
                            </div>
                          </div>
                          {i === 0 && <span className="text-amber-400 text-xs">★</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Skill arcs */}
            {!loading && total > 0 && (
              <div className={glassCard}>
                <SectionTitle>Skill Averages</SectionTitle>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { label: "Clarity",    key: "clarityScore",    color: "#818cf8" },
                    { label: "Fluency",    key: "fluencyScore",    color: "#38bdf8" },
                    { label: "Confidence", key: "confidenceScore", color: "#34d399" },
                    { label: "Relevance",  key: "relevanceScore",  color: "#fbbf24" },
                    { label: "Depth",      key: "depthScore",      color: "#f472b6" },
                  ].map(s => {
                    const v = safeAvg(s.key as keyof InterviewRecord);
                    return (
                      <div key={s.label} className="text-center">
                        <div className="w-20 h-20 mx-auto mb-2.5">
                          <ScoreRing score={v} size={80} />
                        </div>
                        <div className="text-xs font-bold text-slate-400">{s.label}</div>
                        <div className="w-4/5 mx-auto mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${v}%`, background: s.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Row 4: Recent sessions */}
            {!loading && interviews.length > 0 && (
              <div className={glassCard}>
                <div className="flex justify-between items-center mb-5">
                  <SectionTitle>Recent Sessions</SectionTitle>
                  <button className="text-violet-400 text-sm font-bold hover:text-violet-300 transition-colors"
                    onClick={() => setActiveTab("history")}>View all →</button>
                </div>
                <div className="flex flex-col gap-2">
                  {interviews.slice(0, 5).map(iv => {
                    const meta = ROLE_META[iv.role] || { color: "#94a3b8", icon: "●", short: iv.role };
                    return (
                      <div key={iv.id}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl bg-black/15 border border-white/4 hover:border-white/10 transition-all group">
                        <span className="text-sm font-mono w-5 text-center" style={{ color: meta.color }}>{meta.icon}</span>
                        <div className="flex-1">
                          <span className="text-sm font-bold text-slate-200">
                            {iv.role.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">{fmtDate(iv.createdAt)}</span>
                        <div className="flex gap-2">
                          {[iv.clarityScore, iv.fluencyScore, iv.depthScore].map((v, i) => v !== undefined ? (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md tabular-nums font-bold"
                              style={{ color: scoreColor(v), background: `${scoreColor(v)}12`, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                          ) : null)}
                        </div>
                        <span className="text-sm font-black tabular-nums min-w-12 text-right"
                          style={{ color: scoreColor(iv.overallScore ?? 0), fontFamily: "'DM Mono', monospace" }}>
                          {iv.overallScore ?? 0}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!loading && interviews.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-violet-500/8 border border-violet-500/20 flex items-center justify-center text-2xl text-violet-500 font-mono mx-auto mb-5">◎</div>
                <p className="text-slate-500 mb-6 tracking-wide">No interviews yet — start your first session</p>
                <button className="px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/")}>Begin Interview</button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ HISTORY ════════════════ */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-4">
            {!loading && interviews.length > 0 && (
              <div className="flex gap-3 mb-2">
                <input type="text" placeholder="Search by role or question…" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/3 border border-white/6 rounded-xl px-4 py-2.5 text-slate-200 text-sm placeholder-slate-600 outline-none focus:border-violet-500/40 focus:bg-white/5 transition-all"
                  style={{ fontFamily: "inherit" }} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value as "date" | "score")}
                  className="bg-white/3 border border-white/6 rounded-xl px-4 py-2.5 text-slate-400 text-sm outline-none cursor-pointer hover:border-white/15 transition-all"
                  style={{ fontFamily: "inherit" }}>
                  <option value="date">Sort: Latest</option>
                  <option value="score">Sort: Best Score</option>
                </select>
              </div>
            )}

            {loading && [1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/2 animate-pulse" />)}
            {!loading && interviews.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4 opacity-20 font-mono">◌</div>
                <p className="text-slate-500 mb-6">No interviews yet.</p>
                <button className="px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold" onClick={() => navigate("/")}>Start Interview</button>
              </div>
            )}
            {filteredInterviews.length === 0 && interviews.length > 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">No results for "{searchQuery}"</div>
            )}
            {filteredInterviews.map((iv, idx) => <HistoryCard key={iv.id} iv={iv} idx={idx} onDelete={handleDelete} />)}
          </div>
        )}

        {/* ════════════════ INSIGHTS ════════════════ */}
        {activeTab === "insights" && <InsightsTab interviews={interviews} loading={loading} navigate={navigate} />}
      </main>
    </div>
  );
};

export default Dashboard;
