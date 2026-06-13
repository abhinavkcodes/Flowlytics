import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { withCache } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/constants";
import { computeRepositoryIntelligence } from "@/lib/analytics/health-score";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const stats = await withCache(
    `health-score:${session.userId}`,
    CACHE_TTL.MEDIUM,
    () => computeRepositoryIntelligence(session.userId)
  );

  return apiSuccess(stats);
}