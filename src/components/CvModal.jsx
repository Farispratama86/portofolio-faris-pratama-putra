import React, { useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { EXPERIENCES as FALLBACK_EXPERIENCES, PROFILE as DEFAULT_PROFILE, PROJECTS as FALLBACK_PROJECTS } from '../data/portfolioData';

export default function CvModal({ open, onClose, profile, experiences, projects }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const activeProfile = profile || DEFAULT_PROFILE;
  const activeExperiences = experiences && experiences.length ? experiences : FALLBACK_EXPERIENCES;
  const activeProjects = projects && projects.length ? projects : FALLBACK_PROJECTS;

  const instagramObj = (activeProfile.socials || []).find((s) => s.id === 'instagram' && s.url);
  const instagramHandle = instagramObj
    ? '@' + instagramObj.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')
    : '@fpratamaputra';

  const skillRows = [
    {
      label: 'Web UI/UX & Machine Learning',
      value: 'Web UI/UX Development, React, Tailwind CSS, XGBoost, scikit-learn, Streamlit, CRISP-DM, UAT Testing',
    },
    {
      label: 'Hardware & Networking',
      value: 'Troubleshooting Hardware & Software, PC Assembly (Rakit PC), Jaringan Komputer (LAN/WLAN), Mikrotik (Basic), Routing & Switching',
    },
    {
      label: 'Languages',
      value: 'HTML5, CSS3, JavaScript, Python, PHP, Java, C++',
    },
    {
      label: 'Database & Tools',
      value: 'MySQL (TiDB Cloud / Aiven), SQLite, Vercel, Netlify, Cloudinary, Git, GitHub, VS Code, OS Deployment (Windows/Linux)',
    },
    {
      label: 'IoT & Embedded',
      value: 'Arduino IDE, ESP32 / ESP8266, Sensor Integration (MQ-2, HC-SR04, Soil Moisture), Blynk API, Telegram Bot API',
    },
    {
      label: 'Bahasa',
      value: 'Bahasa Indonesia (Native), Inggris (Basic)',
    },
  ];

  return (
    <div
      id="cv-print-modal-wrapper"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="cv-print-modal-card"
        className="bg-white text-slate-900 rounded-2xl max-w-[820px] w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
      >
        {/* Modal Action Bar (hidden when printing) */}
        <div className="no-print sticky top-0 z-10 bg-slate-900 text-slate-100 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold">Pratinjau Cetak CV / Portofolio (Format A4 ATS)</h3>
            <p className="text-[11px] text-slate-400">
              Otomatis tersinkronisasi dengan {activeExperiences.length} pengalaman &amp; {activeProjects.length} proyek terbaru dari database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="p-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable A4 Serif Document matching CV_FARIS PRATAMA PUTRA.pdf */}
        <div
          id="cv-print-area"
          className="bg-white text-[#111827] px-8 sm:px-12 py-9 space-y-5 leading-snug"
          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', fontSize: '10.5pt' }}
        >
          {/* Header */}
          <header className="text-center space-y-1.5 pb-1">
            <h1 className="text-[22pt] font-bold tracking-tight text-black">
              {activeProfile.fullName}
            </h1>
            <p className="text-[9.5pt] text-slate-600">
              Karanganyar, Jawa Tengah, Indonesia &nbsp;|&nbsp; {activeProfile.whatsappDisplay} &nbsp;|&nbsp; {activeProfile.email}
            </p>
            <p className="text-[9.5pt] text-slate-600">
              https://portofolio-faris-pratama-putra.vercel.app/ &nbsp;|&nbsp; {activeProfile.githubDisplay} &nbsp;|&nbsp; instagram: {instagramHandle}
            </p>
          </header>

          {/* EDUCATION */}
          <section className="cv-avoid-break space-y-1.5">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-wide border-b-[1.5px] border-black pb-0.5 text-black">
              EDUCATION
            </h2>
            <div className="flex items-baseline justify-between gap-4">
              <strong className="font-bold text-black">Universitas Duta Bangsa Surakarta</strong>
              <span className="italic text-[9.5pt] text-slate-700 shrink-0">Surakarta, Indonesia</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 text-[10pt]">
              <span className="italic">S1 Teknik Informatika — Semester 6</span>
              <span className="italic text-[9.5pt] text-slate-700 shrink-0">Agustus 2023 – Sekarang</span>
            </div>
            <p className="text-[9.5pt] text-slate-800 pt-0.5 text-justify">
              Mata kuliah relevan: Jaringan Komputer, Internet of Things (IoT), Pemrograman Web, Pemrograman Python, Sistem Operasi, Pemecahan Masalah Hardware &amp; Software.
            </p>
          </section>

          {/* INTERNSHIP & WORK EXPERIENCE (Unlimited Dynamic) */}
          <section className="space-y-3">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-wide border-b-[1.5px] border-black pb-0.5 text-black">
              INTERNSHIP &amp; WORK EXPERIENCE
            </h2>
            {activeExperiences.map((exp) => (
              <div key={exp.id} className="cv-avoid-break space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <strong className="font-bold text-black">
                    {exp.company} — {exp.role}
                  </strong>
                  <span className="italic text-[9.5pt] text-slate-700 shrink-0">{exp.location}</span>
                </div>
                {(exp.sections || []).map((sec, idx) => (
                  <div key={sec.heading + idx} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="italic text-[10pt] text-slate-900">{sec.heading}</span>
                      {idx === 0 && (
                        <span className="italic text-[9.5pt] text-slate-700 shrink-0">{exp.period}</span>
                      )}
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-[9.8pt] text-slate-900 text-justify">
                      {(sec.bullets || []).map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* FEATURED PROJECTS (Unlimited Dynamic) */}
          <section className="space-y-2.5">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-wide border-b-[1.5px] border-black pb-0.5 text-black">
              FEATURED PROJECTS
            </h2>
            {activeProjects.map((proj) => (
              <div key={proj.id} className="cv-avoid-break space-y-0.5">
                <div className="flex items-baseline justify-between gap-4">
                  <strong className="font-bold text-black">{proj.title}</strong>
                  <span className="italic text-[9.5pt] text-slate-700 shrink-0">{proj.year}</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[9.8pt] text-slate-900 text-justify">
                  <li>{proj.summary}</li>
                  {proj.tags && proj.tags.length > 0 && (
                    <li>
                      <span className="font-semibold">Stack:</span> {proj.tags.join(', ')}
                      {proj.liveUrl ? ` · Live: ${proj.liveUrl}` : ''}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>

          {/* TECHNICAL SKILLS */}
          <section className="cv-avoid-break space-y-1.5">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-wide border-b-[1.5px] border-black pb-0.5 text-black">
              TECHNICAL SKILLS
            </h2>
            <table className="w-full text-[9.8pt] border-collapse">
              <tbody>
                {skillRows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <td className="font-bold text-black pr-4 py-0.5 w-[28%]">{row.label}</td>
                    <td className="text-slate-900 py-0.5">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* INTERESTS & FOCUS AREA */}
          <section className="cv-avoid-break space-y-1">
            <h2 className="text-[10.5pt] font-bold uppercase tracking-wide border-b-[1.5px] border-black pb-0.5 text-black">
              INTERESTS &amp; FOCUS AREA
            </h2>
            <p className="text-[9.8pt] text-slate-900">
              Web UI/UX Development • Machine Learning &amp; Data Science • Internet of Things (IoT) • Computer Hardware Technology • Network Engineering • IT Support &amp; Operations
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
