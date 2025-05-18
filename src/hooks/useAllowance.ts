import { useEffect, useState } from "react";
import { useContract } from "./useAssetsContract";
import ERC20Abi from "../constants/abi/ERC20.json";

export function useAllowance(tokenAddress: string, owner: string, spender: string) {
  const [allowance, setAllowance] = useState("0");
  const token = useContract(tokenAddress, ERC20Abi);

  useEffect(() => {
    if (!token || !owner || !spender) return;
    token.allowance(owner, spender).then((result: any) => setAllowance(result.toString()));
  }, [token, owner, spender]);

  return allowance;
}
