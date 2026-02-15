import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { executeAutoProduction, getFridayPrediction } from '../lib/productionEngine';
import * as XLSX from 'xlsx'; // Important: Run 'npm install xlsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, BrainCircuit, Upload, Play, AlertTriangle, Terminal } from 'lucide-react';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [recipeName, setRecipeName] = useState("MASTER-DEMO");
  const [logs, setLogs] = useState([{ time: "00:00", msg: "Friday System Online.", type: "sys" }]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addLog = (msg, type = "info") => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 5));
  };

  const fetchData = async () => {
    const { data } = await supabase.from('inventory').select('*').order('current_stock', { ascending: true });
    setInventory(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  // 📁 DYNAMIC SCRAPER: Reads ANY Excel file and creates the DB rows
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    addLog(`Scraping file: ${file.name}...`, "process");

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      for (let row of data) {
        const part = row['Component'] || row['Item'] || row['Part'];
        const qty = row['Qty'] || row['Quantity'] || 1;


        // 🤖 AUTO-BUY ENGINE: Calculates how much to buy to fix shortages
  const [procurementList, setProcurementList] = useState([]);

  useEffect(() => {
    const lowStock = inventory.filter(item => item.current_stock < item.threshold);
    const list = lowStock.map(item => ({
      name: item.name,
      shortage: item.threshold - item.current_stock,
      orderQty: (item.threshold * 2) - item.current_stock, // Restock to double the safety level
      status: "Awaiting Approval"
    }));
    setProcurementList(list);
  }, [inventory]);

  const approveOrder = (name) => {
    addLog(`Neural Order Sent: Restocking ${name}...`, "success");
    speak(`Order for ${name} has been transmitted to the supplier.`);
    setProcurementList(prev => prev.filter(item => item.name !== name));
  }; 
        
        if (part) {
          // 1. Upsert Inventory
          const { data: invItem } = await supabase.from('inventory')
            .upsert({ name: part, current_stock: 1000, threshold: 200 }, { onConflict: 'name' }).select().single();
          
          // 2. Save Recipe
          await supabase.from('recipes').upsert({ recipe_name: file.name, component_id: invItem.id, quantity_required: qty });
        }
      }
      setRecipeName(file.name);
      addLog(`Success! Recipe "${file.name}" is now live.`, "success");
      fetchData();
    };
    reader.readAsBinaryString(file);
  };

  const runNeuralProduction = async () => {
    setIsSyncing(true);
    const { forecast, insight } = await getFridayPrediction();
    addLog(`AI Prediction: ${insight}`, "ai");

    const result = await executeAutoProduction(recipeName, forecast);
    if (result.success) {
      addLog(result.message, "success");
      fetchData();
    } else {
      addLog(result.message, "error");
    }
    setIsSyncing(false);
  };

  return (
    <div className="p-8 space-y-8 bg-[#01060f] text-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-black p-8 rounded-[2rem] border border-sky-500/20">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Friday <span className="text-sky-500">Neural Sync</span></h1>
          <p className="text-slate-400 mt-2">Current Active Recipe: <span className="text-sky-400 font-mono">{recipeName}</span></p>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl cursor-pointer hover:bg-slate-700 transition-all">
            <Upload size={18} /> Upload BOM
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          <button onClick={runNeuralProduction} disabled={isSyncing} className="bg-sky-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <Zap size={18} /> {isSyncing ? "Syncing..." : "Sync AI & Build"}
          </button>
        </div>
      </div>

      {/* GRAPH SECTION */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] h-[350px]">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-slate-500">Inventory Stock Levels (Live)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={inventory.slice(0, 10)}>
            <XAxis dataKey="name" hide />
            <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '12px'}} />
            <Bar dataKey="current_stock">
              {inventory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.current_stock < entry.threshold ? '#ef4444' : '#0ea5e9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TERMINAL LOGS */}
      <div className="bg-black border border-white/10 p-6 rounded-3xl font-mono text-xs">
        <div className="flex items-center gap-2 text-sky-500 mb-4 font-black uppercase tracking-widest">
          <Terminal size={14} /> Friday System Log
        </div>
        {logs.map((log, i) => (
          <p key={i} className="mb-1">
            <span className="opacity-40">[{log.time}]</span> 
            <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}> {log.msg}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
