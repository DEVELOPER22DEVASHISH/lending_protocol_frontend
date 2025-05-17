

// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Lend from "./pages/Lend";
import Borrow from "./pages/Borrow";
import Test from "./pages/Test";
import RequireWallet from "./components/common/RequireWallet";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/dashboard" element={<MainLayout><RequireWallet><Dashboard /></RequireWallet></MainLayout>} />
        <Route path="/lend" element={<MainLayout><RequireWallet><Lend /></RequireWallet></MainLayout>} />
        <Route path="/borrow" element={<MainLayout><RequireWallet><Borrow /></RequireWallet></MainLayout>} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;



