import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Clock, Package, Calendar, ChevronRight } from 'lucide-react';

const History = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      // Joining production_logs with pcb_types to get the PCB Name
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Production Ledger</h1>
          <p className="text-slate-500 font-medium">Verified Consumption Logs</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-xs font-bold text-slate-400">
          {logs.length} ENTRIES RECORDED
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-6 text-xs font-black uppercase tracking-widest">Timestamp</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest">PCB Model</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-center">Batch Size</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-sky-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                    <Calendar size={14} />
                    {new Date(log.created_at).toLocaleDateString()}
                    <Clock size={14} className="ml-2" />
                    {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-lg text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                      <Package size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{log.pcb_types?.pcb_name || 'Deleted Model'}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="bg-slate-100 px-4 py-1 rounded-full font-black text-slate-600 text-sm">
                    {log.quantity_produced} Units
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="inline-flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                    Verified <ChevronRight size={14} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {logs.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold italic">No production runs recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
