import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, Box, BarChart3, Zap, 
  Cpu, Activity, Clock, LogOut, Sparkles, Terminal 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  
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
    if (!error) navigate('/auth');
  };

  return (
    <>
      <div className="w-64 bg-[#020814] border-r border-white/5 min-h-screen p-6 text-white flex flex-col sticky top-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-sky-500 p-2 rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.4)]">
            <Zap size={20} fill="white"/>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">PANDORA</h1>
        </div>

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

        {/* FRIDAY AI ASSISTANT TRIGGER */}
        <div className="mt-auto space-y-4">
          <button 
            onClick={() => setAiOpen(true)}
            className="w-full p-4 bg-gradient-to-br from-sky-500/10 to-purple-500/10 border border-sky-500/20 rounded-2xl group hover:border-sky-500 transition-all text-left"
          >
            <Sparkles size={18} className="text-sky-400 mb-2 animate-pulse" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Friday Neural Link</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Initialize AI Consultant</p>
          </button>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Neural Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <span className="text-xs font-bold text-emerald-500/80 uppercase">Link Active</span>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-bold text-xs uppercase tracking-widest">
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      {/* AI TERMINAL PANEL */}
      {aiOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-[#010614] border border-sky-500/30 rounded-[2rem] shadow-2xl z-50 p-6 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-sky-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Friday_AI_v2.1</span>
            </div>
            <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-white font-bold text-xs">CLOSE</button>
          </div>
          <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-4">
            <p className="text-sky-400 text-xs font-medium italic leading-relaxed">
              "I have processed the <strong>demand_forecaster.pkl</strong> model. Patterns indicate a significant consumption increase for the <strong>Bajaj-v4</strong> assembly line starting in 4 days. Would you like me to prepare the replenishment batches?"
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all">Authorize Run</button>
            <button className="py-3 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">Ignore</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
