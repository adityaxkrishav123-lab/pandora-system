import React, { useState } from 'react';

const ProductionPanel = ({ inventory, onStartProduction }) => {
  const [pcbId, setPcbId] = useState('');
  const [qty, setQty] = useState(0);

  const handleValidate = () => {
    // Logic from PPT: Pre-validate stock for all components [cite: 173]
    // If successful, call atomic deduction on Supabase [cite: 161]
    onStartProduction(pcbId, qty);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white">
      <h2 className="text-xl font-bold mb-6">Initiate Production</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select 
          className="bg-slate-800 border-none rounded-xl p-4 text-white"
          onChange={(e) => setPcbId(e.target.value)}
        >
          <option>Select PCB Model...</option>
          {/* Mapping from your 'pcbs' table [cite: 132] */}
        </select>
        <input 
          type="number" 
          placeholder="Quantity" 
          className="bg-slate-800 border-none rounded-xl p-4 text-white"
          onChange={(e) => setQty(e.target.value)}
        />
      </div>
      <button 
        onClick={handleValidate}
        className="w-full bg-sky-500 hover:bg-sky-400 py-4 rounded-xl font-black transition-all"
      >
        START PRODUCTION RUN
      </button>
    </div>
  );
};
