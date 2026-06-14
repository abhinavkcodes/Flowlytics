import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeProductivityStats } from "@/lib/analytics/productivity";
import { computeRepositoryIntelligence } from "@/lib/analytics/health-score";
import { computePullRequestStats } from "@/lib/analytics/pull-requests";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  const [user, productivity, repoIntel, prStats] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    computeProductivityStats(userId),
    computeRepositoryIntelligence(userId),
    computePullRequestStats(userId),
  ]);

  const hasData = productivity.totalCommits > 0;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0d14] px-8 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.avatar && (
<Image src={user.avatar} alt={user.username ?? ""} width={44} height={44} className="rounded-full ring-2 ring-white/10" />            )}
            <div>
              <h1 className="text-lg font-semibold text-white">{user?.name ?? user?.username}</h1>
              <p className="text-sm text-white/40">@{user?.username}</p>
            </div>
          </div>
          <form action="/api/github/sync" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <span>↻</span> Sync GitHub
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-8 py-8">
        {!hasData && (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
            <p className="text-sm text-white/60">
              No data synced yet. Click{" "}
              <span className="font-medium text-indigo-400">Sync GitHub</span> above to pull your real activity.
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total Commits" value={productivity.totalCommits.toLocaleString()} accent="indigo" />
          <StatCard label="Repositories" value={repoIntel.totalRepos.toLocaleString()} accent="violet" />
          <StatCard label="Pull Requests" value={prStats.totalPRs.toLocaleString()} accent="blue" />
          <StatCard label="Total Stars" value={repoIntel.totalStars.toLocaleString()} accent="amber" />
          <StatCard label="Current Streak" value={`${productivity.currentStreak}d`} accent="emerald" />
          <StatCard label="Longest Streak" value={`${productivity.longestStreak}d`} accent="emerald" />
          <StatCard label="Consistency" value={`${productivity.consistencyScore}/100`} accent="cyan" />
          <StatCard label="Best Day" value={productivity.mostProductiveDay} accent="pink" />
        </div>

        {/* Two column */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top repos */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Top Repositories
            </h2>
            {repoIntel.topRepositories.length === 0 ? (
              <p className="text-sm text-white/30">No repositories synced yet.</p>
            ) : (
              <ul className="space-y-3">
                {repoIntel.topRepositories.slice(0, 5).map((repo) => (
                  <li key={repo.repoId} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{repo.repoName}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${repo.healthScore}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-white/40">{repo.healthScore}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Analytics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Productivity", href: "/dashboard/productivity", icon: "⚡" },
                { label: "Habits", href: "/dashboard/habits", icon: "🧠" },
                { label: "Repositories", href: "/dashboard/repositories", icon: "📦" },
                { label: "Pull Requests", href: "/dashboard/pull-requests", icon: "🔀" },
                { label: "AI Insights", href: "/dashboard/insights", icon: "✦" },
                { label: "Growth", href: "/dashboard/growth", icon: "📈" },
                { label: "Wrapped", href: "/dashboard/wrapped", icon: "🎁" },
                { label: "Settings", href: "/dashboard/settings", icon: "⚙" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:text-white"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* PR stats */}
        {hasData && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MiniStat label="Merge Rate" value={`${prStats.mergeRate}%`} />
            <MiniStat label="Avg PR Size" value={`${prStats.avgPRSizeLines} lines`} />
            <MiniStat label="PR Quality Score" value={`${prStats.prQualityScore}/10`} />
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  const accents: Record<string, string> = {
    indigo: "from-indigo-500/10 border-indigo-500/20 text-indigo-400",
    violet: "from-violet-500/10 border-violet-500/20 text-violet-400",
    blue: "from-blue-500/10 border-blue-500/20 text-blue-400",
    amber: "from-amber-500/10 border-amber-500/20 text-amber-400",
    emerald: "from-emerald-500/10 border-emerald-500/20 text-emerald-400",
    cyan: "from-cyan-500/10 border-cyan-500/20 text-cyan-400",
    pink: "from-pink-500/10 border-pink-500/20 text-pink-400",
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${accents[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wider opacity-60">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-5 py-4 flex items-center justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}