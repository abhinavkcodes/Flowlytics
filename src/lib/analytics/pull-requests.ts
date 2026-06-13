import { prisma } from "@/lib/prisma";
import { prQualityConfig } from "@/config/scoring";
import type { PullRequestStats } from "@/types/analytics";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function computePullRequestStats(userId: string): Promise<PullRequestStats> {
  const prs = await prisma.pullRequest.findMany({
    where: { repository: { userId } },
    select: {
      state: true,
      merged: true,
      additions: true,
      deletions: true,
      reviewComments: true,
      createdAt: true,
      mergedAt: true,
      closedAt: true,
    },
  });

  if (prs.length === 0) {
    return {
      totalPRs: 0,
      mergeRate: 0,
      avgPRSizeLines: 0,
      avgCycleTimeHours: 0,
      prQualityScore: 0,
      reviewStats: { avgCommentsPerPR: 0, avgReviewTurnaroundHours: 0, approvalRate: 0 },
      monthlyBreakdown: [],
    };
  }

  const totalPRs = prs.length;
  const mergedPRs = prs.filter((p) => p.merged);
  const mergeRate = Math.round((mergedPRs.length / totalPRs) * 1000) / 10;

  const avgPRSizeLines = Math.round(
    prs.reduce((sum, p) => sum + p.additions + p.deletions, 0) / totalPRs
  );

  const cycleTimes = mergedPRs
    .filter((p) => p.mergedAt)
    .map((p) => (p.mergedAt!.getTime() - p.createdAt.getTime()) / 3_600_000);
  const avgCycleTimeHours = cycleTimes.length
    ? Math.round((cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) * 10) / 10
    : 0;

  const avgCommentsPerPR = Math.round(
    (prs.reduce((sum, p) => sum + p.reviewComments, 0) / totalPRs) * 10
  ) / 10;

  const reviewedPRs = prs.filter((p) => p.reviewComments > 0);
  const approvalRate = reviewedPRs.length
    ? Math.round((mergedPRs.filter((p) => p.reviewComments > 0).length / reviewedPRs.length) * 1000) / 10
    : mergeRate;

  const weights = prQualityConfig.weights;
  const cycleTimeScore = avgCycleTimeHours > 0
    ? Math.max(100 - Math.abs(avgCycleTimeHours - prQualityConfig.idealCycleTimeHours) / prQualityConfig.idealCycleTimeHours * 50, 0)
    : 50;
  const sizeHealthScore = avgPRSizeLines > 0
    ? Math.max(100 - Math.abs(avgPRSizeLines - prQualityConfig.idealPrSizeLines) / prQualityConfig.idealPrSizeLines * 50, 0)
    : 50;
  const reviewDepthScore = Math.min(avgCommentsPerPR * 20, 100);

  const qualityScore0to100 =
    mergeRate * weights.mergeRate +
    cycleTimeScore * weights.avgCycleTimeHours +
    reviewDepthScore * weights.reviewDepth +
    sizeHealthScore * weights.prSizeHealth;

  const prQualityScore = Math.round((qualityScore0to100 / 10) * 10) / 10;

  const buckets = new Map<string, { merged: number; open: number; closed: number }>();
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    buckets.set(key, { merged: 0, open: 0, closed: 0 });
  }

  for (const pr of prs) {
    const key = `${MONTH_NAMES[pr.createdAt.getMonth()]} ${pr.createdAt.getFullYear()}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (pr.merged) bucket.merged++;
    else if (pr.state === "open") bucket.open++;
    else bucket.closed++;
  }

  const monthlyBreakdown = Array.from(buckets.entries()).map(([month, counts]) => ({
    month,
    ...counts,
  }));

  return {
    totalPRs,
    mergeRate,
    avgPRSizeLines,
    avgCycleTimeHours,
    prQualityScore,
    reviewStats: {
      avgCommentsPerPR,
      avgReviewTurnaroundHours: avgCycleTimeHours,
      approvalRate,
    },
    monthlyBreakdown,
  };
}