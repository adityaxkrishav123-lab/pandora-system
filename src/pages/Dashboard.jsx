import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BrainCircuit, Package, Zap, AlertTriangle, ArrowUpRight, BarChart3, PieChart as PieIcon } from 'lucide-react';
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
      const critical = allItems.filter(item => item.current_stock <= (item.min_required * 0.2));
      setCriticalItems(critical);
    };
    getData();
  }, []);

  // Mock Data for the new visualizers
  const consumptionData = components.slice(0, 5).map(c => ({ name: c.name.split(' ')[0], value: c.current_stock }));
  const stockStats = [
    { name: 'Critical', value: criticalItems.length, color: '#ef4444' },
    { name: 'Optimal', value: components.length - criticalItems.length, color: '#0ea5e9' },
  ];

  return (
    <div className="relative min-h-full space-y-8 animate-in fade-in duration-1000 pb-20">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            System <span className="text-sky-500">Overview</span>
          </h1>
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] mt-1 uppercase">
            Neural Status: <span className="text-emerald-500 animate-pulse">Online</span>
          </p>
        </div>
      </div>

      {/* AI PREDICTION PANEL */}
      <div className="relative overflow-hidden group bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-2xl backdrop-blur-xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <div className="bg-sky-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.4)]">
              <BrainCircuit className="text-white" size={28} />
            </div>
            Neural Demand Analysis
          </h3>
          <p className="text-slate-400 mt-4 text-lg font-medium max-w-md italic">
            "Procurement surge expected in <span className="text-sky-500 font-black">12 days</span> based on current production velocity."
          </p>
        </div>
        <button className="relative z-10 mt-6 md:mt-0 bg-white text-slate-900 hover:bg-sky-500 hover:text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs">
          Regenerate Forecast
        </button>
      </div>

      {/* CHARTS ROW - BRIDGING THE GAP TO THE DESIGN IMAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Component Consumption Ratio</h3>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Health Distribution</h3>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stockStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* URGENT PROCUREMENT RADAR */}
      {criticalItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-red-500">
            <AlertTriangle size={18} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Urgent Procurement Radar</h2>
            <div className="flex-1 h-[1px] bg-red-500/20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalItems.map(item => (
              <div key={item.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex justify-between items-center group hover:bg-red-500/10 transition-all border-l-4 border-l-red-500">
                <div>
                  <p className="text-white font-black uppercase text-sm tracking-tight">{item.name}</p>
                  <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-1">Stock Critical: {item.current_stock} Units</p>
                </div>
                <ArrowUpRight size={20} className="text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INVENTORY GRID */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-slate-500">
          <Package size={18} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Global Component Matrix</h2>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {components.map(comp => <InventoryCard key={comp.id} item={comp} />)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
