import type { Metadata } from "next";
import { tokens as T } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore everything Flowlytics tracks: productivity, habits, repository intelligence, PR analytics, AI insights, growth, and Wrapped.",
};

const MODULES = [
  {
    icon: "⚡",
    title: "Productivity Analytics",
    points: [
      "Daily, weekly, and monthly commit trends",
      "Contribution heatmap across the year",
      "Longest coding streak & current streak tracking",
      "Consistency score (0–100)",
      "Most productive day and time of day",
    ],
  },
  {
    icon: "🧠",
    title: "Coding Habit Analysis",
    points: [
      "Morning vs. night coding pattern breakdown",
      "Weekday vs. weekend activity split",
      "Language usage distribution over time",
      "Repository-level activity patterns",
    ],
  },
  {
    icon: "🔬",
    title: "Repository Intelligence",
    points: [
      "Repository health score (0–100)",
      "Commit frequency analysis per repo",
      "Stars and forks growth tracking",
      "Top performing repositories ranked",
    ],
  },
  {
    icon: "🔀",
    title: "Pull Request Analytics",
    points: [
      "Total PRs and merge rate",
      "Average PR size and cycle time",
      "Review statistics and turnaround",
      "PR quality score out of 10",
    ],
  },
  {
    icon: "✦",
    title: "AI Insights",
    points: [
      "Productivity summary reports",
      "Weekly developer reports",
      "Growth analysis over time",
      "Strengths & weaknesses breakdown",
      "Personalized recommendations powered by AI",
    ],
  },
  {
    icon: "📈",
    title: "Developer Growth Tracking",
    points: [
      "Frontend & backend skill growth",
      "Open-source contribution trends",
      "Technology adoption over time",
      "Skill progression timeline",
    ],
  },
  {
    icon: "🎁",
    title: "GitHub Wrapped",
    points: [
      "Annual summary with commits, streaks, top language & repository",
      "Most productive month highlight",
      "Shareable visual cards for LinkedIn and X",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-8 py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-4 font-display text-[44px] font-black tracking-tight text-text">
          Every angle of your coding life.
        </h1>

        <p className="mx-auto max-w-[560px] font-mono text-base text-text-mid">
          Flowlytics breaks GitHub activity into powerful analytics modules,
          transforming raw development data into actionable insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {MODULES.map((mod) => (
          <div
            key={mod.title}
            className="card rounded-3xl border border-white/10 p-7"
          >
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "rgba(59,130,246,.1)",
                border: "1px solid rgba(59,130,246,.18)",
              }}
            >
              {mod.icon}
            </div>

            <h2 className="mb-4 font-display text-lg font-bold text-text">
              {mod.title}
            </h2>

            <ul className="space-y-2.5">
              {mod.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 font-mono text-[13px] leading-relaxed text-text-mid"
                >
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: T.blue }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}