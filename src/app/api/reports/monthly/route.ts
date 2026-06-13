import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { computeMonthlyReport } from "@/lib/analytics/reports";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const report = await computeMonthlyReport(session.userId);
  return apiSuccess(report);
}