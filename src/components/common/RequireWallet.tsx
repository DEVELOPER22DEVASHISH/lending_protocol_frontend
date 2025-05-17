// src/components/common/RequireWallet.tsx
import React from "react";
import { useIsConnected } from "../../hooks/useIsConnected";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

const RequireWallet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConnected = useIsConnected();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-4xl mb-2">🔒</span>
        <p className="mb-4 text-lg font-semibold text-gray-700">
          Please connect your wallet to access the app features.
        </p>
 
      </div>
    );
  }
  return <>{children}</>;
};

export default RequireWallet;
