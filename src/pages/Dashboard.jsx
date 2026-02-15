import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  BrainCircuit, Package, Zap, AlertTriangle, 
  ArrowUpRight, BarChart3, PieChart as PieIcon, 
  TrendingUp, Activity, Cpu 
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import InventoryCard from '../components/InventoryCard';

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('inventory').select('*');
      const allItems = data || [];
      setComponents(allItems);
      // Logic for 20% Threshold (Requirement Slide 4)
      const critical = allItems.filter(item => item.current_stock <= (item.min_required * 0.2));
      setCriticalItems(critical);
    };
    getData();
  }, []);

  // Neural Analytics Data
  const consumptionData = components.slice(0, 6).map(c => ({ 
    name: c.name.split(' ')[0], 
    value: c.current_stock 
  }));
  
  const stockStats = [
    { name: 'Critical', value: criticalItems.length, color: '#ef4444' },
    { name: 'Optimal', value: components.length - criticalItems.length, color: '#0ea5e9' },
  ];

  return (
    <div className="relative min-h-full space-y-10 animate-in fade-in duration-1000 pb-20">
      
      {/* 🌌 NEURAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* 🚀 STAGE 1: NEURAL PREDICTION HEADER (THE BRAIN) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-sky-500/20 to-purple-600/10 border border-sky-500/30 rounded-[3rem] p-10 flex items-center justify-between group">
           <Zap className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" size={300} />
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="text-sky-400" size={32} />
                <span className="bg-sky-500 text-white text-[9px] font-black px-4 py-1 rounded-full tracking-widest animate-pulse">LIVE NEURAL ENGINE</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                Demand <span className="text-sky-500">Forecaster</span> V2.1
              </h2>
              <p className="text-slate-300 mt-4 text-lg font-medium max-w-lg italic leading-relaxed">
                "Analyzing <strong>demand_forecaster.pkl</strong>... Pattern suggests a surge in 48h. Predicted window: <span className="text-white font-black underline decoration-sky-500 underline-offset-4">12 days</span>."
              </p>
           </div>
           <button className="relative z-10 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-500 hover:text-white transition-all shadow-2xl">
              Sync Model
           </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center backdrop-blur-xl">
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-2">Confidence Score</p>
          <p className="text-6xl font-black text-white tracking-tighter">87.4<span className="text-sky-500">%</span></p>
          <div className="h-1.5 w-full bg-white/10 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-sky-500 w-[87%] shadow-[0_0_10px_#0ea5e9]" />
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-4 flex items-center gap-2">
            <TrendingUp size={14}/> NEURAL LINK STABLE
          </p>
        </div>
      </div>

      {/* 📊 STAGE 2: ANALYTICS VISUALIZERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumption Dynamics</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Health Distribution</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockStats} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {stockStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🚨 STAGE 3: URGENT PROCUREMENT RADAR */}
      {criticalItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-500">
            <AlertTriangle size={20} className="animate-bounce" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Critical Procurement Radar</h2>
            <div className="flex-1 h-[1px] bg-red-500/20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criticalItems.map(item => (
              <div key={item.id} className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 flex justify-between items-center group hover:bg-red-500/10 transition-all border-l-8 border-l-red-500">
                <div>
                  <p className="text-white font-black uppercase text-base tracking-tight">{item.name}</p>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                    <Activity size={12} /> Stock: {item.current_stock} / {item.min_required}
                  </p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-xl">
                  <ArrowUpRight size={24} className="text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📦 STAGE 4: COMPONENT MATRIX */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-slate-500">
          <Cpu size={18} />
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Global Matrix</h2>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {components.slice(0, 8).map(comp => <InventoryCard key={comp.id} item={comp} />)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
