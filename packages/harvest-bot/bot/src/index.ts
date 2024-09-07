import { run, HandlerContext, CommandHandlers } from "@xmtp/message-kit";
import { commands } from "./commands.js";
import { help } from "./handler/help.js";
import { handleTransaction } from "./handler/transactions.js";
import { agent } from "./handler/agent.js";
const commandHandlers: CommandHandlers = {
  "/help": help,
  "/deposit": handleTransaction,
  "/withdraw": handleTransaction,
  "/agent": agent,
};

const appConfig = {
  commands: commands,
  commandHandlers: commandHandlers,
};

run(async (context: HandlerContext) => {
  const { content, typeId } = context.message;
  if (typeId === "text") {
    const text = content.content;

    if (text.startsWith("/")) {
      await context.intent(text);
    } else {
      context.reply("Hello! Welcome to HyperHarvest");
    }
  } else {
    context.reply("hello");
  }
}, appConfig);