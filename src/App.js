import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// Components & Pages
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import RecipeManager from './pages/RecipeManager';
import ProductionEntry from './pages/ProductionEntry';
import History from './pages/History';
import Auth from './pages/Auth'; // Your new Login/Signup page

function App() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing or a small spinner while checking session
  if (initializing) return null; 

  return (
    <Router>
      {!session ? (
        /* If not logged in, show Auth Page */
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      ) : (
        /* If logged in, show the Full App */
     <div className="flex min-h-screen bg-[#01060f] text-slate-200">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/recipes" element={<RecipeManager />} />
              <Route path="/production" element={<ProductionEntry />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              {/* Redirect any unknown route to Dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
export default App;
