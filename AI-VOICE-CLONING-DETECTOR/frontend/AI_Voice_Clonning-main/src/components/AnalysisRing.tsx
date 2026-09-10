import { useEffect, useState } from 'react';

interface AnalysisRingProps {
  value: number; // 0-100
  label: string;
  sublabel?: string;
  size?: number;
  colorClass?: string; // tailwind text color class for the stroke
  trackClass?: string;
  animate?: boolean;
}

export function AnalysisRing({
  value,
  label,
  sublabel,
  size = 160,
  colorClass = 'text-primary-600',
  trackClass = 'text-ink-100',
  animate = true,
}: AnalysisRingProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const strokeWidth = size > 140 ? 10 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClass}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={colorClass}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-ink-900" style={{ fontSize: size > 140 ? '2rem' : '1.5rem' }}>
          {displayValue}%
        </span>
        {label && <span className="mt-0.5 text-xs font-medium text-ink-500">{label}</span>}
        {sublabel && <span className="text-[10px] text-ink-400">{sublabel}</span>}
      </div>
    </div>
  );
}
