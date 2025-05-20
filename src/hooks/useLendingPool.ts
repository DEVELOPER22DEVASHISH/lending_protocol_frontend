import { useMemo } from "react";
import { Contract } from "ethers";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import type { InterfaceAbi } from "ethers";
import { useEthersSigner } from "./useEthersSigner";

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as `0x${string}`;

// export function useLendingPool() {
//   const signer = useEthersSigner();
//   return useMemo(() => {
//     return new Contract(LENDING_POOL_ADDRESS, LendingPoolAbi as InterfaceAbi, signer);  
//   }, [signer]);
// }

export function useLendingPool() {
  const signer = useEthersSigner();
  console.log(signer, "signer");

  return useMemo(() => {
    // if (!signer) {
    //   return undefined;
    // }

    const contract = new Contract(
      LENDING_POOL_ADDRESS,
      LendingPoolAbi as InterfaceAbi,
      signer
    );
  console.log(contract, "contract address");
    //  console.log("[DEBUG] LendingPool signer:", contract.signer);
    console.log("[DEBUG] LendingPool contract address:", LENDING_POOL_ADDRESS);
    // console.log("[DEBUG] Contract signer address:", signer.address);

    return contract;
    // console.log(" LendingPool contract:", contract);
  }, [signer]);
}
