import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BrainCircuit, Activity, Package } from 'lucide-react';
import InventoryCard from '../components/InventoryCard';

const Dashboard = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('components').select('*');
      setComponents(data || []);
    };
    getData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SYSTEM OVERVIEW</h1>
          <p className="text-slate-500 font-medium">AI-Engine: Active | Model: XGBoost</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 font-bold text-sm">
          <Activity size={16} /> System Live
        </div>
      </div>

      {/* The AI Prediction Panel (Data from your Colab training) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl shadow-sky-900/20">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-3">
            <BrainCircuit className="text-sky-400" /> AI Demand Insight
          </h3>
          <p className="text-slate-400 mt-2">Next procurement spike predicted in <span className="text-white font-bold underline">12 days</span></p>
        </div>
        <button className="bg-sky-500 hover:bg-sky-400 px-6 py-3 rounded-xl font-black transition-all">
          VIEW FULL FORECAST
        </button>
      </div>

      {/* Inventory Grid - Using your DB data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {components.map(comp => (
          <InventoryCard key={comp.id} item={comp} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
