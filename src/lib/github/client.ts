import { GITHUB_API_BASE } from "@/lib/constants";
import { githubRateLimiter } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import type { GithubUser, GithubRepo, GithubCommit, GithubPullRequest } from "@/types/github";

export class GithubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "GithubApiError";
  }
}

interface RequestOptions {
  method?: string;
  searchParams?: Record<string, string | number | undefined>;
}

export class GithubClient {
  constructor(private accessToken: string) {}

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    await githubRateLimiter.throttle();

    const url = new URL(`${GITHUB_API_BASE}${path}`);
    if (options.searchParams) {
      for (const [key, value] of Object.entries(options.searchParams)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Flowlytics",
      },
      cache: "no-store",
    });

    githubRateLimiter.updateFromHeaders(res.headers);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error("GitHub API request failed", {
        path,
        status: res.status,
        body: body.slice(0, 500),
      });
      throw new GithubApiError(res.status, `GitHub API ${res.status}: ${path}`);
    }

    return (await res.json()) as T;
  }

  private async paginate<T>(
    path: string,
    options: RequestOptions = {},
    maxPages = 10
  ): Promise<T[]> {
    const results: T[] = [];

    for (let page = 1; page <= maxPages; page++) {
      const items = await this.request<T[]>(path, {
        ...options,
        searchParams: {
          ...options.searchParams,
          per_page: 100,
          page,
        },
      });

      if (!Array.isArray(items) || items.length === 0) break;
      results.push(...items);
      if (items.length < 100) break;
    }

    return results;
  }

  async getCurrentUser(): Promise<GithubUser> {
    return this.request<GithubUser>("/user");
  }

  async listRepositories(): Promise<GithubRepo[]> {
    return this.paginate<GithubRepo>("/user/repos", {
      searchParams: { sort: "pushed", affiliation: "owner,collaborator" },
    });
  }

  async listCommits(
    owner: string,
    repo: string,
    options: { since?: string; until?: string; author?: string } = {}
  ): Promise<GithubCommit[]> {
    try {
      return await this.paginate<GithubCommit>(
        `/repos/${owner}/${repo}/commits`,
        {
          searchParams: {
            since: options.since,
            until: options.until,
            author: options.author,
          },
        },
        5
      );
    } catch (err) {
      if (err instanceof GithubApiError && (err.status === 409 || err.status === 404)) {
        return [];
      }
      throw err;
    }
  }

  async getCommitDetail(owner: string, repo: string, sha: string): Promise<GithubCommit> {
    return this.request<GithubCommit>(`/repos/${owner}/${repo}/commits/${sha}`);
  }

  async listPullRequests(owner: string, repo: string): Promise<GithubPullRequest[]> {
    return this.paginate<GithubPullRequest>(
      `/repos/${owner}/${repo}/pulls`,
      { searchParams: { state: "all", sort: "updated", direction: "desc" } },
      3
    );
  }

  getRateLimitState() {
    return githubRateLimiter.getState();
  }
}