
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

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertType = 'attack' | 'vulnerability' | 'compliance' | 'anomaly' | 'malware';

export type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  description: string;
  source: AlertSource;
  target: AlertTarget;
  timestamp: Date;
  status: AlertStatus;
  attackType: string;
  protocol: string;
  port?: number;
  payload?: string;
  mitigation?: string;
  relatedAlerts?: string[];
}

export interface AlertSource {
  ip: string;
  hostname?: string;
  geoLocation?: {
    country: string;
    city?: string;
    coordinates?: [number, number];
  };
  asn?: string;
  reputation?: 'malicious' | 'suspicious' | 'unknown' | 'benign';
}

export interface AlertTarget {
  ip: string;
  hostname?: string;
  assetName?: string;
  assetType?: 'server' | 'workstation' | 'network' | 'application' | 'database';
  criticality?: 'critical' | 'high' | 'medium' | 'low';
}

export interface TraceEvent {
  id: string;
  timestamp: Date;
  eventType: 'detection' | 'propagation' | 'mitigation' | 'investigation';
  description: string;
  actor?: string;
  details?: Record<string, unknown>;
}

export interface AlertTrace {
  alertId: string;
  events: TraceEvent[];
  attackChain?: AttackChainNode[];
  relatedIps: string[];
  timeline: {
    start: Date;
    detection: Date;
    end?: Date;
  };
}

export interface AttackChainNode {
  id: string;
  stage: 'reconnaissance' | 'weaponization' | 'delivery' | 'exploitation' | 'installation' | 'command_control' | 'actions';
  description: string;
  timestamp: Date;
  indicators: string[];
}

export interface AnalysisFilter {
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'custom';
  customTimeRange?: {
    start: Date;
    end: Date;
  };
  assets?: string[];
  attackTypes?: string[];
  severities?: AlertSeverity[];
  status?: AlertStatus[];
}

export interface ChartDataPoint {
  time: string;
  value: number;
  category?: string;
}

export interface MultiDimensionData {
  byTime: ChartDataPoint[];
  byAsset: AssetAnalytics[];
  byAttackType: AttackTypeAnalytics[];
}

export interface AssetAnalytics {
  assetId: string;
  assetName: string;
  ip: string;
  alertCount: number;
  criticalCount: number;
  topAttackTypes: string[];
  riskScore: number;
}

export interface AttackTypeAnalytics {
  type: string;
  count: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  percentage: number;
  avgSeverity: number;
}
