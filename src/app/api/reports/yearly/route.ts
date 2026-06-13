import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { computeYearlyReport } from "@/lib/analytics/reports";

export async function GET(req: Request) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const { searchParams } = new URL(req.url);
  const yearParam = searchParams.get("year");
  const year = yearParam ? Number(yearParam) : undefined;

  const report = await computeYearlyReport(session.userId, year);
  return apiSuccess(report);
}