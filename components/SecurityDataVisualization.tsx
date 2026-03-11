import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Area,
  AreaChart
} from 'recharts';
import {
  Clock,
  Server,
  Shield,
  MapPin,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
  ChevronDown,
  RefreshCw,
  Target,
  Globe,
  Zap,
  AlertTriangle,
  Bug,
  Lock
} from 'lucide-react';
import type { DimensionType, TimeSeriesData, AttackTypeStat, AssetData, ChartDataPoint } from '../types';

// 模拟时间序列数据生成器
const generateTimeSeriesData = (hours: number): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      attacks: Math.floor(Math.random() * 500) + 100,
      alerts: Math.floor(Math.random() * 200) + 50,
      blocked: Math.floor(Math.random() * 300) + 80
    });
  }
  return data;
};

// 模拟攻击类型数据
const attackTypeData: AttackTypeStat[] = [
  { type: 'SQL注入', count: 1250, percentage: 28, trend: 'up' },
  { type: 'XSS攻击', count: 890, percentage: 20, trend: 'stable' },
  { type: '暴力破解', count: 756, percentage: 17, trend: 'up' },
  { type: 'DDoS', count: 534, percentage: 12, trend: 'down' },
  { type: '恶意爬虫', count: 445, percentage: 10, trend: 'up' },
  { type: '文件包含', count: 312, percentage: 7, trend: 'stable' },
  { type: '其他', count: 267, percentage: 6, trend: 'down' }
];

// 模拟资产数据
const assetData: AssetData[] = [
  { id: 'AST-001', name: '核心数据库', ip: '10.0.1.100', type: 'database', riskScore: 85, alertCount: 45, lastAttack: '2分钟前' },
  { id: 'AST-002', name: 'Web服务器集群', ip: '10.0.2.50', type: 'server', riskScore: 72, alertCount: 32, lastAttack: '5分钟前' },
  { id: 'AST-003', name: 'API网关', ip: '10.0.3.10', type: 'gateway', riskScore: 68, alertCount: 28, lastAttack: '12分钟前' },
  { id: 'AST-004', name: '负载均衡器', ip: '10.0.4.5', type: 'network', riskScore: 45, alertCount: 15, lastAttack: '1小时前' },
  { id: 'AST-005', name: '缓存服务器', ip: '10.0.5.20', type: 'server', riskScore: 38, alertCount: 8, lastAttack: '3小时前' }
];

// 地理位置数据
const locationData: ChartDataPoint[] = [
  { name: '中国', value: 3250, category: 'APAC' },
  { name: '美国', value: 2100, category: 'NA' },
  { name: '俄罗斯', value: 1850, category: 'EU' },
  { name: '巴西', value: 980, category: 'SA' },
  { name: '印度', value: 1450, category: 'APAC' },
  { name: '德国', value: 760, category: 'EU' },
  { name: '其他', value: 1120, category: 'Other' }
];

// 严重程度分布数据
const severityData = [
  { name: '高危', value: 234, color: '#ef4444' },
  { name: '中危', value: 567, color: '#f97316' },
  { name: '低危', value: 1234, color: '#eab308' },
  { name: '信息', value: 3456, color: '#22d3ee' }
];

// 雷达图数据
const radarData = [
  { subject: '网络层', A: 85, fullMark: 100 },
  { subject: '应用层', A: 72, fullMark: 100 },
  { subject: '数据层', A: 90, fullMark: 100 },
  { subject: '主机层', A: 65, fullMark: 100 },
  { subject: '物理层', A: 45, fullMark: 100 },
  { subject: '管理域', A: 78, fullMark: 100 }
];

// 颜色配置
const COLORS = ['#00f2ff', '#ff0055', '#ffaa00', '#7000ff', '#00ff9d', '#ff6b6b', '#4ecdc4'];

// 维度配置
const dimensionConfig: Record<DimensionType, { icon: React.ReactNode; label: string }> = {
  time: { icon: <Clock size={14} />, label: '时间维度' },
  asset: { icon: <Server size={14} />, label: '资产维度' },
  attackType: { icon: <Shield size={14} />, label: '攻击类型' },
  severity: { icon: <AlertTriangle size={14} />, label: '严重程度' },
  location: { icon: <MapPin size={14} />, label: '地理位置' }
};

