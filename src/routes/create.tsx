import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Briefcase, Building2, MapPin, Users, Target, Share2 } from "lucide-react";
import { PageShell } from "@/components/zy/PageShell";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { INDUSTRIES, SIZES } from "@/data/businesses";
import { useAuth } from "@/lib/auth";
import { createBusinessProfile } from "@/lib/supabase/business";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isRateLimited } from "@/lib/rate-limit";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Business Profile — Zybytee" },
      { name: "description", content: "Stake your claim in the AI era. Create your Zybytee business profile in minutes." },
    ],
    links: [{ rel: "canonical", href: "/create" }],
  }),
  component: Create,
});

const STEPS = [
  { id: 1, label: "Basic info", icon: Briefcase },
  { id: 2, label: "Business", icon: Building2 },
  { id: 3, label: "Location", icon: MapPin },
  { id: 4, label: "Size", icon: Users },
  { id: 5, label: "Challenges", icon: Target },
  { id: 6, label: "Social", icon: Share2 },
];

const CHALLENGES = [
  "Customer Acquisition",
  "Marketing",
  "Sales",
  "Branding",
  "Website",
  "Hiring",
  "Automation",
  "AI Adoption",
  "Funding",
  "Operations",
];

type FormState = {
  businessName: string;
  founderName: string;
  email: string;
  website: string;
  logoFile?: File | null;
  industry: string;
  category: string;
  description: string;
  country: string;
  state: string;
  city: string;
  size: string;
  challenges: string[];
  linkedin: string;
  instagram: string;
  x: string;
  youtube: string;
  facebook: string;
};

const EMPTY: FormState = {
  businessName: "", founderName: "", email: "", website: "",
  logoFile: null,
  industry: "", category: "", description: "",
  country: "", state: "", city: "",
  size: "",
  challenges: [],
  linkedin: "", instagram: "", x: "", youtube: "", facebook: "",
};

