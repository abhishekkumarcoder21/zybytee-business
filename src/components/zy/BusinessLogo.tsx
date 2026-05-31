type Props = {
  initials: string;
  gradient: [string, string];
  size?: number;
  className?: string;
  logoUrl?: string | null;
};

export function BusinessLogo({ initials, gradient, size = 48, className = "", logoUrl }: Props) {
  const id = `g-${initials}-${gradient[0].slice(1)}`;
  if (logoUrl) {
    return (
      <div
        className={`overflow-hidden rounded-xl bg-white/5 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${id})`} />
      <rect width="48" height="48" rx="12" fill="black" fillOpacity="0.18" />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="18"
        fontWeight="600"
        fill="white"
      >
        {initials}
      </text>
    </svg>
  );
}
