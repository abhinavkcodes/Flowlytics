export const tokens = {
  bg: "#03050a",
  bg1: "#080d18",
  bg2: "#0d1526",
  surface: "rgba(255,255,255,0.032)",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.14)",
  text: "#eef2ff",
  textMid: "#8892aa",
  textDim: "#3d4a63",
  blue: "#3b82f6",
  blueHi: "#60a5fa",
  cyan: "#06b6d4",
  green: "#10b981",
  lime: "#84cc16",
  amber: "#f59e0b",
  orange: "#f97316",
  rose: "#f43f5e",
  purple: "#8b5cf6",
  pink: "#ec4899",
  fontDisplay: "'Cabinet Grotesk', 'Outfit', sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  fontBody: "'Outfit', sans-serif",
} as const;

export type Tokens = typeof tokens;

export const langColorMap: Record<string, string> = {
  TypeScript: tokens.blue,
  JavaScript: tokens.amber,
  Python: tokens.cyan,
  Rust: tokens.orange,
  Go: tokens.lime,
  CSS: tokens.pink,
  HTML: tokens.rose,
  Java: tokens.purple,
  "C++": tokens.blueHi,
  Ruby: tokens.rose,
};

export function getLangColor(lang: string | null | undefined): string {
  if (!lang) return tokens.textDim;
  return langColorMap[lang] ?? tokens.textDim;
}