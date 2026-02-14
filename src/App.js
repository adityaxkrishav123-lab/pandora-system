import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Box, Cpu, Bell, Search } from 'lucide-react';

// Import our Pages (we will create these next)
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import ComponentDetail from './pages/ComponentDetail';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center text-white font-bold">P</div>
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
              <Cpu size={20} /> Component Detail
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search components..." className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 ring-blue-500/20 outline-none transition-all" />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <img src="https://ui-avatars.com/api/?name=Admin" alt="User" />
              </div>
            </div>
          </header>

          {/* PAGE ROUTES */}
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
