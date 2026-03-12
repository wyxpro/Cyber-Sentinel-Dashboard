
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertTriangle, Shield, Bug, FileWarning, Activity, 
  ChevronRight, Clock, MapPin, Server, Globe, 
  X, ExternalLink, Copy, CheckCircle, AlertCircle,
  Zap, Eye, ArrowRight, Radio
} from 'lucide-react';
import { SecurityAlert, AlertSeverity, AlertStatus, AlertType, AlertTrace, TraceEvent, AttackChainNode } from '../types';

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; bgColor: string; borderColor: string; glow: string; label: string }> = {
  critical: { 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20', 
    borderColor: 'border-red-500/50',
    glow: 'shadow-red-500/50',
    label: '高危'
  },
  high: { 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/20', 
    borderColor: 'border-orange-500/50',
    glow: 'shadow-orange-500/50',
    label: '高危'
  },
  medium: { 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/20', 
    borderColor: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/50',
    label: '中危'
  },
  low: { 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/20', 
    borderColor: 'border-blue-500/50',
    glow: 'shadow-blue-500/50',
    label: '低危'
  }
};

const ALERT_TYPE_CONFIG: Record<AlertType, { icon: React.ReactNode; label: string }> = {
  attack: { icon: <Zap size={14} />, label: '攻击' },
  vulnerability: { icon: <Bug size={14} />, label: '漏洞' },
  compliance: { icon: <FileWarning size={14} />, label: '合规' },
  anomaly: { icon: <Activity size={14} />, label: '异常' },
  malware: { icon: <Shield size={14} />, label: '恶意软件' }
};

const STATUS_CONFIG: Record<AlertStatus, { color: string; label: string }> = {
  new: { color: 'text-cyan-400', label: '新建' },
  acknowledged: { color: 'text-yellow-400', label: '已确认' },
  investigating: { color: 'text-orange-400', label: '调查中' },
  resolved: { color: 'text-green-400', label: '已解决' },
  false_positive: { color: 'text-gray-400', label: '误报' }
};

