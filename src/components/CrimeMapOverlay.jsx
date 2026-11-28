import React, { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const MAP_NODES = [
  { id: 'beranda', side: 'right', code: 'PIN #01', labelKey: 'map.pin1' },
  { id: 'pengalaman', side: 'left', code: 'PIN #02', labelKey: 'map.pin2' },
  { id: 'proyek', side: 'right', code: 'PIN #03', labelKey: 'map.pin3' },
  { id: 'sertifikat', side: 'left', code: 'PIN #04', labelKey: 'map.pin4' },
  { id: 'keahlian', side: 'right', code: 'PIN #05', labelKey: 'map.pin5' },
  { id: 'kontak', side: 'left', code: 'PIN #06', labelKey: 'map.pin6' },
];

export default function CrimeMapOverlay({ enabled = true, containerRef, triggerKey }) {
  const { t } = useLanguage();
  const [layout, setLayout] = useState({ width: 0, height: 0, points: [] });

  const measurePositions = useCallback(() => {
    const container = containerRef?.current;
    if (!container) return;

    const cRect = container.getBoundingClientRect();
    const width = container.clientWidth;
    const height = container.scrollHeight;
    if (!width || !height) return;

    // Tempatkan pin di margin kiri/kanan di luar area kontainer utama agar rapi
    const gutter = Math.max(24, (width - 1220) / 2 - 14);
    const leftX = width >= 1280 ? Math.min(gutter, 92) : 22;
    const rightX = width - leftX;

    const points = MAP_NODES.map((node) => {
      const el = document.getElementById(node.id);
      if (!el) return null;
      const eRect = el.getBoundingClientRect();
      const topRel = eRect.top - cRect.top;
      const y = Math.max(48, Math.round(topRel + 64));
      const x = Math.round(node.side === 'right' ? rightX : leftX);
      return {
        ...node,
        x,
        y,
      };
    }).filter(Boolean);

    setLayout({ width, height, points });
  }, [containerRef]);

  useEffect(() => {
    if (!enabled) return undefined;

    const rafId = window.requestAnimationFrame(measurePositions);
    const timerId = window.setTimeout(measurePositions, 160);

    window.addEventListener('resize', measurePositions, { passive: true });
    let observer = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef?.current) {
      observer = new ResizeObserver(measurePositions);
      observer.observe(containerRef.current);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.removeEventListener('resize', measurePositions);
      if (observer) observer.disconnect();
    };
  }, [enabled, measurePositions, triggerKey, containerRef]);

  if (!enabled || layout.points.length < 2 || layout.width === 0) {
    return null;
  }

  // Buat path zig-zag benang merah sedikit melengkung alami antar pin
  const pathSegments = [];
  for (let i = 0; i < layout.points.length - 1; i += 1) {
    const a = layout.points[i];
    const b = layout.points[i + 1];
    const midX = (a.x + b.x) / 2;
    const sag = 34;
    const midY = (a.y + b.y) / 2 + sag;
    pathSegments.push(`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`);
  }
  const threadPath = pathSegments.join(' ');

  return (
    <div
      className="hidden md:block absolute inset-0 pointer-events-none select-none z-[3] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        width={layout.width}
        height={layout.height}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="w-full h-full"
      >
        <defs>
          <filter id="thread-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Bayangan tipis + Benang merah investigasi zig-zag */}
        <path
          d={threadPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.75"
          strokeOpacity="0.62"
          strokeDasharray="7 5"
          filter="url(#thread-shadow)"
        />

        {/* Pin merah/kuningan di tiap seksi */}
        {layout.points.map((pt) => {
          const isRight = pt.side === 'right';
          const label = `${pt.code} · ${t(pt.labelKey)}`;
          const badgeOffsetX = isRight ? -16 : 16;

          return (
            <g key={pt.id} transform={`translate(${pt.x}, ${pt.y})`}>
              {/* Halo pin */}
              <circle r="13" fill="var(--accent)" fillOpacity="0.14" />
              {/* Kepala pin kuningan & inti merah */}
              <circle
                r="6.5"
                fill="var(--pin-brass)"
                stroke="var(--bg-page)"
                strokeWidth="1.5"
              />
              <circle r="3" fill="var(--accent)" />
              <circle cx="-1.5" cy="-1.5" r="1" fill="#FEF3C7" fillOpacity="0.85" />

              {/* Label micro-tag hanya di layar xl ke atas agar tidak bertabrakan dengan kontainer */}
              <g className="hidden xl:inline">
                <text
                  x={badgeOffsetX}
                  y="3"
                  textAnchor={isRight ? 'end' : 'start'}
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="0.06em"
                >
                  {label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
