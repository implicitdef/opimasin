import { useState } from "react";
import BackToListLink from "./BackToListLink";
import { useFromTheme } from "./FromThemeContext";
import GenerateForm from "./GenerateForm";
import PageMain from "./PageMain";
import SettingsBox from "./SettingsBox";
import YellowDescription from "./YellowDescription";

function parseListLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

type FormMode = "single" | "list" | "manual";

function GenerationPage() {
  const {
    level,
    setLevel,
    generatingSource,
    isGenerating,
    generateNew,
    generateFromList,
    insertManual,
  } = useFromTheme();
  const [themeInput, setThemeInput] = useState("");
  const [mode, setMode] = useState<FormMode>("single");

  function handleToggleMode(target: FormMode) {
    setMode((prev) => (prev === target ? "single" : target));
    setThemeInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "manual") {
      const text = themeInput.trim();
      if (!text) return;
      insertManual(text);
    } else if (mode === "list") {
      const lines = parseListLines(themeInput);
      if (lines.length === 0) return;
      generateFromList(lines, 1, level);
    } else {
      const theme = themeInput.trim();
      if (!theme) return;
      generateNew(theme, 1, level);
    }
  }

  function handleGenerateBatch() {
    if (mode === "list") {
      const lines = parseListLines(themeInput);
      if (lines.length === 0) return;
      generateFromList(lines, 3, level);
    } else if (mode === "single") {
      const theme = themeInput.trim();
      if (!theme) return;
      generateNew(theme, 3, level);
    }
  }

  return (
    <PageMain gap={4}>
      <BackToListLink />
      <YellowDescription
        storageKey="opimasin-generation-description-open"
        details={
          <>
            There are many ways to use this :
            <ul className="list-decimal list-inside space-y-2 mt-2">
              <li>
                with a specific word that you want to practice, like{" "}
                <ul className="ml-4">
                  <li className="text-green-700 font-mono">"helistama"</li>
                  <li className="text-green-700 font-mono">"ohtlik"</li>
                  <li className="text-green-700 font-mono">"eraldi"</li>
                </ul>
              </li>

              <li>
                with a compound expression, for example{" "}
                <ul className="ml-4">
                  <li className="text-green-700 font-mono">"hädas olema"</li>
                  <li className="text-green-700 font-mono">"katki minema"</li>
                  <li className="text-green-700 font-mono">"lahti tegema"</li>
                </ul>
              </li>
              <li>
                with a general theme, like{" "}
                <ul className="ml-4">
                  <li className="text-green-700 font-mono">
                    "food and cooking"
                  </li>
                  <li className="text-green-700 font-mono">
                    "any kind of animal"
                  </li>
                  <li className="text-green-700 font-mono">
                    "any kind of transportation, bus, plane, bike, etc."
                  </li>
                </ul>
              </li>
              <li>
                with a specific sentence structure or grammatical feature :{" "}
                <ul className="ml-4">
                  <li className="text-green-700 font-mono">"X kohta"</li>
                  <li className="text-green-700 font-mono">"X-st aru saama"</li>
                  <li className="text-green-700 font-mono">"X-ks valmis"</li>
                  <li className="text-green-700 font-mono">
                    "nii ... kui ..."
                  </li>
                  <li className="text-green-700 font-mono">
                    "negative past tense"
                  </li>
                  <li>etc.</li>
                </ul>
              </li>
            </ul>
            <br />
            <b>Generating sentences requires an Anthropic API key.</b>. Each
            generation is very very cheap though. About half a cent per
            sentence.
          </>
        }
      >
        Generate one (or 3) sentence(s) for you to translate. The sentence will
        be based on the theme or word you give.
      </YellowDescription>

      <SettingsBox
        storageKey="opimasin-generation-advanced-open"
        title="advanced options"
        icon={null}
        plain
        className="mt-2"
        stacked
      >
        <label className="flex items-center gap-2 text-sm text-gray-600 has-disabled:text-gray-400">
          <input
            type="checkbox"
            checked={mode === "list"}
            onChange={() => handleToggleMode("list")}
            disabled={isGenerating || mode === "manual"}
          />
          Generate from a vocabulary list
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 has-disabled:text-gray-400">
          <input
            type="checkbox"
            checked={mode === "manual"}
            onChange={() => handleToggleMode("manual")}
            disabled={isGenerating || mode === "list"}
          />
          Insert an already generated Estonian sentence (or whole text)
        </label>
      </SettingsBox>

      {mode === "list" && (
        <p className="text-xs text-gray-500">
          Write a list of words (one by line). Each line will be used separately
          to each generate one sentence (or 3, if you click the 3x button), in a
          randomized order.
          <br />
          <span className="text-amber-600 font-medium">
            If your list is very long, this might get expensive!
          </span>
        </p>
      )}

      {mode === "manual" && (
        <p className="text-xs text-gray-500">
          Paste in an Estonian sentence, or a short text made of several
          sentences. It will be used as-is (no AI sentence generation) — we only
          make one API call, to translate it to English. <br />
          In the case of a text, the exercise page will adapt to make you work
          it sentence by sentence.
        </p>
      )}

      <GenerateForm
        value={themeInput}
        onChange={setThemeInput}
        onSubmit={handleSubmit}
        onGenerateBatch={handleGenerateBatch}
        label={
          mode === "list"
            ? "Vocabulary list"
            : mode === "manual"
              ? "Estonian sentence or text"
              : "Theme or input words"
        }
        placeholder={
          mode === "list"
            ? "õun\nlahti tegema\njalkat\nminu arust\n..."
            : mode === "manual"
              ? "Paste or type an Estonian sentence (or a short text)"
              : 'e.g. "lemmikloom", "lahti tegema", "past tense", ...'
        }
        submitLoading={generatingSource === "single"}
        batchLoading={generatingSource === "batch"}
        disabled={isGenerating}
        multiline={mode === "list" || mode === "manual"}
        level={level}
        onLevelChange={setLevel}
        manualMode={mode === "manual"}
      />
    </PageMain>
  );
}

export default GenerationPage;
