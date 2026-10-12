import { Link } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { useAlias } from "./AliasContext";
import CredentialForm from "./CredentialForm";
import { CREDENTIALS, useCredential } from "./CredentialsContext";
import PageMain from "./PageMain";
import { StatusIcon } from "./StatusIcon";
import YellowDescription from "./YellowDescription";

function AliasListPage() {
  const baserow = useCredential("baserow");
  const { games, newGameState, startNewGame, clearGames } = useAlias();
  const loading = newGameState.status === "loading";

  return (
    <PageMain gap={4}>
      <YellowDescription>
        Alias game. Describe the Estonian word, in Estonian, without saying it,
        until the AI guesses it. Each of your messages is checked first, and
        must be correct before the AI makes its guess. Words are picked at
        random from your Baserow vocabulary table, never the same one twice.
      </YellowDescription>

      {!baserow.isSet ? (
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <h2 className="text-lg font-bold text-blue-700">
              {CREDENTIALS.baserow.title}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {CREDENTIALS.baserow.description} The table must have{" "}
              <code>Estonian</code> and <code>English</code> text fields.
            </p>
          </div>
          <CredentialForm
            kind="baserow"
            submitLabel="Save"
            onSubmit={baserow.set}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={startNewGame}
              disabled={loading}
              className="flex items-center gap-1.5 bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              New game
            </button>
            {loading && (
              <span className="flex items-center gap-1.5 text-sm text-blue-700">
                <RefreshCcw size={14} className="animate-spin" />
                Reading the Baserow table… ({newGameState.rowCount} rows)
              </span>
            )}
          </div>
          {newGameState.status === "all_played" && (
            <p className="text-sm text-gray-600">
              You've already played every word in the table.
            </p>
          )}
          {newGameState.status === "error" && (
            <p className="text-sm text-red-600">{newGameState.message}</p>
          )}
        </div>
      )}

      {games.length > 0 && (
        <section className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Your games</h2>
            <button
              onClick={() => {
                if (
                  confirm(
                    "Clear all your alias games? Their words can then be picked again.",
                  )
                )
                  clearGames();
              }}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors underline"
              title="Clear your games (their words become playable again)"
            >
              Clear all
            </button>
          </div>
          <ul className="flex flex-col bg-blue-50 divide-y divide-gray-400 rounded-lg overflow-hidden mt-1">
            {games.map((game) => (
              <li key={game.id}>
                <Link
                  to="/alias/$id"
                  params={{ id: game.id }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-100 transition-colors"
                >
                  <StatusIcon
                    status={
                      game.status === "won"
                        ? "solved"
                        : game.turns.length > 0
                          ? "in_progress"
                          : "not_started"
                    }
                  />
                  <span className="truncate">
                    <b>{game.estonian}</b>{" "}
                    <span className="text-gray-500 italic text-xs">
                      {game.english}
                    </span>{" "}
                    {game.turns.length > 0 && (
                      <span className="text-gray-500 text-xs">
                        ({game.turns.length}{" "}
                        {game.turns.length === 1 ? "message" : "messages"})
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageMain>
  );
}

export default AliasListPage;
