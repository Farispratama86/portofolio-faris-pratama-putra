import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Crop, Image as ImageIcon, Move, RotateCcw, Upload, ZoomIn } from 'lucide-react';

export default function ImageCropperModal({ aspect = 16 / 9, initialLabel = '16:9 Proyek', onApply, onClose }) {
  const [imageSrc, setImageSrc] = useState('');
  const [imgObj, setImgObj] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [ratioMode, setRatioMode] = useState(aspect === 16 / 9 ? '16:9' : '4:3');
  const canvasRef = useRef(null);

  // Output resolusi tinggi: 4:3 → 2000×1500, 16:9 → 1920×1080
  const targetWidth = ratioMode === '16:9' ? 1920 : 2000;
  const targetHeight = ratioMode === '16:9' ? 1080 : 1500;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#090f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!imgObj) return;

    const baseScale = Math.max(canvas.width / imgObj.width, canvas.height / imgObj.height);
    const scale = baseScale * zoom;
    const drawW = imgObj.width * scale;
    const drawH = imgObj.height * scale;
    const x = (canvas.width - drawW) / 2 + offset.x;
    const y = (canvas.height - drawH) / 2 + offset.y;

    ctx.drawImage(imgObj, x, y, drawW, drawH);

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo((canvas.width * 2) / 3, 0);
    ctx.lineTo((canvas.width * 2) / 3, canvas.height);
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, (canvas.height * 2) / 3);
    ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
    ctx.stroke();
  }, [imgObj, zoom, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, ratioMode]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      const img = new window.Image();
      img.onload = () => {
        setImgObj(img);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e) => {
    if (!imgObj) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const exportCropped = () => {
    if (!imgObj) return;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = targetWidth;
    outCanvas.height = targetHeight;
    const ctx = outCanvas.getContext('2d');
    ctx.fillStyle = '#090f1d';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Aktifkan image smoothing kualitas tinggi agar hasil crop tajam & presisi
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const previewCanvas = canvasRef.current;
    const ratioX = targetWidth / previewCanvas.width;
    const ratioY = targetHeight / previewCanvas.height;
    const baseScale = Math.max(targetWidth / imgObj.width, targetHeight / imgObj.height);
    const scale = baseScale * zoom;
    const drawW = imgObj.width * scale;
    const drawH = imgObj.height * scale;
    const x = (targetWidth - drawW) / 2 + offset.x * ratioX;
    const y = (targetHeight - drawH) / 2 + offset.y * ratioY;

    ctx.drawImage(imgObj, x, y, drawW, drawH);

    const dataUrl = outCanvas.toDataURL('image/webp', 0.95);
    const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);

    outCanvas.toBlob(
      (blob) => {
        onApply({ dataUrl, blob, width: targetWidth, height: targetHeight, approxKb });
      },
      'image/webp',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100">Editor Crop &amp; Zoom Foto ({initialLabel})</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700 hover:border-slate-500"
          >
            Tutup
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih Foto dari Perangkat</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {['16:9', '4:3'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRatioMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    ratioMode === mode ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-950 select-none ${
              imgObj ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            <canvas
              ref={canvasRef}
              width={ratioMode === '16:9' ? 640 : 560}
              height={ratioMode === '16:9' ? 360 : 420}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={() => setDragging(false)}
              onPointerLeave={() => setDragging(false)}
              className="w-full h-auto block"
            />
            {!imageSrc && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Pilih foto proyek atau profil Anda</p>
                <p className="text-xs text-slate-500 mt-1">
                  Foto akan otomatis dipotong sesuai rasio {ratioMode} dan dikonversi ke WebP sebelum diunggah ke Cloudinary.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 flex-1">
              <ZoomIn className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-xs text-slate-400 w-16">Zoom {zoom.toFixed(1)}x</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                disabled={!imgObj}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!imgObj}
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                disabled={!imgObj}
                onClick={exportCropped}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terapkan Crop WebP</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 inline-flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-sky-400" /> Seret gambar di atas kanvas untuk menyesuaikan posisi
          </div>
        </div>
      </div>
    </div>
  );
}
