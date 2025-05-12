// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function App() {
//   return (
//     <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//       <Card className="w-full max-w-3xl p-4 rounded-2xl shadow-md">
//         <h1 className="text-3xl font-bold mb-6 text-center">Decentralized Lending Protocol</h1>
//         <Tabs defaultValue="deposit">
//           <TabsList className="grid grid-cols-3 mb-4">
//             <TabsTrigger value="deposit">Deposit</TabsTrigger>
//             <TabsTrigger value="borrow">Borrow</TabsTrigger>
//             <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
//           </TabsList>

//           <TabsContent value="deposit">
//             <CardContent className="space-y-4">
//               <h2 className="text-xl font-semibold">Deposit Assets</h2>
//               <input
//                 type="number"
//                 placeholder="Amount to deposit"
//                 className="w-full p-2 border rounded-md"
//               />
//               <Button className="w-full">Deposit</Button>
//             </CardContent>
//           </TabsContent>

//           <TabsContent value="borrow">
//             <CardContent className="space-y-4">
//               <h2 className="text-xl font-semibold">Borrow Against Collateral</h2>
//               <input
//                 type="number"
//                 placeholder="Amount to borrow"
//                 className="w-full p-2 border rounded-md"
//               />
//               <Button className="w-full">Borrow</Button>
//             </CardContent>
//           </TabsContent>

//           <TabsContent value="dashboard">
//             <CardContent className="space-y-4">
//               <h2 className="text-xl font-semibold">Your Dashboard</h2>
//               <ul className="list-disc list-inside text-gray-700">
//                 <li>Deposited: 0 ETH</li>
//                 <li>Borrowed: 0 ETH</li>
//                 <li>Health Factor: 100%</li>
//               </ul>
//             </CardContent>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </main>
//   );
// }


import React from 'react';
import DashboardLayout from '../components/layouts/Dashboard';

const Borrow = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Borrow Assets</h2>
        <p className="text-gray-600">Use your collateral to borrow supported assets.</p>

        <form className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset to Borrow</label>
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
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Borrow
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Borrow;
