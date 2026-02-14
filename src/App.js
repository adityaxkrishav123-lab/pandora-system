import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Box, Cpu, Bell, Search } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import ComponentDetail from './pages/ComponentDetail';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl tracking-tight">PANDORA</span>
          </div>
          <nav className="space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-600 hover:text-blue-600">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/inventory" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-600 hover:text-blue-600">
              <Box size={20} /> Inventory
            </Link>
            <Link to="/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-600 hover:text-blue-600">
              <BarChart3 size={20} /> Analytics
            </Link>
            <Link to="/detail" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-600 hover:text-blue-600">
              <Cpu size={20} /> AI Insights
            </Link>
          </nav>
        </aside>

        <main className="flex-1 flex flex-col">
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search components..." className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 outline-none" />
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/detail" element={<ComponentDetail />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
