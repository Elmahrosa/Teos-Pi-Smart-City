export interface MetricSummary {
  totalDevices: number;
  activeAlerts: number;
  avgAirQuality: number;
  energyEfficiency: number;
}

export interface TelemetryRecord {
  ts: string;
  device_id: string;
  metric: string;
  value: number;
  location?: { type: string; coordinates: [number, number] };
}

export interface AlertEvent {
  id: string;
  device_id: string;
  metric: string;
  severity: "critical" | "warning" | "info";
  message: string;
  acknowledged: boolean;
  created_at: string;
}

export interface BadgeRule {
  metric: string;
  operator: ">" | "<" | ">=" | "<=" | "==" | "!=";
  threshold: number;
  duration?: number; // minutes
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rule: BadgeRule;
  enabled: boolean;
  created_at: string;
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  device_id: string;
  earned_at: string;
}
