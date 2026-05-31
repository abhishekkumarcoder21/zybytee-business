import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Eye, Activity, Sparkles, MessageSquare, UserPlus, Heart, Eye as EyeIcon } from "lucide-react";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { Sparkline, BarChart, DonutChart } from "@/components/zy/Charts";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchMyBusiness } from "@/lib/supabase/business";
import { getAiReadinessScore, getProfileCompletion } from "@/lib/business-metrics";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useAuth();
  const { data: b } = useQuery({
    queryKey: ["my-business", user?.id],
    queryFn: () => (user ? fetchMyBusiness(user.id) : Promise.resolve(null)),
    enabled: !!user,
  });
  const profileScore = b ? getProfileCompletion(b) : 92;
  const aiScore = b ? getAiReadinessScore(b) : 82;

  return (
    <div className="space-y-10">
      <div>
        <Eyebrow>Overview</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Good morning, <span className="text-gradient-brand">Aditya</span>.
        </h1>
        <p className="mt-2 text-muted-foreground">Here's how Zybytee is performing across the ecosystem.</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Profile views" value="14,283" delta="+18.2%" icon={Eye} sparkData={[12, 18, 16, 22, 28, 34, 32, 38, 44, 52, 48, 58]} />
        <Metric label="Profile strength" value={`${profileScore}%`} delta="+4 pts" icon={Sparkles} sparkData={[60, 64, 68, 72, 70, 76, 80, 84, 86, 88, 90, 92]} />
        <Metric label="Business score" value="A+" delta="Top 5%" icon={TrendingUp} sparkData={[40, 45, 52, 58, 62, 70, 75, 78, 82, 86, 88, 92]} />
        <Metric label="AI readiness" value={`${aiScore}%`} delta="+12.4%" icon={Activity} sparkData={[30, 38, 42, 50, 54, 58, 64, 68, 72, 76, 80, 82]} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card-premium p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Profile views</Eyebrow>
              <div className="mt-1 font-display text-2xl font-semibold">Last 12 weeks</div>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-cyan">+18.2%</span>
          </div>
          <BarChart
            className="mt-6"
            data={[42, 51, 48, 60, 66, 72, 79, 88, 95, 104, 118, 132]}
            labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"]}
          />
        </div>

        <div className="card-premium p-6">
          <Eyebrow>Visitors by source</Eyebrow>
          <DonutChart
            className="mt-6"
            segments={[
              { label: "Directory", value: 48, color: "oklch(0.86 0.15 200)" },
              { label: "Search", value: 28, color: "oklch(0.72 0.18 245)" },
              { label: "Referral", value: 14, color: "oklch(0.65 0.22 295)" },
              { label: "Direct", value: 10, color: "oklch(0.5 0.04 260)" },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-premium p-6">
          <Eyebrow>Business health</Eyebrow>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Health label="Discoverability" value={88} />
            <Health label="Engagement" value={74} />
            <Health label="Content" value={65} />
            <Health label="Network" value={92} />
          </div>
        </div>

        <div className="card-premium p-6">
          <Eyebrow>Recent activity</Eyebrow>
          <ul className="mt-5 space-y-4">
            <Activity_ icon={EyeIcon} text="Nimbus Labs viewed your profile" time="2m ago" tint="brand-cyan" />
            <Activity_ icon={UserPlus} text="Connection request from Synapse Health" time="34m ago" tint="brand-blue" />
            <Activity_ icon={Heart} text="Lattice Design Co. favorited Zybytee" time="2h ago" tint="brand-violet" />
            <Activity_ icon={MessageSquare} text="Quark Robotics mentioned you in a post" time="Yesterday" tint="brand-cyan" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  icon: Icon,
  sparkData,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  sparkData: number[];
}) {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-brand-cyan">{delta}</span>
      </div>
      <Sparkline data={sparkData} className="mt-3 h-12 w-full" />
    </div>
  );
}

function Health({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full bg-gradient-brand" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Activity_({ icon: Icon, text, time, tint }: { icon: React.ComponentType<{ className?: string }>; text: string; time: string; tint: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm">{text}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{time}</div>
      </div>
    </li>
  );
}
