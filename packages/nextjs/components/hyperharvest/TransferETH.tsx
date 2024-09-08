import React, { FormEvent, useRef, useState } from "react";
import { showTxnNotification } from "./Notify";
import { Address, AddressInput, EtherInput } from "../scaffold-eth";
import { isAddress, parseUnits } from "viem";
import { useWeb3Auth } from "~~/context/Web3Context";

export const TransferETH = () => {
  const { walletClient, sendTransaction } = useWeb3Auth();
  const [recipient, setRecipient] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setTransferStatus(null);

    if (!recipient || !isAddress(recipient)) {
      setTransferStatus("Invalid recipient address.");
      return;
    }

    if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      setTransferStatus("Invalid value. Please enter a positive number.");
      return;
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    openModal();
  };

  const handleConfirmTransfer = async () => {
    if (!walletClient) {
      setTransferStatus("Wallet client is not available. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const txResponse = await sendTransaction(recipient, parseUnits(value, 18));

      const txHash = txResponse;
      setTransferStatus("Transfer successful! 🎉");
      showTxnNotification(`Transaction successful`, `https://sepolia.arbiscan.io/tx/${txHash}`);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("Transfer failed 😔:", error);
      setTransferStatus("Failed to transfer ETH. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center items-center flex-col space-y-4 p-4">
      <div className="min-h-10">
        {transferStatus && <div className="mt-4 italic text-center">{transferStatus}</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8 w-full">
        <AddressInput
          placeholder="Recipient address"
          value={recipient}
          onChange={e => setRecipient(e)}
          disabled={!walletClient || isLoading}
        />
        <EtherInput 
          placeholder="Value in ETH" 
          value={value} 
          onChange={e => setValue(e)}
          disabled={!walletClient || isLoading}
          />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!walletClient || isLoading}
          >
          {isLoading ? "Sending..." : "Transfer"}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-base-300 shadow-lg p-8 w-fit" ref={modalRef}>
            <h3 className="font-bold text-center text-lg">Confirm Transfer</h3>
            <div className="flex py-8 whitespace-nowrap space-x-4">
              Sending <br /> <strong>{value} ETH </strong>
              <span>to</span>
              <Address address={recipient} />
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="flex space-y-2 flex-col items-center">
                  <div className="text-center">Processing...</div>
                  <progress className="progress w-56"></progress>
                </div>
              ) : (
                transferStatus && (
                  <p className={`text-${transferStatus.includes("Failed") ? "red" : "green"}-500 text-center`}>
                    {transferStatus}
                  </p>
                )
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button
                className={`btn btn-primary rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleConfirmTransfer}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
