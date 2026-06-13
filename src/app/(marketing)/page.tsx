import Link from "next/link";
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

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 -top-[25%] h-[700px] w-[1100px] -translate-x-1/2"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${T.purple}24 0%, ${T.blue}14 40%, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-28 pt-[160px] text-center lg:px-8">
          {/* Badge */}
          <div
            className="fadeUp mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", animationDelay: ".1s" }}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded border" style={{ borderColor: "rgba(255,255,255,.15)" }}>
              <Star size={11} className="fill-current text-text" />
            </div>
            <span className="font-mono text-[11px] font-medium tracking-wide text-text-mid">
              AI-Powered Developer Analytics
            </span>
          </div>

          {/* Heading */}
          <h1
            className="fadeUp mb-6 font-display font-bold"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-2px", lineHeight: 1.08, animationDelay: ".2s" }}
          >
            <span style={{ color: T.text }}>See your code.</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${T.text}, ${T.textMid}, ${T.textDim})` }}
            >
              Grow as a developer.
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="fadeUp mx-auto mb-9 max-w-[560px] text-[15px] leading-[1.75] text-text-mid"
            style={{ animationDelay: ".3s", fontFamily: T.fontBody }}
          >
            Flowlytics connects to your GitHub and turns raw commits, pull requests, and
            repositories into productivity scores, coding habit patterns, and AI-generated
            coaching reports.
          </p>

          {/* CTA */}
          <div className="fadeUp mb-3 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: ".4s" }}>
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

          <p className="fadeUp mb-14 text-[13px] text-text-dim" style={{ animationDelay: ".5s", fontFamily: T.fontBody }}>
            Free forever for individual developers · Read-only GitHub access
          </p>

          {/* Tabbed live preview */}
          <HeroTabsPreview />

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
      <section className="mx-auto max-w-[1200px] px-6 pb-32 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[24px] px-8 py-20 text-center md:px-16"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,.08), rgba(37,99,235,.05))", border: "1px solid rgba(255,255,255,.08)" }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-[-60%] h-[450px] w-[800px] -translate-x-1/2"
            style={{ background: `radial-gradient(ellipse, ${T.purple}1f 0%, transparent 70%)`, filter: "blur(60px)" }}
          />
          <h2 className="relative mb-4 font-display text-[34px] font-bold tracking-tight text-text">
            Start tracking your growth.
          </h2>
          <p className="relative mb-9 text-[15px] text-text-mid" style={{ fontFamily: T.fontBody }}>
            Join thousands of developers using Flowlytics to understand how they build.
          </p>
          <Link
            href="/sign-in"
            className="relative inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 8px 24px -4px rgba(37,99,235,.45)", fontFamily: T.fontBody }}
          >
            <Github size={16} strokeWidth={2} /> Get started free
          </Link>
        </div>
      </section>
    </>
  );
}