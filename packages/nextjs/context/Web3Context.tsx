// Web3Context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { EthereumSigningProvider } from "@web3auth/ethereum-mpc-provider";
import { COREKIT_STATUS, UserInfo, makeEthereumSigner, parseToken } from "@web3auth/mpc-core-kit";
import { signOut } from "next-auth/react";
import { WalletClient, createPublicClient, createWalletClient, custom } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { chainConfig, googleVerifierConfig, verifier } from "~~/helpers/config";
import { getWeb3AuthInstance } from "~~/helpers/web3Auth";

let client: any;

type Web3AuthContextType = {
  loading: boolean;
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  signInWithGoogle: () => Promise<void>;
  signInWithJWT: (idToken: string, loginType: "farcaster" | "google") => Promise<void>;
  logout: () => Promise<void>;
  provider: EthereumSigningProvider | null;
  sendTransaction: (to: string, value: bigint) => Promise<any>;
  signMessage: (message: string) => Promise<string>;
  userAddresses: string[];
  publicClient: any;
  walletClient: WalletClient | null;
};

const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicClient, setPublicClient] = useState<ReturnType<typeof createPublicClient> | null>(null);
  const [provider, setProvider] = useState<EthereumSigningProvider | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [userAddresses, setUserAddresses] = useState<string[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3AuthInstance = await getWeb3AuthInstance();

        if (web3AuthInstance.status === COREKIT_STATUS.LOGGED_IN) {
          const userInfo = web3AuthInstance.getUserInfo();
          setUser(userInfo);

          const evmProvider = new EthereumSigningProvider({ config: { chainConfig } });
          await evmProvider.setupProvider(makeEthereumSigner(web3AuthInstance));

          setProvider(evmProvider);
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };

    initWeb3Auth();
  }, []);

  useEffect(() => {
    if (provider) {
      const client = createWalletClient({
        chain: arbitrumSepolia,
        transport: custom(provider),
      });
      setWalletClient(client);

      const pubClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: custom(provider),
      });
      setPublicClient(pubClient);
    }
  }, [provider]);

  const fetchAddresses = async () => {
    try {
      if (!provider || !walletClient) throw new Error("Ethereum provider or wallet client not initialized");
      const accounts = await walletClient.getAddresses();
      if (accounts.length === 0) throw new Error("No accounts found. Please connect a wallet.");
      setUserAddresses(accounts);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (provider && walletClient) {
      fetchAddresses();
    }
  }, [provider, walletClient]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const web3AuthInstance = await getWeb3AuthInstance();
      await web3AuthInstance.loginWithOAuth(googleVerifierConfig);
    } catch (error) {
      console.error("Error logging in with Google", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithJWT = async (idToken: string, loginType: "farcaster" | "google") => {
    try {
      const web3AuthInstance = await getWeb3AuthInstance();
      if (!web3AuthInstance) throw new Error("Web3Auth CoreKit not initialized");

      const subVerifier = loginType === "google" ? "google" : verifier;
      const decodedToken = parseToken(idToken);
      const verifierId = loginType === "google" ? decodedToken.email : decodedToken.sub;

      verifier &&
        (await web3AuthInstance.loginWithJWT({
          verifier,
          subVerifier,
          verifierId,
          idToken,
        }));

      if (web3AuthInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await web3AuthInstance.commitChanges();
        setUser(web3AuthInstance.getUserInfo());
        localStorage.setItem("user", JSON.stringify(web3AuthInstance.getUserInfo()));

        const evmProvider = new EthereumSigningProvider({ config: { chainConfig } });
        await evmProvider.setupProvider(makeEthereumSigner(web3AuthInstance));
        setProvider(evmProvider);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Error during JWT sign-in:", error);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const web3AuthInstance = await getWeb3AuthInstance();
      await web3AuthInstance.logout();
      // await signOut();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async (to: string, value: bigint) => {
    if (!provider || !walletClient) throw new Error("Ethereum provider or wallet client not initialized");
    if (userAddresses.length === 0) await fetchAddresses();
    if (userAddresses.length === 0) throw new Error("No accounts available");

    const account = userAddresses[0];

    try {
      const transaction = await walletClient.sendTransaction({
        chain: arbitrumSepolia,
        to,
        value,
        account,
      });
      return transaction;
    } catch (error) {
      console.error("Transaction failed with error:", error);

      throw error;
    }
  };

  const signMessage = async (): Promise<string> => {
    if (!provider) throw new Error("Ethereum provider not initialized");
    const web3AuthInstance = await getWeb3AuthInstance();
    const msg = Buffer.from("Authenticated Harvestoor");
    const signature = web3AuthInstance.sign(msg);
    console.log("sign", signature);

    return signature as any;
  };

  const switchChain = async (chainId: string) => {
    // 0xaa37dc
    try {
      if (provider) {
        await provider.switchChain({ chainId });
        console.log("Switched to chain:", chainId);
      }
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        loading,
        user,
        setUser,
        signInWithGoogle,
        signInWithJWT,
        logout,
        provider,
        sendTransaction,
        signMessage,
        userAddresses,
        publicClient,
        walletClient,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
