import { Button } from "frames.js/next";
import { frames } from "../../frames";
const handleRequest = frames(async (ctx) => {
  return {
    image: "https://imgur.com/mdk8MZ4.png",
    buttons: [
      <Button
        action='link'
        target={`https://sepolia-optimism.etherscan.io/tx/${ctx.message?.transactionId}`}
        key={"link"}
      >
        Check Op Txn
      </Button>,
      <Button
        action='link'
        target={`https:///sepolia.arbiscan.io/tx/${ctx.message?.transactionId}`}
        key={"link"}
      >
      Check Arb Txn
    </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
