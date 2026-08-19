import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const STORAGE_KEY = "workly.chat.threads.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadThreads(): ChatThread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* storage unavailable */
  }
}

export function createThreadId() {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

export function newThread(): ChatThread {
  return { id: createThreadId(), title: "New chat", updatedAt: Date.now(), messages: [] };
}

export function upsertThread(threads: ChatThread[], thread: ChatThread): ChatThread[] {
  const next = threads.filter((t) => t.id !== thread.id);
  return [thread, ...next].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export function deriveTitle(messages: UIMessage[], fallback = "New chat") {
  const first = messages.find((m) => m.role === "user");
  if (!first) return fallback;
  const text = messageText(first);
  if (!text) return fallback;
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}
