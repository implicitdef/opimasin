import * as Diff from "diff";

/** Word-level diff between the first draft of a story and its reviewed version. */
export function diffStory(draft: string, final: string): Diff.Change[] {
  return Diff.diffWords(draft.trim(), final.trim());
}

/** Number of edited spots: each run of removals and/or additions counts once. */
export function countEdits(parts: Diff.Change[]): number {
  let edits = 0;
  let inEdit = false;
  for (const part of parts) {
    const changed = Boolean(part.added || part.removed);
    if (changed && !inEdit) edits++;
    inEdit = changed;
  }
  return edits;
}
