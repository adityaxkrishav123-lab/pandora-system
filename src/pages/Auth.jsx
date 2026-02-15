import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authProcessing, setAuthProcessing] = useState(false);
  const navigate = useNavigate();

  // Neural Preloader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthProcessing(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // FIX: Ensures verification sends you back to the live site, not localhost
            emailRedirectTo: window.location.origin 
          }
        });
        if (error) throw error;
        alert("Verification link sent to your Neural ID (Email).");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/'); 
      }
    } catch (error) {
      alert("Neural Access Denied: " + error.message);
    } finally {
      setAuthProcessing(false);
    }
  };

  return (
    <>
      {/* 1. THE PRELOADER */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-6"></div>
          <p className="text-sky-500 font-black text-[10px] tracking-[0.5em] uppercase animate-pulse">
            Initializing Pandora Protocol...
          </p>
        </div>
      )}

      {/* 2. THE PREMIUM AUTH PAGE */}
      <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">
        {/* Background Visuals */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="bg-sky-500 p-4 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.3)] mb-6">
                <BrainCircuit className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
                {isSignUp ? 'Register' : 'Access Gate'}
              </h2>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
                {isSignUp ? 'Create New Admin Credentials' : 'Identify Authorized Personnel'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="ADMIN EMAIL" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="SECURITY KEY" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 transition-all font-bold text-sm"
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={authProcessing}
                className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-sky-400 hover:text-white transition-all uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                {authProcessing ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {isSignUp ? 'Generate Identity' : 'Establish Link'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-black text-sky-500 uppercase tracking-widest cursor-pointer hover:text-sky-300 transition-colors"
              >
                {isSignUp ? 'Already Validated? Return to Gate' : 'New Personnel? Request Clearance'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
