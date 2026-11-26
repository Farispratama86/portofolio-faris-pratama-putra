import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, FileText, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

const NAV_IDS = ['beranda', 'pengalaman', 'proyek', 'sertifikat', 'keahlian', 'kontak'];

const LANGUAGE_OPTIONS = [
  { code: 'id', short: 'ID', labelKey: 'nav.langId' },
  { code: 'en', short: 'EN', labelKey: 'nav.langEn' },
];

export default function Navbar({ activeSection, theme, onToggleTheme, onOpenCv }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const { lang, setLang, t, translating } = useLanguage();

  useEffect(() => {
    if (!langMenuOpen) return undefined;
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

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
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'text-accent bg-sky-500/10'
                  : 'text-secondary hover:text-accent'
              }`}
            >
              {t(`nav.${id}`)}
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
            <span>{t('nav.cv')}</span>
          </button>

          {/* Pemilih Bahasa Terpisah (ID <-> EN) di samping tombol Dark/Light Mode */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              aria-label={t('nav.langButtonLabel')}
              aria-expanded={langMenuOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                langMenuOpen
                  ? 'border-sky-500/60 bg-sky-500/10 text-accent'
                  : 'border-subtle hover:border-sky-400/60'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 text-accent ${translating ? 'animate-spin' : ''}`} />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-secondary transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div
                role="menu"
                aria-label={t('nav.langMenuTitle')}
                className="absolute right-0 mt-2 w-56 surface-card border border-subtle rounded-xl shadow-2xl p-1.5 z-50"
              >
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-subtle mb-1">
                  {t('nav.langMenuTitle')}
                </div>
                {LANGUAGE_OPTIONS.map((opt) => {
                  const isSelected = lang === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setLang(opt.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        isSelected
                          ? 'bg-sky-500/15 text-accent font-semibold'
                          : 'text-secondary hover:bg-elevated hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-5 rounded text-[10px] font-bold border ${
                            isSelected
                              ? 'bg-sky-500 text-white border-sky-500'
                              : 'bg-elevated border-subtle text-secondary'
                          }`}
                        >
                          {opt.short}
                        </span>
                        <span>{t(opt.labelKey)}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                    </button>
                  );
                })}
                {translating && (
                  <div className="mt-1 px-2.5 py-1 text-[10px] text-accent border-t border-subtle">
                    {t('nav.translatingNote')}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={t('nav.toggleThemeLabel')}
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
            aria-label={t('nav.toggleMenuLabel')}
            className="md:hidden p-2 rounded-lg border border-subtle"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-subtle px-4 py-3 space-y-1">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                activeSection === id ? 'text-accent bg-sky-500/10' : 'text-secondary'
              }`}
            >
              {t(`nav.${id}`)}
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
            <span>{t('nav.viewCvMobile')}</span>
          </button>
        </div>
      )}
    </header>
  );
}
