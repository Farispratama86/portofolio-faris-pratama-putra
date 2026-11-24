import React, { useState } from 'react';
import { FileText, Menu, Moon, Sun, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'pengalaman', label: 'Pengalaman' },
  { id: 'proyek', label: 'Proyek' },
  { id: 'sertifikat', label: 'Sertifikat' },
  { id: 'keahlian', label: 'Keahlian' },
  { id: 'kontak', label: 'Kontak' },
];

export default function Navbar({ activeSection, theme, onToggleTheme, onOpenCv }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav-glass fixed top-0 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#beranda" className="flex items-center gap-2.5 font-bold text-lg tracking-tight shrink-0">
          <span className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-sm font-extrabold">
            {PROFILE.initials}
          </span>
          <span>
            {PROFILE.shortBrand}
            <span className="text-accent">{PROFILE.brandSuffix}</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-accent bg-sky-500/10'
                  : 'text-secondary hover:text-accent'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCv}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-subtle hover:border-sky-400/60"
          >
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>CV</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Ubah tema gelap atau terang"
            className="p-2 rounded-lg border border-subtle hover:border-sky-400/60"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-sky-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg border border-subtle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-subtle px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                activeSection === item.id ? 'text-accent bg-sky-500/10' : 'text-secondary'
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenCv();
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-accent"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat Ringkasan CV</span>
          </button>
        </div>
      )}
    </header>
  );
}
