"use client";

import { ReactNode } from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Dehackpost",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo",
  chains: [mainnet, base, optimism, polygon, arbitrum, sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
