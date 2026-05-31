import { createFileRoute } from "@tanstack/react-router";
import { ToolsShowcase } from "@/components/zy/ToolsShowcase";

export const Route = createFileRoute("/dashboard/tools")({
  component: () => <ToolsShowcase embedded />,
});
