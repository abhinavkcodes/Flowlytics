export const siteConfig = {
  name: "Flowlytics",
  tagline: "AI-powered GitHub Productivity & Developer Analytics Platform",
  description:
    "Flowlytics connects to your GitHub account and transforms raw activity into productivity insights, coding habit analysis, repository intelligence, developer growth tracking, and AI-generated reports.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://flowlytics.app",
  ogImage: "/screenshots/og-image.png",
  links: {
    github: "https://github.com/flowlytics",
    twitter: "https://twitter.com/flowlyticsapp",
  },
  author: {
    name: "Flowlytics Team",
  },
} as const;

export type SiteConfig = typeof siteConfig;