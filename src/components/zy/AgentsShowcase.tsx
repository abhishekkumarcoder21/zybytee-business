import { Megaphone, TrendingUp, Search, Headphones, Globe } from "lucide-react";
import { Eyebrow } from "./Eyebrow";

const AGENTS = [
  { name: "Social Media Agent", role: "Plans, writes and ships your content across channels.", icon: Megaphone, grad: ["#67E8F9", "#3B82F6"] as const },
  { name: "Sales Agent", role: "Researches prospects, drafts outreach and follows up — at scale.", icon: TrendingUp, grad: ["#A78BFA", "#EC4899"] as const },
  { name: "Customer Support Agent", role: "Answers customers across channels with your tone, your knowledge.", icon: Headphones, grad: ["#60A5FA", "#7C3AED"] as const },
  { name: "SEO Agent", role: "Continuously audits, optimizes and grows your organic footprint.", icon: Search, grad: ["#5EEAD4", "#0EA5E9"] as const },
  { name: "Website Agent", role: "Keeps your website fast, fresh and conversion-optimized.", icon: Globe, grad: ["#FCD34D", "#F97316"] as const },
];

export function AgentsShowcase({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className="space-y-10">
      <div>
        <Eyebrow>AI agents · in development</Eyebrow>
        <h1 className={`mt-3 font-display font-semibold tracking-tight ${embedded ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"}`}>
          A digital workforce, <span className="text-gradient-brand">built for your business.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Autonomous agents that work alongside your team — across functions, around the clock. The future of business is staffed by both.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a) => (
          <div key={a.name} className="card-premium group relative overflow-hidden p-7">
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "linear-gradient(to right, oklch(1 0 0 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div className="relative flex items-start gap-4">
              <div className="relative">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-glow"
                  style={{ background: `linear-gradient(135deg, ${a.grad[0]}, ${a.grad[1]})` }}
                >
                  <a.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-cyan ring-2 ring-background animate-pulse-glow" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.role}</p>
              </div>
            </div>

            <div className="relative mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse-glow" />
                Coming soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
