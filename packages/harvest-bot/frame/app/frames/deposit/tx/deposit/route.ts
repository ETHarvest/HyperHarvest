import { TransactionTargetResponse, getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData, parseEther, parseUnits } from "viem";
import { contractAddresses, contractABI } from "@/lib/constants";
import { optimismSepolia } from "viem/chains";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();
  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  const amt = parseUnits(frameMessage.inputText?.toString() ?? "1", 6);

  const calldata = encodeFunctionData({
    abi: contractABI,
    functionName: "deposit",
    args: [amt],
  });

  return NextResponse.json({
    chainId: `eip155:${optimismSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: contractABI as Abi,
      to: contractAddresses.optimismSepolia as `0x${string}`,
      data: calldata,
      value: parseEther("0.0001").toString(),
    },
  });
}