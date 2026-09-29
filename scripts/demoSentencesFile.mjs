// Reads and writes src/demoSentences.ts, shared by the demo sentence scripts.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const TARGET = fileURLToPath(
  new URL("../src/demoSentences.ts", import.meta.url),
);

/** Loads the current list by evaluating the array literal in the TS file. */
export function readDemoSentences() {
  const source = readFileSync(TARGET, "utf8");
  const match = source.match(
    /DEMO_SENTENCES: DemoSentence\[\] = (\[[\s\S]*\]);/,
  );
  if (!match) {
    console.error(`Couldn't find the DEMO_SENTENCES array in ${TARGET}.`);
    process.exit(1);
  }
  return new Function(`return ${match[1]}`)();
}

export function writeDemoSentences(demos) {
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
}
