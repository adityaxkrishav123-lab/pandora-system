import React from 'react';
import { Zap } from 'lucide-react';

const ComponentDetail = () => (
  <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
    <div className="relative z-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
          <Zap size={20} />
        </div>
        <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
      </div>
      <p className="text-slate-400 text-lg mb-8 italic">"Friday suggests reordering STM32 controllers before Tuesday to avoid production delays based on current consumption patterns."</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
          <p className="text-4xl font-black text-cyan-400 mb-1">68%</p>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Healthy Stock</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
          <p className="text-4xl font-black text-orange-400 mb-1">18%</p>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Low Stock</p>
        </div>
      </div>
    </div>
    {/* Background Decorative Element */}
    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
  </div>
);

export default ComponentDetail;
