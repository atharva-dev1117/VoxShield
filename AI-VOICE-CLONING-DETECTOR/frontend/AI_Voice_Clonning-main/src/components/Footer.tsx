import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Analyze Audio', to: '/analyze' },
      { label: 'History', to: '/history' },
      { label: 'Settings', to: '/settings' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', to: '/about' },
      { label: 'Transcription', to: '/transcription' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-display text-base font-bold text-ink-900">VoxShield AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-500 leading-relaxed">
              AI-powered real-time detection and prevention of voice cloning and impersonation attacks.
              Protecting conversations across six Indian languages.
            </p>
            <div className="mt-5 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-ink-500 hover:bg-surface-sunken hover:text-ink-800 transition-colors"
                  aria-label="Social media link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ink-900">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-500 hover:text-primary-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-ink-400">© 2026 VoxShield AI. Built for Smart India Hackathon. Prototype for demonstration.</p>
          <p className="text-xs text-ink-400">Voice analysis powered by ML — demo mode active</p>
        </div>
      </div>
    </footer>
  );
}
