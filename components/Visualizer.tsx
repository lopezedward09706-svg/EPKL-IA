
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SystemHealth } from '../types';

interface VisualizerProps {
  systemHealth?: SystemHealth;
}

const data = [
  { time: '0s', val: 45 }, { time: '5s', val: 52 }, { time: '10s', val: 48 },
  { time: '15s', val: 70 }, { time: '20s', val: 61 }, { time: '25s', val: 85 },
  { time: '30s', val: 50 }, { time: '35s', val: 92 }, { time: '40s', val: 40 },
];

const Visualizer: React.FC<VisualizerProps> = ({ systemHealth }) => {
  return (
    <div className="h-full w-full p-6 bg-slate-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase mb-1">Neural Flux Monitoring</h2>
          <div className="text-xl font-bold text-white tracking-tight">Quantum Stability</div>
        </div>
        <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
        </div>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
            />
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#fluxGradient)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Stability</div>
            <div className="text-sm font-mono font-bold text-emerald-400">99.2%</div>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</div>
            <div className="text-sm font-mono font-bold text-blue-400">{systemHealth?.networkLatency.toFixed(0) || 12}ms</div>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">CPU Load</div>
            <div className="text-sm font-mono font-bold text-purple-400">{systemHealth?.cpu.toFixed(1) || 24.5}%</div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
