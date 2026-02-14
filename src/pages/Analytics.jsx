import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Activity, Box } from 'lucide-react';

const Analytics = () => {
  const [forecast, setForecast] = useState(15000);
  const [loading, setLoading] = useState(false);

  const data = [
    { name: 'W1', actual: 400, predicted: 450 },
    { name: 'W2', actual: 12000, predicted: 11000 },
    { name: 'W3', actual: 800, predicted: 900 },
    { name: 'W4', actual: 15000, predicted: forecast },
  ];

  return (
    // The "min-h-screen bg-slate-50" ensures the page isn't black
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Pandora Neural</h1>
          <p className="text-slate-500 font-medium">Supply Chain Intelligence v1.0</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-white p-2 rounded-2xl shadow-xl flex items-center gap-4 px-6">
          <Activity className="text-emerald-500 animate-pulse" size={20} />
          <span className="text-xs font-bold text-slate-700 tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* ABSTRACT CARD: Glassmorphism Effect */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sky-400/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-400/20 blur-[100px] rounded-full" />
        
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-12 relative z-10">
          <BrainCircuit className="text-sky-500" /> Predictive Demand Flow
        </h3>
        
        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '24px', border: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)'}} 
              />
              <Area type="monotone" dataKey="actual" stroke="#0ea5e9" fill="url(#colorActual)" strokeWidth={4} />
              <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="transparent" strokeDasharray="8 8" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <Box className="text-sky-400 mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-2">Inventory AI</h4>
          <p className="text-slate-400 text-sm leading-relaxed">Processing 1,200+ SKU points from Bajaj Dec '25 Dataset.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
