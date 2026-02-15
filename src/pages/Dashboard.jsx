import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { executeAutoProduction, getFridayPrediction } from '../lib/productionEngine';
import * as XLSX from 'xlsx'; 
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, BrainCircuit, Upload, Play, AlertTriangle, Terminal } from 'lucide-react';

const Dashboard = () => {
  // 1. ALL HOOKS AT THE TOP LEVEL
  const [inventory, setInventory] = useState([]);
  const [recipeName, setRecipeName] = useState("MASTER-DEMO");
  const [logs, setLogs] = useState([{ time: new Date().toLocaleTimeString(), msg: "Friday System Online.", type: "sys" }]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [procurementList, setProcurementList] = useState([]);

  // 2. DEFINE HELPER FUNCTIONS
  const addLog = (msg, type = "info") => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 5));
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchData = async () => {
    const { data } = await supabase.from('inventory').select('*').order('current_stock', { ascending: true });
    setInventory(data || []);
  };

  // 3. USEEFFECTS
  useEffect(() => { 
    fetchData(); 
  }, []);

  useEffect(() => {
    const lowStock = inventory.filter(item => item.current_stock < (item.threshold || 200));
    const list = lowStock.map(item => ({
      name: item.name,
      shortage: (item.threshold || 200) - item.current_stock,
      orderQty: ((item.threshold || 200) * 2) - item.current_stock,
      status: "Awaiting Approval"
    }));
    setProcurementList(list);
  }, [inventory]);

  // 4. EVENT HANDLERS
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    addLog(`Scraping file: ${file.name}...`, "process");

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

      for (let row of data) {
        const part = row['Component'] || row['Item'] || row['Part Description'];
        const qty = parseInt(row['Qty'] || row['Quantity'] || 1);

        if (part) {
          const { data: invItem } = await supabase.from('inventory')
            .upsert({ name: part, current_stock: 1000, threshold: 200 }, { onConflict: 'name' })
            .select().single();
          
          if (invItem) {
            await supabase.from('recipes').upsert({ 
              recipe_name: file.name, 
              component_id: invItem.id, 
              quantity_required: qty 
            }, { onConflict: 'recipe_name, component_id' });
          }
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
    speak(insight);

    const result = await executeAutoProduction(recipeName, forecast);
    if (result.success) {
      addLog(result.message, "success");
      fetchData();
    } else {
      addLog(result.message, "error");
    }
    setIsSyncing(false);
  };

  const approveOrder = (name) => {
    addLog(`Neural Order Sent: Restocking ${name}...`, "success");
    speak(`Order for ${name} has been transmitted to the supplier.`);
    setProcurementList(prev => prev.filter(item => item.name !== name));
  };

  // 5. RENDER UI
  return (
    <div className="p-8 space-y-8 bg-[#01060f] text-white min-h-screen">
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-black p-8 rounded-[2rem] border border-sky-500/20">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Friday <span className="text-sky-500">Neural Sync</span></h1>
          <p className="text-slate-400 mt-2">Active Recipe: <span className="text-sky-400 font-mono">{recipeName}</span></p>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl cursor-pointer hover:bg-slate-700">
            <Upload size={18} /> Upload BOM
            <input type="file" hidden onChange={handleFileUpload} />
          </label>
          <button onClick={runNeuralProduction} disabled={isSyncing} className="bg-sky-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
            <Zap size={18} /> {isSyncing ? "Syncing..." : "Sync AI & Build"}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventory.slice(0, 10)}>
            <XAxis dataKey="name" hide />
            <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '12px'}} />
            <Bar dataKey="current_stock">
              {inventory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.current_stock < (entry.threshold || 200) ? '#ef4444' : '#0ea5e9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {procurementList.length > 0 && (
        <div className="bg-red-500/10 border-2 border-dashed border-red-500/30 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-4 mb-6 text-red-500 font-black uppercase"><AlertTriangle /> Auto-Buy Protocol</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {procurementList.map((order, idx) => (
              <div key={idx} className="bg-black/60 p-6 rounded-3xl border border-white/5">
                <p className="text-white font-bold">{order.name}</p>
                <button onClick={() => approveOrder(order.name)} className="mt-4 w-full py-2 bg-red-500/20 text-red-500 rounded-lg text-xs font-black">Confirm Order</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black border border-white/10 p-6 rounded-3xl font-mono text-xs">
        <div className="flex items-center gap-2 text-sky-500 mb-4 font-black uppercase"><Terminal size={14} /> Friday System Log</div>
        {logs.map((log, i) => (
          <p key={i} className="mb-1"><span className="opacity-40">[{log.time}]</span><span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}> {log.msg}</span></p>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
