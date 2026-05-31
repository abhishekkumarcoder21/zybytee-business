import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { BusinessLogo } from "@/components/zy/BusinessLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { fetchMyBusiness } from "@/lib/supabase/business";
import { getProfileCompletion } from "@/lib/business-metrics";

export const Route = createFileRoute("/dashboard/business")({
  component: MyBusiness,
});

function MyBusiness() {
  const { user } = useAuth();
  const { data: b } = useQuery({
    queryKey: ["my-business", user?.id],
    queryFn: () => (user ? fetchMyBusiness(user.id) : Promise.resolve(null)),
    enabled: !!user,
  });

  if (!b) {
    return (
      <div className="space-y-6">
        <Eyebrow>My business</Eyebrow>
        <div className="card-premium p-8">
          <h1 className="font-display text-2xl font-semibold">Create your business profile</h1>
          <p className="mt-2 text-muted-foreground">
            Start onboarding to unlock your dashboard, directory visibility, and analytics.
          </p>
          <Button asChild className="mt-5 rounded-full bg-gradient-brand">
            <Link to="/create">Begin onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completion = getProfileCompletion(b);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>My business</Eyebrow>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{b.name}</h1>
          <p className="mt-2 text-muted-foreground">{b.industry} · {b.city}, {b.country}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
            <Link to="/company/$slug" params={{ slug: b.slug }}>
              View public profile <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button className="rounded-full bg-gradient-brand">Edit profile</Button>
        </div>
      </div>

      <div className="card-premium relative overflow-hidden p-8">
        <div
          className="absolute -inset-20 opacity-25 blur-[120px]"
          style={{ background: `linear-gradient(120deg, ${b.gradient[0]}, ${b.gradient[1]})` }}
        />
        <div className="relative flex items-start gap-5">
          <BusinessLogo
            initials={b.initials ?? b.name.slice(0, 2).toUpperCase()}
            gradient={b.gradient ?? ["#67E8F9", "#3B82F6"]}
            size={72}
            logoUrl={b.logoUrl}
          />
          <div className="flex-1">
            <div className="font-display text-xl font-semibold">{b.name}</div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{b.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(b.challenges ?? []).map((c) => (
                <Badge key={c} variant="outline" className="rounded-full border-white/10 bg-white/5 font-normal">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Tile label="Profile completion" value={`${completion}%`} />
        <Tile label="Connections" value="148" />
        <Tile label="Pending invites" value="12" />
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-premium p-6">
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
