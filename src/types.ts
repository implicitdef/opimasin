export interface SentencePracticeAttempt {
  userAnswer: string;
  isCorrect: boolean;
  // Absent on attempts recorded before per-word inputs existed.
  wordValues?: string[];
  // Set only for attempts on one sentence of a long text (see sentenceSplit).
  sentenceIndex?: number;
}

export type SentenceLevel = "A1" | "B1";

export const SENTENCE_LEVEL_LABELS: Record<SentenceLevel, string> = {
  A1: "Easy",
  B1: "Difficult",
};

export const SENTENCE_LEVEL_DESCRIPTIONS: Record<SentenceLevel, string> = {
  A1: "Short and simple sentences (but tends to be too artificial and quickly repetitive)",
  B1: "Longer sentences with more complex structures (but tends to require words that you may not know yet)",
};

export interface ThemePracticeItem {
  id: string;
  theme: string;
  sentence: string;
  englishTranslation: string;
  attempts: SentencePracticeAttempt[];
  status: "generating" | "error" | "in_progress" | "completed";
  createdAt: number;
  level?: SentenceLevel;
  // Set only when status === "error".
  errorMessage?: string;
  // Set only for items inserted as-is via "Insert a manually generated
  // Estonian sentence" (no AI sentence generation, only translation).
  manual?: boolean;
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface ComplexVocabEntry {
  startMs: number;
  endMs: number;
  surfaceForm: string;
  baseForm: string;
  type: string;
  translations: string[];
}

export interface VocabPair {
  estonian: string;
  english: string;
}

export interface VocabList {
  id: string;
  name: string;
  createdAt: number;
  pairs: VocabPair[];
  // Indices into `pairs` answered right / wrong, updated live as each word
  // is answered during a practice session (see IngestMode). Reset to empty
  // when a fresh "Practice" run starts, but left untouched when resuming
  // "Practice the missed words". An index absent from both arrays has not
  // been answered yet in the current run.
  correctIndices: number[];
  failedIndices: number[];
}

export interface AliasProposal {
  correction: string;
  // Short English explanation; may be empty when the fix is self-evident.
  explanation: string;
}

export interface AliasRejectedAttempt {
  text: string;
  proposals: AliasProposal[];
}

export interface AliasTurn {
  message: string;
  // Absent while the guesser call is pending, or if it failed.
  guess?: string;
}

export interface AliasGame {
  id: string;
  rowId: number;
  estonian: string;
  english: string;
  createdAt: number;
  status: "in_progress" | "won";
  // Only accepted messages, each with the guess that followed it.
  turns: AliasTurn[];
  // Rejected attempts at the message currently being written. Cleared once
  // an attempt is accepted, as if it had been written right the first time.
  rejected: AliasRejectedAttempt[];
}
