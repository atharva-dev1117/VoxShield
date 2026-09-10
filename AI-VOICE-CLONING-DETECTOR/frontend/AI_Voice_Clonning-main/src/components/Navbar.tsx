import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/history', label: 'History' },
  { to: '/transcription', label: 'Transcripts' },
  { to: '/about', label: 'How It Works' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="VoxShield AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold text-ink-900">VoxShield</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">AI Security</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-surface-sunken hover:text-ink-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/settings" className="btn-ghost text-sm">
              Settings
            </Link>
            <Link to="/analyze" className="btn-primary text-sm">
              Analyze Audio
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-surface-sunken"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-surface-border py-3 animate-slide-in">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-surface-sunken'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex gap-2 mt-2 px-1">
                <Link to="/settings" onClick={() => setOpen(false)} className="btn-secondary flex-1 text-sm">
                  Settings
                </Link>
                <Link to="/analyze" onClick={() => setOpen(false)} className="btn-primary flex-1 text-sm">
                  Analyze
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
