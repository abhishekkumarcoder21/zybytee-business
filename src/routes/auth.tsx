import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isRateLimited } from "@/lib/rate-limit";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Business Hub by Zybytee" },
      { name: "description", content: "Access your Business Hub account." },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: Auth,
});

type Mode = "signin" | "signup";

type FormState = {
  email: string;
  password: string;
  fullName: string;
};

const EMPTY: FormState = { email: "", password: "", fullName: "" };

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async () => {
    setError(null);

    if (!configured) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (isRateLimited("auth-submit")) {
      setError("Please wait a moment before trying again.");
      return;
    }

    if (!form.email || !form.password || (mode === "signup" && !form.fullName)) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabaseClient();
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.fullName },
            emailRedirectTo: `${window.location.origin}/create`,
          },
        });
        if (signUpError) throw signUpError;
        await navigate({ to: "/create" });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
        await navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!configured) {
      setError("Supabase is not configured yet.");
      return;
    }

    if (isRateLimited("auth-google")) {
      setError("Please wait a moment before trying again.");
      return;
    }

    try {
      setLoading(true);
      const supabase = getSupabaseClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/create` },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-xl px-5 py-16 lg:px-8">
          <Eyebrow>Authentication</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {mode === "signup"
              ? "Join Business Hub to create your profile and unlock future tools."
              : "Sign in to manage your business profile and dashboard."}
          </p>

          <div className="card-premium mt-10 space-y-6 p-8">
            {!configured && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                Supabase is not configured yet. Add env vars and run the schema setup to enable auth.
              </div>
            )}

            {mode === "signup" && (
              <Field label="Full name" required>
                <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your name" />
              </Field>
            )}
            <Field label="Email" required>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
            </Field>
            <Field label="Password" required>
              <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimum 8 characters" />
            </Field>

            {error && <div className="text-sm text-red-400">{error}</div>}

            <Button onClick={submit} disabled={loading} className="w-full rounded-full bg-gradient-brand text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-white/15 bg-white/5"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account?" : "New here?"} {" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="text-brand-cyan hover:underline"
              >
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              By continuing, you agree to the Zybytee terms. <Link to="/">View homepage</Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="eyebrow">{label}{required && <span className="ml-1 text-brand-cyan">*</span>}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
