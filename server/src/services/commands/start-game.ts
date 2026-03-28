import type { WebSocket } from "ws";
import { sendError } from "../../utils/ws";
import type { StartGameData } from "../../types";
import { getGameById, getUserBySocket } from "../../store/memory-store";
import { startQuestion } from "./question";

export function handleStartGameCommand(
  ws: WebSocket,
  data: StartGameData,
): void {
  const { gameId } = data;

  const game = getGameById(gameId);
  if (!game) {
    sendError(ws, "Game not found");
    return;
  }

  const user = getUserBySocket(ws);
  if (!user) {
    sendError(ws, "You must register first");
    return;
  }

  if (game.hostId !== user.index) {
    sendError(ws, "Only host can start the game");
    return;
  }

  if (game.status !== "waiting") {
    sendError(ws, "Game has already been started");
    return;
  }

  if (game.questions.length === 0) {
    sendError(ws, "Game has no questions");
    return;
  }

  if (game.players.length === 0) {
    sendError(ws, "Game has no players");
    return;
  }

  game.status = "in_progress";
  game.currentQuestion = 0;

  startQuestion(game);
}
