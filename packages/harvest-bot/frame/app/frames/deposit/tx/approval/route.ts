import { TransactionTargetResponse, getFrameMessage } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData, parseUnits } from "viem";
import { optimismSepolia } from "viem/chains";
import { contractAddresses, USDC, USDCABI } from "@/lib/constants";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();
  // console.log(json);
  const frameMessage = await getFrameMessage(json);
  console.log(frameMessage);
  if (!frameMessage) {
    throw new Error("No frame message");
  }

  const amt = parseUnits(frameMessage.inputText?.toString() ?? "1", 6);

  const calldata = encodeFunctionData({
    abi: USDCABI,
    functionName: "approve",
    args: [contractAddresses.optimismSepolia, amt],
  });

  return NextResponse.json({
    chainId: `eip155:${optimismSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: USDCABI as Abi,
      to: USDC.optimismSepolia as `0x${string}`,
      data: calldata,
    },
  });
}
