"use client";

import { useEffect, useState } from "react";
import {
  // COREKIT_STATUS,
  // EnableMFAParams,
  // FactorKeyTypeShareDescription,
  // generateFactorKey,
  keyToMnemonic,
} from "@web3auth/mpc-core-kit";
import { BN } from "bn.js";
import { useWeb3Auth } from "~~/context/Web3Context";
import { getWeb3AuthInstance } from "~~/helpers/web3Auth";

const SettingsPage = () => {
  const { user } = useWeb3Auth();
  const [coreInstance, setCoreInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCoreInstance = async () => {
      try {
        const instance = await getWeb3AuthInstance();
        setCoreInstance(instance);

        if (!coreInstance) {
          setError("User is not logged in.");
        }
      } catch (err: any) {
        console.error("Error initializing core instance:", err);
        setError(err.message);
      }
    };

    initCoreInstance();
  }, [user]);

  const enableMFA = async () => {
    if (!coreInstance) {
      console.error("Web3Auth CoreKit not initialized");
      return;
    }
    try {
      const factorKey = await coreInstance.enableMFA({});
      const factorKeyMnemonic = keyToMnemonic(factorKey);
      localStorage.setItem("factorKey", factorKey);
      console.log(
        "MFA enabled, device factor stored in local store, deleted hashed cloud key, your backup factor key: ",
        factorKeyMnemonic,
      );
      console.log("MFA Enabled");
    } catch (error) {
      console.error("Error enabling MFA:", error);
    }
  };

  if (!user) {
    return (
      <div className="text-red-600 w-full flex justify-center h-full text-center items-center">User not signed in.</div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 items-center w-full text-center p-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>

      <section className="w-full h-full items-center max-w-md mt-6">
        <p className=" text-red-600">You might lose your account!</p>
        <button className="mt-2 p-2 btn bg-red-700 text-white rounded-lg" onClick={enableMFA}>
          Enable MFA
        </button>
      </section>

      <footer className="w-full max-w-md mt-6 text-gray-200">
        <p>Need help? Contact support.</p>
      </footer>
    </div>
  );
};

export default SettingsPage;
