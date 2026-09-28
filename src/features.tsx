import { BookOpen, Database, FileSearch, Languages, Video } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export type FeatureId =
  | "translation"
  | "vocabPractice"
  | "video"
  | "vocabExtract"
  | "baserow";

export interface Feature {
  id: FeatureId;
  /** Title of the feature's card on the welcome page. */
  welcomeCardLabel: string;
  /** Link in the header nav ("other features: ..."). */
  navLabel: string;
  /** Subtitle next to "Õpimasin" in the header, on the feature's pages. */
  headerTitle: string;
  /** Link text when another feature's description mentions this one. */
  inTextLabel: string;
  to: string;
  /** Text of the feature's card on the welcome page. Can contain JSX. */
  description: ReactNode;
  icon: ComponentType<{ size?: number; className?: string }>;
  isActive: (pathname: string) => boolean;
  /** Hidden unless owner mode is on (not ready, or only useful to the owner). */
  ownerOnly?: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: "translation",
    welcomeCardLabel: "Translation exercise, English to Estonian",
    navLabel: "Translation exercise",
    headerTitle: "Translation exercise",
    inTextLabel: "Translation exercise",
    to: "/translation-exercise",
    description: (
      <>
        <p className="mb-2">
          Forces you to actually form sentences, to think a bit about grammar,
          and helps you with hints so that it stays manageable.{" "}
          <span className="font-bold">
            Probably the most useful feature.
          </span>{" "}
        </p>

        <p className="text-gray-500 text-sm">
          (can be tried out with some demo sentences, but requires an Anthropic
          API key to take full advantage of it)
        </p>
      </>
    ),
    icon: Languages,
    isActive: (path) =>
      path.startsWith("/translation-exercise") ||
      path.startsWith("/sentence") ||
      path.startsWith("/generate"),
  },
  {
    id: "vocabPractice",
    welcomeCardLabel: "Vocabulary practice",
    navLabel: "Vocab practice",
    headerTitle: "Vocabulary practice",
    inTextLabel: "Vocabulary practice",
    to: "/vocab-practice",
    description:
      "Paste vocabulary lists copied from a spreadsheet and drill them with multiple-choice quizzes.",
    icon: BookOpen,
    isActive: (path) => path.startsWith("/vocab-practice"),
  },
  {
    id: "video",
    welcomeCardLabel: "Video",
    navLabel: "Video",
    headerTitle: "Watch video with vocab",
    inTextLabel: "Video",
    to: "/video",
    description:
      "Watch an Estonian video with dual subtitles plus an optional vocabulary cheatsheet, so tricky words are explained right when you hear them.",
    icon: Video,
    isActive: (path) => path.startsWith("/video"),
    ownerOnly: true,
  },
  {
    id: "vocabExtract",
    welcomeCardLabel: "Vocabulary extraction",
    navLabel: "Vocab extract",
    headerTitle: "Vocabulary extraction",
    inTextLabel: "Vocabulary extraction",
    to: "/vocab-extract",
    description: (
      <>
        <p className="mb-2">
          Given an Estonian text, extracts the key vocabulary, with English
          translations, ready to paste into a vocabulary spreadsheet.
        </p>
        <p className="text-gray-500 text-sm">
          (requires an Anthropic API key obviously)
        </p>
      </>
    ),
    icon: FileSearch,
    isActive: (path) => path.startsWith("/vocab-extract"),
  },
  {
    id: "baserow",
    welcomeCardLabel: "Add vocab to Baserow",
    navLabel: "Add vocab to Baserow",
    headerTitle: "Add vocab to Baserow",
    inTextLabel: "Add vocab to Baserow",
    to: "/baserow-vocab",
    description:
      "Paste new vocabulary and add it to your Baserow vocabulary table, choosing which translation to keep for words that are already there.",
    icon: Database,
    isActive: (path) => path.startsWith("/baserow-vocab"),
    ownerOnly: true,
  },
];

export function getFeature(id: FeatureId): Feature {
  return FEATURES.find((f) => f.id === id)!;
}

export function visibleFeatures(ownerMode: boolean): Feature[] {
  return ownerMode ? FEATURES : FEATURES.filter((f) => !f.ownerOnly);
}
