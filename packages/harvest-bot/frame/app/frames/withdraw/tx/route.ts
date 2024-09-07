import { contractABI, contractAddresses, USDC } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData, parseUnits } from "viem";
import { optimismSepolia, arbitrumSepolia } from "viem/chains";

interface UntrustedData {
  buttonIndex: number;
  inputText?: string;
  network?: string;
}

interface FrameRequest {
  untrustedData: UntrustedData;
}

interface ChainConfig {
  chain: typeof optimismSepolia | typeof arbitrumSepolia;
  contractAddress: string;
  usdcAddress: string;
}

const chainConfigs: { [key: string]: ChainConfig } = {
  "optimism-sepolia": {
    chain: optimismSepolia,
    contractAddress: contractAddresses.optimismSepolia,
    usdcAddress: USDC.optimismSepolia,
  },
  "arbitrum-sepolia": {
    chain: arbitrumSepolia,
    contractAddress: contractAddresses.arbitrumSepolia,
    usdcAddress: USDC.arbitrumSepolia,
  },
};

export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const json: FrameRequest = await req.json();
    console.log("Received JSON:", JSON.stringify(json, null, 2));

    const { untrustedData } = json;

    if (!untrustedData) {
      throw new Error("Missing untrustedData");
    }

    const chainKey = untrustedData.network || "optimism-sepolia";
    const chainConfig = chainConfigs[chainKey];

    if (!chainConfig) {
      throw new Error(`Unsupported network: ${chainKey}`);
    }

    const inputAmount = untrustedData.inputText || "1";
    const amt = parseUnits(inputAmount, 6);

    const calldata = encodeFunctionData({
      abi: contractABI,
      functionName: "userWithdraw",
      args: [amt],
    });

    return NextResponse.json({
      chainId: `eip155:${chainConfig.chain.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: contractABI as Abi,
        to: chainConfig.contractAddress as `0x${string}`,
        data: calldata,
      },
    });
  } catch (error) {
    console.error("Error in withdraw tx route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}