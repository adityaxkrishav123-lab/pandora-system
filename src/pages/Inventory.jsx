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
    // Note: Ensure table name matches your Supabase (inventory or components)
    const { data } = await supabase.from('inventory').select('*');
    setItems(data || []);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Excel Import Logic using CDN Library
 const handleUniversalImport = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async (evt) => {
    const bstr = evt.target.result;
    const wb = window.XLSX.read(bstr, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = window.XLSX.utils.sheet_to_json(ws);

    if (json.length === 0) return alert("File is empty!");

    // SMART MAPPING: Look for common keywords in headers
    const headers = Object.keys(json[0]);
    
    const findColumn = (keywords) => 
      headers.find(h => keywords.some(k => h.toLowerCase().includes(k)));

    const mappedData = json.map(row => ({
      // If it finds "Part", "Name", or "Component", it uses that column
      name: row[findColumn(['name', 'component', 'description'])] || "Unknown Item",
      part_number: row[findColumn(['code', 'part', 'id', 'sku'])] || "N/A",
      current_stock: parseInt(row[findColumn(['stock', 'count', 'qty', 'quantity'])]) || 0,
      min_required: parseInt(row[findColumn(['min', 'required', 'limit'])]) || 100,
    }));

    const { error } = await supabase.from('inventory').insert(mappedData);

    if (error) alert("Sync Error: " + error.message);
    else {
      alert(`🏆 Successfully imported ${mappedData.length} items using Smart Mapping!`);
      window.location.reload();
    }
  };
  reader.readAsBinaryString(file);
};

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    // Critical if stock is less than 20% of monthly requirement
    const isCritical = item.current_stock <= (item.min_required * 0.2);
    return showCriticalOnly ? (matchesSearch && isCritical) : matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <Database className="text-sky-500" /> Component Vault
          </h1>
          <p className="text-slate-500 text-sm font-medium">Managing {items.length} Atomic Units</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Excel Import Button (Feature 8) */}
          <label className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg
            ${isImporting ? 'bg-slate-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'}`}>
            <FileUp size={16} /> {isImporting ? 'SYNCING...' : 'IMPORT BAJAJ EXCEL'}
            <input type="file" className="hidden" accept=".xlsx, .xls, .xlsm" onChange={handleExcelImport} disabled={isImporting} />
          </label>

          <button 
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all
              ${showCriticalOnly ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            <AlertCircle size={16} /> {showCriticalOnly ? 'CRITICAL MODE' : 'ALL STOCK'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Query component ID or name..."
          className="w-full bg-white border border-slate-200 rounded-[2rem] py-5 pl-14 pr-6 shadow-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all text-slate-700 font-medium"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid of Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Database className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Components Found</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
