import React from "react";
import { ARBSEP_USDC_CONTRACT } from "~~/helpers/config";
import { useUSDCBalance } from "~~/hooks/useUSDCBalance";

const USDCBalance = () => {
  const { balance, isLoading, error } = useUSDCBalance(ARBSEP_USDC_CONTRACT);

  if (isLoading) {
    return <div>Loading balance...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <div className="text-xl">Wallet {parseFloat(balance).toFixed(2)} USDC</div>;
};

export default USDCBalance;
