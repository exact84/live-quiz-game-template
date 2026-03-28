import type { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { send, sendError } from "../../utils/ws";
import type { AnswerData, User } from "../../types";
import { addUser, getUserByName } from "../../store/memory-store";

export function handleAnswerCommand(ws: WebSocket, data: AnswerData) {}
