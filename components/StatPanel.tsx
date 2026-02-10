
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { Shield, FileText, Search, Bug, CheckCircle, FileChartLine, Key } from 'lucide-react';

export const trendDatasets = {
  day: [
    { time: '17:00', alerts: 18000, logs: 65000 },
    { time: '21:00', alerts: 62000, logs: 10000 },
    { time: '01:00', alerts: 68000, logs: 12000 },
    { time: '05:00', alerts: 45000, logs: 11000 },
    { time: '09:00', alerts: 30000, logs: 15000 },
    { time: '13:00', alerts: 2500, logs: 70000 },
    { time: '17:00', alerts: 42000, logs: 12000 },
    { time: '21:00', alerts: 15000, logs: 45000 },
  ],
  week: [
    { time: 'Mon', alerts: 35000, logs: 45000 },
    { time: 'Tue', alerts: 42000, logs: 52000 },
    { time: 'Wed', alerts: 28000, logs: 38000 },
    { time: 'Thu', alerts: 55000, logs: 65000 },
    { time: 'Fri', alerts: 48000, logs: 58000 },
    { time: 'Sat', alerts: 22000, logs: 32000 },
    { time: 'Sun', alerts: 30000, logs: 40000 },
  ],
  month: [
    { time: 'Week 1', alerts: 120000, logs: 180000 },
    { time: 'Week 2', alerts: 150000, logs: 220000 },
    { time: 'Week 3', alerts: 90000, logs: 140000 },
    { time: 'Week 4', alerts: 180000, logs: 250000 },
  ]
};

const predictionData = [
  { name: '攻击入侵', value: 5.5 },
  { name: '信息危害', value: 1.2 },
  { name: '安全预警', value: 3.5 },
  { name: '恶意代码', value: 2.2 },
  { name: '信息侦察', value: 4.2 },
];

const RenderCustomLegend = (props: any) => {
  return (
    <div className="flex justify-center gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
        <span className="text-[11px] font-bold text-white/80 tracking-widest">告警量</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]" />
        <span className="text-[11px] font-bold text-white/80 tracking-widest">攻击日志量</span>
      </div>
    </div>
  );
};

