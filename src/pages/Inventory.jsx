import React from 'react';
import { TrendingUp, TrendingDown, BrainCircuit, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryCard = ({ item }) => {
  const navigate = useNavigate();

  // Logic: 20% Safety Rule + Percentage calculation
  const isCritical = item.current_stock <= (0.2 * item.min_required);
  const stockPercentage = (item.current_stock / item.min_required) * 100;

  return (
    <div className={`relative bg-white rounded-[2rem] p-6 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 
      ${isCritical ? 'border-red-100 shadow-red-50' : 'border-slate-100 shadow-slate-100'}`}>
      
      {/* Top Section: Title & AI Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-[70%]">
          <h3 className="text-lg font-black text-slate-800 leading-tight truncate">{item.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.part_number}</p>
        </div>
        <div className={`p-3 rounded-2xl ${isCritical ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-sky-400'}`}>
          {isCritical ? <AlertCircle size={18} /> : <BrainCircuit size={18} />}
        </div>
      </div>

      {/* Mid Section: Stock Health Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-black text-slate-900 leading-none">
            {item.current_stock}
          </span>
          <span className={`text-xs font-bold ${isCritical ? 'text-red-500' : 'text-slate-400'}`}>
             / {item.min_required} MIN
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isCritical ? 'bg-red-500' : 'bg-sky-500'}`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Bottom Section: AI Forecast & Navigation */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI FORECAST</span>
          <div className="flex items-center gap-1">
            {item.trend === 'up' ? 
              <TrendingUp size={14} className="text-emerald-500" /> : 
              <TrendingDown size={14} className="text-rose-500" />
            }
            <span className="text-sm font-black text-slate-700">{item.ai_days_left || '14'} DAYS</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate(`/component/${item.id}`)}
          className="bg-slate-50 hover:bg-sky-500 hover:text-white p-3 rounded-xl transition-colors group"
        >
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 20% Rule Badge Overlay */}
      {isCritical && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
          CRITICAL REFILL
        </div>
      )}
    </div>
  );
};

export default InventoryCard;
