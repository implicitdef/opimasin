import { useEffect, useMemo, useState } from "react";
import { playCorrectSound, playIncorrectSound } from "./sound";
import {
  buildOptions,
  optionCountForDifficulty,
  shuffleOrder,
  type Difficulty,
} from "./vocabIngest";
import type { VocabPair } from "./types";

interface Props {
  // The words asked this session, in caller-defined order (index-aligned
  // with the `correctness` array passed to onComplete).
  quizPairs: VocabPair[];
  // Pool to draw wrong-answer options from — the whole deck, even when only
  // a subset of it (e.g. previously missed words) is being quizzed.
  optionPool: VocabPair[];
  // When true, the English translation is shown and the Estonian word must
  // be guessed instead of the other way around.
  reversed: boolean;
  difficulty: Difficulty;
  onExit: () => void;
  // Called immediately as each word's result becomes known — on the first
  // wrong attempt (correct: false) and again once the word is finally
  // answered right (correct: true only if it was never missed) — so
  // progress survives leaving mid-session. `pairIndex` indexes `quizPairs`.
  onAnswer: (pairIndex: number, correct: boolean) => void;
  onComplete: () => void;
}

function optionClassName(
  option: string,
  wrongOptions: Set<string>,
  answeredCorrectly: boolean,
  correct: string,
) {
  if (answeredCorrectly && option === correct) {
    return "border-green-500 bg-green-50 text-green-700";
  }
  if (wrongOptions.has(option)) {
    return "border-red-400 bg-red-50 text-red-600";
  }
  if (answeredCorrectly) {
    return "border-gray-200 text-gray-400";
  }
  return "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
}

