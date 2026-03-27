import type { WebSocket } from "ws";
export function handleMessage(ws: WebSocket, text: string) {
  console.log(text);
}

export function handleDisconnect(ws: WebSocket) {
  console.log("Client disconnected");
}

export function handleError(ws: WebSocket, error: Error) {
  console.error("WebSocket error:", error);
}
