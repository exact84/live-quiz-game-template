import type { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { send, sendError } from "../../utils/ws";
import type { CreateGameData, Game, Player } from "../../types";
import { addGame, getUserBySocket } from "../../store/memory-store";

export function handleCreateGameCommand(
  ws: WebSocket,
  data: CreateGameData,
): void {
  const user = getUserBySocket(ws);
  if (!user) {
    sendError(ws, "You must register first");
    return;
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    sendError(ws, "Questions are required");
    return;
  }

  const hostPlayer: Player = {
    name: user.name,
    index: user.index,
    score: 0,
    ws,
  };

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const game: Game = {
    id: randomUUID(),
    code,
    hostId: user.index,
    questions: data.questions,
    players: [hostPlayer],
    currentQuestion: -1,
    status: "waiting",
    questionStartTime: undefined,
    questionTimer: undefined,
    playerAnswers: new Map(),
  };

  addGame(game);

  send(ws, "game_created", {
    gameId: game.id,
    code: game.code,
    // hostId: game.hostId,
  });

  send(ws, "update_players", [
    {
      name: hostPlayer.name,
      index: hostPlayer.index,
      score: hostPlayer.score,
    },
  ]);
}