const generateMockAlerts = (): SecurityAlert[] => {
  const alerts: SecurityAlert[] = [];
  const severities: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
  const types: AlertType[] = ['attack', 'vulnerability', 'compliance', 'anomaly', 'malware'];
  const statuses: AlertStatus[] = ['new', 'acknowledged', 'investigating', 'resolved'];
  const attackTypes = ['SQL注入', 'XSS攻击', 'DDoS攻击', '暴力破解', '端口扫描', '恶意文件上传', '权限提升', '数据泄露'];
  const countries = ['中国', '美国', '俄罗斯', '韩国', '日本', '德国', '巴西', '印度'];
  const cities = ['北京', '上海', '深圳', '杭州', '成都', '广州', '南京', '武汉'];
  
  for (let i = 0; i < 15; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    alerts.push({
      id: `ALT-${Date.now()}-${i}`,
      severity,
      type,
      title: `${attackTypes[Math.floor(Math.random() * attackTypes.length)]}检测 - ${type === 'attack' ? '攻击行为' : type === 'vulnerability' ? '漏洞告警' : '安全事件'}`,
      description: `检测到来自 ${country} ${city} 的可疑活动，目标资产为核心服务器集群。攻击者尝试利用已知漏洞进行渗透。`,
      source: {
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        geoLocation: { country, city },
        reputation: Math.random() > 0.5 ? 'malicious' : 'suspicious'
      },
      target: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        hostname: `server-${Math.floor(Math.random() * 100)}.internal`,
        assetName: `核心应用服务器-${Math.floor(Math.random() * 10)}`,
        assetType: 'server',
        criticality: severity === 'critical' ? 'critical' : 'high'
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      status,
      attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      protocol: Math.random() > 0.5 ? 'TCP' : 'HTTP',
      port: Math.floor(Math.random() * 65535)
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateMockTrace = (alert: SecurityAlert): AlertTrace => {
  const events: TraceEvent[] = [
    {
      id: 'evt-1',
      timestamp: new Date(alert.timestamp.getTime() - 300000),
      eventType: 'detection',
      description: 'IDS检测到异常流量模式',
      actor: '系统自动检测',
      details: { rule: 'SQL_INJECTION_001', confidence: 0.95 }
    },
    {
      id: 'evt-2',
      timestamp: new Date(alert.timestamp.getTime() - 180000),
      eventType: 'propagation',
      description: '攻击流量已转发至安全分析引擎',
      actor: '流量分析系统',
      details: { forwarded: true }
    },
    {
      id: 'evt-3',
      timestamp: alert.timestamp,
      eventType: 'investigation',
      description: '安全分析师开始调查',
      actor: '安全运营中心',
      details: { assignedTo: '安全团队A组' }
    }
  ];

  const attackChain: AttackChainNode[] = [
    {
      id: 'chain-1',
      stage: 'reconnaissance',
      description: '端口扫描活动',
      timestamp: new Date(alert.timestamp.getTime() - 600000),
      indicators: ['nmap scan', 'port enumeration']
    },
    {
      id: 'chain-2',
      stage: 'exploitation',
      description: 'SQL注入尝试',
      timestamp: new Date(alert.timestamp.getTime() - 300000),
      indicators: ['union select', 'or 1=1']
    },
    {
      id: 'chain-3',
      stage: 'installation',
      description: 'Webshell上传尝试',
      timestamp: alert.timestamp,
      indicators: ['cmd.exe', 'powershell']
    }
  ];

  return {
    alertId: alert.id,
    events,
    attackChain,
    relatedIps: [alert.source.ip, '10.0.0.1', '172.16.0.5'],
    timeline: {
      start: new Date(alert.timestamp.getTime() - 600000),
      detection: alert.timestamp,
      end: alert.status === 'resolved' ? new Date() : undefined
    }
  };
};

const AlertItem: React.FC<{ 
  alert: SecurityAlert; 
  onClick: () => void;
  isNew?: boolean;
}> = ({ alert, onClick, isNew }) => {
  const config = SEVERITY_CONFIG[alert.severity];
  const typeConfig = ALERT_TYPE_CONFIG[alert.type];
  const statusConfig = STATUS_CONFIG[alert.status];
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-300
        border-l-2 ${config.borderColor}
        ${isNew ? 'animate-pulse-subtle' : ''}
      `}
    >
      <div className={`
        p-3 bg-gradient-to-r from-[#0a1628] to-[#0d1f35]
        hover:from-[#0f1f35] hover:to-[#122a45]
        border border-cyan-500/10 hover:border-cyan-500/30
        transition-all duration-300
      `}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`
              px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded
              ${config.bgColor} ${config.color}
            `}>
              {config.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-cyan-400/70">
              {typeConfig.icon}
              {typeConfig.label}
            </span>
            {isNew && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-[9px] font-bold rounded animate-pulse">
                <Radio size={8} />
                实时
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
        
        <h4 className="text-[12px] font-bold text-white/90 mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {alert.title}
        </h4>
        
        <div className="flex items-center gap-4 text-[10px] text-white/50">
          <span className="flex items-center gap-1">
            <Globe size={10} />
            {alert.source.geoLocation?.country || '未知'}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {alert.source.ip}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {alert.timestamp.toLocaleTimeString('zh-CN')}
          </span>
        </div>
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={16} className="text-cyan-400" />
        </div>
      </div>
    </div>
  );
};

const AttackChainVisualization: React.FC<{ chain: AttackChainNode[] }> = ({ chain }) => {
  const stageLabels: Record<string, string> = {
    reconnaissance: '侦察',
    weaponization: '武器化',
    delivery: '投递',
    exploitation: '利用',
    installation: '安装',
    command_control: '命令控制',
    actions: '行动'
  };

  const stageColors: Record<string, string> = {
    reconnaissance: 'bg-blue-500',
    weaponization: 'bg-purple-500',
    delivery: 'bg-orange-500',
    exploitation: 'bg-red-500',
    installation: 'bg-pink-500',
    command_control: 'bg-yellow-500',
    actions: 'bg-red-600'
  };

  return (
    <div className="relative py-4">
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-500/50 to-cyan-500/20" />
      
      <div className="flex justify-between relative">
        {['reconnaissance', 'exploitation', 'installation', 'command_control', 'actions'].map((stage, index) => {
          const node = chain.find(n => n.stage === stage);
          const isActive = !!node;
          
          return (
            <div key={stage} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                border-2 transition-all duration-300
                ${isActive 
                  ? `${stageColors[stage]} border-white/50 shadow-lg` 
                  : 'bg-gray-800 border-gray-600'
                }
              `}>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                )}
              </div>
              <span className={`
                mt-2 text-[10px] font-medium
                ${isActive ? 'text-cyan-400' : 'text-white/30'}
              `}>
                {stageLabels[stage]}
              </span>
              {isActive && (
                <span className="text-[8px] text-white/50 mt-1">
                  {node?.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlertDetailModal: React.FC<{ 
  alert: SecurityAlert | null; 
  onClose: () => void;
}> = ({ alert, onClose }) => {
  const [trace, setTrace] = useState<AlertTrace | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'trace' | 'mitigation'>('detail');
  
  useEffect(() => {
    if (alert) {
      setTrace(generateMockTrace(alert));
    }
  }, [alert]);
  
  if (!alert) return null;
  
  const config = SEVERITY_CONFIG[alert.severity];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d1f35] border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
        
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className={`
              px-3 py-1 text-xs font-bold uppercase tracking-wider
              ${config.bgColor} ${config.color}
            `}>
              {config.label}
            </span>
            <h2 className="text-lg font-bold text-white">{alert.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-white/60" />
          </button>
        </div>
        
        <div className="flex border-b border-cyan-500/20">
          {[
            { id: 'detail', label: '告警详情', icon: <AlertCircle size={14} /> },
            { id: 'trace', label: '溯源分析', icon: <Eye size={14} /> },
            { id: 'mitigation', label: '处置建议', icon: <Shield size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all
                ${activeTab === tab.id 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10' 
                  : 'text-white/50 hover:text-white/80'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scroll">
          {activeTab === 'detail' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe size={14} />
                    攻击源信息
                  </h3>
                  <div className="bg-black/30 border border-cyan-500/20 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">IP地址</span>
                      <span className="text-white font-mono">{alert.source.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">地理位置</span>
                      <span className="text-white">{alert.source.geoLocation?.country} {alert.source.geoLocation?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">威胁信誉</span>
                      <span className={`${alert.source.reputation === 'malicious' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {alert.source.reputation === 'malicious' ? '恶意' : '可疑'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Server size={14} />
                    目标资产信息
                  </h3>
                  <div className="bg-black/30 border border-cyan-500/20 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">IP地址</span>
                      <span className="text-white font-mono">{alert.target.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">主机名</span>
                      <span className="text-white">{alert.target.hostname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">资产名称</span>
                      <span className="text-white">{alert.target.assetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50 text-sm">资产重要性</span>
                      <span className="text-orange-400">{alert.target.criticality}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">攻击详情</h3>
                <div className="bg-black/30 border border-cyan-500/20 p-4">
                  <p className="text-white/80 text-sm leading-relaxed">{alert.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-white/50">攻击类型</span>
                      <p className="text-white font-medium">{alert.attackType}</p>
                    </div>
                    <div>
                      <span className="text-white/50">协议</span>
                      <p className="text-white font-medium">{alert.protocol}</p>
                    </div>
                    <div>
                      <span className="text-white/50">端口</span>
                      <p className="text-white font-medium">{alert.port}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'trace' && trace && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">攻击链分析</h3>
                <AttackChainVisualization chain={trace.attackChain || []} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">事件时间线</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500 to-transparent" />
                  
                  <div className="space-y-4">
                    {trace.events.map((event, index) => (
                      <div key={event.id} className="relative pl-10">
                        <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-cyan-300 shadow-lg shadow-cyan-500/50" />
                        
                        <div className="bg-black/30 border border-cyan-500/20 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-cyan-400 font-medium uppercase">
                              {event.eventType === 'detection' ? '检测' : 
                               event.eventType === 'propagation' ? '传播' :
                               event.eventType === 'mitigation' ? '缓解' : '调查'}
                            </span>
                            <span className="text-xs text-white/50">
                              {event.timestamp.toLocaleTimeString('zh-CN')}
                            </span>
                          </div>
                          <p className="text-sm text-white/80">{event.description}</p>
                          {event.actor && (
                            <p className="text-xs text-white/40 mt-1">执行者: {event.actor}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">关联IP</h3>
                <div className="flex flex-wrap gap-2">
                  {trace.relatedIps.map((ip, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded">
                      {ip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'mitigation' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 p-4">
                <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} />
                  推荐处置措施
                </h3>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
                    <span>立即封锁攻击源IP: {alert.source.ip}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
                    <span>检查目标服务器 {alert.target.hostname} 是否存在未授权访问痕迹</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
                    <span>更新WAF规则以阻止类似攻击模式</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-green-400 mt-1 shrink-0" />
                    <span>对相关系统进行全面安全审计</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors">
                  <Shield size={16} />
                  立即封禁IP
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                  <ExternalLink size={16} />
                  生成报告
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RealTimeAlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    setAlerts(generateMockAlerts());
    
    const interval = setInterval(() => {
      const newAlert = generateMockAlerts()[0];
      newAlert.id = `ALT-${Date.now()}`;
      newAlert.timestamp = new Date();
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
      setNewAlertIds(prev => new Set([...prev, newAlert.id]).size > 5 
        ? new Set([...prev, newAlert.id].slice(-5)) 
        : new Set([...prev, newAlert.id])
      );
      
      setTimeout(() => {
        setNewAlertIds(prev => {
          const next = new Set(prev);
          next.delete(newAlert.id);
          return next;
        });
      }, 5000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === filter);
  
  const severityCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };
  
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio size={16} className="text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-30" />
            </div>
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">实时监控</span>
          </div>
          <span className="text-xs text-white/40">{alerts.length} 条告警</span>
        </div>
        
        <div className="flex gap-2 mb-4">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`
                px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all
                ${filter === sev 
                  ? sev === 'all' 
                    ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' 
                    : `${SEVERITY_CONFIG[sev].bgColor} ${SEVERITY_CONFIG[sev].color} border ${SEVERITY_CONFIG[sev].borderColor}`
                  : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'
                }
              `}
            >
              {sev === 'all' ? '全部' : SEVERITY_CONFIG[sev].label}
              {sev !== 'all' && (
                <span className="ml-1 opacity-60">({severityCounts[sev]})</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scroll space-y-2 pr-1">
          {filteredAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onClick={() => setSelectedAlert(alert)}
              isNew={newAlertIds.has(alert.id)}
            />
          ))}
        </div>
      </div>
      
      <AlertDetailModal 
        alert={selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
      />
    </>
  );
};

export const AlertSummaryBar: React.FC = () => {
  const [counts, setCounts] = useState({ critical: 12, high: 45, medium: 128, low: 256 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        critical: prev.critical + Math.floor(Math.random() * 3),
        high: prev.high + Math.floor(Math.random() * 5),
        medium: prev.medium + Math.floor(Math.random() * 8),
        low: prev.low + Math.floor(Math.random() * 10)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-4">
      {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map(severity => {
        const config = SEVERITY_CONFIG[severity];
        return (
          <div key={severity} className="flex items-center gap-2 group cursor-default">
            <div className={`w-2 h-2 rounded-full ${config.bgColor} shadow-lg ${config.glow}`} />
            <span className="text-[10px] text-white/50 uppercase">{config.label}</span>
            <span className={`text-sm font-bold ${config.color} group-hover:scale-110 transition-transform`}>
              {counts[severity]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
