import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Compass, Bot, Cpu } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { NetworkIllustration } from "@/components/zy/NetworkIllustration";
import { BusinessCard } from "@/components/zy/BusinessCard";
import { Counter } from "@/components/zy/Counter";
import { Button } from "@/components/ui/button";
import { BUSINESSES } from "@/data/businesses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Business Hub by Zybytee — Build, Discover & Grow" },
      {
        name: "description",
        content:
          "Create your business profile, connect with businesses worldwide and prepare your business for the AI era.",
      },
      { property: "og:title", content: "Business Hub by Zybytee" },
      {
        property: "og:description",
        content: "The business ecosystem and future AI operating system, by Zybytee.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: Building2,
    title: "Business Profiles",
    desc: "Create your digital business identity — a single source of truth for who you are, what you do and where you're going.",
  },
  {
    icon: Compass,
    title: "Business Discovery",
    desc: "Explore businesses across industries, countries and stages. Find partners, customers and collaborators.",
  },
  {
    icon: Cpu,
    title: "AI Growth Tools",
    desc: "Unlock future recommendations, insights and automations built for ambitious founders.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Future digital employees — agents that work alongside your team, 24/7, across functions.",
  },
];

function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Business Hub by Zybytee",
    url: "https://business.zybytee.in",
    description: "Create your business profile, connect with businesses worldwide and prepare your business for the AI era.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://business.zybytee.in/directory?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  } as const;

  const featured = BUSINESSES.slice(0, 6);

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="absolute inset-x-0 top-0 mx-auto h-[600px] max-w-5xl bg-gradient-brand opacity-20 blur-[120px]" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
          <div className="animate-fade-up">
            <Eyebrow>Initializing the next era of business</Eyebrow>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Build, Discover<br />
              and <span className="text-gradient-brand">Grow</span> Your Business with AI.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Create your business profile, connect with businesses worldwide and access future
              AI-powered growth tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-brand px-6 text-primary-foreground hover:opacity-90">
                <Link to="/create">
                  Create Business Profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 hover:bg-white/10">
                <Link to="/directory">Explore Businesses</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {featured.slice(0, 4).map((b) => (
                  <div
                    key={b.slug}
                    className="h-8 w-8 rounded-full ring-2 ring-background"
                    style={{ background: `linear-gradient(135deg, ${b.gradient[0]}, ${b.gradient[1]})` }}
                  />
                ))}
              </div>
              <span className="font-mono uppercase tracking-[0.18em]">
                Trusted by ambitious founders across 22+ countries
              </span>
            </div>
          </div>

          <div className="relative">
            <NetworkIllustration className="mx-auto h-[420px] w-[420px] lg:h-[520px] lg:w-[520px]" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>The platform</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything your business needs — <span className="text-gradient-brand">designed as one.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A constellation of products, each built to stand alone, designed to work together.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-premium group p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: 12480, suffix: "+", label: "Businesses Registered" },
              { v: 62, suffix: "", label: "Countries" },
              { v: 84, suffix: "", label: "Industries" },
              { v: 3200, suffix: "+", label: "AI Reports Generated" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-5xl font-semibold tracking-tight text-gradient-brand">
                  <Counter to={s.v} suffix={s.suffix} />
                </div>
                <div className="mt-2 eyebrow">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BUSINESSES */}
      <section className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Featured businesses</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                A glimpse of the ecosystem.
              </h2>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/directory">
                Browse directory <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <BusinessCard key={b.slug} b={b} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/5 py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-12 text-center shadow-card sm:p-16">
            <div className="absolute inset-0 bg-gradient-brand opacity-[0.08]" aria-hidden />
            <div className="absolute -inset-32 bg-gradient-brand opacity-25 blur-[140px]" aria-hidden />
            <div className="relative">
              <Eyebrow>Join the ecosystem</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Your business, <span className="text-gradient-brand">future-ready.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Stake your claim in the AI era. Create your Zybytee business profile in under two minutes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90">
                  <Link to="/create">
                    Create Business Profile <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
                  <Link to="/directory">Explore the directory</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
