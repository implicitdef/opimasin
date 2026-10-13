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
  plain,
  className = "-mt-4",
  children,
}: {
  /** localStorage key remembering whether the box is unfolded. */
  storageKey: string;
  title?: string;
  /** Pass null to show no icon. */
  icon?: LucideIcon | null;
  stacked?: boolean;
  /** No background nor padding around the box; only the content is indented. */
  plain?: boolean;
  /** Extra classes for the box, mostly for its outer spacing. */
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = usePersistedState(storageKey, false);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div
      className={`flex flex-col gap-3 ${plain ? "" : "bg-gray-200 p-4"} ${className}`}
    >
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
          className={`${
            stacked
              ? "flex flex-col items-start gap-3"
              : "flex items-center gap-4 flex-wrap"
          } ${plain ? "pl-6" : ""}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function SettingCheckbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-blue-700"
        />
        {label}
      </label>
      {/* Indented to line up with the label text, past the checkbox. */}
      <p className="pl-6 text-xs italic text-gray-500">{description}</p>
    </div>
  );
}

export default SettingsBox;
