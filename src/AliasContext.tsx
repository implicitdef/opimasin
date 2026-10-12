import { Outlet, useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";
import { checkAliasMessage, guessAliasWord } from "./alias-api";
import { isCorrectGuess, pickUnplayedRow } from "./aliasGame";
import ApiKeyModal from "./ApiKeyModal";
import { fetchAllRows } from "./baserow-api";
import { useApiKey, useCredential } from "./CredentialsContext";
import { playCorrectSound, playIncorrectSound, playRevealSound } from "./sound";
import type { AliasGame, AliasTurn } from "./types";
import { usePersistedState } from "./usePersistedState";

const GAMES_KEY = "opimasin-alias-games";

export type AliasBusy = "checking" | "guessing";

export type NewGameState =
  | { status: "idle" }
  | { status: "loading"; rowCount: number }
  | { status: "all_played" }
  | { status: "error"; message: string };

interface AliasContextValue {
  games: AliasGame[];
  findGame: (id: string) => AliasGame | undefined;
  newGameState: NewGameState;
  startNewGame: () => void;
  // In-memory only: what's running / what failed, per game id.
  busy: Record<string, AliasBusy | undefined>;
  errors: Record<string, string | undefined>;
  /** Resolves to true once the message has been checked (accepted or not). */
  submitMessage: (id: string, text: string) => Promise<boolean>;
  retryGuess: (id: string) => void;
  clearGames: () => void;
}

const AliasContext = createContext<AliasContextValue | null>(null);

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong";
}

function AliasProvider() {
  const { apiKey, setApiKey } = useApiKey();
  const baserow = useCredential("baserow");
  const navigate = useNavigate();
  const [games, setGames] = usePersistedState<AliasGame[]>(GAMES_KEY, []);
  const [newGameState, setNewGameState] = useState<NewGameState>({
    status: "idle",
  });
  const [busy, setBusy] = useState<Record<string, AliasBusy | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [pendingAction, setPendingAction] = useState<
    ((key: string) => void) | null
  >(null);

  function findGame(id: string) {
    return games.find((g) => g.id === id);
  }

  function updateGame(id: string, update: (game: AliasGame) => AliasGame) {
    setGames((prev) => prev.map((g) => (g.id === id ? update(g) : g)));
  }

  function setGameBusy(id: string, value: AliasBusy | undefined) {
    setBusy((prev) => ({ ...prev, [id]: value }));
  }

  function setGameError(id: string, value: string | undefined) {
    setErrors((prev) => ({ ...prev, [id]: value }));
  }

  function withApiKey(action: (key: string) => void) {
    if (apiKey) {
      action(apiKey);
    } else {
      setPendingAction(() => action);
    }
  }

  function handleApiKeySubmit(key: string) {
    setApiKey(key);
    const action = pendingAction;
    setPendingAction(null);
    action?.(key);
  }

  async function startNewGame() {
    if (newGameState.status === "loading") return;
    setNewGameState({ status: "loading", rowCount: 0 });
    try {
      const rows = await fetchAllRows(
        { token: baserow.values.token, tableId: baserow.values.tableId },
        (rowCount) => setNewGameState({ status: "loading", rowCount }),
      );
      const row = pickUnplayedRow(rows, games);
      if (!row) {
        setNewGameState({ status: "all_played" });
        return;
      }
      const game: AliasGame = {
        id: crypto.randomUUID(),
        rowId: row.id,
        estonian: row.estonian.trim(),
        english: row.english.trim(),
        createdAt: Date.now(),
        status: "in_progress",
        turns: [],
        rejected: [],
      };
      setGames((prev) => [game, ...prev]);
      setNewGameState({ status: "idle" });
      navigate({ to: "/alias/$id", params: { id: game.id } });
    } catch (err) {
      setNewGameState({ status: "error", message: errorMessage(err) });
    }
  }

  async function runGuess(game: AliasGame, turns: AliasTurn[], key: string) {
    setGameBusy(game.id, "guessing");
    setGameError(game.id, undefined);
    try {
      const guess = await guessAliasWord(turns, key);
      const won = isCorrectGuess(guess, game.estonian);
      if (won) playCorrectSound();
      else playRevealSound();
      updateGame(game.id, (g) => ({
        ...g,
        status: won ? "won" : g.status,
        turns: g.turns.map((t, i) =>
          i === g.turns.length - 1 ? { ...t, guess } : t,
        ),
      }));
    } catch (err) {
      setGameError(game.id, `Couldn't get a guess: ${errorMessage(err)}`);
    } finally {
      setGameBusy(game.id, undefined);
    }
  }

  async function runSubmit(game: AliasGame, text: string, key: string) {
    setGameBusy(game.id, "checking");
    setGameError(game.id, undefined);
    let result;
    try {
      result = await checkAliasMessage(text, key);
    } catch (err) {
      setGameError(
        game.id,
        `Couldn't check your message: ${errorMessage(err)}`,
      );
      setGameBusy(game.id, undefined);
      return false;
    }
    if (!result.isCorrect) {
      playIncorrectSound();
      updateGame(game.id, (g) => ({
        ...g,
        rejected: [...g.rejected, { text, proposals: result.proposals }],
      }));
      setGameBusy(game.id, undefined);
      return true;
    }
    const turns = [...game.turns, { message: text }];
    updateGame(game.id, (g) => ({ ...g, turns, rejected: [] }));
    await runGuess(game, turns, key);
    return true;
  }

  function submitMessage(id: string, text: string): Promise<boolean> {
    const game = findGame(id);
    const trimmed = text.trim();
    if (!game || !trimmed || busy[id] || game.status === "won") {
      return Promise.resolve(false);
    }
    return new Promise((resolve) =>
      withApiKey((key) => runSubmit(game, trimmed, key).then(resolve)),
    );
  }

  function retryGuess(id: string) {
    const game = findGame(id);
    if (!game || busy[id] || game.turns.length === 0) return;
    withApiKey((key) => runGuess(game, game.turns, key));
  }

  function clearGames() {
    setGames([]);
  }

  return (
    <AliasContext.Provider
      value={{
        games,
        findGame,
        newGameState,
        startNewGame,
        busy,
        errors,
        submitMessage,
        retryGuess,
        clearGames,
      }}
    >
      <Outlet />
      {pendingAction && (
        <ApiKeyModal
          onSubmit={handleApiKeySubmit}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </AliasContext.Provider>
  );
}

export function useAlias() {
  const ctx = useContext(AliasContext);
  if (!ctx) throw new Error("useAlias must be used within AliasProvider");
  return ctx;
}

export default AliasProvider;
