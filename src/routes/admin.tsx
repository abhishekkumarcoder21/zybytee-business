import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, UserPlus, Globe2, TrendingUp, Shield, ArrowUpRight, Download, Trash2 } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { Counter } from "@/components/zy/Counter";
import { BarChart, DonutChart, Sparkline } from "@/components/zy/Charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESSES } from "@/data/businesses";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { deleteBusiness, fetchBusinesses } from "@/lib/supabase/business";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Business Hub by Zybytee" },
      { name: "description", content: "Platform admin overview." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
    const [q, setQ] = useState("");
    const { data: businesses = BUSINESSES, refetch } = useQuery({
      queryKey: ["admin-businesses"],
      queryFn: fetchBusinesses,
    });

    const filtered = useMemo(() => {
      if (!q) return businesses;
      const term = q.toLowerCase();
      return businesses.filter((b) =>
        `${b.name} ${b.industry} ${b.country} ${b.city}`.toLowerCase().includes(term),
      );
    }, [q, businesses]);

    const exportCsv = () => {
      const rows = filtered.map((b) => ({
        name: b.name,
        industry: b.industry,
        country: b.country,
        city: b.city,
        size: b.size,
        website: b.website,
      }));
      const header = Object.keys(rows[0] ?? {}).join(",");
      const csv = [header, ...rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "businesses.csv";
      a.click();
      URL.revokeObjectURL(url);
    };
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useMemo(() => {
    const email = user?.email ?? "";
    const role = (user?.app_metadata as { role?: string } | undefined)?.role;
    return role === "admin" || email.endsWith("@zybytee.in");
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  if (!isSupabaseConfigured()) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="card-premium p-8">
            <h1 className="font-display text-2xl font-semibold">Supabase not configured</h1>
            <p className="mt-3 text-muted-foreground">Set up Supabase to enable admin tools.</p>
            <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-brand px-5 py-2 text-sm text-primary-foreground">
              Return home
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="card-premium p-8">
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!user || !isAdmin) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="card-premium p-8">
            <h1 className="font-display text-2xl font-semibold">Admin access required</h1>
            <p className="mt-3 text-muted-foreground">This area is limited to Zybytee administrators.</p>
            <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-brand px-5 py-2 text-sm text-primary-foreground">
              Return home
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-7xl space-y-10 px-5 py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Admin · Internal</Eyebrow>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Platform <span className="text-gradient-brand">overview</span>
              </h1>
              <p className="mt-2 text-muted-foreground">Operational view of the Business Hub ecosystem.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-cyan">
              <Shield className="h-3.5 w-3.5" /> Demo data
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total businesses" value={12480} icon={Building2} delta="+312 this week" />
            <Stat label="New registrations" value={312} icon={UserPlus} delta="+18% w/w" />
            <Stat label="Countries" value={62} icon={Globe2} delta="+3 this month" />
            <Stat label="Active sessions" value={4128} icon={TrendingUp} delta="now" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="card-premium p-6 lg:col-span-2">
              <Eyebrow>Growth · last 12 months</Eyebrow>
              <BarChart
                className="mt-6"
                data={[420, 580, 640, 820, 980, 1150, 1480, 1720, 2040, 2580, 3120, 3960]}
                labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
              />
            </div>
            <div className="card-premium p-6">
              <Eyebrow>Industry distribution</Eyebrow>
              <DonutChart
                className="mt-6"
                segments={[
                  { label: "Tech / SaaS", value: 32, color: "oklch(0.86 0.15 200)" },
                  { label: "Fintech", value: 18, color: "oklch(0.72 0.18 245)" },
                  { label: "Healthcare", value: 14, color: "oklch(0.65 0.22 295)" },
                  { label: "Consumer", value: 16, color: "oklch(0.7 0.17 160)" },
                  { label: "Other", value: 20, color: "oklch(0.45 0.04 260)" },
                ]}
              />
            </div>
          </div>

          <div className="card-premium overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 p-6">
              <div>
                <Eyebrow>Business directory</Eyebrow>
                <div className="mt-1 font-display text-lg font-semibold">All registered businesses</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search businesses..."
                  className="h-9 w-56 border-white/10 bg-white/5"
                />
                <Button variant="outline" className="rounded-full border-white/15 bg-white/5" onClick={exportCsv}>
                  <Download className="mr-1 h-4 w-4" /> Export
                </Button>
                <Link to="/directory" className="inline-flex items-center gap-1 text-sm text-brand-cyan hover:underline">
                  View public directory <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="px-6 py-3">Business</th>
                    <th className="px-6 py-3">Industry</th>
                    <th className="px-6 py-3">Country</th>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.slug} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg font-display text-xs font-semibold"
                            style={{ background: `linear-gradient(135deg, ${(b.gradient ?? ["#67E8F9", "#3B82F6"])[0]}, ${(b.gradient ?? ["#67E8F9", "#3B82F6"])[1]})` }}
                          >
                            {(b.initials ?? b.name.slice(0, 2)).toUpperCase()}
                          </div>
                          <Link to="/company/$slug" params={{ slug: b.slug }} className="font-medium hover:text-brand-cyan">{b.name}</Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{b.industry}</td>
                      <td className="px-6 py-4 text-muted-foreground">{b.country}</td>
                      <td className="px-6 py-4 text-muted-foreground">{b.size}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Sparkline
                            className="h-8 w-24"
                            data={Array.from({ length: 10 }, (_, k) => 20 + ((k * 7 + i * 13) % 40) + k * 4)}
                          />
                          <Button
                            variant="ghost"
                            className="h-8 w-8 rounded-full"
                            onClick={async () => {
                              if (!b.id) return;
                              if (!confirm(`Delete ${b.name}?`)) return;
                              await deleteBusiness(b.id);
                              await refetch();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value, icon: Icon, delta }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; delta: string }) {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
        <Counter to={value} />
      </div>
      <div className="mt-1 text-xs text-brand-cyan">{delta}</div>
    </div>
  );
}
