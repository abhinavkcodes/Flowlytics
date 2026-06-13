import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { computeWeeklyReport } from "@/lib/analytics/reports";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const report = await computeWeeklyReport(session.userId);
  return apiSuccess(report);
}