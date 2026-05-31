import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Eyebrow } from "@/components/zy/Eyebrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Aditya Verma",
    title: "Founder & CEO",
    email: "aditya@zybytee.in",
    company: "Zybytee",
    bio: "Building futuristic software, AI systems and digital infrastructure at Zybytee.",
    notifyEmail: true,
    notifyProduct: true,
    notifyDigest: false,
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-10">
      <div>
        <Eyebrow>Settings</Eyebrow>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="card-premium p-8">
        <h2 className="font-display text-lg font-semibold">Personal</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Bio">
              <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </Field>
          </div>
        </div>
      </div>

      <div className="card-premium p-8">
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
        <div className="mt-6 divide-y divide-white/5">
          <Toggle label="Email notifications" desc="Get notified about important account activity." value={form.notifyEmail} onChange={(v) => setForm({ ...form, notifyEmail: v })} />
          <Toggle label="Product updates" desc="New tools, agents and platform releases." value={form.notifyProduct} onChange={(v) => setForm({ ...form, notifyProduct: v })} />
          <Toggle label="Weekly digest" desc="A summary of your business activity each Monday." value={form.notifyDigest} onChange={(v) => setForm({ ...form, notifyDigest: v })} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-cyan">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
        <Button variant="ghost" className="rounded-full">Cancel</Button>
        <Button onClick={save} className="rounded-full bg-gradient-brand text-primary-foreground">Save changes</Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="eyebrow">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
