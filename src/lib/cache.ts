import { logger } from "./logger";

/**
 * Simple in-memory cache with TTL support.
 * For production, swap the Map for Redis/Upstash — interface stays identical.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cache = new MemoryCache();

/**
 * Wrap an async function with caching.
 * Usage: const data = await withCache('repos:123', 3600, () => fetchRepos(userId))
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== null) {
    logger.debug("Cache hit", { key });
    return cached;
  }

  logger.debug("Cache miss", { key });
  const value = await fn();
  cache.set(key, value, ttlSeconds);
  return value;
}