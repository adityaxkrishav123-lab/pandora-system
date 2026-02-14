import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryCard from '../components/InventoryCard';
import { Search, Filter, AlertCircle, Plus } from 'lucide-react';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('components').select('*');
    if (!error) setItems(data);
    setLoading(false);
  };

  // Logic: Filter by search text AND the 20% Safety Rule
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.part_number.toLowerCase().includes(search.toLowerCase());
    const isCritical = item.current_stock <= (0.2 * item.min_required);
    
    return showCriticalOnly ? (matchesSearch && isCritical) : matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Component Vault</h1>
          <p className="text-slate-500 text-sm font-medium">Physical stock levels synchronized with AI forecasting</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
              ${showCriticalOnly 
                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
          >
            <AlertCircle size={14} /> {showCriticalOnly ? 'SHOWING CRITICAL' : 'FILTER CRITICAL'}
          </button>
          <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-sky-500 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or part number..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500 transition-all font-medium text-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2rem]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No components found</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
