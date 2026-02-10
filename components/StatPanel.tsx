
import React from 'react';
// Fix: Removed Lucide icons from recharts import and kept only valid recharts members
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
// Fix: Added the missing icons to the lucide-react import
import { Shield, FileText, Search, Bug, CheckCircle, FileChartLine, Key } from 'lucide-react';

const trendData = [
  { time: '2021-10-07 17', alerts: 18000, logs: 65000 },
  { time: '2021-10-07 21', alerts: 62000, logs: 10000 },
  { time: '2021-10-08 01', alerts: 68000, logs: 12000 },
  { time: '2021-10-08 05', alerts: 45000, logs: 11000 },
  { time: '2021-10-08 09', alerts: 30000, logs: 15000 },
  { time: '2021-10-08 13', alerts: 2500, logs: 70000 },
  { time: '2021-10-08 17', alerts: 42000, logs: 12000 },
  { time: '2021-10-08 21', alerts: 15000, logs: 45000 },
];

const predictionData = [
  { name: '攻击入侵', value: 5.5 },
  { name: '信息危害', value: 1.2 },
  { name: '安全预警', value: 3.5 },
  { name: '恶意代码', value: 2.2 },
  { name: '信息侦察', value: 4.2 },
];

export const TrendChart: React.FC = () => (
  <div className="h-44 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#ffffff40" 
          fontSize={10} 
          tickFormatter={(val) => val.split(' ')[1]}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="#ffffff40" 
          fontSize={10} 
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Tooltip contentStyle={{ backgroundColor: '#001a33cc', borderColor: '#22d3ee', color: '#fff' }} />
        <Area type="monotone" dataKey="alerts" stroke="#ffaa00" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2} />
        <Area type="monotone" dataKey="logs" stroke="#00f2ff" fillOpacity={1} fill="url(#colorLogs)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const PredictionBarChart: React.FC = () => (
  <div className="h-44 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={predictionData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#ffffff60" 
          fontSize={10} 
          axisLine={false} 
          tickLine={false}
          interval={0}
        />
        <YAxis 
          stroke="#ffffff60" 
          fontSize={10} 
          axisLine={false} 
          tickLine={false}
          tickFormatter={(value) => `${value}M`}
          domain={[0, 6]}
          ticks={[0, 1, 2, 3, 4, 5, 6]}
        />
        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#001a33cc', borderColor: '#22d3ee', color: '#fff' }} />
        <Bar dataKey="value" barSize={25}>
          {predictionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="url(#cyanGlow)" />
          ))}
        </Bar>
        <defs>
          <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f2ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#00f2ff" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const AssetRankList: React.FC = () => {
  const assets = [
    { rank: 'TOP1', ip: '115.231.54.13', loc: '宁波', logs: '54.96M', color: 'bg-gradient-to-r from-orange-600 to-orange-400' },
    { rank: 'TOP2', ip: '111.197.221.3', loc: '北京', logs: '44.95M', color: 'bg-gradient-to-r from-orange-600 to-orange-400' },
    { rank: 'TOP3', ip: '116.195.40.100', loc: '上海', logs: '44.02M', color: 'bg-gradient-to-r from-orange-600 to-orange-400' },
    { rank: 'TOP4', ip: '110.17.71.41', loc: '包头', logs: '43.97M', color: 'bg-gradient-to-r from-blue-600 to-cyan-500' },
    { rank: 'TOP5', ip: '134.225.72.28', loc: '英国', logs: '32.99M', color: 'bg-gradient-to-r from-blue-600 to-cyan-500' },
  ];

  return (
    <div className="space-y-2 mt-4">
      {assets.map((item, i) => (
        <div key={i} className="flex items-center gap-2 bg-blue-900/10 border border-white/5 py-1 px-2 hover:bg-blue-900/20 transition-all">
          <div className={`${item.color} text-[10px] font-black px-2 py-0.5 rounded-sm skew-x-[-15deg] shadow-[0_0_10px_rgba(249,115,22,0.3)]`}>
            <span className="skew-x-[15deg] block">{item.rank}</span>
          </div>
          <div className="flex-1 flex justify-between items-center text-[11px]">
            <span className="text-white/80 font-medium">{item.ip}{item.loc}</span>
            <span className="text-white/40">{item.ip}</span>
            <span className="text-cyan-400 font-bold">日志:{item.logs}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SecurityZoneList: React.FC = () => {
  const zones = [
    { name: '咋回事呢', value: '252.86M', percent: 90 },
    { name: '北京故宫好...', value: '55.93M', percent: 45 },
    { name: 'null', value: '54.96M', percent: 40 },
    { name: '济南趵突泉...', value: '22.01M', percent: 20 },
    { name: '武汉湖北计...', value: '22.01M', percent: 20 },
  ];

  return (
    <div className="space-y-4 mt-6">
      {zones.map((zone, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="text-[11px] text-white/80 w-24 truncate">{zone.name}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-1000" 
              style={{ width: `${zone.percent}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
          <span className="text-[11px] font-mono text-white/60 w-16 text-right">{zone.value}</span>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string; extra?: React.ReactNode }> = ({ title, extra }) => (
  <div className="relative mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
        <h3 className="text-xl font-bold text-white tracking-widest">
          {title}
        </h3>
      </div>
      {extra && <div className="flex gap-4 text-xs text-white/60 font-medium">{extra}</div>}
    </div>
    {/* Dotted underline pattern */}
    <div className="absolute -bottom-2 left-0 w-full h-[10px] opacity-20 pointer-events-none overflow-hidden">
       <div className="flex gap-1">
         {Array.from({length: 40}).map((_, i) => (
           <div key={i} className="w-1 h-1 bg-cyan-400 shrink-0" />
         ))}
       </div>
    </div>
  </div>
);

export const StatusRow: React.FC<{ label: string; value: string | number; iconCount?: number }> = ({ label, value, iconCount = 0 }) => (
  <div className="flex items-center justify-between py-1.5 group">
    <div className="flex items-center gap-4">
      <span className="text-sm text-white/80 w-12">{label}</span>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Shield 
            key={i} 
            size={14} 
            className={`transition-colors duration-500 ${i < iconCount ? 'text-cyan-400 fill-cyan-400/20' : 'text-white/10'}`} 
          />
        ))}
      </div>
    </div>
    <span className="text-sm font-bold text-white tracking-wider font-mono">{value}</span>
  </div>
);

export const StatBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-cyan-400' }) => (
  <div className="flex-1 bg-blue-900/40 border-y border-cyan-500/30 p-2 relative overflow-hidden text-center">
    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40" />
    <div className="absolute top-0 right-0 w-1 h-full bg-cyan-500/40" />
    <div className="text-[10px] text-white/60 mb-1 uppercase font-bold">{label}</div>
    <div className={`text-sm font-bold tracking-widest ${color}`}>{value}</div>
  </div>
);

const IsometricHexagon: React.FC<{ value: number; label: string; children: React.ReactNode }> = ({ value, label, children }) => (
  <div className="flex flex-col items-center group cursor-default">
    {/* Icon Layer */}
    <div className="relative mb-2">
      <div className="text-[#22d3ee] transition-transform duration-500 group-hover:-translate-y-1">
        {children}
      </div>
    </div>

    {/* 3D Hexagon Pedestal */}
    <div className="relative w-20 h-24 flex flex-col items-center justify-center">
      {/* Top Hex Frame (Outline) */}
      <div className="absolute top-0 w-20 h-10 border border-[#22d3ee]/40 clip-hexagon-flat z-20" />
      
      {/* Middle Floating Frame */}
      <div className="absolute top-2 w-16 h-8 border border-[#22d3ee]/20 clip-hexagon-flat z-10" />

      {/* Main Body (The Blue Block) */}
      <div className="absolute bottom-4 w-20 h-14 bg-gradient-to-b from-[#004a8b] to-[#001a33] clip-hexagon-prism shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        {/* Value Inside Block */}
        <div className="flex items-center justify-center h-full pt-1">
          <span className="text-2xl font-black text-white font-cyber tracking-tighter">{value}</span>
        </div>
      </div>
      
      {/* Bottom Reflection / Shadow */}
      <div className="absolute -bottom-2 w-16 h-4 bg-[#22d3ee]/5 blur-md rounded-full" />
    </div>

    {/* Label Below Pedestal */}
    <div className="mt-[-10px] text-lg font-bold text-white tracking-widest">{label}</div>

    <style dangerouslySetInnerHTML={{ __html: `
      .clip-hexagon-flat {
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      }
      .clip-hexagon-prism {
        clip-path: polygon(25% 0%, 75% 0%, 100% 30%, 100% 100%, 75% 100%, 25% 100%, 0% 100%, 0% 30%);
      }
    `}} />
  </div>
);

export const VulnerabilitySection: React.FC = () => {
  return (
    <div className="flex justify-between items-end px-4 h-48">
      {/* Vulnerability Item */}
      <IsometricHexagon value={140} label="漏洞">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Bug size={32} strokeWidth={1.5} />
          <div className="absolute top-0 right-0 w-6 h-6 border-2 border-[#22d3ee] rounded-full flex items-center justify-center bg-[#000814]">
             <Search size={12} strokeWidth={3} />
          </div>
        </div>
      </IsometricHexagon>

      {/* Check Item */}
      <IsometricHexagon value={0} label="核查">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="relative">
            <FileChartLine size={32} strokeWidth={1.5} />
            <div className="absolute bottom-[-4px] right-[-4px] w-6 h-6 border-2 border-[#22d3ee] rounded-full flex items-center justify-center bg-[#000814]">
               <CheckCircle size={14} fill="#22d3ee" className="text-[#000814]" />
            </div>
          </div>
        </div>
      </IsometricHexagon>

      {/* Weak Password Item */}
      <IsometricHexagon value={102} label="弱口令">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="relative">
            <FileText size={32} strokeWidth={1.5} />
            <div className="absolute bottom-1 right-2">
               <Key size={18} strokeWidth={2.5} className="rotate-45" />
            </div>
          </div>
        </div>
      </IsometricHexagon>
    </div>
  );
};

// Kept for compatibility with App.tsx imports if needed
export const VulnerabilityItem: React.FC<any> = () => null;
