import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { computeProductivityStats } from "@/lib/analytics/productivity";
import { computeHabitStats } from "@/lib/analytics/habits";
import { computeRepositoryIntelligence } from "@/lib/analytics/health-score";
import { computeDeveloperGrowth } from "@/lib/analytics/growth";
import { computePullRequestStats } from "@/lib/analytics/pull-requests";
import type { InsightType } from "@/types/database";

const MODEL = "gpt-4o-mini";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPTS: Record<InsightType, string> = {
  productivity_summary:
    "You are a developer productivity coach. Given a developer's GitHub activity data, write a concise, encouraging productivity summary (3-5 short paragraphs). Mention concrete numbers from the data. Avoid generic filler.",
  weekly_report:
    "You are writing a weekly developer activity report. Summarize the developer's commits, PRs, and habits from the past week's data in a friendly, professional tone. Include 2-3 concrete highlights.",
  growth_analysis:
    "You are a senior engineering mentor. Analyze the developer's skill growth data (frontend/backend/devops levels, language adoption trends) and describe their trajectory, what's improving, and where there's room to grow.",
  strengths_weaknesses:
    "You are an unbiased technical reviewer. Based on the provided GitHub activity data, list the developer's top 3 strengths and top 3 areas for improvement, each with a one-sentence justification grounded in the data.",
  recommendations:
    "You are a developer productivity coach. Based on the provided data, give 3-5 specific, actionable recommendations to improve consistency, code quality, or collaboration. Keep each recommendation to 1-2 sentences.",
};

export async function generateInsight(userId: string, type: InsightType): Promise<string> {
  const [productivity, habits, repoIntel, growth, prStats] = await Promise.all([
    computeProductivityStats(userId),
    computeHabitStats(userId),
    computeRepositoryIntelligence(userId),
    computeDeveloperGrowth(userId),
    computePullRequestStats(userId),
  ]);

  const dataPayload = { productivity, habits, repositoryIntelligence: repoIntel, growth, pullRequestStats: prStats };

  if (productivity.totalCommits === 0) {
    const fallback = "No GitHub activity has been synced yet. Connect your GitHub account and run a sync to generate personalized insights.";
    await persistInsight(userId, type, fallback, dataPayload);
    return fallback;
  }

  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[type] },
      {
        role: "user",
        content: `Here is the developer's real GitHub analytics data as JSON:\n\n${JSON.stringify(dataPayload)}\n\nWrite the report now.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 700,
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI returned an empty response");

  await persistInsight(userId, type, content, dataPayload);
  return content;
}

async function persistInsight(userId: string, type: InsightType, report: string, metadata: unknown) {
  try {
    await prisma.insight.create({ data: { userId, type, report, metadata: metadata as object } });
  } catch (err) {
    logger.error("Failed to persist insight", { userId, type, err: String(err) });
  }
}