export const TrendChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-52 w-full mt-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {/* Swapped gradients: colorAlerts is now Cyan, colorLogs is now Orange to match image */}
          <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ffaa00" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#ffffff40" 
          fontSize={10} 
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
        <Legend content={<RenderCustomLegend />} verticalAlign="top" align="center" />
        
        {/* alerts mapped to cyan, logs mapped to orange */}
        <Area 
          type="monotone" 
          dataKey="alerts" 
          stroke="#00f2ff" 
          fillOpacity={1} 
          fill="url(#colorAlerts)" 
          strokeWidth={2} 
          animationDuration={1000} 
          dot={{ r: 2, fill: '#00f2ff', strokeWidth: 0 }}
        />
        <Area 
          type="monotone" 
          dataKey="logs" 
          stroke="#ffaa00" 
          fillOpacity={1} 
          fill="url(#colorLogs)" 
          strokeWidth={2} 
          animationDuration={1000} 
          dot={{ r: 2, fill: '#ffaa00', strokeWidth: 0 }}
        />
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
    { rank: 'TOP1', ip: '115.231.54.13', loc: '宁波', logs: '54.96M', gradient: 'from-orange-600/20 via-orange-500 to-orange-400' },
    { rank: 'TOP2', ip: '111.197.221.3', loc: '北京', logs: '44.95M', gradient: 'from-orange-600/20 via-orange-500 to-orange-400' },
    { rank: 'TOP3', ip: '116.195.40.100', loc: '上海', logs: '44.02M', gradient: 'from-orange-600/20 via-orange-500 to-orange-400' },
    { rank: 'TOP4', ip: '110.17.71.41', loc: '包头', logs: '43.97M', gradient: 'from-blue-600/20 via-blue-500 to-cyan-500' },
    { rank: 'TOP5', ip: '134.225.72.28', loc: '英国', logs: '32.99M', gradient: 'from-blue-600/20 via-blue-500 to-cyan-500' },
  ];

  return (
    <div className="space-y-2 mt-4">
      {assets.map((item, i) => (
        <div key={i} className="flex items-center gap-1 group">
          <div 
            className={`relative w-16 h-7 flex items-center justify-center bg-gradient-to-r ${item.gradient} shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.5)]`}
            style={{ clipPath: 'polygon(0% 0%, 82% 0%, 100% 50%, 82% 100%, 0% 100%)' }}
          >
            <span className="text-[12px] font-black text-white tracking-tighter pr-2 italic">
              {item.rank}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-between h-7 bg-[#0b1b2d] border border-blue-500/10 px-3 relative overflow-hidden hover:bg-blue-800/20 transition-colors">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(135deg, #22d3ee 10%, transparent 10%, transparent 50%, #22d3ee 50%, #22d3ee 60%, transparent 60%, transparent 100%)', backgroundSize: '10px 10px' }} 
            />
            
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/90 font-bold whitespace-nowrap">
                {item.ip}{item.loc}
              </span>
              <span className="text-[10px] font-mono text-white/40 hidden xl:block">
                {item.ip}
              </span>
            </div>

            <div className="relative z-10 text-right">
              <span className="text-[10px] text-white/40 mr-1">日志:</span>
              <span className="text-[11px] font-mono text-white font-bold">
                {item.logs}
              </span>
            </div>
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
  <div className="relative mb-4">
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <div className="w-1.5 h-7 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10" />
          <div className="absolute -left-1 w-3 h-3 bg-cyan-400/20 blur-sm rounded-full" />
        </div>
        
        <h3 className="text-xl font-black text-white tracking-[0.1em] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] uppercase">
          {title}
        </h3>
      </div>
      {extra && <div className="flex gap-4 text-xs text-white/70 font-bold relative z-10">{extra}</div>}
    </div>
    
    <div className="absolute -bottom-3 left-0 w-full h-[6px] opacity-30 pointer-events-none overflow-hidden flex items-center">
       <div className="flex gap-1.5 w-full">
         {Array.from({length: 60}).map((_, i) => (
           <div key={i} className="w-1.5 h-[3px] bg-cyan-400/80 shrink-0 transform -skew-x-[30deg]" />
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
  <div className="flex-1 bg-blue-900/30 border-y border-cyan-500/20 p-2 relative overflow-hidden text-center group hover:bg-blue-800/40 transition-all duration-300">
    <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors" />
    <div className="absolute top-0 right-0 w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors" />
    <div className="text-[10px] text-white/40 mb-1 uppercase font-black tracking-widest">{label}</div>
    <div className={`text-sm font-black tracking-widest ${color} drop-shadow-[0_0_5px_currentColor]`}>{value}</div>
  </div>
);

const IsometricHexagon: React.FC<{ value: number; label: string; children: React.ReactNode }> = ({ value, label, children }) => (
  <div className="flex flex-col items-center group cursor-default">
    <div className="relative mb-2">
      <div className="text-[#22d3ee] transition-transform duration-500 group-hover:-translate-y-1">
        {children}
      </div>
    </div>

    <div className="relative w-20 h-24 flex flex-col items-center justify-center">
      <div className="absolute top-0 w-20 h-10 border border-[#22d3ee]/40 clip-hexagon-flat z-20" />
      <div className="absolute top-2 w-16 h-8 border border-[#22d3ee]/20 clip-hexagon-flat z-10" />
      <div className="absolute bottom-4 w-20 h-14 bg-gradient-to-b from-[#004a8b] to-[#001a33] clip-hexagon-prism shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        <div className="flex items-center justify-center h-full pt-1">
          <span className="text-2xl font-black text-white font-cyber tracking-tighter">{value}</span>
        </div>
      </div>
      <div className="absolute -bottom-2 w-16 h-4 bg-[#22d3ee]/5 blur-md rounded-full" />
    </div>
    <div className="mt-[-10px] text-lg font-bold text-white tracking-widest">{label}</div>

    <style dangerouslySetInnerHTML={{ __html: `
      .clip-hexagon-flat { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
      .clip-hexagon-prism { clip-path: polygon(25% 0%, 75% 0%, 100% 30%, 100% 100%, 75% 100%, 25% 100%, 0% 100%, 0% 30%); }
    `}} />
  </div>
);

export const VulnerabilitySection: React.FC = () => {
  return (
    <div className="flex justify-between items-end px-4 h-40">
      <IsometricHexagon value={140} label="漏洞">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <Bug size={32} strokeWidth={1.5} />
          <div className="absolute top-0 right-0 w-6 h-6 border-2 border-[#22d3ee] rounded-full flex items-center justify-center bg-[#000814]">
             <Search size={12} strokeWidth={3} />
          </div>
        </div>
      </IsometricHexagon>

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