// 时间范围选项
const timeRangeOptions = [
  { value: '1h', label: '1小时' },
  { value: '6h', label: '6小时' },
  { value: '24h', label: '24小时' },
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' }
];

// 图表类型选项
const chartTypeOptions = [
  { value: 'line', label: '折线图', icon: <TrendingUp size={14} /> },
  { value: 'bar', label: '柱状图', icon: <BarChart3 size={14} /> },
  { value: 'pie', label: '饼图', icon: <PieChartIcon size={14} /> },
  { value: 'radar', label: '雷达图', icon: <Target size={14} /> }
];

// 自定义Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#001a33] border border-cyan-500/50 rounded-lg p-3 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
        <p className="text-cyan-400 font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 时间维度图表
const TimeDimensionChart: React.FC<{ data: TimeSeriesData[]; chartType: string }> = ({ data, chartType }) => {
  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="timestamp" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Area type="monotone" dataKey="attacks" name="攻击次数" stroke="#ef4444" fill="url(#colorAttacks)" strokeWidth={2} />
          <Area type="monotone" dataKey="alerts" name="告警数量" stroke="#f97316" fill="url(#colorAlerts)" strokeWidth={2} />
          <Area type="monotone" dataKey="blocked" name="拦截次数" stroke="#22d3ee" fill="url(#colorBlocked)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
        <XAxis dataKey="timestamp" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '10px' }} />
        <Bar dataKey="attacks" name="攻击次数" fill="#ef4444" radius={[2, 2, 0, 0]} />
        <Bar dataKey="alerts" name="告警数量" fill="#f97316" radius={[2, 2, 0, 0]} />
        <Bar dataKey="blocked" name="拦截次数" fill="#22d3ee" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 攻击类型图表
