import React from 'react';
import { Plus } from 'lucide-react';

const Inventory = () => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-xl">System Inventory</h3>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-blue-700 transition-all">
        <Plus size={18} /> Add Component
      </button>
    </div>
    <table className="w-full text-left">
      <thead>
        <tr className="text-slate-400 text-sm border-b border-slate-50">
          <th className="pb-4 font-medium">Part Number</th>
          <th className="pb-4 font-medium">Component</th>
          <th className="pb-4 font-medium">Stock Level</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        <tr className="hover:bg-slate-50 transition-colors">
          <td className="py-4 font-mono text-sm">STM32-01</td>
          <td className="py-4 font-bold">STM32F103 MCU</td>
          <td className="py-4"><span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">1,247 units</span></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Inventory;
