import React, { useEffect } from 'react';
import { Award, Building2, Calendar, CheckCircle2, ExternalLink, Sparkles, X } from 'lucide-react';
import { getCertificateCategoryStyle } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

export default function CertificateModal({ certificate, onClose, onNavigateToSection }) {
  const { t, tr } = useLanguage();

  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, onClose]);

  if (!certificate) return null;

  const handleScrollToCertificates = () => {
    onClose();
    if (onNavigateToSection) {
      onNavigateToSection('sertifikat');
    } else {
      const el = document.getElementById('sertifikat');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const rawTitle = tr(certificate.title || '');
  const displayTitle = rawTitle
    ? ((rawTitle.match(/"/g) || []).length % 2 !== 0 ? `${rawTitle}"` : rawTitle)
    : '';
  const displayCategory = tr(certificate.category || t('certificates.fallbackChip'));
  const displayIssueDate = certificate.issueDate ? tr(certificate.issueDate) : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto surface-card rounded-2xl border border-subtle shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-subtle surface-card">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl tone-amber border flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getCertificateCategoryStyle(certificate.category).badgeClass}`}>
                  {displayCategory}
                </span>
                {displayIssueDate && (
                  <span className="text-xs text-secondary flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted" />
                    {displayIssueDate}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-bold leading-snug line-clamp-2">
                {displayTitle}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('certificateModal.closeAria')}
            className="p-2 rounded-xl text-secondary hover:text-[var(--text-primary)] hover:bg-elevated transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Certificate Image or Mockup */}
          <div className="rounded-2xl overflow-hidden border border-subtle bg-slate-950/80 flex items-center justify-center">
            {certificate.imageUrl ? (
              <img
                src={certificate.imageUrl}
                alt={displayTitle}
                className="w-full max-h-[52vh] object-contain rounded-xl"
              />
            ) : (
              /* Ornate SVG Certificate Mockup when no photo is uploaded yet */
              <div className="w-full p-6 sm:p-10 text-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0d1627] to-slate-950 border-4 border-double border-amber-500/30 rounded-xl">
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50" />

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-400/50 text-amber-400 mb-3 shadow-lg">
                  <Award className="w-7 h-7" />
                </div>

                <p className="text-xs font-bold tracking-widest text-amber-400/90 uppercase mb-1 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('certificateModal.officialTitle')}
                  <Sparkles className="w-3.5 h-3.5" />
                </p>

                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-100 max-w-xl mx-auto mb-2 leading-snug">
                  {displayTitle}
                </h3>

                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  {t('certificateModal.awardedPrefix')}{' '}
                  <strong className="text-sky-300 font-semibold">{certificate.issuer}</strong>
                </p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('certificateModal.verified')}
                  </span>
                  <span>·</span>
                  <span>{t('certificateModal.issuerPrefix')} {certificate.issuer}</span>
                  {displayIssueDate && (
                    <>
                      <span>·</span>
                      <span>{t('certificateModal.periodPrefix')} {displayIssueDate}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-elevated border border-subtle flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block text-[11px]">{t('certificateModal.issuerLabel')}</span>
                <span className="font-semibold text-sm">{certificate.issuer}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-elevated border border-subtle flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block text-[11px]">{t('certificateModal.issueDateLabel')}</span>
                <span className="font-semibold text-sm">{displayIssueDate || t('certificateModal.recordedFallback')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {certificate.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">{t('certificateModal.descriptionLabel')}</h4>
              <p className="text-sm text-secondary leading-relaxed bg-elevated/50 p-4 rounded-xl border border-subtle text-justify">
                {tr(certificate.description)}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 p-4 sm:p-5 border-t border-subtle surface-card flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleScrollToCertificates}
            className="text-xs text-accent hover:underline font-semibold inline-flex items-center gap-1"
          >
            <span>{t('certificateModal.goToSection')} &darr;</span>
          </button>

          <div className="flex items-center gap-2">
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>{t('certificateModal.verifyCredential')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-subtle text-xs sm:text-sm font-semibold hover:bg-elevated transition-colors"
            >
              {t('certificateModal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
