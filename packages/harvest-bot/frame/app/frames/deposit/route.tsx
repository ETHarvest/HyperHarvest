import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: "https://i.postimg.cc/5t4gdM0Q/HH.png",
    buttons: [
      <Button
        action='tx'
        target={`/deposit/tx/approval`}
        post_url={`/deposit`}
        key={"approval"}
      >
        Approval
      </Button>,
      <Button
        action='tx'
        target={`/deposit/tx/deposit`}
        post_url={`/deposit/success`}
        key={"deposit"}
      >
        Deposit
      </Button>,
    ],
    textInput: "Enter Amount in USDC",
    input: {
      text: "Select network",
      type: "select",
      options: ["optimism-sepolia", "arbitrum-sepolia"],
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
