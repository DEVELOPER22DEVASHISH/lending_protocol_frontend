import React from 'react';
import DashboardLayout from '../components/layouts/Dashboard';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">Track your deposits, borrowings, and interest rates here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">Deposited Assets</h3>
            <p>Coming Soon...</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">Borrowed Assets</h3>
            <p>Coming Soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
