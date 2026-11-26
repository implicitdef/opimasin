/**
 * Prompt and idea list for the Stories feature. Edit freely.
 *
 * STORY_PROMPT is sent as the system prompt for every story. Each story also
 * receives a few ideas picked at random from STORY_IDEAS (no idea is reused
 * within one batch until the list runs out).
 */

export const STORY_PROMPT = `Generate a small story in Estonian, to help me practice. Vocabulary MUST be A2 level. Length: around 120 words.
Subject : a fun story, of unexpected twists and turns. I love evocative ideas and settings. I love simple stories, but I also love that things happens that you may not expect in a child story. The events may be dark, sad, shocking or cruel. They may also be cheerful. Or a mix. Anything is possible.

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
  "A character ends up as a saint or hermit",
  "Angels and Hell are involved",
  "A bridge is constructed, or breaks down",
  "A characters fathers many children and grandchildren and get a legacy",
  "A character gets back his kingdom",
  "There's some mentions of faith, sin, and church(es)",
  "A characters meets three other characters in succession, in a kind of set of 'rhyming' events",
  "There are hints that something horrible happened.",
  "A knight who is terrified of everything but never turns back.",
  "It involves a grave-digger.",
  "The story involves a famous historical figure (Napoleon, Genghis Khan, Cleopatra) in a strange moment.",
  "It involves a famous historical ruler somewhat in his actual context (e.g. Charlemagne as ruler of part of Europe)",
  "It involves the cruelty of vikings",
  "It involves the subtleties of some law(s)",
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
  "Someone smokes a lot of cigars or cigarettes",
  "The protagonist is a tough man with a lot of issues (bad temper, or hates people, or hates himself, or killed people, ...), but he does the right thing in the story",
  "The hero is ready to die",
  "A woman in danger needs the hero's help",
  "A dangerous woman uses her looks to trick men",
  "Cops and politicians are bad",
  "Rich bad guys cannot be stopped by the law",
  "The protagonist goals are a folly, because there's a 'system' bigger than him that can't be fought",
  "Some villains look scary on the outside",
  "The story is narrated in first person by the protagonist",
  "The city is a bad place",
  "Some character keeps fighting after many injuries",
  "The hero follows his own rules",
  "Friends and lovers betray each other",
  "The hero is blamed for a crime he did not do",
  "The love story ends in sadness",
  "The hero knows he will lose, but he fights anyway",
  "The story involves a giant or giants",
  "The story involves dinosaurs",
  "There is some physical hurts, wounds, and pain",
  "The story is concerned with the laws of inheritance of a throne",
  "The story involves a superhero and a supervillain",
  "A king or ruler ends with an even bigger kingdom or domain",
  "the story is inspired by a story from the One Thousand and One Nights",
  "A villain displays some sad side of him, and the reader might think the protagonist will be empathetic, but the protagonist is unmoved and still acts as if the villain was purely evil",
  "Someone makes a heartfelt declaration of love",
  "A man gets an order or command to kill someone who happens to be a loved one (his wife, kid, ...)",
  "A thief gets his hand cut off as punishment",
  "Someone gets cut into several pieces, or is cooked and eaten",
  'A character tries to go through an ordeal, he is just trying to maintain his starting situation, but as eventually "survives" the ordeal/conflict, he is suddenly rewarded beyond his wildest dreams',
  "A character's personnality repeatedly gets him into tough situations or causes harm around him",
  "The story tells the protagonist's life, from childhood to its death",
];

/**
 * System prompt for the review pass: each generated story is sent back to the
 * model to fix small inconsistencies.
 */
export const STORY_REVIEW_PROMPT = `You are proofreading a short Estonian story that was generated by AI.

Check the story for:
- Confusing or unclear events or sentences.
- Sentences that add weird details or events that don't link well with the rest of the story.
- Logical inconsistencies
- Estonian grammar mistakes (cases, agreement, verb forms, word order).

Edit budget: you may change a few words, and at most one or two lines in total. If nothing is wrong, return the story exactly as it is.

(if the story contains dark, sad, cruel or unexpected events and endings, that's intentional. Do not soften or "fix" them)

First list your changes briefly (empty list if none), then give the full corrected story: plain prose only, no title, no English, no notes.`;

export const MIN_IDEAS_PER_STORY = 1;
export const MAX_IDEAS_PER_STORY = 3;
