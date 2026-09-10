import { SUPPORTED_LANGUAGES } from '@/types';
import type { Language } from '@/types';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  includeAuto?: boolean;
  id?: string;
}

export function LanguageSelector({ value, onChange, label, includeAuto = false, id }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages: (Language & { code: string })[] = includeAuto
    ? [{ code: 'auto', name: 'Auto-detect', nativeName: 'Auto', flag: 'UN' }, ...SUPPORTED_LANGUAGES]
    : SUPPORTED_LANGUAGES;

  const selected = languages.find((l) => l.code === value) || languages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-ink-600 mb-1.5">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-surface-border bg-white px-4 py-2.5 text-sm text-ink-800 transition-colors hover:border-ink-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-ink-400" />
          <span className="font-medium">{selected.name}</span>
          <span className="text-ink-400 text-xs">({selected.nativeName})</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-lg border border-surface-border bg-white shadow-card-lg max-h-64 overflow-y-auto animate-slide-in"
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-surface-sunken ${
                lang.code === value ? 'bg-primary-50 text-primary-700' : 'text-ink-700'
              }`}
              role="option"
              aria-selected={lang.code === value}
            >
              <span className="flex items-center gap-2.5">
                <span className="font-medium">{lang.name}</span>
                <span className="text-ink-400 text-xs">{lang.nativeName}</span>
              </span>
              {lang.code === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
