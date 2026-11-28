import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  Code2,
  Crop,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LogIn,
  LogOut,
  Plus,
  Printer,
  Save,
  Server,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import ImageCropperModal from '../components/ImageCropperModal';
import CvModal from '../components/CvModal';
import CertificateModal from '../components/CertificateModal';
import ConfirmActionModal from '../components/ConfirmActionModal';
import {
  CERTIFICATES as FALLBACK_CERTIFICATES,
  DEFAULT_SKILLS,
  EXPERIENCE_STATUS_OPTIONS,
  PROFILE,
  getBadgeStyle,
  getCertificateCategoryStyle,
  getSkillRatingLabel,
} from '../data/portfolioData';
import {
  createCertificate,
  createExperience,
  createProject,
  createSkill,
  deleteCertificate,
  deleteExperience,
  deleteProject,
  deleteSkill,
  fetchCertificates,
  fetchExperiences,
  fetchProfile,
  fetchProjects,
  fetchSkills,
  getApiBaseUrl,
  loginAdmin,
  updateCertificate,
  updateExperience,
  updateProfile,
  updateProject,
  updateSkill,
  uploadCroppedImage,
} from '../services/api';

const TOKEN_KEY = 'faris-admin-jwt';

export default function AdminPanel({ onNavigate }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState('farispakez1209@gmail.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [toast, setToast] = useState('');
  const [cropperTarget, setCropperTarget] = useState(null); // null | 'project' | 'profile' | 'certificate'
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const [profileForm, setProfileForm] = useState({
    photoUrl: '',
    photoBlob: null,
    photoMeta: '',
    role: PROFILE.role,
    bio: PROFILE.bio,
    availabilityStatus: PROFILE.availabilityStatus || 'Terbuka untuk Peluang',
    education: PROFILE.educationSummary || 'S1 Teknik Informatika (UDB)',
    profession: PROFILE.currentRole || 'Web UI/UX & IT Developer',
    coreSkills: PROFILE.coreSkills || 'Web UI/UX · Machine Learning · IoT',
    location: PROFILE.cityShort || 'Surakarta, Indonesia',
    email: PROFILE.email || 'farispakez1209@gmail.com',
    whatsapp: PROFILE.whatsappNumber || '6281219534692',
    githubUrl: PROFILE.githubUrl || 'https://github.com/Farispratama86',
    linkedinUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projForm, setProjForm] = useState({
    title: '',
    category: 'web-ml',
    categoryLabel: 'Web UI/UX',
    year: '2026',
    summary: '',
    highlightsText: '',
    tagsText: '',
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    featured: false,
    imageUrl: '',
    imageBlob: null,
    imageMeta: '',
  });

  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({
    badge: 'Magang · Hybrid',
    role: '',
    company: '',
    period: '',
    location: 'Surakarta, Indonesia',
    sections: [
      { heading: 'Tanggung Jawab Utama', bulletsText: '' },
    ],
  });

  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    category: 'Magang',
    issueDate: '',
    credentialUrl: '',
    experienceId: '',
    description: '',
    imageUrl: '',
    imageBlob: null,
    imageMeta: '',
  });

  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillFilterTab, setSkillFilterTab] = useState('all'); // 'all' | 'hard' | 'soft'
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'hard', // 'hard' | 'soft'
    groupName: 'Web UI/UX & ML',
    ratePoint: 85,
    sortOrder: 0,
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const loadAll = async () => {
    try {
      const [p, e, c, s, prof] = await Promise.all([
        fetchProjects(),
        fetchExperiences(),
        fetchCertificates().catch(() => []),
        fetchSkills().catch(() => []),
        fetchProfile().catch(() => ({})),
      ]);
      setProjects(p);
      setExperiences(e);
      setCertificates(c.length ? c : FALLBACK_CERTIFICATES);
      setSkills(s.length ? s : DEFAULT_SKILLS);
      if (prof) {
        setProfileForm((prev) => ({
          ...prev,
          photoUrl: prof.photoUrl || '',
          photoMeta: prof.photoUrl ? 'Tersimpan di Cloudinary' : '',
          role: prof.role || PROFILE.role,
          bio: prof.bio || PROFILE.bio,
          availabilityStatus: prof.availabilityStatus || PROFILE.availabilityStatus || 'Terbuka untuk Peluang',
          education: prof.education || PROFILE.educationSummary || 'S1 Teknik Informatika (UDB)',
          profession: prof.profession || prof.currentRole || PROFILE.currentRole || 'Web UI/UX & IT Developer',
          coreSkills: prof.coreSkills || PROFILE.coreSkills || 'Web UI/UX · Machine Learning · IoT',
          location: prof.location || PROFILE.cityShort || 'Surakarta, Indonesia',
          email: prof.email || PROFILE.email || 'farispakez1209@gmail.com',
          whatsapp: prof.whatsapp || PROFILE.whatsappNumber || '6281219534692',
          githubUrl: prof.githubUrl || PROFILE.githubUrl || '',
          linkedinUrl: prof.linkedinUrl || '',
          instagramUrl: prof.instagramUrl || '',
          tiktokUrl: prof.tiktokUrl || '',
        }));
      }
    } catch (err) {
      notify(`Gagal memuat data: ${err.message}`);
    }
  };

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      setToken(res.token);
      try {
        localStorage.setItem(TOKEN_KEY, res.token);
      } catch {
        // ignore
      }
      notify('Login JWT berhasil!');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  };

  const executeSaveProfile = async () => {
    setLoading(true);
    try {
      let photoUrl = profileForm.photoUrl;
      let photoPublicId = undefined;

      if (profileForm.photoBlob) {
        const up = await uploadCroppedImage(profileForm.photoBlob, token, 'profile');
        photoUrl = up.url;
        photoPublicId = up.publicId;
      }

      const saved = await updateProfile(
        {
          photoUrl,
          photoPublicId,
          role: profileForm.role,
          bio: profileForm.bio,
          availabilityStatus: profileForm.availabilityStatus,
          education: profileForm.education,
          profession: profileForm.profession,
          coreSkills: profileForm.coreSkills,
          location: profileForm.location,
          email: profileForm.email,
          whatsapp: profileForm.whatsapp,
          githubUrl: profileForm.githubUrl,
          linkedinUrl: profileForm.linkedinUrl,
          instagramUrl: profileForm.instagramUrl,
          tiktokUrl: profileForm.tiktokUrl,
        },
        token
      );

      setProfileForm((prev) => ({
        ...prev,
        photoUrl: saved.photoUrl || prev.photoUrl,
        photoBlob: null,
        photoMeta: saved.photoUrl ? 'Tersimpan di Cloudinary & TiDB' : '',
        availabilityStatus: saved.availabilityStatus || prev.availabilityStatus,
        education: saved.education || prev.education,
        profession: saved.profession || saved.currentRole || prev.profession,
        coreSkills: saved.coreSkills || prev.coreSkills,
        location: saved.location || prev.location,
        email: saved.email || prev.email,
        whatsapp: saved.whatsapp || prev.whatsapp,
      }));
      notify('Profil & foto berhasil disimpan ke Cloudinary dan TiDB Cloud!');
    } catch (err) {
      notify(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setPendingAction({
      type: 'update',
      entityLabel: 'Profil & Foto',
      itemName: profileForm.role || 'Profil Utama',
      itemSubtitle: profileForm.photoBlob
        ? 'Termasuk unggahan foto profil baru ke Cloudinary'
        : 'Pembaruan bio & tautan media sosial',
      onConfirm: executeSaveProfile,
    });
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjForm({
      title: '',
      category: 'web-ml',
      categoryLabel: 'Web & Machine Learning',
      year: '2026',
      summary: '',
      highlightsText: '',
      tagsText: '',
      liveUrl: '',
      repoUrl: 'https://github.com/Farispratama86',
      featured: false,
      imageUrl: '',
      imageBlob: null,
      imageMeta: '',
    });
  };

  const resetExpForm = () => {
    setEditingExpId(null);
    setExpForm({
      badge: 'Magang · Hybrid',
      role: '',
      company: '',
      period: '',
      location: 'Surakarta, Indonesia',
      sections: [
        { heading: 'Tanggung Jawab Utama', bulletsText: '' },
      ],
    });
  };

  const handleAddExpSection = () => {
    setExpForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: '', bulletsText: '' }],
    }));
  };

  const handleRemoveExpSection = (index) => {
    setExpForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleExpSectionChange = (index, field, value) => {
    setExpForm((prev) => {
      const next = [...prev.sections];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, sections: next };
    });
  };

  const executeSaveProject = async () => {
    setLoading(true);
    try {
      let imageUrl = projForm.imageUrl;
      let imagePublicId = '';

      if (projForm.imageBlob) {
        const up = await uploadCroppedImage(projForm.imageBlob, token, 'project');
        imageUrl = up.url;
        imagePublicId = up.publicId;
      }

      let finalCategoryLabel = projForm.categoryLabel?.trim();
      if (!finalCategoryLabel || (projForm.category === 'iot' && /web|ui\/ux/i.test(finalCategoryLabel))) {
        finalCategoryLabel = projForm.category === 'iot' ? 'IoT & Embedded' : projForm.category === 'desktop' ? 'Desktop App' : 'Web & Machine Learning';
      } else if (projForm.category === 'desktop' && /web|ui\/ux/i.test(finalCategoryLabel)) {
        finalCategoryLabel = 'Desktop App';
      }

      const payload = {
        title: projForm.title,
        category: projForm.category,
        categoryLabel: finalCategoryLabel,
        year: projForm.year,
        summary: projForm.summary,
        highlights: projForm.highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        tags: projForm.tagsText.split(',').map((s) => s.trim()).filter(Boolean),
        imageUrl,
        imagePublicId: imagePublicId || undefined,
        liveUrl: projForm.liveUrl,
        repoUrl: projForm.repoUrl,
        featured: projForm.featured,
      };

      if (editingProjectId) {
        const updated = await updateProject(editingProjectId, payload, token);
        setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? updated : p)));
        notify('Proyek diperbarui di TiDB Cloud.');
      } else {
        const created = await createProject(payload, token);
        setProjects((prev) => [created, ...prev]);
        notify('Proyek baru tersimpan ke TiDB Cloud & Cloudinary!');
      }
      resetProjectForm();
    } catch (err) {
      notify(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    setPendingAction({
      type: editingProjectId ? 'update' : 'create',
      entityLabel: 'Proyek',
      itemName: projForm.title,
      itemSubtitle: `${projForm.categoryLabel || projForm.category} · ${projForm.year}`,
      onConfirm: executeSaveProject,
    });
  };

  const handleDeleteProject = (project) => {
    setPendingAction({
      type: 'delete',
      entityLabel: 'Proyek',
      itemName: project.title,
      itemSubtitle: `${project.categoryLabel || project.category} · ${project.year}`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteProject(project.id, token);
          setProjects((prev) => prev.filter((p) => p.id !== project.id));
          if (editingProjectId === project.id) resetProjectForm();
          notify('Proyek dihapus.');
        } catch (err) {
          notify(`Error: ${err.message}`);
        } finally {
          setLoading(false);
          setPendingAction(null);
        }
      },
    });
  };

  const executeSaveExperience = async () => {
    setLoading(true);
    try {
      const formattedSections = expForm.sections
        .map((s) => ({
          heading: (s.heading || '').trim() || 'Tanggung Jawab Utama',
          bullets: (s.bulletsText || '')
            .split('\n')
            .map((b) => b.trim())
            .filter(Boolean),
        }))
        .filter((s) => s.bullets.length > 0 || s.heading.trim().length > 0);

      const payload = {
        badge: expForm.badge,
        role: expForm.role,
        company: expForm.company,
        period: expForm.period,
        location: expForm.location,
        sections: formattedSections.length > 0 ? formattedSections : [
          { heading: 'Tanggung Jawab Utama', bullets: [] }
        ],
      };

      if (editingExpId) {
        const updated = await updateExperience(editingExpId, payload, token);
        setExperiences((prev) => prev.map((x) => (x.id === editingExpId ? updated : x)));
        notify('Pengalaman & sub-bab berhasil diperbarui.');
      } else {
        const created = await createExperience(payload, token);
        setExperiences((prev) => [created, ...prev]);
        notify('Program magang / pengalaman baru berhasil ditambahkan!');
      }
      resetExpForm();
    } catch (err) {
      notify(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveExperience = (e) => {
    e.preventDefault();
    setPendingAction({
      type: editingExpId ? 'update' : 'create',
      entityLabel: 'Pengalaman Kerja / Magang',
      itemName: `${expForm.role} — ${expForm.company}`,
      itemSubtitle: `${expForm.badge} · ${expForm.period}`,
      onConfirm: executeSaveExperience,
    });
  };

  const handleDeleteExp = (exp) => {
    setPendingAction({
      type: 'delete',
      entityLabel: 'Pengalaman Kerja / Magang',
      itemName: `${exp.role} — ${exp.company}`,
      itemSubtitle: `${exp.badge} · ${exp.period}`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteExperience(exp.id, token);
          setExperiences((prev) => prev.filter((x) => x.id !== exp.id));
          if (editingExpId === exp.id) resetExpForm();
          notify('Pengalaman dihapus.');
        } catch (err) {
          notify(`Error: ${err.message}`);
        } finally {
          setLoading(false);
          setPendingAction(null);
        }
      },
    });
  };

  const resetCertForm = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      issuer: '',
      category: 'Magang',
      issueDate: '',
      credentialUrl: '',
      experienceId: '',
      description: '',
      imageUrl: '',
      imageBlob: null,
      imageMeta: '',
    });
  };

  const executeSaveCertificate = async () => {
    setLoading(true);
    try {
      let imageUrl = certForm.imageUrl;
      let imagePublicId = '';

      if (certForm.imageBlob) {
        const up = await uploadCroppedImage(certForm.imageBlob, token, 'certificate');
        imageUrl = up.url;
        imagePublicId = up.publicId;
      }

      const payload = {
        title: certForm.title,
        issuer: certForm.issuer,
        category: certForm.category,
        issueDate: certForm.issueDate,
        credentialUrl: certForm.credentialUrl,
        experienceId: certForm.experienceId || null,
        description: certForm.description,
        imageUrl,
        imagePublicId: imagePublicId || undefined,
      };

      if (editingCertId) {
        const updated = await updateCertificate(editingCertId, payload, token);
        setCertificates((prev) => prev.map((c) => (c.id === editingCertId ? updated : c)));
        notify('Sertifikat berhasil diperbarui.');
      } else {
        const created = await createCertificate(payload, token);
        setCertificates((prev) => [created, ...prev]);
        notify('Sertifikat baru berhasil ditambahkan!');
      }
      resetCertForm();
    } catch (err) {
      notify(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveCertificate = (e) => {
    e.preventDefault();
    setPendingAction({
      type: editingCertId ? 'update' : 'create',
      entityLabel: 'Sertifikat',
      itemName: certForm.title,
      itemSubtitle: `${certForm.issuer} · ${certForm.category}${certForm.issueDate ? ` (${certForm.issueDate})` : ''}`,
      onConfirm: executeSaveCertificate,
    });
  };

  const handleDeleteCert = (cert) => {
    setPendingAction({
      type: 'delete',
      entityLabel: 'Sertifikat',
      itemName: cert.title,
      itemSubtitle: `${cert.issuer} · ${cert.category}${cert.issueDate ? ` (${cert.issueDate})` : ''}`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteCertificate(cert.id, token);
          setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
          if (editingCertId === cert.id) resetCertForm();
          notify('Sertifikat dihapus.');
        } catch (err) {
          notify(`Error: ${err.message}`);
        } finally {
          setLoading(false);
          setPendingAction(null);
        }
      },
    });
  };

  const resetSkillForm = () => {
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      category: 'hard',
      groupName: 'Web UI/UX & ML',
      ratePoint: 85,
      sortOrder: 0,
    });
  };

  const executeSaveSkill = async () => {
    setLoading(true);
    try {
      const payload = {
        name: skillForm.name,
        category: skillForm.category,
        groupName: skillForm.groupName,
        ratePoint: Number(skillForm.ratePoint) || 85,
        sortOrder: Number(skillForm.sortOrder) || 0,
      };

      if (editingSkillId) {
        const updated = await updateSkill(editingSkillId, payload, token);
        setSkills((prev) => prev.map((s) => (s.id === editingSkillId ? updated : s)));
        notify('Keahlian berhasil diperbarui.');
      } else {
        const created = await createSkill(payload, token);
        setSkills((prev) => [...prev, created]);
        notify('Keahlian baru berhasil ditambahkan!');
      }
      resetSkillForm();
    } catch (err) {
      notify(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveSkill = (e) => {
    e.preventDefault();
    setPendingAction({
      type: editingSkillId ? 'update' : 'create',
      entityLabel: 'Keahlian',
      itemName: skillForm.name,
      itemSubtitle: `${skillForm.category === 'hard' ? 'Hard Skill' : 'Soft Skill'} · ${skillForm.groupName} (${skillForm.ratePoint}%)`,
      onConfirm: executeSaveSkill,
    });
  };

  const handleDeleteSkill = (skill) => {
    setPendingAction({
      type: 'delete',
      entityLabel: 'Keahlian',
      itemName: skill.name,
      itemSubtitle: `${skill.category === 'hard' ? 'Hard Skill' : 'Soft Skill'} · ${skill.groupName || 'Umum'} (${skill.ratePoint}%)`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteSkill(skill.id, token);
          setSkills((prev) => prev.filter((s) => s.id !== skill.id));
          if (editingSkillId === skill.id) resetSkillForm();
          notify('Keahlian dihapus.');
        } catch (err) {
          notify(`Error: ${err.message}`);
        } finally {
          setLoading(false);
          setPendingAction(null);
        }
      },
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#100F0E] text-[#EDE6D6] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Latar belakang halus /images/bg-archive-crt.jpg (opacity 0.10) */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none select-none"
          style={{ backgroundImage: "url('/images/bg-archive-crt.jpg')", opacity: 0.1 }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{ background: 'radial-gradient(circle at center, transparent 15%, rgba(16,15,14,0.88) 90%)' }}
          aria-hidden="true"
        />

        <div className="w-full max-w-md bg-[#181615] border border-[#302A26] rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#302A26]">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#DC2626]/15 border border-[#DC2626]/40 text-[#EF4444] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-mono-code text-[10px] font-bold uppercase tracking-widest text-[#EF4444]">
                  GERBANG ARSIPARIS // ADMIN DOSSIER
                </p>
                <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#EDE6D6] leading-tight mt-0.5">
                  Akses Arsiparis
                </h1>
                <p className="font-mono-code text-[11px] text-[#C2B8A7] mt-0.5">API: {getApiBaseUrl()}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="font-mono-code text-xs text-[#C2B8A7] hover:text-[#EF4444] inline-flex items-center gap-1 shrink-0 pt-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Web
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1.5">Email Admin</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#100F0E] border border-[#302A26] text-sm text-[#EDE6D6] focus:border-[#DC2626] outline-none"
              />
            </div>
            <div>
              <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1.5">Password Admin</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password admin Anda"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#100F0E] border border-[#302A26] text-sm text-[#EDE6D6] focus:border-[#DC2626] outline-none"
              />
            </div>
            {loginError && (
              <div className="p-3 rounded-lg bg-[#DC2626]/15 border border-[#DC2626]/40 text-[#FCA5A5] text-xs font-mono-code">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dossier (JWT)'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const adminBgImage =
    activeTab === 'profile'
      ? '/images/bg-dossier-hero.jpg'
      : activeTab === 'projects' || activeTab === 'experiences'
      ? '/images/bg-corridor-noir.jpg'
      : '/images/bg-archive-crt.jpg';

  return (
    <div className="min-h-screen bg-[#100F0E] text-[#EDE6D6] relative overflow-x-hidden">
      {/* Latar belakang atmosfer Noir Dossier dari public/images/ sesuai tab aktif */}
      <div className="fixed inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url('${adminBgImage}')`,
            opacity: 0.16,
            filter: 'contrast(1.08) saturate(0.72)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(16,15,14,0.35) 0%, rgba(16,15,14,0.90) 88%)' }}
        />
        <div className="vhs-scanlines absolute inset-0 opacity-25" />
      </div>

      <header className="sticky top-0 z-30 bg-[#100F0E]/90 backdrop-blur border-b border-[#302A26]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-mono-code font-extrabold text-sm shrink-0">
              FP
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-serif-editorial text-xl sm:text-2xl text-[#EDE6D6] truncate leading-none">
                  Panel Arsiparis
                </h1>
                <span className="hidden md:inline-block font-mono-code text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#DC2626]/15 text-[#EF4444] border border-[#DC2626]/40">
                  ADMIN DOSSIER
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono-code text-[11px] text-[#C2B8A7] mt-0.5">
                <Server className="w-3 h-3 text-emerald-400" />
                <span className="truncate">Terhubung: {getApiBaseUrl()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCvPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#24201D] border border-[#302A26] hover:border-[#DC2626]/60 text-[#EDE6D6] font-mono-code text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#EF4444]" />
              <span className="hidden sm:inline">Cetak CV PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#24201D] border border-[#302A26] text-[#EDE6D6] font-mono-code text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Lihat Portofolio</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DC2626]/40 text-[#FCA5A5] hover:bg-[#DC2626]/15 font-mono-code text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#181615] border border-[#302A26] gap-1 font-mono-code">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'profile' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil &amp; Foto</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'projects' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Proyek ({projects.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experiences')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'experiences' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Pengalaman &amp; Magang ({experiences.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('certificates')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'certificates' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Sertifikat ({certificates.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'skills' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Keahlian &amp; Tingkat ({skills.length})</span>
          </button>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">Foto Profil (Rasio 4:3 → Cloudinary)</h2>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#100F0E] border border-dashed border-[#302A26] flex items-center justify-center">
                {profileForm.photoUrl ? (
                  <img src={profileForm.photoUrl} alt="Foto Profil" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="text-center p-4">
                    <User className="w-10 h-10 text-[#786E60] mx-auto mb-1.5" />
                    <p className="text-xs text-[#938878]">Belum ada foto profil tersimpan</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCropperTarget('profile')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DC2626]/15 hover:bg-[#DC2626]/25 text-[#EF4444] border border-[#DC2626]/35 text-xs font-semibold"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>{profileForm.photoUrl ? 'Ganti / Crop Foto Profil' : 'Pilih & Crop Foto Profil'}</span>
                </button>
                {profileForm.photoMeta && <span className="text-[11px] text-emerald-400">{profileForm.photoMeta}</span>}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">Bio &amp; Tautan Media Sosial</h2>
              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Peran / Tagline Hero</label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>
              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Deskripsi Singkat (Hero)</label>
                <textarea
                  rows="3"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm resize-none focus:border-[#DC2626] outline-none"
                />
              </div>

              {/* Detail Kartu Identitas */}
              <div className="pt-2 border-t border-[#302A26] space-y-3">
                <p className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#EF4444]">Detail Kartu Identitas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Status Ketersediaan / Badge Foto</label>
                    <input
                      type="text"
                      value={profileForm.availabilityStatus}
                      onChange={(e) => setProfileForm({ ...profileForm, availabilityStatus: e.target.value })}
                      placeholder="Terbuka untuk Peluang"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Pendidikan</label>
                    <input
                      type="text"
                      value={profileForm.education}
                      onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
                      placeholder="S1 Teknik Informatika (UDB)"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Profesi / Peran</label>
                    <input
                      type="text"
                      value={profileForm.profession}
                      onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                      placeholder="Web UI/UX & IT Developer"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Keahlian Utama</label>
                    <input
                      type="text"
                      value={profileForm.coreSkills}
                      onChange={(e) => setProfileForm({ ...profileForm, coreSkills: e.target.value })}
                      placeholder="Web UI/UX · Machine Learning · IoT"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Domisili</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="Surakarta, Indonesia"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tautan Kontak & Media Sosial */}
              <div className="pt-2 border-t border-[#302A26] space-y-3">
                <p className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#EF4444]">Tautan Kontak &amp; Media Sosial</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="farispakez1209@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Nomor WhatsApp</label>
                    <input
                      type="text"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      placeholder="6281219534692"
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={profileForm.instagramUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">TikTok URL</label>
                    <input
                      type="url"
                      value={profileForm.tiktokUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, tiktokUrl: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Profil & Foto'}</span>
              </button>
            </div>
          </form>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleSaveProject} className="lg:col-span-5 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">{editingProjectId ? 'Edit Proyek' : 'Tambah Proyek Baru'}</h2>
                {editingProjectId && (
                  <button type="button" onClick={resetProjectForm} className="text-xs text-[#C2B8A7] hover:text-[#EF4444]">
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7]">Foto Proyek (Rasio 16:9 → Cloudinary)</label>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#100F0E] border border-dashed border-[#302A26] flex items-center justify-center">
                  {projForm.imageUrl ? (
                    <img src={projForm.imageUrl} alt="Preview crop" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-[#786E60] mx-auto mb-1" />
                      <p className="text-xs text-[#938878]">Belum ada foto</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCropperTarget('project')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DC2626]/15 hover:bg-[#DC2626]/25 text-[#EF4444] border border-[#DC2626]/35 text-xs font-semibold"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>{projForm.imageUrl ? 'Ganti / Crop Foto 16:9' : 'Pilih & Crop Foto 16:9'}</span>
                  </button>
                  {projForm.imageMeta && <span className="text-[11px] text-emerald-400">{projForm.imageMeta}</span>}
                </div>
              </div>

              <input
                type="text"
                required
                value={projForm.title}
                onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                placeholder="Judul Proyek"
                className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono-code text-[11px] font-semibold text-[#C2B8A7] mb-1">Kategori Utama *</label>
                  <select
                    value={projForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      let newLabel = 'Web & Machine Learning';
                      if (newCat === 'iot') newLabel = 'IoT & Embedded';
                      else if (newCat === 'desktop') newLabel = 'Desktop App';
                      setProjForm((prev) => ({
                        ...prev,
                        category: newCat,
                        categoryLabel:
                          prev.categoryLabel &&
                          !['Web UI/UX', 'Web & ML', 'IoT', 'Desktop', 'Web & Machine Learning', 'IoT & Embedded', 'Desktop App'].includes(prev.categoryLabel)
                            ? prev.categoryLabel
                            : newLabel,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                  >
                    <option value="web-ml">Web &amp; ML</option>
                    <option value="iot">IoT &amp; Embedded</option>
                    <option value="desktop">Desktop App</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono-code text-[11px] font-semibold text-[#C2B8A7] mb-1">Label Badge Kategori</label>
                  <input
                    type="text"
                    value={projForm.categoryLabel}
                    onChange={(e) => setProjForm({ ...projForm, categoryLabel: e.target.value })}
                    placeholder="Contoh: Web UI/UX · Production"
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[11px] font-semibold text-[#C2B8A7] mb-1">Tahun Proyek</label>
                  <input
                    type="text"
                    value={projForm.year}
                    onChange={(e) => setProjForm({ ...projForm, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                  />
                </div>
              </div>

              <textarea
                rows="3"
                required
                value={projForm.summary}
                onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                placeholder="Ringkasan proyek..."
                className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm resize-none"
              />

              <textarea
                rows="2"
                value={projForm.highlightsText}
                onChange={(e) => setProjForm({ ...projForm, highlightsText: e.target.value })}
                placeholder="Poin utama (1 baris = 1 poin)"
                className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm resize-none"
              />

              <input
                type="text"
                value={projForm.tagsText}
                onChange={(e) => setProjForm({ ...projForm, tagsText: e.target.value })}
                placeholder="Tag teknologi (pisahkan koma)"
                className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url"
                  value={projForm.liveUrl}
                  onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                  placeholder="Live Demo URL (opsional)"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
                />
                <input
                  type="url"
                  value={projForm.repoUrl}
                  onChange={(e) => setProjForm({ ...projForm, repoUrl: e.target.value })}
                  placeholder="GitHub Repo URL"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-[#D6CEBF] cursor-pointer">
                <input
                  type="checkbox"
                  checked={projForm.featured}
                  onChange={(e) => setProjForm({ ...projForm, featured: e.target.checked })}
                  className="accent-[#DC2626]"
                />
                <span>Jadikan Proyek Unggulan (Featured)</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : editingProjectId ? 'Simpan Perubahan' : 'Simpan ke Database'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {projects.map((p) => (
                <article key={p.id} className="bg-[#181615] border border-[#302A26] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-[#100F0E]/90 border border-[#302A26] shrink-0 flex items-center justify-center p-1.5">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <span className="text-[11px] text-[#938878]">Belum ada foto</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DC2626]/15 text-[#EF4444] border border-[#DC2626]/35">
                            {p.categoryLabel || (p.category === 'iot' ? 'IoT & Embedded' : p.category === 'desktop' ? 'Desktop App' : 'Web & ML')}
                          </span>
                          <span className="text-xs text-[#C2B8A7]">· {p.year}</span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base">{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(p.id);
                            setProjForm({
                              title: p.title,
                              category: p.category,
                              categoryLabel: p.categoryLabel,
                              year: p.year,
                              summary: p.summary,
                              highlightsText: (p.highlights || []).join('\n'),
                              tagsText: (p.tags || []).join(', '),
                              liveUrl: p.liveUrl || '',
                              repoUrl: p.repoUrl || '',
                              featured: Boolean(p.featured),
                              imageUrl: p.imageUrl || '',
                              imageBlob: null,
                              imageMeta: p.imageUrl ? 'Foto dari Cloudinary' : '',
                            });
                            setCropperTarget('project');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#DC2626]/15 hover:bg-[#DC2626]/25 border border-[#DC2626]/35 text-[#FCA5A5] text-[11px] font-semibold"
                          title="Upload atau ganti foto proyek ini"
                        >
                          <Crop className="w-3 h-3" />
                          <span>{p.imageUrl ? 'Ganti Foto' : 'Upload Foto'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(p.id);
                            setProjForm({
                              title: p.title,
                              category: p.category,
                              categoryLabel: p.categoryLabel,
                              year: p.year,
                              summary: p.summary,
                              highlightsText: (p.highlights || []).join('\n'),
                              tagsText: (p.tags || []).join(', '),
                              liveUrl: p.liveUrl || '',
                              repoUrl: p.repoUrl || '',
                              featured: Boolean(p.featured),
                              imageUrl: p.imageUrl || '',
                              imageBlob: null,
                              imageMeta: p.imageUrl ? 'Foto dari Cloudinary' : '',
                            });
                          }}
                          className="p-1.5 rounded-lg border border-[#302A26] hover:border-[#DC2626] text-[#D6CEBF]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p)}
                          className="p-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/15 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#C2B8A7] line-clamp-2">{p.summary}</p>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                        Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCES TAB */}
        {activeTab === 'experiences' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleSaveExperience} className="lg:col-span-5 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">{editingExpId ? 'Edit Pengalaman' : 'Tambah Magang / Pengalaman'}</h2>
                {editingExpId && (
                  <button type="button" onClick={resetExpForm} className="text-xs text-[#C2B8A7] hover:text-[#EF4444]">
                    Batal Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Peran / Posisi *</label>
                <input
                  type="text"
                  required
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  placeholder="Contoh: Web UI/UX Developer / Computer Technician"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>

              {/* Status / Kategori Pengalaman (Pilihan Interaktif) */}
              <div className="bg-[#100F0E]/85 border border-[#302A26] rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[#D6CEBF] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Status &amp; Kategori Aktivitas</span>
                  </label>
                  {/* Live Preview Badge */}
                  {expForm.badge && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${getBadgeStyle(expForm.badge).chipClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getBadgeStyle(expForm.badge).dotClass}`} />
                      {expForm.badge}
                    </span>
                  )}
                </div>

                {/* 4 Tombol Cepat Kategori */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, badge: 'Aktif · On-site' })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      getBadgeStyle(expForm.badge).type === 'aktif'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold shadow-sm'
                        : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6] hover:bg-[#231F1C]'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
                    Aktif Bekerja
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, badge: 'Resign (Nonaktif)' })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      getBadgeStyle(expForm.badge).type === 'resign'
                        ? 'bg-[#302A26]/60 border-[#938878]/50 text-[#EDE6D6] font-semibold shadow-sm'
                        : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6] hover:bg-[#231F1C]'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-[#938878] mr-1.5"></span>
                    Resign
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, badge: 'Magang · Hybrid' })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      getBadgeStyle(expForm.badge).type === 'magang'
                        ? 'bg-[#DC2626]/20 border-[#DC2626]/50 text-[#FCA5A5] font-semibold shadow-sm'
                        : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6] hover:bg-[#231F1C]'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444] mr-1.5"></span>
                    Magang
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpForm({ ...expForm, badge: 'Pelatihan Skill' })}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                      getBadgeStyle(expForm.badge).type === 'pelatihan'
                        ? 'bg-[#DC2626]/20 border-[#DC2626]/50 text-[#FCA5A5] font-semibold shadow-sm'
                        : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6] hover:bg-[#231F1C]'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
                    Pelatihan
                  </button>
                </div>

                {/* Dropdown Preset Lengkap */}
                <div className="space-y-1">
                  <label className="block text-[11px] text-[#C2B8A7]">Pilihan Standar (Klik untuk memilih):</label>
                  <select
                    value={
                      EXPERIENCE_STATUS_OPTIONS.flatMap((g) => g.options).includes(expForm.badge)
                        ? expForm.badge
                        : '__custom__'
                    }
                    onChange={(e) => {
                      if (e.target.value !== '__custom__') {
                        setExpForm({ ...expForm, badge: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1917] border border-[#302A26] text-sm text-[#EDE6D6] focus:border-[#DC2626] outline-none"
                  >
                    {EXPERIENCE_STATUS_OPTIONS.map((group) => (
                      <optgroup key={group.category} label={group.groupLabel}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="__custom__">-- Kustom / Ketik Manual Sendiri --</option>
                  </select>
                </div>

                {/* Input Teks Fleksibel (Bisa disesuaikan untuk apapun itu) */}
                <div className="space-y-1">
                  <label className="block text-[11px] text-[#C2B8A7]">Label Badge (Bisa diedit atau kustom bebas):</label>
                  <input
                    type="text"
                    required
                    value={expForm.badge}
                    onChange={(e) => setExpForm({ ...expForm, badge: e.target.value })}
                    placeholder="Contoh: Aktif · On-site, Magang · Hybrid, Pelatihan Skill AI..."
                    className="w-full px-3 py-2 rounded-xl bg-[#1C1917] border border-[#302A26] text-sm font-medium focus:border-[#DC2626] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Perusahaan / Instansi / Penyelenggara *</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="Contoh: PT Vinix Seven Aurum / Speed Computer"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Periode *</label>
                  <input
                    type="text"
                    required
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    placeholder="Contoh: Juni 2023 – Sekarang"
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={expForm.location}
                    onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                    placeholder="Contoh: Surakarta, Indonesia"
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm"
                  />
                </div>
              </div>

              {/* Multi-Section Sub-bab & Poin Tugas (Bisa 1, 2, atau Lebih) */}
              <div className="space-y-3 pt-2 border-t border-[#302A26]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#D6CEBF] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Sub-bab Tugas &amp; Capaian ({expForm.sections.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExpSection}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#DC2626]/15 hover:bg-[#DC2626]/25 text-[#EF4444] border border-[#DC2626]/35 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sub-bab</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {expForm.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="bg-[#100F0E]/90 border border-[#302A26] rounded-xl p-3.5 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-[#302A26]/70">
                        <span className="text-[11px] font-bold text-[#EF4444] flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-[#DC2626]/20 text-[#EF4444] flex items-center justify-center text-[10px]">
                            #{idx + 1}
                          </span>
                          Sub-bab {idx + 1}
                        </span>
                        {expForm.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExpSection(idx)}
                            className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-500/10 transition-colors"
                            title="Hapus sub-bab ini"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#C2B8A7] mb-1">
                          Judul Sub-bab / Capaian *
                        </label>
                        <input
                          type="text"
                          required
                          value={sec.heading}
                          onChange={(e) => handleExpSectionChange(idx, 'heading', e.target.value)}
                          placeholder="Contoh: Pengembangan Web & UI/UX / Troubleshooting & Instalasi"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1917] border border-[#302A26] text-sm font-medium focus:border-[#DC2626] outline-none text-[#EDE6D6]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#C2B8A7] mb-1">
                          Poin Tugas / Materi * (1 baris = 1 poin)
                        </label>
                        <textarea
                          rows="3"
                          required
                          value={sec.bulletsText}
                          onChange={(e) => handleExpSectionChange(idx, 'bulletsText', e.target.value)}
                          placeholder="Poin tugas (1 baris = 1 poin)"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1917] border border-[#302A26] text-sm text-[#EDE6D6] resize-none focus:border-[#DC2626] outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddExpSection}
                  className="w-full py-2.5 rounded-xl border border-dashed border-[#302A26] hover:border-[#DC2626]/60 text-xs font-semibold text-[#D6CEBF] hover:text-[#EF4444] hover:bg-[#DC2626]/5 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Sub-bab / Bagian Tugas Lainnya</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : editingExpId ? 'Simpan Perubahan' : 'Tambahkan Pengalaman'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {experiences.map((exp) => {
                const bStyle = getBadgeStyle(exp.badge);
                return (
                  <article key={exp.id} className="bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1 ${bStyle.chipClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${bStyle.dotClass}`} />
                          {exp.badge}
                        </span>
                        <h3 className="font-bold text-base">{exp.role}</h3>
                        <p className="text-sm text-[#EF4444]">{exp.company}</p>
                        <p className="text-xs text-[#C2B8A7]">{exp.period} · {exp.location}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const expSections = Array.isArray(exp.sections) && exp.sections.length > 0
                              ? exp.sections.map((s) => ({
                                  heading: s.heading || '',
                                  bulletsText: Array.isArray(s.bullets) ? s.bullets.join('\n') : '',
                                }))
                              : [{ heading: 'Tanggung Jawab Utama', bulletsText: '' }];

                            setEditingExpId(exp.id);
                            setExpForm({
                              badge: exp.badge || 'Aktif · On-site',
                              role: exp.role || '',
                              company: exp.company || '',
                              period: exp.period || '',
                              location: exp.location || '',
                              sections: expSections,
                            });
                          }}
                          className="p-1.5 rounded-lg border border-[#302A26] hover:border-[#DC2626] text-[#D6CEBF]"
                          title="Edit Pengalaman & Sub-bab"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExp(exp)}
                          className="p-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/15 text-rose-400"
                          title="Hapus Pengalaman"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Sub-bab di Card Admin */}
                    <div className="pt-2 border-t border-[#302A26] space-y-2">
                      {(exp.sections || []).map((sec, sIdx) => (
                        <div key={sIdx} className="bg-[#100F0E]/80 rounded-xl p-3 border border-[#302A26]/70 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[#EF4444] font-semibold">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                              {sec.heading || `Sub-bab #${sIdx + 1}`}
                            </span>
                            <span className="text-[10px] text-[#C2B8A7] font-normal px-2 py-0.5 rounded bg-[#1C1917] border border-[#302A26]">
                              {(sec.bullets || []).length} poin
                            </span>
                          </div>
                          <ul className="list-disc list-inside text-[#C2B8A7] space-y-0.5 text-[11px] leading-relaxed">
                            {(sec.bullets || []).map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleSaveCertificate} className="lg:col-span-5 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">{editingCertId ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}</h2>
                {editingCertId && (
                  <button type="button" onClick={resetCertForm} className="text-xs text-[#C2B8A7] hover:text-[#EF4444]">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Foto / Scan Sertifikat */}
              <div className="space-y-2">
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7]">Foto / Scan Sertifikat (Cloudinary)</label>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#100F0E] border border-dashed border-[#302A26] flex items-center justify-center relative">
                  {certForm.imageUrl ? (
                    <img src={certForm.imageUrl} alt="Preview Sertifikat" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Award className="w-8 h-8 text-amber-500/50 mx-auto mb-1" />
                      <p className="text-xs text-[#938878]">Belum ada foto sertifikat</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setCropperTarget('certificate')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>{certForm.imageUrl ? 'Ganti / Crop Foto Sertifikat' : 'Pilih & Crop Foto Sertifikat'}</span>
                  </button>
                  {certForm.imageMeta && <span className="text-[11px] text-emerald-400">{certForm.imageMeta}</span>}
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Judul Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="Contoh: Sertifikat Magang Web UI/UX Developer"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Penerbit / Instansi / Penyelenggara *</label>
                <input
                  type="text"
                  required
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  placeholder="Contoh: PT Vinix Seven Aurum (VINIX7)"
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Kategori Sertifikat</label>
                  <select
                    value={certForm.category}
                    onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                  >
                    <option value="Magang">Magang (Internship)</option>
                    <option value="Seminar / Webinar">Seminar / Webinar</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Pelatihan Skill">Pelatihan Skill</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Workshop & Kursus">Workshop &amp; Kursus</option>
                    <option value="Sertifikasi Profesi">Sertifikasi Profesi</option>
                    <option value="Kerja / Teknis">Kerja / Teknis</option>
                    <option value="Penghargaan">Penghargaan / Lomba</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Bulan &amp; Tahun Terbit</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="Contoh: November 2026"
                    className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                  />
                </div>
              </div>

              {/* Hubungkan ke Pengalaman Kerja / Magang */}
              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">
                  Hubungkan ke Pengalaman Kerja / Magang (Opsional)
                </label>
                <select
                  value={certForm.experienceId}
                  onChange={(e) => setCertForm({ ...certForm, experienceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                >
                  <option value="">-- Tidak dihubungkan ke pengalaman spesifik --</option>
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.company} — {exp.role} ({exp.period})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#938878] mt-1">
                  Jika dihubungkan, tombol "Lihat Sertifikat" otomatis muncul di kartu Rekam Jejak pengalaman tersebut.
                </p>
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">URL Verifikasi Kredensial (Opsional)</label>
                <input
                  type="url"
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Deskripsi / Catatan Capaian (Opsional)</label>
                <textarea
                  rows="3"
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="Penjelasan singkat capaian sertifikat ini..."
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm resize-none focus:border-[#DC2626] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : editingCertId ? 'Simpan Perubahan' : 'Tambahkan Sertifikat'}</span>
              </button>
            </form>

            {/* List Sertifikat */}
            <div className="lg:col-span-7 space-y-4">
              {certificates.map((cert) => {
                const linkedExp = experiences.find((x) => String(x.id) === String(cert.experienceId) || x.id === cert.experienceId);
                return (
                  <article key={cert.id} className="bg-[#181615] border border-[#302A26] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-40 aspect-[16/10] rounded-xl overflow-hidden bg-[#100F0E]/90 border border-[#302A26] shrink-0 flex items-center justify-center p-1.5">
                      {cert.imageUrl ? (
                        <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <div className="text-center p-2">
                          <Award className="w-6 h-6 text-amber-500/50 mx-auto mb-1" />
                          <span className="text-[10px] text-[#938878] block">Preview Mockup</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCertificateCategoryStyle(cert.category).badgeClass}`}>
                              {cert.category}
                            </span>
                            {linkedExp && (
                              <span className="text-[10px] text-[#EF4444] bg-[#DC2626]/10 border border-[#DC2626]/30 px-2 py-0.5 rounded-full font-mono-code">
                                Terkait: {linkedExp.company}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-base">{cert.title}</h3>
                          <p className="text-xs text-[#EF4444]">{cert.issuer}</p>
                          <p className="text-[11px] text-[#C2B8A7]">{cert.issueDate}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewCert(cert)}
                            className="p-1.5 rounded-lg border border-[#302A26] hover:border-amber-400 text-amber-300"
                            title="Pratinjau Sertifikat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCertId(cert.id);
                              setCertForm({
                                title: cert.title,
                                issuer: cert.issuer,
                                category: cert.category || 'Magang',
                                issueDate: cert.issueDate || '',
                                credentialUrl: cert.credentialUrl || '',
                                experienceId: cert.experienceId || '',
                                description: cert.description || '',
                                imageUrl: cert.imageUrl || '',
                                imageBlob: null,
                                imageMeta: cert.imageUrl ? 'Tersimpan di Cloudinary' : '',
                              });
                            }}
                            className="p-1.5 rounded-lg border border-[#302A26] hover:border-[#DC2626] text-[#D6CEBF]"
                            title="Edit Sertifikat"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert)}
                            className="p-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/15 text-rose-400"
                            title="Hapus Sertifikat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {cert.description && (
                        <p className="text-xs text-[#C2B8A7] line-clamp-2">{cert.description}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form onSubmit={handleSaveSkill} className="lg:col-span-5 bg-[#181615] border border-[#302A26] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-editorial text-xl text-[#EDE6D6]">{editingSkillId ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}</h2>
                {editingSkillId && (
                  <button type="button" onClick={resetSkillForm} className="text-xs text-[#C2B8A7] hover:text-[#EF4444]">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Tipe: Hard Skill vs Soft Skill */}
              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1.5">Kategori Utama *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSkillForm({
                        ...skillForm,
                        category: 'hard',
                        groupName: skillForm.category === 'soft' ? 'Web UI/UX & ML' : skillForm.groupName,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      skillForm.category === 'hard'
                        ? 'bg-[#DC2626]/20 border-[#DC2626]/60 text-[#FCA5A5] shadow-sm'
                        : 'bg-[#100F0E] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6]'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Hard Skill (Teknis)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSkillForm({
                        ...skillForm,
                        category: 'soft',
                        groupName: skillForm.category === 'hard' ? 'Problem Solving & Analisis' : skillForm.groupName,
                      });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      skillForm.category === 'soft'
                        ? 'bg-[#DC2626]/20 border-[#DC2626]/60 text-[#FCA5A5] shadow-sm'
                        : 'bg-[#100F0E] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6]'
                    }`}
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Soft Skill (Interpersonal)</span>
                  </button>
                </div>
              </div>

              {/* Grup / Kelompok Keahlian */}
              <div className="space-y-1.5">
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7]">Grup / Kelompok Keahlian *</label>
                <input
                  type="text"
                  required
                  value={skillForm.groupName}
                  onChange={(e) => setSkillForm({ ...skillForm, groupName: e.target.value })}
                  placeholder="Contoh: Web UI/UX & ML, Programming Languages..."
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-[#938878] block w-full">Pilihan Cepat Grup:</span>
                  {(skillForm.category === 'hard'
                    ? ['Web UI/UX & ML', 'Programming Languages', 'IoT & Embedded', 'Database, Cloud & IT']
                    : ['Problem Solving & Analisis', 'Komunikasi & Tim', 'Manajemen & Kerja Profesional']
                  ).map((grp) => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSkillForm({ ...skillForm, groupName: grp })}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                        skillForm.groupName === grp
                          ? 'bg-[#DC2626]/20 border-[#DC2626]/50 text-[#FCA5A5]'
                          : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6]'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Keahlian */}
              <div>
                <label className="block font-mono-code text-xs font-semibold text-[#C2B8A7] mb-1">Nama Keahlian / Kemampuan *</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="Contoh: Python, Web UI/UX, Troubleshooting..."
                  className="w-full px-3 py-2 rounded-xl bg-[#100F0E] border border-[#302A26] text-sm focus:border-[#DC2626] outline-none"
                />
              </div>

              {/* Tingkat Penguasaan (Disimpan ke ratePoint tanpa progress bar persen) */}
              <div className="p-4 rounded-xl bg-[#100F0E] border border-[#302A26] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-mono-code text-xs font-semibold text-[#C2B8A7] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Tingkat Penguasaan</span>
                  </label>
                  <span className={`font-mono-code text-[11px] font-semibold px-2.5 py-0.5 rounded border ${getSkillRatingLabel(skillForm.ratePoint).badgeClass}`}>
                    {getSkillRatingLabel(skillForm.ratePoint).label.split('/')[0].trim()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Intermediate', val: 70 },
                    { label: 'Proficient', val: 80 },
                    { label: 'Advanced', val: 88 },
                    { label: 'Expert', val: 95 },
                  ].map((tier) => {
                    const currentTier = getSkillRatingLabel(skillForm.ratePoint).label.split('/')[0].trim();
                    const active = currentTier === tier.label;
                    return (
                      <button
                        key={tier.label}
                        type="button"
                        onClick={() => setSkillForm({ ...skillForm, ratePoint: tier.val })}
                        className={`py-2 px-2.5 rounded-lg font-mono-code text-[11px] font-semibold border transition-colors ${
                          active
                            ? 'bg-[#DC2626] text-white border-[#DC2626]'
                            : 'bg-[#1C1917] border-[#302A26] text-[#C2B8A7] hover:text-[#EDE6D6]'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="font-mono-code text-[11px] text-[#938878]">
                    Skor Internal Database (1–100):
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={skillForm.ratePoint}
                    onChange={(e) => setSkillForm({ ...skillForm, ratePoint: Math.min(100, Math.max(1, Number(e.target.value))) })}
                    className="w-20 px-2.5 py-1 rounded-lg bg-[#1C1917] border border-[#302A26] font-mono-code text-xs font-bold text-center text-[#EDE6D6] focus:border-[#DC2626] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : editingSkillId ? 'Simpan Perubahan' : 'Tambahkan Keahlian'}</span>
              </button>
            </form>

            {/* List Keahlian */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#181615] border border-[#302A26]">
                <div className="inline-flex gap-1 p-1 bg-[#100F0E] rounded-xl border border-[#302A26]">
                  <button
                    type="button"
                    onClick={() => setSkillFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      skillFilterTab === 'all' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
                    }`}
                  >
                    Semua ({skills.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillFilterTab('hard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      skillFilterTab === 'hard' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
                    }`}
                  >
                    Hard Skills ({skills.filter((s) => s.category === 'hard').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillFilterTab('soft')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      skillFilterTab === 'soft' ? 'bg-[#DC2626] text-white' : 'text-[#C2B8A7] hover:text-[#EDE6D6]'
                    }`}
                  >
                    Soft Skills ({skills.filter((s) => s.category === 'soft').length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {skills
                  .filter((s) => skillFilterTab === 'all' || s.category === skillFilterTab)
                  .map((skill) => {
                    const ratingInfo = getSkillRatingLabel(skill.ratePoint);
                    return (
                      <article key={skill.id} className="bg-[#181615] border border-[#302A26] rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                skill.category === 'hard'
                                  ? 'bg-[#DC2626]/15 text-[#EF4444] border-[#DC2626]/35'
                                  : 'bg-[#DC2626]/15 text-[#FCA5A5] border-[#DC2626]/35'
                              }`}>
                                {skill.category === 'hard' ? 'Hard Skill' : 'Soft Skill'}
                              </span>
                              <span className="text-[11px] text-[#C2B8A7] bg-[#1C1917] border border-[#302A26] px-2 py-0.5 rounded-full">
                                {skill.groupName}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ratingInfo.badgeClass}`}>
                                {ratingInfo.label.split('/')[0].trim()}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm sm:text-base text-[#EDE6D6]">{skill.name}</h3>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSkillId(skill.id);
                                setSkillForm({
                                  name: skill.name,
                                  category: skill.category || 'hard',
                                  groupName: skill.groupName || 'Umum',
                                  ratePoint: Number(skill.ratePoint) || 85,
                                  sortOrder: Number(skill.sortOrder) || 0,
                                });
                              }}
                              className="p-1.5 rounded-lg border border-[#302A26] hover:border-[#DC2626] text-[#D6CEBF]"
                              title="Edit Keahlian"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill)}
                              className="p-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/15 text-rose-400"
                              title="Hapus Keahlian"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Ringkasan Tingkat Penguasaan berbasis teks (selaras tampilan baru) */}
                        <div className="pt-2 border-t border-[#302A26] flex items-center justify-between text-xs font-mono-code">
                          <span className="text-[#C2B8A7]">Tingkat Penguasaan</span>
                          <span className="font-semibold text-[#EDE6D6]">
                            {ratingInfo.label.split('/')[0].trim()} (Skor {skill.ratePoint})
                          </span>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>

      {cropperTarget && (
        <ImageCropperModal
          aspect={cropperTarget === 'profile' ? 4 / 3 : cropperTarget === 'certificate' ? 4 / 3 : 16 / 9}
          initialLabel={
            cropperTarget === 'profile'
              ? '4:3 Profil'
              : cropperTarget === 'certificate'
              ? 'Foto / Scan Sertifikat'
              : '16:9 Proyek'
          }
          onApply={({ dataUrl, blob, width, height, approxKb }) => {
            if (cropperTarget === 'profile') {
              setProfileForm((prev) => ({
                ...prev,
                photoUrl: dataUrl,
                photoBlob: blob,
                photoMeta: `${width}×${height} WebP (~${approxKb} KB)`,
              }));
            } else if (cropperTarget === 'certificate') {
              setCertForm((prev) => ({
                ...prev,
                imageUrl: dataUrl,
                imageBlob: blob,
                imageMeta: `${width}×${height} WebP (~${approxKb} KB)`,
              }));
            } else {
              setProjForm((prev) => ({
                ...prev,
                imageUrl: dataUrl,
                imageBlob: blob,
                imageMeta: `${width}×${height} WebP (~${approxKb} KB)`,
              }));
            }
            setCropperTarget(null);
            notify(`Foto siap diunggah (${width}×${height} WebP ~${approxKb} KB).`);
          }}
          onClose={() => setCropperTarget(null)}
        />
      )}

      <CvModal
        open={cvPreviewOpen}
        onClose={() => setCvPreviewOpen(false)}
        profile={{
          ...PROFILE,
          photoUrl: profileForm.photoUrl,
          role: profileForm.role,
          bio: profileForm.bio,
          email: profileForm.email || PROFILE.email,
          whatsappDisplay: profileForm.whatsapp || PROFILE.whatsappDisplay,
          socials: [
            { id: 'github', label: 'GitHub', url: profileForm.githubUrl || PROFILE.githubUrl },
            { id: 'linkedin', label: 'LinkedIn', url: profileForm.linkedinUrl },
            { id: 'instagram', label: 'Instagram', url: profileForm.instagramUrl || 'https://instagram.com/fpratamaputra' },
            { id: 'tiktok', label: 'TikTok', url: profileForm.tiktokUrl },
          ],
        }}
        experiences={experiences}
        projects={projects}
      />

      <CertificateModal
        certificate={previewCert}
        onClose={() => setPreviewCert(null)}
      />

      <ConfirmActionModal
        action={pendingAction}
        loading={loading}
        onCancel={() => {
          if (!loading) setPendingAction(null);
        }}
      />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1C1917] text-white text-sm font-medium shadow-xl border border-[#DC2626]/45">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
