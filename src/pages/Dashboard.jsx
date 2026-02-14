import React from 'react';
import StatsCard from '../components/StatsCard';
import AIInsightPanel from '../components/AIInsightPanel';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back! Here's your inventory overview.</p>
      </header>

      {/* KPI Stats Row  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Components" value="1,247" trend="+12%" type="blue" />
        <StatsCard title="Low Stock Alerts" value="23" trend="-8%" type="red" />
        <StatsCard title="Inventory Value" value="$45,320" trend="+5%" type="green" />
        <StatsCard title="Active Production" value="5" sub="In progress" type="orange" />
      </div>

      {/* Main Inventory Grid Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <input type="text" placeholder="Search components..." className="bg-slate-50 border-none rounded-lg px-4 py-2 w-1/3" />
           <button className="bg-sky-500 text-white px-4 py-2 rounded-lg font-bold">+ New Production</button>
        </div>
        {/* Inventory cards will go here */}
      </div>

      {/* The Crazy AI Insights Panel (Redirectable) [cite: 198] */}
      <AIInsightPanel />
    </div>
  );
};

export default Dashboard;
