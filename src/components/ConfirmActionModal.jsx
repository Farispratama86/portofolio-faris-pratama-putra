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
    badgeClass: 'bg-[#DC2626]/15 text-[#EF4444] border-[#DC2626]/35',
    iconBoxClass: 'bg-[#DC2626]/15 text-[#EF4444] border-[#DC2626]/35',
    buttonClass: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-lg shadow-[#DC2626]/20',
    accentBorder: 'border-[#DC2626]/35',
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
      className="fixed inset-0 z-50 bg-[#100F0E]/90 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
    >
      <div className={`bg-[#181615] border ${cfg.accentBorder} rounded-2xl max-w-md w-full overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#302A26] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cfg.iconBoxClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.badgeClass}`}>
                Verifikasi 2 Langkah · {cfg.badge}
              </span>
              <h3 id="confirm-action-title" className="font-bold text-sm sm:text-base text-[#EDE6D6] mt-0.5">
                {cfg.titlePrefix} {action.entityLabel}
              </h3>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#C2B8A7] hover:text-[#EDE6D6] border border-[#302A26] hover:border-[#302A26] disabled:opacity-40"
            aria-label="Tutup konfirmasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Preview item yang akan diproses */}
          <div className="rounded-xl bg-[#100F0E]/90 border border-[#302A26] p-3.5 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#938878]">
              Target {action.entityLabel}
            </p>
            <p className="font-bold text-sm text-[#EDE6D6] break-words">
              {action.itemName || '(Tanpa Judul)'}
            </p>
            {action.itemSubtitle && (
              <p className="text-xs text-[#C2B8A7] break-words">{action.itemSubtitle}</p>
            )}
          </div>

          {/* Info konsekuensi */}
          <div className="flex items-start gap-2.5 text-xs text-[#D6CEBF] leading-relaxed">
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
                ? 'bg-[#1C1917] border-[#DC2626]/50 text-[#EDE6D6]'
                : 'bg-[#100F0E]/80 border-[#302A26] hover:border-[#302A26] text-[#D6CEBF]'
            }`}
          >
            <input
              type="checkbox"
              checked={acknowledged}
              disabled={loading}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#DC2626] shrink-0 cursor-pointer"
            />
            <span className="text-xs leading-relaxed font-medium">
              {cfg.checkboxText}
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#100F0E]/80 border-t border-[#302A26] flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-[#302A26] hover:border-[#574D46] text-xs sm:text-sm font-semibold text-[#D6CEBF] disabled:opacity-40"
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
