import { ethers } from "ethers";


const DECIMALS = 6;
const DECIMAL_FACTOR = ethers.BigNumber.from(10).pow(DECIMALS);
// ABI for the HyperHarvest contract (only including the functions we need)
export const hyperHarvestABI = [
  "function totalAssets() public view returns (uint256)",
  "function i_tokenAddr() public view returns (address)",
];


// ABI for ERC20 token (only including the functions we need)
export const erc20ABI = [
  "function balanceOf(address account) external view returns (uint256)",
];

// HyperHarvest contract addresses 
export const hyperHarvestAddresses = {
  arbitrumSepolia: "0x72e9cf272dab6d97fdb48acbbe67b5b2689f9f91", 
  optimismSepolia: "0x4cc6cc3a8dbb06e637ca78d93544ccaef2fa1954",
};

// AAVE Pool addresses 
export const _atokenAddresses = {
  arbitrumSepolia: "0x460b97BD498E1157530AEb3086301d5225b91216", 
  optimismSepolia: "0xa818F1B57c201E092C4A2017A91815034326Efd1", 
};

// RPC URLs 
export const rpcUrls = {
  arbitrumSepolia: "https://arb-sepolia.g.alchemy.com/v2/5f9zacTEOkutNClq-CFgyuL6YzL44G8p",
  optimismSepolia: "https://opt-sepolia.g.alchemy.com/v2/5f9zacTEOkutNClq-CFgyuL6YzL44G8p",
};

export const chainParams = {
    arbitrum: {
      receiver: '0x72e9cf272dab6d97fdb48acbbe67b5b2689f9f91',
      destinationChainSelector: '3478487238524512106',
    },
    optimism: {
      receiver: '0x4cc6cc3a8dbb06e637ca78d93544ccaef2fa1954',
      destinationChainSelector: '5224473277236331295',
    },
  };

async function getATokenBalance(chain) {
    console.log(rpcUrls[chain]);
  const provider = new ethers.providers.JsonRpcProvider(rpcUrls[chain]);
  
  const hyperHarvestContract = new ethers.Contract(hyperHarvestAddresses[chain], hyperHarvestABI, provider);

  const aTokenAddress = _atokenAddresses[chain];

  // Create contract instance for aToken
  const aTokenContract = new ethers.Contract(aTokenAddress, erc20ABI, provider);

  // Get aToken balance of HyperHarvest contract
  const aTokenBalance = await aTokenContract.balanceOf(hyperHarvestAddresses[chain]);

  return aTokenBalance.div(DECIMAL_FACTOR).toNumber();
}

export async function getArbitrumATokenBalance() {
  return getATokenBalance("arbitrumSepolia");
}

export async function getOptimismATokenBalance() {
  return getATokenBalance("optimismSepolia");
}

export async function getTotalAssets(chain) {

  const provider = new ethers.providers.JsonRpcProvider(rpcUrls[chain]);
  const hyperHarvestContract = new ethers.Contract(hyperHarvestAddresses[chain], hyperHarvestABI, provider);

  const totalAssets = await hyperHarvestContract.totalAssets();
  return totalAssets;
}