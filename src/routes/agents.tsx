import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/zy/PageShell";
import { AgentsShowcase } from "@/components/zy/AgentsShowcase";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "AI Agents — Business Hub by Zybytee" },
      { name: "description", content: "A digital workforce — autonomous AI agents across sales, marketing, support and operations." },
    ],
    links: [{ rel: "canonical", href: "/agents" }],
  }),
  component: () => (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <AgentsShowcase />
        </div>
      </section>
    </PageShell>
  ),
});
