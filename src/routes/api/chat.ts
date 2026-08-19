import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  ASSISTANT_MODEL,
  createLovableAiGatewayProvider,
  requireApiKey,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Workly, an AI workplace productivity assistant for busy professionals.
You help with emails, meeting notes, task planning, research and general work questions.
Be concise, structured and practical. Use markdown headings and bullet lists where helpful.
Ask a short clarifying question when the request is ambiguous.
Never invent facts, figures, names or citations — say clearly when something needs verification.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        let key: string;
        try {
          key = requireApiKey();
        } catch {
          return new Response("AI is not configured", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const messages = body.messages as UIMessage[];

        const result = streamText({
          model: gateway(ASSISTANT_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
