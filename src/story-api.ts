import Anthropic from "@anthropic-ai/sdk";
import { MODEL, responseText } from "./anthropic-response";
import { STORY_PROMPT } from "./storyPrompt";

export async function generateStory(
  ideas: string[],
  apiKey: string,
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const ideasText =
    ideas.length === 0
      ? "No specific ideas this time."
      : `Use these random ideas :\n${ideas.map((i) => `- ${i}`).join("\n")}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: STORY_PROMPT,
    messages: [{ role: "user", content: ideasText }],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            story: { type: "string" },
          },
          required: ["story"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = JSON.parse(responseText(response)) as { story: string };
  return raw.story;
}
