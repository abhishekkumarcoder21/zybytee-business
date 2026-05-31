import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/zy/PageShell";
import { ToolsShowcase } from "@/components/zy/ToolsShowcase";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools — Business Hub by Zybytee" },
      { name: "description", content: "AI-native tools built to help businesses move faster, sharper and more autonomously." },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: () => (
    <PageShell>
      <section className="relative">
        <div className="absolute inset-0 grid-bg grid-bg-fade" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <ToolsShowcase />
        </div>
      </section>
    </PageShell>
  ),
});
