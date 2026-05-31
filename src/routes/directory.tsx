import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { BusinessCard } from "@/components/zy/BusinessCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BUSINESSES, SIZES } from "@/data/businesses";
import { fetchBusinesses } from "@/lib/supabase/business";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Business Directory — Business Hub by Zybytee" },
      { name: "description", content: "Browse and discover businesses across industries, countries and stages." },
      { property: "og:title", content: "Business Directory — Zybytee" },
      { property: "og:description", content: "Discover ambitious businesses worldwide." },
    ],
    links: [{ rel: "canonical", href: "/directory" }],
  }),
  component: Directory,
});

const ANY = "any";

function Directory() {
  const { data: businesses = BUSINESSES } = useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });
  const industries = useMemo(() => Array.from(new Set(businesses.map((b) => b.industry))).sort(), [businesses]);
  const countries = useMemo(() => Array.from(new Set(businesses.map((b) => b.country))).sort(), [businesses]);
  const cities = useMemo(() => Array.from(new Set(businesses.map((b) => b.city))).sort(), [businesses]);
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState<string>(ANY);
  const [country, setCountry] = useState<string>(ANY);
  const [city, setCity] = useState<string>(ANY);
  const [size, setSize] = useState<string>(ANY);

  const results = useMemo(() => {
    return businesses.filter((b) => {
      if (q && !`${b.name} ${b.industry} ${b.category} ${b.description} ${b.city} ${b.country}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (industry !== ANY && b.industry !== industry) return false;
      if (country !== ANY && b.country !== country) return false;
      if (city !== ANY && b.city !== city) return false;
      if (size !== ANY && b.size !== size) return false;
      return true;
    });
  }, [q, industry, country, city, size, businesses]);

  const reset = () => {
    setQ("");
    setIndustry(ANY);
    setCountry(ANY);
    setCity(ANY);
    setSize(ANY);
  };

  return (
    <PageShell>
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <Eyebrow>Discovery</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Business <span className="text-gradient-brand">Directory</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore ambitious businesses across industries, countries and stages. Filter to find
            the partners, customers and inspiration you need.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-surface/80 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Search className="ml-2 h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, industry, city…"
                className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="mt-3 grid gap-2 border-t border-white/5 pt-3 sm:grid-cols-2 lg:grid-cols-5">
              <FilterSelect label="Industry" value={industry} onChange={setIndustry} options={industries} />
              <FilterSelect label="Country" value={country} onChange={setCountry} options={countries} />
              <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
              <FilterSelect label="Company size" value={size} onChange={setSize} options={[...SIZES]} />
              <Button variant="ghost" onClick={reset} className="justify-start gap-2 text-muted-foreground hover:text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Reset filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-mono text-foreground">{results.length}</span> businesses
          </p>
        </div>

        {results.length === 0 ? (
          <div className="card-premium p-16 text-center">
            <p className="text-muted-foreground">No businesses match your filters.</p>
            <Button onClick={reset} variant="outline" className="mt-4 rounded-full">
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((b) => (
              <BusinessCard key={b.slug} b={b} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-white/10 bg-white/5">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY}>Any {label.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
