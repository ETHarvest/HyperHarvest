
import { HandlerContext } from "@xmtp/message-kit";

function generateFrameURL(
  baseUrl: string,
  transaction_type: string,
  params: any,
) {
  // Filter out undefined parameters
  let filteredParams: { [key: string]: any } = {};

  for (const key in params) {
    if (params[key] !== undefined) {
      filteredParams[key] = params[key];
    }
  }
  let queryParams = new URLSearchParams({
    transaction_type,
    ...filteredParams,
  }).toString();
  return `${baseUrl}?${queryParams}`;
}
export async function handleTransaction(context: HandlerContext) {
  const { message: { content: { command, params } } } = context;

  const baseUrl = process.env.BASE_FRAME;
  console.log(command);
  switch (command) {
    case "deposit":
      // context.reply("yes it is");
      // const { amount: depositAmount, token: depositToken } = params;
      // if (!depositAmount || !depositToken) {
      //   context.reply("Missing required parameters. Please provide amount and token.");
      //   return;
      // }
      // const newUrl = generateFrameURL("");
      context.reply(`${baseUrl}frames/deposit`);
      break;

    case "withdraw":
      const { amount: withdrawAmount, token: withdrawToken, address: withdrawAddress } = params;
      // if (!withdrawAmount || !withdrawToken || !withdrawAddress) {
      //   context.reply("Missing required parameters. Please provide amount, token, and address.");
      //   return;
      // }
      context.reply(`${baseUrl}frames/withdraw`);
      break;

    default:
      context.reply("Unknown command.");
  }
}

