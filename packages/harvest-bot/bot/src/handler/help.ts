import { HandlerContext } from "@xmtp/message-kit";

export async function help(context: HandlerContext) {
  const helpMessage = `Welcome to chat boat
  
Here you will receive yield updates, strategy changes, transaction confirmations, and many more!

Commands you can use:

/deposit [amount] -> Deposit a specified amount of USDC

/withdraw [amount] -> Withdraw a specified amount of USDC

/agent -> Use our AI agent

/help -> Get help and information about available commands
    `;
  

  await context.reply(helpMessage);
}
