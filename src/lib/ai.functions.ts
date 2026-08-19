import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { ASSISTANT_MODEL, createLovableAiGatewayProvider, requireApiKey } from "./ai-gateway.server";

const GenerateInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const generateAssistantOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireApiKey());

    const result = streamText({
      model: gateway(ASSISTANT_MODEL),
      system: data.system,
      prompt: data.prompt,
    });

    return { text: await result.text };
  });
