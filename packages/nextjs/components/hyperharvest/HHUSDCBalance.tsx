import React, { useState } from "react";
import { useHHUSDCBalance } from "~~/hooks/useHHUSDCBalance";
import { ARBSEP_USDC_CONTRACT, ARBHHContractAddress, OPSEP_USDC_CONTRACT, OPHHContractAddress } from "~~/helpers/config";

const HHUSDCBalance = () => {
  const [selectedChain, setSelectedChain] = useState<"Arbitrum" | "Optimism">("Arbitrum");

  const chainConfig = {
    Arbitrum: {
      usdcContractAddress: ARBSEP_USDC_CONTRACT,
      hhContractAddress: ARBHHContractAddress,
    },
    Optimism: {
      usdcContractAddress: OPSEP_USDC_CONTRACT,
      hhContractAddress: OPHHContractAddress,
    },
  };

  const { usdcContractAddress, hhContractAddress } = chainConfig[selectedChain];
  const { balance, isLoading, error } = useHHUSDCBalance(usdcContractAddress, hhContractAddress);

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChain(event.target.value as "Arbitrum" | "Optimism");
  };

  return (
    <div className="flex flex-col items-center space-y-4">

      {isLoading ? (
        <div>...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="text-xl">
          HH Vault {parseFloat(balance).toFixed(2)} USDC
        </div>
      )}
    </div>
  );
};

export default HHUSDCBalance;
