import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { usePersistedState } from "./usePersistedState";

/** Text followed by a "more/less" toggle that unfolds extra details, folded by default. */
function FoldableText({
  children,
  details,
  storageKey,
  toggleLabel,
  black,
}: {
  children: ReactNode;
  /** Extra text, folded behind the "more" toggle. */
  details: ReactNode;
  /** localStorage key remembering whether the details are unfolded. */
  storageKey: string;
  /** Replaces "more"/"less" on the toggle, in both states. */
  toggleLabel?: string;
  /** Black toggle instead of blue. */
  black?: boolean;
}) {
  const [open, setOpen] = usePersistedState(storageKey, false);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div>
      <p>
        {children}{" "}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={`inline-flex items-center not-italic text-xs  underline font-bold ${black ? "text-black hover:text-gray-500" : "text-blue-600 hover:text-gray-900"} `}
        >
          <Chevron size={14} />
          {toggleLabel ?? (open ? "less" : "more")}
        </button>
      </p>
      {open && <div className="mt-3">{details}</div>}
    </div>
  );
}

export default FoldableText;
