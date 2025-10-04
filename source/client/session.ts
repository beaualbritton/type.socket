export type ClientSession =
{
  ws: Bun.ServerWebSocket;
  username: string;
  subs: Set<string>;
};
