import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { formatUnits } from "viem";
import { erc20Abi } from "viem";
import { useWeb3Auth } from "~~/context/Web3Context";

export const useHHUSDCBalance = (usdcContractAddress: string, hhContractAddress: string) => {
  const { publicClient } = useWeb3Auth();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (publicClient && hhContractAddress && usdcContractAddress) {
          const hhUSDCBalanceBigInt = await readContract(publicClient, {
            address: usdcContractAddress,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [hhContractAddress],
          });
          setBalance(formatUnits(hhUSDCBalanceBigInt, 6));
        }
      } catch (error) {
        console.error("Error fetching HH contract balance:", error);
        setError("Failed to fetch balance. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [publicClient, usdcContractAddress, hhContractAddress]);

  return { balance, isLoading, error };
};
