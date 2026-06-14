"use client";

import { signIn } from "next-auth/react";
import { Github, Activity, Brain, Package, Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen bg-[#03050a]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #080d18 0%, #0d1526 100%)" }}>
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", filter: "blur(80px)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}>F</div>
            <span className="text-lg font-bold text-white">Flowlytics</span>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
              Your GitHub activity,<br />
              <span className="text-blue-400">finally understood.</span>
            </h1>
            <p className="text-[#8892aa] text-base leading-relaxed">
              Connect your GitHub account and get real productivity scores, habit insights, and AI-generated growth reports.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { Icon: Activity, label: "Commit trends & streak tracking" },
              { Icon: Brain, label: "Coding habit & time-of-day analysis" },
              { Icon: Package, label: "Repository health scores" },
              { Icon: Sparkles, label: "AI-generated productivity reports" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <Icon size={15} strokeWidth={1.75} className="text-blue-400" />
                </div>
                <span className="text-sm text-[#8892aa]">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-[#3d4a63]">
          Read-only GitHub access · Free forever for individual developers
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}>F</div>
            <span className="text-lg font-bold text-white">Flowlytics</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect your GitHub</h2>
            <p className="text-sm text-[#8892aa]">
              Sign in with GitHub to start tracking your developer productivity.
            </p>
          </div>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #1f2937, #111827)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <Github size={18} strokeWidth={2} />
            Continue with GitHub
          </button>

          <div className="space-y-3 rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3d4a63]">What we access</p>
            <ul className="space-y-2 text-xs text-[#8892aa]">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Public & private repo list
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Commit history & metadata
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Pull request data
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✗</span> We never write to your repos
              </li>
            </ul>
          </div>

          <p className="text-center text-xs text-[#3d4a63]">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}