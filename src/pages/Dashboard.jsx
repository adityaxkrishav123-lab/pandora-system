import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BrainCircuit, Activity, Package, Zap } from 'lucide-react';
import InventoryCard from '../components/InventoryCard';

const Dashboard = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      // Changed to 'inventory' to match our database table name
      const { data } = await supabase.from('inventory').select('*');
      setComponents(data || []);
    };
    getData();
  }, []);

  return (
    <div className="relative min-h-full space-y-8 animate-in fade-in duration-1000">
      
      {/* ABSTRACT BACKGROUND ELEMENTS (The Glow) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            System <span className="text-sky-500">Overview</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm tracking-widest mt-1">
            CORE NEURAL LINK: <span className="text-emerald-500">ENCRYPTED</span>
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-2xl border border-emerald-500/20 flex items-center gap-2 font-black text-xs uppercase tracking-widest backdrop-blur-md">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          Live Stream Active
        </div>
      </div>

      {/* AI PREDICTION PANEL (Glassmorphism) */}
      <div className="relative overflow-hidden group bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center shadow-2xl backdrop-blur-xl">
        {/* Decorative Zap Icon background */}
        <Zap className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={240} />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
            <div className="bg-sky-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.4)]">
              <BrainCircuit className="text-white" size={28} />
            </div>
            AI Demand Prediction
          </h3>
          <p className="text-slate-400 mt-4 text-lg font-medium max-w-md">
            Neural pattern detected. <span className="text-white font-black underline decoration-sky-500 underline-offset-4">12 day</span> window until next procurement surge.
          </p>
        </div>
        
        <button className="relative z-10 mt-6 md:mt-0 bg-white text-slate-900 hover:bg-sky-400 hover:text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-sm active:scale-95">
          Verify Forecast
        </button>
      </div>

      {/* INVENTORY GRID */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-slate-500 px-2">
          <Package size={18} />
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">Critical Components Matrix</h2>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
          {components.map(comp => (
            <InventoryCard key={comp.id} item={comp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
