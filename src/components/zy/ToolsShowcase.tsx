import { Sparkles, ArrowUpRight, Wand2, Search, FileText, Users } from "lucide-react";
import { Eyebrow } from "./Eyebrow";

const TOOLS = [
  {
    name: "AI Business Audit",
    desc: "A full-spectrum audit of your business — positioning, ops, AI readiness — generated in minutes.",
    icon: Sparkles,
    grad: ["#67E8F9", "#3B82F6"] as const,
    tag: "Coming Soon",
  },
  {
    name: "SEO Assistant",
    desc: "Discover keyword opportunities, audit pages and ship technical fixes — autonomously.",
    icon: Search,
    grad: ["#60A5FA", "#7C3AED"] as const,
    tag: "Coming Soon",
  },
  {
    name: "Content Planner",
    desc: "Plan on-brand content across blog, social and email with AI guidance.",
    icon: FileText,
    grad: ["#5EEAD4", "#0EA5E9"] as const,
    tag: "Coming Soon",
  },
  {
    name: "Marketing Assistant",
    desc: "Launch multi-channel campaigns faster with AI-driven playbooks and prompts.",
    icon: Wand2,
    grad: ["#A78BFA", "#EC4899"] as const,
    tag: "Coming Soon",
  },
  {
    name: "Lead Generator",
    desc: "Find qualified leads across industries and enrich them with firmographic signals.",
    icon: Users,
    grad: ["#FCD34D", "#F97316"] as const,
    tag: "Coming Soon",
  },
];

export function ToolsShowcase({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className="space-y-10">
      <div>
        <Eyebrow>Future tools</Eyebrow>
        <h1 className={`mt-3 font-display font-semibold tracking-tight ${embedded ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"}`}>
          AI-native <span className="text-gradient-brand">tools for every business.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A growing suite of intelligent tools — built to make every business faster, sharper and more autonomous.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <div key={t.name} className="card-premium group relative overflow-hidden p-7">
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
              style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}
            />
            <div className="relative">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-glow"
                style={{ background: `linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})` }}
              >
                <t.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t.tag}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-brand-cyan">
                Coming soon <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
