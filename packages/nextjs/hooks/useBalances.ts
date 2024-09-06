import { useEffect, useState } from "react";
import { Address, formatEther, formatUnits } from "viem";
import { erc20Abi } from "viem";
import { getBalance, readContract } from "viem/actions";
import { useWeb3Auth } from "~~/context/Web3Context";

type Balances = {
  ethBalance: string;
  usdcBalance: string;
};

export const useBalances = (address?: Address): Balances => {
  const { publicClient } = useWeb3Auth();
  const [ethBalance, setEthBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");

  useEffect(() => {
    const fetchBalances = async () => {
      if (address) {
        // Fetch ETH balance
        const ethBalanceBigInt = await getBalance(publicClient, { address });
        setEthBalance(formatEther(ethBalanceBigInt));

        // Fetch USDC balance
        const usdcBalanceBigInt = await readContract(publicClient, {
          address: "0x3c06e307BA6Ab81E8Ff6661c1559ce8027744AE5",
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
        });
        setUsdcBalance(formatUnits(usdcBalanceBigInt, 6));
      }
    };

    fetchBalances();

    // Optional: Set up polling or subscribe to block updates to refresh balances
    const intervalId = setInterval(fetchBalances, 15000); // Poll every 15 seconds
    return () => clearInterval(intervalId);
  }, [address, publicClient]);

  return { ethBalance, usdcBalance };
};
