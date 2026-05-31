import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Compass, BarChart3, Wrench, Bot, Settings, Bell, Search } from "lucide-react";
import { Logo } from "@/components/zy/Logo";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { fetchMyBusiness } from "@/lib/supabase/business";
import { getAiReadinessScore } from "@/lib/business-metrics";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Business Hub by Zybytee" }],
  }),
  component: DashboardLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/business", label: "My Business", icon: Building2 },
  { to: "/dashboard/directory", label: "Directory", icon: Compass },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/tools", label: "Tools", icon: Wrench },
  { to: "/dashboard/agents", label: "Agents", icon: Bot },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const { data: myBusiness } = useQuery({
    queryKey: ["my-business", user?.id],
    queryFn: () => (user ? fetchMyBusiness(user.id) : Promise.resolve(null)),
    enabled: !!user,
  });
  const aiScore = myBusiness ? getAiReadinessScore(myBusiness) : 82;

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="card-premium p-8">
          <h1 className="font-display text-2xl font-semibold">Supabase not configured</h1>
          <p className="mt-3 text-muted-foreground">
            Add your Supabase keys to continue using the dashboard.
          </p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-brand px-5 py-2 text-sm text-primary-foreground">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="card-premium p-8">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 px-4 py-6 backdrop-blur-xl lg:flex">
          <Logo />
          <nav className="mt-10 flex flex-col gap-0.5">
            {NAV.map((n) => {
              const isActive = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to as "/dashboard"}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-white/5 text-foreground ring-1 ring-white/10"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <n.icon className={`h-4 w-4 ${isActive ? "text-brand-cyan" : ""}`} />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI readiness</div>
            <div className="mt-2 font-display text-2xl font-semibold text-gradient-brand">{aiScore}%</div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-gradient-brand" style={{ width: `${aiScore}%` }} />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-background/70 px-5 backdrop-blur-xl lg:px-8">
            <div className="flex flex-1 items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search businesses, tools, agents…" className="max-w-md border-0 bg-transparent shadow-none focus-visible:ring-0" />
            </div>
            <button className="rounded-full border border-white/10 bg-white/5 p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <Link to="/" className="rounded-full px-3 py-1.5 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
              ← Public site
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden text-xs sm:block">
                <div className="font-medium">{displayName}</div>
                <div className="text-muted-foreground">Business Hub</div>
              </div>
            </div>
          </header>

          <div className="px-5 py-8 lg:px-8 lg:py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
