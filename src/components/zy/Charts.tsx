import { useMemo } from "react";

type Props = {
  data: number[];
  className?: string;
  fill?: boolean;
  stroke?: string;
};

export function Sparkline({ data, className = "", fill = true, stroke = "oklch(0.82 0.16 220)" }: Props) {
  const path = useMemo(() => {
    if (!data.length) return { line: "", area: "" };
    const w = 300;
    const h = 80;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1 || 1);
    const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * (h - 8) - 4] as const);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${line} L${w},${h} L0,${h} Z`;
    return { line, area };
  }, [data]);

  return (
    <svg viewBox="0 0 300 80" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="spk-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={path.area} fill="url(#spk-fill)" />}
      <path d={path.line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChart({ data, labels, className = "" }: { data: number[]; labels?: string[]; className?: string }) {
  const max = Math.max(...data) || 1;
  return (
    <div className={`flex h-40 items-end gap-2 ${className}`}>
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-brand opacity-80 transition hover:opacity-100"
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
          {labels?.[i] && <span className="font-mono text-[10px] text-muted-foreground">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export function DonutChart({
  segments,
  className = "",
}: {
  segments: { label: string; value: number; color: string }[];
  className?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const C = 2 * Math.PI * 42;
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth="12" />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const dash = `${len} ${C - len}`;
          const offset = -((acc / total) * C);
          acc += s.value;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <ul className="space-y-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto tabular-nums text-foreground">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
