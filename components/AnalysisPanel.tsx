
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Scatter
} from 'recharts';
import { 
  Clock, Server, Zap, Filter, ChevronDown, ChevronUp, 
  TrendingUp, TrendingDown, Activity, Globe, Shield,
  Calendar, Layers, RefreshCw, Maximize2, Download
} from 'lucide-react';
import { AnalysisFilter, ChartDataPoint, AssetAnalytics, AttackTypeAnalytics, AlertSeverity } from '../types';

const COLORS = {
  cyan: '#00f2ff',
  orange: '#ffaa00',
  purple: '#7000ff',
  red: '#ff0055',
  green: '#00ff88',
  blue: '#3b82f6'
};

const generateTimeData = (range: string): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  
  switch (range) {
    case 'hour':
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
          time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          value: Math.floor(Math.random() * 500) + 100,
          category: '攻击'
        });
      }
      break;
    case 'day':
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        data.push({
          time: time.toLocaleTimeString('zh-CN', { hour: '2-digit' }) + ':00',
          value: Math.floor(Math.random() * 1000) + 200,
          category: '攻击'
        });
      }
      break;
    case 'week':
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      for (let i = 6; i >= 0; i--) {
        const dayIndex = (now.getDay() - i + 7) % 7;
        data.push({
          time: days[dayIndex],
          value: Math.floor(Math.random() * 5000) + 1000,
          category: '攻击'
        });
      }
      break;
    case 'month':
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        data.push({
          time: `${date.getMonth() + 1}/${date.getDate()}`,
          value: Math.floor(Math.random() * 8000) + 2000,
          category: '攻击'
        });
      }
      break;
  }
  
  return data;
};

const generateAssetData = (): AssetAnalytics[] => {
  const assets = [
    { name: '核心应用服务器-01', ip: '192.168.1.10' },
    { name: '数据库服务器-主', ip: '192.168.1.20' },
    { name: 'Web服务器集群', ip: '192.168.1.30' },
    { name: 'API网关', ip: '192.168.1.40' },
    { name: '文件服务器', ip: '192.168.1.50' },
    { name: '邮件服务器', ip: '192.168.1.60' },
    { name: 'DNS服务器', ip: '192.168.1.70' },
    { name: '备份服务器', ip: '192.168.1.80' }
  ];
  
  return assets.map(asset => ({
    assetId: `asset-${Math.random().toString(36).substr(2, 9)}`,
    assetName: asset.name,
    ip: asset.ip,
    alertCount: Math.floor(Math.random() * 500) + 50,
    criticalCount: Math.floor(Math.random() * 20) + 1,
    topAttackTypes: ['SQL注入', 'XSS', '暴力破解'].slice(0, Math.floor(Math.random() * 3) + 1),
    riskScore: Math.floor(Math.random() * 100)
  })).sort((a, b) => b.alertCount - a.alertCount);
};

const generateAttackTypeData = (): AttackTypeAnalytics[] => {
  const types = [
    { type: 'SQL注入', base: 450 },
    { type: 'XSS攻击', base: 380 },
    { type: 'DDoS攻击', base: 320 },
    { type: '暴力破解', base: 280 },
    { type: '端口扫描', base: 250 },
    { type: '恶意文件上传', base: 180 },
    { type: '权限提升', base: 120 },
    { type: '数据泄露', base: 90 }
  ];
  
  const total = types.reduce((sum, t) => sum + t.base, 0);
  const trends: ('increasing' | 'stable' | 'decreasing')[] = ['increasing', 'stable', 'decreasing'];
  
  return types.map(t => ({
    type: t.type,
    count: t.base + Math.floor(Math.random() * 100) - 50,
    trend: trends[Math.floor(Math.random() * 3)],
    percentage: Math.round((t.base / total) * 100),
    avgSeverity: Math.random() * 3 + 1
  }));
};

const generateSeverityDistribution = (): { name: string; value: number; color: string }[] => [
  { name: '高危', value: Math.floor(Math.random() * 50) + 20, color: COLORS.red },
  { name: '中危', value: Math.floor(Math.random() * 100) + 50, color: COLORS.orange },
  { name: '低危', value: Math.floor(Math.random() * 200) + 100, color: COLORS.cyan }
];

const generateRadarData = () => [
  { subject: 'SQL注入', A: 120, fullMark: 150 },
  { subject: 'XSS', A: 98, fullMark: 150 },
  { subject: 'DDoS', A: 86, fullMark: 150 },
  { subject: '暴力破解', A: 99, fullMark: 150 },
  { subject: '端口扫描', A: 85, fullMark: 150 },
  { subject: '恶意上传', A: 65, fullMark: 150 }
];

