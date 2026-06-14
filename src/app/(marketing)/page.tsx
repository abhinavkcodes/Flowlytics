"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef, type MouseEvent } from "react";
import {
  Github,
  ArrowRight,
  Star,
  Activity,
  Brain,
  Package,
  GitPullRequest,
  Sparkles,
  Gift,
} from "lucide-react";
import { tokens as T } from "@/styles/tokens";
import { HeroTabsPreview } from "./hero-tabs-preview";
import { IntegrationsStrip } from "./integrations-strip";

const FEATURES = [
  { Icon: Activity, title: "Commit Analytics", desc: "Daily, weekly, and monthly commit trends with streak tracking and consistency scoring." },
  { Icon: Brain, title: "Habit Analysis", desc: "Morning vs night patterns, weekday vs weekend activity, and coding rhythm breakdown." },
  { Icon: Package, title: "Repo Intelligence", desc: "Health scores, star tracking, activity trends, and top performing repositories." },
  { Icon: GitPullRequest, title: "PR Analytics", desc: "Merge rates, review cycles, PR quality scores, and team collaboration insights." },
  { Icon: Sparkles, title: "AI Insights", desc: "Claude-powered personalized reports covering strengths, gaps, and growth recommendations." },
  { Icon: Gift, title: "Dev Wrapped", desc: "Your annual coding summary as shareable visual cards — GitHub meets Spotify Wrapped." },
];
type ContributionDay = {
  contributionCount: number;
  date: string;
};

// Deterministic pseudo-random generator so the demo heatmap looks
// consistent across renders without depending on live GitHub data.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function useMockContributions() {
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rand = seededRandom(42);
    const totalDays = 53 * 7;
    const today = new Date();
    // Align to the most recent Sunday so the grid lines up like GitHub's.
    const end = new Date(today);
    end.setDate(end.getDate() - end.getDay());

    const days: ContributionDay[] = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(end);
      date.setDate(date.getDate() - i);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Mostly active, with occasional rest days and a few bursty streaks.
      let count = 0;
      const r = rand();
      if (r < 0.08) {
        count = 0; // rest day
      } else if (r < 0.4) {
        count = Math.floor(rand() * 3) + 1; // light
      } else if (r < 0.78) {
        count = Math.floor(rand() * 5) + 3; // active
      } else {
        count = Math.floor(rand() * 8) + 7; // heavy / streak
      }
      if (isWeekend) count = Math.round(count * 0.6);

      days.push({ contributionCount: count, date: date.toISOString().slice(0, 10) });
    }

    const weeksArr: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }

    setWeeks(weeksArr);
    setLoading(false);
  }, []);

  return { weeks, loading };
}

