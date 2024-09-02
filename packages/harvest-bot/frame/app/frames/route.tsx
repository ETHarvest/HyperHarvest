import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {

  return {
    image: "https://i.postimg.cc/KvhmX4bx/img.png",
    buttons: [
      <Button
        action='post'
        target={`/deposit`}
        key={"deposit"}
      >
        Deposit
      </Button>,
      <Button
        action='post'
        target={`/withdraw`}
        key={"withdraw"}
      >
        Withdraw
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
