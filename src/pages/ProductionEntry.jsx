import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Activity, AlertTriangle, CheckCircle, Package, ArrowRight } from 'lucide-react';

const ProductionEntry = () => {
  const [pcbs, setPcbs] = useState([]);
  const [selectedPcb, setSelectedPcb] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('idle'); // idle, checking, success, error
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Load the PCB Recipes you created earlier
  useEffect(() => {
    const fetchPcbs = async () => {
      const { data } = await supabase.from('pcb_types').select('*');
      setPcbs(data || []);
    };
    fetchPcbs();
  }, []);

  const handleProduction = async () => {
    if (!selectedPcb) return alert("Please select a PCB model");
    
    setStatus('checking');
    setErrorMsg('');

    try {
      // 2. Fetch the Recipe AND the Current Stock for those components
      const { data: recipe, error: recError } = await supabase
        .from('pcb_recipes')
        .select(`
          quantity_required,
          component_id,
          inventory:component_id (name, current_stock)
        `)
        .eq('pcb_id', selectedPcb);

      if (recError || !recipe.length) {
        throw new Error("No recipe found for this PCB. Create one in 'PCB Recipes' first.");
      }

      // 3. Stock Validation Logic (THE CORE SCORING LOGIC)
      let updates = [];
      for (const item of recipe) {
        const totalNeeded = item.quantity_required * quantity;
        const currentStock = item.inventory.current_stock;

        if (currentStock < totalNeeded) {
          throw new Error(`INSUFFICIENT STOCK: ${item.inventory.name}. Need ${totalNeeded}, but only ${currentStock} available.`);
        }

        // Prepare the update object
        updates.push({
          id: item.component_id,
          new_stock: currentStock - totalNeeded
        });
      }

      // 4. Execute Stock Deduction (Update Inventory)
      for (const update of updates) {
        await supabase
          .from('inventory')
          .update({ current_stock: update.new_stock })
          .eq('id', update.id);
      }

      // 5. Log the Production History
      await supabase.from('production_logs').insert([
        { pcb_id: selectedPcb, quantity_produced: quantity }
      ]);

      setStatus('success');
      setQuantity(1);
      alert("🏆 Production Successful! Stock has been deducted.");
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-white relative">
          <Activity className="absolute right-10 top-10 text-sky-400 opacity-20" size={120} />
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Production Command</h1>
          <p className="text-slate-400 font-medium">Execute PCB Assembly & Stock Sync</p>
        </div>

        <div className="p-10 space-y-8">
          {/* PCB Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target PCB Model</label>
            <div className="relative">
              <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl py-5 pl-14 pr-6 outline-none font-bold text-slate-700 transition-all appearance-none"
                onChange={(e) => {
                  setSelectedPcb(e.target.value);
                  setStatus('idle');
                }}
              >
                <option value="">Select Recipe...</option>
                {pcbs.map(p => <option key={p.id} value={p.id}>{p.pcb_name}</option>)}
              </select>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Units to Produce</label>
            <input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 rounded-2xl py-5 px-6 outline-none font-black text-2xl text-slate-800 transition-all"
            />
          </div>

          {/* Error Message Display */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-4 animate-in shake duration-300">
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <p className="text-red-700 text-sm font-bold">{errorMsg}</p>
            </div>
          )}

          {/* Success Message Display */}
          {status === 'success' && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center gap-4">
              <CheckCircle className="text-emerald-500" size={24} />
              <p className="text-emerald-700 text-sm font-bold">Production logged successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <button 
            onClick={handleProduction}
            disabled={status === 'checking'}
            className={`w-full group py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl
              ${status === 'checking' ? 'bg-slate-200 text-slate-400' : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200 hover:-translate-y-1'}`}
          >
            {status === 'checking' ? 'Validating Stock...' : (
              <>
                Release Production <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionEntry;
