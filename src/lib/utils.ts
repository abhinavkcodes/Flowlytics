import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-400/10 border-emerald-400/20";
  if (score >= 60) return "bg-amber-400/10 border-amber-400/20";
  if (score >= 40) return "bg-orange-400/10 border-orange-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export function getLangColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3b82f6",
    JavaScript: "#f59e0b",
    Python: "#06b6d4",
    Rust: "#f97316",
    Go: "#84cc16",
    Java: "#ef4444",
    "C++": "#8b5cf6",
    C: "#6366f1",
    Ruby: "#ec4899",
    CSS: "#e879f9",
    HTML: "#fb923c",
    Swift: "#f43f5e",
    Kotlin: "#a855f7",
    Dart: "#22d3ee",
  };
  return colors[lang] ?? "#6b7280";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function groupBy<T>(
  array: T[],
  key: (item: T) => string
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}