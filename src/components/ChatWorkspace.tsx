import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  deriveTitle,
  loadThreads,
  messageText,
  newThread,
  saveThreads,
  upsertThread,
  type ChatThread,
} from "@/lib/threads";

const SUGGESTIONS = [
  "Rewrite this update so it sounds more confident",
  "Help me prepare for a difficult 1-on-1",
  "Turn my week's goals into a priority list",
];

export function ChatWorkspace({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [bootstrapped, setBootstrapped] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);

  useEffect(() => {
    const stored = loadThreads();
    const existing = stored.find((t) => t.id === threadId);
    const thread: ChatThread = existing ?? { ...newThread(), id: threadId };
    const next = upsertThread(stored, thread);
    saveThreads(next);
    setThreads(next);
    setInitialMessages(thread.messages);
    setBootstrapped(true);
  }, [threadId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (error) => {
      console.error(error);
      toast.error("The assistant couldn't respond. Please try again.");
    },
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!bootstrapped || isBusy || messages.length === 0) return;
    setThreads((prev) => {
      const current = prev.find((t) => t.id === threadId);
      const updated: ChatThread = {
        id: threadId,
        title: deriveTitle(messages, current?.title ?? "New chat"),
        updatedAt: Date.now(),
        messages,
      };
      const next = upsertThread(prev, updated);
      saveThreads(next);
      return next;
    });
  }, [bootstrapped, isBusy, messages, threadId]);

  useEffect(() => {
    if (!isBusy) textareaRef.current?.focus();
  }, [isBusy, threadId]);

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || isBusy) return;
      setInput("");
      void sendMessage({ text: value });
    },
    [isBusy, sendMessage],
  );

  function startThread() {
    const thread = newThread();
    const next = upsertThread(loadThreads(), thread);
    saveThreads(next);
    setThreads(next);
    void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
  }

  function deleteThread(id: string) {
    const next = loadThreads().filter((t) => t.id !== id);
    saveThreads(next);
    setThreads(next);
    if (id === threadId) {
      const target = next[0] ?? newThread();
      if (!next.length) saveThreads(upsertThread(next, target));
      void navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-border bg-card p-3 shadow-panel">
        <Button onClick={startThread} className="w-full" size="sm">
          <Plus className="size-4" /> New chat
        </Button>
        <ul className="mt-3 space-y-1">
          {threads.map((thread) => (
            <li
              key={thread.id}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-lg px-1",
                thread.id === threadId ? "bg-accent" : "hover:bg-muted",
              )}
            >
              <button
                type="button"
                onClick={() =>
                  void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } })
                }
                className="min-w-0 truncate py-2 text-left text-sm"
              >
                {thread.title}
              </button>
              <button
                type="button"
                aria-label={`Delete ${thread.title}`}
                onClick={() => deleteThread(thread.id)}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-h-[70vh] flex-col rounded-xl border border-border bg-card shadow-panel">
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <div className="py-8">
                <ConversationEmptyState
                  icon={
                    <img
                      src={logo}
                      alt=""
                      width={512}
                      height={512}
                      className="size-10 rounded-lg"
                    />
                  }
                  title="How can I help with your work today?"
                  description="Ask about emails, meetings, planning or anything on your plate."
                />
                <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent
                  className={
                    message.role === "assistant" ? "bg-transparent px-0 text-foreground" : undefined
                  }
                >
                  <MessageResponse>{messageText(message)}</MessageResponse>
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" ? (
              <Message from="assistant">
                <MessageContent className="bg-transparent px-0">
                  <Shimmer>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="space-y-3 border-t border-border p-3">
          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Workly anything about your work…"
            />
            <PromptInputFooter className="justify-between">
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <MessagesSquare className="size-3.5" /> Saved in this browser
              </span>
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() && !isBusy}
                onClick={isBusy ? () => void stop() : undefined}
              />
            </PromptInputFooter>
          </PromptInput>
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
