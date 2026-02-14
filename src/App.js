import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // We will create this
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Persistent Sidebar from your UI reference */}
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* Redirectable AI Insight Detail Page */}
            <Route path="/insight/:id" element={<ComponentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
