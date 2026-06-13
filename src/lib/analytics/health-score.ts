import { prisma } from "@/lib/prisma";
import { healthScoreConfig } from "@/config/scoring";
import type { RepositoryHealthScore, RepositoryIntelligence } from "@/types/analytics";

export async function computeRepositoryIntelligence(userId: string): Promise<RepositoryIntelligence> {
  const repos = await prisma.repository.findMany({
    where: { userId },
    include: {
      commits: { select: { date: true }, orderBy: { date: "desc" } },
      pullRequests: { select: { merged: true } },
    },
  });

  if (repos.length === 0) {
    return {
      totalRepos: 0,
      activeRepos: 0,
      totalStars: 0,
      totalForks: 0,
      topRepositories: [],
      radarMetrics: [],
    };
  }

  const now = Date.now();
  const scored: RepositoryHealthScore[] = repos.map((repo) => {
    const commitCount90d = repo.commits.filter(
      (c) => now - c.date.getTime() <= 90 * 86_400_000
    ).length;

    const commitFrequencyScore = Math.min((commitCount90d / 30) * 100, 100);

    const lastActivity = repo.pushedAt ?? repo.updatedAt;
    const daysSinceActivity = (now - lastActivity.getTime()) / 86_400_000;
    const recencyScore = Math.max(
      100 - (daysSinceActivity / healthScoreConfig.recencyDecayDays) * 100,
      0
    );

    const starsGrowth = Math.min(repo.stars * 2, 100);
    const forksGrowth = Math.min(repo.forks * 5, 100);

    const documentationScore = repo.description ? 100 : 30;

    const mergedPrs = repo.pullRequests.filter((p) => p.merged).length;
    const issueResponsiveness = repo.pullRequests.length > 0
      ? Math.min((mergedPrs / repo.pullRequests.length) * 100, 100)
      : 50;

    const weights = healthScoreConfig.weights;
    const overall =
      commitFrequencyScore * weights.commitFrequency +
      recencyScore * weights.recency +
      starsGrowth * weights.starsGrowth +
      issueResponsiveness * weights.issueResponsiveness +
      documentationScore * weights.documentation +
      50 * weights.testCoverage;

    return {
      repoId: repo.id,
      repoName: repo.name,
      healthScore: Math.round(overall),
      commitFrequencyScore: Math.round(commitFrequencyScore),
      starsGrowth: Math.round(starsGrowth),
      forksGrowth: Math.round(forksGrowth),
      recencyScore: Math.round(recencyScore),
      trend: Math.round(commitFrequencyScore - 50),
    };
  });

  await Promise.all(
    scored.map((s) =>
      prisma.repository.update({
        where: { id: s.repoId },
        data: { healthScore: s.healthScore },
      })
    )
  );

  const topRepositories = [...scored].sort((a, b) => b.healthScore - a.healthScore).slice(0, 10);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0);
  const activeRepos = repos.filter((r) => r.commits.length > 0).length;

  const avg = (key: keyof RepositoryHealthScore) =>
    Math.round(scored.reduce((sum, s) => sum + (s[key] as number), 0) / scored.length);

  const radarMetrics = [
    { metric: "Commit Frequency", value: avg("commitFrequencyScore") },
    { metric: "Recency", value: avg("recencyScore") },
    { metric: "Stars Growth", value: avg("starsGrowth") },
    { metric: "Forks Growth", value: avg("forksGrowth") },
    { metric: "Overall Health", value: avg("healthScore") },
  ];

  return {
    totalRepos: repos.length,
    activeRepos,
    totalStars,
    totalForks,
    topRepositories,
    radarMetrics,
  };
}