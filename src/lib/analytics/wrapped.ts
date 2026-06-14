import { prisma } from "@/lib/prisma";
import { computeYearlyReport } from "@/lib/analytics/reports";

export interface WrappedData {
  year: number;
  totalCommits: number;
  longestStreak: number;
  topLanguage: string;
  topRepository: string;
  mostProductiveMonth: string;
  totalPRs: number;
  totalStars: number;
  totalForks: number;
  reposActive: number;
  summary: string;
}

export async function generateWrapped(userId: string, year: number): Promise<WrappedData> {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);

  const [yearly, prCount, repos] = await Promise.all([
    computeYearlyReport(userId, year),
    prisma.pullRequest.count({
      where: { repository: { userId }, createdAt: { gte: yearStart, lt: yearEnd } },
    }),
    prisma.repository.findMany({
      where: { userId },
      select: {
        stars: true,
        forks: true,
        commits: {
          where: { date: { gte: yearStart, lt: yearEnd } },
          select: { id: true },
        },
      },
    }),
  ]);

  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0);
  const reposActive = repos.filter((r) => r.commits.length > 0).length;

  const data: WrappedData = {
    year,
    totalCommits: yearly.totalCommits,
    longestStreak: yearly.longestStreak,
    topLanguage: yearly.topLanguage,
    topRepository: yearly.topRepository,
    mostProductiveMonth: yearly.mostProductiveMonth,
    totalPRs: prCount,
    totalStars,
    totalForks,
    reposActive,
    summary: yearly.summary,
  };

  await prisma.wrappedSnapshot.upsert({
    where: { userId_year: { userId, year } },
    update: { data: data as object },
    create: { userId, year, data: data as object },
  });

  return data;
}

export async function getWrapped(userId: string, year: number): Promise<WrappedData> {
  const snapshot = await prisma.wrappedSnapshot.findUnique({
    where: { userId_year: { userId, year } },
  });

  if (snapshot) return snapshot.data as unknown as WrappedData;
  return generateWrapped(userId, year);
}