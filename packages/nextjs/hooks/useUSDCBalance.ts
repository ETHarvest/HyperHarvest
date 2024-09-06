import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { erc20Abi, formatUnits } from "viem";
import { useWeb3Auth } from "~~/context/Web3Context";

export const useUSDCBalance = (contractAddress: string) => {
  const { publicClient, userAddresses } = useWeb3Auth();
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (publicClient && userAddresses && userAddresses[0]) {
          const usdcBalanceBigInt = await readContract(publicClient, {
            address: contractAddress,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [userAddresses[0]],
          });
          setBalance(formatUnits(usdcBalanceBigInt, 6));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError("Failed to fetch balance. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userAddresses && userAddresses.length > 0) {
      fetchBalance();
    }
  }, [publicClient, userAddresses, contractAddress]);

  return { balance, isLoading, error };
};
