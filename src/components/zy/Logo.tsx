import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-surface-elevated ring-1 ring-white/10">
        <img src="/pngfav.png" alt="Zybytee" className="h-full w-full object-contain" />
      </span>
      <span className="flex items-baseline gap-1.5 font-display text-[15px] font-semibold tracking-tight">
        Zybytee
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          / Business
        </span>
      </span>
    </Link>
  );
}
