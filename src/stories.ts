import { shuffle } from "./shuffle";
import { MAX_IDEAS_PER_STORY, MIN_IDEAS_PER_STORY } from "./storyPrompt";

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Picks MIN..MAX ideas for each story of a batch. Ideas are dealt from a
 * shuffled deck so none repeats within the batch, unless the deck runs out,
 * in which case it is reshuffled. A story never gets the same idea twice.
 */
export function pickIdeasForBatch(
  ideas: string[],
  storyCount: number,
): string[][] {
  if (ideas.length === 0) return Array.from({ length: storyCount }, () => []);
  let deck = shuffle(ideas);
  return Array.from({ length: storyCount }, () => {
    const wanted = Math.min(
      randomInt(MIN_IDEAS_PER_STORY, MAX_IDEAS_PER_STORY),
      ideas.length,
    );
    const picked: string[] = [];
    while (picked.length < wanted) {
      if (deck.length === 0) deck = shuffle(ideas);
      const idea = deck.pop()!;
      if (!picked.includes(idea)) picked.push(idea);
    }
    return picked;
  });
}

export const STORY_SEPARATOR = "\n\n-------------------\n\n";

export function joinStories(stories: string[]): string {
  return stories.map((s) => s.trim()).join(STORY_SEPARATOR);
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
