import React, { useEffect, useState, useCallback } from "react";
import { Contract, formatUnits, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { ASSETS } from "../constants/assets";
import ERC20Abi from "../constants/abi/ERC20.json";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { ERROR_MESSAGES, getErrorMessage } from "../components/shared/errorHandling";

const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Dashboard: React.FC = () => {
  const signer = useEthersSigner();
  const { address: userAddress } = useAccount();

  // UI state
  const [deposits, setDeposits] = useState<{ [symbol: string]: string }>({});
  const [borrows, setBorrows] = useState<{ [symbol: string]: string }>({});
  const [healthFactor, setHealthFactor] = useState<string>("N/A");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const [modalError, setModalError] = useState(false);

  // Deposit/withdraw/borrow/repay UI
  const [depositAsset, setDepositAsset] = useState<keyof typeof ASSETS>("dai");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAsset, setWithdrawAsset] = useState<keyof typeof ASSETS>("dai");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [borrowAsset, setBorrowAsset] = useState<keyof typeof ASSETS>("usdt");
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [repayAsset, setRepayAsset] = useState<keyof typeof ASSETS>("usdt");
  const [repayAmount, setRepayAmount] = useState<string>("");

  // Helper: create a dynamic contract instance
  const getContract = useCallback(
    (address: string, abi: any) => {
      if (!signer || !address) return null;
      try {
        return new Contract(address, abi, signer);
      } catch (err) {
        console.error("Failed to create contract instance:", err);
        return null;
      }
    },
    [signer]
  );

  // Fetch user balances for all assets
  const fetchBalances = useCallback(async () => {
    if (!userAddress || !signer) return;
    setLoading(true);
    const depositsTemp: { [symbol: string]: string } = {};
    const borrowsTemp: { [symbol: string]: string } = {};

    for (const key of assetKeys) {
      const asset = ASSETS[key];
      const lToken = getContract(asset.lToken.address, asset.lToken.abi);
      const debtToken = getContract(asset.debtToken.address, asset.debtToken.abi);

      try {
        let lBal = 0n;
        if (lToken) lBal = await lToken.balanceOf(userAddress);
        depositsTemp[asset.symbol] = formatUnits(lBal, asset.decimals);

        let dBal = 0n;
        if (debtToken) dBal = await debtToken.balanceOf(userAddress);
        borrowsTemp[asset.symbol] = formatUnits(dBal, asset.decimals);
      } catch (err) {
        depositsTemp[asset.symbol] = "0.00";
        borrowsTemp[asset.symbol] = "0.00";
      }
    }

    setDeposits(depositsTemp);
    setBorrows(borrowsTemp);
    setLoading(false);
  }, [userAddress, signer, getContract]);

  useEffect(() => {
    fetchBalances();
  }, [userAddress, signer, fetchBalances]);

  // Dummy health factor (expand as needed)
  useEffect(() => {
    // You can implement a real health factor by calling your protocol's method
    setHealthFactor("N/A");
  }, [deposits, borrows]);

  // ========== ACTIONS ==========

  // Approve asset for LendingPool (generic for deposit, repay, etc.)
  const handleApprove = async (assetKey: keyof typeof ASSETS, amt: string) => {
    const asset = ASSETS[assetKey];
    const erc20 = getContract(asset.address, ERC20Abi);
    if (!erc20 || !userAddress) return;
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Approval in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);
    try {
      const tx = await erc20.approve(
        asset.lToken.address, // Or your LendingPool address if needed
        parseUnits(amt, asset.decimals)
      );
      await tx.wait();
      setModalTitle("Approval Successful");
      setModalMessage(`${asset.symbol} approved!`);
      setModalError(false);
    } catch (err: any) {
      setModalTitle("Approval Failed");
      setModalMessage(getErrorMessage(err));
      setModalError(true);
    }
    setLoading(false);
  };

  // Deposit
  const handleDeposit = async () => {
    const asset = ASSETS[depositAsset];
    const lendingPool = getContract(import.meta.env.VITE_LENDING_POOL_ADDRESS, asset.lToken.abi);
    if (!lendingPool || !userAddress) return;
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Deposit in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);
    try {
      await handleApprove(depositAsset, depositAmount);
      const tx = await lendingPool.deposit(
        asset.address,
        parseUnits(depositAmount, asset.decimals)
      );
      setModalTitle("Deposit Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Deposit Successful");
      setModalMessage(`Deposited ${depositAmount} ${asset.symbol}!`);
      setModalError(false);
      setDepositAmount("");
      await fetchBalances();
    } catch (err: any) {
      setModalTitle("Deposit Failed");
      setModalMessage(getErrorMessage(err));
      setModalError(true);
    }
    setLoading(false);
  };

  // Withdraw
  const handleWithdraw = async () => {
    const asset = ASSETS[withdrawAsset];
    const lendingPool = getContract(import.meta.env.VITE_LENDING_POOL_ADDRESS, asset.lToken.abi);
    if (!lendingPool || !userAddress) return;
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Withdraw in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);
    try {
      const tx = await lendingPool.withdraw(
        asset.address,
        parseUnits(withdrawAmount, asset.decimals)
      );
      setModalTitle("Withdraw Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Withdraw Successful");
      setModalMessage(`Withdrew ${withdrawAmount} ${asset.symbol}!`);
      setModalError(false);
      setWithdrawAmount("");
      await fetchBalances();
    } catch (err: any) {
      setModalTitle("Withdraw Failed");
      setModalMessage(getErrorMessage(err));
      setModalError(true);
    }
    setLoading(false);
  };

  // Borrow
  const handleBorrow = async () => {
    const asset = ASSETS[borrowAsset];
    const lendingPool = getContract(import.meta.env.VITE_LENDING_POOL_ADDRESS, asset.debtToken.abi);
    if (!lendingPool || !userAddress) return;
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Borrow in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);
    try {
      const tx = await lendingPool.borrow(
        asset.address,
        parseUnits(borrowAmount, asset.decimals)
      );
      setModalTitle("Borrow Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Borrow Successful");
      setModalMessage(`Borrowed ${borrowAmount} ${asset.symbol}!`);
      setModalError(false);
      setBorrowAmount("");
      await fetchBalances();
    } catch (err: any) {
      setModalTitle("Borrow Failed");
      setModalMessage(getErrorMessage(err));
      setModalError(true);
    }
    setLoading(false);
  };

  // Repay
  const handleRepay = async () => {
    const asset = ASSETS[repayAsset];
    const lendingPool = getContract(import.meta.env.VITE_LENDING_POOL_ADDRESS, asset.debtToken.abi);
    if (!lendingPool || !userAddress) return;
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      setModalError(true);
      setModalTitle("Invalid Amount");
      setModalMessage(ERROR_MESSAGES.zeroAmount);
      setModalOpen(true);
      return;
    }
    setLoading(true);
    setModalOpen(true);
    setModalError(false);
    setModalTitle("Repay in Progress");
    setModalMessage(ERROR_MESSAGES.walletRequest);
    try {
      await handleApprove(repayAsset, repayAmount);
      const tx = await lendingPool.repay(
        asset.address,
        parseUnits(repayAmount, asset.decimals)
      );
      setModalTitle("Repay Submitted");
      setModalMessage("Waiting for confirmation...");
      await tx.wait();
      setModalTitle("Repay Successful");
      setModalMessage(`Repaid ${repayAmount} ${asset.symbol}!`);
      setModalError(false);
      setRepayAmount("");
      await fetchBalances();
    } catch (err: any) {
      setModalTitle("Repay Failed");
      setModalMessage(getErrorMessage(err));
      setModalError(true);
    }
    setLoading(false);
  };

  // ========== UI ==========

  return (
    <div>
      <Modal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        isError={modalError}
      />
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Your Deposits</h2>
          {assetKeys.map((key) => (
            <div key={key} className="flex justify-between items-center p-2">
              <span>{ASSETS[key].symbol}:</span>
              <span>{deposits[ASSETS[key].symbol] || "0.00"}</span>
            </div>
          ))}
          <form className="mt-4 flex gap-2 items-center" onSubmit={e => { e.preventDefault(); handleDeposit(); }}>
            <select
              className="border rounded p-1"
              value={depositAsset}
              onChange={e => setDepositAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
            <Button type="submit" disabled={loading}>Deposit</Button>
            <Button
              type="button"
              primary={false}
              disabled={loading}
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
            <select
              className="border rounded p-1"
              value={withdrawAsset}
              onChange={e => setWithdrawAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
          </form>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Your Borrows</h2>
          {assetKeys.map((key) => (
            <div key={key} className="flex justify-between items-center p-2">
              <span>{ASSETS[key].symbol}:</span>
              <span>{borrows[ASSETS[key].symbol] || "0.00"}</span>
            </div>
          ))}
          <div className="flex justify-between items-center p-2">
            <span>Health Factor:</span>
            <span>{healthFactor}</span>
          </div>
          <form className="mt-4 flex gap-2 items-center" onSubmit={e => { e.preventDefault(); handleBorrow(); }}>
            <select
              className="border rounded p-1"
              value={borrowAsset}
              onChange={e => setBorrowAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={borrowAmount}
              onChange={e => setBorrowAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
            <Button type="submit" disabled={loading}>Borrow</Button>
            <Button
              type="button"
              primary={false}
              disabled={loading}
              onClick={handleRepay}
            >
              Repay
            </Button>
            <select
              className="border rounded p-1"
              value={repayAsset}
              onChange={e => setRepayAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={repayAmount}
              onChange={e => setRepayAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
          </form>
        </div>
      </div>
      {loading && <div className="text-gray-500">Processing transaction...</div>}
    </div>
  );
};

export default Dashboard;
