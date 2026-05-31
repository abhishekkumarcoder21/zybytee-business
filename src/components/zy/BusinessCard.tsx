import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import type { Business } from "@/data/businesses";
import { BusinessLogo } from "./BusinessLogo";

export function BusinessCard({ b }: { b: Business }) {
  const gradient = b.gradient ?? ["#67E8F9", "#3B82F6"];
  const initials = b.initials ?? b.name.slice(0, 2).toUpperCase();
  return (
    <Link
      to="/company/$slug"
      params={{ slug: b.slug }}
      className="card-premium group flex flex-col gap-5 p-6"
    >
      <div className="flex items-start justify-between">
        <BusinessLogo initials={initials} gradient={gradient} logoUrl={b.logoUrl} />
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">{b.name}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{b.industry}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {b.city}, {b.country}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {b.size}
        </span>
      </div>
    </Link>
  );
}
