"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        Hyper Harvestooor
      </div>
    </>
  );
};

export default Home;
