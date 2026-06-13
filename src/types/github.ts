export interface GithubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  size: number;
  default_branch: string;
  pushed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{ filename: string; status: string }>;
}

export interface GithubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  draft: boolean;
  merged: boolean;
  additions: number;
  deletions: number;
  changed_files: number;
  review_comments: number;
  comments: number;
  merged_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}