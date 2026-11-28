import React, { useEffect, useMemo, useState } from 'react';
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
  getCertificateCategoryStyle,
  getSkillRatingLabel,
} from '../data/portfolioData';
import { fetchCertificates, fetchExperiences, fetchProfile, fetchProjects, fetchSkills } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  BerandaDecor,
  PengalamanDecor,
  ProyekDecor,
  SertifikatDecor,
  KeahlianDecor,
  KontakDecor,
} from '../components/SectionDecorations';

const SKILL_ICONS = {
  layout: LayoutDashboard,
  code: Code2,
  cpu: Cpu,
  database: Database,
};

// Helper sinkronisasi label kategori proyek agar tidak salah terbawa 'Web UI/UX' untuk IoT / Desktop
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

// Helper penamaan tombol tautan cerdas (Live Demo vs Publikasi / Jurnal)
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

// Helper normalisasi nomor WhatsApp menjadi digit internasional (62...)
function normalizeWaDigits(raw = '') {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

// Helper memformat tampilan nomor WhatsApp agar rapi (+62 812-1953-4692)
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

// Helper merapikan tanda kutip sertifikat
function formatCertificateTitle(title = '') {
  let t = (title || '').trim();
  const quoteCount = (t.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    t = `${t}"`;
  }
  return t;
}

export default function PortfolioHome({ onNavigate }) {
  const { lang, t, tr, ensureTranslations } = useLanguage();
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
    topicIdx: 0,
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

  return (
    <div className="min-h-screen">
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onOpenCv={() => setCvOpen(true)}
      />

      <main className="pt-16">
        <section id="beranda" className="hero-glow py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <BerandaDecor />
          {/* Subtle tech dot/grid pattern & ambient lighting */}
          <div className="absolute inset-0 hero-grid-pattern pointer-events-none opacity-50" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Kontainer Utama max-w-7xl agar proporsional di monitor lebar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Kolom Kiri: Informasi Hero & Statistik Dinamis */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold chip-tag">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('hero.campusBadge')}</span>
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Faris Pratama <span className="text-accent">Putra</span>
                  </h1>
                  <p className="text-base sm:text-lg font-semibold text-secondary">{tr(profile.role)}</p>
                </div>
                <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl text-justify">{tr(profile.bio)}</p>

                {/* Tombol CTA */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="#proyek"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
                  >
                    <span>{t('hero.viewProjects')}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setCvOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl surface-card font-semibold text-sm hover:border-sky-500/50 transition-all hover:scale-[1.02]"
                  >
                    <FileText className="w-4 h-4 text-accent" />
                    <span>{t('hero.cvSummary')}</span>
                  </button>
                  <a
                    href={profile.githubUrl || PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl surface-card font-semibold text-sm hover:border-sky-500/50 transition-all hover:scale-[1.02]"
                  >
                    <Github className="w-4 h-4 text-accent" />
                    <span>GitHub</span>
                  </a>
                </div>

                {/* 3 Kartu Statistik Dinamis */}
                <div className="grid grid-cols-3 gap-3 pt-3 sm:pt-4 max-w-xl">
                  <div className="surface-card rounded-xl p-3 sm:p-3.5 border border-subtle hover:border-sky-500/40 transition-all group">
                    <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                      {projects.length}
                    </div>
                    <div className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-snug">
                      {t('hero.statProjects')}
                    </div>
                  </div>

                  <div className="surface-card rounded-xl p-3 sm:p-3.5 border border-subtle hover:border-sky-500/40 transition-all group">
                    <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                      {experiences.length}
                    </div>
                    <div className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-snug">
                      {t('hero.statExperiences')}
                    </div>
                  </div>

                  <div className="surface-card rounded-xl p-3 sm:p-3.5 border border-subtle hover:border-sky-500/40 transition-all group">
                    <div className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                      {t('hero.statYearsValue')}
                    </div>
                    <div className="text-[11px] sm:text-xs text-secondary mt-0.5 leading-snug">
                      {t('hero.statYearsLabel')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Kartu Profil & Identitas */}
              <div className="lg:col-span-5 relative">
                {/* Efek Pendaran Cahaya (Ambient Glow Cyan & Indigo) */}
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/15 to-indigo-500/20 rounded-3xl blur-2xl -z-10 opacity-75 pointer-events-none" />

                <div className="surface-card rounded-2xl p-6 space-y-5 max-w-md mx-auto lg:ml-auto shadow-xl border border-subtle hover:border-sky-500/40 transition-all">
                  {/* Foto dengan Floating Status Badge */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-elevated border border-subtle flex items-center justify-center relative group">
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt={PROFILE.fullName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center text-center p-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold mb-3">
                          {PROFILE.initials}
                        </div>
                        <p className="text-sm font-semibold">{PROFILE.fullName}</p>
                        <p className="text-xs text-secondary mt-1">{PROFILE.location}</p>
                      </div>
                    )}

                    {/* Floating status badge di sudut foto */}
                    <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{tr(profile.availabilityStatus || PROFILE.availabilityStatus)}</span>
                    </div>
                  </div>

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

                    {/* Baris Tombol Ikon Cepat Sosial Media */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary font-medium">{t('hero.connectFollow')}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={profile.githubUrl || PROFILE.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg surface-card border border-subtle hover:border-slate-500 hover:text-[var(--text-primary)] text-secondary flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a
                          href={profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'https://linkedin.com/in/faris-pratama-putra'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg surface-card border border-subtle hover:border-blue-500 hover:text-blue-500 text-secondary flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={profile.instagramUrl || (profile.socials?.find((s) => s.id === 'instagram')?.url) || 'https://instagram.com/fpratamaputra'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg surface-card border border-subtle hover:border-pink-500 hover:text-pink-500 text-secondary flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                          title="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${activeWaNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg surface-card border border-subtle hover:border-emerald-500 hover:text-emerald-500 text-secondary flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${activeEmail}`}
                          className="w-8 h-8 rounded-lg surface-card border border-subtle hover:border-sky-500 hover:text-accent text-secondary flex items-center justify-center transition-all hover:scale-110 shadow-sm"
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

            {/* Baris Tech Stack Strip di Bagian Bawah Hero */}
            <div className="mt-12 pt-8 border-t border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider shrink-0 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                {t('hero.coreTechFocus')}
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                {[
                  { name: 'React', hover: 'hover:border-cyan-500 hover:text-cyan-500' },
                  { name: 'Vite', hover: 'hover:border-purple-500 hover:text-purple-500' },
                  { name: 'Tailwind CSS', hover: 'hover:border-sky-500 hover:text-sky-500' },
                  { name: 'Node.js / Express', hover: 'hover:border-emerald-500 hover:text-emerald-500' },
                  { name: 'MySQL', hover: 'hover:border-blue-500 hover:text-blue-500' },
                  { name: 'Python', hover: 'hover:border-amber-500 hover:text-amber-500' },
                  { name: 'XGBoost', hover: 'hover:border-orange-500 hover:text-orange-500' },
                  { name: 'ESP32 / IoT', hover: 'hover:border-teal-500 hover:text-teal-500' },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`px-3 py-1 rounded-lg text-xs font-medium surface-card border border-subtle text-secondary transition-all cursor-default shadow-sm ${tech.hover}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pengalaman" className="py-16 sm:py-24 border-b border-subtle relative overflow-hidden">
          <PengalamanDecor />
          {/* Subtle ambient lighting */}
          <div className="absolute top-1/4 left-5 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-5 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tone-sky border mb-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  {t('experience.badge')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('experience.title')}</h2>
                <p className="mt-2 text-sm sm:text-base text-secondary max-w-2xl text-justify">
                  {t('experience.subtitle')}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-end">
                <span className="text-xs font-semibold px-3.5 py-1.5 rounded-xl surface-card border border-subtle text-secondary flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  {t('experience.verifiedCount', { count: experiences.length })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {experiences.map((exp) => {
                const bStyle = getBadgeStyle(exp.badge);
                const isTech = /technician|hardware|speed|jaringan|komputer/i.test(`${exp.role} ${exp.company}`);
                const ExpIcon = isTech ? Cpu : Code2;

                return (
                  <article
                    key={exp.id}
                    className="surface-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-subtle hover:border-sky-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-sky-500/5 group"
                  >
                    <div className="space-y-6">
                      {/* Header Pengalaman dengan Icon & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-subtle">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl tone-sky border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-sm">
                            <ExpIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1.5 ${bStyle.chipClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${bStyle.dotClass} animate-pulse`} />
                              {tr(exp.badge)}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold group-hover:text-accent transition-colors">
                              {tr(exp.role)}
                            </h3>
                            <p className="text-sm font-semibold text-accent mt-0.5">{exp.company}</p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right text-xs text-secondary shrink-0 pl-1 sm:pl-0">
                          <div className="font-semibold text-[var(--text-primary)] flex items-center sm:justify-end gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            <span>{tr(exp.period)}</span>
                          </div>
                          <div className="mt-1 flex items-center sm:justify-end gap-1.5 text-muted">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-bab & Poin-poin Capaian yang Hidup & Berstruktur */}
                      <div className="space-y-4">
                        {(exp.sections || []).map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-elevated/70 rounded-xl p-4 border border-subtle/80 hover:border-subtle transition-colors space-y-2.5 shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded tone-sky border">
                                0{sIdx + 1}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent">
                                {tr(sec.heading)}
                              </h4>
                            </div>

                            <ul className="space-y-2 text-xs sm:text-sm text-secondary leading-relaxed pt-1">
                              {(sec.bullets || []).map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0 group-hover:bg-cyan-300 transition-colors shadow-sm shadow-sky-400/50" />
                                  <span className="flex-1 text-justify">{tr(b)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tombol Popup Sertifikat Terkait (Interaktif & Glowing) */}
                    {(() => {
                      // Langkah 1: kumpulkan semua sertifikat yang terhubung lewat experienceId
                      const linked = certificates.filter(
                        (c) => c.experienceId && String(c.experienceId) === String(exp.id)
                      );

                      // Langkah 2: pilih yang paling relevan —
                      //   utamakan kategori 'Magang', fallback ke entri pertama yang ada
                      const linkedCert =
                        linked.find((c) => c.category && c.category.toLowerCase().includes('magang')) ||
                        linked[0] ||
                        null;

                      if (!linkedCert) return null;
                      return (
                        <div className="pt-4 mt-5 border-t border-subtle flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCertificate(linkedCert)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl tone-amber border text-xs font-semibold transition-all shadow-sm hover:brightness-105 hover:scale-[1.02] cursor-pointer group/btn"
                          >
                            <Award className="w-4 h-4 tone-amber-text group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all" />
                            <span>
                              {t('experience.viewOfficialCert', {
                                category: tr(linkedCert.category || 'Magang'),
                              })}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                          <a
                            href="#sertifikat"
                            className="text-xs text-secondary hover:text-accent font-medium transition-colors"
                          >
                            {t('experience.allCertificates')} &rarr;
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

        <section id="proyek" className="py-16 sm:py-20 border-b border-subtle relative overflow-hidden">
          <ProyekDecor />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{t('projects.eyebrow')}</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('projects.title')}</h2>
                {dataSource === 'api' && (
                  <p className="text-xs tone-emerald-text mt-1">{t('projects.syncedCloud')}</p>
                )}
              </div>
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
                      {t('projects.featuredBadge')} · {getProjectCategoryBadge(featuredProject, tr)}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold">{tr(featuredProject.title)}</h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed text-justify">{tr(featuredProject.summary)}</p>
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all hover:scale-[1.02]"
                      >
                        <span>{getProjectLinkInfo(featuredProject, t)?.text || t('projects.liveDemo')}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-subtle text-sm font-semibold"
                    >
                      <span>{t('projects.viewDetails')}</span>
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
                          {getProjectCategoryBadge(project, tr)}
                        </span>
                        <span className="text-xs text-muted">{project.year}</span>
                      </div>
                      <h3 className="font-bold text-base leading-snug">{tr(project.title)}</h3>
                      <p className="text-xs sm:text-sm text-secondary leading-relaxed text-justify">{tr(project.summary)}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tags || []).map((tag) => (
                        <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-elevated text-secondary border border-subtle">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-subtle text-xs font-semibold">
                      <span className="text-accent inline-flex items-center gap-1">
                        {t('projects.projectDetails')} <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="tone-emerald-text hover:underline inline-flex items-center gap-1"
                        >
                          <span>{getProjectLinkInfo(project, t)?.text || t('projects.liveDemo')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-muted">{t('projects.caseStudy')}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION SERTIFIKAT (Di atas Keahlian Teknis) */}
        <section id="sertifikat" className="py-16 sm:py-20 border-b border-subtle relative overflow-hidden">
          <SertifikatDecor />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{t('certificates.eyebrow')}</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('certificates.title')}</h2>
                <p className="text-sm text-secondary mt-1 text-justify">
                  {t('certificates.subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 tone-amber border">
                  <Award className="w-3.5 h-3.5 tone-amber-text" />
                  <span>{t('certificates.countBadge', { count: certificates.length })}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => {
                const certTitle = formatCertificateTitle(tr(cert.title));
                const certCategory = tr(cert.category || t('certificates.fallbackChip'));
                const certDate = cert.issueDate ? tr(cert.issueDate) : t('certificates.fallbackChip');
                return (
                  <article
                    key={cert.id}
                    onClick={() => setSelectedCertificate(cert)}
                    className="surface-card rounded-2xl overflow-hidden border border-subtle hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail / Mockup Preview (Utuh & Tidak Terpotong) */}
                      <div className="aspect-[16/10] bg-slate-950/60 border-b border-subtle overflow-hidden relative flex items-center justify-center p-2 sm:p-2.5">
                        {cert.imageUrl ? (
                          <img
                            src={cert.imageUrl}
                            alt={certTitle}
                            className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full border-2 border-dashed border-amber-500/30 rounded-xl bg-gradient-to-br from-slate-950 to-[#0e1626] flex flex-col items-center justify-center p-3 text-center">
                            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-1.5 shadow-md">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-200 line-clamp-1">{cert.issuer}</span>
                            <span className="text-[10px] text-amber-400 font-semibold mt-0.5">{certCategory}</span>
                          </div>
                        )}
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/90 text-sky-300 backdrop-blur border border-slate-700/80">
                          {certDate}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getCertificateCategoryStyle(cert.category).badgeClass}`}>
                            {certCategory}
                          </span>
                        </div>
                        <h3
                          className="font-bold text-base leading-snug group-hover:text-accent transition-colors line-clamp-2"
                          title={certTitle}
                        >
                          {certTitle}
                        </h3>
                        <p className="text-xs text-accent font-semibold">{cert.issuer}</p>
                        {cert.description && (
                          <p className="text-xs text-secondary line-clamp-2 leading-relaxed text-justify">
                            {tr(cert.description)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-subtle/50 mt-2 flex items-center justify-between text-xs font-semibold">
                      <span className="text-accent inline-flex items-center gap-1 group-hover:underline">
                        {t('certificates.viewCertificate')} <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      {cert.credentialUrl && (
                        <span className="tone-emerald-text text-[11px]">{t('certificates.verified')}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="keahlian" className="py-16 sm:py-20 border-b border-subtle relative overflow-hidden">
          <KeahlianDecor />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{t('skills.eyebrow')}</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('skills.title')}</h2>
                <p className="text-sm text-secondary mt-1 max-w-xl text-justify">
                  {t('skills.subtitle')}
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
                  <span>{t('skills.hardTab')}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${skillTab === 'hard' ? 'bg-white/20 text-white' : 'bg-[var(--bg-surface)] border border-subtle text-secondary'}`}>
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
                  <span>{t('skills.softTab')}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${skillTab === 'soft' ? 'bg-white/20 text-white' : 'bg-[var(--bg-surface)] border border-subtle text-secondary'}`}>
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
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        skillTab === 'hard' ? 'tone-sky' : 'tone-purple'
                      }`}>
                        {skillTab === 'hard' ? <Code2 className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg">{tr(groupTitle)}</h3>
                    </div>
                    <span className="text-xs text-secondary font-medium">
                      {t('skills.countLabel', { count: items.length })}
                    </span>
                  </div>

                  <div className="space-y-4">
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
                        <div key={skill.id || skill.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                            <span className="font-semibold text-[var(--text-primary)]">{tr(skill.name)}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ratingInfo.badgeClass}`}>
                                {ratingText}
                              </span>
                              <span className="font-bold text-xs text-[var(--text-primary)] min-w-[36px] text-right">
                                {skill.ratePoint}%
                              </span>
                            </div>
                          </div>
                          {/* Progress Rate Point Bar */}
                          <div className="w-full bg-elevated rounded-full h-2.5 overflow-hidden border border-subtle p-0.5">
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
          <KontakDecor />
          {/* Subtle background glow decoration */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tone-sky border mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {t('contact.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('contact.title')}</h2>
              <p className="mt-2 text-sm sm:text-base text-secondary text-justify">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* Quick Social Popup Launcher Banner */}
            <div className="surface-card rounded-2xl p-5 sm:p-6 mb-8 border border-sky-500/30 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl tone-sky border flex items-center justify-center shrink-0">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 justify-center sm:justify-start">
                    {t('contact.hubTitle')}
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full tone-emerald border">
                      {t('contact.hubActive')}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary mt-0.5 text-justify">
                    {t('contact.hubDesc')}
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
                  <span>{t('contact.hubButton')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Kolom Kiri: Kartu Media Sosial & Kontak */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">{t('contact.directTitle')}</h4>
                  <button
                    type="button"
                    onClick={() => setSocialModalOpen(true)}
                    className="text-xs text-accent hover:opacity-80 font-medium inline-flex items-center gap-1"
                  >
                    {t('contact.openModal')} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Email Card with Copy */}
                <div className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-sky-500/40 transition-all group">
                  <a href={`mailto:${profile.email || PROFILE.email}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl tone-sky border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">{t('contact.emailLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">{profile.email || PROFILE.email}</div>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold chip-tag hover:border-sky-500/50 shrink-0"
                    title={t('contact.copyTitle')}
                  >
                    {t('contact.copy')}
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
                    <div className="w-10 h-10 rounded-xl tone-emerald border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">{t('contact.whatsappLabel')}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{profile.whatsappDisplay || PROFILE.whatsappDisplay}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-emerald-500 transition-colors shrink-0" />
                </a>

                {/* GitHub Card */}
                <a
                  href={profile.githubUrl || PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-slate-400/50 transition-all group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-elevated text-[var(--text-primary)] border border-subtle flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Github className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">{t('contact.githubLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.githubUrl || PROFILE.githubUrl).replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-[var(--text-primary)] transition-colors shrink-0" />
                </a>

                {/* LinkedIn Card */}
                <a
                  href={profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'https://linkedin.com/in/faris-pratama-putra'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-subtle hover:border-blue-500/50 transition-all group block"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl tone-blue border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-secondary">{t('contact.linkedinLabel')}</div>
                      <div className="text-sm font-semibold truncate text-[var(--text-primary)]">
                        {(profile.linkedinUrl || (profile.socials?.find((s) => s.id === 'linkedin')?.url) || 'linkedin.com/in/faris-pratama-putra').replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-secondary group-hover:text-blue-500 transition-colors shrink-0" />
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
                      <div className="w-9 h-9 rounded-lg tone-rose border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-secondary">Instagram</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.instagramUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-pink-500 shrink-0" />
                  </a>

                  <a
                    href={profile.tiktokUrl || (profile.socials?.find((s) => s.id === 'tiktok')?.url) || 'https://tiktok.com/@fpratamaputra'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-card rounded-xl p-3.5 flex items-center justify-between gap-2 border border-subtle hover:border-cyan-400/50 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg tone-cyan border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <TikTokIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-secondary">TikTok</div>
                        <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                          {(profile.tiktokUrl || 'fpratamaputra').replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-secondary group-hover:text-cyan-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Kolom Kanan: Form Kirim Pesan Cepat */}
              <div className="lg:col-span-7">
                <form onSubmit={handleWhatsAppSubmit} className="surface-card rounded-2xl p-6 sm:p-7 space-y-4 border border-subtle shadow-md">
                  <div className="flex items-center justify-between border-b border-subtle/60 pb-3">
                    <div>
                      <h3 className="text-lg font-bold">{t('contact.formTitle')}</h3>
                      <p className="text-xs text-secondary mt-0.5">{t('contact.formSubtitle')}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg tone-sky border flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-secondary mb-1.5">{t('contact.nameLabel')}</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={t('contact.namePlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-subtle text-sm focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary mb-1.5">{t('contact.topicLabel')}</label>
                      <select
                        value={formState.topicIdx}
                        onChange={(e) => setFormState({ ...formState, topicIdx: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-elevated border border-subtle text-sm focus:border-sky-500 focus:outline-none"
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
                    <label className="block text-xs font-semibold text-secondary mb-1.5">{t('contact.messageLabel')}</label>
                    <textarea
                      rows="4"
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={t('contact.messagePlaceholder')}
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
                        <span>{t('contact.sendWhatsapp')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleEmailClick}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition-colors"
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

      <footer className="border-t border-subtle py-8 bg-elevated">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-secondary text-center md:text-left">
            © {new Date().getFullYear()} <strong className="font-semibold text-[var(--text-primary)]">{PROFILE.fullName}</strong> · {t('footer.rights')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <button
              type="button"
              onClick={() => setSocialModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg tone-sky border hover:brightness-105 text-xs font-semibold transition-all"
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
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-xl border border-sky-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
