import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Bug, 
  FileWarning, 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  Search,
  MapPin,
  Network,
  Clock,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Server,
  Globe,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import type { SecurityAlert, AlertLevel, AlertType, TraceInfo } from '../types';

// 模拟告警数据
const generateMockAlerts = (): SecurityAlert[] => [
  {
    id: 'ALT-2024-001',
    level: 'high',
    type: 'attack',
    title: '高危SQL注入攻击',
    description: '检测到针对核心业务数据库的SQL注入攻击尝试，攻击者试图绕过认证机制',
    source: '45.142.212.100',
    target: '核心数据库服务器',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'new',
    tags: ['SQL注入', '数据库', '高危'],
    traceInfo: {
      attackerIP: '45.142.212.100',
      attackerLocation: '俄罗斯·莫斯科',
      attackPath: ['边界防火墙', 'Web应用防火墙', '核心交换机', '数据库服务器'],
      affectedAssets: ['DB-Primary-01', 'Web-App-03'],
      firstSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      attackCount: 156,
      c2Servers: ['185.220.101.45', '198.51.100.22']
    }
  },
  {
    id: 'ALT-2024-002',
    level: 'high',
    type: 'vulnerability',
    title: 'Log4j2漏洞爆发',
    description: '发现内部系统存在CVE-2021-44228 Log4j2远程代码执行漏洞',
    source: '内部扫描',
    target: '日志服务集群',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'processing',
    tags: ['0day', 'RCE', 'Log4j2'],
    traceInfo: {
      attackerIP: 'N/A',
      attackerLocation: '内部网络',
      attackPath: ['漏洞扫描器'],
      affectedAssets: ['Log-Server-01', 'Log-Server-02', 'App-Server-05'],
      firstSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      attackCount: 1
    }
  },
  {
    id: 'ALT-2024-003',
    level: 'medium',
    type: 'compliance',
    title: '合规违规：敏感数据未加密',
    description: '检测到客户PII数据在传输过程中未使用TLS 1.3加密',
    source: '合规审计系统',
    target: '用户服务API',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'new',
    tags: ['GDPR', '数据安全', '加密'],
    traceInfo: {
      attackerIP: 'N/A',
      attackerLocation: '内部网络',
      attackPath: ['API网关', '用户服务'],
      affectedAssets: ['API-Gateway', 'User-Service'],
      firstSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      attackCount: 1
    }
  },
  {
    id: 'ALT-2024-004',
    level: 'high',
    type: 'attack',
    title: 'DDoS攻击检测',
    description: '检测到针对主站的大规模DDoS攻击，峰值流量达到850Gbps',
    source: '多源IP',
    target: '主站CDN',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    status: 'processing',
    tags: ['DDoS', '流量攻击', 'CDN'],
    traceInfo: {
      attackerIP: '多源',
      attackerLocation: '全球分布',
      attackPath: ['互联网', 'CDN边缘节点', '源站'],
      affectedAssets: ['CDN-Primary', 'Web-Cluster-01'],
      firstSeen: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      attackCount: 1
    }
  },
  {
    id: 'ALT-2024-005',
    level: 'low',
    type: 'anomaly',
    title: '异常登录行为',
    description: '检测到管理员账号在非工作时间从非常用地点登录',
    source: '192.168.1.100',
    target: '管理后台',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'resolved',
    tags: ['异常行为', '账号安全'],
    traceInfo: {
      attackerIP: '192.168.1.100',
      attackerLocation: '中国·上海',
      attackPath: ['VPN', '管理后台'],
      affectedAssets: ['Admin-Portal'],
      firstSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      attackCount: 1
    }
  },
  {
    id: 'ALT-2024-006',
    level: 'medium',
    type: 'attack',
    title: '暴力破解尝试',
    description: '检测到针对SSH服务的暴力破解攻击，尝试次数超过阈值',
    source: '103.253.145.88',
    target: '跳板机服务器',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'new',
    tags: ['暴力破解', 'SSH', '跳板机'],
    traceInfo: {
      attackerIP: '103.253.145.88',
      attackerLocation: '越南·河内',
      attackPath: ['互联网', '边界防火墙', '跳板机'],
      affectedAssets: ['Bastion-Host-01'],
      firstSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      attackCount: 523
    }
  }
];

