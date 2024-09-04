import { ethers } from "ethers";

const NETWORK_FEE_USD = 0.25; // $0.25 for non-Ethereum lanes
const TOKEN_TRANSFER_PERCENTAGE = 0.0007; // 0.07% for Lock and Unlock mechanism

async function getGasPrice(provider) {
  const gasPrice = await provider.getGasPrice();
  console.log(gasPrice,"gasPrice");
  console.log(ethers.utils.formatUnits(gasPrice,"gwei"));
  return ethers.utils.formatUnits(gasPrice, "gwei");
}

export async function calculateGasCost(sourceChain, destinationChain, amount, message = "") {
  
  const providers = {
    arbitrumSepolia: new ethers.providers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/5f9zacTEOkutNClq-CFgyuL6YzL44G8p"),
    optimismSepolia: new ethers.providers.JsonRpcProvider("https://opt-sepolia.g.alchemy.com/v2/5f9zacTEOkutNClq-CFgyuL6YzL44G8p"),
  };

  const sourceGasPrice = await getGasPrice(providers[sourceChain]);
  const destGasPrice = await getGasPrice(providers[destinationChain]);

  // Estimate gas usage (these are rough estimates and should be adjusted based on actual usage)
  const baseGas = 100000; // Base gas for the transaction
  const tokenTransferGas = 50000; // Additional gas for token transfer
  const messageGas = message ? message.length * 68 : 0; // 68 gas per byte of message

  const totalGas = baseGas + tokenTransferGas + messageGas;

  // Calculate execution cost
  const executionCost = totalGas * destGasPrice * 1.5; // 1.5 as gas multiplier for Smart Execution

  // Calculate network fee
  const networkFee = NETWORK_FEE_USD;

  // Calculate token transfer fee
  const tokenTransferFee = amount * TOKEN_TRANSFER_PERCENTAGE;

  // Total cost in USD
  const totalCostUSD = executionCost / 1e9 * 2000 + networkFee + tokenTransferFee; // Assuming 1 ETH = $2000
  console.log(totalCostUSD,"totalCostUsd");
  return {
    [sourceChain]: totalCostUSD,
    [destinationChain]: totalCostUSD,
  };
}


export const getStrategy = {
    yieldThreshold: 0.005, // 0.5% minimum yield difference to consider moving
    minYield: 0.02, // 2% minimum yield to stay on a chain
    gasThreshold: 0.001, // 0.1% of total assets as max acceptable gas cost
    minTimeBeforeMove: 7 * 24 * 60 * 60, // 7 days in seconds
    maxMoves: 2, // Maximum number of moves per month
};
