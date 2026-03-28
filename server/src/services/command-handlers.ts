import type { WebSocket } from "ws";
import type {
  RegData,
  CreateGameData,
  JoinGameData,
  StartGameData,
  AnswerData,
  User,
} from "../types";
import { addUser, getUserByName } from "../store/memory-store";
import { randomUUID } from "node:crypto";
import { send, sendError } from "../utils/ws";

export function handleAnswerCommand(ws: WebSocket, data: AnswerData) {}

export function handleCreateGameCommand(ws: WebSocket, data: CreateGameData) {}

export function handleJoinGameCommand(ws: WebSocket, data: JoinGameData) {}

export function handleRegCommand(ws: WebSocket, data: RegData): void {
  const { name, password } = data;

  if (!name || !password) {
    sendError(ws, "Name and password are required");
    return;
  }
  const currentUser = getUserByName(name);

  if (currentUser) {
    if (currentUser.password === password) {
      currentUser.ws = ws;

      send(ws, "reg", {
        success: true,
        user: {
          name: currentUser.name,
          index: currentUser.index,
        },
        isNew: false,
      });
    } else {
      sendError(ws, "User already exists, but password is incorrect");
    }
  } else {
    const user: User = {
      name,
      password,
      index: randomUUID(),
      ws,
    };

    addUser(user);

    send(ws, "reg", {
      success: true,
      user: {
        name: user.name,
        index: user.index,
      },
      isNew: true,
    });
  }
}

export function handleStartGameCommand(ws: WebSocket, data: StartGameData) {}

export function handleUserDisconnect(ws: WebSocket) {}
