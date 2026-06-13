import { prisma } from "@/lib/prisma";
import { growthConfig } from "@/config/scoring";
import type { DeveloperGrowth, GrowthMetric } from "@/types/analytics";

export async function computeDeveloperGrowth(userId: string): Promise<DeveloperGrowth> {
  const repos = await prisma.repository.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      language: true,
      createdAt: true,
      commits: { select: { date: true } },
    },
  });

  if (repos.length === 0) {
    return { skills: [], technologyAdoption: [], timeline: [] };
  }

  const now = new Date();
  const lookbackStart = new Date(now);
  lookbackStart.setMonth(lookbackStart.getMonth() - growthConfig.lookbackMonths);
  const midpoint = new Date(now);
  midpoint.setMonth(midpoint.getMonth() - growthConfig.lookbackMonths / 2);

  const recentCounts = new Map<string, number>();
  const earlierCounts = new Map<string, number>();
  const allTimeCounts = new Map<string, number>();

  for (const repo of repos) {
    const lang = repo.language ?? "Other";
    for (const c of repo.commits) {
      if (c.date < lookbackStart) continue;
      allTimeCounts.set(lang, (allTimeCounts.get(lang) ?? 0) + 1);
      if (c.date >= midpoint) {
        recentCounts.set(lang, (recentCounts.get(lang) ?? 0) + 1);
      } else {
        earlierCounts.set(lang, (earlierCounts.get(lang) ?? 0) + 1);
      }
    }
  }

  const totalAllTime = Array.from(allTimeCounts.values()).reduce((a, b) => a + b, 0);

  const technologyAdoption = Array.from(allTimeCounts.entries())
    .map(([language, count]) => {
      const recent = recentCounts.get(language) ?? 0;
      const earlier = earlierCounts.get(language) ?? 0;
      const trend = earlier === 0 ? (recent > 0 ? 100 : 0) : Math.round(((recent - earlier) / earlier) * 100);
      return {
        language,
        usagePercentage: totalAllTime > 0 ? Math.round((count / totalAllTime) * 1000) / 10 : 0,
        trend,
      };
    })
    .sort((a, b) => b.usagePercentage - a.usagePercentage);

  const skills: GrowthMetric[] = (["frontend", "backend", "devops"] as const).map((category) => {
    const langs = growthConfig.categories[category];
    const recentSum = sumForLanguages(recentCounts, langs);
    const earlierSum = sumForLanguages(earlierCounts, langs);
    const allSum = sumForLanguages(allTimeCounts, langs);

    const level = totalAllTime > 0 ? Math.round((allSum / totalAllTime) * 100) : 0;
    const trend = earlierSum === 0 ? (recentSum > 0 ? 100 : 0) : Math.round(((recentSum - earlierSum) / earlierSum) * 100);

    return {
      category,
      label: capitalize(category),
      level,
      trend,
    };
  });

  const activeOss = repos.filter((r) => r.commits.some((c) => c.date >= lookbackStart)).length;
  skills.push({
    category: "openSource",
    label: "Open Source",
    level: Math.min(activeOss * 10, 100),
    trend: 0,
  });

  const timelineMap = new Map<string, { primaryLanguage: string; repoName: string }>();
  for (const repo of repos) {
    const year = String(repo.createdAt.getFullYear());
    if (!timelineMap.has(year)) {
      timelineMap.set(year, { primaryLanguage: repo.language ?? "Other", repoName: repo.name });
    }
  }

  const timeline = Array.from(timelineMap.entries())
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, info]) => ({
      year,
      event: `Started working on ${info.repoName}`,
      primaryLanguage: info.primaryLanguage,
    }));

  return { skills, technologyAdoption, timeline };
}

function sumForLanguages(counts: Map<string, number>, languages: readonly string[]): number {
  let total = 0;
  for (const lang of languages) {
    total += counts.get(lang) ?? 0;
  }
  return total;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}