import { prisma } from "@/lib/prisma";
import type { WeeklyReport, MonthlyReport, YearlyReport } from "@/types/reports";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export async function computeWeeklyReport(userId: string): Promise<WeeklyReport> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  const [commits, prs] = await Promise.all([
    prisma.commit.findMany({
      where: { repository: { userId }, date: { gte: weekStart, lte: now } },
      include: { repository: { select: { name: true } } },
    }),
    prisma.pullRequest.count({
      where: { repository: { userId }, createdAt: { gte: weekStart, lte: now } },
    }),
  ]);

  const repoCounts = new Map<string, number>();
  for (const c of commits) {
    repoCounts.set(c.repository.name, (repoCounts.get(c.repository.name) ?? 0) + 1);
  }
  const topRepo = Array.from(repoCounts.entries()).sort((a, b) => b[1] - a[1])[0];

  const highlights: string[] = [];
  if (commits.length > 0) highlights.push(`${commits.length} commits pushed this week`);
  if (topRepo) highlights.push(`Most active in ${topRepo[0]} (${topRepo[1]} commits)`);
  if (prs > 0) highlights.push(`${prs} pull request${prs === 1 ? "" : "s"} opened`);
  if (highlights.length === 0) highlights.push("No activity recorded this week");

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: now.toISOString(),
    totalCommits: commits.length,
    totalPRs: prs,
    summary:
      commits.length > 0
        ? `This week you made ${commits.length} commits across ${repoCounts.size} repositor${repoCounts.size === 1 ? "y" : "ies"}.`
        : "No commits were recorded this week.",
    highlights,
  };
}

export async function computeMonthlyReport(userId: string): Promise<MonthlyReport> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

  const [thisMonthCommits, lastMonthCommits] = await Promise.all([
    prisma.commit.findMany({
      where: { repository: { userId }, date: { gte: monthStart, lte: now } },
      include: { repository: { select: { name: true } } },
    }),
    prisma.commit.count({
      where: { repository: { userId }, date: { gte: lastMonthStart, lt: lastMonthEnd } },
    }),
  ]);

  const repoCounts = new Map<string, number>();
  for (const c of thisMonthCommits) {
    repoCounts.set(c.repository.name, (repoCounts.get(c.repository.name) ?? 0) + 1);
  }
  const topRepoEntry = Array.from(repoCounts.entries()).sort((a, b) => b[1] - a[1])[0];
  const topRepository = topRepoEntry?.[0] ?? "N/A";

  const growthVsLastMonth =
    lastMonthCommits > 0
      ? Math.round(((thisMonthCommits.length - lastMonthCommits) / lastMonthCommits) * 1000) / 10
      : thisMonthCommits.length > 0
      ? 100
      : 0;

  return {
    month: MONTH_NAMES[now.getMonth()],
    year: now.getFullYear(),
    totalCommits: thisMonthCommits.length,
    topRepository,
    growthVsLastMonth,
    summary:
      thisMonthCommits.length > 0
        ? `You made ${thisMonthCommits.length} commits this month, ${
            growthVsLastMonth >= 0 ? "up" : "down"
          } ${Math.abs(growthVsLastMonth)}% from last month. Most active repository: ${topRepository}.`
        : "No commits recorded this month yet.",
  };
}

export async function computeYearlyReport(userId: string, year?: number): Promise<YearlyReport> {
  const targetYear = year ?? new Date().getFullYear();
  const yearStart = new Date(targetYear, 0, 1);
  const yearEnd = new Date(targetYear + 1, 0, 1);

  const commits = await prisma.commit.findMany({
    where: { repository: { userId }, date: { gte: yearStart, lt: yearEnd } },
    include: { repository: { select: { name: true, language: true } } },
    orderBy: { date: "asc" },
  });

  if (commits.length === 0) {
    return {
      year: targetYear,
      totalCommits: 0,
      longestStreak: 0,
      topLanguage: "N/A",
      topRepository: "N/A",
      mostProductiveMonth: "N/A",
      summary: `No GitHub activity recorded for ${targetYear} yet.`,
    };
  }

  const dayKeys = Array.from(new Set(commits.map((c) => c.date.toISOString().slice(0, 10))))
    .map((k) => new Date(k + "T00:00:00.000Z"))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let running = 0;
  let prev: Date | null = null;
  for (const day of dayKeys) {
    if (prev) {
      const diff = Math.round((day.getTime() - prev.getTime()) / 86_400_000);
      running = diff === 1 ? running + 1 : 1;
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    prev = day;
  }

  const langCounts = new Map<string, number>();
  const repoCounts = new Map<string, number>();
  const monthCounts = new Array(12).fill(0);

  for (const c of commits) {
    const lang = c.repository.language ?? "Other";
    langCounts.set(lang, (langCounts.get(lang) ?? 0) + 1);
    repoCounts.set(c.repository.name, (repoCounts.get(c.repository.name) ?? 0) + 1);
    monthCounts[c.date.getMonth()]++;
  }

  const topLanguage = Array.from(langCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
  const topRepository = Array.from(repoCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
  const mostProductiveMonth = MONTH_NAMES[monthCounts.indexOf(Math.max(...monthCounts))];

  return {
    year: targetYear,
    totalCommits: commits.length,
    longestStreak,
    topLanguage,
    topRepository,
    mostProductiveMonth,
    summary: `In ${targetYear}, you made ${commits.length} commits with a longest streak of ${longestStreak} days. ${topLanguage} was your top language, and ${topRepository} was your most active repository.`,
  };
}