import type { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { send, sendError } from "../../utils/ws";
import type { RegData, User } from "../../types";
import { addUser, getUserByName } from "../../store/memory-store";

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
        name: currentUser.name,
        index: currentUser.index,
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
      name: user.name,
      index: user.index,
      isNew: true,
    });
  }
}
