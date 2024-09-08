import { useBalances } from "~~/hooks/useBalances";
import { useGlobalState } from "~~/services/store/store";

type BalanceProps = {
  address?: string;
  className?: string;
  usdMode?: boolean;
};

export const Balance = ({ address, className = "", usdMode }: BalanceProps) => {
  const { ethBalance, usdcBalance } = useBalances(address);
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const displayUsdMode = usdMode || false;

  if (!ethBalance || !usdcBalance) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  const ethBalanceInUsd = parseFloat(ethBalance) * nativeCurrencyPrice;

  return (
    <div className={`flex ${className}`}>
      <div className="text-sm">
        {parseFloat(ethBalance).toFixed(3)} {"Ξ"}
        {displayUsdMode && <span className="text-sm text-gray-500"> ({ethBalanceInUsd.toFixed(3)} USD)</span>}
      </div>
      <div className="text-sm">{parseFloat(usdcBalance).toFixed(2)} USDC</div>
    </div>
  );
};
