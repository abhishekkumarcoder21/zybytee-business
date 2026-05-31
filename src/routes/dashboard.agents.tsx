import { createFileRoute } from "@tanstack/react-router";
import { AgentsShowcase } from "@/components/zy/AgentsShowcase";

export const Route = createFileRoute("/dashboard/agents")({
  component: () => <AgentsShowcase embedded />,
});
