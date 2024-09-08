"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COREKIT_STATUS } from "@web3auth/mpc-core-kit";
import { useWeb3Auth } from "~~/context/Web3Context";
import { getWeb3AuthInstance } from "~~/helpers/web3Auth";

const getHashParams = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return {
    idToken: params.get("id_token"),
  };
};

const Auth = () => {
  const router = useRouter();
  const { signInWithJWT, setUser } = useWeb3Auth();
  const [web3AuthInstance, setWeb3AuthInstance] = useState<any>();
  const [idToken, setIdToken] = useState<any>();

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3AuthInstance = await getWeb3AuthInstance();

        if (web3AuthInstance.status === COREKIT_STATUS.LOGGED_IN) {
          const userInfo = await web3AuthInstance.getUserInfo();
          setUser(userInfo);
          router.push("/harvest");
          return;
        }

        web3AuthInstance.status === COREKIT_STATUS.INITIALIZED && setWeb3AuthInstance(web3AuthInstance);
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
      }
    };
    initWeb3Auth();
  }, []);

  useEffect(() => {
    const { idToken } = getHashParams();
    if (idToken) {
      setIdToken(idToken);
    } else {
      console.log("No id_token found in URL hash");
    }
  }, []);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (web3AuthInstance && idToken) {
        try {
          if (web3AuthInstance.status === COREKIT_STATUS.INITIALIZED) {
            await signInWithJWT(idToken, "google");
            router.push("/manage");
          } else {
            console.error("Web3Auth instance is not initialized.");
          }
        } catch (error) {
          console.error("Error handling redirect result:", error);
        }
      }
    };

    handleAuthRedirect();
  }, [web3AuthInstance, idToken, router]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center my-auto">
      <p className="text-center text-lg italic">Authenticating... Please wait.</p>
      <progress className="progress w-56"></progress>
    </div>
  );
};

export default Auth;
