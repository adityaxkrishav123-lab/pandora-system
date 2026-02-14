import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', val: 400 }, { name: 'Feb', val: 300 },
  { name: 'Mar', val: 600 }, { name: 'Apr', val: 800 },
  { name: 'May', val: 500 }, { name: 'Jun', val: 900 },
];

const Analytics = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
      <h3 className="font-bold text-lg mb-6 text-slate-800">Component Usage Trends</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
            <YAxis hide />
            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
            <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Analytics;
