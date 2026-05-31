export function NetworkIllustration({ className = "" }: { className?: string }) {
  // Concentric ring network with glowing nodes — pure SVG, no asset
  const nodes = [
    { r: 80, a: 30 }, { r: 80, a: 150 }, { r: 80, a: 270 },
    { r: 140, a: 0 }, { r: 140, a: 72 }, { r: 140, a: 144 }, { r: 140, a: 216 }, { r: 140, a: 288 },
    { r: 210, a: 20 }, { r: 210, a: 90 }, { r: 210, a: 160 }, { r: 210, a: 230 }, { r: 210, a: 300 },
  ];
  const toXY = (r: number, a: number) => {
    const rad = (a * Math.PI) / 180;
    return { x: 250 + r * Math.cos(rad), y: 250 + r * Math.sin(rad) };
  };
  return (
    <svg viewBox="0 0 500 500" className={className} aria-hidden>
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.18 245)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="oklch(0.65 0.22 295)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="ringStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.15 200)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 295)" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.95 0.12 220)" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 295)" />
        </radialGradient>
      </defs>

      <circle cx="250" cy="250" r="240" fill="url(#bgGlow)" />

      {[80, 140, 210].map((r) => (
        <circle key={r} cx="250" cy="250" r={r} fill="none" stroke="url(#ringStroke)" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* Connection lines */}
      {nodes.map((n, i) => {
        const { x, y } = toXY(n.r, n.a);
        return (
          <line
            key={`l-${i}`}
            x1="250"
            y1="250"
            x2={x}
            y2={y}
            stroke="oklch(0.82 0.16 220)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const { x, y } = toXY(n.r, n.a);
        return (
          <g key={`n-${i}`}>
            <circle cx={x} cy={y} r="10" fill="oklch(0.72 0.18 245)" opacity="0.15" />
            <circle cx={x} cy={y} r="4" fill="url(#nodeGlow)">
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Center */}
      <circle cx="250" cy="250" r="36" fill="oklch(0.18 0.03 252)" stroke="oklch(0.82 0.16 220 / 0.6)" />
      <circle cx="250" cy="250" r="14" fill="url(#nodeGlow)">
        <animate attributeName="r" values="14;18;14" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
