import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, MapPin, Users, Calendar, ArrowUpRight, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { BusinessLogo } from "@/components/zy/BusinessLogo";
import { BusinessCard } from "@/components/zy/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Business } from "@/data/businesses";
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessBySlug, fetchBusinesses } from "@/lib/supabase/business";

export const Route = createFileRoute("/company/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Business Profile — Business Hub by Zybytee` },
      { name: "description", content: "View a business profile on Zybytee." },
      { property: "og:title", content: "Business Hub by Zybytee" },
    ],
    links: [{ rel: "canonical", href: `/company/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-4xl">Business not found</h1>
        <p className="mt-3 text-muted-foreground">This profile may have moved or doesn't exist yet.</p>
        <Button asChild className="mt-6 rounded-full bg-gradient-brand">
          <Link to="/directory">Back to directory</Link>
        </Button>
      </div>
    </PageShell>
  ),
  component: Company,
});

function Company() {
  const { slug } = Route.useParams();
  const { data: b, isLoading } = useQuery<Business | null>({
    queryKey: ["business", slug],
    queryFn: () => fetchBusinessBySlug(slug),
  });
  const { data: allBusinesses = [] } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-5 py-32 text-center">
          <p className="text-muted-foreground">Loading business profile...</p>
        </div>
      </PageShell>
    );
  }

  if (!b) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-5 py-32 text-center">
          <h1 className="font-display text-4xl">Business not found</h1>
          <p className="mt-3 text-muted-foreground">This profile may have moved or doesn't exist yet.</p>
          <Button asChild className="mt-6 rounded-full bg-gradient-brand">
            <Link to="/directory">Back to directory</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  const similar = allBusinesses.filter((s) => s.slug !== b.slug && s.industry === b.industry).slice(0, 3);

  return (
    <PageShell>
      {/* HEADER */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 grid-bg grid-bg-fade opacity-70" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-[300px] opacity-30 blur-[100px]"
          style={{ background: `linear-gradient(120deg, ${b.gradient[0]}, ${b.gradient[1]})` }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-wrap items-start gap-6">
            <BusinessLogo
              initials={b.initials ?? b.name.slice(0, 2).toUpperCase()}
              gradient={b.gradient ?? ["#67E8F9", "#3B82F6"]}
              size={88}
              className="rounded-2xl shadow-glow"
              logoUrl={b.logoUrl}
            />
            <div className="flex-1">
              <Eyebrow>{b.category}</Eyebrow>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{b.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span>{b.industry}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{b.city}, {b.country}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{b.size}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />Founded {b.founded ?? new Date().getFullYear()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
                <a href={b.website} target="_blank" rel="noreferrer">
                  Visit website <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button className="rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90">Connect</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-3 lg:px-8">
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="eyebrow">About</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">{b.description}</p>
          </div>

          <div>
            <h2 className="eyebrow">Founder</h2>
            <div className="mt-4 card-premium flex items-center gap-4 p-5">
                <div
                className="flex h-14 w-14 items-center justify-center rounded-xl font-display text-lg font-semibold"
                  style={{ background: `linear-gradient(135deg, ${(b.gradient ?? ["#67E8F9", "#3B82F6"])[0]}, ${(b.gradient ?? ["#67E8F9", "#3B82F6"])[1]})` }}
              >
                {b.founder.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{b.founder}</div>
                <div className="text-sm text-muted-foreground">{b.founderTitle ?? "Founder"} · {b.name}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="eyebrow">Challenges</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.challenges.map((c) => (
                <Badge key={c} variant="outline" className="rounded-full border-white/10 bg-white/5 px-3 py-1 text-sm font-normal">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card-premium p-6">
            <h3 className="eyebrow">Company details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={<Globe className="h-4 w-4" />} label="Website" value={<a className="text-foreground hover:underline" href={b.website}>{b.website.replace(/^https?:\/\//, "")}</a>} />
              <Row icon={<Users className="h-4 w-4" />} label="Size" value={b.size} />
              <Row icon={<MapPin className="h-4 w-4" />} label="HQ" value={`${b.city}${b.state ? `, ${b.state}` : ""}, ${b.country}`} />
              <Row icon={<Calendar className="h-4 w-4" />} label="Founded" value={b.founded.toString()} />
            </dl>
          </div>

          <div className="card-premium p-6">
            <h3 className="eyebrow">Social</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.social?.linkedin && <SocialBtn href={b.social.linkedin} label="LinkedIn" icon={<Linkedin className="h-4 w-4" />} />}
              {b.social?.instagram && <SocialBtn href={b.social.instagram} label="Instagram" icon={<Instagram className="h-4 w-4" />} />}
              {b.social?.x && <SocialBtn href={b.social.x} label="X" icon={<XIcon />} />}
              {b.social?.youtube && <SocialBtn href={b.social.youtube} label="YouTube" icon={<Youtube className="h-4 w-4" />} />}
              {b.social?.facebook && <SocialBtn href={b.social.facebook} label="Facebook" icon={<Facebook className="h-4 w-4" />} />}
            </div>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <Eyebrow>Similar businesses</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">More in {b.industry}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <BusinessCard key={s.slug} b={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="inline-flex items-center gap-2 text-muted-foreground">{icon}{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}

function SocialBtn({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-white/25 hover:text-foreground"
    >
      {icon}
      {label}
    </a>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.77-6.24L4.8 22H2l7-8L1.5 2h6.99l4.32 5.71L18.244 2Zm-1.2 18h1.66L7.04 4H5.3l11.744 16Z" />
    </svg>
  );
}
