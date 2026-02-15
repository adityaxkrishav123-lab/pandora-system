import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Clock, Package, Calendar, ShieldCheck, Activity } from 'lucide-react';

const History = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('production_logs')
        .select(`
          id,
          quantity_produced,
          created_at,
          pcb_types (pcb_name)
        `)
        .order('created_at', { ascending: false });
      
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 space-y-8 text-white animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Neural <span className="text-sky-500">Ledger</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Verified Production & Consumption Logs</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
          <Activity className="text-sky-500" size={18} />
          <span className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
            {logs.length} Transactions Recorded
          </span>
        </div>
      </div>

      {/* The Ledger Table */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Identity</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Stamp (Time)</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch Vol</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-sky-500/10 p-3 rounded-2xl text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                        <Package size={20} />
                      </div>
                      <div>
                        <span className="block font-black text-white text-sm uppercase tracking-tight">
                          {log.pcb_types?.pcb_name || 'Legacy Model'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Protocol V4</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                        <Calendar size={12} className="text-sky-500" />
                        {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px]">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl font-black text-sky-500 text-xs uppercase tracking-tighter">
                      {log.quantity_produced} Units
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <ShieldCheck size={14} />
                      Immutable
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {logs.length === 0 && (
          <div className="p-24 text-center">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Activity className="text-slate-600" size={30} />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">No production sequences detected in local relay.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
