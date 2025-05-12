import React from 'react';
import DashboardLayout from '../components/layouts/Dashboard';

const Lend = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Lend Assets</h2>
        <p className="text-gray-600">Deposit supported assets to earn interest.</p>

        <form className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset</label>
            <select className="w-full border border-gray-300 p-2 rounded">
              <option value="eth">ETH</option>
              <option value="dai">DAI</option>
              <option value="usdc">USDC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" placeholder="0.0" className="w-full border border-gray-300 p-2 rounded" />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Deposit
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Lend;
