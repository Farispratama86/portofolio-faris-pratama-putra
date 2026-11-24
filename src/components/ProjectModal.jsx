import React, { useEffect } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import ProjectMockup from './ProjectMockup';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-5 sm:p-6 border-b border-subtle flex items-start justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-semibold chip-tag px-2.5 py-1 rounded-full mb-2">
              {project.categoryLabel} · {project.year}
            </span>
            <h3 className="text-xl font-extrabold">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail proyek"
            className="p-2 rounded-lg border border-subtle hover:border-sky-400/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="aspect-video rounded-xl overflow-hidden border border-subtle bg-elevated">
            <ProjectMockup project={project} />
          </div>
          <p className="text-sm sm:text-base text-secondary leading-relaxed text-justify">{project.summary}</p>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Poin Utama</h4>
            <ul className="space-y-1.5 text-sm text-secondary list-disc list-inside">
              {project.highlights.map((item) => (
                <li key={item} className="text-justify">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">Teknologi</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="chip-tag text-xs font-medium px-2.5 py-1 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 border-t border-subtle">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Live Demo</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-subtle hover:border-sky-400/60 text-sm font-semibold"
              >
                <Github className="w-4 h-4 text-accent" />
                <span>Lihat GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
