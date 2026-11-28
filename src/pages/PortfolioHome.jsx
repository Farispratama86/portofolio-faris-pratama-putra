import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  Code2,
  Cpu,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ProjectMockup from '../components/ProjectMockup';
import ProjectModal from '../components/ProjectModal';
import CvModal from '../components/CvModal';
import CertificateModal from '../components/CertificateModal';
import SocialModal, { TikTokIcon } from '../components/SocialModal';
import CrimeMapOverlay from '../components/CrimeMapOverlay';
import { SectionBackdrop } from '../components/SectionDecorations';
import {
  CERTIFICATES as FALLBACK_CERTIFICATES,
  DEFAULT_SKILLS,
  EXPERIENCES as FALLBACK_EXPERIENCES,
  PROFILE,
  PROJECTS as FALLBACK_PROJECTS,
  getBadgeStyle,
  getCertificateCategoryStyle,
  getSkillRatingLabel,
} from '../data/portfolioData';
import { fetchCertificates, fetchExperiences, fetchProfile, fetchProjects, fetchSkills } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function getProjectCategoryBadge(project, tr = (s) => s) {
  if (!project) return tr('Web & Machine Learning');
  const cat = project.category;
  const label = project.categoryLabel || '';

  if (cat === 'iot') {
    if (!label || /web|ui\/ux/i.test(label)) {
      return tr('IoT & Embedded');
    }
  } else if (cat === 'desktop') {
    if (!label || /web|ui\/ux/i.test(label)) {
      return tr('Desktop App');
    }
  } else if (cat === 'web-ml') {
    if (!label) {
      return tr('Web & Machine Learning');
    }
  }
  return tr(label || 'Web & ML');
}

function getProjectLinkInfo(project, t = (k) => k) {
  if (!project || !project.liveUrl) return null;
  const url = project.liveUrl.toLowerCase();
  const isJournal =
    url.includes('ojs.') ||
    url.includes('journal') ||
    url.includes('article') ||
    url.includes('jurnal') ||
    url.includes('doi.org');
  const isIot = project.category === 'iot';

  if (isJournal || isIot) {
    return {
      text: t('projects.publicationJournal'),
      isJournal: true,
    };
  }
  return {
    text: t('projects.liveDemo'),
    isJournal: false,
  };
}

