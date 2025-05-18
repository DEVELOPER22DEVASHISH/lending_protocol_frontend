import React, { useState } from "react";
import DashboardLayout from "../components/layouts/Dashboard";
import { parseUnits } from "ethers";
import { ASSETS } from "../constants/assets";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import ERC20Abi from "../constants/abi/ERC20.json";
import { useContract } from "../hooks/useAssetsContract";
import { useApprove } from "../hooks/useApprove";
import { useAllowance } from "../hooks/useAllowance";
import { useAccount } from "wagmi"; // or your wallet hook

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as string;
const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Lend = () => {
  const [asset, setAsset] = useState<keyof typeof ASSETS>("usdt");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { address: userAddress } = useAccount();
  const lendingPool = useContract(LENDING_POOL_ADDRESS, LendingPoolAbi);

  // Approve logic
  const approve = useApprove(ASSETS[asset].address);
  const allowance = useAllowance(
    ASSETS[asset].address,
    userAddress || "",
    LENDING_POOL_ADDRESS
  );

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approve(
        LENDING_POOL_ADDRESS,
        parseUnits(amount || "0", ASSETS[asset].decimals).toString()
      );
      alert("Asset approved for deposit!");
    } catch (e) {
      alert("Approval failed");
    }
    setLoading(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lendingPool) return;
    setLoading(true);
    try {
      const tx = await lendingPool.deposit(
        ASSETS[asset].address,
        parseUnits(amount || "0", ASSETS[asset].decimals)
      );
      await tx.wait();
      alert("Deposit successful!");
    } catch (e) {
      alert("Deposit failed");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Lend Assets</h2>
        <p className="text-gray-600">Deposit supported assets to earn interest.</p>

        <form className="space-y-4 mt-6" onSubmit={handleDeposit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={asset}
              onChange={e => setAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              placeholder="0.0"
              className="w-full border border-gray-300 p-2 rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            onClick={handleApprove}
            disabled={loading || Number(allowance) >= Number(amount)}
          >
            {Number(allowance) >= Number(amount) ? "Approved" : "Approve"}
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading || Number(allowance) < Number(amount)}
          >
            Deposit
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Lend;

