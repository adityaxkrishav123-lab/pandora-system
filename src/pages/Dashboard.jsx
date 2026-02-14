import React from 'react';
import { Box, AlertOctagon, TrendingUp, Cpu } from 'lucide-react';

const Dashboard = () => (
  <div className="animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Components', val: '1,247', color: 'blue', icon: <Box /> },
        { label: 'Low Stock Alerts', val: '23', color: 'red', icon: <AlertOctagon /> },
        { label: 'Inventory Value', val: '$45,320', color: 'emerald', icon: <TrendingUp /> },
        { label: 'Type Components', val: '48', color: 'orange', icon: <Cpu /> },
      ].map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
          <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-4`}>
            {card.icon}
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase">{card.label}</p>
          <h3 className="text-2xl font-black">{card.val}</h3>
        </div>
      ))}
    </div>
    
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
      <h3 className="font-bold text-lg mb-6">Recent Stock Movements</h3>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">F1</div>
          <div>
            <p className="font-bold text-slate-800">Fuse F1</p>
            <p className="text-xs text-slate-400">PN: F1-ALL-01</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-red-500">1 / 200</p>
          <p className="text-[10px] uppercase font-bold text-slate-400">Critical Stock</p>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
