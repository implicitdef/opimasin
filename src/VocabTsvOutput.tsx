import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { VocabPair } from "./types";
import { toTsv } from "./vocabExtract";

interface Props {
  title: React.ReactNode;
  pairs: VocabPair[];
}

function VocabTsvOutput({ title, pairs }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const tsv = toTsv(pairs);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tsv);
      setCopyError(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <Copy size={14} />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="border-2 border-black rounded-md bg-slate-50 p-3 text-sm font-mono overflow-x-auto">
        {tsv}
      </pre>
      {copyError && (
        <p className="text-xs text-gray-500">
          Couldn't copy automatically — select the text above and copy manually.
        </p>
      )}
    </div>
  );
}

export default VocabTsvOutput;
