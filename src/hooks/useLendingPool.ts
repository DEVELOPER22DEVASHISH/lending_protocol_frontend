import { useMemo } from "react";
import { Contract } from "ethers";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import type { InterfaceAbi } from "ethers";
import { useEthersSigner } from "./useEthersSigner";

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as `0x${string}`;

export function useLendingPool() {
  const signer = useEthersSigner();
  return useMemo(() => {
    return new Contract(LENDING_POOL_ADDRESS, LendingPoolAbi as InterfaceAbi, signer);  
  }, [signer]);
}
