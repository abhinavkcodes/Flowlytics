import { apiSuccess, apiError, requireUserId } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await requireUserId();
  if (!session) return apiError("UNAUTHORIZED", "Sign in required", 401);

  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get("repoId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "100"), 500);

  const commits = await prisma.commit.findMany({
    where: {
      repository: { userId: session.userId },
      ...(repoId ? { repoId } : {}),
    },
    orderBy: { date: "desc" },
    take: limit,
    include: { repository: { select: { name: true, fullName: true } } },
  });

  return apiSuccess(
    commits.map((c) => ({
      id: c.id,
      sha: c.sha,
      message: c.message,
      additions: c.additions,
      deletions: c.deletions,
      date: c.date,
      repository: c.repository,
    }))
  );
}