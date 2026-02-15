import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Save, Cpu, Layers, Trash2 } from 'lucide-react';

const RecipeManager = () => {
  const [inventory, setInventory] = useState([]);
  const [pcbName, setPcbName] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase.from('inventory').select('*');
      setInventory(data || []);
    };
    fetchInventory();
  }, []);

  const addComponentRow = () => {
    setSelectedComponents([...selectedComponents, { component_id: '', quantity: 1 }]);
  };

  const removeRow = (index) => {
    const updated = selectedComponents.filter((_, i) => i !== index);
    setSelectedComponents(updated);
  };

  const updateRow = (index, field, value) => {
    const updated = [...selectedComponents];
    updated[index][field] = value;
    setSelectedComponents(updated);
  };

  const saveRecipe = async () => {
    if (!pcbName || selectedComponents.length === 0) return alert("Neural Error: Fill all fields!");

    const { data: pcb, error: pcbErr } = await supabase
      .from('pcb_types')
      .insert([{ pcb_name: pcbName }])
      .select()
      .single();

    if (pcbErr) return alert("Sync Error: " + pcbErr.message);

    const recipeData = selectedComponents.map(item => ({
      pcb_id: pcb.id,
      component_id: item.component_id,
      quantity_required: item.quantity
    }));

    const { error: recErr } = await supabase.from('pcb_recipes').insert(recipeData);

    if (recErr) alert("Encryption Error: " + recErr.message);
    else {
      alert("🏆 Master Recipe Saved to Neural Core!");
      setPcbName('');
      setSelectedComponents([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 space-y-8 text-white animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Recipe <span className="text-sky-500">Architect</span></h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Design Immutable PCB Blueprints</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] ml-2">PCB Identity</label>
            <div className="relative group">
              <Cpu className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Enter PCB Model Name (e.g. Bajaj-V4-Pro)"
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 focus:border-sky-500/50 outline-none font-black text-xl text-white placeholder:text-slate-700 transition-all"
                value={pcbName}
                onChange={(e) => setPcbName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Layers size={14} className="text-sky-500" /> Component Requirements
              </h4>
            </div>

            <div className="space-y-3">
              {selectedComponents.map((item, index) => (
                <div key={index} className="flex gap-4 animate-in slide-in-from-left-4 duration-300">
                  <select 
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none font-bold text-sm text-white appearance-none focus:border-sky-500/50"
                    onChange={(e) => updateRow(index, 'component_id', e.target.value)}
                    value={item.component_id}
                  >
                    <option value="" className="bg-[#0f172a]">Select Component...</option>
                    {inventory.map(inv => (
                      <option key={inv.id} value={inv.id} className="bg-[#0f172a]">{inv.name} — {inv.part_number}</option>
                    ))}
                  </select>
                  
                  <input 
                    type="number" 
                    placeholder="Qty"
                    className="w-28 bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none font-black text-center text-sky-500 focus:border-sky-500/50"
                    value={item.quantity}
                    onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                  />

                  <button 
                    onClick={() => removeRow(index)}
                    className="p-4 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button 
              onClick={addComponentRow}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              <Plus size={18} className="text-sky-500" /> Add Component Row
            </button>
            <button 
              onClick={saveRecipe}
              className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              <Save size={18} /> Commit Master Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeManager;
