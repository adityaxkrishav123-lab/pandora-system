import * as XLSX from 'xlsx'; // ADDED: Professional module import
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryCard from '../components/InventoryCard';
import { Search, AlertCircle, FileUp, Database } from 'lucide-react';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('*');
    setItems(data || []);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // UNIVERSAL SMART IMPORT LOGIC
  const handleUniversalImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        
        // CHANGED: Removed "window." prefix to use the imported XLSX module
        const wb = XLSX.read(bstr, { type: 'binary' }); 
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);

        if (json.length === 0) throw new Error("File is empty!");

        const headers = Object.keys(json[0]);
        
        // Smart Column Finder
        const findColumn = (keywords) => 
          headers.find(h => keywords.some(k => h.toLowerCase().includes(k)));

        const mappedData = json.map(row => ({
          name: row[findColumn(['name', 'component', 'description'])] || "Unknown Item",
          part_number: String(row[findColumn(['code', 'part', 'id', 'sku', 'number'])] || "N/A"),
          current_stock: parseInt(row[findColumn(['stock', 'count', 'qty', 'quantity'])]) || 0,
          min_required: parseInt(row[findColumn(['min', 'required', 'limit', 'threshold'])]) || 100,
        }));

        const { error } = await supabase.from('inventory').insert(mappedData);

        if (error) throw error;
        
        alert(`🏆 Smart Mapper Active: Processed ${mappedData.length} items.`);
        fetchInventory();
      } catch (err) {
        alert("Sync Error: " + err.message);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const isCritical = item.current_stock <= (item.min_required * 0.2);
    return showCriticalOnly ? (matchesSearch && isCritical) : matchesSearch;
  });

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Database className="text-sky-500" size={32} /> Component <span className="text-sky-500">Vault</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs tracking-[0.2em] mt-2 uppercase">Neural Grid: {items.length} Units Online</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl
            ${isImporting ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'}`}>
            <FileUp size={16} /> {isImporting ? 'Syncing...' : 'Universal Import'}
            <input type="file" className="hidden" accept=".xlsx, .xls, .xlsm" onChange={handleUniversalImport} disabled={isImporting} />
          </label>

          <button 
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all
              ${showCriticalOnly 
                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
          >
            <AlertCircle size={16} /> {showCriticalOnly ? 'Critical Mode Active' : 'All Systems Nominal'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="DECRYPT COMPONENT IDENTITY OR PART NUMBER..."
          className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 shadow-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/50 outline-none transition-all text-white font-bold tracking-wider placeholder:text-slate-600"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid of Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {filteredItems.map(item => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-sm">
          <Database className="mx-auto text-slate-700 mb-6 opacity-20" size={64} />
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">No Data Strings Found</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
