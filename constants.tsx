
import React from 'react';
import { Shield, Activity, Zap, AlertTriangle, Database, Globe } from 'lucide-react';

export const COLORS = {
  primary: '#00f2ff',
  secondary: '#7000ff',
  danger: '#ff0055',
  warning: '#ffaa00',
  bg: '#000814',
  card: 'rgba(0, 20, 40, 0.6)',
};

export const TOP_METRICS = [
  { label: '全网总分', value: '51分', icon: <Shield size={20} className="text-cyan-400" /> },
  { label: '资产态势', value: '优秀', icon: <Database size={20} className="text-blue-400" /> },
  { label: '运行态势', value: '待改进', icon: <Activity size={20} className="text-yellow-400" /> },
  { label: '攻击态势', value: '无攻击', icon: <Zap size={20} className="text-green-400" /> },
  { label: '脆弱性态势', value: '待改进', icon: <AlertTriangle size={20} className="text-orange-400" /> },
  { label: '运营态势', value: '待改进', icon: <Globe size={20} className="text-cyan-400" /> },
];
