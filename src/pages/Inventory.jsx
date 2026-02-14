import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryCard from '../components/InventoryCard';
import { Search, AlertCircle, Plus } from 'lucide-react';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase.from('components').select('*');
      setItems(data || []);
    };
    fetchInventory();
  }, []);

  // Logic: 20% Safety Rule Filter
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const isCritical = item.current_stock <= (item.min_required * 0.2);
    return showCriticalOnly ? (matchesSearch && isCritical) : matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Component Vault</h1>
          <p className="text-slate-500 text-sm font-medium italic">Atomic Stock Control Active</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
              ${showCriticalOnly ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            <AlertCircle size={14} /> {showCriticalOnly ? 'SHOWING CRITICAL' : 'FILTER CRITICAL'}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search component database..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
