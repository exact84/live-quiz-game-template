import type { WebSocket } from "ws";
import { broadcast, send, sendError } from "../../utils/ws";
import type { JoinGameData } from "../../types";
import { getGameByCode, getUserBySocket } from "../../store/memory-store";

export function handleJoinGameCommand(ws: WebSocket, data: JoinGameData) {
  const { code } = data;

  const game = getGameByCode(code);
  if (!game) {
    sendError(ws, "Game not found");
    return;
  }

  if (game.status !== "waiting") {
    sendError(ws, "Game is already in progress");
    return;
  }

  const user = getUserBySocket(ws);
  if (!user) {
    sendError(ws, "You must register first");
    return;
  }

  const existingPlayer = game.players.find(
    (player) => player.index === user.index,
  );

  if (existingPlayer) {
    // sendError(ws, "You are already in the game");
    existingPlayer.ws = ws;
  } else {
    game.players.push({
      name: user.name,
      index: user.index,
      score: 0,
      ws,
    });

    broadcast(game.players, "player_joined", {
      playerName: user.name,
      playerCount: game.players.length,
    });
  }

  send(ws, "game_joined", {
    gameId: game.id,
  });

  broadcast(
    game.players,
    "update_players",
    game.players.map((player) => ({
      name: player.name,
      index: player.index,
      score: player.score,
    })),
  );
}
