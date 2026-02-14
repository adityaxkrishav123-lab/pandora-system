import React from 'react';
import { useNavigate } from 'react-router-dom';

const AIInsightPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-sky-500 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white/20 p-3 rounded-2xl">🤖</div>
        <div>
          <h2 className="text-xl font-bold">AI-Powered Insights</h2>
          <p className="text-white/80 text-sm">Smart recommendations based on consumption patterns [cite: 131]</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clicking these redirects to the detailed analytics pages */}
        <div onClick={() => navigate('/analytics')} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl cursor-pointer hover:bg-white/20">
          <p className="text-yellow-300 font-bold text-sm mb-2">⚠ Stock Alert</p>
          <p className="text-sm">5 components will reach critical levels within 2 weeks [cite: 198]</p>
        </div>
        {/* Add other insight cards here... */}
      </div>
    </div>
  );
};
