import React from 'react';
import { AlertCircle, Package, TrendingDown } from 'lucide-react';

const InventoryCard = ({ item }) => {
  // Logic for the 20% Safety Rule
  const isCritical = item.current_stock <= (item.min_required * 0.2);
  const stockPercentage = Math.min((item.current_stock / item.min_required) * 100, 100);

  return (
    <div className={`relative group overflow-hidden transition-all duration-500 rounded-[2rem] border backdrop-blur-xl p-6 
      ${isCritical 
        ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
        : 'bg-white/5 border-white/10 hover:border-sky-500/50 shadow-xl'}`}>
      
      {/* Abstract Mesh Glow Effect */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-all duration-700 group-hover:opacity-40
        ${isCritical ? 'bg-red-600' : 'bg-sky-500'}`}></div>

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/20 text-sky-400'}`}>
            {isCritical ? <AlertCircle size={20} /> : <Package size={20} />}
          </div>
          {isCritical && (
            <span className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
              LOW STOCK
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{item.name}</h3>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">{item.part_number}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-white">{item.current_stock}</span>
            <span className="text-xs font-bold text-slate-400 mb-1">/ {item.min_required} Target</span>
          </div>
          
          {/* Custom Glass Progress Bar */}
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-sky-500'}`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-500">
          <TrendingDown size={12} />
          Inventory Health: <span className={isCritical ? 'text-red-400' : 'text-emerald-400'}>{stockPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
