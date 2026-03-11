
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart
} from 'recharts';
import { Calendar, Shield, Target, TrendingUp, Filter, Clock, RefreshCw } from 'lucide-react';

const attackTypeData = [
  { name: 'DDoS', value: 35, color: '#ef4444' },
  { name: 'SQL注入', value: 25, color: '#f97316' },
  { name: '暴力破解', value: 20, color: '#eab308' },
  { name: 'XSS攻击', value: 15, color: '#3b82f6' },
  { name: '恶意软件', value: 5, color: '#8b5cf6' },
];

const assetData = [
  { name: '服务器1', attacks: 120, vulnerabilities: 15, compliance: 85 },
  { name: '服务器2', attacks: 85, vulnerabilities: 8, compliance: 92 },
  { name: '数据库', attacks: 200, vulnerabilities: 22, compliance: 78 },
  { name: 'Web应用', attacks: 150, vulnerabilities: 18, compliance: 88 },
  { name: '防火墙', attacks: 50, vulnerabilities: 5, compliance: 95 },
];

const hourlyData = [
  { time: '00:00', attacks: 45, vulnerabilities: 12, threats: 8 },
  { time: '04:00', attacks: 30, vulnerabilities: 8, threats: 5 },
  { time: '08:00', attacks: 80, vulnerabilities: 15, threats: 12 },
  { time: '12:00', attacks: 120, vulnerabilities: 20, threats: 18 },
  { time: '16:00', attacks: 95, vulnerabilities: 18, threats: 14 },
  { time: '20:00', attacks: 65, vulnerabilities: 10, threats: 9 },
];

