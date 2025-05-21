import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layouts/Dashboard";
import Modal from "../components/common/Modal";
import { parseUnits, Contract } from "ethers";
import { ASSETS } from "../constants/assets";
import LendingPoolAbi from "../constants/abi/LendingPool.json";
import { useApprove } from "../hooks/useApprove";
import { useAllowance } from "../hooks/useAllowance";
import { useAccount } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ERROR_MESSAGES, getErrorMessage } from "../components/shared/errorHandling";

const LENDING_POOL_ADDRESS = import.meta.env.VITE_LENDING_POOL_ADDRESS as string;
const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Borrow: React.FC = () => {
  const [asset, setAsset] = useState<keyof typeof ASSETS>("usdt");
  const [amount, setAmount] = useState("");
  const [collateralAsset, setCollateralAsset] = useState<keyof typeof ASSETS>("dai");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [modalError, setModalError] = useState(false);

  const { address: userAddress } = useAccount();
  const signer = useEthersSigner();

  // LendingPool contract instance (with signer)
  const [lendingPool, setLendingPool] = useState<Contract | null>(null);

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

  // const approve = useApprove(ASSETS[collateralAsset].address);
  // const allowance = useAllowance(
  //   ASSETS[collateralAsset].address,
  //   userAddress || "",
  //   LENDING_POOL_ADDRESS
  // );

  // const handleApprove = async () => {
  //   if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
  //     setModalError(true);
  //     setModalTitle("Invalid Collateral Amount");
  //     setModalMessage(ERROR_MESSAGES.zeroAmount);
  //     setModalOpen(true);
  //     return;
  //   }
  //   setLoading(true);
  //   setModalOpen(true);
  //   setModalError(false);
  //   setModalTitle("Approval in Progress");
  //   setModalMessage(ERROR_MESSAGES.walletRequest);

  //   try {
  //     console.log("[APPROVE] collateral:", ASSETS[collateralAsset].address, "amount:", collateralAmount, "user:", userAddress);
  //     await approve(
  //       LENDING_POOL_ADDRESS,
  //       parseUnits(collateralAmount, ASSETS[collateralAsset].decimals).toString()
  //     );
  //     setModalTitle("Approval Successful");
  //     setModalMessage("Collateral approved!");
  //     setModalError(false);
  //     console.log("[APPROVE] Success");
  //   } catch (e: any) {
  //     setModalTitle("Approval Failed");
  //     setModalMessage(getErrorMessage(e));
  //     setModalError(true);
  //     console.error("[APPROVE] Error:", e);
  //   }
  //   setLoading(false);
  // };

   const approve = useApprove(ASSETS[collateralAsset].address);
  const allowance = useAllowance(
    ASSETS[collateralAsset].address,
    userAddress || "",
    LENDING_POOL_ADDRESS
  );

 const handleApprove = async () => {
  // Validate collateral amount
  if (!collateralAmount || isNaN(Number(collateralAmount)) || parseFloat(collateralAmount) <= 0) {
    setModalError(true);
    setModalTitle("Invalid Collateral Amount");
    setModalMessage(ERROR_MESSAGES.zeroAmount);
    setModalOpen(true);
    return;
  }

  // Check if already approved
  if (
    BigInt(allowance || "0") >=
    parseUnits(collateralAmount, ASSETS[collateralAsset].decimals)
  ) {
    setModalError(false);
    setModalTitle("Already Approved");
    setModalMessage("You have already approved this collateral amount.");
    setModalOpen(true);
    return;
  }

  setLoading(true);
  setModalOpen(true);
  setModalError(false);
  setModalTitle("Approval in Progress");
  setModalMessage(ERROR_MESSAGES.walletRequest);

  try {
    console.log(
      "[APPROVE] collateral:",
      ASSETS[collateralAsset].address,
      "amount:",
      collateralAmount,
      "user:",
      userAddress
    );
    await approve(
      LENDING_POOL_ADDRESS,
      parseUnits(collateralAmount, ASSETS[collateralAsset].decimals).toString()
    );
    setModalTitle("Approval Successful");
    setModalMessage("Collateral approved!");
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


  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lendingPool) {
      setModalError(true);
      setModalTitle("Not Connected");
      setModalMessage(ERROR_MESSAGES.notConnected);
      setModalOpen(true);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Borrow Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Collateral Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    if (BigInt(allowance || "0") < parseUnits(collateralAmount, ASSETS[collateralAsset].decimals)) {
      setModalError(true);
      setModalTitle("Allowance Error");
      setModalMessage(ERROR_MESSAGES.allowanceError);
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Borrow in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);

    try {
      console.log("[BORROW] asset:", ASSETS[asset].address, "amount:", amount, "collateral:", ASSETS[collateralAsset].address, "collateralAmount:", collateralAmount, "user:", userAddress);
      const tx = await lendingPool.borrow(
        ASSETS[asset].address,
        parseUnits(amount, ASSETS[asset].decimals),
        ASSETS[collateralAsset].address,
        parseUnits(collateralAmount, ASSETS[collateralAsset].decimals)
      );
      setModalTitle("Borrow Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Borrow Successful");
      setModalMessage("You have borrowed successfully!");
      setModalError(false);
      console.log("[BORROW] Success", tx.hash);
    } catch (e: any) {
      setModalTitle("Borrow Failed");
      setModalMessage(getErrorMessage(e));
      setModalError(true);
      console.error("[BORROW] Error:", e);
    }
    setLoading(false);
  };

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
              min="0"
              step="any"
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
              !collateralAmount ||
              isNaN(Number(collateralAmount)) ||
              parseFloat(collateralAmount) <= 0 ||
              BigInt(allowance || "0") >= parseUnits(collateralAmount || "0", ASSETS[collateralAsset].decimals)
            }
          >
            {BigInt(allowance || "0") >= parseUnits(collateralAmount || "0", ASSETS[collateralAsset].decimals)
              ? "Approved"
              : "Approve Collateral"}
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={
              loading ||
              !amount ||
              isNaN(Number(amount)) ||
              parseFloat(amount) <= 0 ||
              !collateralAmount ||
              isNaN(Number(collateralAmount)) ||
              parseFloat(collateralAmount) <= 0 ||
              BigInt(allowance || "0") < parseUnits(collateralAmount || "0", ASSETS[collateralAsset].decimals)
            }
          >
            Borrow
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Borrow;

