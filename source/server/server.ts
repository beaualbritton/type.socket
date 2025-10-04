import type { ServerWebSocket } from "bun";
import type { ClientSession } from "../client/session";

export class Server
{
  private server!: Bun.Server;
  private clients: Map<ServerWebSocket, ClientSession> = new Map();
  private clientCount : number = 0;
  start(port: number)
  {
    this.server = Bun.serve({
      port,
      websocket: {
        open: this.onOpen.bind(this),
        message: this.onMessage.bind(this),
        close: this.onClose.bind(this),
        publishToSelf: false,
      },
      fetch: (req,server) => {server.upgrade(req)},
    });
    console.log("Hi! Server running")
  }

  private onOpen(ws: Bun.ServerWebSocket)
  {
    const username = `user_${this.clientCount++}`
    const session:ClientSession=
    {
        ws: ws,
        username: username,
        subs: new Set(["room"])
    }
    this.clients.set(ws, session);

    ws.subscribe("room");

    console.log(`connected: ${ws.remoteAddress} as ${username}`);
    console.log(`connected: ${ws.remoteAddress}`)

    ws.publish("room", `${username} joined the room`);
  }

  private onMessage(ws: Bun.ServerWebSocket, message: string)
  {
    const session = this.clients.get(ws);
    if (!session) return;


    console.log(`${session?.username}: ${message}`);

    ws.publish("room", `${session.username}: ${message}`);
  }

  private onClose(ws: Bun.ServerWebSocket)
  {
    const session = this.clients.get(ws);
    if (!session) return;

    this.clients.delete(ws)

    ws.publish("room", `${session.username} left the room`);
    console.log(`${ws.remoteAddress} left.`)
  }
}
