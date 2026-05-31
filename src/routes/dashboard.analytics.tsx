import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { BarChart, Sparkline, DonutChart } from "@/components/zy/Charts";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Analytics</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Growth signals</h1>
        <p className="mt-2 text-muted-foreground">How your business is being discovered and engaged with.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Stat label="Impressions" value="58,420" delta="+24%" data={[20, 28, 34, 32, 44, 48, 56, 62, 70, 78, 84, 92]} />
        <Stat label="Profile clicks" value="3,148" delta="+11%" data={[18, 22, 19, 28, 32, 30, 38, 42, 46, 52, 56, 62]} />
        <Stat label="Connections" value="148" delta="+8%" data={[40, 45, 50, 58, 64, 70, 78, 84, 90, 98, 110, 120]} />
      </div>

      <div className="card-premium p-6">
        <Eyebrow>Weekly engagement</Eyebrow>
        <BarChart
          className="mt-6"
          data={[120, 168, 145, 210, 248, 192, 280, 318, 264, 340, 392, 442]}
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-premium p-6">
          <Eyebrow>Visitors by country</Eyebrow>
          <DonutChart
            className="mt-6"
            segments={[
              { label: "India", value: 42, color: "oklch(0.86 0.15 200)" },
              { label: "United States", value: 22, color: "oklch(0.72 0.18 245)" },
              { label: "United Kingdom", value: 14, color: "oklch(0.65 0.22 295)" },
              { label: "Other", value: 22, color: "oklch(0.45 0.04 260)" },
            ]}
          />
        </div>
        <div className="card-premium p-6">
          <Eyebrow>Industries reaching you</Eyebrow>
          <DonutChart
            className="mt-6"
            segments={[
              { label: "AI / SaaS", value: 38, color: "oklch(0.86 0.15 200)" },
              { label: "Fintech", value: 22, color: "oklch(0.72 0.18 245)" },
              { label: "Healthcare", value: 18, color: "oklch(0.65 0.22 295)" },
              { label: "Other", value: 22, color: "oklch(0.45 0.04 260)" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, delta, data }: { label: string; value: string; delta: string; data: number[] }) {
  return (
    <div className="card-premium p-6">
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-brand-cyan">{delta}</span>
      </div>
      <Sparkline data={data} className="mt-3 h-14 w-full" />
    </div>
  );
}
