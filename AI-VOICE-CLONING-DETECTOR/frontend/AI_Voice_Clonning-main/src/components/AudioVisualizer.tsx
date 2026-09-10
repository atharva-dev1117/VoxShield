import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioVisualizerProps {
  barCount?: number;
  active: boolean;
  className?: string;
  barClassName?: string;
  /** When true, render a static waveform pattern (non-playing) */
  staticBars?: boolean;
}

/**
 * A decorative audio waveform visualizer.
 * Uses deterministic pseudo-random bars for a realistic look without needing real audio data.
 */
export function AudioVisualizer({
  barCount = 48,
  active = false,
  className = '',
  barClassName = '',
  staticBars = false,
}: AudioVisualizerProps) {
  const heights = useRef<number[]>([]);
  if (heights.current.length === 0) {
    heights.current = Array.from({ length: barCount }, (_, i) => {
      const base = 30 + Math.sin(i * 0.3) * 20 + Math.cos(i * 0.7) * 15;
      return Math.max(12, Math.min(95, base + (i % 3) * 8));
    });
  }

  return (
    <div className={`flex items-center justify-center gap-[3px] ${className}`} aria-hidden="true">
      {heights.current.map((h, i) => (
        <div
          key={i}
          className={`rounded-full ${barClassName || 'bg-primary-400'} ${active && !staticBars ? 'animate-pulse-ring' : ''}`}
          style={{
            width: '3px',
            height: `${h}%`,
            animationDelay: `${i * 40}ms`,
            animationDuration: `${600 + (i % 5) * 100}ms`,
            opacity: staticBars ? 0.5 : active ? 0.9 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

interface AudioPlayerProps {
  fileName: string;
  durationSec: number;
}

export function AudioPlayer({ fileName, durationSec }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setPlaying(true);
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return p + 100 / (durationSec * 10);
        });
      }, 100);
    }
  };

  const currentTime = (progress / 100) * durationSec;
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors active:scale-95"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium text-ink-700 truncate">{fileName}</span>
            <span className="text-xs font-mono text-ink-400 shrink-0">
              {formatTime(currentTime)} / {formatTime(durationSec)}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 h-16">
        <AudioVisualizer active={playing} barClassName="bg-primary-400" />
      </div>
    </div>
  );
}
