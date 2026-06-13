import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { withCache } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/constants";
import { computePullRequestStats } from "@/lib/analytics/pull-requests";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const stats = await withCache(
    `pr-stats:${session.userId}`,
    CACHE_TTL.MEDIUM,
    () => computePullRequestStats(session.userId)
  );

  return apiSuccess(stats);
}