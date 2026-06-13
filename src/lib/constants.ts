export const APP_NAME = "Flowlytics";
export const APP_TAGLINE = "AI-powered GitHub Productivity & Developer Analytics Platform";
export const APP_DESCRIPTION =
  "Transform raw GitHub activity into productivity insights, coding habit analysis, repository intelligence, and AI-generated reports.";

export const GITHUB_API_BASE = "https://api.github.com";
export const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export const CACHE_TTL = {
  SHORT: 60 * 5,        // 5 minutes
  MEDIUM: 60 * 60,      // 1 hour
  LONG: 60 * 60 * 24,   // 24 hours
  WRAPPED: 60 * 60 * 24 * 7, // 7 days
} as const;

export const TIME_SLOTS = {
  LATE_NIGHT: { label: "Late Night", range: [0, 6] },
  MORNING: { label: "Morning", range: [6, 12] },
  AFTERNOON: { label: "Afternoon", range: [12, 18] },
  EVENING: { label: "Evening", range: [18, 22] },
  NIGHT: { label: "Night", range: [22, 24] },
} as const;

export const SCORE_WEIGHTS = {
  COMMIT_FREQUENCY: 0.25,
  CONSISTENCY: 0.2,
  PR_QUALITY: 0.2,
  ACTIVITY_RECENCY: 0.15,
  COLLABORATION: 0.1,
  DOCUMENTATION: 0.1,
} as const;

export const NAV_ITEMS = [
  { id: "dashboard", icon: "◈", label: "Dashboard", href: "/dashboard" },
  { id: "productivity", icon: "⚡", label: "Productivity", href: "/dashboard/productivity" },
  { id: "habits", icon: "🧠", label: "Habits", href: "/dashboard/habits" },
  { id: "repositories", icon: "📦", label: "Repositories", href: "/dashboard/repositories" },
  { id: "pull-requests", icon: "🔀", label: "Pull Requests", href: "/dashboard/pull-requests" },
  { id: "insights", icon: "✦", label: "AI Insights", href: "/dashboard/insights" },
  { id: "growth", icon: "📈", label: "Growth", href: "/dashboard/growth" },
  { id: "wrapped", icon: "🎁", label: "Wrapped", href: "/dashboard/wrapped" },
  { id: "settings", icon: "⚙", label: "Settings", href: "/dashboard/settings" },
] as const;