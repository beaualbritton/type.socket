export type ClientSession =
{
  ws: Bun.ServerWebSocket<{username: string}>;
  username: string;
  subs: Set<string>;
};
