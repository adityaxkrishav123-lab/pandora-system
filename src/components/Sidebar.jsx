import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, Box, BarChart3, Zap, 
  Cpu, Activity, Clock, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/' },
    { name: 'Inventory', icon: <Box size={20}/>, path: '/inventory' },
    { name: 'PCB Recipes', icon: <Cpu size={20}/>, path: '/recipes' },
    { name: 'Production', icon: <Activity size={20}/>, path: '/production' },
    { name: 'History', icon: <Clock size={20}/>, path: '/history' },
    { name: 'Analytics', icon: <BarChart3 size={20}/>, path: '/analytics' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/auth'); // Redirect to your new Cyber-Login page
    } else {
      alert("Neural Shutdown Error: " + error.message);
    }
  };

  return (
    <div className="w-64 bg-[#020814] border-r border-white/5 min-h-screen p-6 text-white flex flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-sky-500 p-2 rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.4)]">
          <Zap size={20} fill="white"/>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">PANDORA</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === item.path 
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      {/* System Status & Logout Section */}
      <div className="mt-auto space-y-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Neural Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-xs font-bold text-emerald-500/80 uppercase">Link Active</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
