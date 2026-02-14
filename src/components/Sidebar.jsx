import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, BarChart3, Settings, Zap } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/' },
    { name: 'Inventory', icon: <Box size={20}/>, path: '/inventory' },
    { name: 'Analytics', icon: <BarChart3 size={20}/>, path: '/analytics' },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen p-6 text-white flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-sky-500 p-2 rounded-lg"><Zap size={20} fill="white"/></div>
        <h1 className="text-xl font-bold tracking-tight">PANDORA <span className="text-sky-500">AI</span></h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold">AI ENGINE LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
