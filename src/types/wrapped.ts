export interface WrappedData {
  year: number;
  totalCommits: number;
  longestStreak: number;
  topLanguage: string;
  topRepository: string;
  mostProductiveMonth: string;
  totalStars: number;
  totalPRs: number;
  totalLinesWritten: number;
  totalReposCreated: number;
  skills: Array<{ skill: string; level: number; color: string }>;
  languages: Array<{ name: string; pct: number; color: string }>;
  monthlyCommits: Array<{ month: string; commits: number }>;
}

export interface ShareCardData {
  username: string;
  avatar: string;
  year: number;
  stats: Array<{ label: string; value: string; icon: string }>;
}