import type { InsightType } from "./database";

export interface AIReportRequest {
  type: InsightType;
  userId: string;
}

export interface AIReportResponse {
  type: InsightType;
  content: string;
  generatedAt: string;
  model: string;
}

export interface InsightCard {
  id: string;
  type: "peak" | "growth" | "gap" | "habit" | "collab" | "trend";
  icon: string;
  title: string;
  body: string;
  color?: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalCommits: number;
  totalPRs: number;
  summary: string;
  highlights: string[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalCommits: number;
  topRepository: string;
  growthVsLastMonth: number;
  summary: string;
}

export interface YearlyReport {
  year: number;
  totalCommits: number;
  longestStreak: number;
  topLanguage: string;
  topRepository: string;
  mostProductiveMonth: string;
  summary: string;
}