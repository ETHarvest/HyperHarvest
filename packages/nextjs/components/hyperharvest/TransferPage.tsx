"use client";

import { useState } from "react";
import { TransferETH } from "./TransferETH";
import { TransferUSDC } from "~~/components/hyperharvest/TransferUSDC";

const TransferPage = () => {
  const [activeTab, setActiveTab] = useState("USDC");

  return (
    <div className="w-full h-full my-auto">
      <div className="w-full flex flex-col justify-center items-center">
        <div role="tablist" className="tabs tabs-bordered">
          <button
            role="tab"
            className={`tab ${activeTab === "USDC" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("USDC")}
          >
            Transfer USDC
          </button>
          <button
            role="tab"
            className={`tab ${activeTab === "ETH" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("ETH")}
          >
            Transfer ETH
          </button>
        </div>

        <div role="tabpanel" className="tab-content p-10 w-full h-full flex justify-center items-center max-w-xl">
          {activeTab === "USDC" && <TransferUSDC />}
          {activeTab === "ETH" && <TransferETH />}
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
