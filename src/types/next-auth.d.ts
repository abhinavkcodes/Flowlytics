import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string | null;
      avatar?: string | null;
      githubId?: string | null;
    } & DefaultSession["user"];
  }
}

interface GitHubProfile {
  id: number | string;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  company?: string | null;
  location?: string | null;
  blog?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
}

export type { GitHubProfile };