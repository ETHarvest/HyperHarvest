"use client";

import type { NextPage } from "next";
import HHome from "~~/components/hyperharvest/HHome";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center bg-white flex-col flex-grow">
        <HHome />
      </div>
    </>
  );
};

export default Home;
