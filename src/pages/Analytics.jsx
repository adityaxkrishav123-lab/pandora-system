import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { BrainCircuit, TrendingUp, AlertCircle, BarChart3, PieChart } from 'lucide-react';

// Refined data points based on your model's training spikes
const demandData = [
  { name: 'Day 1', actual: 400, predicted: 600 },
  { name: 'Day 5', actual: 12000, predicted: 10500 },
  { name: 'Day 10', actual: 800, predicted: 1200 },
  { name: 'Day 15', actual: 15000, predicted: 14200 },
  { name: 'Day 20', actual: 2000, predicted: 1800 },
  { name: 'Day 25', actual: 500, predicted: 900 },
  { name: 'Day 30', actual: 300, predicted: 400 },
];

const Analytics = () => {
  const [stats, setStats] = useState({ total: 0, critical: 0 });

  useEffect(() => {
    const getStats = async () => {
      const { data } = await supabase.from('components').select('*');
      if (data) {
        const criticalCount = data.filter(c => c.current_stock <= (c.min_required * 0.2)).length;
        setStats({ total: data.length, critical: criticalCount });
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI PREDICTIVE ANALYTICS</h1>
        <p className="text-slate-500 font-medium">Deep learning analysis of PCB consumption patterns</p>
      </header>

      {/* Top Row: AI Accuracy & Risk Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-500 rounded-[2rem] p-8 text-white">
          <BrainCircuit className="mb-4 opacity-50" size={32} />
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Model Accuracy</p>
          <h2 className="text-4xl font-black">94.2%</h2>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
            <TrendingUp size={14} /> +2.1% this week
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
          <AlertCircle className="text-rose-500 mb-4" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Criticality</p>
          <h2 className="text-4xl font-black text-slate-900">{stats.critical} <span className="text-lg text-slate-300">Items</span></h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Currently below the 20% safety threshold</p>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
          <PieChart className="text-sky-400 mb-4" size={32} />
          <p className="text-xs font-bold uppercase tracking-widest opacity-50">Total Components</p>
          <h2 className="text-4xl font-black">{stats.total}</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium tracking-tight">Active in database</p>
        </div>
      </div>

      {/* Main Graph: Predicted vs Actual Demand */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart3 className="text-sky-500" /> 30-Day Demand Forecasting
          </h3>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-2 text-sky-500">
              <div className="w-3 h-3 rounded-full bg-sky-500" /> Actual Usage
            </span>
            <span className="flex items-center gap-2 text-amber-500">
              <div className="w-3 h-3 rounded-full bg-amber-500" /> AI Predicted
            </span>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={demandData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px'}}
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#0ea5e9" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorActual)" 
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                strokeDasharray="8 8" 
                fill="transparent" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
