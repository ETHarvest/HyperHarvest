import { useState, useRef, FormEvent, useEffect } from "react";
import { showTxnNotification } from "./Notify";
import { AddressInput, IntegerInput } from "../scaffold-eth";
import { readContract, writeContract } from "viem/actions";
import { arbitrumSepolia } from "viem/chains";
import { useWeb3Auth } from "~~/context/Web3Context";
import USDCBalance from "./USDCBalance";
import HHUSDCBalance from "./HHUSDCBalance";
import { ARBHHContractABI, ARBHHContractAddress, ARBSEP_USDC_CONTRACT } from "~~/helpers/config";
import { erc20Abi } from "viem";
import { getUserShares, getTotalSupply } from "~~/utils/contract";

const Harvest = () => {
  const { walletClient, userAddresses } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState("Deposit");
  const [amount, setAmount] = useState<any>("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userShares, setUserShares] = useState<any>(null);
  const [totalSupply, setTotalSupply] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  const handleTabChange = (tab: string) => setActiveTab(tab);

  const validateInputs = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Invalid amount.");
      return false;
    }
    return true;
  };

  const openModal = () => {
    setStatus(null);
    if (!walletClient) {
      setStatus("Please reconnect your wallet and try again.");
      return;
    }

    if (!validateInputs()) return;

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleApprove = async (amount: bigint) => {
    try {
      const approvalTx = await writeContract(walletClient!, {
        address: ARBSEP_USDC_CONTRACT,
        abi: erc20Abi,
        functionName: "approve",
        args: [ARBHHContractAddress, amount],
        chain: arbitrumSepolia,
        account: userAddresses[0],
      });
  
      showTxnNotification(
        "Approval successful!",
        `https://sepolia.arbiscan.io/tx/${approvalTx}`
      );
      return true; // Approval successful
    } catch (error) {
      console.error("Approval failed:", error);
      setStatus("Approval failed. Please try again.");
      return false; // Approval failed
    }
  };
  
  const handleDeposit = async (amount: bigint) => {
    try {
      const depositTx = await writeContract(walletClient!, {
        address: ARBHHContractAddress,
        abi: ARBHHContractABI,
        functionName: "userDeposit",
        args: [amount],
        chain: arbitrumSepolia,
        account: userAddresses[0],
      });
  
      showTxnNotification(
        "Deposit successful!",
        `https://sepolia.arbiscan.io/tx/${depositTx}`
      );
    } catch (error) {
      console.error("Deposit failed:", error);
      setStatus("Deposit failed. Please try again.");
    }
  };
  
  const handleWithdraw = async (amount: bigint) => {
    try {
      const withdrawTx = await writeContract(walletClient!, {
        address: ARBHHContractAddress,
        abi: ARBHHContractABI,
        functionName: "userWithdraw",
        args: [amount],
        chain: arbitrumSepolia,
        account: userAddresses[0],
      });
  
      showTxnNotification(
        "Withdrawal successful!",
        `https://sepolia.arbiscan.io/tx/${withdrawTx}`
      );
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setStatus("Withdrawal failed. Please try again.");
    }
  };
  
  const handleConfirmAction = async () => {
    if (!walletClient) {
      setStatus("Wallet client is not available. Please try again.");
      return;
    }
  
    setIsLoading(true);
    try {
      const depositAmount = BigInt(Number(amount) * 1e6);
  
      if (activeTab === "Deposit") {
        const userBalance = await readContract(walletClient, {
          address: ARBSEP_USDC_CONTRACT,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [userAddresses[0]],
        });
  
        if (userBalance < depositAmount) {
          setStatus("Insufficient USDC balance.");
          setIsLoading(false);
          return;
        }
  
        const isApproved = await handleApprove(depositAmount);
        if (!isApproved) {
          setIsLoading(false);
          return;
        }
  
        await handleDeposit(depositAmount);
  
      } else if (activeTab === "Withdraw") {
        await handleWithdraw(depositAmount);
      }
  
      setStatus(`${activeTab} successful! 🎉`);
      setTimeout(closeModal, 2000);
      setRefresh(true); 
    } catch (error) {
      console.error(`${activeTab} failed:`, error);
      setStatus(`Failed to ${activeTab.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
      setRefresh(false); 
    }
  };



  useEffect(() => {
    if (walletClient && userAddresses.length) {
      getUserShares(walletClient, ARBHHContractAddress, userAddresses[0], ARBHHContractABI).then(setUserShares);
      getTotalSupply(walletClient, ARBHHContractAddress, ARBHHContractABI).then(setTotalSupply);
    }
  }, [walletClient, userAddresses, refresh]);





  return (
    <div className="w-full flex flex-col justify-center items-center h-full mt-20">
      <div className="w-full flex flex-col space-y-2 justify-center items-center">
        <div className="flex w-full mb-8 lg:mb-auto text-center justify-center lg:text-left lg:justify-end lg:pr-10">
          <div className="flex flex-col lg:items-start">
            {walletClient && userAddresses.length && (
              <>
                <HHUSDCBalance />
                <USDCBalance />
    <div>
      <p>Your Shares: {userShares ? `${userShares.toString()} HH` : 'Loading...'}</p>
      <p>Total Supply: {totalSupply ? `${totalSupply.toString()} HH` : 'Loading...'}</p>
    </div>
              </>
            )}
          </div>
        </div>
        <div role="tablist" className="tabs tabs-bordered">
          <button
            role="tab"
            className={`tab ${activeTab === "Deposit" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("Deposit")}
          >
            Deposit
          </button>
          <button
            role="tab"
            className={`tab ${activeTab === "Withdraw" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("Withdraw")}
          >
            Withdraw
          </button>
        </div>
        <div>
        </div>
        <div role="tabpanel" className="tab-content p-10 pt-28 w-full h-full flex justify-center items-center max-w-xl">
          {activeTab === "Deposit" && (
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); openModal(); }} className="flex flex-col space-y-8 w-full">
              <IntegerInput 
                disabled={!walletClient || !userAddresses.length} placeholder="Amount to Deposit" value={amount} onChange={e => setAmount(e)} />
              <button
                
                disabled={!walletClient || !userAddresses.length}                
                type="submit" 
                className="btn btn-primary">
                Deposit
              </button>
            </form>
          )}
          {activeTab === "Withdraw" && (
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); openModal(); }} className="flex flex-col space-y-8 w-full">
              <IntegerInput 
                placeholder="Amount to Withdraw" 
                value={amount} onChange={e => setAmount(e)}
                disabled={!walletClient || !userAddresses.length} 
                />
              <button 
                type="submit"
                disabled={!walletClient || !userAddresses.length}                
                className="btn btn-primary">
                Withdraw
              </button>
            </form>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-base-300 shadow-lg p-8 min-w-[30%]" ref={modalRef}>
            <h3 className="font-bold text-center text-lg">Confirm {activeTab}</h3>
            <div className="flex justify-center py-8 whitespace-nowrap space-x-4">
              {activeTab} <br /> <strong>{amount} USDC</strong><span> {activeTab === "Deposit" ? "into" : "from"} Hyper Harvest</span>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="flex space-y-2 flex-col items-center">
                  <div className="text-center">Processing...</div>
                  <progress className="progress w-56"></progress>
                </div>
              ) : (
                status && (
                  <p className={`text-${status.includes("Failed") ? "red" : "green"}-500 text-center`}>
                    {status}
                  </p>
                )
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button className="btn btn-secondary rounded-lg" onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button
                className={`btn btn-primary rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleConfirmAction}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Harvest;
