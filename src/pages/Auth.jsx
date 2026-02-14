import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Hide preloader after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Verification email sent! Check your inbox.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/'); // Redirect to Dashboard on success
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* 1. THE PRELOADER */}
      {loading && (
        <div id="preloader">
          <div className="eye-iris"></div>
          <p style={{ marginTop: '30px', letterSpacing: '4px', fontSize: '0.7rem', color: 'var(--cyan)', fontWeight: 'bold' }}>
            INITIALIZING PANDORA PROTOCOL...
          </p>
        </div>
      )}

      {/* 2. THE AUTH PAGE */}
      <div id="login-page">
        <div className="login-card">
          <h2 style={{ fontFamily: 'Cinzel', color: 'var(--cyan)', letterSpacing: '5px' }}>
            {isSignUp ? 'REGISTER' : 'ACCESS GATE'}
          </h2>
          <p style={{ fontSize: '0.6rem', letterSpacing: '4px', marginBottom: '20px', opacity: 0.6, color: 'white' }}>
            {isSignUp ? 'CREATE YOUR CREDENTIALS' : 'IDENTIFY AUTHORIZED PERSONNEL'}
          </p>
          
          <form onSubmit={handleAuth}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Security Key" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            <button type="submit" className="login-btn">
              {isSignUp ? 'CREATE ACCOUNT' : 'ESTABLISH LINK'}
            </button>
          </form>

          <p 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ marginTop: '20px', fontSize: '0.7rem', color: 'var(--cyan)', cursor: 'pointer', opacity: 0.8 }}
          >
            {isSignUp ? 'ALREADY REGISTERED? LOGIN' : 'NEW PERSONNEL? REQUEST ACCESS'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
