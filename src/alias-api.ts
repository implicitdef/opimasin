import Anthropic from "@anthropic-ai/sdk";
import { MODEL, responseText } from "./anthropic-response";
import type { AliasProposal, AliasTurn } from "./types";

const CHECK_SYSTEM_PROMPT = `You are an expert Estonian language teacher. Your student is playing an "alias" game: they describe a secret Estonian word in Estonian, one message at a time, so that someone else can guess it. The other player answers each message with a one-word guess.

You will receive the conversation so far, then the student's new message. Check ONLY the new message (the earlier ones are just context).

The message is incorrect if it has grammar mistakes (wrong case, conjugation, agreement, word order that changes the meaning…), spelling mistakes, or makes no sense (e.g. the student confused two words, or used a word that doesn't exist). Be lenient on style: a message that is correct but slightly unnatural is acceptable. Do not judge whether the description is a good hint.

If it is incorrect, give one or more corrected versions in Estonian, keeping them as close as possible to what the student wrote. Give several proposals when you're not sure what the student meant, or when there are meaningfully different ways to fix it. For each, add a very short explanation in English of what was wrong (can be empty if obvious).

If it is correct, return an empty list of proposals.`;

const GUESS_SYSTEM_PROMPT = `You are playing an "alias" game in Estonian. The other player knows a secret Estonian word and describes it to you in Estonian, without saying it. After each of their messages you make exactly one guess.

Your guess must be a single Estonian word (or a fixed multi-word expression, if that's clearly what is described), in its dictionary form: nominative singular for nouns and adjectives, the -ma infinitive for verbs. Nothing else: no explanation, no punctuation.

Use all the descriptions given so far. Never repeat one of your previous guesses — they were all wrong.`;

function transcript(turns: AliasTurn[]): string {
  if (turns.length === 0) return "(no messages yet)";
  return turns
    .map(
      (turn) =>
        `Describer: ${turn.message}` +
        (turn.guess !== undefined ? `\nGuesser: ${turn.guess}` : ""),
    )
    .join("\n");
}

export async function checkAliasMessage(
  turns: AliasTurn[],
  message: string,
  apiKey: string,
): Promise<{ isCorrect: boolean; proposals: AliasProposal[] }> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: CHECK_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Conversation so far:\n${transcript(turns)}\n\nNew message to check:\n${message}`,
      },
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            isCorrect: { type: "boolean" },
            proposals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  correction: { type: "string" },
                  explanation: { type: "string" },
                },
                required: ["correction", "explanation"],
                additionalProperties: false,
              },
            },
          },
          required: ["isCorrect", "proposals"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = JSON.parse(responseText(response)) as {
    isCorrect: boolean;
    proposals: AliasProposal[];
  };
  return {
    isCorrect: raw.isCorrect,
    proposals: raw.isCorrect ? [] : raw.proposals,
  };
}

/** `turns` must end with the new message (its guess not set yet). */
export async function guessAliasWord(
  turns: AliasTurn[],
  apiKey: string,
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: GUESS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Conversation so far:\n${transcript(turns)}\n\nYour guess?`,
      },
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            guess: { type: "string" },
          },
          required: ["guess"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = JSON.parse(responseText(response)) as { guess: string };
  return raw.guess.trim();
}
