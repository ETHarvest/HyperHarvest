import { FormEvent, useEffect, useRef, useState } from "react";
import { Address, IntegerInput } from "../scaffold-eth";
import HHUSDCBalance from "./HHUSDCBalance";
import { showTxnNotification } from "./Notify";
import USDCBalance from "./USDCBalance";
import { erc20Abi, parseUnits } from "viem";
import { readContract, writeContract } from "viem/actions";
import { arbitrumSepolia } from "viem/chains";
import { useWeb3Auth } from "~~/context/Web3Context";
import { ARBHHContractABI, ARBHHContractAddress, ARBSEP_USDC_CONTRACT, OPHHContractAddress } from "~~/helpers/config";
import { getTotalSupply, getUserShares, previewAssetsToShares } from "~~/utils/contract";

const Harvest = () => {
  const { walletClient, userAddresses } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState("Deposit");
  const [amount, setAmount] = useState<any>("");
  const [preview, setPreview] = useState<any>();
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

      showTxnNotification("Approval successful!", `https://sepolia.arbiscan.io/tx/${approvalTx}`);
      return true;
    } catch (error) {
      console.error("Approval failed:", error);
      setStatus("Approval failed. Please try again.");
      return false;
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

      showTxnNotification("Deposit successful!", `https://sepolia.arbiscan.io/tx/${depositTx}`);
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

      
      console.log(withdrawTx)

      showTxnNotification("Withdrawal successful!", `https://sepolia.arbiscan.io/tx/${withdrawTx}`);
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
        const withdrawAmountInWei = parseUnits(preview, 18);
        await handleWithdraw(withdrawAmountInWei);
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

  useEffect(() => {
    const delayDebounce = setTimeout( async () => {
      if (walletClient && userAddresses.length && amount && Number(amount) > 0) {
        
        await updatePreview();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [amount, activeTab]);

  const updatePreview = async () => {
    const parsedAmount = BigInt(Number(amount) * 1e6);

    try {
      let result;
      result = await previewAssetsToShares(walletClient, ARBHHContractAddress, ARBHHContractABI, parsedAmount);
        
      setPreview(result || "0");
    } catch (error) {
      console.error("Error updating preview:", error);
      setPreview("0");
    }
  };

  return (
    <div className="w-full m-auto flex flex-col justify-center items-center h-full">
      <div className="w-full flex flex-col lg:flex-row space-y-2 justify-center items-center">
        <div className="flex w-full mb-8 lg:mb-auto h-full text-center justify-center">
          <div className="flex flex-col justify-center lg:pt-20 h-full items-center w-full">
            {walletClient && userAddresses.length ? (
              <>
                <div className="w-full space-y-14 p-6 lg:pt-20 mb-8 rounded-lg">
                  <div className="mb-2 text-center">
                    <h3 className="text-2xl font-bold">Account Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* USDC Balances */}
                    <div className="border border-base-300 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">USDC Balances</h4>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <HHUSDCBalance />
                          <USDCBalance />
                        </div>
                      </div>
                    </div>

                    {/* Share Holdings */}
                    <div className="border border-base-300 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Share Holdings</h4>
                      <div className="flex flex-col space-y-10">
                        <div className="flex lg:text-lg justify-between">
                          <span className="font-medium">Your Shares</span>
                          <span>
                            {userShares ? (
                              `${userShares.toString()} HH`
                            ) : (
                              <span className="loading loading-dots loading-md"></span>
                            )}
                          </span>
                        </div>
                        <div className="flex lg:text-lg justify-between">
                          <span className="font-medium">Total Supply</span>
                          <span>
                            {totalSupply ? (
                              `${totalSupply.toString()} HH`
                            ) : (
                              <span className="loading loading-dots loading-md"></span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="border border-base-300 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-4">Contract Details</h4>
                      <div className="flex lg:text-xl flex-col space-y-10">
                        <span className="flex flex-row whitespace-nowrap justify-center">
                          <span className="lg:px-8 px-3">HH Arbitrum Address</span>
                          <Address address={ARBHHContractAddress} />
                        </span>
                        <span className="flex flex-row whitespace-nowrap justify-center">
                          <span className="lg:px-8 px-3">HH Optimism Address</span>
                          <Address disableAddressLink={true} address={OPHHContractAddress} />
                        </span>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="border border-base-300 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Performance</h4>
                      <div className="flex flex-col space-y-2">
                        <div className="flex lg:text-xl justify-between">
                          <span className="font-medium">APY</span>
                          {/* TODO: Calculate APY dynamically */}
                          <span>5.6%</span>
                        </div>
                        {/* Other performance metrics */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex lg:mt-48 flex-col items-center justify-center h-full">
                <h3 className="text-2xl text-center font-bold">Sign in to view Vault details.</h3>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full justify-center items-center lg:pt-20">
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
          <div></div>
          <div
            role="tabpanel"
            className="tab-content p-10 pt-28 w-full h-full flex justify-center items-center max-w-xl"
          >
            {activeTab === "Deposit" && (
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  openModal();
                }}
                className="flex flex-col space-y-8 w-full"
              >
                <IntegerInput
                  disabled={!walletClient || !userAddresses.length}
                  placeholder="Amount to Deposit"
                  value={amount}
                  onChange={e => setAmount(e)}
                />
                <IntegerInput
                  disabled={true}
                  placeholder="Estimated HH to receive"
                  value={preview}
                  onChange={e => setAmount(e)}
                />
                <button disabled={!walletClient || !userAddresses.length} type="submit" className="btn btn-primary">
                  Deposit
                </button>
              </form>
            )}
            {activeTab === "Withdraw" && (
              <form
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  openModal();
                }}
                className="flex flex-col space-y-8 w-full"
              >
                <IntegerInput
                  placeholder="Amount of USDC to withdraw"
                  value={amount}
                  onChange={e => setAmount(e)}
                  disabled={!walletClient || !userAddresses.length}
                />
                <IntegerInput
                  placeholder="Estimated shares to burn"
                  value={preview}
                  onChange={e => setAmount(e)}
                  disabled={true}
                />
                <button type="submit" disabled={!walletClient || !userAddresses.length} className="btn btn-primary">
                  Withdraw
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="rounded-lg relative z-10 bg-white space-y-20 shadow-lg p-8 min-w-[30%]" ref={modalRef}>
            <h3 className="font-bold text-center text-lg">Confirm {activeTab}</h3>
            <div className="flex justify-center py-8 whitespace-nowrap space-x-4">
              {activeTab} <br /> <strong>{ amount} USDC</strong>
              <span> {activeTab === "Deposit" ? "into" : "from"} Hyper Harvest</span>
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="flex space-y-2 flex-col items-center">
                  <div className="text-center">Processing...</div>
                  <progress className="progress w-56"></progress>
                </div>
              ) : (
                status && (
                  <p className={`text-${status.includes("Failed") ? "red" : "green"}-500 text-center`}>{status}</p>
                )
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button className="btn text-lg rounded-lg" onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button
                className={`btn btn-primary text-lg rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
