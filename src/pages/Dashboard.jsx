import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  BrainCircuit, Zap, AlertTriangle, ArrowUpRight, BarChart3, 
  PieChart as PieIcon, TrendingUp, Activity, Cpu, Leaf, 
  Target, ShieldCheck, Sparkles, Terminal, PlayCircle
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import InventoryCard from '../components/InventoryCard';

// 🔌 NEURAL IMPORTS
import { getFridayForecast, wakeUpFriday } from '../lib/aiService'; 
import { executeAutoProduction } from '../lib/productionEngine';

const Dashboard = () => {
  const [components, setComponents] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [fridayInsight, setFridayInsight] = useState("");
  const [qualityStats, setQualityStats] = useState({ yield: 98.2, co2: -12, grade: 'A+' });
  
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
    // Critical is defined as less than or equal to 20% of min_required
    const critical = allItems.filter(item => item.current_stock <= (item.min_required * 0.2));
    setCriticalItems(critical);
  };

  useEffect(() => {
    fetchDashboardData();
    wakeUpFriday(); 
  }, []);

  // 🎤 FRIDAY VOICE ENGINE
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  // 🌪️ THE GHOST ENGINE SIMULATOR (Deducts stock for demo)
  const simulateProduction = async () => {
    if (components.length === 0) return;
    addLog("Ghost Engine: Simulating 24h Production Cycle...", "process");
    
    // For demo: Deducts a random amount (5-15) from all items
    const { error } = await supabase.rpc('simulate_daily_usage'); // Assumes you ran the SQL function I gave you

    if (!error) {
      await fetchDashboardData();
      addLog("Cycle Complete. Inventory levels adjusted.", "success");
      speak("Production cycle complete. Stock levels have been adjusted, Boss.");
    } else {
      // Fallback: Just update one item if the RPC isn't set up
      await supabase.from('inventory').update({ current_stock: components[0].current_stock - 10 }).eq('id', components[0].id);
      await fetchDashboardData();
      addLog("Local Simulation Complete.", "success");
    }
  };

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
        addLog(`Friday: ${aiData.friday_advice.substring(0, 50)}...`, "ai");
        speak(`Analysis complete. ${aiData.friday_advice}`);
        
        const prodResult = await executeAutoProduction('BAJAJ-V4', 5); 
        if (prodResult.success) {
          addLog("Success: Inventory levels synchronized.", "success");
          await fetchDashboardData();
        }
      }
    } catch (error) {
      addLog("Neural Link Interrupted.", "error");
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
    <div className="relative min-h-full space-y-10 animate-in fade-in duration-1000 pb-20 p-6 lg:p-10">
      
      {/* 🌌 AMBIENT BACKGROUND */}
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
                  {fridayInsight ? `🤖 "${fridayInsight}"` : `"Awaiting Neural Sync... Simulation mode ready."`}
                </p>
              </div>
           </div>
           
           <div className="flex flex-col gap-3 relative z-10 ml-8">
             <button 
               onClick={handleNeuralSync} 
               disabled={isSyncing}
               className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${
                 isSyncing ? 'bg-slate-800 text-slate-500' : 'bg-sky-500 text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95'
               }`}
             >
                {isSyncing ? 'Syncing...' : 'Sync AI'}
             </button>

             <button 
               onClick={simulateProduction}
               className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-slate-800 text-sky-400 border border-sky-500/30 hover:bg-sky-900 hover:text-white transition-all flex items-center gap-2"
             >
                <PlayCircle size={14}/> Run Production
             </button>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center backdrop-blur-xl">
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-2">Confidence Score</p>
          <p className="text-6xl font-black text-white tracking-tighter">87.4<span className="text-sky-500">%</span></p>
          <div className="h-1.5 w-full bg-white/10 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-sky-500 w-[87%] shadow-[0_0_15px_#0ea5e9]" />
          </div>
        </div>
      </div>

      {/* 📊 STAGE 2: ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '16px'}} />
                <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockStats} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {stockStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🖥️ STAGE 3: LOGS */}
      <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 font-mono text-[11px]">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <Terminal size={14} className="text-sky-500" />
          <span className="text-slate-500 uppercase tracking-widest font-black">Friday Neural Terminal</span>
        </div>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4">
              <span className="text-sky-500/50">[{log.time}]</span>
              <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🚨 STAGE 5: CRITICAL RADAR */}
      {criticalItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-500">
            <AlertTriangle size={20} className="animate-bounce" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Critical Procurement Radar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criticalItems.map(item => (
              <div key={item.id} className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 border-l-8 border-l-red-500">
                <p className="text-white font-black uppercase">{item.name}</p>
                <p className="text-[10px] text-red-400 font-bold mt-2">Stock: {item.current_stock} / {item.min_required}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📦 STAGE 6: MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {components.slice(0, 12).map(comp => <InventoryCard key={comp.id} item={comp} />)}
      </div>
    </div>
  );
};

export default Dashboard;
