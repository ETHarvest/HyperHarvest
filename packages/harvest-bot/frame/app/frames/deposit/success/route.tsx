import { Button } from "frames.js/next";
import { frames } from "../../frames";
const handleRequest = frames(async (ctx) => {

  return {
    image: "https://i.postimg.cc/KvhmX4bx/img.png",
    buttons: [
      <Button
        action='link'
        target={`https://sepolia-optimism.etherscan.io/tx/${ctx.message?.transactionId}`}
        key={"link"}
      >
        Check Txn
      </Button>
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
