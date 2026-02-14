import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import ComponentDetail from './pages/ComponentDetail';
import './index.css'; // Ensure Tailwind is imported here

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Top Navigation Bar */}
          <header className="h-20 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
            <h2 className="font-bold text-slate-800 uppercase tracking-widest text-sm">System Overview</h2>
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            </div>
          </header>
          
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/component/:id" element={<ComponentDetail />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
