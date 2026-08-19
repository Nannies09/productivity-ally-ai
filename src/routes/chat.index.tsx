import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadThreads, newThread, saveThreads, upsertThread } from "@/lib/threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workly AI" },
      {
        name: "description",
        content: "Chat with an AI workplace assistant in threaded conversations saved in your browser.",
      },
      { property: "og:title", content: "AI Chatbot — Workly AI" },
      { property: "og:description", content: "Threaded AI chat for everyday work questions." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    const threads = loadThreads();
    const target = threads[0] ?? newThread();
    if (!threads.length) saveThreads(upsertThread(threads, target));
    void navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
  }, [navigate]);

  return <p className="text-sm text-muted-foreground">Opening your chat…</p>;
}