function HeroHeatmap() {
  const { weeks, loading } = useMockContributions();
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ label: string; left: number; top: number } | null>(null);

  const thresholds = useMemo(() => {
    const counts = weeks.flat().map((d) => d.contributionCount).filter((c) => c > 0).sort((a, b) => a - b);
    if (!counts.length) return { q1: 0, q2: 0, q3: 0 };
    return {
      q1: counts[Math.floor(counts.length * 0.25)],
      q2: counts[Math.floor(counts.length * 0.5)],
      q3: counts[Math.floor(counts.length * 0.75)],
    };
  }, [weeks]);

  const stats = useMemo(() => {
    const days = weeks.flat();
    const total = days.reduce((sum, d) => sum + d.contributionCount, 0);
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) current++;
      else break;
    }
    let longest = 0, run = 0;
    for (const d of days) {
      if (d.contributionCount > 0) { run++; longest = Math.max(longest, run); }
      else run = 0;
    }
    return { total, current, longest };
  }, [weeks]);

  const cellColor = (count: number) => {
    if (count === 0) return "rgba(255,255,255,.05)";
    const { q1, q2, q3 } = thresholds;
    if (count <= q1) return "#0d2a4d";
    if (count <= q2) return "#0969DA";
    if (count <= q3) return "#58A6FF";
    return "#AED6F1";
  };

  if (loading) return (
    <div className="flex h-[220px] w-full items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: T.blueHi }} />
        Reading commit history…
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative w-full">
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-md px-2 py-1 font-mono text-[10px] text-white whitespace-nowrap"
          style={{ left: tooltip.left, top: tooltip.top, transform: "translate(-50%, -125%)", background: "#000" }}
        >
          {tooltip.label}
        </div>
      )}

      {/* eyebrow */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
          Contribution activity
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.green }} />
          sample preview
        </span>
      </div>

      {/* month labels */}
      <div className="relative mb-2 h-4 text-[10px] text-text-dim" style={{ fontFamily: T.fontMono }}>
        {weeks.map((week, wi) => {
          const first = week[0];
          if (!first) return null;
          const month = new Date(first.date).toLocaleString("en-US", { month: "short" });
          const prev = wi > 0 ? new Date(weeks[wi - 1][0]?.date).toLocaleString("en-US", { month: "short" }) : null;
          if (month === prev) return null;
          return <span key={wi} className="absolute" style={{ left: wi * 14 }}>{month}</span>;
        })}
      </div>

      {/* cells */}
      <div className="flex gap-[3.5px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-rows-7 gap-[3.5px]">
            {week.map((day) => {
              const label = `${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`;
              return (
                <div
                  key={day.date}
                  className="h-[11px] w-[11px] rounded-[2px] transition-transform duration-150 hover:scale-125"
                  style={{ background: cellColor(day.contributionCount) }}
                  onMouseMove={(e: MouseEvent<HTMLDivElement>) => {
                    if (!ref.current) return;
                    const rect = ref.current.getBoundingClientRect();
                    setTooltip({ label, left: e.clientX - rect.left, top: e.clientY - rect.top });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* stat readout */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-t pt-5" style={{ borderColor: "rgba(255,255,255,.06)" }}>
        <div>
          <p className="font-display text-xl font-bold text-text">{stats.total.toLocaleString()}</p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-dim">contributions / yr</p>
        </div>
        <div>
          <p className="font-display text-xl font-bold text-text">{stats.longest}</p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-dim">longest streak</p>
        </div>
        <div>
          <p className="font-display text-xl font-bold" style={{ color: stats.current > 0 ? T.green : T.textDim }}>
            {stats.current}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-dim">current streak</p>
        </div>
      </div>
    </div>
  );
}
export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 -top-[30%] h-[700px] w-[1300px] -translate-x-1/2"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${T.purple}1c 0%, ${T.blue}10 40%, transparent 70%)`,
            filter: "blur(100px)",
          }}
        />
        {/* subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1240px] px-6 pb-28 pt-[140px] lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            {/* Left: copy */}
            <div>
              {/* Eyebrow */}
              <div
                className="fadeUp mb-6 flex items-center gap-2.5"
                style={{ animationDelay: ".1s" }}
              >
                <span
                  className="h-px w-8"
                  style={{ background: `linear-gradient(90deg, ${T.blueHi}, transparent)` }}
                />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-text-mid">
                  Developer analytics, reimagined
                </span>
              </div>

              {/* Heading */}
              <h1
                className="fadeUp mb-6 font-display font-bold"
                style={{ fontSize: "clamp(40px, 5.5vw, 70px)", letterSpacing: "-2.5px", lineHeight: 1.04, animationDelay: ".2s" }}
              >
                <span style={{ color: T.text }}>Your code,</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${T.blueHi}, ${T.purple})` }}
                >
                  quantified.
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="fadeUp mb-10 max-w-[460px] text-[16px] leading-[1.75] text-text-mid"
                style={{ animationDelay: ".3s", fontFamily: T.fontBody }}
              >
                Flowlytics connects to your GitHub and turns raw commits, pull requests,
                and repositories into productivity scores, coding habit patterns, and
                AI-generated coaching reports — so you always know how you're growing.
              </p>

              {/* CTA */}
              <div className="fadeUp mb-8 flex flex-wrap items-center gap-3" style={{ animationDelay: ".4s" }}>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 8px 24px -4px rgba(37,99,235,.45)", fontFamily: T.fontBody }}
                >
                  <Github size={16} strokeWidth={2} /> Connect GitHub
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-text-mid transition-colors hover:border-white/[0.14] hover:text-text"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", fontFamily: T.fontBody }}
                >
                  See how it works <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>

              {/* Quick facts row */}
              <div className="fadeUp flex flex-wrap items-center gap-x-8 gap-y-3" style={{ animationDelay: ".5s" }}>
                <div className="flex items-center gap-2">
                  <Star size={13} className="fill-current" style={{ color: T.amber }} />
                  <span className="text-[13px] text-text-mid" style={{ fontFamily: T.fontBody }}>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.green }} />
                  <span className="text-[13px] text-text-mid" style={{ fontFamily: T.fontBody }}>Read-only GitHub access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={13} style={{ color: T.purple }} />
                  <span className="text-[13px] text-text-mid" style={{ fontFamily: T.fontBody }}>AI coaching included</span>
                </div>
              </div>
            </div>

            {/* Right: heatmap preview */}
            <div className="fadeUp" style={{ animationDelay: ".35s" }}>
              <HeroHeatmap />
            </div>
          </div>

          {/* Integrations */}
          <IntegrationsStrip />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 lg:px-8">
        <div className="mb-16 max-w-[600px]">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-text-dim">
            Platform
          </p>
          <h2 className="mb-4 font-display text-[34px] font-bold tracking-tight text-text">
            Everything you need to grow
          </h2>
          <p className="text-[15px] leading-relaxed text-text-mid" style={{ fontFamily: T.fontBody }}>
            Seven analytics modules working together — from commit-level detail to your
            annual developer Wrapped.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] sm:grid-cols-2 lg:grid-cols-3" style={{ background: "rgba(255,255,255,.04)" }}>
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="fadeUp group relative p-8 transition-colors hover:bg-white/[0.015]"
              style={{ background: T.bg, animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors"
                style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <Icon size={18} strokeWidth={1.75} style={{ color: T.blueHi }} />
              </div>
              <h3 className="mb-2 font-display text-[15px] font-semibold text-text">{title}</h3>
              <p className="text-[13px] leading-relaxed text-text-mid" style={{ fontFamily: T.fontBody }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      
    </>
  );
}