import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, avatar: true, githubId: true },
        });
        if (dbUser) {
          (session.user as any).username = dbUser.username;
          (session.user as any).avatar = dbUser.avatar;
          (session.user as any).githubId = dbUser.githubId;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const ghProfile = profile as any;
        await prisma.user.upsert({
          where: { githubId: String(ghProfile.id) },
          update: {
            name: ghProfile.name ?? ghProfile.login,
            username: ghProfile.login,
            email: ghProfile.email,
            avatar: ghProfile.avatar_url,
            bio: ghProfile.bio,
            company: ghProfile.company,
            location: ghProfile.location,
            website: ghProfile.blog,
            followers: ghProfile.followers ?? 0,
            following: ghProfile.following ?? 0,
            publicRepos: ghProfile.public_repos ?? 0,
          },
          create: {
            githubId: String(ghProfile.id),
            name: ghProfile.name ?? ghProfile.login,
            username: ghProfile.login,
            email: ghProfile.email,
            avatar: ghProfile.avatar_url,
            bio: ghProfile.bio,
            company: ghProfile.company,
            location: ghProfile.location,
            website: ghProfile.blog,
            followers: ghProfile.followers ?? 0,
            following: ghProfile.following ?? 0,
            publicRepos: ghProfile.public_repos ?? 0,
          },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "database",
  },
});