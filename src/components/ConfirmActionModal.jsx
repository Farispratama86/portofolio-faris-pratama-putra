import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Edit3, PlusCircle, ShieldAlert, Trash2, X } from 'lucide-react';

const ACTION_CONFIG = {
  create: {
    badge: 'Tambah Data Baru',
    titlePrefix: 'Konfirmasi Penambahan',
    confirmLabel: 'Ya, Tambahkan Sekarang',
    checkboxText: 'Saya sudah memeriksa data di atas dan yakin ingin menambahkannya ke database.',
    description: 'Data baru akan langsung disimpan ke database TiDB Cloud dan ditampilkan di portofolio.',
    icon: PlusCircle,
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    iconBoxClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
    accentBorder: 'border-emerald-500/30',
  },
  update: {
    badge: 'Simpan Perubahan',
    titlePrefix: 'Konfirmasi Perubahan',
    confirmLabel: 'Ya, Simpan Perubahan',
    checkboxText: 'Saya sudah memeriksa perubahan di atas dan yakin ingin memperbarui data ini.',
    description: 'Data yang sudah ada di database akan diperbarui sesuai perubahan yang Anda isi.',
    icon: Edit3,
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    iconBoxClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    buttonClass: 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20',
    accentBorder: 'border-sky-500/30',
  },
  delete: {
    badge: 'Hapus Permanen',
    titlePrefix: 'Konfirmasi Penghapusan',
    confirmLabel: 'Ya, Hapus Permanen',
    checkboxText: 'Saya sadar tindakan ini permanen dan yakin ingin menghapus data ini.',
    description: 'Data yang dihapus tidak dapat dipulihkan kembali dari database.',
    icon: Trash2,
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    iconBoxClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20',
    accentBorder: 'border-rose-500/30',
  },
};

export default function ConfirmActionModal({ action, loading = false, onCancel }) {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setAcknowledged(false);
  }, [action]);

  useEffect(() => {
    if (!action) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [action, loading, onCancel]);

  if (!action) return null;

  const cfg = ACTION_CONFIG[action.type] || ACTION_CONFIG.update;
  const Icon = cfg.icon;

  const handleConfirm = async () => {
    if (!acknowledged || loading) return;
    await action.onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
    >
      <div className={`bg-[#111a2e] border ${cfg.accentBorder} rounded-2xl max-w-md w-full overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cfg.iconBoxClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.badgeClass}`}>
                Verifikasi 2 Langkah · {cfg.badge}
              </span>
              <h3 id="confirm-action-title" className="font-bold text-sm sm:text-base text-slate-100 mt-0.5">
                {cfg.titlePrefix} {action.entityLabel}
              </h3>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 disabled:opacity-40"
            aria-label="Tutup konfirmasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Preview item yang akan diproses */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Target {action.entityLabel}
            </p>
            <p className="font-bold text-sm text-slate-100 break-words">
              {action.itemName || '(Tanpa Judul)'}
            </p>
            {action.itemSubtitle && (
              <p className="text-xs text-slate-400 break-words">{action.itemSubtitle}</p>
            )}
          </div>

          {/* Info konsekuensi */}
          <div className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
            {action.type === 'delete' ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <p>{action.description || cfg.description}</p>
          </div>

          {/* Langkah ke-2: Checkbox persetujuan wajib untuk cegah salah pencet */}
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all select-none ${
              acknowledged
                ? 'bg-slate-900 border-sky-500/50 text-slate-100'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={acknowledged}
              disabled={loading}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-sky-500 shrink-0 cursor-pointer"
            />
            <span className="text-xs leading-relaxed font-medium">
              {cfg.checkboxText}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-xs sm:text-sm font-semibold text-slate-300 disabled:opacity-40"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!acknowledged || loading}
            onClick={handleConfirm}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${cfg.buttonClass}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Memproses...' : cfg.confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
