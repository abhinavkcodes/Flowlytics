import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { generateInsight } from "@/lib/ai/insights";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  try {
    const report = await generateInsight(session.userId, "recommendations");
    return apiSuccess({
      type: "recommendations",
      content: report,
      generatedAt: new Date().toISOString(),
      model: "gpt-4o-mini",
    });
  } catch (err) {
    logger.error("AI recommendations failed", { userId: session.userId, err: String(err) });
    return apiError("AI_GENERATION_FAILED", "Failed to generate recommendations", 502);
  }
}