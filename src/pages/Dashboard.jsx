import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BrainCircuit, TrendingUp, AlertTriangle, Package, Activity } from 'lucide-react';
import InventoryCard from '../components/InventoryCard';

// Sample data mapped from your "Actual vs Predicted" graph image
const aiData = [
  { name: '0', actual: 400, predicted: 240 },
  { name: '1', actual: 21000, predicted: 12000 },
  { name: '2', actual: 300, predicted: 100 },
  { name: '4', actual: 1000, predicted: 800 },
  { name: '7', actual: 12500, predicted: 11000 },
  { name: '12', actual: 800, predicted: 600 },
];

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase.from('components').select('*');
      setComponents(data || []);
      setLoading(false);
    };
    fetchInventory();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SYSTEM OVERVIEW</h1>
          <p className="text-slate-500 font-medium italic">AI-Engine: Operational | Next Re-training: 24h</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 font-bold text-sm">
            <Activity size={16} /> 98.2% Accuracy
          </div>
        </div>
      </div>

      {/* The AI Demand Visualization (From your Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <BrainCircuit className="text-sky-500" /> AI Demand Forecast
            </h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-tighter">
              <span className="flex items-center gap-1 text-sky-500"><div className="w-2 h-2 rounded-full bg-sky-500"/> Actual</span>
              <span className="flex items-center gap-1 text-amber-500"><div className="w-2 h-2 rounded-full bg-amber-500"/> Predicted</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="10 10" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Atomic Trigger</h3>
            <p className="text-slate-400 text-sm">Initiate zero-error production deduction.</p>
          </div>
          <button className="w-full bg-sky-500 hover:bg-sky-400 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-xl shadow-sky-500/20">
            NEW PRODUCTION
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Package className="text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest">Active Inventory</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {components.map((comp) => (
            <InventoryCard key={comp.id} item={comp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
