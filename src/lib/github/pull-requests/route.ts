import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get("repoId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "100"), 500);

  const pullRequests = await prisma.pullRequest.findMany({
    where: {
      repository: { userId: session.userId },
      ...(repoId ? { repoId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { repository: { select: { name: true, fullName: true } } },
  });

  return apiSuccess(
    pullRequests.map((pr) => ({
      id: pr.id,
      githubPrId: pr.githubPrId,
      title: pr.title,
      state: pr.state,
      merged: pr.merged,
      additions: pr.additions,
      deletions: pr.deletions,
      reviewComments: pr.reviewComments,
      createdAt: pr.createdAt,
      mergedAt: pr.mergedAt,
      closedAt: pr.closedAt,
      repository: pr.repository,
    }))
  );
}