import { tssLib } from "@toruslabs/tss-dkls-lib";
import { UX_MODE } from "@web3auth/base";
import { COREKIT_STATUS, WEB3AUTH_NETWORK, Web3AuthMPCCoreKit } from "@web3auth/mpc-core-kit";

const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string;

let web3AuthInstance: Web3AuthMPCCoreKit | null = null;

export const getWeb3AuthInstance = async (): Promise<Web3AuthMPCCoreKit> => {
  if (!web3AuthInstance) {
    web3AuthInstance = new Web3AuthMPCCoreKit({
      web3AuthClientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.DEVNET,
      tssLib: tssLib,
      storage: window.localStorage,
      baseUrl: process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000",
      uxMode: UX_MODE.REDIRECT,
      manualSync: true,
      enableLogging: true,
      redirectPathName: "auth",
    });

    if (web3AuthInstance.status === COREKIT_STATUS.NOT_INITIALIZED) {
      await web3AuthInstance.init({ handleRedirectResult: false });
    }
  }

  return web3AuthInstance;
};
