import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The business hub of the Zybytee ecosystem — built for the AI era.
          </p>
        </div>

        <FooterCol
          title="Product"
          links={[
            { to: "/directory", label: "Directory" },
            { to: "/tools", label: "Tools" },
            { to: "/agents", label: "AI Agents" },
            { to: "/dashboard", label: "Dashboard" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { to: "/create", label: "Create profile" },
            { to: "/admin", label: "Admin panel" },
            { to: "/company/zybytee", label: "About Zybytee" },
          ]}
        />
        <div>
          <h4 className="eyebrow mb-4">Ecosystem</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://zybytee.in" className="hover:text-foreground">zybytee.in</a></li>
            <li><a href="https://games.zybytee.in" className="hover:text-foreground">games.zybytee.in</a></li>
            <li><span className="text-foreground">business.zybytee.in</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <span className="font-mono">© {new Date().getFullYear()} ZYBYTEE — ENGINEERING THE FUTURE</span>
          <span className="font-mono uppercase tracking-[0.18em]">v0.1 · Preview</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="eyebrow mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