const AttackTypeChart: React.FC<{ chartType: string }> = ({ chartType }) => {
  if (chartType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={attackTypeData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="count"
            nameKey="type"
          >
            {attackTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={attackTypeData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
        <XAxis type="number" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis dataKey="type" type="category" stroke="#ffffff60" fontSize={10} axisLine={false} tickLine={false} width={55} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="攻击次数" fill="#00f2ff" radius={[0, 2, 2, 0]}>
          {attackTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// 地理位置图表
const LocationChart: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={locationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
      <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
      <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" name="攻击次数" fill="#7000ff" radius={[2, 2, 0, 0]}>
        {locationData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// 严重程度图表
const SeverityChart: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={severityData}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={3}
        dataKey="value"
        nameKey="name"
      >
        {severityData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '10px' }} />
    </PieChart>
  </ResponsiveContainer>
);

// 雷达图
const SecurityRadarChart: React.FC = () => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
      <PolarGrid stroke="#ffffff20" />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10 }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
      <Radar
        name="安全评分"
        dataKey="A"
        stroke="#00f2ff"
        strokeWidth={2}
        fill="#00f2ff"
        fillOpacity={0.3}
      />
      <Tooltip content={<CustomTooltip />} />
    </RadarChart>
  </ResponsiveContainer>
);

// 资产风险卡片
const AssetRiskCard: React.FC<{ asset: AssetData }> = ({ asset }) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-red-500/20 border-red-500/40';
    if (score >= 60) return 'bg-orange-500/20 border-orange-500/40';
    if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/40';
    return 'bg-green-500/20 border-green-500/40';
  };

  return (
    <div className={`p-3 rounded-lg border ${getRiskBg(asset.riskScore)} transition-all hover:brightness-110 cursor-pointer`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-cyan-400" />
          <span className="text-sm font-bold text-white">{asset.name}</span>
        </div>
        <span className={`text-lg font-black ${getRiskColor(asset.riskScore)}`}>{asset.riskScore}</span>
      </div>
      <div className="text-xs text-white/50 mb-2">{asset.ip}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <AlertTriangle size={10} className="text-orange-400" />
          <span className="text-xs text-white/60">{asset.alertCount} 告警</span>
        </div>
        <span className="text-xs text-white/40">{asset.lastAttack}</span>
      </div>
      {/* 风险进度条 */}
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            asset.riskScore >= 80 ? 'bg-red-400' : 
            asset.riskScore >= 60 ? 'bg-orange-400' : 
            asset.riskScore >= 40 ? 'bg-yellow-400' : 'bg-green-400'
          }`}
          style={{ width: `${asset.riskScore}%` }}
        />
      </div>
    </div>
  );
};

const SecurityDataVisualization: React.FC = () => {
  const [dimension, setDimension] = useState<DimensionType>('time');
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(false);
  const [showDimensionMenu, setShowDimensionMenu] = useState(false);

  // 根据时间范围生成数据
  const timeSeriesData = useMemo(() => {
    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    return generateTimeSeriesData(Math.min(hours, 24));
  }, [timeRange]);

  // 刷新数据
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  // 渲染主图表
  const renderMainChart = () => {
    switch (dimension) {
      case 'time':
        return <TimeDimensionChart data={timeSeriesData} chartType={chartType} />;
      case 'attackType':
        return <AttackTypeChart chartType={chartType} />;
      case 'location':
        return <LocationChart />;
      case 'severity':
        return <SeverityChart />;
      case 'asset':
        return <SecurityRadarChart />;
      default:
        return <TimeDimensionChart data={timeSeriesData} chartType={chartType} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 控制栏 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        {/* 维度选择 */}
        <div className="relative">
          <button
            onClick={() => setShowDimensionMenu(!showDimensionMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded text-xs text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          >
            {dimensionConfig[dimension].icon}
            {dimensionConfig[dimension].label}
            <ChevronDown size={12} />
          </button>
          
          {showDimensionMenu && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-[#001a33] border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.2)] z-20">
              {(Object.keys(dimensionConfig) as DimensionType[]).map((dim) => (
                <button
                  key={dim}
                  onClick={() => {
                    setDimension(dim);
                    setShowDimensionMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    dimension === dim 
                      ? 'bg-cyan-500/30 text-cyan-300' 
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  {dimensionConfig[dim].icon}
                  {dimensionConfig[dim].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 时间范围选择 */}
        <div className="flex items-center gap-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeRange === option.value
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'text-white/50 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 图表类型 & 刷新 */}
        <div className="flex items-center gap-2">
          {dimension === 'time' && (
            <div className="flex items-center gap-1">
              {chartTypeOptions.slice(0, 2).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setChartType(option.value)}
                  className={`p-1.5 rounded transition-colors ${
                    chartType === option.value
                      ? 'bg-cyan-500/30 text-cyan-300'
                      : 'text-white/50 hover:bg-white/10'
                  }`}
                  title={option.label}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded text-white/50 hover:bg-white/10 transition-all ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* 主图表区域 */}
      <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-lg p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
            <div className="flex items-center gap-2 text-cyan-400">
              <RefreshCw size={20} className="animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          </div>
        )}
        
        {/* 图表标题 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            <span className="text-sm font-bold text-white">{dimensionConfig[dimension].label}分析</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/40">数据源: 实时流量</span>
            <span className="text-white/40">更新: 刚刚</span>
          </div>
        </div>

        {/* 图表 */}
        <div className="h-[calc(100%-2rem)]">
          {renderMainChart()}
        </div>
      </div>

      {/* 底部统计卡片 */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-red-400" />
            <span className="text-xs text-white/50">今日攻击</span>
          </div>
          <p className="text-xl font-black text-red-400">12,847</p>
          <p className="text-xs text-red-400/60">↑ 23% 较昨日</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-orange-400" />
            <span className="text-xs text-white/50">活跃告警</span>
          </div>
          <p className="text-xl font-black text-orange-400">156</p>
          <p className="text-xs text-orange-400/60">↑ 8% 较昨日</p>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={14} className="text-cyan-400" />
            <span className="text-xs text-white/50">拦截率</span>
          </div>
          <p className="text-xl font-black text-cyan-400">99.7%</p>
          <p className="text-xs text-cyan-400/60">↑ 0.3% 较昨日</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={14} className="text-purple-400" />
            <span className="text-xs text-white/50">威胁来源</span>
          </div>
          <p className="text-xl font-black text-purple-400">47</p>
          <p className="text-xs text-purple-400/60">个国家/地区</p>
        </div>
      </div>

      {/* 资产风险列表 - 仅在资产维度显示 */}
      {dimension === 'asset' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {assetData.map((asset) => (
            <AssetRiskCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SecurityDataVisualization;
