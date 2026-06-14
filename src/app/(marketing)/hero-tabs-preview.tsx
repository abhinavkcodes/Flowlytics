"use client";

import { useState, useEffect, useMemo, useRef, type MouseEvent } from "react";
import {
  Activity,
  Brain,
  Package,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Flame,
  GitPullRequest,
  Moon,
  Sun,
  Clock,
  Star,
  Zap,
} from "lucide-react";
import { tokens as T } from "@/styles/tokens";

type TabId = "productivity" | "habits" | "repos" | "insights";

const TABS: { id: TabId; label: string; Icon: typeof Activity }[] = [
  { id: "productivity", label: "Productivity", Icon: Activity },
  { id: "habits", label: "Habits", Icon: Brain },
  { id: "repos", label: "Repositories", Icon: Package },
  { id: "insights", label: "AI Insights", Icon: Sparkles },
];

/* ── Minimal GitHub-style heatmap (no container box) ─────────────────── */
type ContributionDay = {
  color: string;
  contributionCount: number;
  contributionLevel: string;
  date: string;
};

const USERNAME = "abhinavkcodes";

function useGithubContributions() {
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch_ = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.deno.dev/${USERNAME}.json?t=${Date.now()}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        if (mounted) setWeeks(data.contributions ?? []);
      } catch {
        // silently fail – heatmap just won't render
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch_();
    const iv = setInterval(fetch_, 60_000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  return { weeks, loading };
}

function MinimalHeatmap() {
  const { weeks, loading } = useGithubContributions();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{ label: string; left: number; top: number } | null>(null);

  const totalContributions = useMemo(
    () => weeks.flat().reduce((s, d) => s + d.contributionCount, 0),
    [weeks]
  );

  const thresholds = useMemo(() => {
    const counts = weeks.flat().map((d) => d.contributionCount).filter((c) => c > 0).sort((a, b) => a - b);
    if (!counts.length) return { q1: 0, q2: 0, q3: 0 };
    return {
      q1: counts[Math.floor(counts.length * 0.25)],
      q2: counts[Math.floor(counts.length * 0.5)],
      q3: counts[Math.floor(counts.length * 0.75)],
    };
  }, [weeks]);

  const cellColor = (count: number) => {
    if (count === 0) return "rgba(255,255,255,.04)";
    const { q1, q2, q3 } = thresholds;
    if (count <= q1) return "#0d2a4d";
    if (count <= q2) return "#0969DA";
    if (count <= q3) return "#58A6FF";
    return "#AED6F1";
  };

  const cellShadow = (count: number) =>
    count > 0 ? "0 0 3px rgba(88,166,255,0.18)" : undefined;

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 font-mono text-[10px] uppercase tracking-widest text-text-dim">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        Loading contributions…
      </div>
    );
  }

  return (
    <div ref={chartRef} className="relative w-full overflow-x-auto">
      {/* tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg bg-black px-2 py-1 text-[10px] text-white"
          style={{ left: tooltip.left, top: tooltip.top, transform: "translate(-50%, -110%)" }}
        >
          {tooltip.label}
        </div>
      )}

      {/* header row */}
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
        <span>{totalContributions.toLocaleString()} contributions · last year</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {["rgba(255,255,255,.04)", "#0d2a4d", "#0969DA", "#58A6FF", "#AED6F1"].map((c, i) => (
            <span key={i} className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* month labels */}
      <div className="relative mb-1 h-4 text-[9px] text-text-dim">
        {weeks.map((week, wi) => {
          const first = week[0];
          if (!first) return null;
          const month = new Date(first.date).toLocaleString("en-US", { month: "short" });
          const prev = wi > 0 ? new Date(weeks[wi - 1][0]?.date).toLocaleString("en-US", { month: "short" }) : null;
          if (month === prev) return null;
          return (
            <span key={wi} className="absolute" style={{ left: wi * 15 + 28 }}>
              {month}
            </span>
          );
        })}
      </div>

      {/* grid */}
      <div className="flex gap-[4px]">
        {/* day labels */}
        <div className="grid grid-rows-7 text-[8px] text-text-dim">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} className="flex h-[11px] w-6 items-center justify-end pr-1">{d}</div>
          ))}
        </div>

        {/* cells */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-rows-7 gap-[3px]">
              {week.map((day) => {
                const label = `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`;
                return (
                  <div
                    key={day.date}
                    aria-label={label}
                    className="h-[11px] w-[11px] rounded-[2px] transition-all duration-200 hover:scale-125"
                    style={{ background: cellColor(day.contributionCount), boxShadow: cellShadow(day.contributionCount) }}
                    onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
                      if (!chartRef.current) return;
                      const rect = chartRef.current.getBoundingClientRect();
                      setTooltip({ label, left: e.clientX - rect.left, top: e.clientY - rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Shared: circular progress ring ─────────────────────────────────── */
function ProgressRing({
  value,
  size = 72,
  strokeWidth = 6,
  color,
  trackColor = "rgba(255,255,255,.06)",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
      />
    </svg>
  );
}

/* ── Shared: panel section label ────────────────────────────────────── */
function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: color ?? T.textDim }}
    >
      {children}
    </p>
  );
}

export function HeroTabsPreview() {
  const [active, setActive] = useState<TabId>("productivity");

  useEffect(() => {
    const order: TabId[] = ["productivity", "habits", "repos", "insights"];
    const interval = setInterval(() => {
      setActive((curr) => {
        const idx = order.indexOf(curr);
        return order[(idx + 1) % order.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fadeUp w-full" style={{ animationDelay: ".6s" }}>
      {/* Tab bar */}
      <div
        className="mx-auto mb-6 flex w-fit gap-1 rounded-xl p-1"
        style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="relative flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-medium transition-all duration-300"
            style={{
              background: active === id
                ? "linear-gradient(135deg, rgba(59,130,246,.22), rgba(139,92,246,.16))"
                : "transparent",
              boxShadow: active === id ? "inset 0 1px 0 rgba(255,255,255,.08), 0 4px 14px -4px rgba(59,130,246,.35)" : "none",
              color: active === id ? T.text : T.textDim,
              fontFamily: T.fontBody,
            }}
          >
            <Icon size={15} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {/* Preview panel */}
      <div
        className="relative mx-auto overflow-hidden rounded-2xl"
        style={{
          maxWidth: 880,
          minHeight: 360,
          background: "rgba(22,25,36,.7)",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 30px 90px -20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* ambient gradient glow */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${T.blue}55, transparent 70%)`, filter: "blur(40px)" }}
        />

        {active === "productivity" && <ProductivityPanel />}
        {active === "habits" && <HabitsPanel />}
        {active === "repos" && <ReposPanel />}
        {active === "insights" && <InsightsPanel />}
      </div>
    </div>
  );
}

/* ── Panel: Productivity ────────────────────────────────────────────── */
function ProductivityPanel() {
  const stats = [
    { label: "Longest streak", value: "63 days", delta: "+8 vs last month", color: T.orange, Icon: Flame },
    { label: "Most productive day", value: "Saturday", delta: "4 of last 5 weeks", color: T.lime, Icon: Activity },
    { label: "Peak coding hour", value: "11 PM", delta: "Deep focus window", color: T.purple, Icon: Zap },
  ];

  return (
    <div className="relative animate-fade-in-overlay p-7">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex h-[72px] w-[72px] items-center justify-center">
            <ProgressRing value={94} color={T.blue} />
            <span className="absolute font-display text-lg font-bold tracking-tight text-text">94</span>
          </div>
          <div>
            <SectionLabel>Consistency score</SectionLabel>
            <p className="font-display text-[26px] font-bold leading-none tracking-tight text-text">
              94<span className="text-text-dim text-base font-medium"> / 100</span>
            </p>
            <p className="mt-1.5 text-[12px] text-text-mid">Elite-tier shipping consistency</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: `linear-gradient(135deg, ${T.green}1f, ${T.lime}14)`, border: `1px solid ${T.green}33` }}
        >
          <TrendingUp size={12} strokeWidth={2.25} style={{ color: T.green }} />
          <span className="font-mono text-[11px] font-semibold" style={{ color: T.green }}>Top 4% of devs</span>
        </div>
      </div>

      <div className="mb-4">
        <MinimalHeatmap />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-xl px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
          >
            <div
              className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: `${s.color}14`, border: `1px solid ${s.color}28` }}
            >
              <s.Icon size={14} strokeWidth={1.75} style={{ color: s.color }} />
            </div>
            <p className="font-display text-base font-bold tracking-tight text-text">{s.value}</p>
            <p className="mt-0.5 font-mono text-[10px] leading-tight text-text-dim">{s.label}</p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-text-mid">{s.delta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Panel: Habits ───────────────────────────────────────────────────── */
function HabitsPanel() {
  const timeSlots = [
    { label: "Late night · 12–6am", pct: 14, color: T.purple, Icon: Moon },
    { label: "Morning · 6–12pm", pct: 18, color: T.amber, Icon: Sun },
    { label: "Afternoon · 12–6pm", pct: 26, color: T.lime, Icon: Sun },
    { label: "Evening · 6–10pm", pct: 13, color: T.cyan, Icon: Moon },
    { label: "Night · 10pm–12", pct: 29, color: T.blue, Icon: Moon },
  ];

  return (
    <div className="relative animate-fade-in-overlay p-7">
      <div className="mb-5">
        <SectionLabel>Coding habit analysis</SectionLabel>
        <p className="font-display text-xl font-bold tracking-tight text-text">When you do your best work</p>
      </div>

      {/* Peak window highlight */}
      <div
        className="mb-4 flex items-center gap-4 overflow-hidden rounded-xl p-4"
        style={{ background: `linear-gradient(135deg, ${T.blue}14, ${T.purple}0d)`, border: `1px solid ${T.blue}28` }}
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${T.blue}1f`, border: `1px solid ${T.blue}38` }}>
          <Moon size={18} strokeWidth={1.75} style={{ color: T.blueHi }} />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-text">Night owl pattern detected</p>
          <p className="text-[12px] text-text-mid">Your peak window is <span className="font-semibold text-text">10pm – midnight</span>, capturing 29% of weekly output.</p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold tracking-tight" style={{ color: T.blueHi }}>29%</p>
          <p className="font-mono text-[10px] text-text-dim">of total activity</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}>
        {timeSlots.map((s) => (
          <div key={s.label} className="mb-3 last:mb-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-xs text-text-mid">
                <s.Icon size={11} strokeWidth={1.75} style={{ color: s.color }} />
                {s.label}
              </span>
              <span className="font-display text-[13px] font-bold" style={{ color: s.color }}>{s.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.pct * 3}%`, background: `linear-gradient(90deg, ${s.color}66, ${s.color})`, boxShadow: `0 0 10px ${s.color}55` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: `${T.blue}10`, border: `1px solid ${T.blue}22` }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${T.blue}1f` }}>
            <Zap size={15} strokeWidth={1.75} style={{ color: T.blueHi }} />
          </div>
          <div>
            <p className="font-display text-2xl font-bold leading-none tracking-tight" style={{ color: T.blue }}>62%</p>
            <p className="mt-1 font-mono text-[11px] text-text-dim">Weekday activity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: `${T.pink}10`, border: `1px solid ${T.pink}22` }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${T.pink}1f` }}>
            <Sparkles size={15} strokeWidth={1.75} style={{ color: T.pink }} />
          </div>
          <div>
            <p className="font-display text-2xl font-bold leading-none tracking-tight" style={{ color: T.pink }}>38%</p>
            <p className="mt-1 font-mono text-[11px] text-text-dim">Weekend activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Panel: Repositories ─────────────────────────────────────────────── */
function ReposPanel() {
  const repos = [
    { rank: 1, name: "neural-cache", lang: "Rust", score: 96, stars: "1.2K", trend: "+12%", color: T.orange, up: true },
    { rank: 2, name: "flowlytics", lang: "TypeScript", score: 93, stars: "934", trend: "+6%", color: T.blue, up: true },
    { rank: 3, name: "ml-datastream", lang: "Python", score: 88, stars: "678", trend: "-2%", color: T.cyan, up: false },
  ];

  const medalColor = (rank: number) =>
    rank === 1 ? T.amber : rank === 2 ? "#c4ccdb" : "#b8743a";

  return (
    <div className="relative animate-fade-in-overlay p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <SectionLabel>Repository intelligence</SectionLabel>
          <p className="font-display text-xl font-bold tracking-tight text-text">Your top performing repos</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: `${T.cyan}14`, border: `1px solid ${T.cyan}28` }}>
          <Star size={12} strokeWidth={2.25} style={{ color: T.cyan }} />
          <span className="font-mono text-[11px] font-semibold" style={{ color: T.cyan }}>2.8K total stars</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {repos.map((r) => (
          <div
            key={r.name}
            className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-display text-xs font-bold"
              style={{ background: `${medalColor(r.rank)}1f`, border: `1px solid ${medalColor(r.rank)}40`, color: medalColor(r.rank) }}
            >
              #{r.rank}
            </div>

            <div className="flex-1">
              <div className="mb-1.5 flex items-center gap-2.5">
                <span className="font-display text-sm font-semibold text-text">{r.name}</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-mid">
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                  {r.lang}
                </span>
                <span
                  className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                  style={{
                    color: r.up ? T.green : T.rose,
                    background: r.up ? `${T.green}14` : `${T.rose}14`,
                  }}
                >
                  {r.up ? <TrendingUp size={10} strokeWidth={2.5} /> : <TrendingDown size={10} strokeWidth={2.5} />}
                  {r.trend}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: `linear-gradient(90deg, ${T.cyan}, ${T.lime})`, boxShadow: `0 0 8px ${T.lime}55` }} />
              </div>
            </div>

            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <ProgressRing value={r.score} size={48} strokeWidth={4} color={T.lime} />
              <span className="absolute font-display text-xs font-bold text-lime">{r.score}</span>
            </div>

            <div className="hidden text-right sm:block">
              <p className="flex items-center justify-end gap-1 font-display text-sm font-bold text-text">
                <Star size={11} strokeWidth={2} style={{ color: T.amber }} />
                {r.stars}
              </p>
              <p className="font-mono text-[10px] text-text-dim">stars</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Panel: AI Insights ──────────────────────────────────────────────── */
function InsightsPanel() {
  const insights = [
    { title: "PR cycle time opportunity", body: "Your PRs average 4.1 days to merge — 2x optimal. Smaller commits would cut this to under 48 hours.", impact: "High impact", confidence: 92, color: T.amber, Icon: GitPullRequest },
    { title: "Deep work after 10PM", body: "71% of your highest-quality commits happen between 10PM and 1AM. Protect this window.", impact: "Medium impact", confidence: 87, color: T.purple, Icon: Sparkles },
    { title: "October surge pattern", body: "For 3 consecutive years, October is your most productive month (+38% average).", impact: "Seasonal trend", confidence: 95, color: T.rose, Icon: TrendingUp },
  ];

  return (
    <div className="relative animate-fade-in-overlay p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${T.purple}1f`, border: `1px solid ${T.purple}38` }}>
            <Sparkles size={13} strokeWidth={2} style={{ color: T.purple }} />
          </div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: T.purple }}>
            AI-generated this week
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
          <Clock size={11} strokeWidth={2} />
          Updated 2h ago
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((ins) => (
          <div
            key={ins.title}
            className="group flex gap-3.5 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${ins.color}14`, border: `1px solid ${ins.color}28` }}>
              <ins.Icon size={15} strokeWidth={1.75} style={{ color: ins.color }} />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="font-display text-[13px] font-semibold text-text">{ins.title}</p>
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wide"
                  style={{ color: ins.color, background: `${ins.color}14`, border: `1px solid ${ins.color}28` }}
                >
                  {ins.impact}
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-text-mid" style={{ fontFamily: T.fontBody }}>{ins.body}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1 w-20 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${ins.confidence}%`, background: ins.color }} />
                </div>
                <span className="font-mono text-[10px] text-text-dim">{ins.confidence}% confidence</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}