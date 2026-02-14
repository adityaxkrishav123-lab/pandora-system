import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Play, ShieldCheck, AlertOctagon, Cpu } from 'lucide-react';

const ComponentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [prodQty, setProdQty] = useState(1);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const fetchComp = async () => {
      const { data } = await supabase.from('components').select('*').eq('id', id).single();
      setComponent(data);
    };
    fetchComp();
  }, [id]);

  const handleAtomicProduction = async () => {
    setStatus({ type: 'loading', msg: 'Validating Atomic Transaction...' });
    
    // Logic: Calling the SQL RPC function we created in Phase 2
    // target_pcb_id is linked to this component in your mappings
    const { error } = await supabase.rpc('process_pcb_production', {
      target_pcb_id: component.linked_pcb_id, 
      prod_quantity: prodQty
    });

    if (error) {
      setStatus({ type: 'error', msg: `PRODUCTION BLOCKED: ${error.message}` });
    } else {
      setStatus({ type: 'success', msg: 'PRODUCTION SUCCESS: Inventory Deducted Atomically' });
      // Refresh data
      const { data } = await supabase.from('components').select('*').eq('id', id).single();
      setComponent(data);
    }
  };

  if (!component) return <div className="p-10 animate-pulse text-slate-400">Loading Neural Link...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-sky-500 font-bold transition-colors">
        <ArrowLeft size={20} /> BACK TO VAULT
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Component Specs */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center text-sky-400 mb-6">
            <Cpu size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase">{component.name}</h1>
          <p className="text-slate-400 font-bold tracking-widest text-xs mb-8">{component.part_number}</p>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-slate-400 font-medium">Physical Stock</span>
              <span className="font-black text-slate-900">{component.current_stock} units</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-slate-400 font-medium">AI Safety Limit (20%)</span>
              <span className="font-black text-rose-500">{(component.min_required * 0.2).toFixed(0)} units</span>
            </div>
          </div>
        </div>

        {/* Right: Atomic Action Panel */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-sky-900/20">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-sky-400" /> Production Trigger
            </h2>
            <p className="text-slate-400 text-sm mb-8">Execute mass deduction across all mapped sub-components.</p>
            
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Batch Quantity</label>
            <input 
              type="number" 
              value={prodQty}
              onChange={(e) => setProdQty(e.target.value)}
              className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 mt-2 text-xl font-black focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          <div className="mt-8 space-y-4">
            {status.msg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                status.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                'bg-sky-500/10 text-sky-400'
              }`}>
                {status.type === 'error' ? <AlertOctagon size={16} /> : <Play size={16} />}
                {status.msg}
              </div>
            )}
            
            <button 
              onClick={handleAtomicProduction}
              className="w-full bg-sky-500 hover:bg-sky-400 py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-sky-500/20"
            >
              <Play fill="currentColor" /> INITIATE PRODUCTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;
