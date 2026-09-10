import type { Verdict, RiskLevel } from '@/types';
import { VERDICT_LABELS, RISK_LABELS } from '@/types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Shield } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md';
}

export function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = {
    authentic: { cls: 'badge-low', Icon: ShieldCheck },
    suspicious: { cls: 'badge-medium', Icon: ShieldAlert },
    ai_generated: { cls: 'badge-high', Icon: ShieldAlert },
  };
  const { cls, Icon } = config[verdict];
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <span className={`${cls} ${size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : ''}`}>
      <Icon className={iconSize} />
      {VERDICT_LABELS[verdict]}
    </span>
  );
}

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const cls = level === 'low' ? 'badge-low' : level === 'medium' ? 'badge-medium' : 'badge-high';
  const Icon = level === 'low' ? Shield : level === 'medium' ? AlertTriangle : ShieldAlert;
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <span className={`${cls} ${size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : ''}`}>
      <Icon className={iconSize} />
      {RISK_LABELS[level]}
    </span>
  );
}
