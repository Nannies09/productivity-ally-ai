import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Search, MessagesSquare, ArrowRight } from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workly AI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meeting notes, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "Workly AI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan tasks and research faster with an AI workplace assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    url: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    description: "Turn a few bullet points into a polished, on-tone email in seconds.",
    tag: "Communication",
  },
  {
    url: "/notes" as const,
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Condense transcripts into decisions, action items and owners.",
    tag: "Meetings",
  },
  {
    url: "/planner" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Break goals into sequenced tasks with effort estimates and priorities.",
    tag: "Planning",
  },
  {
    url: "/research" as const,
    icon: Search,
    title: "AI Research Assistant",
    description: "Get structured briefings, comparisons and open questions to verify.",
    tag: "Research",
  },
  {
    url: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Chatbot",
    description: "Threaded conversations for anything else on your plate.",
    tag: "Assistant",
  },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-panel sm:p-8">
        <Badge variant="secondary" className="mb-3">
          AI workspace
        </Badge>
        <h1 className="max-w-2xl text-2xl font-semibold sm:text-4xl">
          Automate the busywork, keep the judgment
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Five focused AI tools for everyday professional work — each with structured prompts and
          fully editable output you stay in control of.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Open the chatbot
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.url} to={tool.url} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-lift">
              <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <tool.icon className="size-4" />
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">
                  {tool.tag}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
