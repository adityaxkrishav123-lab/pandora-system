import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, BarChart3, Activity } from 'lucide-react';

const Analytics = () => {
  // State to hold our chart data
  const [chartData, setChartData] = useState([
    { name: 'W1', actual: 400, predicted: 450 },
    { name: 'W2', actual: 12000, predicted: 11000 },
    { name: 'W3', actual: 800, predicted: 900 },
    { name: 'W4', actual: 15000, predicted: 16000 },
  ]);
  const [loading, setLoading] = useState(false);

  // This function talks to your Render Backend
  const updatePrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://pandora-backend-1.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumption: 15000, // This would normally come from your Supabase
          current_stock: 20000,
          min_required: 5000
        }),
      });

      const result = await response.json();
      
      // We update the 'W4' predicted value with the real answer from Python
      const newData = [...chartData];
      newData[3].predicted = result.forecast;
      setChartData(newData);
    } catch (error) {
      console.error("AI Sync Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePrediction();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 uppercase">Neural Analytics</h1>
        <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${loading ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
          <Activity size={14} className={loading ? 'animate-pulse' : ''} />
          {loading ? 'AI CALCULATING...' : 'NEURAL ENGINE ONLINE'}
        </div>
      </div>
      
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-10">
          <BarChart3 className="text-sky-500" /> AI Demand Forecast (Live Stream)
        </h3>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)'}} 
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#0ea5e9" 
                fillOpacity={0.1} 
                fill="#0ea5e9" 
                strokeWidth={4} 
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#f59e0b" 
                fill="transparent" 
                strokeDasharray="5 5" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
          <BrainCircuit className="text-sky-400 mb-4" size={32} />
          <h4 className="text-lg font-bold mb-2">AI Reasoning</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            The neural engine is currently processing historical consumption patterns. 
            Forecasts are being generated using a hybrid XGBoost-Regression model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
