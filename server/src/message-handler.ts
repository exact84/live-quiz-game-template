import type { WebSocket } from "ws";
// import type { WSMessage } from "./types";
import { sendError } from "./utils/ws";
import {
  handleAnswerCommand,
  handleCreateGameCommand,
  handleJoinGameCommand,
  handleRegCommand,
  handleStartGameCommand,
  handleUserDisconnect,
} from "./services/command-handlers";
import { isValidMessage } from "./utils/ws";

export function handleMessage(ws: WebSocket, text: string): void {
  console.log(text);
  let message: unknown;

  try {
    message = JSON.parse(text);
  } catch {
    sendError(ws, "Invalid JSON");
    return;
  }

  if (!isValidMessage(message)) {
    sendError(ws, "Invalid message format");
    return;
  }

  const wsMessage = message;

  switch (wsMessage.type) {
    case "reg":
      handleRegCommand(ws, wsMessage.data);
      return;

    case "create_game":
      handleCreateGameCommand(ws, wsMessage.data);
      return;

    case "join_game":
      handleJoinGameCommand(ws, wsMessage.data);
      return;

    case "start_game":
      handleStartGameCommand(ws, wsMessage.data);
      return;

    case "answer":
      handleAnswerCommand(ws, wsMessage.data);
      return;

    default:
      sendError(ws, `Unknown command: ${wsMessage.type}`);
  }
}

export function handleDisconnect(ws: WebSocket): void {
  handleUserDisconnect(ws);
}

export function handleError(ws: WebSocket, error: Error): void {
  console.error("WebSocket error:", error);
}
