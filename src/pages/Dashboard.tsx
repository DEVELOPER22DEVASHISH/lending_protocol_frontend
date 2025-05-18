import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { ASSETS } from "../constants/assets";
import { useContract } from "../hooks/useAssetsContract";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { useCollateralManager } from "../hooks/useCollateralManager";
import { useLendingPool } from "../hooks/useLendingPool";
import { formatUnits, parseUnits } from "ethers";
import ERC20Abi from "../constants/abi/ERC20.json";

const assetKeys = Object.keys(ASSETS) as Array<keyof typeof ASSETS>;

const Dashboard: React.FC = () => {
  const signer = useEthersSigner();
  const collateralManager = useCollateralManager();
  const lendingPool = useLendingPool();

  const [userAddress, setUserAddress] = useState<string>("");
  const [deposits, setDeposits] = useState<{ [symbol: string]: string }>({});
  const [borrows, setBorrows] = useState<{ [symbol: string]: string }>({});
  const [healthFactor, setHealthFactor] = useState<string>("∞");
  const [loading, setLoading] = useState(false);

  // For modal/simple input
  const [selectedAsset, setSelectedAsset] = useState<keyof typeof ASSETS>("dai");
  const [amount, setAmount] = useState<string>("");

  // Get user address from signer
  useEffect(() => {
    const getAddress = async () => {
      if (signer) {
        const addr = await signer.getAddress();
        setUserAddress(addr);
      }
    };
    getAddress();
  }, [signer]);

  // Fetch balances
  useEffect(() => {
    if (!userAddress || !signer) return;
    setLoading(true);

    const fetchBalances = async () => {
      const depositsTemp: { [symbol: string]: string } = {};
      const borrowsTemp: { [symbol: string]: string } = {};

      for (const key of assetKeys) {
        const asset = ASSETS[key];
        const assetLTokenContract = useContract(asset.lToken.address, asset.lToken.abi);
        const assetDebtTokenContract = useContract(asset.debtToken.address, asset.debtToken.abi);

        try {
          let lBal = 0n;
          if (assetLTokenContract) {
            lBal = await assetLTokenContract.balanceOf(userAddress);
          }
          depositsTemp[asset.symbol] = formatUnits(lBal, asset.decimals);

          let dBal = 0n;
          if (assetDebtTokenContract) {
            dBal = await assetDebtTokenContract.balanceOf(userAddress);
          }
          borrowsTemp[asset.symbol] = formatUnits(dBal, asset.decimals);
        } catch (err) {
          depositsTemp[asset.symbol] = "0.00";
          borrowsTemp[asset.symbol] = "0.00";
        }
      }

      setDeposits(depositsTemp);
      setBorrows(borrowsTemp);
      setLoading(false);
    };

    fetchBalances();
  }, [userAddress, signer]);

  // Calculate health factor using CollateralManager for the first asset pair as an example
  useEffect(() => {
    if (!userAddress || !signer || !collateralManager) return;

    const calculateHealth = async () => {
      try {
        // Example: use DAI as collateral, USDC as debt
        const collateralKey = assetKeys[0];
        const debtKey = assetKeys[1];
        const collateralAsset = ASSETS[collateralKey];
        const debtAsset = ASSETS[debtKey];

        const assetLTokenContract = useContract(collateralAsset.lToken.address, collateralAsset.lToken.abi);
        const assetDebtTokenContract = useContract(debtAsset.debtToken.address, debtAsset.debtToken.abi);

        let collateralAmount = 0n;
        let debtAmount = 0n;
        if (assetLTokenContract) {
          collateralAmount = await assetLTokenContract.balanceOf(userAddress);
        }
        if (assetDebtTokenContract) {
          debtAmount = await assetDebtTokenContract.balanceOf(userAddress);
        }

        const healthy = await collateralManager.isHealthy(
          userAddress,
          collateralAsset.address,
          collateralAmount,
          debtAsset.address,
          debtAmount
        );
        setHealthFactor(healthy ? "Healthy" : "At Risk");
      } catch {
        setHealthFactor("N/A");
      }
    };

    calculateHealth();
  }, [userAddress, signer, deposits, borrows, collateralManager]);

  // ========== ACTIONS ==========

  // Approve asset for LendingPool
  const handleApprove = async (assetKey: keyof typeof ASSETS, amt: string) => {
    const asset = ASSETS[assetKey];
    const erc20 = useContract(asset.address, ERC20Abi);
    if (!erc20 || !userAddress) return;
    try {
      const tx = await erc20.approve(
        lendingPool.target, // ethers v6: .target is contract address
        parseUnits(amt, asset.decimals)
      );
      await tx.wait();
      alert(`${asset.symbol} approved for deposit/repay!`);
    } catch (err: any) {
      alert("Approval failed: " + (err?.reason || err?.message || err));
    }
  };

  // Deposit
  const handleDeposit = async () => {
    const asset = ASSETS[selectedAsset];
    if (!lendingPool || !userAddress) return;
    try {
      setLoading(true);
      await handleApprove(selectedAsset, amount);
      const tx = await lendingPool.deposit(
        asset.address,
        parseUnits(amount, asset.decimals)
      );
      await tx.wait();
      alert(`Deposited ${amount} ${asset.symbol}!`);
      setAmount("");
    } catch (err: any) {
      alert("Deposit failed: " + (err?.reason || err?.message || err));
    }
    setLoading(false);
  };

  // Withdraw
  const handleWithdraw = async () => {
    const asset = ASSETS[selectedAsset];
    if (!lendingPool || !userAddress) return;
    try {
      setLoading(true);
      const tx = await lendingPool.withdraw(
        asset.address,
        parseUnits(amount, asset.decimals)
      );
      await tx.wait();
      alert(`Withdrew ${amount} ${asset.symbol}!`);
      setAmount("");
    } catch (err: any) {
      alert("Withdraw failed: " + (err?.reason || err?.message || err));
    }
    setLoading(false);
  };

  // Borrow (uses selectedAsset as debt, DAI as collateral for demo)
  const handleBorrow = async () => {
    const asset = ASSETS[selectedAsset];
    const collateralAsset = ASSETS["dai"]; // You can make this user-selectable
    if (!lendingPool || !userAddress) return;
    try {
      setLoading(true);
      const collateralAmount = parseUnits("1", collateralAsset.decimals); // For demo: 1 DAI as collateral
      await handleApprove(selectedAsset, amount);
      const tx = await lendingPool.borrow(
        asset.address,
        parseUnits(amount, asset.decimals),
        collateralAsset.address,
        collateralAmount
      );
      await tx.wait();
      alert(`Borrowed ${amount} ${asset.symbol}!`);
      setAmount("");
    } catch (err: any) {
      alert("Borrow failed: " + (err?.reason || err?.message || err));
    }
    setLoading(false);
  };

  // Repay
  const handleRepay = async () => {
    const asset = ASSETS[selectedAsset];
    if (!lendingPool || !userAddress) return;
    try {
      setLoading(true);
      await handleApprove(selectedAsset, amount);
      const tx = await lendingPool.repay(
        asset.address,
        parseUnits(amount, asset.decimals)
      );
      await tx.wait();
      alert(`Repaid ${amount} ${asset.symbol}!`);
      setAmount("");
    } catch (err: any) {
      alert("Repay failed: " + (err?.reason || err?.message || err));
    }
    setLoading(false);
  };

  // ========== UI ==========

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card title="Your Deposits">
          <div className="space-y-3">
            {assetKeys.map((key) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{ASSETS[key].symbol} Supplied</span>
                <span className="font-mono">{deposits[ASSETS[key].symbol] || "0.00"}</span>
              </div>
            ))}
          </div>
          <form className="mt-4 flex gap-2 items-center" onSubmit={e => { e.preventDefault(); handleDeposit(); }}>
            <select
              className="border rounded p-1"
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
            <Button type="submit" disabled={loading}>Deposit</Button>
            <Button type="button" primary={false} disabled={loading} onClick={handleWithdraw}>Withdraw</Button>
          </form>
        </Card>
        <Card title="Your Borrows">
          <div className="space-y-3">
            {assetKeys.map((key) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{ASSETS[key].symbol} Borrowed</span>
                <span className="font-mono">{borrows[ASSETS[key].symbol] || "0.00"}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Health Factor</span>
              <span className={`font-mono ${
                healthFactor === "Healthy" ? "text-green-500" :
                healthFactor === "At Risk" ? "text-red-500" : ""
              }`}>
                {healthFactor}
              </span>
            </div>
          </div>
          <form className="mt-4 flex gap-2 items-center" onSubmit={e => { e.preventDefault(); handleBorrow(); }}>
            <select
              className="border rounded p-1"
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value as keyof typeof ASSETS)}
            >
              {assetKeys.map(k => (
                <option key={k} value={k}>{ASSETS[k].symbol}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="border rounded p-1 w-24"
              placeholder="Amount"
            />
            <Button type="submit" disabled={loading}>Borrow More</Button>
            <Button type="button" primary={false} disabled={loading} onClick={handleRepay}>Repay</Button>
          </form>
        </Card>
      </div>
      {loading && <div className="text-gray-500">Processing transaction...</div>}
    </div>
  );
};

export default Dashboard;
