import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated ring-1 ring-white/10">
        <span className="absolute inset-1.5 rounded-md bg-gradient-brand opacity-90" />
        <span className="absolute inset-[10px] rounded-sm bg-background/80" />
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
