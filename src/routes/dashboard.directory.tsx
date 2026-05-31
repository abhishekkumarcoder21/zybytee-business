import { createFileRoute } from "@tanstack/react-router";
import { BusinessCard } from "@/components/zy/BusinessCard";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { BUSINESSES } from "@/data/businesses";
import { useQuery } from "@tanstack/react-query";
import { fetchBusinesses } from "@/lib/supabase/business";

export const Route = createFileRoute("/dashboard/directory")({
  component: DashboardDirectory,
});

function DashboardDirectory() {
  const { data: businesses = BUSINESSES } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Directory</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Discover businesses
        </h1>
        <p className="mt-2 text-muted-foreground">Recommended for Zybytee based on industry and stage.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.slice(0, 9).map((b) => (
          <BusinessCard key={b.slug} b={b} />
        ))}
      </div>
    </div>
  );
}
