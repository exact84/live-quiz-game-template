import type { Player, WSMessage } from "../types";
import type { WebSocket } from "ws";

export function isValidMessage(message: unknown): message is WSMessage {
  if (typeof message !== "object" || message === null) return false;

  const m = message as Record<string, unknown>;

  return typeof m.type === "string" && "data" in m && typeof m.id === "number";
}

export function sendError(ws: WebSocket, message: string): void {
  ws.send(
    JSON.stringify({
      id: 0,
      type: "error",
      data: { message },
    }),
  );
}

export function send(ws: WebSocket, type: string, data: unknown): void {
  ws.send(
    JSON.stringify({
      id: 0,
      type,
      data,
    }),
  );
}

export function broadcast(
  players: Player[],
  type: string,
  data: unknown,
): void {
  for (const player of players) {
    if (player.ws) {
      send(player.ws, type, data);
    }
  }
}
