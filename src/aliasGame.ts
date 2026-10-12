import type { BaserowVocabRow } from "./baserow-api";
import type { AliasGame } from "./types";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A random row whose word hasn't been played yet (matched on row id or on
 * the Estonian word, ignoring case), or null once every word has been played.
 */
export function pickUnplayedRow(
  rows: BaserowVocabRow[],
  games: AliasGame[],
): BaserowVocabRow | null {
  const playedIds = new Set(games.map((g) => g.rowId));
  const playedWords = new Set(games.map((g) => normalize(g.estonian)));
  const candidates = rows.filter(
    (row) =>
      normalize(row.estonian) &&
      !playedIds.has(row.id) &&
      !playedWords.has(normalize(row.estonian)),
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Whether the guess is the target, ignoring case and punctuation. A table
 * entry like "koer, koera" or "aru saama (millestki)" accepts any of its
 * comma/slash/semicolon-separated forms, without the parenthesized parts.
 */
export function isCorrectGuess(guess: string, target: string): boolean {
  const normalizedGuess = normalize(guess);
  if (!normalizedGuess) return false;
  const forms = target
    .replace(/\([^)]*\)/g, " ")
    .split(/[,/;]/)
    .map(normalize)
    .filter(Boolean);
  return (
    forms.includes(normalizedGuess) || normalize(target) === normalizedGuess
  );
}
