import type { WebSocket } from "bun";

export class Client
{
  private websocket: WebSocket;
  private username: string;
  private url: string;

  constructor(username: string, server: string, port: number)
  {
    this.url = `ws://${server}:${port}/?username=${username}`
    this.username = username;

    this.websocket = new WebSocket(this.url);
    this.websocket.onopen= this.clientOpen.bind(this);
    this.websocket.onmessage = this.receiveMessage.bind(this);
    this.websocket.onclose = this.clientExit.bind(this);
  }

  private clientOpen(): void
  {
    console.log(`connected to ${this.url}`)
  }

  private clientExit(): void
  {
    this.sendMessage("exited");
    this.websocket.close();
  }
  
  public sendMessage(message: string): void
  {
    this.websocket.send(message);
  }

  private receiveMessage(event: MessageEvent): void
  {
    console.log(event.data);
  }

  public exit(): void
  {
    this.clientExit();
  }
}
