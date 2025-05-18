import { useEffect, useState } from "react";
import { useContract } from "./useAssetsContract";
import ERC20Abi from "../constants/abi/ERC20.json";

export function useBalance(tokenAddress: string, user: string) {
  const [balance, setBalance] = useState("0");
  const token = useContract(tokenAddress, ERC20Abi);

  useEffect(() => {
    if (!token || !user) return;
    token.balanceOf(user).then((result: any) => setBalance(result.toString()));
  }, [token, user]);

  return balance;
}
