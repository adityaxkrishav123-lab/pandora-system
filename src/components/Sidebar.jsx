import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, BarChart3, Zap } from 'lucide-react';

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
        <h1 className="text-xl font-bold tracking-tight text-white">PANDORA</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;
