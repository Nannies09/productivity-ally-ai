import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { AiToolWorkspace, type ToolConfig } from "@/components/AiToolWorkspace";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workly AI" },
      {
        name: "description",
        content:
          "Break work goals into a prioritized, sequenced task plan with effort estimates and milestones.",
      },
      { property: "og:title", content: "AI Task Planner — Workly AI" },
      {
        property: "og:description",
        content: "Turn a goal into a prioritized plan with owners, effort and milestones.",
      },
    ],
  }),
  component: PlannerPage,
});

const config: ToolConfig = {
  system:
    "You are a pragmatic project planner. Produce realistic, sequenced plans. Output markdown with: Objective, Assumptions, Task plan (table: # | task | priority | effort | suggested owner | dependency), Milestones with dates relative to the timeframe, and Risks. Flag any assumption the user should confirm.",
  submitLabel: "Build task plan",
  outputLabel: "Editable task plan",
  fileName: "task-plan.md",
  fields: [
    {
      name: "goal",
      label: "Goal or project",
      type: "textarea",
      rows: 4,
      placeholder: "Launch the customer onboarding revamp",
      required: true,
    },
    { name: "timeframe", label: "Timeframe", type: "input", placeholder: "e.g. 3 weeks", required: true },
    { name: "capacity", label: "Team / capacity", type: "input", placeholder: "e.g. 2 designers, 1 PM, part-time dev" },
    {
      name: "style",
      label: "Plan style",
      type: "select",
      options: ["Daily checklist", "Weekly sprint plan", "Milestone roadmap", "Kanban backlog"],
    },
    {
      name: "constraints",
      label: "Constraints & priorities",
      type: "textarea",
      rows: 3,
      placeholder: "Budget frozen until month end, compliance review required…",
    },
  ],
  buildPrompt: (v) =>
    [
      `Create a ${v["style"]} for this goal: ${v["goal"]}`,
      `Timeframe: ${v["timeframe"]}`,
      v["capacity"] ? `Available capacity: ${v["capacity"]}` : "",
      v["constraints"] ? `Constraints and priorities: ${v["constraints"]}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
};

function PlannerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Sequenced tasks, effort estimates and milestones for any goal."
      />
      <AiToolWorkspace config={config} />
    </div>
  );
}
