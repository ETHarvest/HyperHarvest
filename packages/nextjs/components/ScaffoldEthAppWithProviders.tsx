"use client";

import { use, useEffect, useState } from "react";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import SessionProvider from "~~/components/SessionProvider";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { Web3AuthProvider } from "~~/context/Web3Context";
import { config } from "~~/helpers/config";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col bg-white min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const fetchSessionData = async () => {
  const response = await fetch("/api/auth/session");
  const data = await response.json();
  return data;
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [session, setSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchSession = async () => {
      try {
        const sessionData = await fetchSessionData();
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to fetch session data", error);
      }
    };

    fetchSession();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />

        <SessionProvider session={session}>
          <Web3AuthProvider>
            <AuthKitProvider config={config}>
              <RainbowKitProvider
                avatar={BlockieAvatar}
                theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
              >
                <ScaffoldEthApp>{children}</ScaffoldEthApp>
              </RainbowKitProvider>
            </AuthKitProvider>
          </Web3AuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
