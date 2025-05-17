import React from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum , polygonAmoy } from "wagmi/chains";

// 1. Configure wagmi and RainbowKit
const config = getDefaultConfig({
  appName: "DeFi Lending Protocol",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Replace with your actual project ID
  chains: [mainnet, polygon, arbitrum, polygonAmoy],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const RainbowKitWrapper: React.FC<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

export default RainbowKitWrapper;
