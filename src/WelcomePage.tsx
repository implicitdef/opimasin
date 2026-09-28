import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { visibleFeatures } from "./features";
import FoldableText from "./FoldableText";
import { useOwnerMode } from "./OwnerModeContext";

function WelcomePage() {
  const { ownerMode } = useOwnerMode();
  const [translation, ...otherFeatures] = visibleFeatures(ownerMode);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-gray-600 max-w-2xl">
          <FoldableText
            storageKey="opimasin-welcome-intro-open"
            toggleLabel="about"
            black
            details={
              <div className="bg-gray-200 p-4 flex gap-4 flex-col">
                <p>
                  I made this for myself to practice Estonian. I use it all the
                  time. Hopefully it can be useful to others.
                </p>
                <p>
                  It is free to use, but <b>requires an Anthropic API key</b>{" "}
                  for most features.
                  <br /> Anthropic requires you to fund your usage with a
                  minimum of $5. All features of this app consumes very little
                  tokens, so with $5 you can easily practice for weeks.
                </p>
                <p>
                  There is no account creation on this app, everything is stored
                  in the local storage of your browser.
                </p>
              </div>
            }
          >
            A handful of tools to practice Estonian.
          </FoldableText>
        </div>

        <ul className="border-t border-gray-900">
          {[translation, ...otherFeatures].map((feature) => {
            const isMain = feature === translation;
            return (
              <li key={feature.to} className="border-b border-gray-200">
                <Link
                  to={feature.to}
                  className="group grid grid-cols-[1.5rem_1fr_auto] items-start gap-x-4 px-1 py-5 transition-colors hover:bg-gray-100"
                >
                  <feature.icon
                    size={isMain ? 24 : 18}
                    className={`shrink-0 text-blue-700  transition-colors ${isMain ? "mt-1" : "mt-0.5"}`}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3
                        className={`font-semibold text-blue-700  transition-colors ${isMain ? "text-2xl" : "text-base"}`}
                      >
                        {feature.welcomeCardLabel}
                      </h3>
                    </div>
                    <div
                      className={`text-gray-600 max-w-2xl ${isMain ? "text-base" : "text-sm"}`}
                    >
                      {feature.description}
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-gray-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export default WelcomePage;
