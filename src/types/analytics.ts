export interface CommitTrendPoint {
  date: string;
  commits: number;
  additions?: number;
  deletions?: number;
}

export interface ProductivityStats {
  totalCommits: number;
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number; // 0-100
  mostProductiveDay: string; // e.g. "Saturday"
  mostProductiveHour: number; // 0-23
  monthlyTrend: CommitTrendPoint[];
  weeklyTrend: CommitTrendPoint[];
  hourlyDistribution: { hour: number; commits: number }[];
}

export interface HabitStats {
  timeOfDayDistribution: {
    label: string;
    range: [number, number];
    percentage: number;
  }[];
  weekdayVsWeekend: {
    weekday: number;
    weekend: number;
  };
  languageDistribution: {
    language: string;
    percentage: number;
    color: string;
  }[];
  repositoryActivityPattern: {
    repoName: string;
    activityScore: number;
  }[];
}

export interface RepositoryHealthScore {
  repoId: string;
  repoName: string;
  healthScore: number; // 0-100
  commitFrequencyScore: number;
  starsGrowth: number;
  forksGrowth: number;
  recencyScore: number;
  trend: number; // percentage change
}

export interface RepositoryIntelligence {
  totalRepos: number;
  activeRepos: number;
  totalStars: number;
  totalForks: number;
  topRepositories: RepositoryHealthScore[];
  radarMetrics: { metric: string; value: number }[];
}

export interface PullRequestStats {
  totalPRs: number;
  mergeRate: number; // 0-100
  avgPRSizeLines: number;
  avgCycleTimeHours: number;
  prQualityScore: number; // 0-10
  reviewStats: {
    avgCommentsPerPR: number;
    avgReviewTurnaroundHours: number;
    approvalRate: number;
  };
  monthlyBreakdown: {
    month: string;
    merged: number;
    open: number;
    closed: number;
  }[];
}

export interface GrowthMetric {
  category: "frontend" | "backend" | "devops" | "openSource" | "architecture" | "testing";
  label: string;
  level: number; // 0-100
  trend: number; // percentage change over lookback period
}

export interface DeveloperGrowth {
  skills: GrowthMetric[];
  technologyAdoption: { language: string; usagePercentage: number; trend: number }[];
  timeline: { year: string; event: string; primaryLanguage: string }[];
}

export interface HealthScoreBreakdown {
  overall: number;
  components: {
    name: string;
    score: number;
    weight: number;
  }[];
}