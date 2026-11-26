import { Check, Copy, GitCompare, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import ApiKeyModal from "./ApiKeyModal";
import { useApiKey } from "./CredentialsContext";
import PageMain from "./PageMain";
import YellowDescription from "./YellowDescription";
import { generateStory } from "./story-api";
import { countEdits, diffStory } from "./storyDiff";
import { countWords, joinStories, pickIdeasForBatch } from "./stories";
import { STORY_IDEAS } from "./storyPrompt";
import { usePersistedState } from "./usePersistedState";

type StorySlot =
  | { status: "loading" }
  // `story` is the reviewed (final) version. `draft` is the version from
  // before the review; it's missing on slots saved before it was kept.
  | { status: "done"; draft?: string; story: string }
  | { status: "error"; message: string };

const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function StoriesPage() {
  const { apiKey, setApiKey } = useApiKey();
  const [count, setCount] = usePersistedState("opimasin-stories-count", 6);
  const [slots, setSlots] = usePersistedState<StorySlot[]>(
    "opimasin-stories-results",
    [],
  );
  const [pendingAction, setPendingAction] = useState<
    ((key: string) => void) | null
  >(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Calls still in flight when the page was left are lost: drop their slots.
  useEffect(() => {
    setSlots((prev) => prev.filter((s) => s.status !== "loading"));
  }, [setSlots]);

  const isLoading = slots.some((s) => s.status === "loading");
  const stories = slots.flatMap((s) => (s.status === "done" ? [s.story] : []));
  const hasDrafts = slots.some((s) => s.status === "done" && s.draft);
  const allText = joinStories(stories);

  function withApiKey(action: (key: string) => void) {
    if (apiKey) {
      action(apiKey);
    } else {
      setPendingAction(() => action);
    }
  }

  function handleApiKeySubmit(key: string) {
    setApiKey(key);
    const action = pendingAction;
    setPendingAction(null);
    action?.(key);
  }

  function runGeneration(key: string) {
    const ideaSets = pickIdeasForBatch(STORY_IDEAS, count);
    setSlots(ideaSets.map(() => ({ status: "loading" })));
    ideaSets.forEach((ideas, i) => {
      generateStory(ideas, key).then(
        ({ draft, final }) =>
          updateSlot(i, { status: "done", draft, story: final }),
        (err: unknown) =>
          updateSlot(i, {
            status: "error",
            message:
              err instanceof Error ? err.message : "Something went wrong",
          }),
      );
    });
  }

  function updateSlot(index: number, slot: StorySlot) {
    setSlots((prev) => prev.map((s, i) => (i === index ? slot : s)));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(allText);
      setCopyError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <PageMain gap={4}>
      <YellowDescription>
        Generates several short A2 stories in Estonian at once, to read together
        as one longer text.
      </YellowDescription>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Stories:
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={isLoading}
            className="border-2 border-black rounded-md px-2 py-1.5 text-sm bg-slate-100"
          >
            {COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => withApiKey(runGeneration)}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading && <RefreshCcw size={14} className="animate-spin" />}
          Generate stories
        </button>
      </div>

      {stories.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">
            {stories.length} {stories.length === 1 ? "story" : "stories"},{" "}
            {countWords(stories.join(" "))} words
          </h2>
          <div className="flex items-center gap-2">
            {hasDrafts && (
              <button
                onClick={() => setShowReview((v) => !v)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                  showReview
                    ? "border-blue-700 bg-blue-50 text-blue-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <GitCompare size={14} />
                {showReview ? "Hide review changes" : "Show review changes"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>
        </div>
      )}
      {copyError && (
        <p className="text-xs text-gray-500">
          Couldn't copy automatically, so select the stories below and copy them
          manually.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="border-2 border-black rounded-md bg-slate-50 p-3 text-sm"
          >
            {slot.status === "loading" && (
              <span className="flex items-center gap-1.5 text-blue-700">
                <RefreshCcw size={14} className="animate-spin" />
                Writing story {i + 1}…
              </span>
            )}
            {slot.status === "done" &&
              (!showReview || slot.draft === undefined ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {slot.story}
                </p>
              ) : (
                <StoryComparison draft={slot.draft} final={slot.story} />
              ))}
            {slot.status === "error" && (
              <p className="text-red-600">{slot.message}</p>
            )}
          </div>
        ))}
      </div>

      {pendingAction && (
        <ApiKeyModal
          onSubmit={handleApiKeySubmit}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </PageMain>
  );
}

function StoryComparison({ draft, final }: { draft: string; final: string }) {
  const parts = diffStory(draft, final);
  const edits = countEdits(parts);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500">
        {edits === 0
          ? "No changes from review"
          : `${edits} ${edits === 1 ? "edit" : "edits"} from review`}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <h3 className="mb-1 text-xs font-semibold text-gray-700">
            First version
          </h3>
          <p className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) =>
              part.added ? null : part.removed ? (
                <span key={i} className="bg-red-100 text-red-800 line-through">
                  {part.value}
                </span>
              ) : (
                <span key={i}>{part.value}</span>
              ),
            )}
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold text-gray-700">
            Reviewed version
          </h3>
          <p className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, i) =>
              part.removed ? null : part.added ? (
                <span key={i} className="bg-green-100 text-green-800">
                  {part.value}
                </span>
              ) : (
                <span key={i}>{part.value}</span>
              ),
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoriesPage;
