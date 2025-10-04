import {Client} from "./client"

async function input(input: string): Promise<string>
{
  process.stdout.write(input);
  for await(const line of console)
  {
    return line;
  }
  return "";
}

const username = await input("enter a username: ")
const client = new Client(username,"localhost",3000);

let connected = true;

while (connected)
{
  let message = await input(">>>")
  if (message === "exit")
  {
    client.exit();
  }
  client.sendMessage(message);
}
