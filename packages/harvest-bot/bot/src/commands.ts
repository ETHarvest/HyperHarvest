
import type { CommandGroup } from "@xmtp/message-kit";

export const commands: CommandGroup[] = [
  {
    name: "Transactions",
    icon: "💸",
    description: "Commands for depositing and withdrawing funds.",
    commands: [
      {
        command: "/deposit",
        description: "Deposit a specified amount of a USDC.",
        params: {
          amount: {
            default: 0,
            type: "number",
          },
          token: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc"],
          },
        },
      },
      {
        command: "/withdraw",
        description: "Withdraw a specified amount of a USDC to an address.",
        params: {
          amount: {
            default: 10,
            type: "number",
          },
          token: {
            default: "usdc",
            type: "string",
            values: ["eth", "dai", "usdc"],
          },
          address: {
            default: "",
            type: "address",
          },
        },
      },
    ],
  },
  {
    name: "Agent",
    icon: "🤖",
    description: "Manage agent commands.",
    commands: [
      {
        command: "/agent [prompt]",
        description: "Manage agent commands.",
        params: {
          prompt: {
            default: "",
            type: "string",
          },
        },
      },
    ],
  },
  {
    name: "Help",
    icon: "❓",
    description: "Get help and information about available commands.",
    commands: [
      {
        command: "/help",
        description: "Display help information and available commands.",
        params :{},
      },
    ],
  },
];
