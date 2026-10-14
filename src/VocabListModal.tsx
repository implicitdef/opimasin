import { X } from "lucide-react";
import type { VocabPair } from "./types";
import VocabTsvOutput from "./VocabTsvOutput";

interface Props {
  name: string;
  pairs: VocabPair[];
  onClose: () => void;
}

function VocabListModal({ name, pairs, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow p-8 pt-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
        <VocabTsvOutput
          title={`${name} (${pairs.length} word${pairs.length === 1 ? "" : "s"})`}
          pairs={pairs}
        />
      </div>
    </div>
  );
}

export default VocabListModal;
