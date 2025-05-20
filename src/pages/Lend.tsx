import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/Dashboard";
import Modal from "../components/common/Modal";
import { Contract, parseUnits } from "ethers";
import { ASSETS } from "../constants/assets";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import { useApprove } from "../hooks/useApprove";
import { useAllowance } from "../hooks/useAllowance";
import { useAccount } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ERROR_MESSAGES, getErrorMessage } from "../components/shared/errorHandling";

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as string;
const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Lend = () => {
  const [asset, setAsset] = useState<keyof typeof ASSETS>("usdt");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [modalError, setModalError] = useState(false);

  // LendingPool contract instance state
  const [lendingPool, setLendingPool] = useState<Contract | null>(null);

  const { address: userAddress } = useAccount();
  const signer = useEthersSigner();

  // Create LendingPool contract instance when signer is available
  useEffect(() => {
    if (!signer) {
      setLendingPool(null);
      return;
    }
    try {
      const contractInstance = new Contract(
        LENDING_POOL_ADDRESS,
        LendingPoolAbi,
        signer
      );
      setLendingPool(contractInstance);
      console.log("LendingPool contract initialized:", contractInstance);
    } catch (err) {
      setLendingPool(null);
      console.error("Failed to create LendingPool contract:", err);
    }
  }, [signer]);

  // Approve logic
  const approve = useApprove(ASSETS[asset].address);
  const allowance = useAllowance(
    ASSETS[asset].address,
    userAddress || "",
    LENDING_POOL_ADDRESS
  );

  // ERC20 balance state
  const [erc20Balance, setErc20Balance] = useState<bigint>(0n);

  // Fetch ERC20 balance whenever asset, user, or signer changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!signer || !userAddress) {
        setErc20Balance(0n);
        return;
      }
      try {
        const erc20 = new Contract(
          ASSETS[asset].address,
          ["function balanceOf(address) view returns (uint256)"],
          signer
        );
        const balance: bigint = await erc20.balanceOf(userAddress);
        setErc20Balance(balance);
        console.log(`[BALANCE] ${ASSETS[asset].symbol} balance:`, balance.toString());
      } catch (err) {
        setErc20Balance(0n);
        console.error("[BALANCE] Failed to fetch ERC20 balance:", err);
      }
    };
    fetchBalance();
  }, [signer, userAddress, asset]);

  const handleApprove = async () => {
    if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Approval in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);

    try {
      const parsedAmount = parseUnits(amount, ASSETS[asset].decimals);
      console.log("[APPROVE] asset:", ASSETS[asset].address, "amount:", amount, "parsedAmount:", parsedAmount.toString(), "user:", userAddress);
      await approve(
        LENDING_POOL_ADDRESS,
        parsedAmount.toString()
      );
      setModalTitle("Approval Successful");
      setModalMessage("Asset approved for deposit!");
      setModalError(false);
      console.log("[APPROVE] Success");
    } catch (e: any) {
      setModalTitle("Approval Failed");
      setModalMessage(getErrorMessage(e));
      setModalError(true);
      console.error("[APPROVE] Error:", e);
    }
    setLoading(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lendingPool) {
      setModalError(true);
      setModalTitle("Not Connected");
      setModalMessage(ERROR_MESSAGES.notConnected);
      setModalOpen(true);
      console.error("[DEPOSIT] LendingPool contract not available");
      return;
    }
    if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      console.error("[DEPOSIT] Invalid amount:", amount);
      return;
    }
    const parsedAmount = parseUnits(amount, ASSETS[asset].decimals);

    // Check allowance
    if (BigInt(allowance || "0") < parsedAmount) {
      setModalError(true);
      setModalTitle("Allowance Error");
      setModalMessage(ERROR_MESSAGES.allowanceError);
      setModalOpen(true);
      console.error("[DEPOSIT] Allowance too low. Allowance:", allowance?.toString(), "Needed:", parsedAmount.toString());
      return;
    }

    // Check ERC20 balance
    if (erc20Balance < parsedAmount) {
      setModalError(true);
      setModalTitle("Low Token Balance");
      setModalMessage(ERROR_MESSAGES.lowTokenBalance);
      setModalOpen(true);
      console.error("[DEPOSIT] Low ERC20 balance. Balance:", erc20Balance.toString(), "Needed:", parsedAmount.toString());
      return;
    }

    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Deposit in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);

    try {
      console.log("[DEPOSIT] asset:", ASSETS[asset].address, "amount:", amount, "parsedAmount:", parsedAmount.toString(), "allowance:", allowance?.toString(), "balance:", erc20Balance.toString(), "user:", userAddress);
      const tx = await lendingPool.deposit(
        ASSETS[asset].address,
        parsedAmount
      );
      setModalTitle("Deposit Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Deposit Successful");
      setModalMessage("Your deposit was successful!");
      setModalError(false);
      console.log("[DEPOSIT] Success", tx.hash);
    } catch (e: any) {
      setModalTitle("Deposit Failed");
      setModalMessage(getErrorMessage(e));
      setModalError(true);
      console.error("[DEPOSIT] Error:", e);
    }
    setLoading(false);
  };

  // For debugging
  console.log("LENDING_POOL_ADDRESS:", LENDING_POOL_ADDRESS);
  console.log("Signer:", signer);
  console.log("LendingPool contract:", lendingPool);
  console.log("Selected asset:", asset);
  console.log("Amount:", amount);
  console.log("Allowance:", allowance?.toString());
  console.log("ERC20 Balance:", erc20Balance.toString());

  return (
    <DashboardLayout>
      <Modal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        isError={modalError}
      />
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
              min="0"
              step="any"
            />
          </div>

          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            onClick={handleApprove}
            disabled={
              loading ||
              !amount ||
              isNaN(Number(amount)) ||
              parseFloat(amount) <= 0 ||
              BigInt(allowance || "0") >= parseUnits(amount || "0", ASSETS[asset].decimals)
            }
          >
            {BigInt(allowance || "0") >= parseUnits(amount || "0", ASSETS[asset].decimals)
              ? "Approved"
              : "Approve"}
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={
              loading ||
              !amount ||
              isNaN(Number(amount)) ||
              parseFloat(amount) <= 0 ||
              BigInt(allowance || "0") < parseUnits(amount || "0", ASSETS[asset].decimals)
            }
          >
            Deposit
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Lend;

