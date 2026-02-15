import * as XLSX from 'xlsx';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryCard from '../components/InventoryCard';
import { 
  Search, AlertCircle, FileUp, Database, 
  LayoutGrid, List, ChevronRight, Info, 
  TrendingUp, Leaf, ShieldAlert 
} from 'lucide-react';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('*');
    setItems(data || []);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUniversalImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' }); 
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);
        if (json.length === 0) throw new Error("File is empty!");
        const headers = Object.keys(json[0]);
        const findColumn = (keywords) => 
          headers.find(h => keywords.some(k => h.toLowerCase().includes(k)));

        const mappedData = json.map(row => ({
          name: row[findColumn(['name', 'component', 'description'])] || "Unknown Item",
          part_number: String(row[findColumn(['code', 'part', 'id', 'sku', 'number'])] || "N/A"),
          current_stock: parseInt(row[findColumn(['stock', 'count', 'qty', 'quantity'])]) || 0,
          min_required: parseInt(row[findColumn(['min', 'required', 'limit', 'threshold'])]) || 100,
          scrap_rate: parseFloat(row[findColumn(['scrap', 'waste', 'error'])]) || 2.4, // For sorting
        }));

        const { error } = await supabase.from('inventory').insert(mappedData);
        if (error) throw error;
        alert(`🏆 Smart Mapper: ${mappedData.length} items synced.`);
        fetchInventory();
      } catch (err) {
        alert("Sync Error: " + err.message);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ADVANCED SORTING & FILTERING
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || 
                            item.part_number?.toLowerCase().includes(search.toLowerCase());
      const isCritical = item.current_stock <= (item.min_required * 0.2);
      return showCriticalOnly ? (matchesSearch && isCritical) : matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'qty_high') return b.current_stock - a.current_stock;
      if (sortBy === 'qty_low') return a.current_stock - b.current_stock;
      if (sortBy === 'scrap') return (b.scrap_rate || 0) - (a.scrap_rate || 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Database className="text-sky-500" size={32} /> Component <span className="text-sky-500">Vault</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] mt-2 uppercase">Neural Grid: {items.length} Active SKUs</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Universal Import Button */}
          <label className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl
            ${isImporting ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-400 text-white'}`}>
            <FileUp size={16} /> {isImporting ? 'Syncing...' : 'Universal Import'}
            <input type="file" className="hidden" accept=".xlsx, .xls, .xlsm" onChange={handleUniversalImport} disabled={isImporting} />
          </label>

          {/* Critical Toggle */}
          <button onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all
              ${showCriticalOnly ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 text-slate-400 border-white/10'}`}>
            <AlertCircle size={16} /> {showCriticalOnly ? 'Critical Mode' : 'Standard View'}
          </button>

          {/* View Toggle */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}><List size={20} /></button>
          </div>
        </div>
      </div>

      {/* SEARCH & SORT BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={20} />
          <input type="text" placeholder="DECRYPT COMPONENT IDENTITY..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-white font-bold outline-none focus:border-sky-500/50" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select onChange={(e) => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer">
          <option value="name">Sort by Name</option>
          <option value="qty_high">Qty: High to Low</option>
          <option value="qty_low">Qty: Low to High</option>
          <option value="scrap">Highest Scrap %</option>
        </select>
      </div>

      {/* RENDER LOGIC */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
              <InventoryCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        /* ECOMMERCE LIST VIEW */
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase">Component Identity</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase text-center">In Stock</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase text-center">Health Status</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase text-center">Scrap Rate</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const isCritical = item.current_stock <= (item.min_required * 0.2);
                return (
                  <tr key={item.id} onClick={() => setSelectedItem(item)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="p-6">
                      <p className="text-white font-bold group-hover:text-sky-400">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{item.part_number}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`text-lg font-black ${isCritical ? 'text-red-500' : 'text-white'}`}>{item.current_stock}</span>
                      <span className="text-[10px] text-slate-500 ml-2">/ {item.min_required}</span>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${isCritical ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {isCritical ? 'CRITICAL' : 'OPTIMAL'}
                      </span>
                    </td>
                    <td className="p-6 text-center font-bold text-slate-400">{item.scrap_rate || '2.4'}%</td>
                    <td className="p-6 text-right"><ChevronRight className="inline-block text-slate-700 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL SLIDE-OVER (AI & PRODUCT DETAILS) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative w-full max-w-lg bg-[#01060f] border-l border-white/10 h-full p-10 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">Close Esc</button>
            
            <div className="mt-12 space-y-10">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/0 rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Database size={80} className="text-slate-800" />
                 <p className="absolute bottom-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Component Visual ID</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sky-500 font-black text-[10px] uppercase tracking-widest">
                   <Leaf size={14} /> CO2 Emission (Beta): Low Impact
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{selectedItem.name}</h2>
                <p className="text-slate-500 font-mono text-sm tracking-widest">{selectedItem.part_number}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Current Velocity</p>
                   <p className="text-2xl font-black text-emerald-400 flex items-center gap-2">+14% <TrendingUp size={18}/></p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Vendor Risk</p>
                   <p className="text-2xl font-black text-sky-400 flex items-center gap-2">Stable <ShieldAlert size={18}/></p>
                </div>
              </div>

              <div className="p-8 bg-sky-500/10 rounded-[2.5rem] border border-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} /></div>
                <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">Friday AI Forecast Analysis</h4>
                <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
                  "Pattern detected from <strong>demand_forecaster.pkl</strong> suggests a surge in Bajaj-V4 production. Estimated stock depletion in <span className="text-white font-black underline decoration-sky-500 underline-offset-4">4 days</span>. Recommend auto-procurement."
                </p>
              </div>

              <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
                Initiate Procurement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
