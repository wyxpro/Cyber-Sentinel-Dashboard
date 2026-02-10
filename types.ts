
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