const FilterDropdown: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, icon, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#0a1628] border border-cyan-500/30 hover:border-cyan-500/50 transition-colors text-xs"
      >
        {icon}
        <span className="text-white/70">{label}:</span>
        <span className="text-cyan-400 font-medium">
          {options.find(o => o.value === value)?.label}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-[#0a1628] border border-cyan-500/30 min-w-[120px]">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left text-xs transition-colors
                ${value === option.value 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InteractiveChart: React.FC<{
  title: string;
  children: React.ReactNode;
  onExpand?: () => void;
  onRefresh?: () => void;
}> = ({ title, children, onExpand, onRefresh }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative bg-gradient-to-br from-[#0a1628] to-[#0d1f35] border border-cyan-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/10">
        <h4 className="text-sm font-bold text-white/90">{title}</h4>
        <div className={`flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <RefreshCw size={14} className="text-cyan-400" />
            </button>
          )}
          {onExpand && (
            <button 
              onClick={onExpand}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Maximize2 size={14} className="text-cyan-400" />
            </button>
          )}
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1628]/95 border border-cyan-500/50 p-3 shadow-xl">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MultiDimensionAnalysisPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const [selectedAttackType, setSelectedAttackType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  const [timeData, setTimeData] = useState<ChartDataPoint[]>([]);
  const [assetData, setAssetData] = useState<AssetAnalytics[]>([]);
  const [attackTypeData, setAttackTypeData] = useState<AttackTypeAnalytics[]>([]);
  const [severityData, setSeverityData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  
  const [isLive, setIsLive] = useState(true);
  
  const refreshData = useCallback(() => {
    setTimeData(generateTimeData(timeRange));
    setAssetData(generateAssetData());
    setAttackTypeData(generateAttackTypeData());
    setSeverityData(generateSeverityDistribution());
    setRadarData(generateRadarData());
  }, [timeRange]);
  
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setTimeData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length - 1];
        newData.push({
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          value: Math.floor(Math.random() * 500) + 100,
          category: '攻击'
        });
        return newData;
      });
      
      setSeverityData(generateSeverityDistribution());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const timeRangeOptions = [
    { value: 'hour', label: '1小时' },
    { value: 'day', label: '24小时' },
    { value: 'week', label: '7天' },
    { value: 'month', label: '30天' }
  ];
  
  const assetOptions = [
    { value: 'all', label: '全部资产' },
    ...assetData.slice(0, 5).map(a => ({ value: a.assetId, label: a.assetName }))
  ];
  
  const attackTypeOptions = [
    { value: 'all', label: '全部类型' },
    ...attackTypeData.slice(0, 5).map(a => ({ value: a.type, label: a.type }))
  ];
  
  const severityOptions = [
    { value: 'all', label: '全部等级' },
    { value: 'critical', label: '高危' },
    { value: 'high', label: '高危' },
    { value: 'medium', label: '中危' },
    { value: 'low', label: '低危' }
  ];
  
  const multiLineData = useMemo(() => {
    return timeData.map(d => ({
      ...d,
      attacks: d.value,
      blocked: Math.floor(d.value * (0.7 + Math.random() * 0.2)),
      detected: Math.floor(d.value * (0.9 + Math.random() * 0.1))
    }));
  }, [timeData]);
  
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-cyan-400" />
          <span className="text-sm font-bold text-white/90">多维度分析</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`
              flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all
              ${isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-white/5 text-white/40 border border-white/10'
              }
            `}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`} />
            {isLive ? '实时' : '暂停'}
          </button>
          
          <button
            onClick={refreshData}
            className="p-1.5 bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors"
          >
            <RefreshCw size={12} className="text-cyan-400" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="时间"
          icon={<Clock size={12} className="text-cyan-400" />}
          options={timeRangeOptions}
          value={timeRange}
          onChange={(v) => setTimeRange(v as typeof timeRange)}
        />
        <FilterDropdown
          label="资产"
          icon={<Server size={12} className="text-cyan-400" />}
          options={assetOptions}
          value={selectedAsset}
          onChange={setSelectedAsset}
        />
        <FilterDropdown
          label="类型"
          icon={<Zap size={12} className="text-cyan-400" />}
          options={attackTypeOptions}
          value={selectedAttackType}
          onChange={setSelectedAttackType}
        />
        <FilterDropdown
          label="等级"
          icon={<Shield size={12} className="text-cyan-400" />}
          options={severityOptions}
          value={selectedSeverity}
          onChange={setSelectedSeverity}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scroll space-y-4">
        <InteractiveChart title="攻击趋势分析" onRefresh={refreshData}>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={multiLineData}>
                <defs>
                  <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.red} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff40" 
                  fontSize={9} 
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={9} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="attacks" 
                  stroke={COLORS.red} 
                  fill="url(#attackGradient)" 
                  strokeWidth={2}
                  name="攻击次数"
                />
                <Line 
                  type="monotone" 
                  dataKey="blocked" 
                  stroke={COLORS.green} 
                  strokeWidth={2}
                  dot={false}
                  name="已拦截"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-red-400" />
              <span className="text-[10px] text-white/60">攻击次数</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-[2px] bg-green-400" />
              <span className="text-[10px] text-white/60">已拦截</span>
            </div>
          </div>
        </InteractiveChart>
        
        <div className="grid grid-cols-2 gap-4">
          <InteractiveChart title="攻击类型分布" onRefresh={refreshData}>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {severityData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-white/60">{entry.name}</span>
                </div>
              ))}
            </div>
          </InteractiveChart>
          
          <InteractiveChart title="攻击雷达图" onRefresh={refreshData}>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fill: '#ffffff40', fontSize: 8 }} />
                  <Radar 
                    name="攻击量" 
                    dataKey="A" 
                    stroke={COLORS.cyan} 
                    fill={COLORS.cyan} 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </InteractiveChart>
        </div>
        
        <InteractiveChart title="资产风险排名" onRefresh={refreshData}>
          <div className="space-y-2">
            {assetData.slice(0, 5).map((asset, index) => (
              <div 
                key={asset.assetId}
                className="flex items-center gap-3 p-2 bg-black/20 border border-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-pointer"
              >
                <div className={`
                  w-6 h-6 flex items-center justify-center text-[10px] font-bold
                  ${index === 0 ? 'bg-red-500/30 text-red-400' : 
                    index === 1 ? 'bg-orange-500/30 text-orange-400' :
                    index === 2 ? 'bg-yellow-500/30 text-yellow-400' :
                    'bg-cyan-500/20 text-cyan-400'}
                `}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white/90 truncate">{asset.assetName}</span>
                    <span className="text-[10px] text-white/40 font-mono">{asset.ip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${asset.riskScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/60 w-8 text-right">{asset.alertCount}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-red-400 font-bold">{asset.criticalCount}</span>
                  <span className="text-[8px] text-white/30">高危</span>
                </div>
              </div>
            ))}
          </div>
        </InteractiveChart>
        
        <InteractiveChart title="攻击类型统计" onRefresh={refreshData}>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackTypeData.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" stroke="#ffffff40" fontSize={9} axisLine={false} tickLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="type" 
                  stroke="#ffffff60" 
                  fontSize={9} 
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                  {attackTypeData.slice(0, 6).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient-${index})`}
                    />
                  ))}
                </Bar>
                <defs>
                  {attackTypeData.slice(0, 6).map((_, index) => (
                    <linearGradient key={index} id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.8} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InteractiveChart>
      </div>
    </div>
  );
};

export const QuickStatsRow: React.FC = () => {
  const [stats, setStats] = useState({
    totalAttacks: 15847,
    blockedRate: 94.7,
    avgResponseTime: 0.3,
    activeThreats: 23
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalAttacks: prev.totalAttacks + Math.floor(Math.random() * 10),
        blockedRate: Math.min(99.9, prev.blockedRate + (Math.random() - 0.5) * 0.5),
        avgResponseTime: Math.max(0.1, prev.avgResponseTime + (Math.random() - 0.5) * 0.1),
        activeThreats: Math.max(0, prev.activeThreats + Math.floor(Math.random() * 5) - 2)
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: '总攻击数', value: stats.totalAttacks.toLocaleString(), icon: <Activity size={14} />, color: 'text-cyan-400' },
        { label: '拦截率', value: `${stats.blockedRate.toFixed(1)}%`, icon: <Shield size={14} />, color: 'text-green-400' },
        { label: '响应时间', value: `${stats.avgResponseTime.toFixed(2)}s`, icon: <Zap size={14} />, color: 'text-orange-400' },
        { label: '活跃威胁', value: stats.activeThreats.toString(), icon: <Globe size={14} />, color: 'text-red-400' }
      ].map((stat, i) => (
        <div key={i} className="bg-black/30 border border-cyan-500/20 p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-white/40">{stat.icon}</span>
            <span className="text-[9px] text-white/40 uppercase">{stat.label}</span>
          </div>
          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
