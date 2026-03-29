import { WebSocketServer, type WebSocket, type RawData } from "ws";
import {
  handleDisconnect,
  handleError,
  handleMessage,
} from "./message-handler";
import { HEARTBEAT_INTERVAL_MS } from "./const/heartbeat-interval";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on ws://localhost:${PORT}`);

export type AliveWebSocket = WebSocket & {
  isAlive: boolean;
};

wss.on("connection", (ws: AliveWebSocket) => {
  console.log("Client connected");
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

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

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const socket = ws as AliveWebSocket;

    if (!socket.isAlive) {
      socket.terminate();
      return;
    }

    socket.isAlive = false;
    socket.ping();
  });
}, HEARTBEAT_INTERVAL_MS);

wss.on("close", () => {
  clearInterval(interval);
});
