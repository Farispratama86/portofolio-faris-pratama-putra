import React from 'react';

/**
 * Latar foto arsip per seksi dengan mask-image fade atas-bawah dan vignette gelap.
 * Dipakai pada Seksi 1–6 di PortfolioHome.jsx.
 */
export function SectionBackdrop({ imagePath, motif = null }) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      {imagePath && (
        <div
          className="section-bg-photo absolute inset-0"
          style={{ backgroundImage: `url('${imagePath}')` }}
        />
      )}
      <div className="section-bg-vignette absolute inset-0" />
      {motif === 'eye' && <WatcherEyeMotif />}
      {motif === 'silhouette' && <ShadowSilhouetteMotif />}
    </div>
  );
}

/**
 * Motif horor tipis: Mata mengintai di sudut kanan atas seksi Pengalaman (opacity 0.14).
 */
export function WatcherEyeMotif() {
  return (
    <div
      className="hidden lg:block absolute right-6 top-10 pointer-events-none select-none"
      style={{ opacity: 0.14 }}
      aria-hidden="true"
    >
      <svg width="160" height="86" viewBox="0 0 160 86" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 43C28 15 54 6 80 6C106 6 132 15 152 43C132 71 106 80 80 80C54 80 28 71 8 43Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--text-primary)]"
        />
        <path
          d="M22 43C38 23 58 16 80 16C102 16 122 23 138 43C122 63 102 70 80 70C58 70 38 63 22 43Z"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="80" cy="43" r="18" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-primary)]" />
        <circle cx="80" cy="43" r="8" fill="var(--accent)" />
        <circle cx="84" cy="39" r="2.2" fill="var(--bg-page)" />
        <line x1="80" y1="0" x2="80" y2="14" stroke="var(--accent)" strokeWidth="1" />
        <line x1="80" y1="72" x2="80" y2="86" stroke="var(--accent)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * Motif horor tipis: Siluet figur pengamat di sudut kanan bawah seksi Keahlian (opacity 0.14).
 */
export function ShadowSilhouetteMotif() {
  return (
    <div
      className="hidden lg:block absolute right-8 bottom-0 pointer-events-none select-none"
      style={{ opacity: 0.14 }}
      aria-hidden="true"
    >
      <svg width="150" height="190" viewBox="0 0 150 190" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Siluet bahu & mantel */}
        <path
          d="M15 190C18 145 36 122 58 114L62 96C53 88 49 74 51 58C53 38 64 26 75 26C86 26 97 38 99 58C101 74 97 88 88 96L92 114C114 122 132 145 135 190H15Z"
          fill="currentColor"
          className="text-[var(--text-primary)]"
        />
        {/* Kerah & garis investigasi tipis */}
        <path
          d="M58 114L75 136L92 114"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        {/* Sepasang mata samar */}
        <ellipse cx="67" cy="60" rx="2.6" ry="1.4" fill="var(--accent)" />
        <ellipse cx="83" cy="60" rx="2.6" ry="1.4" fill="var(--accent)" />
      </svg>
    </div>
  );
}
