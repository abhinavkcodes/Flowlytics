import type { Metadata } from "next";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: "#03050a", color: "#eef2ff", fontFamily: "'Outfit', sans-serif" }}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}