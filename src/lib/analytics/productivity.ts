import { prisma } from "@/lib/prisma";
import { consistencyConfig } from "@/config/scoring";
import type { ProductivityStats, CommitTrendPoint } from "@/types/analytics";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function computeProductivityStats(userId: string): Promise<ProductivityStats> {
  const commits = await prisma.commit.findMany({
    where: { repository: { userId } },
    select: { date: true, additions: true, deletions: true },
    orderBy: { date: "asc" },
  });

  const totalCommits = commits.length;

  if (totalCommits === 0) {
    return emptyStats();
  }

  const dayKeys = new Set(commits.map((c) => toDayKey(c.date)));
  const { currentStreak, longestStreak } = computeStreaks(dayKeys);

  const consistencyScore = computeConsistencyScore(commits.map((c) => c.date));

  const dayCounts = new Array(7).fill(0);
  const hourCounts = new Array(24).fill(0);
  for (const c of commits) {
    dayCounts[c.date.getUTCDay()]++;
    hourCounts[c.date.getUTCHours()]++;
  }
  const mostProductiveDayIdx = dayCounts.indexOf(Math.max(...dayCounts));
  const mostProductiveHour = hourCounts.indexOf(Math.max(...hourCounts));

  const monthlyTrend = buildMonthlyTrend(commits, 12);
  const weeklyTrend = buildWeeklyTrend(commits, 12);
  const hourlyDistribution = hourCounts.map((commits, hour) => ({ hour, commits }));

  return {
    totalCommits,
    currentStreak,
    longestStreak,
    consistencyScore,
    mostProductiveDay: DAY_NAMES[mostProductiveDayIdx],
    mostProductiveHour,
    monthlyTrend,
    weeklyTrend,
    hourlyDistribution,
  };
}

function emptyStats(): ProductivityStats {
  return {
    totalCommits: 0,
    currentStreak: 0,
    longestStreak: 0,
    consistencyScore: 0,
    mostProductiveDay: "N/A",
    mostProductiveHour: 0,
    monthlyTrend: [],
    weeklyTrend: [],
    hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({ hour, commits: 0 })),
  };
}

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function computeStreaks(dayKeys: Set<string>): { currentStreak: number; longestStreak: number } {
  const sortedDays = Array.from(dayKeys)
    .map((k) => new Date(k + "T00:00:00.000Z"))
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let runningStreak = 0;
  let prev: Date | null = null;

  for (const day of sortedDays) {
    if (prev) {
      const diffDays = Math.round((day.getTime() - prev.getTime()) / 86_400_000);
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1;
    } else {
      runningStreak = 1;
    }
    longestStreak = Math.max(longestStreak, runningStreak);
    prev = day;
  }

  let currentStreak = 0;
  const today = new Date();
  const todayKey = toDayKey(today);
  const yesterday = new Date(today.getTime() - 86_400_000);
  const yesterdayKey = toDayKey(yesterday);

  if (dayKeys.has(todayKey) || dayKeys.has(yesterdayKey)) {
    let cursor = dayKeys.has(todayKey) ? new Date(todayKey + "T00:00:00.000Z") : new Date(yesterdayKey + "T00:00:00.000Z");
    while (dayKeys.has(toDayKey(cursor))) {
      currentStreak++;
      cursor = new Date(cursor.getTime() - 86_400_000);
    }
  }

  return { currentStreak, longestStreak };
}

function computeConsistencyScore(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const weekMap = new Map<string, Set<string>>();
  for (const date of dates) {
    const weekKey = isoWeekKey(date);
    const dayKey = toDayKey(date);
    if (!weekMap.has(weekKey)) weekMap.set(weekKey, new Set());
    weekMap.get(weekKey)!.add(dayKey);
  }

  const totalWeeks = weekMap.size;
  if (totalWeeks === 0) return 0;

  let qualifyingWeeks = 0;
  for (const days of weekMap.values()) {
    if (days.size >= consistencyConfig.minActiveDaysPerWeek) qualifyingWeeks++;
  }

  const consistencyRatio = qualifyingWeeks / totalWeeks;
  const volumeFactor = Math.min(dates.length / consistencyConfig.maxStreakForFullScore, 1);

  const score = (consistencyRatio * 0.7 + volumeFactor * 0.3) * 100;
  return Math.round(Math.min(Math.max(score, 0), 100));
}

function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const weekNum = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86_400_000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function buildMonthlyTrend(
  commits: { date: Date; additions: number; deletions: number }[],
  months: number
): CommitTrendPoint[] {
  const buckets = new Map<string, CommitTrendPoint>();
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { date: key, commits: 0, additions: 0, deletions: 0 });
  }

  for (const c of commits) {
    const key = `${c.date.getFullYear()}-${String(c.date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.commits++;
      bucket.additions = (bucket.additions ?? 0) + c.additions;
      bucket.deletions = (bucket.deletions ?? 0) + c.deletions;
    }
  }

  return Array.from(buckets.values());
}

function buildWeeklyTrend(
  commits: { date: Date; additions: number; deletions: number }[],
  weeks: number
): CommitTrendPoint[] {
  const buckets = new Map<string, CommitTrendPoint>();
  const now = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 86_400_000);
    const key = isoWeekKey(d);
    buckets.set(key, { date: key, commits: 0, additions: 0, deletions: 0 });
  }

  for (const c of commits) {
    const key = isoWeekKey(c.date);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.commits++;
      bucket.additions = (bucket.additions ?? 0) + c.additions;
      bucket.deletions = (bucket.deletions ?? 0) + c.deletions;
    }
  }

  return Array.from(buckets.values());
}