// src/pages/Dashboard.tsx
import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card title="Your Deposits">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Assets Supplied</span>
              <span className="font-mono">0.00 USD</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Interest Earned</span>
              <span className="font-mono">0.00 USD</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Deposit</Button>
            <Button primary={false}>Withdraw</Button>
          </div>
        </Card>
        
        <Card title="Your Borrows">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Assets Borrowed</span>
              <span className="font-mono">0.00 USD</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Health Factor</span>
              <span className="font-mono text-green-500">∞</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>Borrow More</Button>
            <Button primary={false}>Repay</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

