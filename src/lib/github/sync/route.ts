import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { getGithubAccessToken } from "@/lib/auth-helpers";
import { syncUserGithubData } from "@/lib/github/sync";
import { logger } from "@/lib/logger";

export async function POST() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const token = await getGithubAccessToken(session.userId);
  if (!token) return apiError("NO_GITHUB_TOKEN", "GitHub account not connected", 400);

  try {
    const result = await syncUserGithubData(session.userId, token);
    return apiSuccess(result);
  } catch (err) {
    logger.error("GitHub sync failed", { userId: session.userId, err: String(err) });
    return apiError("SYNC_FAILED", "Failed to sync GitHub data", 502);
  }
}

export async function GET() {
  return POST();
}