"use client";

import { useEffect, useState } from "react";
import {
  COREKIT_STATUS,
  EnableMFAParams,
  FactorKeyTypeShareDescription,
  generateFactorKey,
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

      console.log(
        "MFA enabled, device factor stored in local store, deleted hashed cloud key, your backup factor key: ",
        factorKeyMnemonic,
      );
      console.log("MFA Enabled");
    } catch (error) {
      console.error("Error enabling MFA:", error);
    }
  };

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col space-y-4 items-center w-full text-center p-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <button className="mt-2 p-2 bg-blue-600 text-white rounded-lg" onClick={enableMFA} disabled={!coreInstance}>
        Enable MFA
      </button>

      {/* <section className="w-full max-w-md mt-6">
        <h2 className="text-xl font-semibold">Security Settings</h2>
        <button className="mt-2 p-2 bg-blue-600 text-white rounded-lg" onClick={() => coreInstance?.enableMFA({})}>
          Enable MFA
        </button>
      </section>

      <footer className="w-full max-w-md mt-6 text-gray-200">
        <p>Need help? Contact support.</p>
      </footer> */}
    </div>
  );
};

export default SettingsPage;
