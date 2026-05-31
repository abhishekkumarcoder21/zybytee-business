import { Link } from "@tanstack/react-router";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const NAV = [
  { to: "/directory", label: "Directory" },
  { to: "/tools", label: "Tools" },
  { to: "/agents", label: "AI Agents" },
  { to: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const configured = isSupabaseConfigured();
  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6">
      <div className="glass shadow-glow mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/10 px-5 lg:px-7">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-white/5" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {configured && user ? (
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={async () => {
                await signOut();
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild className="rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90">
            <Link to="/create">Create profile →</Link>
          </Button>
        </div>

        <button
          className="rounded-full p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass mx-auto mt-3 max-w-6xl rounded-2xl border border-white/10 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <button
              type="button"
              className="mt-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
            >
              Toggle {theme === "dark" ? "light" : "dark"} mode
            </button>
            {configured && user ? (
              <button
                type="button"
                className="rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                onClick={async () => {
                  await signOut();
                  setOpen(false);
                }}
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}
            <Link
              to="/create"
              className="mt-2 rounded-full bg-gradient-brand px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              Create profile →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
