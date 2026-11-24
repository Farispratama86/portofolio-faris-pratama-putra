import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  Instagram,
  Linkedin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ProjectMockup from '../components/ProjectMockup';
import ProjectModal from '../components/ProjectModal';
import CvModal from '../components/CvModal';
import CertificateModal from '../components/CertificateModal';
import SocialModal, { TikTokIcon } from '../components/SocialModal';
import {
  CERTIFICATES as FALLBACK_CERTIFICATES,
  DEFAULT_SKILLS,
  EXPERIENCES as FALLBACK_EXPERIENCES,
  PROFILE,
  PROJECTS as FALLBACK_PROJECTS,
  SKILLS,
  getBadgeStyle,
  getSkillRatingLabel,
} from '../data/portfolioData';
import { fetchCertificates, fetchExperiences, fetchProfile, fetchProjects, fetchSkills } from '../services/api';

const SKILL_ICONS = {
  layout: LayoutDashboard,
  code: Code2,
  cpu: Cpu,
  database: Database,
};

export default function PortfolioHome({ onNavigate }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('faris-portfolio-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeSection, setActiveSection] = useState('beranda');
  const [filter, setFilter] = useState('all');
  const [skillTab, setSkillTab] = useState('hard'); // 'hard' | 'soft'
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [experiences, setExperiences] = useState(FALLBACK_EXPERIENCES);
  const [certificates, setCertificates] = useState(FALLBACK_CERTIFICATES);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [profile, setProfile] = useState(PROFILE);
  const [dataSource, setDataSource] = useState('loading'); // 'api' | 'fallback' | 'loading'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    topic: 'Kolaborasi Web UI/UX',
    message: '',
  });

  useEffect(() => {
    let active = true;
    async function loadLiveData() {
      try {
        const [liveProjects, liveExperiences, liveCertificates, liveSkills, liveProfile] = await Promise.all([
          fetchProjects(),
          fetchExperiences(),
          fetchCertificates().catch(() => []),
          fetchSkills().catch(() => []),
          fetchProfile().catch(() => null),
        ]);
        if (!active) return;
        if (liveProjects.length > 0) setProjects(liveProjects);
        if (liveExperiences.length > 0) setExperiences(liveExperiences);
        if (liveCertificates.length > 0) setCertificates(liveCertificates);
        if (liveSkills.length > 0) setSkills(liveSkills);
        if (liveProfile) {
          setProfile((prev) => ({
            ...prev,
            photoUrl: liveProfile.photoUrl || prev.photoUrl,
            role: liveProfile.role || prev.role,
            bio: liveProfile.bio || prev.bio,
            githubUrl: liveProfile.githubUrl || prev.githubUrl || 'https://github.com/Farispratama86',
            linkedinUrl: liveProfile.linkedinUrl || prev.linkedinUrl || '',
            instagramUrl: liveProfile.instagramUrl || prev.instagramUrl || '',
            tiktokUrl: liveProfile.tiktokUrl || prev.tiktokUrl || '',
            socials: [
              { id: 'github', label: 'GitHub', url: liveProfile.githubUrl || prev.githubUrl || 'https://github.com/Farispratama86' },
              { id: 'linkedin', label: 'LinkedIn', url: liveProfile.linkedinUrl || prev.linkedinUrl || '' },
              { id: 'instagram', label: 'Instagram', url: liveProfile.instagramUrl || prev.instagramUrl || '' },
              { id: 'tiktok', label: 'TikTok', url: liveProfile.tiktokUrl || prev.tiktokUrl || '' },
            ],
          }));
        }
        setDataSource('api');
      } catch {
        if (!active) return;
        setDataSource('fallback');
      }
    }
    loadLiveData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    try {
      localStorage.setItem('faris-portfolio-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    const sections = ['beranda', 'pengalaman', 'proyek', 'sertifikat', 'keahlian', 'kontak'];
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom) {
        setActiveSection('kontak');
        return;
      }
      const scrollPos = window.scrollY + 140;
      let current = 'beranda';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const activeSocials = useMemo(
    () => profile.socials.filter((item) => item.url && item.url.trim().length > 0),
    [profile.socials]
  );

  const hardSkills = useMemo(() => skills.filter((s) => s.category === 'hard'), [skills]);
  const softSkills = useMemo(() => skills.filter((s) => s.category === 'soft'), [skills]);

  const activeSkills = useMemo(() => {
    return skills.filter((s) => s.category === skillTab);
  }, [skills, skillTab]);

  const skillGroups = useMemo(() => {
    const groups = {};
    activeSkills.forEach((s) => {
      const g = s.groupName || 'Umum';
      if (!groups[g]) groups[g] = [];
      groups[g].push(s);
    });
    return groups;
  }, [activeSkills]);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  const featuredProject = filter === 'all' ? filteredProjects.find((p) => p.featured) : null;
  const gridProjects = featuredProject
    ? filteredProjects.filter((p) => p.id !== featuredProject.id)
    : filteredProjects;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      showToast(`Email disalin: ${PROFILE.email}`);
    } catch {
      showToast(`Salin manual: ${PROFILE.email}`);
    }
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const text = `Halo Faris, saya ${formState.name}.\nTopik: ${formState.topic}\n\n${formState.message}`;
    window.open(`https://wa.me/${PROFILE.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    showToast('Membuka WhatsApp...');
  };

  const handleEmailClick = () => {
    if (!formState.name.trim() || !formState.message.trim()) {
      showToast('Mohon lengkapi nama dan pesan terlebih dahulu.');
      return;
    }
    const subject = `[Portofolio] ${formState.topic} — ${formState.name}`;
    const body = `Halo Faris,\n\nSaya ${formState.name}.\n\n${formState.message}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const counts = {
    all: projects.length,
    'web-ml': projects.filter((p) => p.category === 'web-ml').length,
    iot: projects.filter((p) => p.category === 'iot').length,
    desktop: projects.filter((p) => p.category === 'desktop').length,
  };

  return (
    <div className="min-h-screen">
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onOpenCv={() => setCvOpen(true)}
      />

      <main className="pt-16">
        <section id="beranda" className="hero-glow py-16 sm:py-24 border-b border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold chip-tag">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{PROFILE.campusBadge}</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Faris Pratama <span className="text-accent">Putra</span>
                </h1>
                <p className="text-base sm:text-lg font-semibold text-secondary">{profile.role}</p>
              </div>
              <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl">{profile.bio}</p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#proyek"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/25"
                >
                  <span>Lihat Proyek</span>
                  <ArrowDownRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setCvOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl surface-card font-semibold text-sm"
                >
                  <FileText className="w-4 h-4 text-accent" />
                  <span>Ringkasan CV</span>
                </button>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl surface-card font-semibold text-sm"
                >
                  <Github className="w-4 h-4 text-accent" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="surface-card rounded-2xl p-6 space-y-5 max-w-md mx-auto lg:ml-auto">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-elevated border border-subtle flex items-center justify-center">
                  {profile.photoUrl ? (
                    <img src={profile.photoUrl} alt={PROFILE.fullName} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mb-3">
                        {PROFILE.initials}
                      </div>
                      <p className="text-sm font-semibold">{PROFILE.fullName}</p>
                      <p className="text-xs text-secondary mt-1">{PROFILE.location}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between py-1.5 border-b border-subtle">
                    <span className="text-secondary flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-accent" /> Pendidikan
                    </span>
                    <span className="font-medium">S1 Teknik Informatika (UDB)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-subtle">
                    <span className="text-secondary flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-accent" /> Magang Terbaru
                    </span>
                    <span className="font-medium">PT Vinix Seven Aurum</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-secondary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" /> Domisili
                    </span>
                    <span className="font-medium">{PROFILE.cityShort}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pengalaman" className="py-16 sm:py-20 border-b border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Rekam Jejak</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pengalaman Kerja &amp; Magang</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {experiences.map((exp) => {
                const bStyle = getBadgeStyle(exp.badge);
                return (
                  <article key={exp.id} className="surface-card rounded-2xl p-6 sm:p-7 space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-subtle">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${bStyle.chipClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${bStyle.dotClass}`} />
                          {exp.badge}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold">{exp.role}</h3>
                        <p className="text-sm font-semibold text-accent mt-0.5">{exp.company}</p>
                      </div>
                      <div className="text-left sm:text-right text-xs text-secondary">
                        <div className="font-semibold text-[var(--text-primary)]">{exp.period}</div>
                        <div className="mt-0.5">{exp.location}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {(exp.sections || []).map((sec) => (
                        <div key={sec.heading}>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{sec.heading}</h4>
                          <ul className="space-y-1.5 text-sm text-secondary list-disc list-inside leading-relaxed">
                            {(sec.bullets || []).map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Tombol Popup Sertifikat Terkait */}
                    {(() => {
                      const linkedCert = certificates.find((c) =>
                        (c.experienceId && (String(c.experienceId) === String(exp.id) || c.experienceId === exp.id)) ||
                        (c.issuer && exp.company && (
                          (c.issuer.toLowerCase().includes('vinix') && exp.company.toLowerCase().includes('vinix')) ||
                          (c.issuer.toLowerCase().includes('speed') && exp.company.toLowerCase().includes('speed'))
                        ))
                      );
                      if (!linkedCert) return null;
                      return (
                        <div className="pt-3 border-t border-subtle flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCertificate(linkedCert)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm hover:scale-[1.02] cursor-pointer group"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Lihat Sertifikat {linkedCert.category || 'Magang'}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </button>
                          <a
                            href="#sertifikat"
                            className="text-[11px] text-secondary hover:text-accent transition-colors"
                          >
                            Semua Sertifikat &rarr;
                          </a>
                        </div>
                      );
                    })()}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="proyek" className="py-16 sm:py-20 border-b border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Karya &amp; Implementasi</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Proyek Utama</h2>
                {dataSource === 'api' && (
                  <p className="text-xs text-emerald-400 mt-1">Tersinkronisasi langsung dengan Database Cloud</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `Semua (${counts.all})` },
                  { id: 'web-ml', label: `Web & ML (${counts['web-ml']})` },
                  { id: 'iot', label: `IoT (${counts.iot})` },
                  { id: 'desktop', label: `Desktop (${counts.desktop})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      filter === tab.id
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'surface-card text-secondary hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {featuredProject && (
              <article
                onClick={() => setSelectedProject(featuredProject)}
                className="project-card surface-card rounded-2xl overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12 mb-6"
              >
                <div className="lg:col-span-6 aspect-video lg:aspect-auto bg-elevated border-b lg:border-b-0 lg:border-r border-subtle">
                  <ProjectMockup project={featuredProject} />
                </div>
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <span className="chip-tag text-xs font-semibold px-3 py-1 rounded-full">
                      Proyek Unggulan · {featuredProject.categoryLabel}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold">{featuredProject.title}</h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">{featuredProject.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {(featuredProject.tags || []).map((t) => (
                        <span key={t} className="chip-tag text-xs font-medium px-2.5 py-1 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-subtle text-sm font-semibold"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="project-card surface-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-elevated border-b border-subtle">
                      <ProjectMockup project={project} />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="chip-tag text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {project.categoryLabel}
                        </span>
                        <span className="text-xs text-muted">{project.year}</span>
                      </div>
                      <h3 className="font-bold text-base leading-snug">{project.title}</h3>
                      <p className="text-xs sm:text-sm text-secondary leading-relaxed">{project.summary}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tags || []).map((t) => (
                        <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-elevated text-secondary border border-subtle">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-subtle text-xs font-semibold">
                      <span className="text-accent inline-flex items-center gap-1">
                        Detail Proyek <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-400 hover:underline"
                        >
                          Live Demo
                        </a>
                      ) : (
                        <span className="text-muted">Studi Kasus</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION SERTIFIKAT (Di atas Keahlian Teknis) */}
        <section id="sertifikat" className="py-16 sm:py-20 border-b border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Pengakuan &amp; Kompetensi</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Sertifikasi &amp; Lisensi</h2>
                <p className="text-sm text-secondary mt-1">
                  Dokumentasi resmi sertifikat magang industri, lisensi keahlian, dan pelatihan teknologi.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip-tag text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{certificates.length} Sertifikat Terdaftar</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <article
                  key={cert.id}
                  onClick={() => setSelectedCertificate(cert)}
                  className="surface-card rounded-2xl overflow-hidden border border-subtle hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail / Mockup Preview */}
                    <div className="aspect-[16/10] bg-slate-950/80 border-b border-subtle overflow-hidden relative flex items-center justify-center p-3">
                      {cert.imageUrl ? (
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full border-2 border-dashed border-amber-500/30 rounded-xl bg-gradient-to-br from-slate-950 to-[#0e1626] flex flex-col items-center justify-center p-3 text-center">
                          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-1.5 shadow-md">
                            <Award className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-200 line-clamp-1">{cert.issuer}</span>
                          <span className="text-[10px] text-amber-400 font-semibold mt-0.5">{cert.category}</span>
                        </div>
                      )}
                      <span className="absolute top-2.5 right-2.5 chip-tag text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur border border-subtle">
                        {cert.issueDate || 'Sertifikat'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="chip-tag text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {cert.category || 'Sertifikat'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-snug group-hover:text-sky-400 transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-sky-400 font-semibold">{cert.issuer}</p>
                      {cert.description && (
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-subtle/50 mt-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-accent inline-flex items-center gap-1 group-hover:underline">
                      Lihat Sertifikat <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                    {cert.credentialUrl && (
                      <span className="text-emerald-400 text-[11px]">Terverifikasi</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="keahlian" className="py-16 sm:py-20 border-b border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Kompetensi &amp; Penguasaan</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Keahlian &amp; Kemampuan</h2>
                <p className="text-sm text-secondary mt-1 max-w-xl">
                  Peta tingkat kemahiran teknis (Hard Skills) dan kecakapan interpersonal (Soft Skills) berdasarkan pengalaman dan implementasi proyek nyata.
                </p>
              </div>

              {/* 2 Menu Pilihan: Hard Skill vs Soft Skill */}
              <div className="inline-flex p-1.5 rounded-2xl bg-elevated border border-subtle gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSkillTab('hard')}
                  className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    skillTab === 'hard'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-secondary hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Hard Skills</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${skillTab === 'hard' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {hardSkills.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSkillTab('soft')}
                  className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    skillTab === 'soft'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'text-secondary hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Soft Skills</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${skillTab === 'soft' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {softSkills.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Grid Kartu Kelompok Keahlian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skillGroups).map(([groupTitle, items]) => (
                <div key={groupTitle} className="surface-card rounded-2xl p-6 sm:p-7 space-y-5 border border-subtle">
                  <div className="flex items-center justify-between pb-3 border-b border-subtle">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        skillTab === 'hard' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      }`}>
                        {skillTab === 'hard' ? <Code2 className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg">{groupTitle}</h3>
                    </div>
                    <span className="text-xs text-secondary font-medium">
                      {items.length} kemampuan
                    </span>
                  </div>

                  <div className="space-y-4">
                    {items.map((skill) => {
                      const ratingInfo = getSkillRatingLabel(skill.ratePoint);
                      return (
                        <div key={skill.id || skill.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                            <span className="font-semibold text-[var(--text-primary)]">{skill.name}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ratingInfo.badgeClass}`}>
                                {ratingInfo.label.split('/')[0].trim()}
                              </span>
                              <span className="font-bold text-xs text-[var(--text-primary)] min-w-[36px] text-right">
                                {skill.ratePoint}%
                              </span>
                            </div>
                          </div>
                          {/* Progress Rate Point Bar */}
                          <div className="w-full bg-slate-900/90 rounded-full h-2.5 overflow-hidden border border-slate-800/80 p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                skillTab === 'hard'
                                  ? 'bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400'
                                  : 'bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-400'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(5, skill.ratePoint))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kontak" className="py-16 sm:py-24 relative overflow-hidden">
          {/* Subtle background glow decoration */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Terhubung & Berkolaborasi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Mari Berkolaborasi</h2>
              <p className="mt-2 text-sm sm:text-base text-secondary">
                Tertarik membangun proyek bersama, diskusi teknologi, atau membuka peluang karier & magang? Saya siap berdiskusi!
              </p>
            </div>

            {/* Quick Social Popup Launcher Banner */}
            <div className="surface-card rounded-2xl p-5 sm:p-6 mb-8 border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 justify-center sm:justify-start">
                    Hub Media Sosial & Jejaring
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Aktif
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary mt-0.5">
                    Akses satu pintu ke semua akun resmi: LinkedIn, GitHub, Instagram, TikTok, WhatsApp & Email.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
                <button
                  type="button"
                  onClick={() => setSocialModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-sky-500/20 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Buka Popup Media Sosial</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: Kartu Media Sosial & Kontak */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Kontak Langsung & Jejaring</h4>
                  <button
                    type="button"
                    onClick={() => setSocialModalOpen(true)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1"
                  >
                    Lihat Modal <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Email Card with Copy */}
                <div className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-sky-500/40 transition-all group">
                  <a href={`mailto:${profile.email || PROFILE.email}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">Email Resmi</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">{profile.email || PROFILE.email}</div>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold chip-tag hover:border-sky-500/50 shrink-0"
                    title="Salin alamat email"
                  >
                    Salin
                  </button>
                </div>

                {/* WhatsApp Card */}
                <a
                  href={`https://wa.me/${profile.whatsappNumber || PROFILE.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-emerald-500/40 transition-all group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">WhatsApp (Chat Cepat)</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{profile.whatsappDisplay || PROFILE.whatsappDisplay}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-emerald-400 transition-colors shrink-0" />
                </a>

                {/* GitHub Card */}
                <a
                  href={profile.githubUrl || PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-slate-400/50 transition-all group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/30 text-slate-200 border border-slate-600/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Github className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">GitHub Repository</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.githubUrl || PROFILE.githubUrl).replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-white transition-colors shrink-0" />
                </a>

                {/* LinkedIn Card */}
                <a
                  href={profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'https://linkedin.com/in/faris-pratama-putra'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-blue-500/50 transition-all group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">LinkedIn Profile</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'linkedin.com/in/faris-pratama-putra').replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-blue-400 transition-colors shrink-0" />
                </a>

                {/* Instagram & TikTok Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.instagramUrl || (profile.socials?.find((s) => s.id === 'instagram')?.url) || 'https://instagram.com/fpratamaputra'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-2 border border-subtle hover:border-pink-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-secondary">Instagram</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.instagramUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-pink-400 shrink-0" />
                  </a>

                  <a
                    href={profile.tiktokUrl || (profile.socials?.find((s) => s.id === 'tiktok')?.url) || 'https://tiktok.com/@fpratamaputra'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-2 border border-subtle hover:border-cyan-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <TikTokIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-secondary">TikTok</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.tiktokUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-cyan-400 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Kolom Kanan: Form Kirim Pesan Cepat */}
              <div className="lg:col-span-7">
                <form onSubmit={handleWhatsAppSubmit} className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 border border-subtle shadow-md">
                  <div className="flex items-center justify-between border-b border-subtle/60 pb-3">
                    <div>
                      <h3 className="text-lg font-bold">Kirim Pesan Cepat</h3>
                      <p className="text-xs text-secondary mt-0.5">Pesan akan diteruskan langsung ke WhatsApp atau aplikasi email Anda</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-secondary mb-1.5">Nama Anda</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-subtle text-sm focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary mb-1.5">Topik Diskusi</label>
                      <select
                        value={formState.topic}
                        onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-subtle text-sm focus:border-sky-500 focus:outline-none"
                      >
                        <option value="Kolaborasi Web UI/UX">Kolaborasi Web UI/UX</option>
                        <option value="Proyek Machine Learning / Data">Proyek Machine Learning / Data</option>
                        <option value="Proyek IoT / Desktop / IT Support">Proyek IoT / Desktop / IT Support</option>
                        <option value="Peluang Kerja / Magang">Peluang Kerja / Magang</option>
                        <option value="Pertanyaan & Diskusi Lainnya">Pertanyaan & Diskusi Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1.5">Isi Pesan</label>
                    <textarea
                      rows="4"
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Halo Faris, saya tertarik berdiskusi mengenai proyek..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-subtle text-sm resize-none focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Kirim via WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Kirim via Email</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSocialModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-sky-400 font-medium py-1 px-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Semua Media Sosial</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-subtle py-8 bg-elevated">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-secondary text-center md:text-left">
            © 2026 <strong className="font-semibold text-[var(--text-primary)]">{PROFILE.fullName}</strong> · Universitas Duta Bangsa Surakarta
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <button
              type="button"
              onClick={() => setSocialModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Media Sosial</span>
            </button>
            <a
              href={profile.githubUrl || PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 text-xs"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <a
              href={profile.linkedinUrl || 'https://linkedin.com/in/faris-pratama-putra'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 text-xs"
            >
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a
              href={profile.instagramUrl || 'https://instagram.com/fpratamaputra'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 text-xs"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <a
              href={`https://wa.me/${profile.whatsappNumber || PROFILE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent ml-2"
            >
              <Lock className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} profile={profile} experiences={experiences} projects={projects} />
      <SocialModal open={socialModalOpen} onClose={() => setSocialModalOpen(false)} profile={profile} />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-xl border border-sky-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
