import { createFileRoute, useParams } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/ChatWorkspace";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workly AI" },
      {
        name: "description",
        content:
          "Threaded AI chat for workplace questions, with conversations saved in this browser.",
      },
      { property: "og:title", content: "AI Chatbot — Workly AI" },
      { property: "og:description", content: "Threaded AI chat for everyday work questions." },
    ],
  }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  return <ChatWorkspace key={threadId} threadId={threadId} />;
}
