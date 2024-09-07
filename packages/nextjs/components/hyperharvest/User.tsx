import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "../SignInButton";
import { Address, Balance } from "../scaffold-eth";
import { COREKIT_STATUS } from "@web3auth/mpc-core-kit";
import { useWeb3Auth } from "~~/context/Web3Context";
import { getPublicKey } from "~~/helpers/getPublicKey";
import { getWeb3AuthInstance } from "~~/helpers/web3Auth";

interface Transaction {
  id: string;
  amount: string;
  date: string;
}

const User = () => {
  const {
    user,
    provider,
    userAddresses,
    signInWithJWT,
    signInWithGoogle,
    logout,
    loading: initLoading,
  } = useWeb3Auth();
  // states
  const [coreInstance, setCoreInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pubKey, setPubKey] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      if (!user) {
        return <div>Please sign in</div>;
      }

      try {
        const instance = await getWeb3AuthInstance();
        setCoreInstance(instance);

        if (!coreInstance) {
          console.error("Cannot initialize dashboard: coreInstance is null");
          return;
        }
        if (coreInstance.state !== COREKIT_STATUS.LOGGED_IN) {
          setLoading(false);
          setError("User is not logged in.");
          return;
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error initializing dashboard:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    initUser();
  }, [user, provider]);

  useEffect(() => {
    if (!coreInstance) {
      console.error("Cannot initialize User: coreInstance is null");
      return;
    }
    const fetchPubKey = async () => {
      if (!coreInstance || coreInstance.state !== COREKIT_STATUS.LOGGED_IN) {
        console.warn("Core instance is not initialized or user is not logged in");
        return;
      }

      try {
        const key = await getPublicKey(coreInstance);
        console.log("Public Key:", key);
        setPubKey(key);
      } catch (err) {
        console.error("Error fetching public key:", err);
      }
    };

    fetchPubKey();
  }, [coreInstance]);

  // const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
  //   try {
  //     await signIn("credentials", {
  //       message: res.message,
  //       signature: res.signature,
  //       redirect: false,
  //     });
  //     const response = await fetch("/api/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userData: res }),
  //     });
  //     const data = await response.json();
  //     const { token } = data;
  //     await signInWithJWT(token, "farcaster");
  //   } catch (error) {
  //     console.error("Login failed", error);
  //     setError("Login failed");
  //   }
  // }, []);

  // const getNonce = useCallback(async () => {
  //   try {
  //     const nonce = await getCsrfToken();
  //     // console.log("Generated nonce:", nonce);
  //     if (!nonce) throw new Error("Unable to generate nonce");
  //     return nonce;
  //   } catch (error) {
  //     console.error("Error generating nonce:", error);
  //     throw error;
  //   }
  // }, []);

  if (!user || !user.name || !userAddresses?.[0]) {
    return (
      <div className="text-center flex flex-col justify-center items-center">
        <GoogleSignInButton loading={initLoading} signInWithGoogle={signInWithGoogle} />
      </div>
    );
  }

  return (
    <div className="flex mr-4 md:mr-0 justify-end lg:w-[33%] text-center">
      <section className="w-full max-w-sm">
        <div className="flex items-center">
          <div className="flex items-center w-full">
            <div className="flex items-center">
              <div className="p-4 rounded-lg flex">
                <div className="flex">
                  <Balance className="hidden lg:flex" address={userAddresses[0]} />
                  <Address address={userAddresses[0]} />
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="avatar online">
                <div className="w-8 h-8 rounded-full ml-4 lg:mr-auto overflow-hidden">
                  {user.picture ? (
                    <Image
                      src={user.picture as any}
                      width={100}
                      height={100}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-lg">
                      ?
                    </div>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default User;
