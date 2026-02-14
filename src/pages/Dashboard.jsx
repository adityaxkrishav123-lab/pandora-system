import React from 'react';
import { Box, AlertTriangle, Cpu } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Box /></div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase">Total Components</p>
              <h3 className="text-2xl font-black">0</h3>
            </div>
          </div>
        </div>
        {/* If database is empty, show a prompt */}
        <div className="md:col-span-3 bg-blue-600 text-white p-10 rounded-[3rem] text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Pandora</h2>
          <p className="opacity-80">Your database is currently empty. Go to the Inventory tab to add your first PCB component.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