const attackTrendData = [
  { date: '周一', ddos: 15, sqli: 10, brute: 8, xss: 5, malware: 3 },
  { date: '周二', ddos: 20, sqli: 12, brute: 10, xss: 7, malware: 4 },
  { date: '周三', ddos: 18, sqli: 15, brute: 12, xss: 8, malware: 5 },
  { date: '周四', ddos: 25, sqli: 18, brute: 15, xss: 10, malware: 6 },
  { date: '周五', ddos: 35, sqli: 22, brute: 18, xss: 12, malware: 8 },
  { date: '周六', ddos: 30, sqli: 20, brute: 15, xss: 10, malware: 7 },
  { date: '周日', ddos: 22, sqli: 15, brute: 12, xss: 8, malware: 5 },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#001a33cc] border border-cyan-500/50 rounded p-2 shadow-lg">
        <p className="text-cyan-400 text-xs font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white text-xs" style={{ color: entry.fill || entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TabButton: React.FC<{ 
  active: boolean; 
  icon: React.ReactNode; 
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 text-xs transition-all duration-300 ${
      active 
        ? 'bg-cyan-900/30 border-b-2 border-cyan-400 text-cyan-400' 
        : 'text-white/60 hover:text-white hover:bg-blue-900/20'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const FilterButton: React.FC<{ 
  active: boolean; 
  label: string;
  onClick: () => void;
}> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded transition-all ${
      active 
        ? 'bg-cyan-900/40 border border-cyan-500/50 text-cyan-400' 
        : 'border border-white/10 text-white/60 hover:border-cyan-500/30 hover:text-white'
    }`}
  >
    {label}
  </button>
);

const InteractiveSecurityCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'time' | 'asset' | 'attack'>('time');
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month'>('week');
  const [selectedAttackTypes, setSelectedAttackTypes] = useState<string[]>(['DDoS', 'SQL注入', '暴力破解', 'XSS攻击', '恶意软件']);
  
  const filteredAttackData = useMemo(() => {
    return attackTypeData.filter(item => selectedAttackTypes.includes(item.name));
  }, [selectedAttackTypes]);

  const toggleAttackType = (type: string) => {
    if (selectedAttackTypes.includes(type)) {
      setSelectedAttackTypes(selectedAttackTypes.filter(t => t !== type));
    } else {
      setSelectedAttackTypes([...selectedAttackTypes, type]);
    }
  };

  const renderTimeView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <FilterButton active={timeFilter === 'day'} label="日" onClick={() => setTimeFilter('day')} />
          <FilterButton active={timeFilter === 'week'} label="周" onClick={() => setTimeFilter('week')} />
          <FilterButton active={timeFilter === 'month'} label="月" onClick={() => setTimeFilter('month')} />
        </div>
        <div className="flex items-center gap-1 text-white/60 text-xs">
          <RefreshCw size={12} className="animate-spin" />
          <span>实时更新</span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVulns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="time" stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="attacks" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorAttacks)" 
              strokeWidth={2} 
              animationDuration={1000}
              name="攻击次数"
            />
            <Area 
              type="monotone" 
              dataKey="vulnerabilities" 
              stroke="#f97316" 
              fillOpacity={1} 
              fill="url(#colorVulns)" 
              strokeWidth={2} 
              animationDuration={1000}
              name="漏洞数"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attackTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="date" stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line type="monotone" dataKey="ddos" name="DDoS" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="sqli" name="SQL注入" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="brute" name="暴力破解" stroke="#eab308" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAssetView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-2 mb-2">
        <FilterButton active={true} label="攻击次数" onClick={() => {}} />
        <FilterButton active={false} label="漏洞数量" onClick={() => {}} />
        <FilterButton active={false} label="合规得分" onClick={() => {}} />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={assetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAssetAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00f2ff" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorAssetVulns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="attacks" name="攻击次数" barSize={20} fill="url(#colorAssetAttacks)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="vulnerabilities" name="漏洞数" barSize={20} fill="url(#colorAssetVulns)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {assetData.map((asset, index) => (
          <div key={index} className="bg-blue-900/20 border border-cyan-500/20 rounded p-2 hover:bg-blue-800/30 transition-colors cursor-pointer group">
            <div className="text-white/80 text-xs mb-1">{asset.name}</div>
            <div className="flex items-center justify-between">
              <div className="text-cyan-400 text-sm font-bold">{asset.attacks}</div>
              <div className={`text-xs ${asset.compliance > 90 ? 'text-green-400' : asset.compliance > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                {asset.compliance}%
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-1">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000" 
                style={{ width: `${asset.compliance}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttackView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap gap-1 mb-2">
        {attackTypeData.map((type) => (
          <button
            key={type.name}
            onClick={() => toggleAttackType(type.name)}
            className={`text-xs px-1.5 py-0.5 rounded-full transition-all ${
              selectedAttackTypes.includes(type.name)
                ? 'bg-opacity-20 text-white'
                : 'bg-black/30 text-white/30'
            }`}
            style={{ backgroundColor: selectedAttackTypes.includes(type.name) ? `${type.color}33` : 'transparent' }}
          >
            {type.name}
          </button>
        ))}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredAttackData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={1000}
              animationBegin={300}
            >
              {filteredAttackData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        {filteredAttackData.map((type, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
            <span className="text-white/80 text-xs w-16">{type.name}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000" 
                style={{ 
                  width: `${type.value}%`, 
                  backgroundColor: type.color,
                  boxShadow: `0 0 8px ${type.color}80`
                }}
              />
            </div>
            <span className="text-white text-xs font-mono">{type.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="flex border-b border-cyan-500/20 mb-4">
        <TabButton 
          active={activeTab === 'time'} 
          icon={<Clock size={14} />} 
          label="时间维度" 
          onClick={() => setActiveTab('time')} 
        />
        <TabButton 
          active={activeTab === 'asset'} 
          icon={<Shield size={14} />} 
          label="资产维度" 
          onClick={() => setActiveTab('asset')} 
        />
        <TabButton 
          active={activeTab === 'attack'} 
          icon={<Target size={14} />} 
          label="攻击类型" 
          onClick={() => setActiveTab('attack')} 
        />
      </div>

      <div className="relative">
        {activeTab === 'time' && renderTimeView()}
        {activeTab === 'asset' && renderAssetView()}
        {activeTab === 'attack' && renderAttackView()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}} />
    </div>
  );
};

export default InteractiveSecurityCharts;
