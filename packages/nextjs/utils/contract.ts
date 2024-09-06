import { readContract } from 'viem/actions';
import { formatEther } from 'viem';

export const getUserShares = async (walletClient: any, contractAddress: string, userAddress: string, contractABI: any) => {
  try {
    const userShares = await readContract(walletClient, {
      address: contractAddress,
      abi: contractABI,
      functionName: 'balanceOf',
      args: [userAddress],
    });
    return formatEther(userShares as bigint);
  } catch (error) {
    console.error('Failed to fetch user shares:', error);
    return null;
  }
};

export const getTotalSupply = async (walletClient: any, contractAddress: string, contractABI: any) => {
  try {
    const totalSupply = await readContract(walletClient, {
      address: contractAddress,
      abi: contractABI,
      functionName: 'totalSupply',
      args: []
    });
    console.log(totalSupply)
    return formatEther(totalSupply as bigint);
  } catch (error) {
    console.error('Failed to fetch total supply:', error);
    return null;
  }
};




export const previewAssetsToShares = async (
    walletClient: any,
    contractAddress: string,
    contractABI: any,
    assets: bigint
  ): Promise<string | null> => {
    try {
      const shares = await readContract(walletClient, {
        address: contractAddress,
        abi: contractABI,
        functionName: 'convertToShares',
        args: [assets],
      });
      return formatEther(shares as bigint);
    } catch (error) {
      console.error('Failed to preview assets to shares:', error);
      return null;
    }
  };
  
  export const previewSharesToAssets = async (
    walletClient: any,
    contractAddress: string,
    contractABI: any,
    shares: bigint
  ): Promise<string | null> => {
    try {
      const assets = await readContract(walletClient, {
        address: contractAddress,
        abi: contractABI,
        functionName: 'convertToAssets',
        args: [shares],
      });
      return formatEther(assets as bigint);
    } catch (error) {
      console.error('Failed to preview shares to assets:', error);
      return null;
    }
  };