function Create() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleChallenge = (c: string) =>
    set("challenges", form.challenges.includes(c) ? form.challenges.filter((x) => x !== c) : [...form.challenges, c]);

  const next = async () => {
    if (step < 6) {
      setStep(step + 1);
      return;
    }
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured yet.");
      return;
    }
    if (!user) {
      setError("Please sign in to complete onboarding.");
      return;
    }
    if (isRateLimited("onboarding-submit")) {
      setError("Please wait a moment before submitting again.");
      return;
    }
    if (!form.businessName || !form.founderName || !form.email || !form.industry || !form.category || !form.description || !form.country || !form.city || !form.size) {
      setError("Please complete all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await createBusinessProfile(user, {
        businessName: form.businessName,
        founderName: form.founderName,
        email: form.email,
        website: form.website,
        industry: form.industry,
        category: form.category,
        description: form.description,
        country: form.country,
        state: form.state,
        city: form.city,
        size: form.size,
        challenges: form.challenges,
        linkedin: form.linkedin,
        instagram: form.instagram,
        x: form.x,
        youtube: form.youtube,
        facebook: form.facebook,
        logoFile: form.logoFile ?? null,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business profile.");
    } finally {
      setSubmitting(false);
    }
  };
  const back = () => setStep(Math.max(1, step - 1));

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-32 text-center">
          <h1 className="font-display text-4xl font-semibold">Sign in to create a profile</h1>
          <p className="mt-4 text-muted-foreground">
            You'll need an account to publish your business profile and access the dashboard.
          </p>
          <Button asChild className="mt-6 rounded-full bg-gradient-brand">
            <Link to="/auth">Go to sign in</Link>
          </Button>
        </div>
      </PageShell>
    );
  }

  if (done) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-32 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
            <Check className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">You're in.</h1>
          <p className="mt-4 text-muted-foreground">
            Your business profile is ready. From here you can refine your story, invite teammates and prepare for the AI era.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={() => navigate({ to: "/dashboard" })} className="rounded-full bg-gradient-brand text-primary-foreground">
              Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
              <Link to="/directory">Explore directory</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <Eyebrow>Onboarding</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Create your <span className="text-gradient-brand">business profile</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Step {step} of {STEPS.length} · takes about 2 minutes</p>

          {/* Stepper */}
          <div className="mt-10">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
              <div
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-brand transition-all"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((s) => {
                const active = step === s.id;
                const completed = step > s.id;
                return (
                  <div key={s.id} className="relative flex flex-col items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        completed
                          ? "border-transparent bg-gradient-brand text-primary-foreground"
                          : active
                          ? "border-brand-cyan/60 bg-surface text-foreground ring-brand"
                          : "border-white/10 bg-surface text-muted-foreground"
                      }`}
                    >
                      {completed ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                    </div>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step body */}
          <div className="card-premium mt-10 p-8 sm:p-10">
            {step === 1 && (
              <Grid2>
                <Field label="Business name" required><Input value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="Zybytee" /></Field>
                <Field label="Founder name" required><Input value={form.founderName} onChange={(e) => set("founderName", e.target.value)} placeholder="Your name" /></Field>
                <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="founder@company.com" /></Field>
                <Field label="Website"><Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" /></Field>
                <Field label="Logo upload">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 2 * 1024 * 1024) {
                        setError("Logo must be smaller than 2MB.");
                        set("logoFile", null);
                        return;
                      }
                      setError(null);
                      set("logoFile", file);
                    }}
                  />
                </Field>
              </Grid2>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Grid2>
                  <Field label="Industry" required>
                    <select className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm" value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                    </select>
                  </Field>
                  <Field label="Category" required><Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. AI Infrastructure" /></Field>
                </Grid2>
                <Field label="Description" required>
                  <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What does your business do?" />
                </Field>
              </div>
            )}

            {step === 3 && (
              <Grid2>
                <Field label="Country" required><Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="India" /></Field>
                <Field label="State / Region"><Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Karnataka" /></Field>
                <Field label="City" required><Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Bengaluru" /></Field>
              </Grid2>
            )}

            {step === 4 && (
              <div>
                <Label className="eyebrow">Company size</Label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {SIZES.map((s) => {
                    const active = form.size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("size", s)}
                        className={`rounded-xl border p-5 text-left transition ${
                          active
                            ? "border-brand-cyan/60 bg-white/5 ring-brand"
                            : "border-white/10 bg-surface hover:border-white/20"
                        }`}
                      >
                        <div className="font-display text-lg font-semibold">{s}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">people</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <Label className="eyebrow">Pick all that apply</Label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {CHALLENGES.map((c) => {
                    const active = form.challenges.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChallenge(c)}
                        className={`rounded-xl border p-4 text-left text-sm transition ${
                          active
                            ? "border-brand-cyan/60 bg-white/5 ring-brand"
                            : "border-white/10 bg-surface hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{c}</span>
                          {active && <Check className="h-4 w-4 text-brand-cyan" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <Grid2>
                <Field label="LinkedIn"><Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/…" /></Field>
                <Field label="Instagram"><Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/…" /></Field>
                <Field label="X (Twitter)"><Input value={form.x} onChange={(e) => set("x", e.target.value)} placeholder="https://x.com/…" /></Field>
                <Field label="YouTube"><Input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtube.com/@…" /></Field>
                <Field label="Facebook"><Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/…" /></Field>
              </Grid2>
            )}

            {error && <div className="mt-6 text-sm text-red-400">{error}</div>}

            <div className="mt-10 flex items-center justify-between">
              <Button variant="ghost" onClick={back} disabled={step === 1} className="rounded-full">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button onClick={next} disabled={submitting} className="rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90">
                {step === 6 ? (submitting ? "Submitting..." : "Finish") : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="eyebrow">{label}{required && <span className="ml-1 text-brand-cyan">*</span>}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
