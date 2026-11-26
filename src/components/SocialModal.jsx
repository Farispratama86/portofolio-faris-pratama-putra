import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Github, Globe, Instagram, Linkedin, Mail, MessageCircle, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function TikTokIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.32a6.34 6.34 0 0 0-6.61 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.42a8.28 8.28 0 0 0 4.84 1.57V6.69h-.05Z" />
    </svg>
  );
}

export default function SocialModal({ open, onClose, profile }) {
  const [copied, setCopied] = useState(false);
  const { t, tr } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const githubUrl = profile?.githubUrl || 'https://github.com/Farispratama86';
  const linkedinUrl = profile?.linkedinUrl || 'https://linkedin.com/in/faris-pratama-putra';
  const instagramUrl = profile?.instagramUrl || 'https://instagram.com/fpratamaputra';
  const tiktokUrl = profile?.tiktokUrl || 'https://tiktok.com/@fpratamaputra';
  const whatsappUrl = `https://wa.me/${profile?.whatsappNumber || '6281219534692'}`;
  const emailAddr = profile?.email || 'farispakez1209@gmail.com';

  const socialLinks = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Faris Pratama Putra',
      url: linkedinUrl,
      desc: t('socialModal.cards.linkedin.desc'),
      icon: Linkedin,
      color: 'tone-blue border group-hover:brightness-110',
      badge: t('socialModal.cards.linkedin.badge'),
      btnText: t('socialModal.cards.linkedin.btnText'),
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: '@Farispratama86',
      url: githubUrl,
      desc: t('socialModal.cards.github.desc'),
      icon: Github,
      color: 'tone-purple border group-hover:brightness-110',
      badge: t('socialModal.cards.github.badge'),
      btnText: t('socialModal.cards.github.btnText'),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@fpratamaputra',
      url: instagramUrl,
      desc: t('socialModal.cards.instagram.desc'),
      icon: Instagram,
      color: 'tone-rose border group-hover:brightness-110',
      badge: t('socialModal.cards.instagram.badge'),
      btnText: t('socialModal.cards.instagram.btnText'),
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@fpratamaputra',
      url: tiktokUrl,
      desc: t('socialModal.cards.tiktok.desc'),
      icon: TikTokIcon,
      color: 'tone-cyan border group-hover:brightness-110',
      badge: t('socialModal.cards.tiktok.badge'),
      btnText: t('socialModal.cards.tiktok.btnText'),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: profile?.whatsappDisplay || '+62 812-1953-4692',
      url: whatsappUrl,
      desc: t('socialModal.cards.whatsapp.desc'),
      icon: MessageCircle,
      color: 'tone-emerald border group-hover:brightness-110',
      badge: t('socialModal.cards.whatsapp.badge'),
      btnText: t('socialModal.cards.whatsapp.btnText'),
    },
    {
      id: 'email',
      name: t('socialModal.cards.email.name'),
      handle: emailAddr,
      url: `mailto:${emailAddr}`,
      desc: t('socialModal.cards.email.desc'),
      icon: Mail,
      color: 'tone-sky border group-hover:brightness-110',
      badge: t('socialModal.cards.email.badge'),
      btnText: t('socialModal.cards.email.btnText'),
    },
  ];

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto surface-card rounded-2xl border border-subtle shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-subtle surface-card">
          <div className="flex items-center gap-3 min-w-0">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.fullName || 'Faris Pratama Putra'}
                className="w-12 h-12 rounded-xl object-cover border border-sky-500/40 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-sky-500 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
                FP
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] truncate">
                  {profile?.fullName || 'Faris Pratama Putra'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
              </div>
              <p className="text-xs text-accent truncate">
                {tr(profile?.role || 'Web UI/UX Developer · Machine Learning · IoT')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('socialModal.closeAria')}
            className="p-2 rounded-xl text-secondary hover:text-[var(--text-primary)] hover:bg-elevated transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-secondary font-medium">
              {t('socialModal.subtitle')}
            </p>
            <span className="chip-tag text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 tone-amber-text" />
              <span>{t('socialModal.officialChannels')}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-2xl p-4 border border-subtle hover:border-sky-500/50 hover:bg-elevated/70 transition-all duration-200 flex flex-col justify-between group space-y-3 cursor-pointer shadow-sm hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-accent transition-colors">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs text-secondary truncate">{item.handle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-elevated border border-subtle text-secondary shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="pt-2 border-t border-subtle/60 flex items-center justify-between text-xs font-semibold text-accent">
                    <span className="group-hover:underline">{item.btnText}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 p-4 sm:p-5 border-t border-subtle surface-card flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-[var(--text-primary)] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 tone-emerald-text" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('socialModal.copiedUrl') : t('socialModal.copyUrl')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-subtle text-xs sm:text-sm font-semibold hover:bg-elevated transition-colors"
          >
            {t('socialModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
