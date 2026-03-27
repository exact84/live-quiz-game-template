import { WebSocketServer, type WebSocket, type RawData } from "ws";
import {
  handleDisconnect,
  handleError,
  handleMessage,
} from "./message-handler";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (message: RawData) => {
    const text = typeof message === "string" ? message : message.toString();
    handleMessage(ws, text);
  });

  ws.on("close", () => {
    handleDisconnect(ws);
  });

  ws.on("error", (error: Error) => {
    handleError(ws, error);
  });
});
