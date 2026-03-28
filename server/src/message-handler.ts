import type { WebSocket } from "ws";
import { sendError } from "./utils/ws";
import {
  handleAnswerCommand,
  handleCreateGameCommand,
  handleJoinGameCommand,
  handleRegCommand,
  handleStartGameCommand,
} from "./services/commands";
import { isValidMessage } from "./utils/ws";
import { disconnectUserBySocket } from "./store/memory-store";

export function handleMessage(ws: WebSocket, text: string): void {
  console.log("Incoming message:", text);
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
  disconnectUserBySocket(ws);
}

export function handleError(ws: WebSocket, error: Error): void {
  console.error("WebSocket error:", error);
}
