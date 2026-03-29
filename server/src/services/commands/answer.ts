import type { WebSocket } from "ws";
import { send, sendError } from "../../utils/ws";
import type { AnswerData } from "../../types";
import { getGameById, getUserBySocket } from "../../store/memory-store";
import { finishQuestion } from "./question";

export function handleAnswerCommand(ws: WebSocket, data: AnswerData) {
  const game = getGameById(data.gameId);
  if (!game) {
    sendError(ws, "Game not found");
    return;
  }

  if (game.status !== "in_progress") {
    sendError(ws, "Game is not in progress");
    return;
  }

  if (game.currentQuestion !== data.questionIndex) {
    sendError(ws, "Wrong question index");
    return;
  }

  const user = getUserBySocket(ws);
  if (!user) {
    sendError(ws, "You must register first");
    return;
  }

  const player = game.players.find((player) => player.index === user.index);
  if (!player) {
    sendError(ws, "You are not in the game");
    return;
  }

  if (game.playerAnswers.has(user.index)) {
    sendError(ws, "You have already answered");
    return;
  }

  game.playerAnswers.set(user.index, {
    answerIndex: data.answerIndex,
    timestamp: Date.now(),
  });

  send(ws, "answer_accepted", {
    questionIndex: game.currentQuestion,
  });

  const connectedPlayersCount = game.players.filter(
    (player) => player.ws,
  ).length;

  if (game.playerAnswers.size === connectedPlayersCount) {
    if (game.questionTimer) {
      clearTimeout(game.questionTimer);
      game.questionTimer = undefined;
    }
    finishQuestion(game);
  }
}
