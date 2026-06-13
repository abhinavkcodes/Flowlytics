"use client";

import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
import { tokens as T } from "@/styles/tokens";

const COMMIT_DATA = [
  { m: "Jul", v: 44 }, { m: "Aug", v: 61 }, { m: "Sep", v: 52 },
  { m: "Oct", v: 78 }, { m: "Nov", v: 69 }, { m: "Dec", v: 89 },
];

const LANG_DATA = [
  { name: "TypeScript", pct: 41, color: T.blue },
  { name: "Python", pct: 19, color: T.cyan },
  { name: "Rust", pct: 16, color: T.orange },
  { name: "Go", pct: 12, color: T.lime },
  { name: "Other", pct: 12, color: T.textDim },
];

export function HeroDashboardPreview() {
  return (
    <div className="fadeUp relative mx-auto w-full max-w-[440px] lg:mx-0" style={{ animationDelay: ".15s" }}>
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "rgba(22,25,36,.7)",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 30px 90px -20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-text-dim">
              This week
            </p>
            <p className="font-display text-[28px] font-bold leading-none tracking-tight text-text">412 commits</p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
            style={{ background: `${T.green}14`, border: `1px solid ${T.green}28` }}
          >
            <TrendingUp size={12} strokeWidth={2.25} style={{ color: T.green }} />
            <span className="font-mono text-[11px] font-semibold" style={{ color: T.green }}>+18%</span>
          </div>
        </div>

        {/* chart */}
        <div
          className="mb-4 rounded-xl p-4"
          style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
        >
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-text-dim">
            Commit trend — 6 months
          </p>
          <ResponsiveContainer width="100%" height={84}>
            <AreaChart data={COMMIT_DATA} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="previewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.blue} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={T.blue} strokeWidth={2} fill="url(#previewGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* stats row */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Streak", value: "34d", color: T.orange },
            { label: "Score", value: "94", color: T.lime },
            { label: "PRs merged", value: "12", color: T.cyan },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-3.5 py-3"
              style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
            >
              <p className="font-display text-xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</p>
              <p className="mt-0.5 font-mono text-[10px] text-text-dim">{s.label}</p>
            </div>
          ))}
        </div>

        {/* language split */}
        <div
          className="flex items-center gap-4 rounded-xl p-4"
          style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}
        >
          <ResponsiveContainer width={52} height={52}>
            <PieChart>
              <Pie data={LANG_DATA} cx="50%" cy="50%" innerRadius={15} outerRadius={25} dataKey="pct" strokeWidth={0}>
                {LANG_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-1.5">
            {LANG_DATA.slice(0, 3).map((l) => (
              <div key={l.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-text-mid">
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                  {l.name}
                </span>
                <span className="font-mono text-[11px] font-semibold text-text">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* floating accent badges */}
      <div
        className="absolute -bottom-5 -right-5 hidden h-14 w-14 items-center justify-center rounded-2xl md:flex"
        style={{
          background: "rgba(249,115,22,.1)",
          border: "1px solid rgba(249,115,22,.22)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 12px 32px -8px rgba(0,0,0,.4)",
        }}
      >
        <Flame size={20} strokeWidth={1.75} style={{ color: T.orange }} />
      </div>
      <div
        className="absolute -left-6 top-1/4 hidden h-11 w-11 items-center justify-center rounded-2xl md:flex"
        style={{
          background: "rgba(139,92,246,.1)",
          border: "1px solid rgba(139,92,246,.22)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 12px 32px -8px rgba(0,0,0,.4)",
        }}
      >
        <Sparkles size={16} strokeWidth={1.75} style={{ color: T.purple }} />
      </div>
    </div>
  );
}