import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Box, BarChart3, Cpu } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import ComponentDetail from './pages/ComponentDetail';

const App = () => (
  <Router>
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
        <div className="font-bold text-xl mb-10 text-blue-600 px-2 uppercase tracking-widest">Pandora</div>
        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-3 p-2 hover:text-blue-600 font-bold"><LayoutDashboard size={20}/> Dashboard</Link>
          <Link to="/inventory" className="flex items-center gap-3 p-2 hover:text-blue-600 font-bold"><Box size={20}/> Inventory</Link>
          <Link to="/analytics" className="flex items-center gap-3 p-2 hover:text-blue-600 font-bold"><BarChart3 size={20}/> Analytics</Link>
          <Link to="/detail" className="flex items-center gap-3 p-2 hover:text-blue-600 font-bold"><Cpu size={20}/> AI Insights</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/detail" element={<ComponentDetail />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
