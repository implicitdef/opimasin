// Reverses the order of the sentences in src/demoSentences.ts.
//
//   npm run reverse-demo
//
// The demo list is shown in array order, and each item's id (demo-0, demo-1,
// ...) and createdAt are derived from its position (see FromThemeContext.tsx),
// so they follow the new order without any other change.

import { readDemoSentences, writeDemoSentences } from "./demoSentencesFile.mjs";

const demos = readDemoSentences();
writeDemoSentences([...demos].reverse());
console.log(`Reversed ${demos.length} demo sentences in src/demoSentences.ts.`);
