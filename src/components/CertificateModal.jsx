import React, { useEffect, useState } from 'react';
import { Award, Building2, Calendar, CheckCircle2, ExternalLink, Sparkles, X, ZoomIn, ZoomOut } from 'lucide-react';
import { getCertificateCategoryStyle } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

export default function CertificateModal({ certificate, onClose, onNavigateToSection }) {
  const { t, tr } = useLanguage();
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [certificate]);

  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomed) setZoomed(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, zoomed, onClose]);

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
          {/* Certificate Image or Mockup (Klik untuk Zoom Resolusi Penuh) */}
          <div className="rounded-2xl overflow-hidden border border-subtle bg-[#0d0c0b] flex items-center justify-center relative group">
            {certificate.imageUrl ? (
              <>
                <img
                  src={certificate.imageUrl}
                  alt={displayTitle}
                  onClick={() => setZoomed(true)}
                  className="w-full max-h-[52vh] object-contain rounded-xl cursor-zoom-in"
                />
                <button
                  type="button"
                  onClick={() => setZoomed(true)}
                  aria-label="Zoom resolusi penuh"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 text-white border border-white/20 text-xs font-mono-code hover:bg-[var(--accent)] transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>ZOOM</span>
                </button>
              </>
            ) : (
              /* Ornate SVG Certificate Mockup when no photo is uploaded yet */
              <div className="w-full p-6 sm:p-10 text-center relative overflow-hidden bg-gradient-to-br from-[#14110f] via-[#1c1917] to-[#100f0e] border-4 border-double border-amber-500/30 rounded-xl">
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50" />

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-400/50 text-amber-400 mb-3 shadow-lg">
                  <Award className="w-7 h-7" />
                </div>

                <p className="text-xs font-bold tracking-widest text-amber-400/90 uppercase mb-1 flex items-center justify-center gap-1.5 font-mono-code">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('certificateModal.officialTitle')}
                  <Sparkles className="w-3.5 h-3.5" />
                </p>

                <h3 className="text-lg sm:text-2xl font-extrabold text-[#EDE6D6] max-w-xl mx-auto mb-2 leading-snug">
                  {displayTitle}
                </h3>

                <p className="text-xs text-[#C2B8A7] max-w-md mx-auto mb-4">
                  {t('certificateModal.awardedPrefix')}{' '}
                  <strong className="text-amber-300 font-semibold">{certificate.issuer}</strong>
                </p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 text-xs bg-black/40 px-4 py-2 rounded-xl border border-[#302A26] text-[#EDE6D6]">
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
              <Building2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block text-[11px] font-mono-code">{t('certificateModal.issuerLabel')}</span>
                <span className="font-semibold text-sm">{certificate.issuer}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-elevated border border-subtle flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block text-[11px] font-mono-code">{t('certificateModal.issueDateLabel')}</span>
                <span className="font-semibold text-sm">{displayIssueDate || t('certificateModal.recordedFallback')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {certificate.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-mono-code">{t('certificateModal.descriptionLabel')}</h4>
              <p className="text-sm text-secondary leading-relaxed bg-elevated/60 p-4 rounded-xl border border-subtle text-justify">
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-xs sm:text-sm font-semibold transition-colors"
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

      {/* Full-Resolution Zoom Lightbox */}
      {zoomed && certificate.imageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(false);
          }}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Tutup zoom"
            className="fixed top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[var(--accent)] text-white text-xs font-mono-code border border-white/20"
          >
            <ZoomOut className="w-4 h-4" />
            <span>EXIT ZOOM</span>
          </button>
          <img
            src={certificate.imageUrl}
            alt={displayTitle}
            className="max-w-full max-h-[92vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
