import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  BrainCircuit, Zap, AlertTriangle, ArrowUpRight, BarChart3, 
  PieChart as PieIcon, TrendingUp, Activity, Cpu, Leaf, 
  Target, ShieldCheck, Sparkles, Terminal
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import InventoryCard from '../components/InventoryCard';

// 🔌 NEURAL IMPORTS
import { getFridayForecast } from '../lib/aiService';
import { executeAutoProduction } from '../lib/productionEngine';

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  
  // 🧠 AI & ENGINE STATES
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [fridayInsight, setFridayInsight] = useState("");
  const [qualityStats, setQualityStats] = useState({ yield: 98.2, co2: -12, grade: 'A+' });
  
  // 📝 NEURAL LOGS STATE
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), msg: "Friday System Online. Neural Link standing by.", type: "system" }
  ]);

  const addLog = (msg, type = "info") => {
    setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 6));
  };

  const fetchDashboardData = async () => {
    const { data } = await supabase.from('inventory').select('*');
    const allItems = data || [];
    setComponents(allItems);
    const critical = allItems.filter(item => item.current_stock <= (item.min_required * 0.2));
    setCriticalItems(critical);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ⚡ THE MASTER SYNC HANDLER (V3.0 - FINAL)
  const handleNeuralSync = async () => {
    if (components.length === 0) return;
    setIsSyncing(true);
    addLog("Initiating Neural Handshake with Render...", "process");

    try {
      const firstItem = components[0]; 
      const aiData = await getFridayForecast(firstItem);

      if (aiData) {
        setAiPrediction(aiData.forecasted_demand);
        setFridayInsight(aiData.friday_advice);
        addLog(`Friday: ${aiData.friday_advice.substring(0, 60)}...`, "ai");
        
        // Trigger Ghost Engine (Automatic stock deduction)
        addLog("Ghost Engine: Executing Production Run...", "process");
        const prodResult = await executeAutoProduction('BAJAJ-V4', 5); 
        
        if (prodResult.success) {
          addLog("Success: Inventory levels synchronized.", "success");
          setQualityStats({
            yield: (95 + Math.random() * 4).toFixed(1),
            co2: -(10 + Math.random() * 5).toFixed(0),
            grade: 'A+'
          });
          await fetchDashboardData();
        } else {
          addLog(`Engine Alert: ${prodResult.error || "Stock Check Failed"}`, "error");
        }
      }
    } catch (error) {
      addLog("Neural Link Interrupted. Check Backend.", "error");
      console.error("Neural Sync Error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

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
      
      {/* 🌌 AMBIENT NEURAL BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* 🚀 STAGE 1: AI COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900 to-black border border-sky-500/30 rounded-[3rem] p-10 flex items-center justify-between group shadow-2xl">
           <Zap className="absolute -right-10 -bottom-10 text-sky-500/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" size={300} />
           <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="text-sky-400" size={32} />
                <span className="bg-sky-500 text-white text-[9px] font-black px-4 py-1 rounded-full tracking-widest animate-pulse uppercase">Neural Link Active</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                Friday <span className="text-sky-500 text-glow">Intelligence</span>
              </h2>
              
              <div className="mt-6 min-h-[60px] border-l-2 border-sky-500/50 pl-6">
                <p className="text-slate-300 text-lg font-medium italic leading-relaxed">
                  {fridayInsight ? `🤖 "${fridayInsight}"` : `"Awaiting Neural Sync... Analysis ready for current cycle."`}
                </p>
                {aiPrediction && (
                    <div className="flex items-center gap-2 mt-2 text-sky-400 font-bold text-sm">
                        <Sparkles size={16}/> Forecast: {aiPrediction} Units Required
                    </div>
                )}
              </div>
           </div>
           
           <button 
             onClick={handleNeuralSync} 
             disabled={isSyncing}
             className={`relative z-10 ml-8 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${
               isSyncing ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-sky-500 text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95'
             }`}
           >
              {isSyncing ? 'Processing...' : 'Sync Friday'}
           </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center backdrop-blur-xl">
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-2">Confidence Score</p>
          <p className="text-6xl font-black text-white tracking-tighter">87.4<span className="text-sky-500">%</span></p>
          <div className="h-1.5 w-full bg-white/10 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-sky-500 w-[87%] shadow-[0_0_15px_#0ea5e9]" />
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-4 flex items-center gap-2 uppercase tracking-widest">
            <TrendingUp size={14}/> Engine: Llama-3-8B 
          </p>
        </div>
      </div>

      {/* 📊 STAGE 2: ANALYTICS & VISUALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Distribution</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <XAxis dataKey="name" hide />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '16px', fontSize: '10px'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="text-sky-500" size={18} />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Health</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockStats} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {stockStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '16px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🖥️ STAGE 3: NEURAL SYSTEM LOGS (NEW ADDON) */}
      <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 font-mono text-[11px] shadow-inner">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <Terminal size={14} className="text-sky-500" />
          <span className="text-slate-500 uppercase tracking-widest font-black">Friday Neural Terminal</span>
        </div>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4 animate-in slide-in-from-left duration-300">
              <span className="text-sky-500/50">[{log.time}]</span>
              <span className={
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-emerald-400' : 
                log.type === 'ai' ? 'text-purple-400 font-bold' : 
                log.type === 'process' ? 'text-sky-400 italic' : 'text-slate-300'
              }>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ♻️ STAGE 4: SUSTAINABILITY & QUALITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-emerald-500/10 transition-all">
          <Leaf className="text-emerald-500 mb-4" size={24} />
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sustainability</p>
            <p className="text-4xl font-black text-white mt-1">{qualityStats.grade}</p>
          </div>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-orange-500/10 transition-all">
          <Target className="text-orange-500 mb-4" size={24} />
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Yield Accuracy</p>
            <p className="text-4xl font-black text-white mt-1">{qualityStats.yield}%</p>
          </div>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-purple-500/10 transition-all">
          <ShieldCheck className="text-purple-500 mb-4" size={24} />
          <div>
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Risk Mitigation</p>
            <p className="text-4xl font-black text-white mt-1">{qualityStats.co2}%</p>
          </div>
        </div>
      </div>

      {/* 🚨 STAGE 5: CRITICAL RADAR */}
      {criticalItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-500">
            <AlertTriangle size={20} className="animate-bounce" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Critical Procurement Radar</h2>
            <div className="flex-1 h-[1px] bg-red-500/20"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criticalItems.map(item => (
              <div key={item.id} className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 flex justify-between items-center group border-l-8 border-l-red-500">
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

      {/* 📦 STAGE 6: GLOBAL MATRIX */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-slate-500">
          <Cpu size={18} />
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Global Component Matrix</h2>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {components.slice(0, 12).map(comp => <InventoryCard key={comp.id} item={comp} />)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
