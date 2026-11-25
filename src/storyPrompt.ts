/**
 * Prompt and idea list for the Stories feature. Edit freely.
 *
 * STORY_PROMPT is sent as the system prompt for every story. Each story also
 * receives a few ideas picked at random from STORY_IDEAS (no idea is reused
 * within one batch until the list runs out).
 */

export const STORY_PROMPT = `Generate a small story in Estonian, to help me practice. Vocabulary MUST be A2 level. Length: around 120 words.
Subject : a fun story, of unexpected twists and turns. I love evocative ideas and settings. I love simple stories, but I also love that things happens that you may not expect in a child story (like a child gets eaten and the villain wins...)

Plain prose only: no title, no English, no notes.`;

export const STORY_IDEAS: string[] = [
  "At the end, a young couple is in love",
  "Somebody dies, a painful death.",
  "The villain wins in the end",
  "The story involves a (human) king that rules over animals",
  "The story involves Charlemagne",
  "A quest of a random knight from the Round Table",
  "A horror/mystery story, in an unusual setting",
  "Something Lovecraftian",
  "Tone change: a non-horror story suddenly shifts into horror",
  "Bittersweet ending: some stuff is on a positive note, some other on a negative note",
  "The hero succeeds, but the thing they saved was better off before.",
  "The child was right about the monster, and no adult believes them until it's too late.",
  "The villain is polite, patient and kind, and still wins.",
  "The ending loops back to the first sentence, but something is different now.",
  "A promise is kept for centuries, long after it has stopped making sense.",
  "The two lovers are reunited, but only after death.",
  "The rescuer arrives one day too late.",
  "The story involves a queen who rules over birds, or fish, or insects.",
  "A very old saint or hermit is tired of being holy.",
  "A knight who is terrified of everything but never turns back.",
  "It involves a grave-digger.",
  "The story involves a famous historical figure (Napoleon, Genghis Khan, Cleopatra) in a small, strange moment.",
  "A cozy domestic story slowly turns out to be about something sinister.",
  "The reward for the quest is something nobody wanted.",
  "A cheerful festival with one custom that's slightly off, then clearly wrong.",
  "The monster is lonely, and the story is sad, but it still eats someone.",
  "The stars are wrong tonight, and only the animals notice.",
  "A deal is made with the sea, the wind or the forest, or a tiny creature, and it comes due.",
  "Something falls from the sky and is kind to the villagers, at first.",
  "A clever trickster finally meets someone cleverer, and it ends badly for the trickster.",
  "A greedy character gets everything, and the story simply stops there.",
  "A lesson is learned, but by the wrong person.",
  "A kind character is cheated again and again, and kindness doesn't pay, but they stay kind.",
  "It involves a sailor and/or a mermaid",
];

/**
 * System prompt for the review pass: each generated story is sent back to the
 * model to fix small inconsistencies.
 */
export const STORY_REVIEW_PROMPT = `You are proofreading a short Estonian story.

Check the story for:
- Confusing or unclear events or sentences
- Logical inconsistencies: contradictions, cause and effect that doesn't follow
- Estonian grammar mistakes (cases, agreement, verb forms, word order).

If the story contains dark, sad, cruel or unexpected events and endings, that's intentional. Do not soften or "fix" them.

Edit budget: you may change a few words, and at most one or two lines in total. Keep its tone and length. If nothing is wrong, return the story exactly as it is.

First list your changes briefly (empty list if none), then give the full corrected story: plain prose only, no title, no English, no notes.`;

export const MIN_IDEAS_PER_STORY = 1;
export const MAX_IDEAS_PER_STORY = 3;
