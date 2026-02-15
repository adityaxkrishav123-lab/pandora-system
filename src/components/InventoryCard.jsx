import React from 'react';
import { AlertCircle, Package, TrendingDown, Leaf, ShieldCheck, ShieldAlert } from 'lucide-react';

const InventoryCard = ({ item }) => {
  // Logic for the 20% Safety Rule
  const isCritical = item.current_stock <= (item.min_required * 0.2);
  const stockPercentage = Math.min((item.current_stock / item.min_required) * 100, 100);

  // Innovation Logic: Sustainability & Risk (Mapped to your DB or Mocked)
  const co2Impact = item.co2_impact || "Low"; // e.g., 'Low', 'Med', 'High'
  const vendorRisk = item.vendor_risk || "Stable"; // e.g., 'Stable', 'Volatile'

  return (
    <div className={`relative group overflow-hidden transition-all duration-500 rounded-[2.5rem] border backdrop-blur-xl p-6 
      ${isCritical 
        ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
        : 'bg-white/5 border-white/10 hover:border-sky-500/50 shadow-xl'}`}>
      
      {/* Visual Identity Badges (Top Row) */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 
          ${co2Impact === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
          <Leaf size={10} /> {co2Impact} CO2
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10
          ${vendorRisk === 'Stable' ? 'text-sky-400' : 'text-red-400'}`}>
          {vendorRisk === 'Stable' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
          {vendorRisk} Risk
        </div>
      </div>

      {/* Abstract Mesh Glow Effect */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-all duration-700 group-hover:opacity-40
        ${isCritical ? 'bg-red-600' : 'bg-sky-500'}`}></div>

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/20 text-sky-400'}`}>
            {isCritical ? <AlertCircle size={20} /> : <Package size={20} />}
          </div>
          {isCritical && (
            <span className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-full animate-pulse tracking-widest">
              CRITICAL
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-white tracking-tighter uppercase leading-tight group-hover:text-sky-400 transition-colors">
            {item.name}
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            SN: {item.part_number}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className={`text-4xl font-black tracking-tighter ${isCritical ? 'text-red-500' : 'text-white'}`}>
              {item.current_stock}
            </span>
            <span className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
              / {item.min_required} Limit
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]'}`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-500">
            <TrendingDown size={12} className={isCritical ? 'text-red-400' : 'text-sky-400'} />
            Neural Health: <span className={isCritical ? 'text-red-400' : 'text-sky-400'}>{stockPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
