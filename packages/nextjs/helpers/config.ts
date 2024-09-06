import { CHAIN_NAMESPACES } from "@web3auth/base";
import { SubVerifierDetailsParams } from "@web3auth/mpc-core-kit";
import externalContracts from "~~/contracts/externalContracts";

export const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: process.env.NEXT_PUBLIC_SIWE_URI || "http://localhost:3000/",
  domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000",
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



export const DEFAULT_CHAIN_ID = 421614;
export const  OP_CHAIN_ID = 11155420;
export const ARBSEP_USDC_CONTRACT = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
export const OPSEP_USDC_CONTRACT = "0x5fd84259d66Cd46123540766Be93DFE6D43130D7";

export const ARBHHContractAddress = externalContracts[421614].HyperHarvest.address
export const ARBHHContractABI = externalContracts[421614].HyperHarvest.abi
export const OPHHContractAddress = externalContracts[11155420].HyperHarvest.address
export const OPHHContractABI = externalContracts[11155420].HyperHarvest.abi