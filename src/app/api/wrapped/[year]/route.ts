import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { getWrapped } from "@/lib/analytics/wrapped";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!Number.isInteger(year)) {
    return apiError("INVALID_YEAR", "year must be an integer", 400);
  }

  const data = await getWrapped(session.userId, year);
  return apiSuccess(data);
}