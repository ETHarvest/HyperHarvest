import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: "https://i.postimg.cc/KvhmX4bx/img.png",
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
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
