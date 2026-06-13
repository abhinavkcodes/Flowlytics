"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { tokens as T } from "@/styles/tokens";

const MONTHLY_PREVIEW = [
  { m: "Jan", commits: 142 }, { m: "Feb", commits: 198 }, { m: "Mar", commits: 176 },
  { m: "Apr", commits: 289 }, { m: "May", commits: 241 }, { m: "Jun", commits: 334 },
  { m: "Jul", commits: 378 }, { m: "Aug", commits: 312 }, { m: "Sep", commits: 267 },
  { m: "Oct", commits: 421 }, { m: "Nov", commits: 389 }, { m: "Dec", commits: 445 },
];

const METRICS = [
  { v: "4,592", l: "Commits tracked" },
  { v: "94/100", l: "Consistency score" },
  { v: "63", l: "Day longest streak" },
  { v: "#1", l: "TypeScript user rank" },
];

export function HeroPreview() {
  return (
    <div
      className="fadeUp mt-[72px] w-full max-w-[860px] overflow-hidden rounded-[20px]"
      style={{
        animationDelay: ".25s",
        background: "rgba(255,255,255,.025)",
        border: `1px solid ${T.border}`,
        boxShadow: "0 40px 120px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#f43f5e" }} />
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#f59e0b" }} />
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#10b981" }} />
        <div className="flex-1 text-center">
          <span className="font-mono text-[11px] text-text-dim">flowlytics.app/dashboard</span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.l} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${T.border}` }}>
              <p className="font-display text-[22px] font-extrabold tracking-tight text-text">{m.v}</p>
              <p className="mt-1 font-mono text-[11px] text-text-dim">{m.l}</p>
            </div>
          ))}
        </div>
        <div
          className="flex h-[120px] items-center justify-center rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${T.border}` }}
        >
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={MONTHLY_PREVIEW}>
              <defs>
                <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.blue} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="commits" stroke={T.blue} strokeWidth={2} fill="url(#heroGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}