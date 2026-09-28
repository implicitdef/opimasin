import { Info } from "lucide-react";
import FoldableText from "./FoldableText";

type Props = {
  children: React.ReactNode;
} & (
  | { details?: undefined }
  | {
      /** Extra text, folded behind a "more" toggle. */
      details: React.ReactNode;
      /** localStorage key remembering whether the details are unfolded. */
      storageKey: string;
    }
);

function YellowDescription(props: Props) {
  return (
    <div className="flex items-start gap-2  text-sm text-gray-800 italic my-2 bg-yellow-200 p-2 w-fit">
      <Info size={16} className="mt-0.5 shrink-0" />
      {props.details === undefined ? (
        <p>{props.children}</p>
      ) : (
        <FoldableText storageKey={props.storageKey} details={props.details}>
          {props.children}
        </FoldableText>
      )}
    </div>
  );
}

export default YellowDescription;
