// import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 space-y-6 fixed top-0 left-0">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-blue-400">Home</Link>
        <Link to="/dashboard" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/lend" className="block hover:text-blue-400">Lend</Link>
        <Link to="/borrow" className="block hover:text-blue-400">Borrow</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
