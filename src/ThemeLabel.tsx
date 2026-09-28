import { SENTENCE_LEVEL_LABELS, type SentenceLevel } from "./types";

export function formatLevel(level: SentenceLevel | undefined) {
  return level ? SENTENCE_LEVEL_LABELS[level].toLowerCase() : undefined;
}

export function themeDisplayText(theme: string, hideTheme: boolean) {
  return hideTheme ? "<hidden>" : `"${theme}"`;
}

function ThemeLabel({
  level,
  theme,
  hideTheme,
}: {
  theme: string;
  level: SentenceLevel | undefined;
  hideTheme?: boolean;
}) {
  const formattedLevel = formatLevel(level);
  return (
    <div className="flex flex-col gap-1">
      <div>
        <span className="text-gray-500">Theme or word : </span>
        {hideTheme ? (
          <span className="font-mono text-gray-400 italic">&lt;hidden&gt;</span>
        ) : (
          <>
            "<span className="font-mono">{theme}</span>"
          </>
        )}
      </div>
      {formattedLevel && (
        <div className="text-sm italic">
          <span className="text-gray-500">Sentence complexity : </span>
          {formattedLevel}
        </div>
      )}
    </div>
  );
}

export default ThemeLabel;
