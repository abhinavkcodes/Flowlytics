import { logger } from "./logger";

/**
 * Token-bucket style rate limiter for GitHub API calls.
 * GitHub REST: 5000 req/hr authenticated. GraphQL: 5000 points/hr.
 */

interface RateLimitState {
  remaining: number;
  limit: number;
  resetAt: number; // epoch ms
}

class RateLimiter {
  private state: RateLimitState = {
    remaining: 5000,
    limit: 5000,
    resetAt: Date.now() + 60 * 60 * 1000,
  };

  /** Update internal state from GitHub's response headers */
  updateFromHeaders(headers: Headers): void {
    const remaining = headers.get("x-ratelimit-remaining");
    const limit = headers.get("x-ratelimit-limit");
    const reset = headers.get("x-ratelimit-reset");

    if (remaining) this.state.remaining = parseInt(remaining, 10);
    if (limit) this.state.limit = parseInt(limit, 10);
    if (reset) this.state.resetAt = parseInt(reset, 10) * 1000;
  }

  /** Check if we have budget to make a request */
  canProceed(): boolean {
    return this.state.remaining > 10; // keep a small buffer
  }

  /** Throw or wait if rate limit is close to exhausted */
  async throttle(): Promise<void> {
    if (this.canProceed()) return;

    const waitMs = Math.max(this.state.resetAt - Date.now(), 0);
    logger.warn("GitHub rate limit nearly exhausted, waiting", {
      remaining: this.state.remaining,
      waitMs,
    });

    await new Promise((resolve) => setTimeout(resolve, Math.min(waitMs, 60_000)));
  }

  getState(): RateLimitState {
    return { ...this.state };
  }
}

export const githubRateLimiter = new RateLimiter();