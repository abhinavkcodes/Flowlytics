export const APP_NAME = "Flowlytics";
export const APP_DESCRIPTION =
  "GitHub × Spotify Wrapped × AI Productivity Coach. Understand your code like never before.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const GITHUB_API_URL = "https://api.github.com";
export const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export const CACHE_TTL = {
  SHORT: 60 * 5,        // 5 minutes
  MEDIUM: 60 * 60,      // 1 hour
  LONG: 60 * 60 * 24,   // 24 hours
} as const;

export const SCORE_WEIGHTS = {
  commits: 0.35,
  streaks: 0.20,
  prs: 0.20,
  repos: 0.15,
  reviews: 0.10,
} as const;

export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3b82f6",
  JavaScript: "#f59e0b",
  Python: "#06b6d4",
  Rust: "#f97316",
  Go: "#84cc16",
  Java: "#ef4444",
  "C++": "#8b5cf6",
  CSS: "#e879f9",
  HTML: "#fb923c",
  Swift: "#f43f5e",
  Kotlin: "#a855f7",
  Ruby: "#ec4899",
  Other: "#6b7280",
};