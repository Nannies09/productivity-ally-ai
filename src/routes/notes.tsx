import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { AiToolWorkspace, type ToolConfig } from "@/components/AiToolWorkspace";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workly AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into summaries, decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workly AI" },
      {
        property: "og:description",
        content: "Condense transcripts into decisions, action items and follow-ups.",
      },
    ],
  }),
  component: NotesPage,
});

const config: ToolConfig = {
  system:
    "You are a meticulous meeting analyst. Summarize only what is present in the notes; never infer owners, dates or decisions that are not stated — mark them as 'unclear' instead. Output markdown with sections: Summary, Key decisions, Action items (table: task | owner | due), Risks & open questions, Suggested follow-up message.",
  submitLabel: "Summarize notes",
  outputLabel: "Editable meeting summary",
  fileName: "meeting-summary.md",
  fields: [
    {
      name: "notes",
      label: "Raw notes or transcript",
      type: "textarea",
      rows: 12,
      placeholder: "Paste the meeting transcript or your rough notes…",
      required: true,
      hint: "Avoid pasting confidential or personal data.",
    },
    {
      name: "meetingType",
      label: "Meeting type",
      type: "select",
      options: ["Team stand-up", "Client meeting", "Project review", "Interview", "Workshop", "One-on-one"],
    },
    {
      name: "audience",
      label: "Summary audience",
      type: "select",
      options: ["Whole team", "Leadership", "Client", "Personal record"],
    },
    { name: "focus", label: "Focus areas (optional)", type: "input", placeholder: "budget, timeline, hiring" },
  ],
  buildPrompt: (v) =>
    [
      `Summarize these ${v["meetingType"]} notes for this audience: ${v["audience"]}.`,
      v["focus"] ? `Pay extra attention to: ${v["focus"]}` : "",
      "Notes:",
      v["notes"],
    ]
      .filter(Boolean)
      .join("\n"),
};

function NotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Decisions, action items and owners extracted from messy notes."
      />
      <AiToolWorkspace config={config} />
    </div>
  );
}
