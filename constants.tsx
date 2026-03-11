
import React from 'react';
import { Shield, Activity, Zap, AlertTriangle, Database, Globe, Bell, Bug, FileWarning, Lock } from 'lucide-react';
import type { AlertLevel, AlertType } from './types';

export const COLORS = {
  primary: '#00f2ff',
  secondary: '#7000ff',
  danger: '#ff0055',
  warning: '#ffaa00',
  bg: '#000814',
  card: 'rgba(0, 20, 40, 0.6)',
};

// 告警等级颜色配置
export const ALERT_LEVEL_COLORS: Record<AlertLevel, { bg: string; border: string; text: string; glow: string }> = {
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
  },
  medium: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
  },
  low: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
  }
};

// 告警类型配置
export const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; icon: React.ReactNode; color: string }> = {
  attack: {
    label: '攻击事件',
    icon: <Zap size={16} />,
    color: 'text-red-400'
  },
  vulnerability: {
    label: '漏洞告警',
    icon: <Bug size={16} />,
    color: 'text-purple-400'
  },
  compliance: {
    label: '合规违规',
    icon: <FileWarning size={16} />,
    color: 'text-blue-400'
  },
  anomaly: {
    label: '异常行为',
    icon: <Activity size={16} />,
    color: 'text-cyan-400'
  }
};

// 图表颜色配置
export const CHART_COLORS = [
  '#00f2ff',  // 青色
  '#ff0055',  // 红色
  '#ffaa00',  // 橙色
  '#7000ff',  // 紫色
  '#00ff9d',  // 绿色
  '#ff6b6b',  // 粉红
  '#4ecdc4',  // 青绿
  '#ffe66d',  // 黄色
];

// 时间范围选项
export const TIME_RANGE_OPTIONS = [
  { value: '1h', label: '1小时', minutes: 60 },
  { value: '6h', label: '6小时', minutes: 360 },
  { value: '24h', label: '24小时', minutes: 1440 },
  { value: '7d', label: '7天', minutes: 10080 },
  { value: '30d', label: '30天', minutes: 43200 },
];

// 可视化维度选项
export const DIMENSION_OPTIONS = [
  { value: 'time', label: '时间维度', icon: <Activity size={14} /> },
  { value: 'asset', label: '资产维度', icon: <Database size={14} /> },
  { value: 'attackType', label: '攻击类型', icon: <Shield size={14} /> },
  { value: 'severity', label: '严重程度', icon: <AlertTriangle size={14} /> },
  { value: 'location', label: '地理位置', icon: <Globe size={14} /> },
];

// 顶部指标
export const TOP_METRICS = [
  { label: '全网总分', value: '51分', icon: <Shield size={20} className="text-cyan-400" /> },
  { label: '资产态势', value: '优秀', icon: <Database size={20} className="text-blue-400" /> },
  { label: '运行态势', value: '待改进', icon: <Activity size={20} className="text-yellow-400" /> },
  { label: '攻击态势', value: '无攻击', icon: <Zap size={20} className="text-green-400" /> },
  { label: '脆弱性态势', value: '待改进', icon: <AlertTriangle size={20} className="text-orange-400" /> },
  { label: '运营态势', value: '待改进', icon: <Globe size={20} className="text-cyan-400" /> },
];
