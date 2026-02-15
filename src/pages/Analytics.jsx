import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Activity, Box, Cpu } from 'lucide-react';

const Analytics = () => {
  const [forecast] = useState(15000);

  const data = [
    { name: 'W1', actual: 400, predicted: 450 },
    { name: 'W2', actual: 12000, predicted: 11000 },
    { name: 'W3', actual: 800, predicted: 900 },
    { name: 'W4', actual: 15000, predicted: forecast },
  ];

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 space-y-8 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Pandora <span className="text-sky-500">Neural</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Supply Chain Intelligence v4.0</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-xl flex items-center gap-4 px-6">
          <Activity className="text-emerald-500 animate-pulse" size={16} />
          <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">Live Sync Active</span>
        </div>
      </div>

      {/* THE MAIN NEURAL WAVE CARD */}
      <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-[3rem] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 relative z-10">
          <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <BrainCircuit className="text-sky-500" /> 
            Neural Demand Flow: <span className="text-sky-500 underline underline-offset-8">Bajaj Controller Batch #402</span>
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-sky-500"></div> <span>ACTUAL USAGE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 border-t-2 border-dashed border-amber-500"></div> <span className="text-amber-500">AI PREDICTION</span>
            </div>
          </div>
        </div>
        
        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} 
              />
              <Area type="monotone" dataKey="actual" stroke="#0ea5e9" fill="url(#colorActual)" strokeWidth={4} />
              <Area type="monotone" dataKey="predicted" stroke="#f59e0b" fill="transparent" strokeDasharray="8 8" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white shadow-2xl group hover:border-sky-500/50 transition-all">
          <Cpu className="text-sky-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
          <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Model Accuracy</h4>
          <p className="text-slate-500 text-xs font-bold leading-relaxed tracking-wide">98.4% Confidence Score based on Bajaj Dec '25 Historical Dataset.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <Box className="text-amber-500 mb-6" size={40} />
          <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Peak Detected</h4>
          <p className="text-slate-500 text-xs font-bold leading-relaxed tracking-wide">Significant demand surge predicted for Week 4. Auto-Procurement Trigger suggested.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
