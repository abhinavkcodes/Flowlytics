import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const repositories = await prisma.repository.findMany({
    where: { userId: session.userId },
    orderBy: { pushedAt: "desc" },
    include: {
      _count: { select: { commits: true, pullRequests: true } },
    },
  });

  return apiSuccess(
    repositories.map((r) => ({
      id: r.id,
      githubRepoId: r.githubRepoId,
      name: r.name,
      fullName: r.fullName,
      description: r.description,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
      isPrivate: r.isPrivate,
      isFork: r.isFork,
      healthScore: r.healthScore,
      pushedAt: r.pushedAt,
      createdAt: r.createdAt,
      commitCount: r._count.commits,
      pullRequestCount: r._count.pullRequests,
    }))
  );
}