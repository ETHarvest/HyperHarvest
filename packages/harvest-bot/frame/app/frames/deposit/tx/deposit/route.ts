import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData, parseUnits } from "viem";
import { optimismSepolia, arbitrumSepolia } from "viem/chains";
import { contractAddresses, USDC, contractABI } from "@/lib/constants";

interface UntrustedData {
  buttonIndex: number;
  inputText?: string;
  walletAddress: string;
  url: string;
  timestamp: number;
  state: string;
  address: string;
  network?: string;
}

interface TrustedData {
  messageBytes: string;
}

interface FrameRequest {
  untrustedData: UntrustedData;
  trustedData: TrustedData;
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

    const { untrustedData, trustedData } = json;

    if (!untrustedData || !trustedData) {
      throw new Error("Missing untrustedData or trustedData");
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
      functionName: "userDeposit",
      args: [amt],
    });

    const response = {
      chainId: `eip155:${chainConfig.chain.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: contractABI as Abi,
        to: chainConfig.contractAddress as `0x${string}`,
        data: calldata,
      },
    };

    console.log("Prepared response:", JSON.stringify(response, null, 2));

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error processing frame request:", error);
    return NextResponse.json({ error: "Failed to process frame request" }, { status: 400 });
  }
}