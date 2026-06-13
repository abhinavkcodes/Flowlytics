export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Repository {
  id: string;
  userId: string;
  githubRepoId: string;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  isPrivate: boolean;
  isFork: boolean;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date | null;
}

export interface Commit {
  id: string;
  repoId: string;
  sha: string;
  message: string;
  additions: number;
  deletions: number;
  date: Date;
}

export interface PullRequest {
  id: string;
  repoId: string;
  githubPrId: number;
  title: string;
  state: "open" | "closed" | "merged";
  merged: boolean;
  additions: number;
  deletions: number;
  reviewComments: number;
  createdAt: Date;
  mergedAt: Date | null;
  closedAt: Date | null;
}

export interface Insight {
  id: string;
  userId: string;
  type: InsightType;
  report: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export type InsightType =
  | "productivity_summary"
  | "weekly_report"
  | "growth_analysis"
  | "strengths_weaknesses"
  | "recommendations";