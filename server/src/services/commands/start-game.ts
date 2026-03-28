import type { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { send, sendError } from "../../utils/ws";
import type { StartGameData, User } from "../../types";
import { addUser, getUserByName } from "../../store/memory-store";

export function handleStartGameCommand(ws: WebSocket, data: StartGameData) {}
