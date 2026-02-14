import React from 'react';
import { LayoutDashboard, Box, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, Friday is ready.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-sm font-bold text-slate-600">
          Feb 14, 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Box /></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Stock</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">0 <span className="text-sm text-slate-300 font-medium">units</span></h3>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"><AlertTriangle /></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Low Alerts</p>
          <h3 className="text-3xl font-black mt-1 text-orange-600">0</h3>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"><TrendingUp /></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">System Health</p>
          <h3 className="text-3xl font-black mt-1 text-green-600">100%</h3>
        </div>
      </div>

      {/* Empty State Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-blue-200">
        <h2 className="text-3xl font-bold mb-4">Your Inventory is Empty</h2>
        <p className="text-blue-100 max-w-md mx-auto mb-8 font-medium">
          Pandora Intelligence is ready to track your PCB components. Head to the Inventory tab to add your first STM32 or Resistor.
        </p>
        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform">
          Connect Database Now
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
