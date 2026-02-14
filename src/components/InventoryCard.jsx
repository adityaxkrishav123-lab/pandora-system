import React from 'react';
import { BrainCircuit, AlertCircle, TrendingDown } from 'lucide-react';

const InventoryCard = ({ item }) => {
  const isCritical = item.current_stock <= (0.2 * item.min_required);
  const stockPercentage = (item.current_stock / item.min_required) * 100;

  return (
    <div className={`bg-white rounded-[2rem] p-6 border transition-all ${isCritical ? 'border-red-100 shadow-red-50' : 'border-slate-100 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-800">{item.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.part_number}</p>
        </div>
        <div className={`p-3 rounded-2xl ${isCritical ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-sky-400'}`}>
          {isCritical ? <AlertCircle size={18} /> : <BrainCircuit size={18} />}
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-end"><span className="text-2xl font-black">{item.current_stock}</span><span className="text-xs font-bold text-slate-400">/ {item.min_required} MIN</span></div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-sky-500'}`} style={{ width: `${Math.min(stockPercentage, 100)}%` }} />
        </div>
      </div>
    </div>
  );
};
export default InventoryCard;
