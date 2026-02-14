import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, BarChart3 } from 'lucide-react';

// Data points representing the spikes seen in your model training
const data = [
  { name: 'W1', actual: 400, predicted: 500 },
  { name: 'W2', actual: 12000, predicted: 10000 },
  { name: 'W3', actual: 800, predicted: 1500 },
  { name: 'W4', actual: 15000, predicted: 14000 },
];

const Analytics = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-slate-900 uppercase">Neural Analytics</h1>
      
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-10">
          <BarChart3 className="text-sky-500" /> AI Demand Forecast (30 Day)
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="actual" stroke="#0ea5e9" fillOpacity={0.1} fill="#0ea5e9" strokeWidth={4} />
              <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="transparent" strokeDasharray="5 5" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
