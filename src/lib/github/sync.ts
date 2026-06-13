import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { GithubClient, GithubApiError } from "./client";
import type { GithubRepo } from "@/types/github";

const MAX_REPOS_TO_SYNC = 25;
const COMMIT_LOOKBACK_DAYS = 365;

export interface SyncResult {
  reposSynced: number;
  commitsSynced: number;
  pullRequestsSynced: number;
}

export async function syncUserGithubData(
  userId: string,
  accessToken: string
): Promise<SyncResult> {
  const client = new GithubClient(accessToken);

  const ghUser = await client.getCurrentUser();
  const allRepos = await client.listRepositories();

  const repos = allRepos
    .filter((r) => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at!).getTime() - new Date(a.pushed_at!).getTime())
    .slice(0, MAX_REPOS_TO_SYNC);

  let commitsSynced = 0;
  let pullRequestsSynced = 0;

  const since = new Date();
  since.setDate(since.getDate() - COMMIT_LOOKBACK_DAYS);

  for (const repo of repos) {
    try {
      const repoRecord = await upsertRepository(userId, repo);
      const [owner, repoName] = repo.full_name.split("/");

      const commits = await client.listCommits(owner, repoName, {
        since: since.toISOString(),
        author: ghUser.login,
      });

      for (const commit of commits) {
        const stats = commit.stats;
        await prisma.commit.upsert({
          where: { repoId_sha: { repoId: repoRecord.id, sha: commit.sha } },
          update: {
            message: commit.commit.message,
            additions: stats?.additions ?? 0,
            deletions: stats?.deletions ?? 0,
            date: new Date(commit.commit.author.date),
          },
          create: {
            repoId: repoRecord.id,
            sha: commit.sha,
            message: commit.commit.message,
            additions: stats?.additions ?? 0,
            deletions: stats?.deletions ?? 0,
            date: new Date(commit.commit.author.date),
          },
        });
        commitsSynced++;
      }

      const pullRequests = await client.listPullRequests(owner, repoName);
      for (const pr of pullRequests) {
        const state = pr.merged ? "merged" : pr.state;
        await prisma.pullRequest.upsert({
          where: { repoId_githubPrId: { repoId: repoRecord.id, githubPrId: pr.number } },
          update: {
            title: pr.title,
            state,
            merged: pr.merged,
            additions: pr.additions ?? 0,
            deletions: pr.deletions ?? 0,
            reviewComments: pr.review_comments ?? 0,
            mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
            closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
          },
          create: {
            repoId: repoRecord.id,
            githubPrId: pr.number,
            title: pr.title,
            state,
            merged: pr.merged,
            additions: pr.additions ?? 0,
            deletions: pr.deletions ?? 0,
            reviewComments: pr.review_comments ?? 0,
            createdAt: new Date(pr.created_at),
            mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
            closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
          },
        });
        pullRequestsSynced++;
      }
    } catch (err) {
      if (err instanceof GithubApiError) {
        logger.warn("Skipping repo during sync due to GitHub API error", {
          repo: repo.full_name,
          status: err.status,
        });
        continue;
      }
      throw err;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      followers: ghUser.followers ?? 0,
      following: ghUser.following ?? 0,
      publicRepos: ghUser.public_repos ?? 0,
      avatar: ghUser.avatar_url,
      bio: ghUser.bio,
      company: ghUser.company,
      location: ghUser.location,
      website: ghUser.blog,
    },
  });

  return {
    reposSynced: repos.length,
    commitsSynced,
    pullRequestsSynced,
  };
}

async function upsertRepository(userId: string, repo: GithubRepo) {
  return prisma.repository.upsert({
    where: { githubRepoId: String(repo.id) },
    update: {
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      isPrivate: repo.private,
      isFork: repo.fork,
      updatedAt: new Date(repo.updated_at),
      pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
      syncedAt: new Date(),
    },
    create: {
      userId,
      githubRepoId: String(repo.id),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      isPrivate: repo.private,
      isFork: repo.fork,
      createdAt: new Date(repo.created_at),
      updatedAt: new Date(repo.updated_at),
      pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
  });
}