// src/hooks/useCollateralManager.ts
import { useMemo } from "react";
import { Contract } from "ethers";
import CollateralManagerAbi from "../constants/abi/CollateralManager.json";
import { useEthersSigner } from "./useEthersSigner";

const COLLATERAL_MANAGER_ADDRESS = import.meta.env.VITE_COLLATERAL_MANAGER_ADDRESS as `0x${string}`;

export function useCollateralManager() {
  const signer = useEthersSigner();
  return useMemo(() => {
    return new Contract(COLLATERAL_MANAGER_ADDRESS, CollateralManagerAbi, signer);
  }, [signer]);
}
