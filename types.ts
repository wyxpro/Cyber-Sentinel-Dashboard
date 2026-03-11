
// Import React to resolve 'Cannot find namespace React' error when using React.ReactNode
import React from 'react';

export interface AttackData {
  id: string;
  source: string;
  target: string;
  type: string;
  timestamp: string;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  status?: 'good' | 'warning' | 'danger';
  icon: React.ReactNode;
}

// 告警等级
export type AlertLevel = 'high' | 'medium' | 'low';

// 告警类型
export type AlertType = 'attack' | 'vulnerability' | 'compliance' | 'anomaly';

// 告警状态
export type AlertStatus = 'new' | 'processing' | 'resolved' | 'ignored';

// 实时安全告警
export interface SecurityAlert {
  id: string;
  level: AlertLevel;
  type: AlertType;
  title: string;
  description: string;
  source: string;
  target: string;
  timestamp: string;
  status: AlertStatus;
  traceInfo?: TraceInfo;
  tags?: string[];
}

// 溯源信息
export interface TraceInfo {
  attackerIP: string;
  attackerLocation: string;
  attackPath: string[];
  affectedAssets: string[];
  firstSeen: string;
  attackCount: number;
  c2Servers?: string[];
}

// 可视化维度
export type DimensionType = 'time' | 'asset' | 'attackType' | 'severity' | 'location';

// 图表数据点
export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
  timestamp?: string;
}

// 热力图数据
export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

// 时间序列数据
export interface TimeSeriesData {
  timestamp: string;
  attacks: number;
  alerts: number;
  blocked: number;
}

// 资产数据
export interface AssetData {
  id: string;
  name: string;
  ip: string;
  type: string;
  riskScore: number;
  alertCount: number;
  lastAttack: string;
}

// 攻击类型统计
export interface AttackTypeStat {
  type: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

// 可视化配置
export interface VisualizationConfig {
  dimension: DimensionType;
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  chartType: 'line' | 'bar' | 'pie' | 'heatmap' | 'radar';
}
