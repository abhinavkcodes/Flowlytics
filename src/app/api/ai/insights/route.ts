import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { generateInsight } from "@/lib/ai/insights";
import { logger } from "@/lib/logger";
import type { InsightType } from "@/types/database";

const VALID_TYPES: InsightType[] = [
  "productivity_summary",
  "weekly_report",
  "growth_analysis",
  "strengths_weaknesses",
  "recommendations",
];

export async function GET(req: Request) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const insights = await prisma.insight.findMany({
    where: {
      userId: session.userId,
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return apiSuccess(insights);
}

export async function POST(req: Request) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  let body: { type?: string };
  try {
    body = await req.json();
  } catch {
    return apiError("INVALID_BODY", "Request body must be JSON", 400);
  }

  const type = body.type as InsightType | undefined;
  if (!type || !VALID_TYPES.includes(type)) {
    return apiError("INVALID_TYPE", `type must be one of: ${VALID_TYPES.join(", ")}`, 400);
  }

  try {
    const report = await generateInsight(session.userId, type);
    return apiSuccess({
      type,
      content: report,
      generatedAt: new Date().toISOString(),
      model: "gpt-4o-mini",
    });
  } catch (err) {
    logger.error("AI insight generation failed", { userId: session.userId, type, err: String(err) });
    return apiError("AI_GENERATION_FAILED", "Failed to generate insight", 502);
  }
}