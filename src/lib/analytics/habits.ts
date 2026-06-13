import { prisma } from "@/lib/prisma";
import { TIME_SLOTS } from "@/lib/constants";
import type { HabitStats } from "@/types/analytics";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C#": "#178600",
  Ruby: "#701516",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
  HCL: "#844FBA",
  YAML: "#cb171e",
};

export async function computeHabitStats(userId: string): Promise<HabitStats> {
  const commits = await prisma.commit.findMany({
    where: { repository: { userId } },
    select: { date: true, repository: { select: { id: true, name: true, language: true } } },
  });

  if (commits.length === 0) {
    return {
      timeOfDayDistribution: Object.values(TIME_SLOTS).map((slot) => ({
        label: slot.label,
        range: slot.range as [number, number],
        percentage: 0,
      })),
      weekdayVsWeekend: { weekday: 0, weekend: 0 },
      languageDistribution: [],
      repositoryActivityPattern: [],
    };
  }

  const slotCounts: Record<string, number> = {};
  for (const slot of Object.values(TIME_SLOTS)) slotCounts[slot.label] = 0;

  for (const c of commits) {
    const hour = c.date.getUTCHours();
    for (const slot of Object.values(TIME_SLOTS)) {
      const [start, end] = slot.range;
      if (hour >= start && hour < end) {
        slotCounts[slot.label]++;
        break;
      }
    }
  }

  const total = commits.length;
  const timeOfDayDistribution = Object.values(TIME_SLOTS).map((slot) => ({
    label: slot.label,
    range: slot.range as [number, number],
    percentage: Math.round((slotCounts[slot.label] / total) * 1000) / 10,
  }));

  let weekday = 0;
  let weekend = 0;
  for (const c of commits) {
    const day = c.date.getUTCDay();
    if (day === 0 || day === 6) weekend++;
    else weekday++;
  }
  const weekdayVsWeekend = {
    weekday: Math.round((weekday / total) * 1000) / 10,
    weekend: Math.round((weekend / total) * 1000) / 10,
  };

  const langCounts = new Map<string, number>();
  for (const c of commits) {
    const lang = c.repository.language ?? "Other";
    langCounts.set(lang, (langCounts.get(lang) ?? 0) + 1);
  }

  const languageDistribution = Array.from(langCounts.entries())
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / total) * 1000) / 10,
      color: LANGUAGE_COLORS[language] ?? "#8b8b8b",
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const repoCounts = new Map<string, { repoName: string; count: number }>();
  for (const c of commits) {
    const id = c.repository.id;
    const existing = repoCounts.get(id);
    if (existing) existing.count++;
    else repoCounts.set(id, { repoName: c.repository.name, count: 1 });
  }

  const maxRepoCount = Math.max(...Array.from(repoCounts.values()).map((r) => r.count));
  const repositoryActivityPattern = Array.from(repoCounts.values())
    .map((r) => ({
      repoName: r.repoName,
      activityScore: Math.round((r.count / maxRepoCount) * 100),
    }))
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 10);

  return {
    timeOfDayDistribution,
    weekdayVsWeekend,
    languageDistribution,
    repositoryActivityPattern,
  };
}