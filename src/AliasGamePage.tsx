import { Link, useParams } from "@tanstack/react-router";
import { Check, CircleAlert, RefreshCcw, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useAlias } from "./AliasContext";
import ExerciseCard from "./ExerciseCard";
import PageMain from "./PageMain";
import SettingsBox, { SettingCheckbox } from "./SettingsBox";
import type { AliasRejectedAttempt } from "./types";
import { usePersistedState } from "./usePersistedState";

const CHECK_MESSAGES_KEY = "opimasin-alias-check-messages";

function BackLink() {
  return (
    <Link
      to="/alias"
      className="self-start font-bold hover:text-blue-700 transition-colors"
    >
      ← Back to the games list
    </Link>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-end max-w-[85%] rounded-lg bg-blue-700 text-white px-4 py-2 text-sm whitespace-pre-wrap">
      {children}
    </div>
  );
}

function GuessBubble({ guess, correct }: { guess: string; correct: boolean }) {
  return (
    <div
      className={`self-start flex items-center gap-2 rounded-lg px-4 py-2 text-sm border ${correct ? "bg-green-50 border-green-400" : "bg-gray-50 border-gray-300"}`}
    >
      <span>
        Is it <b>{guess}</b>?
      </span>
      {correct ? (
        <Check size={16} strokeWidth={4} className="text-green-500" />
      ) : (
        <X size={16} strokeWidth={3} className="text-red-500" />
      )}
    </div>
  );
}

function RejectedAttempt({
  attempt,
  latest,
}: {
  attempt: AliasRejectedAttempt;
  latest: boolean;
}) {
  return (
    <div
      className={`self-stretch flex flex-col gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm ${latest ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50 opacity-60"}`}
    >
      {latest && (
        <p className="flex items-center gap-1.5 font-semibold text-orange-700">
          <CircleAlert size={16} />
          Not accepted yet — fix the mistakes and retype your message
        </p>
      )}
      <p className="whitespace-pre-wrap text-gray-700 line-through decoration-red-400">
        {attempt.text}
      </p>
      <ul className="flex flex-col gap-1.5">
        {attempt.proposals.map((proposal, i) => (
          <li key={i}>
            <span className="text-green-800 font-medium">
              {proposal.correction}
            </span>
            {proposal.explanation && (
              <span className="block text-xs text-gray-600 italic">
                {proposal.explanation}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StartOverButton({
  onReset,
  disabled,
}: {
  onReset: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("Start over? Your whole conversation will be discarded."))
          onReset();
      }}
      disabled={disabled}
      className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors underline disabled:opacity-40 disabled:cursor-not-allowed"
      title="Discard the whole conversation and start this word over"
    >
      <RotateCcw size={12} />
      Start over
    </button>
  );
}

function AliasGamePage() {
  const { id } = useParams({ from: "/aliasLayout/alias/$id" });
  const { findGame, busy, errors, submitMessage, retryGuess, resetGame } =
    useAlias();
  const [draft, setDraft] = useState("");
  const [checkMessages, setCheckMessages] = usePersistedState(
    CHECK_MESSAGES_KEY,
    true,
  );
  const game = findGame(id);

  if (!game) {
    return (
      <PageMain gap={4}>
        <BackLink />
        <p className="text-sm text-gray-600">This game doesn't exist.</p>
      </PageMain>
    );
  }

  const gameBusy = busy[game.id];
  const error = errors[game.id];
  const won = game.status === "won";
  const lastTurn = game.turns[game.turns.length - 1];
  const missingGuess = lastTurn !== undefined && lastTurn.guess === undefined;

  const hasConversation = game.turns.length > 0 || game.rejected.length > 0;
  const startOver = hasConversation && (
    <StartOverButton onReset={() => resetGame(game.id)} disabled={!!gameBusy} />
  );

  async function handleSubmit() {
    if (!game) return;
    const checked = await submitMessage(game.id, draft, checkMessages);
    if (checked) setDraft("");
  }

  return (
    <PageMain gap={4}>
      <BackLink />
      <SettingsBox storageKey="opimasin-alias-settings-open" stacked>
        <SettingCheckbox
          checked={checkMessages}
          onChange={setCheckMessages}
          label="Check your messages for correctness"
          description="Check that your messages are correct estonian, and force you to correct them"
        />
      </SettingsBox>
      <ExerciseCard
        heading={
          <span className="text-sm text-gray-700">
            Make the AI guess this word, without saying it
          </span>
        }
      >
        <p className="text-2xl font-bold text-blue-900">{game.estonian}</p>
        <p className="text-gray-600 italic">{game.english}</p>
      </ExerciseCard>

      <div className="flex flex-col gap-3">
        {game.turns.map((turn, i) => {
          const isLast = i === game.turns.length - 1;
          return (
            <div key={i} className="flex flex-col gap-3">
              <UserBubble>{turn.message}</UserBubble>
              {turn.guess !== undefined && (
                <GuessBubble guess={turn.guess} correct={won && isLast} />
              )}
            </div>
          );
        })}

        {gameBusy === "guessing" && (
          <p className="self-start flex items-center gap-1.5 text-sm text-gray-500">
            <RefreshCcw size={14} className="animate-spin" />
            Thinking…
          </p>
        )}

        {missingGuess && !gameBusy && (
          <button
            onClick={() => retryGuess(game.id)}
            className="self-start flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCcw size={14} />
            Retry guess
          </button>
        )}

        {game.rejected.map((attempt, i) => (
          <RejectedAttempt
            key={i}
            attempt={attempt}
            latest={i === game.rejected.length - 1}
          />
        ))}
      </div>

      {won ? (
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1.5 font-semibold text-green-700">
            <Check size={18} strokeWidth={4} />
            Guessed in {game.turns.length}{" "}
            {game.turns.length === 1 ? "message" : "messages"}!
          </p>
          {startOver}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-2"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              game.rejected.length > 0
                ? "Retype a corrected version…"
                : game.turns.length === 0
                  ? "Describe the word, in Estonian…"
                  : "Add another hint…"
            }
            rows={3}
            disabled={!!gameBusy || missingGuess}
            autoFocus
            className="border-2 border-black rounded-md px-4 py-2.5 text-sm bg-slate-100 text-blue-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y disabled:opacity-60"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!draft.trim() || !!gameBusy || missingGuess}
              className="bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
            {gameBusy === "checking" && (
              <span className="flex items-center gap-1.5 text-sm text-blue-700">
                <RefreshCcw size={14} className="animate-spin" />
                Checking your message…
              </span>
            )}
            {startOver}
          </div>
        </form>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </PageMain>
  );
}

export default AliasGamePage;
