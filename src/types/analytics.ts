export interface CommitTrend {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  consistencyScore: number;
  lastActiveDate: string | null;
}

export interface LanguageDistribution {
  name: string;
  percentage: number;
  color: string;
  commits: number;
  repos: number;
}

export interface ProductivityMetrics {
  totalCommits: number;
  totalRepos: number;
  totalPRs: number;
  totalStars: number;
  totalForks: number;
  totalReviews: number;
  avgCommitsPerDay: number;
  mostProductiveDay: string;
  mostProductiveHour: number;
  consistencyScore: number;
}

export interface HabitData {
  timeOfDay: {
    morning: number;   // 6-12
    afternoon: number; // 12-18
    evening: number;   // 18-22
    night: number;     // 22-6
  };
  dayOfWeek: Record<string, number>;
  weekdayVsWeekend: { weekday: number; weekend: number };
  hourlyDistribution: Array<{ hour: number; commits: number }>;
}

export interface RepositoryHealth {
  id: string;
  name: string;
  score: number;
  stars: number;
  forks: number;
  language: string | null;
  commitFrequency: number;
  lastCommit: string | null;
  trendPercent: number;
}

export interface GrowthMetrics {
  frontend: number;
  backend: number;
  devops: number;
  openSource: number;
  architecture: number;
  testing: number;
}

export interface DashboardStats {
  totalCommits: number;
  totalRepos: number;
  totalPRs: number;
  totalStars: number;
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number;
  mergeRate: number;
  topLanguage: string;
}