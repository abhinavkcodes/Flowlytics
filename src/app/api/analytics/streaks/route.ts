import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { withCache } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/constants";
import { computeProductivityStats } from "@/lib/analytics/productivity";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const stats = await withCache(
    `productivity:${session.userId}`,
    CACHE_TTL.MEDIUM,
    () => computeProductivityStats(session.userId)
  );

  return apiSuccess({
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    consistencyScore: stats.consistencyScore,
  });
}