// 告警等级配置
const levelConfig: Record<AlertLevel, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  high: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
    icon: <AlertTriangle size={16} />,
    label: '高危'
  },
  medium: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    icon: <AlertCircle size={16} />,
    label: '中危'
  },
  low: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
    icon: <Info size={16} />,
    label: '低危'
  }
};

// 告警类型配置
const typeConfig: Record<AlertType, { icon: React.ReactNode; label: string; color: string }> = {
  attack: { icon: <Zap size={14} />, label: '攻击', color: 'text-red-400' },
  vulnerability: { icon: <Bug size={14} />, label: '漏洞', color: 'text-purple-400' },
  compliance: { icon: <FileWarning size={14} />, label: '合规', color: 'text-blue-400' },
  anomaly: { icon: <Activity size={14} />, label: '异常', color: 'text-cyan-400' }
};

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  return date.toLocaleDateString();
};

// 溯源详情面板
const TracePanel: React.FC<{ traceInfo: TraceInfo; onClose: () => void }> = ({ traceInfo, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="relative w-[600px] max-h-[80vh] bg-[#000814] border border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.2)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Search className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">攻击溯源分析</h3>
            <p className="text-xs text-cyan-400/60">Attack Traceability Analysis</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={20} className="text-white/60" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
        {/* 攻击者信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={14} className="text-cyan-400" />
              <span className="text-xs text-white/50">攻击者IP</span>
            </div>
            <p className="text-lg font-mono font-bold text-white">{traceInfo.attackerIP}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-cyan-400" />
              <span className="text-xs text-white/50">地理位置</span>
            </div>
            <p className="text-lg font-bold text-white">{traceInfo.attackerLocation}</p>
          </div>
        </div>

        {/* 攻击路径 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Network size={16} className="text-cyan-400" />
            <span className="text-sm font-bold text-white">攻击路径</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {traceInfo.attackPath.map((node, index) => (
              <React.Fragment key={index}>
                <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300">
                  {node}
                </div>
                {index < traceInfo.attackPath.length - 1 && (
                  <div className="text-cyan-500/50">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 受影响资产 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server size={16} className="text-orange-400" />
            <span className="text-sm font-bold text-white">受影响资产</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {traceInfo.affectedAssets.map((asset, index) => (
              <span key={index} className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-300">
                {asset}
              </span>
            ))}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Clock size={16} className="mx-auto mb-1 text-cyan-400" />
            <p className="text-xs text-white/50">首次发现</p>
            <p className="text-sm font-bold text-white">{formatTime(traceInfo.firstSeen)}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <ShieldAlert size={16} className="mx-auto mb-1 text-red-400" />
            <p className="text-xs text-white/50">攻击次数</p>
            <p className="text-sm font-bold text-white">{traceInfo.attackCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Network size={16} className="mx-auto mb-1 text-purple-400" />
            <p className="text-xs text-white/50">C2服务器</p>
            <p className="text-sm font-bold text-white">{traceInfo.c2Servers?.length || 0}</p>
          </div>
        </div>

        {/* C2服务器列表 */}
        {traceInfo.c2Servers && traceInfo.c2Servers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-purple-400" />
              <span className="text-sm font-bold text-white">关联C2服务器</span>
            </div>
            <div className="space-y-2">
              {traceInfo.c2Servers.map((c2, index) => (
                <div key={index} className="flex items-center gap-3 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-purple-300">{c2}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// 告警统计卡片
const AlertStatCard: React.FC<{ 
  label: string; 
  value: number; 
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  color: string;
}> = ({ label, value, trend, trendValue, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
    <p className="text-xs text-white/50 mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <div className={`flex items-center gap-1 text-xs ${
        trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-yellow-400'
      }`}>
        {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
        {trendValue}
      </div>
    </div>
  </div>
);

const RealTimeAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [filterLevel, setFilterLevel] = useState<AlertLevel | 'all'>('all');
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 初始化并模拟实时更新
  useEffect(() => {
    setAlerts(generateMockAlerts());
    
    const interval = setInterval(() => {
      setAlerts(prev => {
        // 模拟新告警
        if (Math.random() > 0.7) {
          const newAlert: SecurityAlert = {
            id: `ALT-${Date.now()}`,
            level: Math.random() > 0.6 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            type: ['attack', 'vulnerability', 'compliance', 'anomaly'][Math.floor(Math.random() * 4)] as AlertType,
            title: '新检测到安全事件',
            description: '系统自动检测到新的安全威胁',
            source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            target: '服务器集群',
            timestamp: new Date().toISOString(),
            status: 'new',
            tags: ['自动检测']
          };
          return [newAlert, ...prev.slice(0, 19)];
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 过滤告警
  const filteredAlerts = alerts.filter(alert => {
    if (filterLevel !== 'all' && alert.level !== filterLevel) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    return true;
  });

  // 统计
  const stats = {
    total: alerts.length,
    high: alerts.filter(a => a.level === 'high').length,
    medium: alerts.filter(a => a.level === 'medium').length,
    low: alerts.filter(a => a.level === 'low').length,
    new: alerts.filter(a => a.status === 'new').length
  };

  return (
    <div className="h-full flex flex-col">
      {/* 统计区域 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <AlertStatCard 
          label="高危告警" 
          value={stats.high} 
          trend="up" 
          trendValue="+12%" 
          color="text-red-400" 
        />
        <AlertStatCard 
          label="中危告警" 
          value={stats.medium} 
          trend="stable" 
          trendValue="0%" 
          color="text-orange-400" 
        />
        <AlertStatCard 
          label="低危告警" 
          value={stats.low} 
          trend="down" 
          trendValue="-5%" 
          color="text-yellow-400" 
        />
        <AlertStatCard 
          label="待处理" 
          value={stats.new} 
          trend="up" 
          trendValue="+3" 
          color="text-cyan-400" 
        />
      </div>

      {/* 过滤栏 */}
      <div className="mb-3">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors"
        >
          <Filter size={12} />
          筛选
          {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        
        {showFilters && (
          <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">等级:</span>
              {(['all', 'high', 'medium', 'low'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    filterLevel === level 
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {level === 'all' ? '全部' : levelConfig[level].label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">类型:</span>
              {(['all', 'attack', 'vulnerability', 'compliance', 'anomaly'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    filterType === type 
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {type === 'all' ? '全部' : typeConfig[type].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 告警列表 */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredAlerts.map((alert) => {
          const levelStyle = levelConfig[alert.level];
          const typeStyle = typeConfig[alert.type];
          
          return (
            <div 
              key={alert.id}
              className={`relative p-3 rounded-lg border transition-all duration-300 cursor-pointer group ${levelStyle.bgColor} hover:brightness-110`}
            >
              {/* 闪烁效果 - 新告警 */}
              {alert.status === 'new' && (
                <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              )}
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${levelStyle.color} bg-black/30`}>
                      {levelStyle.icon}
                      {levelStyle.label}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${typeStyle.color}`}>
                      {typeStyle.icon}
                      {typeStyle.label}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">{formatTime(alert.timestamp)}</span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {alert.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-white/60 mb-2 line-clamp-2">{alert.description}</p>

                {/* Tags & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {alert.tags?.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {alert.traceInfo && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded text-xs text-cyan-300 transition-colors"
                    >
                      <Search size={10} />
                      溯源
                    </button>
                  )}
                </div>

                {/* Source & Target */}
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-4 text-xs">
                  <span className="text-white/40">
                    源: <span className="text-white/60 font-mono">{alert.source}</span>
                  </span>
                  <span className="text-white/40">
                    目标: <span className="text-white/60">{alert.target}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 溯源弹窗 */}
      {selectedAlert?.traceInfo && (
        <TracePanel 
          traceInfo={selectedAlert.traceInfo} 
          onClose={() => setSelectedAlert(null)} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 2px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RealTimeAlerts;
