import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: "https://i.postimg.cc/5t4gdM0Q/HH.png",
    buttons: [
      <Button
        action='tx'
        target={`/withdraw/tx/`}
        post_url={`/withdraw/success`}
        key={"withdraw"}
      >
        Confirm
      </Button>,
    ],
    textInput: "Enter Amount in USDC",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
