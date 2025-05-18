// Borrow.tsx

import React, { useState } from "react";
import DashboardLayout from "../components/layouts/Dashboard";
import { parseUnits } from "ethers";
import { ASSETS } from "../constants/assets";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import { useContract } from "../hooks/useAssetsContract";
import { useApprove } from "../hooks/useApprove";
import { useAllowance } from "../hooks/useAllowance";
import { useAccount } from "wagmi"; // or your wallet hook

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as string;
const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Borrow = () => {
  const [asset, setAsset] = useState<keyof typeof ASSETS>("usdt");
  const [amount, setAmount] = useState("");
  const [collateralAsset, setCollateralAsset] = useState<keyof typeof ASSETS>("dai");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { address: userAddress } = useAccount(); // get connected wallet address
  const lendingPool = useContract(LENDING_POOL_ADDRESS, LendingPoolAbi);

  // Approve logic
  const approve = useApprove(ASSETS[collateralAsset].address);
  const allowance = useAllowance(
    ASSETS[collateralAsset].address,
    userAddress || "",
    LENDING_POOL_ADDRESS
  );

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approve(
        LENDING_POOL_ADDRESS,
        parseUnits(collateralAmount || "0", ASSETS[collateralAsset].decimals).toString()
      );
      alert("Collateral approved!");
    } catch (e) {
      alert("Approval failed");
    }
    setLoading(false);
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lendingPool) return;
    setLoading(true);
    try {
      const tx = await lendingPool.borrow(
        ASSETS[asset].address,
        parseUnits(amount || "0", ASSETS[asset].decimals),
        ASSETS[collateralAsset].address,
        parseUnits(collateralAmount || "0", ASSETS[collateralAsset].decimals)
      );
      await tx.wait();
      alert("Borrowed successfully!");
    } catch (e) {
      alert("Borrow failed");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Borrow Assets</h2>
        <p className="text-gray-600">Use your collateral to borrow supported assets.</p>

        <form className="space-y-4 mt-6" onSubmit={handleBorrow}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset to Borrow</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Collateral Asset</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={collateralAsset}
              onChange={e => setCollateralAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Collateral Amount</label>
            <input
              type="number"
              placeholder="0.0"
              className="w-full border border-gray-300 p-2 rounded"
              value={collateralAmount}
              onChange={e => setCollateralAmount(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            onClick={handleApprove}
            disabled={loading || Number(allowance) >= Number(collateralAmount)}
          >
            {Number(allowance) >= Number(collateralAmount) ? "Approved" : "Approve Collateral"}
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading || Number(allowance) < Number(collateralAmount)}
          >
            Borrow
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Borrow;

