// Regenerates src/demoSentences.ts from sentences generated in the UI.
//
// 1. In the app (e.g. in production), open the browser devtools console and run:
//      copy(localStorage.getItem("opimasin-from-theme-v2-history"))
//    then paste the clipboard into a file, e.g. history.json.
// 2. npm run import-demo -- history.json            (replaces the demo list)
//    npm run import-demo -- history.json --append   (adds to the existing one)
//
// Only successfully generated, non-manual sentences are kept. The order is the
// one shown in the UI's sentence list (newest first). Duplicate sentences are
// dropped.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HISTORY_KEY = "opimasin-from-theme-v2-history";
const LEVELS = ["A1", "B1"];
const TARGET = fileURLToPath(
  new URL("../src/demoSentences.ts", import.meta.url),
);

const args = process.argv.slice(2);
const append = args.includes("--append");
const inputPath = args.find((a) => !a.startsWith("--"));
if (!inputPath) {
  console.error(
    "Usage: npm run import-demo -- <history.json> [--append]\n" +
      `(the file holds the value of localStorage["${HISTORY_KEY}"])`,
  );
  process.exit(1);
}

let parsed = JSON.parse(readFileSync(inputPath, "utf8"));
// Also accept a whole localStorage dump ({ key: value, ... }).
if (!Array.isArray(parsed) && parsed && HISTORY_KEY in parsed) {
  parsed = parsed[HISTORY_KEY];
  if (typeof parsed === "string") parsed = JSON.parse(parsed);
}
if (!Array.isArray(parsed)) {
  console.error(`Expected a JSON array of sentences in ${inputPath}.`);
  process.exit(1);
}

const imported = [];
const skipped = { notReady: 0, manual: 0, noLevel: 0 };
for (const item of parsed) {
  if (item.status !== "in_progress" && item.status !== "completed") {
    skipped.notReady++;
  } else if (item.manual) {
    skipped.manual++;
  } else if (!LEVELS.includes(item.level)) {
    skipped.noLevel++;
  } else {
    imported.push({
      theme: item.theme,
      level: item.level,
      sentence: item.sentence,
      englishTranslation: item.englishTranslation,
    });
  }
}

let existing = [];
if (append) {
  // Load the current list by evaluating the array literal in the TS file.
  const source = readFileSync(TARGET, "utf8");
  const match = source.match(
    /DEMO_SENTENCES: DemoSentence\[\] = (\[[\s\S]*\]);/,
  );
  if (!match) {
    console.error(`Couldn't find the DEMO_SENTENCES array in ${TARGET}.`);
    process.exit(1);
  }
  existing = new Function(`return ${match[1]}`)();
}

const seen = new Set();
const demos = [...existing, ...imported].filter((d) => {
  if (seen.has(d.sentence)) return false;
  seen.add(d.sentence);
  return true;
});

const entries = demos
  .map(
    (d) => `  {
    theme: ${JSON.stringify(d.theme)},
    level: ${JSON.stringify(d.level)},
    sentence: ${JSON.stringify(d.sentence)},
    englishTranslation: ${JSON.stringify(d.englishTranslation)},
  },`,
  )
  .join("\n");

writeFileSync(
  TARGET,
  `import type { SentenceLevel } from "./types";

export interface DemoSentence {
  theme: string;
  level: SentenceLevel;
  sentence: string;
  englishTranslation: string;
}

// Generated with scripts/import-demo-sentences.mjs, but can be edited by hand.
// No need to fill in anything beyond these four fields, everything else (id,
// attempts, status, ...) is derived.
export const DEMO_SENTENCES: DemoSentence[] = [
${entries}
];
`,
);
execFileSync("npx", ["prettier", "--write", TARGET], { stdio: "ignore" });

console.log(
  `Wrote ${demos.length} demo sentences to src/demoSentences.ts ` +
    `(${imported.length} imported, ${existing.length} kept, ` +
    `${existing.length + imported.length - demos.length} duplicates dropped).`,
);
const skippedTotal = skipped.notReady + skipped.manual + skipped.noLevel;
if (skippedTotal > 0) {
  console.log(
    `Skipped ${skippedTotal}: ${skipped.notReady} still generating/errored, ` +
      `${skipped.manual} manual entries, ${skipped.noLevel} without a level.`,
  );
}
