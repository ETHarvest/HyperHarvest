import { CHAIN_NAMESPACES } from "@web3auth/base";
import { SubVerifierDetailsParams } from "@web3auth/mpc-core-kit";

export const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://localhost:3000/",
  domain: "localhost:3000",
};

export const ALCHEMY_API = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const verifier = process.env.NEXT_PUBLIC_VERIFIER;


export const googleVerifierConfig: SubVerifierDetailsParams = {
  subVerifierDetails: {
    typeOfLogin: "google",
    verifier: "google",
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
  },
};

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x66eee",
  rpcTarget: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API}`,
  displayName: "Arbitrum Sepolia",
  blockExplorerUrl: "https://sepolia.arbiscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export const opConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa37dc",
  rpcTarget: `https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API}`,
  displayName: "Optimism Sepolia",
  blockExplorerUrl: "https://sepolia-optimistic.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};
