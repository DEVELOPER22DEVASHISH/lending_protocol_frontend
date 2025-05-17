// src/components/shared/Header.tsx
import React from "react";
import { Link } from "react-router-dom";
// import Button from "../common/Button";
import ConnectWallet from "../common/ConnectWallet";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">DeFi Lending Protocol</Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/lend" className="hover:text-blue-400">Lend</Link>
          <Link to="/borrow" className="hover:text-blue-400">Borrow</Link>
        </nav>
        {/* <Button className="bg-blue-500 hover:bg-blue-600">Connect Wallet</Button> */}
        <ConnectWallet />
      </div>
    </header>
  );
};

export default Header;
