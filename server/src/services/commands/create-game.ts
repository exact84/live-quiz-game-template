import type { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { sendError } from "../../utils/ws";
import type { CreateGameData, User } from "../../types";
import { getUserByName, getUserBySocket } from "../../store/memory-store";

export function handleCreateGameCommand(ws: WebSocket, data: CreateGameData) {
  const user = getUserBySocket(ws);
  if (!user) {
    sendError(ws, "User not found");
    return;
  }
  const { name, password } = data;

  if (!name || !password) {
    sendError(ws, "Name and password are required");
    return;
  }
  const currentUser = getUserByName(name);
}
