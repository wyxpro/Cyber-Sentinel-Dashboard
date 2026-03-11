
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Bug, FileWarning, Search, Info, Clock, Globe, ShieldAlert, X, Target } from 'lucide-react';

export interface SecurityAlert {
  id: string;
  type: 'attack' | 'vulnerability' | 'compliance';
  level: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  target: string;
  timestamp: string;
  details?: {
    ip?: string;
    port?: string;
    protocol?: string;
    severity?: number;
    attackVector?: string;
    recommendation?: string;
  };
}

const mockAlerts: SecurityAlert[] = [
  {
    id: 'ALERT-001',
    type: 'attack',
    level: 'critical',
    title: 'DDoS攻击检测',
    description: '检测到来自多个IP地址的分布式拒绝服务攻击',
    source: '198.51.100.45',
    target: '10.0.0.10',
    timestamp: '2分钟前',
    details: {
      ip: '198.51.100.45, 198.51.100.46',
      port: '80, 443',
      protocol: 'TCP',
      severity: 10,
      attackVector: 'HTTP Flood',
      recommendation: '立即启用DDoS防护，检查防火墙规则'
    }
  },
  {
    id: 'ALERT-002',
    type: 'vulnerability',
    level: 'high',
    title: 'SQL注入漏洞',
    description: '在用户登录页面检测到潜在SQL注入尝试',
    source: '203.0.113.89',
    target: '10.0.0.25',
    timestamp: '5分钟前',
    details: {
      ip: '203.0.113.89',
      port: '443',
      protocol: 'HTTPS',
      severity: 8,
      attackVector: 'SQL Injection',
      recommendation: '验证用户输入，使用参数化查询'
    }
  },
  {
    id: 'ALERT-003',
    type: 'compliance',
    level: 'medium',
    title: '不合规配置',
    description: '服务器配置不符合基线安全要求',
    source: '内部检测',
    target: '10.0.0.30',
    timestamp: '10分钟前',
    details: {
      ip: '10.0.0.30',
      severity: 5,
      recommendation: '立即更新安全配置，启用强密码策略'
    }
  },
  {
    id: 'ALERT-004',
    type: 'attack',
    level: 'high',
    title: '暴力破解尝试',
    description: '检测到SSH服务的多次失败登录尝试',
    source: '192.168.1.100',
    target: '10.0.0.15',
    timestamp: '15分钟前',
    details: {
      ip: '192.168.1.100',
      port: '22',
      protocol: 'SSH',
      severity: 7,
      attackVector: 'Brute Force',
      recommendation: '限制IP登录频率，启用双因素认证'
    }
  },
  {
    id: 'ALERT-005',
    type: 'vulnerability',
    level: 'low',
    title: '过期SSL证书',
    description: 'web服务器使用的SSL证书已过期',
    source: '内部扫描',
    target: '10.0.0.5',
    timestamp: '1小时前',
    details: {
      ip: '10.0.0.5',
      port: '443',
      severity: 3,
      recommendation: '更新SSL证书，启用自动续期'
    }
  },
  {
    id: 'ALERT-006',
    type: 'attack',
    level: 'critical',
    title: '数据泄露检测',
    description: '检测到敏感数据被批量导出',
    source: '10.0.0.100',
    target: '数据库服务器',
    timestamp: '刚刚',
    details: {
      ip: '10.0.0.100',
      port: '3306',
      protocol: 'MySQL',
      severity: 10,
      attackVector: 'Data Exfiltration',
      recommendation: '立即隔离该IP，检查访问权限'
    }
  },
];

const AlertLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const levelConfig = {
    critical: { bg: 'bg-red-900/40', border: 'border-red-500/50', text: 'text-red-400', icon: <AlertTriangle size={12} className="text-red-400" />, label: '高危' },
    high: { bg: 'bg-orange-900/40', border: 'border-orange-500/50', text: 'text-orange-400', icon: <ShieldAlert size={12} className="text-orange-400" />, label: '高' },
    medium: { bg: 'bg-yellow-900/40', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: <Bug size={12} className="text-yellow-400" />, label: '中' },
    low: { bg: 'bg-blue-900/40', border: 'border-blue-500/50', text: 'text-blue-400', icon: <Info size={12} className="text-blue-400" />, label: '低' },
  };
  
  const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.low;
  
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} border ${config.border} ${config.text}`}>
      {config.icon}
      <span className="text-xs font-bold">{config.label}</span>
    </div>
  );
};

const AlertTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'attack':
      return <ShieldAlert size={16} className="text-red-400" />;
    case 'vulnerability':
      return <Bug size={16} className="text-yellow-400" />;
    case 'compliance':
      return <FileWarning size={16} className="text-blue-400" />;
    default:
      return <AlertTriangle size={16} />;
  }
};

const AlertDetailModal: React.FC<{ alert: SecurityAlert | null; onClose: () => void }> = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#000814] border border-cyan-500/30 rounded-lg w-[600px] max-w-[90vw] shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <AlertTypeIcon type={alert.type} />
            <h3 className="text-xl font-bold text-white">{alert.title}</h3>
            <AlertLevelBadge level={alert.level} />
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-white/80 text-sm">{alert.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900/20 p-3 rounded border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                <Globe size={12} />
                <span>源地址</span>
              </div>
              <p className="text-white font-mono text-sm">{alert.source}</p>
            </div>
            
            <div className="bg-blue-900/20 p-3 rounded border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                <Target size={12} />
                <span>目标</span>
              </div>
              <p className="text-white font-mono text-sm">{alert.target}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900/20 p-3 rounded border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                <Clock size={12} />
                <span>时间</span>
              </div>
              <p className="text-white text-sm">{alert.timestamp}</p>
            </div>
            
            <div className="bg-blue-900/20 p-3 rounded border border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1">
                <Info size={12} />
                <span>类型</span>
              </div>
              <p className="text-white text-sm">
                {alert.type === 'attack' ? '攻击事件' : 
                 alert.type === 'vulnerability' ? '漏洞告警' : '合规违规'}
              </p>
            </div>
          </div>
          
          {alert.details && (
            <div className="bg-blue-900/10 p-3 rounded border border-cyan-500/20 space-y-2">
              <h4 className="text-cyan-400 text-sm font-bold">详细信息</h4>
              <div className="grid grid-cols-2 gap-y-2">
                {alert.details.ip && (
                  <>
                    <span className="text-white/60 text-xs">IP地址:</span>
                    <span className="text-white text-xs font-mono">{alert.details.ip}</span>
                  </>
                )}
                {alert.details.port && (
                  <>
                    <span className="text-white/60 text-xs">端口:</span>
                    <span className="text-white text-xs font-mono">{alert.details.port}</span>
                  </>
                )}
                {alert.details.protocol && (
                  <>
                    <span className="text-white/60 text-xs">协议:</span>
                    <span className="text-white text-xs font-mono">{alert.details.protocol}</span>
                  </>
                )}
                {alert.details.attackVector && (
                  <>
                    <span className="text-white/60 text-xs">攻击方式:</span>
                    <span className="text-white text-xs">{alert.details.attackVector}</span>
                  </>
                )}
                {alert.details.severity !== undefined && (
                  <>
                    <span className="text-white/60 text-xs">严重程度:</span>
                    <span className="text-white text-xs">{alert.details.severity}/10</span>
                  </>
                )}
              </div>
              
              {alert.details.recommendation && (
                <div className="mt-2 pt-2 border-t border-cyan-500/10">
                  <span className="text-white/60 text-xs">处置建议:</span>
                  <p className="text-white text-xs mt-1">{alert.details.recommendation}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <button className="px-3 py-1 text-xs bg-blue-900/30 hover:bg-blue-800/40 border border-cyan-500/30 text-cyan-400 rounded transition-colors">
              生成报告
            </button>
            <button className="px-3 py-1 text-xs bg-red-900/30 hover:bg-red-800/40 border border-red-500/30 text-red-400 rounded transition-colors">
              标记为已处理
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityAlerts: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(mockAlerts);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.level === filter;
  });

  const stats = {
    critical: alerts.filter(a => a.level === 'critical').length,
    high: alerts.filter(a => a.level === 'high').length,
    medium: alerts.filter(a => a.level === 'medium').length,
    low: alerts.filter(a => a.level === 'low').length,
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-xs rounded border ${filter === 'all' ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400' : 'bg-transparent border-white/10 text-white/60'} transition-colors`}
          >
            全部 ({alerts.length})
          </button>
          <button 
            onClick={() => setFilter('critical')}
            className={`px-2 py-1 text-xs rounded border flex items-center gap-1 ${filter === 'critical' ? 'bg-red-900/30 border-red-500/50 text-red-400' : 'bg-transparent border-white/10 text-white/60'} transition-colors`}
          >
            <AlertTriangle size={10} />
            高危 ({stats.critical})
          </button>
          <button 
            onClick={() => setFilter('high')}
            className={`px-2 py-1 text-xs rounded border ${filter === 'high' ? 'bg-orange-900/30 border-orange-500/50 text-orange-400' : 'bg-transparent border-white/10 text-white/60'} transition-colors`}
          >
            高 ({stats.high})
          </button>
          <button 
            onClick={() => setFilter('medium')}
            className={`px-2 py-1 text-xs rounded border ${filter === 'medium' ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400' : 'bg-transparent border-white/10 text-white/60'} transition-colors`}
          >
            中 ({stats.medium})
          </button>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="搜索告警..." 
            className="bg-blue-900/20 border border-cyan-500/30 rounded px-3 py-1 text-xs text-white placeholder-white/40 w-32 focus:outline-none focus:border-cyan-400"
          />
          <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40" />
        </div>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scroll">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className="group bg-blue-900/10 hover:bg-blue-800/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded p-3 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTypeIcon type={alert.type} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white text-sm font-bold">{alert.title}</h4>
                    <AlertLevelBadge level={alert.level} />
                  </div>
                  <p className="text-white/60 text-xs mb-1">{alert.description}</p>
                  <div className="flex items-center gap-3 text-white/40 text-xs">
                    <span className="flex items-center gap-1"><Clock size={10} />{alert.timestamp}</span>
                    <span className="flex items-center gap-1"><Globe size={10} />{alert.source}</span>
                  </div>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 hover:text-white">
                <Info size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
        }
        .border-red-500\/50 {
          animation: pulse-glow 2s infinite;
        }
      `}} />
    </div>
  );
};

export default SecurityAlerts;
