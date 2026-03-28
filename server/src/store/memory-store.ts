import type { Game, User } from "../types";
import type { WebSocket } from "ws";

export const users: User[] = [];

export function addUser(user: User): void {
  users.push(user);
}

export function removeUserBySocket(ws: WebSocket): void {
  const index = users.findIndex((user) => user.ws === ws);
  if (index !== -1) {
    users.splice(index, 1);
  }
}

export function getUserByName(name: string): User | undefined {
  return users.find((user) => user.name === name);
}

export function getUserBySocket(ws: WebSocket): User | undefined {
  return users.find((user) => user.ws === ws);
}

// export const gamesById = new Map<string, Game>();
// export const gamesByCode = new Map<string, Game>();
export const games: Game[] = [];

export function addGame(game: Game): void {
  games.push(game);
}

export function getGameByCode(code: string): Game | undefined {
  return games.find((game) => game.code === code);
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
