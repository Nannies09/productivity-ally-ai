import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AiToolWorkspace, type ToolConfig } from "@/components/AiToolWorkspace";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workly AI" },
      {
        name: "description",
        content:
          "Get structured research briefings, comparisons, pros and cons, and a verification checklist for work topics.",
      },
      { property: "og:title", content: "AI Research Assistant — Workly AI" },
      {
        property: "og:description",
        content: "Structured briefings and comparisons with an explicit list of things to verify.",
      },
    ],
  }),
  component: ResearchPage,
});

const config: ToolConfig = {
  system:
    "You are a careful research analyst working from general knowledge only — you have no live web access. Never fabricate statistics, quotes, sources or URLs. Output markdown with: Overview, Key points, Comparison or options table when relevant, Trade-offs, What to verify (explicit list), and Suggested next steps. Where a claim is uncertain or time-sensitive, say so plainly.",
  submitLabel: "Run research brief",
  outputLabel: "Editable research brief",
  fileName: "research-brief.md",
  fields: [
    {
      name: "topic",
      label: "Research question or topic",
      type: "textarea",
      rows: 4,
      placeholder: "How do teams usually structure an internal AI usage policy?",
      required: true,
    },
    {
      name: "depth",
      label: "Depth",
      type: "select",
      options: ["Quick brief", "Standard briefing", "Deep dive"],
    },
    {
      name: "format",
      label: "Output format",
      type: "select",
      options: ["Briefing note", "Comparison table", "Pros & cons", "Executive summary", "FAQ"],
    },
    { name: "context", label: "Business context", type: "input", placeholder: "e.g. 40-person consultancy in South Africa" },
  ],
  buildPrompt: (v) =>
    [
      `Research topic: ${v["topic"]}`,
      `Depth: ${v["depth"]}`,
      `Preferred format: ${v["format"]}`,
      v["context"] ? `Business context: ${v["context"]}` : "",
      "Be explicit about uncertainty and list what the reader must verify independently.",
    ]
      .filter(Boolean)
      .join("\n"),
};

function ResearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Structured briefings with an explicit list of facts to verify."
      />
      <AiToolWorkspace config={config} />
    </div>
  );
}
