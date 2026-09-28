import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useFromTheme } from "./FromThemeContext";
import PageMain from "./PageMain";
import { longTextPairs, solvedSentences } from "./sentenceSplit";
import { itemStatus, StatusIcon } from "./StatusIcon";
import { formatLevel } from "./ThemeLabel";
import type { ThemePracticeItem } from "./types";
import YellowDescription from "./YellowDescription";

function longTextLabel(item: ThemePracticeItem): string | null {
  const pairs = longTextPairs(item.sentence, item.englishTranslation);
  if (!pairs) return null;
  if (item.status === "completed") return "(long text)";
  const solved = solvedSentences(pairs, item.attempts, false).filter(Boolean);
  return `(long text · ${solved.length}/${pairs.length})`;
}

function SentenceRow({ item }: { item: ThemePracticeItem }) {
  const longText = longTextLabel(item);
  return (
    <li>
      <Link
        to="/sentence/$id"
        params={{ id: item.id }}
        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-100 transition-colors"
      >
        <StatusIcon status={itemStatus(item)} />
        <span className="truncate">
          "{item.theme}"{" "}
          {formatLevel(item.level) && (
            <span className="text-gray-500 italic text-xs">
              {formatLevel(item.level)}
            </span>
          )}{" "}
          {longText && (
            <span className="text-gray-500 italic text-xs">{longText}</span>
          )}
        </span>
      </Link>
    </li>
  );
}

function GenerateLink({ children }: { children: ReactNode }) {
  return (
    <Link
      to="/generate"
      className="text-sm text-blue-700 hover:text-blue-500 underline"
    >
      {children}
    </Link>
  );
}

function SentenceListPage() {
  const { userItems, demoItems, clearUserItems, resetDemoItems } =
    useFromTheme();

  return (
    <PageMain>
      <div className="flex flex-col gap-2">
        <YellowDescription
          storageKey="opimasin-sentence-list-description-open"
          details={
            <>
              <span>
                The demo sentences are useful to get a feel for how it works.
                <br />
                But the exercise really shines when you generate your own
                sentences, and thus work on exactly the vocabulary or type of
                sentences you're interesting in.
              </span>
              <br />
              <br />
              Generating your own sentences requires an Anthropic API key. It's
              not free but it's <b>very</b> cheap.
              <br />
              <br />
              <b>Note :</b> I've found this exercise <b>extremely</b> useful and
              it's the main way I practice my Estonian.
            </>
          }
        >
          Translation exercise. Pick one of the demo sentences, or generate your
          own.
        </YellowDescription>
      </div>

      {userItems.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Your sentences</h2>
            <GenerateLink>Generate more</GenerateLink>
            <button
              onClick={clearUserItems}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors underline"
              title="Clear your sentences"
            >
              Clear all
            </button>
          </div>
          {/* <GenerateLink>Generate more</GenerateLink> */}
          <ul className="flex flex-col bg-blue-50 divide-y divide-gray-400 rounded-lg overflow-hidden mt-1">
            {userItems.map((item) => (
              <SentenceRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        {userItems.length === 0 && (
          <div className="flex items-end justify-center mb-4 font-bold">
            <GenerateLink>Generate your own sentences</GenerateLink>
          </div>
        )}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Demo sentences</h2>
          <button
            onClick={resetDemoItems}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors underline"
            title="Reset demo sentences to their original unsolved state"
          >
            Reset your answers
          </button>
        </div>
        <ul className="flex flex-col bg-blue-50 divide-y divide-gray-400 rounded-lg overflow-hidden mt-1">
          {demoItems.map((item) => (
            <SentenceRow key={item.id} item={item} />
          ))}
        </ul>
      </section>
    </PageMain>
  );
}

export default SentenceListPage;
