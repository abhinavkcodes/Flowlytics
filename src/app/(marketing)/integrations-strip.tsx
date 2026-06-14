import { Github } from "lucide-react";
import { tokens as T } from "@/styles/tokens";

const INTEGRATIONS = [
  { name: "GitHub", sub: "OAuth & GraphQL API" },
  { name: "PostgreSQL", sub: "via Neon" },
  { name: "OpenAI", sub: "AI report generation" },
  { name: "Vercel", sub: "Deployment" },
];

export function IntegrationsStrip() {
  return (
    <div className="fadeUp mt-24 border-t border-white/[0.06] pt-12" style={{ animationDelay: ".7s" }}>
      <p className="mb-8 text-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">
        Built on tools you already trust
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {INTEGRATIONS.map((item) => (
          <div key={item.name} className="flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100">
            {item.name === "GitHub" && <Github size={20} strokeWidth={1.75} style={{ color: T.textMid }} />}
            <div>
              <p className="font-display text-sm font-semibold text-text">{item.name}</p>
              <p className="font-mono text-[10px] text-text-dim">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}