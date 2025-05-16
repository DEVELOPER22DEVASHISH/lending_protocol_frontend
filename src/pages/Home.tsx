// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home: React.FC = () => {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to DeFi Lending Protocol</h1>
        <p className="text-xl text-gray-600">
          Deposit assets, earn interest, or borrow against your crypto
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card title="Lend Assets" className="text-center">
          <p className="mb-4">Supply your crypto assets and earn interest</p>
          <Link to="/lend">
            <Button>Start Lending</Button>
          </Link>
        </Card>
        
        <Card title="Borrow Assets" className="text-center">
          <p className="mb-4">Borrow assets against your collateral</p>
          <Link to="/borrow">
            <Button>Start Borrowing</Button>
          </Link>
        </Card>
        
        <Card title="Your Dashboard" className="text-center">
          <p className="mb-4">View your positions and manage your portfolio</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Home;
