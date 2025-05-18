import { useMemo } from "react";
import { Contract } from "ethers";
import { useEthersSigner } from "./useEthersSigner";

export function useContract(address: string, abi: any) {
  const signer = useEthersSigner();
  return useMemo(() => {
    if (!address || !abi || !signer) return null;
    return new Contract(address, abi, signer);
  }, [address, abi, signer]);
}
