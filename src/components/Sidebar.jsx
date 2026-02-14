import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, BarChart3, Zap, Cpu, Activity, Clock } from 'lucide-react'; // Added Clock

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/' },
    { name: 'Inventory', icon: <Box size={20}/>, path: '/inventory' },
    { name: 'PCB Recipes', icon: <Cpu size={20}/>, path: '/recipes' },
    { name: 'Production', icon: <Activity size={20}/>, path: '/production' },
    { name: 'History', icon: <Clock size={20}/>, path: '/history' }, // Added this
    { name: 'Analytics', icon: <BarChart3 size={20}/>, path: '/analytics' },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen p-6 text-white flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-sky-500 p-2 rounded-lg"><Zap size={20} fill="white"/></div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">PANDORA</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
              : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-500/80">Active</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