function MultipleChoiceStep({
  correct,
  optionPool,
  field,
  optionCount,
  onCorrect,
  onWrongAttempt,
  onGiveUp,
}: {
  correct: string;
  optionPool: VocabPair[];
  field: "estonian" | "english";
  optionCount: number;
  onCorrect: (isFirstTry: boolean) => void;
  onWrongAttempt: () => void;
  onGiveUp: () => void;
}) {
  const [wrongOptions, setWrongOptions] = useState<Set<string>>(new Set());
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  // Either way the correct answer is revealed and no more picks are allowed.
  const resolved = answeredCorrectly || gaveUp;
  const options = useMemo(
    () => buildOptions(correct, optionPool, field, optionCount),
    [correct, optionPool, field, optionCount],
  );

  function handleGiveUp() {
    if (resolved) return;
    setGaveUp(true);
    playIncorrectSound();
    onGiveUp();
  }

  function handleSelect(option: string) {
    if (resolved || wrongOptions.has(option)) return;
    if (option.toLowerCase() === correct.toLowerCase()) {
      setAnsweredCorrectly(true);
      const isFirstTry = wrongOptions.size === 0;
      playCorrectSound();
      onCorrect(isFirstTry);
    } else {
      if (wrongOptions.size === 0) onWrongAttempt();
      setWrongOptions((prev) => new Set(prev).add(option));
      playIncorrectSound();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            disabled={resolved || wrongOptions.has(option)}
            className={`border rounded-lg px-4 py-2.5 text-sm text-left transition-colors disabled:cursor-default ${optionClassName(option, wrongOptions, resolved, correct)}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleGiveUp}
        disabled={resolved}
        className="self-center text-xs text-gray-400 hover:text-gray-700 transition-colors disabled:invisible"
      >
        I don't know
      </button>
    </div>
  );
}

const flashcardButtonClassName =
  "flex-1 min-w-32 border rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors";
const failButtonClassName = `${flashcardButtonClassName} border-red-300 bg-red-50 text-red-700 hover:bg-red-100`;
const neutralButtonClassName = `${flashcardButtonClassName} border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50`;
const succeedButtonClassName = `${flashcardButtonClassName} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`;

function FlashcardStep({
  answer,
  onResult,
}: {
  answer: string;
  // `delayMs` is how long to linger on the revealed answer before moving on.
  onResult: (correct: boolean, delayMs: number) => void;
}) {
  // "revealed": graded right away, waiting to move on. "unsure": answer shown
  // on request, waiting for the user to grade themselves.
  const [phase, setPhase] = useState<"hidden" | "revealed" | "unsure">(
    "hidden",
  );

  function grade(correct: boolean, delayMs: number) {
    if (correct) playCorrectSound();
    else playIncorrectSound();
    onResult(correct, delayMs);
  }

  function handleImmediate(correct: boolean) {
    setPhase("revealed");
    grade(correct, 1200);
  }

  function handleUnsureGrade(correct: boolean) {
    setPhase("revealed");
    grade(correct, 300);
  }

  return (
    <div className="flex flex-col gap-6">
      <p
        className={`text-center text-2xl font-semibold text-green-700 ${phase === "hidden" ? "invisible" : ""}`}
      >
        {answer}
      </p>
      {phase === "hidden" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleImmediate(false)}
            className={failButtonClassName}
          >
            I don't know
          </button>
          <button
            onClick={() => setPhase("unsure")}
            className={neutralButtonClassName}
          >
            Not sure, show me
          </button>
          <button
            onClick={() => handleImmediate(true)}
            className={succeedButtonClassName}
          >
            I know
          </button>
        </div>
      )}
      {phase === "unsure" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleUnsureGrade(false)}
            className={failButtonClassName}
          >
            I didn't know it
          </button>
          <button
            onClick={() => handleUnsureGrade(true)}
            className={succeedButtonClassName}
          >
            I knew it
          </button>
        </div>
      )}
    </div>
  );
}

function IngestPractice({
  quizPairs,
  optionPool,
  reversed,
  difficulty,
  onExit,
  onAnswer,
  onComplete,
}: Props) {
  const [order] = useState(() => shuffleOrder(quizPairs.length));
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [advancePending, setAdvancePending] = useState(false);
  const [advanceDelay, setAdvanceDelay] = useState(500);

  const pairIndex = order[step];
  const current = quizPairs[pairIndex];
  const prompt = reversed ? current.english : current.estonian;
  const correct = reversed ? current.estonian : current.english;
  const isLast = step === order.length - 1;

  function handleAnswer(isCorrect: boolean) {
    onAnswer(pairIndex, isCorrect);
  }

  // Records the word's final result and moves on after `delayMs`.
  function finishWord(isCorrect: boolean, delayMs: number) {
    handleAnswer(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    setAdvanceDelay(delayMs);
    setAdvancePending(true);
  }

  function handleCorrect(isFirstTry: boolean) {
    finishWord(isFirstTry, 500);
  }

  function handleGiveUp() {
    // Linger longer so the revealed correct answer can be read.
    finishWord(false, 1500);
  }

  useEffect(() => {
    if (!advancePending) return;
    const timer = setTimeout(() => {
      if (isLast) {
        onComplete();
        return;
      }
      setStep((s) => s + 1);
      setAdvancePending(false);
    }, advanceDelay);
    return () => clearTimeout(timer);
  }, [advancePending, advanceDelay, isLast, onComplete]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Stop practicing
        </button>
        <span className="text-xs text-gray-500">
          Word {step + 1} of {order.length} · {correctCount} correct
        </span>
      </div>

      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          {reversed
            ? "How do you say this in Estonian?"
            : "What does this mean?"}
        </p>
        <p className="text-3xl font-bold text-gray-900">{prompt}</p>
      </div>

      {difficulty === "flashcard" ? (
        <FlashcardStep key={step} answer={correct} onResult={finishWord} />
      ) : (
        <MultipleChoiceStep
          key={step}
          correct={correct}
          optionPool={optionPool}
          onWrongAttempt={() => handleAnswer(false)}
          field={reversed ? "estonian" : "english"}
          optionCount={optionCountForDifficulty(difficulty)}
          onCorrect={handleCorrect}
          onGiveUp={handleGiveUp}
        />
      )}
    </div>
  );
}

export default IngestPractice;
