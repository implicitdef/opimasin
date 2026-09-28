import {
  ChevronDown,
  ChevronRight,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { usePersistedState } from "./usePersistedState";

function SettingsBox({
  storageKey,
  title = "Settings",
  icon: Icon = Settings,
  stacked,
  className = "-mt-4",
  children,
}: {
  /** localStorage key remembering whether the box is unfolded. */
  storageKey: string;
  title?: string;
  /** Pass null to show no icon. */
  icon?: LucideIcon | null;
  stacked?: boolean;
  /** Extra classes for the box, mostly for its outer spacing. */
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = usePersistedState(storageKey, false);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div className={`flex flex-col gap-3 bg-gray-200 p-4 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 w-fit"
      >
        <Chevron size={16} className="text-gray-500" />
        {Icon && <Icon size={16} className="text-gray-500" />}
        {title}
      </button>
      {open && (
        <div
          className={
            stacked
              ? "flex flex-col items-start gap-3"
              : "flex items-center gap-4 flex-wrap"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default SettingsBox;
