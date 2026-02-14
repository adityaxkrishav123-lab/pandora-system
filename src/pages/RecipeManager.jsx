import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Trash2, Save, Cpu } from 'lucide-react';

const RecipeManager = () => {
  const [inventory, setInventory] = useState([]);
  const [pcbName, setPcbName] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]); // [{id, qty}]

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

  const updateRow = (index, field, value) => {
    const updated = [...selectedComponents];
    updated[index][field] = value;
    setSelectedComponents(updated);
  };

  const saveRecipe = async () => {
    if (!pcbName || selectedComponents.length === 0) return alert("Fill all fields!");

    // 1. Create the PCB Type
    const { data: pcb, error: pcbErr } = await supabase
      .from('pcb_types')
      .insert([{ pcb_name: pcbName }])
      .select()
      .single();

    if (pcbErr) return alert("Error creating PCB: " + pcbErr.message);

    // 2. Link the components in the Recipe table
    const recipeData = selectedComponents.map(item => ({
      pcb_id: pcb.id,
      component_id: item.component_id,
      quantity_required: item.quantity
    }));

    const { error: recErr } = await supabase.from('pcb_recipes').insert(recipeData);

    if (recErr) alert("Error saving recipe: " + recErr.message);
    else {
      alert("🏆 Recipe Saved! Ready for Production.");
      setPcbName('');
      setSelectedComponents([]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-8">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase flex items-center gap-3">
          <Cpu className="text-sky-500" /> Define New PCB Recipe
        </h2>

        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="Enter PCB Name (e.g. Bajaj-V3-Controller)"
            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-sky-500 outline-none font-bold text-lg"
            value={pcbName}
            onChange={(e) => setPcbName(e.target.value)}
          />

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Required Components</h4>
            {selectedComponents.map((item, index) => (
              <div key={index} className="flex gap-4 animate-in slide-in-from-left-2">
                <select 
                  className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 outline-none font-medium"
                  onChange={(e) => updateRow(index, 'component_id', e.target.value)}
                >
                  <option value="">Select Part from Inventory...</option>
                  {inventory.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.name} ({inv.part_number})</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Qty"
                  className="w-24 bg-slate-50 border-none rounded-xl py-3 px-4 outline-none font-bold text-center"
                  onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={addComponentRow}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Component
            </button>
            <button 
              onClick={saveRecipe}
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-100 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} /> Save Master Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeManager;