function normalizeWaDigits(raw = '') {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

function formatWaDisplay(raw = '') {
  const str = String(raw || '').trim();
  if (!str) return '';
  if (/[+\-\s]/.test(str)) return str;
  const digits = normalizeWaDigits(str);
  if (digits.startsWith('62') && digits.length >= 11) {
    const rest = digits.slice(2);
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }
  return str;
}

function formatCertificateTitle(title = '') {
  let t = (title || '').trim();
  const quoteCount = (t.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    t = `${t}"`;
  }
  return t;
}

function formatRecTime(totalSeconds) {
  const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

export default function PortfolioHome({ onNavigate }) {
  const { lang, t, tr, ensureTranslations } = useLanguage();
  const mainRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('faris-portfolio-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [vhsEnabled, setVhsEnabled] = useState(() => {
    try {
      return localStorage.getItem('faris-portfolio-vhs') !== 'false';
    } catch {
      return true;
    }
  });
  const [mapEnabled, setMapEnabled] = useState(() => {
    try {
      return localStorage.getItem('faris-portfolio-map') !== 'false';
    } catch {
      return true;
    }
  });
  const [recSeconds, setRecSeconds] = useState(0);

  const [activeSection, setActiveSection] = useState('beranda');
  const [filter, setFilter] = useState('all');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [certFilter, setCertFilter] = useState('all');
  const [skillTab, setSkillTab] = useState('hard'); // 'hard' | 'soft'
  const [noteRevealed, setNoteRevealed] = useState(false);

  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [experiences, setExperiences] = useState(FALLBACK_EXPERIENCES);
  const [certificates, setCertificates] = useState(FALLBACK_CERTIFICATES);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [profile, setProfile] = useState(PROFILE);
  const [dataSource, setDataSource] = useState('loading');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    topicIdx: 0,
    message: '',
  });

  // Live VHS REC timer
  useEffect(() => {
    const id = window.setInterval(() => {
      setRecSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

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
          setProfile((prev) => {
            const nextWaDisplay = formatWaDisplay(liveProfile.whatsapp) || prev.whatsappDisplay || PROFILE.whatsappDisplay;
            const nextWaDigits = normalizeWaDigits(liveProfile.whatsapp) || prev.whatsappNumber || PROFILE.whatsappNumber;
            const nextGithub = liveProfile.githubUrl || prev.githubUrl || 'https://github.com/Farispratama86';
            const nextLinkedin = liveProfile.linkedinUrl || prev.linkedinUrl || '';
            const nextInstagram = liveProfile.instagramUrl || prev.instagramUrl || '';
            const nextTiktok = liveProfile.tiktokUrl || prev.tiktokUrl || '';
            const nextProfession = liveProfile.profession || liveProfile.currentRole || prev.currentRole || PROFILE.currentRole;
            return {
              ...prev,
              photoUrl: liveProfile.photoUrl || prev.photoUrl,
              role: liveProfile.role || prev.role,
              bio: liveProfile.bio || prev.bio,
              availabilityStatus: liveProfile.availabilityStatus || prev.availabilityStatus || PROFILE.availabilityStatus,
              educationSummary: liveProfile.education || prev.educationSummary || PROFILE.educationSummary,
              currentRole: nextProfession,
              coreSkills: liveProfile.coreSkills || prev.coreSkills || PROFILE.coreSkills,
              cityShort: liveProfile.location || prev.cityShort || PROFILE.cityShort,
              whatsappDisplay: nextWaDisplay,
              whatsappNumber: nextWaDigits,
              email: liveProfile.email || prev.email || PROFILE.email,
              githubUrl: nextGithub,
              linkedinUrl: nextLinkedin,
              instagramUrl: nextInstagram,
              tiktokUrl: nextTiktok,
              socials: [
                { id: 'github', label: 'GitHub', url: nextGithub },
                { id: 'linkedin', label: 'LinkedIn', url: nextLinkedin },
                { id: 'instagram', label: 'Instagram', url: nextInstagram },
                { id: 'tiktok', label: 'TikTok', url: nextTiktok },
              ],
            };
          });
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

  // Otomatis terjemahkan konten dinamis dari database saat bahasa Inggris dipilih
  useEffect(() => {
    if (lang !== 'en') return;

    const batch = [];
    if (profile?.role) batch.push(profile.role);
    if (profile?.bio) batch.push(profile.bio);
    if (profile?.availabilityStatus) batch.push(profile.availabilityStatus);
    if (profile?.educationSummary) batch.push(profile.educationSummary);
    if (profile?.currentRole) batch.push(profile.currentRole);
    if (profile?.coreSkills) batch.push(profile.coreSkills);
    if (profile?.cityShort) batch.push(profile.cityShort);

    experiences.forEach((exp) => {
      if (exp.badge) batch.push(exp.badge);
      if (exp.role) batch.push(exp.role);
      if (exp.period) batch.push(exp.period);
      (exp.sections || []).forEach((sec) => {
        if (sec.heading) batch.push(sec.heading);
        (sec.bullets || []).forEach((b) => {
          if (b) batch.push(b);
        });
      });
    });

    projects.forEach((p) => {
      if (p.title) batch.push(p.title);
      if (p.categoryLabel) batch.push(p.categoryLabel);
      if (p.summary) batch.push(p.summary);
      (p.highlights || []).forEach((h) => {
        if (h) batch.push(h);
      });
    });

    certificates.forEach((c) => {
      if (c.title) batch.push(c.title);
      if (c.category) batch.push(c.category);
      if (c.issueDate) batch.push(c.issueDate);
      if (c.description) batch.push(c.description);
    });

    skills.forEach((s) => {
      if (s.name) batch.push(s.name);
      if (s.groupName) batch.push(s.groupName);
    });

    ensureTranslations(batch);
  }, [lang, profile, experiences, projects, certificates, skills, ensureTranslations]);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    try {
      localStorage.setItem('faris-portfolio-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('faris-portfolio-vhs', String(vhsEnabled));
    } catch {
      // ignore
    }
  }, [vhsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('faris-portfolio-map', String(mapEnabled));
    } catch {
      // ignore
    }
  }, [mapEnabled]);

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

  const hardSkills = useMemo(() => skills.filter((s) => s.category === 'hard'), [skills]);
  const softSkills = useMemo(() => skills.filter((s) => s.category === 'soft'), [skills]);

  const activeSkills = useMemo(() => skills.filter((s) => s.category === skillTab), [skills, skillTab]);

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

  // Sinkronkan berkas kasus aktif di drawer saat filter berubah
  useEffect(() => {
    if (filteredProjects.length === 0) {
      setActiveProjectId(null);
      return;
    }
    const stillExists = filteredProjects.some((p) => String(p.id) === String(activeProjectId));
    if (!stillExists) {
      const preferred = filteredProjects.find((p) => p.featured) || filteredProjects[0];
      setActiveProjectId(preferred.id);
    }
  }, [filteredProjects, activeProjectId]);

  const activeCase = useMemo(() => {
    if (filteredProjects.length === 0) return null;
    return filteredProjects.find((p) => String(p.id) === String(activeProjectId)) || filteredProjects[0];
  }, [filteredProjects, activeProjectId]);

  // Kategori sertifikat dinamis untuk filter Seksi 4
  const certCategories = useMemo(() => {
    const countsByCat = new Map();
    certificates.forEach((c) => {
      const raw = (c.category || 'Sertifikat').trim();
      countsByCat.set(raw, (countsByCat.get(raw) || 0) + 1);
    });
    return Array.from(countsByCat.entries()).map(([cat, count]) => ({
      id: cat,
      count,
    }));
  }, [certificates]);

  const filteredCertificates = useMemo(() => {
    if (certFilter === 'all') return certificates;
    return certificates.filter((c) => (c.category || 'Sertifikat').trim() === certFilter);
  }, [certFilter, certificates]);

  const topicOptions = t('contact.topics');
  const activeTopicLabel =
    (Array.isArray(topicOptions) && topicOptions[formState.topicIdx]?.label) ||
    (Array.isArray(topicOptions) && topicOptions[0]?.label) ||
    'Web UI/UX Collaboration';

  const activeEmail = profile.email || PROFILE.email;
  const activeWaNumber = profile.whatsappNumber || PROFILE.whatsappNumber;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(activeEmail);
      showToast(t('contact.toastCopied', { email: activeEmail }));
    } catch {
      showToast(t('contact.toastCopyManual', { email: activeEmail }));
    }
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const text = t('contact.waGreeting', {
      name: formState.name,
      topic: activeTopicLabel,
      message: formState.message,
    });
    window.open(`https://wa.me/${activeWaNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    showToast(t('contact.toastOpeningWa'));
  };

  const handleEmailClick = () => {
    if (!formState.name.trim() || !formState.message.trim()) {
      showToast(t('contact.toastIncomplete'));
      return;
    }
    const subject = t('contact.emailSubject', {
      topic: activeTopicLabel,
      name: formState.name,
    });
    const body = t('contact.emailBody', {
      name: formState.name,
      message: formState.message,
    });
    window.location.href = `mailto:${activeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const counts = {
    all: projects.length,
    'web-ml': projects.filter((p) => p.category === 'web-ml').length,
    iot: projects.filter((p) => p.category === 'iot').length,
    desktop: projects.filter((p) => p.category === 'desktop').length,
  };

  const mapTriggerKey = `${filter}-${certFilter}-${skillTab}-${lang}-${projects.length}-${experiences.length}-${certificates.length}-${skills.length}-${activeProjectId}`;

  return (
    <div className="min-h-screen relative">
      {/* Analog VHS Scanline + Vignette Overlay (toggleable, non-blocking) */}
      {vhsEnabled && (
        <div className="fixed inset-0 pointer-events-none select-none z-50" aria-hidden="true">
          <div className="vhs-scanlines absolute inset-0" />
          <div className="vhs-vignette absolute inset-0" />
        </div>
      )}

      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        onOpenCv={() => setCvOpen(true)}
        vhsEnabled={vhsEnabled}
        onToggleVhs={() => setVhsEnabled((prev) => !prev)}
        mapEnabled={mapEnabled}
        onToggleMap={() => setMapEnabled((prev) => !prev)}
      />

      <main ref={mainRef} className="pt-16 relative">
        {/* Peta Kasus Zig-Zag Merah (z-index: 3, di belakang konten z-index: 6) */}
        <CrimeMapOverlay enabled={mapEnabled} containerRef={mainRef} triggerKey={mapTriggerKey} />

        {/* ============================================================
            SEKSI 1 — BERANDA (SAMPUL BERKAS SUBJEK)
           ============================================================ */}
        <section id="beranda" className="py-14 sm:py-20 border-b border-subtle relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-dossier-hero.jpg" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Kolom Kiri: Timer REC, Stempel Status, Judul Serif, Narasi & Statistik Tanpa Kotak */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-subtle bg-[var(--bg-surface)] font-mono-code text-xs font-semibold tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-rec-blink" />
                    <span>REC {formatRecTime(recSeconds)}</span>
                  </div>

                  {/* Stempel Miring Status Ketersediaan dari DB */}
                  <span className="rubber-stamp inline-block px-3 py-1 rounded-sm text-xs font-bold -rotate-2">
                    {tr(profile.availabilityStatus || PROFILE.availabilityStatus)}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="font-mono-code text-xs uppercase tracking-widest text-secondary">
                    {t('hero.campusBadge')}
                  </p>
                  <h1 className="font-serif-editorial text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.02]">
                    Faris Pratama <em className="italic text-accent">Putra</em>
                  </h1>
                  <p className="text-base sm:text-lg font-semibold text-secondary">
                    {tr(profile.role)}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl text-left">
                  {tr(profile.bio)}
                </p>

                {/* 3 Tombol CTA */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#proyek"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    <span>{t('hero.viewProjects')}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setCvOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg surface-card font-semibold text-sm hover:border-[var(--border-accent)] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-accent" />
                    <span>{t('hero.cvSummary')}</span>
                  </button>
                  <a
                    href={profile.githubUrl || PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg surface-card font-semibold text-sm hover:border-[var(--border-accent)] transition-colors"
                  >
                    <Github className="w-4 h-4 text-accent" />
                    <span>GitHub</span>
                  </a>
                </div>

                {/* 3 Angka Statistik Bersih Tanpa Kotak Bersarang */}
                <div className="grid grid-cols-3 gap-6 pt-5 border-t border-subtle max-w-xl">
                  <div>
                    <div className="font-serif-editorial text-3xl sm:text-4xl text-[var(--text-primary)] leading-none">
                      {projects.length}
                    </div>
                    <div className="font-mono-code text-[11px] uppercase tracking-wider text-secondary mt-1.5">
                      {t('hero.statProjects')}
                    </div>
                  </div>
                  <div className="border-l border-subtle pl-5">
                    <div className="font-serif-editorial text-3xl sm:text-4xl text-[var(--text-primary)] leading-none">
                      {experiences.length}
                    </div>
                    <div className="font-mono-code text-[11px] uppercase tracking-wider text-secondary mt-1.5">
                      {t('hero.statExperiences')}
                    </div>
                  </div>
                  <div className="border-l border-subtle pl-5">
                    <div className="font-serif-editorial text-3xl sm:text-4xl text-[var(--text-primary)] leading-none">
                      {t('hero.statYearsValue')}
                    </div>
                    <div className="font-mono-code text-[11px] uppercase tracking-wider text-secondary mt-1.5">
                      {t('hero.statYearsLabel')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Kartu Dossier Bertab SUBJEK // IDENTITAS + Polaroid Selotip */}
              <div className="lg:col-span-5">
                <div className="max-w-md mx-auto lg:ml-auto">
                  {/* Tab Folder Dossier */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg border border-b-0 border-subtle bg-[var(--bg-card)] font-mono-code text-[11px] font-bold tracking-widest text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{t('hero.dossierTab')}</span>
                  </div>

                  <div className="surface-card rounded-b-xl rounded-tr-xl p-5 sm:p-6 space-y-5 shadow-xl">
                    {/* Bingkai Polaroid ber-selotip dengan foto 4:3 Cloudinary */}
                    <div className="relative bg-[var(--bg-surface)] border border-subtle p-2.5 pb-4 rounded-sm shadow-md group">
                      {/* Selotip sudut atas */}
                      <span className="polaroid-tape absolute -top-2.5 left-4 w-12 h-4 -rotate-6 z-10 pointer-events-none" />
                      <span className="polaroid-tape absolute -top-2.5 right-4 w-12 h-4 rotate-6 z-10 pointer-events-none" />

                      <div className="aspect-[4/3] overflow-hidden bg-elevated border border-subtle flex items-center justify-center relative">
                        {profile.photoUrl ? (
                          <img
                            src={profile.photoUrl}
                            alt={PROFILE.fullName}
                            className="w-full h-full object-cover object-top grayscale-[35%] contrast-[1.06] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-center p-6">
                            <div className="w-20 h-20 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center text-2xl font-extrabold mb-3">
                              {PROFILE.initials}
                            </div>
                            <p className="text-sm font-semibold">{PROFILE.fullName}</p>
                            <p className="text-xs text-secondary mt-1">{PROFILE.location}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 flex items-center justify-between gap-2 font-mono-code text-[10px] text-muted uppercase tracking-wider">
                        <span>FIG.01 // {PROFILE.initials}-ID</span>
                        <span>{tr(profile.availabilityStatus || PROFILE.availabilityStatus)}</span>
                      </div>
                    </div>

                    {/* 4 Baris Identitas Dinamis dari DB */}
                    <div className="space-y-2 text-[13px] sm:text-sm">
                      <div className="flex items-center justify-between gap-3 py-1.5 border-b border-subtle">
                        <span className="text-secondary flex items-center gap-2 shrink-0">
                          <GraduationCap className="w-4 h-4 text-accent" /> {t('hero.educationLabel')}
                        </span>
                        <span className="font-medium text-right">{tr(profile.educationSummary || PROFILE.educationSummary)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1.5 border-b border-subtle">
                        <span className="text-secondary flex items-center gap-2 shrink-0">
                          <Briefcase className="w-4 h-4 text-accent" /> {t('hero.currentRoleLabel')}
                        </span>
                        <span className="font-medium text-right">{tr(profile.currentRole || PROFILE.currentRole)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1.5 border-b border-subtle">
                        <span className="text-secondary flex items-center gap-2 shrink-0">
                          <Cpu className="w-4 h-4 text-accent" /> {t('hero.coreSkillsLabel')}
                        </span>
                        <span className="font-medium text-right">{tr(profile.coreSkills || PROFILE.coreSkills)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-1.5 border-b border-subtle">
                        <span className="text-secondary flex items-center gap-2 shrink-0">
                          <MapPin className="w-4 h-4 text-accent" /> {t('hero.locationLabel')}
                        </span>
                        <span className="font-medium text-right">{tr(profile.cityShort || PROFILE.cityShort)}</span>
                      </div>

                      {/* 5 Ikon Media Sosial: GitHub, LinkedIn, Instagram, WhatsApp, Email */}
                      <div className="pt-2 flex items-center justify-between gap-2">
                        <span className="text-xs text-secondary font-medium">{t('hero.connectFollow')}</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={profile.githubUrl || PROFILE.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg surface-panel border border-subtle hover:border-[var(--border-accent)] hover:text-accent text-secondary flex items-center justify-center transition-colors"
                            title="GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                          <a
                            href={profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'https://linkedin.com/in/faris-pratama-putra'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg surface-panel border border-subtle hover:border-[var(--border-accent)] hover:text-accent text-secondary flex items-center justify-center transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <a
                            href={profile.instagramUrl || (profile.socials?.find((s) => s.id === 'instagram')?.url) || 'https://instagram.com/fpratamaputra'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg surface-panel border border-subtle hover:border-[var(--border-accent)] hover:text-accent text-secondary flex items-center justify-center transition-colors"
                            title="Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://wa.me/${activeWaNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg surface-panel border border-subtle hover:border-[var(--border-accent)] hover:text-accent text-secondary flex items-center justify-center transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <a
                            href={`mailto:${activeEmail}`}
                            className="w-8 h-8 rounded-lg surface-panel border border-subtle hover:border-[var(--border-accent)] hover:text-accent text-secondary flex items-center justify-center transition-colors"
                            title={t('hero.sendEmailTitle')}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Strip di Bawah Hero */}
            <div className="mt-12 pt-6 border-t border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-mono-code text-xs font-semibold text-secondary uppercase tracking-wider shrink-0 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                {t('hero.coreTechFocus')}
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                {[
                  'React',
                  'Vite',
                  'Tailwind CSS',
                  'Node.js / Express',
                  'MySQL',
                  'Python',
                  'XGBoost',
                  'ESP32 / IoT',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md font-mono-code text-xs font-medium surface-card text-secondary hover:text-[var(--text-primary)] hover:border-[var(--border-accent)] transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SEKSI 2 — PENGALAMAN (KRONOLOGI BENANG MERAH)
           ============================================================ */}
        <section id="pengalaman" className="py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-corridor-noir.jpg" motif="eye" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="font-mono-code text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t('experience.badge')}</span>
                </p>
                <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal tracking-tight">
                  {t('experience.title')}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-secondary max-w-2xl text-left">
                  {t('experience.subtitle')}
                </p>
              </div>

              <span className="font-mono-code text-xs font-semibold px-3.5 py-1.5 rounded-lg surface-card text-secondary self-start md:self-end">
                {t('experience.verifiedCount', { count: experiences.length })}
              </span>
            </div>

            {/* Timeline Vertikal dengan Garis Benang Merah 2px + Pin di Kiri */}
            <div className="relative pl-6 sm:pl-9 space-y-10">
              {/* Garis Benang Merah 2px */}
              <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-[2px] bg-[var(--accent)] opacity-75" aria-hidden="true" />

              {experiences.map((exp, idx) => {
                const bStyle = getBadgeStyle(exp.badge);
                const linked = certificates.filter(
                  (c) => c.experienceId && String(c.experienceId) === String(exp.id)
                );
                const linkedCert =
                  linked.find((c) => c.category && c.category.toLowerCase().includes('magang')) ||
                  linked[0] ||
                  null;

                return (
                  <article key={exp.id} className="relative surface-card rounded-xl p-6 sm:p-8 shadow-md">
                    {/* Pin Merah/Kuningan di sisi kiri */}
                    <span
                      className="absolute -left-[23px] sm:-left-[31px] top-8 w-3.5 h-3.5 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-page)] ring-2 ring-[var(--pin-brass)] shadow-md"
                      aria-hidden="true"
                    />

                    {/* Header Kronologi + Stempel Status di Pojok Kanan */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-subtle">
                      <div className="space-y-1">
                        <div className="font-mono-code text-[11px] text-muted uppercase tracking-widest">
                          LOG // 0{idx + 1} · {exp.location}
                        </div>
                        <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[var(--text-primary)] leading-tight">
                          {tr(exp.role)}
                        </h3>
                        <p className="text-sm font-semibold text-accent">{exp.company}</p>
                        <div className="pt-1 flex flex-wrap items-center gap-3 font-mono-code text-xs text-secondary">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {tr(exp.period)}
                          </span>
                        </div>
                      </div>

                      {/* Stempel Status di Pojok Kanan */}
                      <div className="shrink-0 self-start">
                        <span
                          className={`rubber-stamp inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-bold rotate-1 ${bStyle.chipClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${bStyle.dotClass}`} />
                          <span>{tr(exp.badge)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Sub-bab & Poin Capaian Tanpa Sub-Kartu Bersarang */}
                    <div className="pt-5 space-y-5 divide-y divide-[var(--border-subtle)]">
                      {(exp.sections || []).map((sec, sIdx) => (
                        <div key={sIdx} className={sIdx > 0 ? 'pt-5 space-y-2.5' : 'space-y-2.5'}>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono-code text-[11px] font-bold text-accent">
                              [0{sIdx + 1}]
                            </span>
                            <h4 className="font-mono-code text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                              {tr(sec.heading)}
                            </h4>
                          </div>

                          <ul className="space-y-2 text-sm text-secondary leading-relaxed pl-1">
                            {(sec.bullets || []).map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-2.5 text-left">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                                <span className="flex-1 text-left">{tr(b)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Tombol Popup Sertifikat Terkait */}
                    {linkedCert && (
                      <div className="pt-5 mt-5 border-t border-subtle flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCertificate(linkedCert)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg tone-amber border text-xs font-semibold transition-all hover:brightness-105 cursor-pointer"
                        >
                          <Award className="w-4 h-4 tone-amber-text" />
                          <span>
                            {t('experience.viewOfficialCert', {
                              category: tr(linkedCert.category || 'Magang'),
                            })}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href="#sertifikat"
                          className="font-mono-code text-xs text-secondary hover:text-accent transition-colors"
                        >
                          {t('experience.allCertificates')} &rarr;
                        </a>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            SEKSI 3 — PROYEK (LACI BERKAS KASUS: 2 KOLOM SPLIT)
           ============================================================ */}
        <section id="proyek" className="py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-corridor-noir.jpg" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="font-mono-code text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{t('projects.eyebrow')}</span>
                </p>
                <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal tracking-tight">
                  {t('projects.title')}
                </h2>
                {dataSource === 'api' && (
                  <p className="font-mono-code text-xs tone-emerald-text mt-1">{t('projects.syncedCloud')}</p>
                )}
              </div>

              {/* Filter Kategori Proyek */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: t('projects.filterAll', { count: counts.all }) },
                  { id: 'web-ml', label: t('projects.filterWebMl', { count: counts['web-ml'] }) },
                  { id: 'iot', label: t('projects.filterIot', { count: counts.iot }) },
                  { id: 'desktop', label: t('projects.filterDesktop', { count: counts.desktop }) },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`px-3.5 py-2 rounded-lg font-mono-code text-xs font-semibold border transition-colors ${
                      filter === tab.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'surface-card text-secondary hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeCase ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Kolom Kiri: Daftar Tab Berkas Kasus (CASE-01, CASE-02, ...) */}
                <div className="lg:col-span-5 space-y-2.5">
                  {filteredProjects.map((project, idx) => {
                    const caseCode = `${t('projects.casePrefix')}-${String(idx + 1).padStart(2, '0')}`;
                    const isActive = String(project.id) === String(activeCase.id);
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setActiveProjectId(project.id)}
                        className={`w-full text-left rounded-xl p-4 border transition-all flex items-start justify-between gap-3 ${
                          isActive
                            ? 'bg-[var(--bg-elevated)] border-[var(--accent)] shadow-md border-l-4'
                            : 'surface-card hover:bg-[var(--bg-surface)]'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 font-mono-code text-[11px]">
                            <span className={isActive ? 'text-accent font-bold' : 'text-muted font-semibold'}>
                              {caseCode}
                            </span>
                            <span className="text-muted">·</span>
                            <span className="text-secondary">{getProjectCategoryBadge(project, tr)}</span>
                            {project.featured && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-accent text-[10px] font-bold">
                                ★
                              </span>
                            )}
                          </div>
                          <h3 className={`font-bold text-sm sm:text-base leading-snug line-clamp-2 ${isActive ? 'text-[var(--text-primary)]' : 'text-secondary'}`}>
                            {tr(project.title)}
                          </h3>
                        </div>
                        <span className="font-mono-code text-xs text-muted shrink-0 pt-0.5">{project.year}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Kolom Kanan: Panel Viewer Detail Berkas Aktif */}
                <article className="lg:col-span-7 surface-card rounded-xl overflow-hidden shadow-xl">
                  {/* Top Bar File Header */}
                  <div className="px-5 py-3 bg-[var(--bg-surface)] border-b border-subtle flex flex-wrap items-center justify-between gap-2 font-mono-code text-xs">
                    <span className="font-bold text-accent">
                      {t('projects.casePrefix')}-
                      {String(
                        Math.max(
                          1,
                          filteredProjects.findIndex((p) => String(p.id) === String(activeCase.id)) + 1
                        )
                      ).padStart(2, '0')}{' '}
                      // {getProjectCategoryBadge(activeCase, tr)}
                    </span>
                    <div className="flex items-center gap-2">
                      {activeCase.featured && (
                        <span className="rubber-stamp px-2 py-0.5 text-[10px] font-bold rounded-sm">
                          {t('projects.featuredBadge')}
                        </span>
                      )}
                      <span className="text-muted">{activeCase.year}</span>
                    </div>
                  </div>

                  {/* Preview Gambar 16:9 Penuh */}
                  <div
                    onClick={() => setSelectedProject(activeCase)}
                    className="aspect-video bg-[#0d0c0b] border-b border-subtle cursor-pointer"
                  >
                    <ProjectMockup project={activeCase} />
                  </div>

                  {/* Detail Berkas */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h3 className="font-serif-editorial text-2xl sm:text-3xl leading-snug text-[var(--text-primary)]">
                      {tr(activeCase.title)}
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed text-left">
                      {tr(activeCase.summary)}
                    </p>

                    {/* Maksimal 4-5 Tag Inti */}
                    <div className="flex flex-wrap gap-2">
                      {(activeCase.tags || []).slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="chip-tag font-mono-code text-xs font-medium px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-4 border-t border-subtle flex flex-wrap items-center gap-3">
                      {activeCase.liveUrl && (
                        <a
                          href={activeCase.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white text-sm font-semibold transition-colors"
                        >
                          <span>{getProjectLinkInfo(activeCase, t)?.text || t('projects.liveDemo')}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {activeCase.repoUrl && (
                        <a
                          href={activeCase.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-subtle hover:border-[var(--border-accent)] text-sm font-semibold transition-colors"
                        >
                          <Github className="w-4 h-4 text-accent" />
                          <span>GitHub</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProject(activeCase)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-subtle hover:border-[var(--border-accent)] text-sm font-semibold transition-colors ml-auto"
                      >
                        <span>{t('projects.viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-accent" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              <div className="surface-card rounded-xl p-8 text-center text-secondary font-mono-code text-sm">
                {t('projects.emptyState')}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================
            SEKSI 4 — SERTIFIKAT (BARANG BUKTI TERVERIFIKASI: GRID 2 KOLOM)
           ============================================================ */}
        <section id="sertifikat" className="py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-archive-crt.jpg" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <p className="font-mono-code text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('certificates.eyebrow')}</span>
                </p>
                <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal tracking-tight">
                  {t('certificates.title')}
                </h2>
                <p className="text-sm sm:text-base text-secondary mt-2 text-left max-w-2xl">
                  {t('certificates.subtitle')}
                </p>
              </div>
              <span className="font-mono-code text-xs font-semibold px-3.5 py-1.5 rounded-lg tone-amber border inline-flex items-center gap-1.5 self-start md:self-end shrink-0">
                <Award className="w-3.5 h-3.5 tone-amber-text" />
                <span>{t('certificates.countBadge', { count: certificates.length })}</span>
              </span>
            </div>

            {/* Filter Kategori Sertifikat */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                type="button"
                onClick={() => setCertFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg font-mono-code text-xs font-semibold border transition-colors ${
                  certFilter === 'all'
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'surface-card text-secondary hover:text-[var(--text-primary)]'
                }`}
              >
                {t('certificates.filterAll', { count: certificates.length })}
              </button>
              {certCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCertFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-code text-xs font-semibold border transition-colors ${
                    certFilter === cat.id
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'surface-card text-secondary hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tr(cat.id)} ({cat.count})
                </button>
              ))}
            </div>

            {/* Grid 2 Kolom Rapi Barang Bukti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCertificates.map((cert, idx) => {
                const certTitle = formatCertificateTitle(tr(cert.title));
                const certCategory = tr(cert.category || t('certificates.fallbackChip'));
                const certDate = cert.issueDate ? tr(cert.issueDate) : t('certificates.fallbackChip');
                const evidenceCode = `${t('certificates.evidencePrefix')}-${String(idx + 1).padStart(2, '0')}`;

                return (
                  <article
                    key={cert.id}
                    onClick={() => setSelectedCertificate(cert)}
                    className="surface-card rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between group shadow-md hover:shadow-xl"
                  >
                    <div>
                      {/* Preview Utuh (object-contain) + Stempel Merah TERVERIFIKASI */}
                      <div className="aspect-[16/10] bg-[#0d0c0b] border-b border-subtle overflow-hidden relative flex items-center justify-center p-2.5">
                        {cert.imageUrl ? (
                          <img
                            src={cert.imageUrl}
                            alt={certTitle}
                            className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 rounded"
                          />
                        ) : (
                          <div className="w-full h-full border border-dashed border-amber-500/35 rounded-lg bg-[#14110f] flex flex-col items-center justify-center p-4 text-center">
                            <Award className="w-8 h-8 text-amber-400 mb-2" />
                            <span className="text-xs font-bold text-[#EDE6D6] line-clamp-1">{cert.issuer}</span>
                            <span className="text-[11px] text-amber-400 font-semibold mt-0.5">{certCategory}</span>
                          </div>
                        )}

                        {/* Kode Barang Bukti & Tanggal */}
                        <span className="absolute top-2.5 left-2.5 font-mono-code text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-[#EDE6D6] border border-white/15">
                          {evidenceCode} · {certDate}
                        </span>

                        {/* Stempel Merah TERVERIFIKASI */}
                        <span className="rubber-stamp absolute bottom-2.5 right-2.5 px-2.5 py-0.5 text-[10px] font-bold rounded-sm -rotate-3 bg-black/75">
                          {cert.credentialUrl ? t('certificates.stampVerified') : t('certificates.stampArchived')}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getCertificateCategoryStyle(cert.category).badgeClass}`}>
                          {certCategory}
                        </span>
                        <h3
                          className="font-bold text-base sm:text-lg leading-snug group-hover:text-accent transition-colors line-clamp-2"
                          title={certTitle}
                        >
                          {certTitle}
                        </h3>
                        <p className="text-xs text-accent font-semibold">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-xs sm:text-sm text-secondary line-clamp-2 leading-relaxed text-left">
                            {tr(cert.description)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-subtle flex items-center justify-between text-xs font-semibold">
                      <span className="text-accent inline-flex items-center gap-1 group-hover:underline">
                        {t('certificates.viewCertificate')} <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      {cert.credentialUrl && (
                        <span className="font-mono-code tone-emerald-text text-[11px]">{t('certificates.verified')}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            SEKSI 5 — KEAHLIAN (CATATAN LAPANGAN: TANPA PROGRESS BAR)
           ============================================================ */}
        <section id="keahlian" className="py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-archive-crt.jpg" motif="silhouette" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="font-mono-code text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t('skills.eyebrow')}</span>
                </p>
                <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal tracking-tight">
                  {t('skills.title')}
                </h2>
                <p className="text-sm sm:text-base text-secondary mt-2 max-w-xl text-left">
                  {t('skills.subtitle')}
                </p>
              </div>

              {/* Tab Hard Skills vs Soft Skills */}
              <div className="inline-flex p-1 rounded-xl bg-elevated border border-subtle gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setSkillTab('hard')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    skillTab === 'hard'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-secondary hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>{t('skills.hardTab')}</span>
                  <span className={`font-mono-code text-[11px] px-2 py-0.5 rounded font-bold ${skillTab === 'hard' ? 'bg-black/25 text-white' : 'bg-[var(--bg-surface)] text-secondary'}`}>
                    {hardSkills.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSkillTab('soft')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    skillTab === 'soft'
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-secondary hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>{t('skills.softTab')}</span>
                  <span className={`font-mono-code text-[11px] px-2 py-0.5 rounded font-bold ${skillTab === 'soft' ? 'bg-black/25 text-white' : 'bg-[var(--bg-surface)] text-secondary'}`}>
                    {softSkills.length}
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Kolom Daftar Keahlian Bersih Berbasis Teks (Tanpa Progress Bar Persentase) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(skillGroups).map(([groupTitle, items], gIdx) => (
                <div key={groupTitle} className="surface-card rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-subtle">
                    <div>
                      <span className="font-mono-code text-[10px] font-bold text-accent uppercase tracking-widest block">
                        SEC // 0{gIdx + 1}
                      </span>
                      <h3 className="font-bold text-base text-[var(--text-primary)] mt-0.5">{tr(groupTitle)}</h3>
                    </div>
                    <span className="font-mono-code text-[11px] text-muted shrink-0">
                      {t('skills.countLabel', { count: items.length })}
                    </span>
                  </div>

                  <ul className="divide-y divide-[var(--border-subtle)]">
                    {items.map((skill) => {
                      const ratingInfo = getSkillRatingLabel(skill.ratePoint);
                      const rVal = Number(skill.ratePoint) || 0;
                      const ratingText =
                        rVal >= 92
                          ? t('skills.ratings.expert')
                          : rVal >= 85
                          ? t('skills.ratings.advanced')
                          : rVal >= 75
                          ? t('skills.ratings.proficient')
                          : t('skills.ratings.intermediate');

                      return (
                        <li
                          key={skill.id || skill.name}
                          className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <span className="font-medium text-[var(--text-primary)] text-left">{tr(skill.name)}</span>
                          <span className={`font-mono-code text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${ratingInfo.badgeClass}`}>
                            {ratingText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Catatan Arsip Efek Sensor (Redacted Hover / Click Reveal) */}
            <div className="mt-8 surface-card rounded-xl p-5 border-l-4 border-l-[var(--accent)] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono-code text-[11px] font-bold tracking-widest text-accent flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {t('skills.fieldNoteLabel')}
                </span>
                <span className="font-mono-code text-[11px] text-muted">{t('skills.fieldNoteHint')}</span>
              </div>
              <p className="text-sm text-secondary leading-relaxed text-left">
                {t('skills.fieldNoteLead')}{' '}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setNoteRevealed((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setNoteRevealed((prev) => !prev);
                    }
                  }}
                  className={`redacted-bar font-mono-code text-xs sm:text-sm ${noteRevealed ? 'revealed' : ''}`}
                >
                  {t('skills.fieldNoteRedacted')}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            SEKSI 6 — KONTAK & FOOTER (SALURAN TERENKRIPSI)
           ============================================================ */}
        <section id="kontak" className="py-16 sm:py-24 relative overflow-hidden">
          <SectionBackdrop imagePath="/images/bg-corridor-noir.jpg" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[6]">
            <div className="max-w-2xl mb-10">
              <p className="font-mono-code text-xs font-bold uppercase tracking-widest text-accent mb-2">
                {t('contact.badge')}
              </p>
              <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal tracking-tight">
                {t('contact.title')}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-secondary text-left">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Banner Hub Media Sosial */}
            <div className="surface-card rounded-xl p-5 sm:p-6 mb-8 border border-[var(--border-accent)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg chip-tag flex items-center justify-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    {t('contact.hubTitle')}
                    <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded tone-emerald border">
                      {t('contact.hubActive')}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary mt-0.5 text-left">
                    {t('contact.hubDesc')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSocialModalOpen(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-semibold text-sm transition-colors shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('contact.hubButton')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: Daftar Kontak Langsung */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="font-mono-code text-xs font-bold uppercase tracking-wider text-muted">
                    {t('contact.directTitle')}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setSocialModalOpen(true)}
                    className="text-xs text-accent hover:underline font-medium inline-flex items-center gap-1"
                  >
                    {t('contact.openModal')} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Email Card with Copy */}
                <div className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
                  <a href={`mailto:${activeEmail}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg chip-tag flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono-code text-[11px] text-secondary">{t('contact.emailLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">{activeEmail}</div>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="px-3 py-1.5 rounded-lg font-mono-code text-xs font-semibold chip-tag shrink-0 hover:brightness-110"
                    title={t('contact.copyTitle')}
                  >
                    {t('contact.copy')}
                  </button>
                </div>

                {/* WhatsApp Card */}
                <a
                  href={`https://wa.me/${activeWaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg tone-emerald border flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono-code text-[11px] text-secondary">{t('contact.whatsappLabel')}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{profile.whatsappDisplay || PROFILE.whatsappDisplay}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors shrink-0" />
                </a>

                {/* GitHub Card */}
                <a
                  href={profile.githubUrl || PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-elevated text-[var(--text-primary)] border border-subtle flex items-center justify-center shrink-0">
                      <Github className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono-code text-[11px] text-secondary">{t('contact.githubLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.githubUrl || PROFILE.githubUrl).replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors shrink-0" />
                </a>

                {/* LinkedIn Card */}
                <a
                  href={profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'https://linkedin.com/in/faris-pratama-putra'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg chip-tag flex items-center justify-center shrink-0">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono-code text-[11px] text-secondary">{t('contact.linkedinLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'linkedin.com/in/faris-pratama-putra').replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-accent transition-colors shrink-0" />
                </a>

                {/* Instagram & TikTok */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.instagramUrl || (profile.socials?.find((s) => s.id === 'instagram')?.url) || 'https://instagram.com/fpratamaputra'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg chip-tag flex items-center justify-center shrink-0">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono-code text-[10px] text-secondary">Instagram</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.instagramUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-accent shrink-0" />
                  </a>

                  <a
                    href={profile.tiktokUrl || (profile.socials?.find((s) => s.id === 'tiktok')?.url) || 'https://tiktok.com/@fpratamaputra'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg chip-tag flex items-center justify-center shrink-0">
                        <TikTokIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono-code text-[10px] text-secondary">TikTok</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.tiktokUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-accent shrink-0" />
                  </a>
                </div>
              </div>

              {/* Kolom Kanan: Formulir Kirim Pesan Cepat */}
              <div className="lg:col-span-7">
                <form onSubmit={handleWhatsAppSubmit} className="surface-card rounded-xl p-6 sm:p-7 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-subtle pb-3">
                    <div>
                      <h3 className="text-lg font-bold">{t('contact.formTitle')}</h3>
                      <p className="text-xs text-secondary mt-0.5 text-left">{t('contact.formSubtitle')}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg chip-tag flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono-code text-xs font-semibold text-secondary mb-1.5">
                        {t('contact.nameLabel')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={t('contact.namePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-elevated border border-subtle text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-code text-xs font-semibold text-secondary mb-1.5">
                        {t('contact.topicLabel')}
                      </label>
                      <select
                        value={formState.topicIdx}
                        onChange={(e) => setFormState({ ...formState, topicIdx: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-elevated border border-subtle text-sm focus:border-[var(--accent)] focus:outline-none"
                      >
                        {(Array.isArray(topicOptions) ? topicOptions : []).map((opt, idx) => (
                          <option key={opt.value} value={idx}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-secondary mb-1.5">
                      {t('contact.messageLabel')}
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={t('contact.messagePlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-elevated border border-subtle text-sm resize-none focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{t('contact.sendWhatsapp')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-white font-semibold text-sm transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{t('contact.sendEmail')}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSocialModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-accent font-medium py-1 px-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t('contact.allSocials')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-subtle py-8 bg-[var(--bg-surface)] relative z-[6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-secondary text-center md:text-left font-mono-code text-xs sm:text-sm">
            © {new Date().getFullYear()} <strong className="font-semibold text-[var(--text-primary)]">{PROFILE.fullName}</strong> · {t('footer.roleTag')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <button
              type="button"
              onClick={() => setSocialModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg chip-tag hover:brightness-110 text-xs font-semibold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('footer.socialMedia')}</span>
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
              href={`https://wa.me/${activeWaNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-accent inline-flex items-center gap-1 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="inline-flex items-center gap-1 font-mono-code text-xs text-muted hover:text-accent ml-2"
            >
              <Lock className="w-3 h-3" /> {t('footer.admin')}
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
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-medium shadow-xl border border-[var(--border-accent)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
