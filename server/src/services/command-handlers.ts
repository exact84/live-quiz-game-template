import type { WebSocket } from "ws";
import type {
  RegData,
  CreateGameData,
  JoinGameData,
  StartGameData,
  AnswerData,
} from "../types";

export function handleAnswerCommand(ws: WebSocket, data: AnswerData) {}

export function handleCreateGameCommand(ws: WebSocket, data: CreateGameData) {}

export function handleJoinGameCommand(ws: WebSocket, data: JoinGameData) {}

export function handleRegCommand(ws: WebSocket, data: RegData) {}

export function handleStartGameCommand(ws: WebSocket, data: StartGameData) {}

export function handleUserDisconnect(ws: WebSocket) {}
