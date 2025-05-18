import { useContract } from "./useAssetsContract";
import ERC20Abi from "../constants/abi/ERC20.json";

export function useApprove(tokenAddress: string) {
  const token = useContract(tokenAddress, ERC20Abi);
  return async (spender: string, amount: string) => {
    if (!token) throw new Error("Token contract not found");
    const tx = await token.approve(spender, amount);
    await tx.wait();
    return tx;
  };
}
