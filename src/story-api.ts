import Anthropic from "@anthropic-ai/sdk";
import { MODEL, responseText } from "./anthropic-response";
import { STORY_PROMPT, STORY_REVIEW_PROMPT } from "./storyPrompt";

function makeClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

function formatIdeas(ideas: string[]): string {
  return ideas.length === 0
    ? "No specific ideas this time."
    : `Use these random ideas :\n${ideas.map((i) => `- ${i}`).join("\n")}`;
}

/** Writes a story from the given ideas, then runs it through the review pass. */
export async function generateStory(
  ideas: string[],
  apiKey: string,
): Promise<string> {
  const draft = await writeStory(ideas, apiKey);
  return reviewStory(draft, apiKey);
}

async function writeStory(ideas: string[], apiKey: string): Promise<string> {
  const response = await makeClient(apiKey).messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: STORY_PROMPT,
    messages: [{ role: "user", content: formatIdeas(ideas) }],
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

/**
 * Second pass over a generated story: the model fixes small logical or
 * grammatical issues, editing at most a line or two.
 */
async function reviewStory(story: string, apiKey: string): Promise<string> {
  const content = `Story:\n${story}`;

  const response = await makeClient(apiKey).messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: STORY_REVIEW_PROMPT,
    messages: [{ role: "user", content }],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            changes: { type: "array", items: { type: "string" } },
            story: { type: "string" },
          },
          required: ["changes", "story"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = JSON.parse(responseText(response)) as {
    changes: string[];
    story: string;
  };
  console.debug("Story review changes:", raw.changes);
  return raw.story;
}
