import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AiToolWorkspace, type ToolConfig } from "@/components/AiToolWorkspace";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workly AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from a few bullet points, with control over tone, audience and length.",
      },
      { property: "og:title", content: "Smart Email Generator — Workly AI" },
      {
        property: "og:description",
        content: "Turn rough notes into a polished, editable business email.",
      },
    ],
  }),
  component: EmailPage,
});

const config: ToolConfig = {
  system:
    "You are an expert business communication writer. Produce clear, courteous, professional emails. Use plain language, no filler, no invented facts. Return a subject line, then the email body, then a one-line note about anything the sender must verify before sending.",
  submitLabel: "Generate email",
  outputLabel: "Editable email draft",
  fileName: "email-draft.md",
  fields: [
    {
      name: "recipient",
      label: "Recipient / audience",
      type: "input",
      placeholder: "e.g. Head of Operations",
      required: true,
    },
    {
      name: "purpose",
      label: "Purpose & key points",
      type: "textarea",
      rows: 6,
      placeholder: "Follow up on the Q3 rollout, ask for sign-off by Friday, mention budget risk…",
      required: true,
    },
    { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Direct", "Formal", "Apologetic", "Persuasive"] },
    { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
    {
      name: "cta",
      label: "Desired action",
      type: "input",
      placeholder: "e.g. Confirm sign-off by Friday 12:00",
    },
  ],
  buildPrompt: (v) =>
    [
      "Write a workplace email.",
      `Recipient/audience: ${v.recipient}`,
      `Purpose and key points: ${v.purpose}`,
      `Tone: ${v.tone}`,
      `Length: ${v.length}`,
      v.cta ? `Desired action / call to action: ${v.cta}` : "",
      "Format: '**Subject:** …' on the first line, blank line, then the email body with greeting and sign-off placeholder [Your name].",
    ]
      .filter(Boolean)
      .join("\n"),
};

function EmailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft on-tone emails from bullet points, then edit before sending."
      />
      <AiToolWorkspace config={config} />
    </div>
  );
}
