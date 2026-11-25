/**
 * SectionDecorations.jsx
 * Tema: Nature & Mountain Explorer — "Alpine Developer"
 *
 * Semua dekorasi adalah inline SVG ringan.
 * Setiap komponen memiliki:
 *   - pointer-events-none select-none z-0
 *   - Siluet gunung/alam yang terlihat di mobile (opacity rendah)
 *   - Aksesori kiri-kanan hanya muncul di xl+ (hidden xl:block)
 */

/* ─────────────────────────────────────────────────────────── */
/* 1. BERANDA — Basecamp Pegunungan                           */
/* ─────────────────────────────────────────────────────────── */
export function BerandaDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Siluet gunung berlapis (mobile-visible) */}
      <svg
        className="alpine-deco-svg absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 220"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Layer belakang — gunung jauh */}
        <path
          d="M0,180 L200,80 L360,140 L520,50 L700,120 L860,30 L1040,110 L1200,60 L1440,100 L1440,220 L0,220Z"
          fill="rgba(148,163,184,0.07)"
        />
        {/* Layer tengah */}
        <path
          d="M0,200 L150,130 L320,170 L480,100 L660,160 L820,80 L1000,140 L1180,90 L1340,150 L1440,120 L1440,220 L0,220Z"
          fill="rgba(148,163,184,0.09)"
        />
        {/* Layer depan — lebih gelap */}
        <path
          d="M0,220 L180,165 L380,195 L560,145 L740,185 L920,135 L1100,175 L1280,150 L1440,170 L1440,220Z"
          fill="rgba(148,163,184,0.11)"
        />
      </svg>

      {/* Bintang kelap-kelip */}
      {[
        { cx: '8%',  cy: '12%', r: 2,   delay: '' },
        { cx: '18%', cy: '7%',  r: 1.5, delay: 'animate-twinkle-delay-1' },
        { cx: '30%', cy: '15%', r: 2,   delay: 'animate-twinkle-delay-2' },
        { cx: '55%', cy: '5%',  r: 1.5, delay: 'animate-twinkle-delay-3' },
        { cx: '72%', cy: '10%', r: 2,   delay: '' },
        { cx: '85%', cy: '6%',  r: 1.5, delay: 'animate-twinkle-delay-1' },
        { cx: '92%', cy: '14%', r: 2,   delay: 'animate-twinkle-delay-4' },
        { cx: '42%', cy: '9%',  r: 1,   delay: 'animate-twinkle-delay-2' },
      ].map((s, i) => (
        <div
          key={i}
          className={`absolute animate-twinkle ${s.delay}`}
          style={{ left: s.cx, top: s.cy }}
        >
          <svg width={s.r * 6} height={s.r * 6} viewBox="0 0 12 12" aria-hidden="true">
            <circle cx="6" cy="6" r={s.r + 1} fill="rgba(186,230,253,0.7)" />
          </svg>
        </div>
      ))}

      {/* Tenda kemah bercahaya — kiri bawah (xl+) */}
      <div className="hidden xl:block absolute left-6 bottom-16 animate-float-slow">
        <svg width="110" height="90" viewBox="0 0 110 90" aria-hidden="true" className="alpine-deco-svg">
          {/* Tenda tubuh */}
          <polygon points="55,5 5,80 105,80" fill="rgba(30,58,138,0.55)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          {/* Cahaya jendela amber */}
          <ellipse cx="55" cy="62" rx="10" ry="8" fill="rgba(251,191,36,0.35)" />
          <line x1="55" y1="5" x2="55" y2="0" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" />
          {/* Tali pengikat */}
          <line x1="5" y1="80" x2="0" y2="90" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
          <line x1="105" y1="80" x2="110" y2="90" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
          {/* Cahaya ambient bawah tenda */}
          <ellipse cx="55" cy="82" rx="30" ry="6" fill="rgba(251,191,36,0.1)" />
          {/* Pintu tenda */}
          <path d="M45,80 Q55,55 65,80Z" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
        </svg>
      </div>

      {/* Pendaki dengan laptop — kanan bawah (xl+) */}
      <div className="hidden xl:block absolute right-6 bottom-14 animate-float-slow-delay">
        <svg width="80" height="110" viewBox="0 0 80 110" aria-hidden="true" className="alpine-deco-svg">
          {/* Kepala */}
          <circle cx="40" cy="14" r="10" fill="rgba(226,232,240,0.5)" />
          {/* Helm */}
          <path d="M30,13 Q40,2 50,13" fill="rgba(56,189,248,0.4)" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
          {/* Badan */}
          <rect x="30" y="24" width="20" height="28" rx="4" fill="rgba(71,85,105,0.6)" />
          {/* Tas punggung */}
          <rect x="18" y="24" width="12" height="22" rx="3" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
          {/* Kaki */}
          <line x1="36" y1="52" x2="33" y2="78" stroke="rgba(71,85,105,0.5)" strokeWidth="4" strokeLinecap="round" />
          <line x1="44" y1="52" x2="47" y2="78" stroke="rgba(71,85,105,0.5)" strokeWidth="4" strokeLinecap="round" />
          {/* Sepatu */}
          <ellipse cx="33" cy="80" rx="6" ry="3" fill="rgba(51,65,85,0.6)" />
          <ellipse cx="47" cy="80" rx="6" ry="3" fill="rgba(51,65,85,0.6)" />
          {/* Laptop di tangan */}
          <rect x="49" y="35" width="20" height="13" rx="2" fill="rgba(15,23,42,0.7)" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
          <rect x="50" y="36" width="18" height="10" rx="1" fill="rgba(56,189,248,0.15)" />
          {/* Layar laptop glowing */}
          <line x1="52" y1="38" x2="66" y2="38" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
          <line x1="52" y1="40" x2="62" y2="40" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
          <line x1="52" y1="42" x2="64" y2="42" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
          {/* Tongkat pendaki */}
          <line x1="28" y1="34" x2="10" y2="90" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 2. PENGALAMAN — Jejak Pendakian                            */
/* ─────────────────────────────────────────────────────────── */
export function PengalamanDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Siluet bukit tipis */}
      <svg
        className="alpine-deco-svg absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 160"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,120 Q200,70 400,100 Q600,130 800,80 Q1000,30 1200,90 Q1320,120 1440,80 L1440,160 L0,160Z"
          fill="rgba(148,163,184,0.06)"
        />
        <path
          d="M0,145 Q180,110 400,130 Q650,155 900,120 Q1100,95 1300,130 Q1380,145 1440,135 L1440,160 L0,160Z"
          fill="rgba(148,163,184,0.08)"
        />
      </svg>

      {/* Jalur pendakian putus-putus (diagonal, hanya background halus) */}
      <svg
        className="alpine-deco-svg absolute inset-0 w-full h-full"
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M200,580 Q350,420 500,340 Q650,260 800,180 Q950,100 1100,80"
          fill="none"
          stroke="rgba(148,163,184,0.1)"
          strokeWidth="2.5"
          strokeDasharray="10,8"
          className="animate-trail-dash"
        />
        <path
          d="M400,580 Q520,470 660,390 Q800,310 940,230 Q1080,150 1200,120"
          fill="none"
          stroke="rgba(148,163,184,0.06)"
          strokeWidth="2"
          strokeDasharray="8,10"
        />
      </svg>

      {/* Papan penunjuk jalur kayu — kiri (xl+) */}
      <div className="hidden xl:block absolute left-5 top-1/2 -translate-y-1/2 animate-float-slow">
        <svg width="80" height="130" viewBox="0 0 80 130" aria-hidden="true" className="alpine-deco-svg">
          {/* Tiang kayu */}
          <rect x="37" y="30" width="6" height="95" rx="2" fill="rgba(120,86,54,0.6)" />
          {/* Papan atas */}
          <rect x="2" y="12" width="66" height="22" rx="3" fill="rgba(120,86,54,0.5)" stroke="rgba(180,120,70,0.4)" strokeWidth="1.5" />
          <text x="35" y="27" textAnchor="middle" fill="rgba(226,232,240,0.6)" fontSize="8" fontFamily="monospace">KARIER →</text>
          {/* Papan bawah (mengarah lain) */}
          <rect x="12" y="40" width="60" height="20" rx="3" fill="rgba(100,70,40,0.5)" stroke="rgba(180,120,70,0.35)" strokeWidth="1.5" />
          <text x="42" y="53" textAnchor="middle" fill="rgba(186,230,253,0.5)" fontSize="7" fontFamily="monospace">PROYEK ↗</text>
          {/* Tanah */}
          <ellipse cx="40" cy="126" rx="18" ry="4" fill="rgba(100,70,40,0.3)" />
        </svg>
      </div>

      {/* Kompas/teropong — kanan (xl+) */}
      <div className="hidden xl:block absolute right-5 top-1/2 -translate-y-1/2 animate-float-slow-delay">
        <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true" className="alpine-deco-svg">
          {/* Lingkaran kompas luar */}
          <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="2" />
          <circle cx="45" cy="45" r="30" fill="rgba(15,23,42,0.4)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
          {/* Jarum kompas */}
          <polygon points="45,20 42,45 45,50 48,45" fill="rgba(239,68,68,0.7)" />
          <polygon points="45,70 42,45 45,40 48,45" fill="rgba(226,232,240,0.5)" />
          {/* Titik tengah */}
          <circle cx="45" cy="45" r="3" fill="rgba(226,232,240,0.7)" />
          {/* Label N,S,E,W */}
          <text x="45" y="14"  textAnchor="middle" fill="rgba(186,230,253,0.5)" fontSize="7" fontFamily="monospace">N</text>
          <text x="45" y="80"  textAnchor="middle" fill="rgba(186,230,253,0.5)" fontSize="7" fontFamily="monospace">S</text>
          <text x="80" y="48"  textAnchor="middle" fill="rgba(186,230,253,0.5)" fontSize="7" fontFamily="monospace">E</text>
          <text x="10" y="48"  textAnchor="middle" fill="rgba(186,230,253,0.5)" fontSize="7" fontFamily="monospace">W</text>
        </svg>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 3. PROYEK — Lembah Pinus & IoT                             */
/* ─────────────────────────────────────────────────────────── */
export function ProyekDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Kabut gradien lembut di bawah */}
      <div
        className="absolute bottom-0 left-0 w-full h-32"
        style={{ background: 'linear-gradient(to top, rgba(56,189,248,0.04), transparent)' }}
      />

      {/* Siluet pohon pinus bawah */}
      <svg
        className="alpine-deco-svg absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Hutan pinus */}
        {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120, 1200, 1280, 1360].map((x, i) => {
          const h = 80 + (i % 5) * 18;
          const w = 32 + (i % 3) * 10;
          const opacity = 0.07 + (i % 4) * 0.02;
          return (
            <g key={i}>
              {/* Batang */}
              <rect x={x + w / 2 - 2} y={180 - h * 0.25} width="4" height={h * 0.25} fill={`rgba(120,86,54,${opacity * 1.5})`} />
              {/* Mahkota pohon (3 segitiga) */}
              <polygon points={`${x + w / 2},${180 - h} ${x},${180 - h * 0.5} ${x + w},${180 - h * 0.5}`} fill={`rgba(34,197,94,${opacity})`} />
              <polygon points={`${x + w / 2},${180 - h * 0.65} ${x + 4},${180 - h * 0.3} ${x + w - 4},${180 - h * 0.3}`} fill={`rgba(22,163,74,${opacity + 0.02})`} />
              <polygon points={`${x + w / 2},${180 - h * 0.35} ${x + 8},${180 - h * 0.1} ${x + w - 8},${180 - h * 0.1}`} fill={`rgba(21,128,61,${opacity + 0.03})`} />
            </g>
          );
        })}
      </svg>

      {/* Lentera perkemahan — kiri (xl+) */}
      <div className="hidden xl:block absolute left-6 bottom-20 animate-float-slow">
        <svg width="60" height="100" viewBox="0 0 60 100" aria-hidden="true" className="alpine-deco-svg">
          {/* Tiang */}
          <line x1="30" y1="10" x2="30" y2="85" stroke="rgba(148,163,184,0.5)" strokeWidth="2" />
          {/* Lentera tubuh */}
          <rect x="15" y="18" width="30" height="40" rx="4" fill="rgba(15,23,42,0.6)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" />
          {/* Cahaya dalam */}
          <rect x="18" y="21" width="24" height="34" rx="2" fill="rgba(251,191,36,0.15)" />
          {/* Nyala */}
          <ellipse cx="30" cy="35" rx="6" ry="10" fill="rgba(251,191,36,0.3)" className="animate-campfire" />
          {/* Handle atas */}
          <path d="M25,18 Q30,10 35,18" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5" />
          {/* Cahaya bawah */}
          <ellipse cx="30" cy="88" rx="20" ry="5" fill="rgba(251,191,36,0.1)" />
        </svg>
      </div>

      {/* Drone/antena IoT — kanan (xl+) */}
      <div className="hidden xl:block absolute right-6 bottom-18 animate-float-slow-delay">
        <svg width="100" height="90" viewBox="0 0 100 90" aria-hidden="true" className="alpine-deco-svg">
          {/* Badan drone */}
          <rect x="35" y="38" width="30" height="18" rx="5" fill="rgba(30,58,138,0.55)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          {/* Lengan drone */}
          <line x1="35" y1="42" x2="10" y2="28" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
          <line x1="65" y1="42" x2="90" y2="28" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
          <line x1="35" y1="52" x2="10" y2="62" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
          <line x1="65" y1="52" x2="90" y2="62" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
          {/* Baling-baling */}
          <ellipse cx="10" cy="27" rx="12" ry="3" fill="rgba(96,165,250,0.25)" />
          <ellipse cx="90" cy="27" rx="12" ry="3" fill="rgba(96,165,250,0.25)" />
          <ellipse cx="10" cy="63" rx="12" ry="3" fill="rgba(96,165,250,0.25)" />
          <ellipse cx="90" cy="63" rx="12" ry="3" fill="rgba(96,165,250,0.25)" />
          {/* Antena/sensor */}
          <line x1="50" y1="38" x2="50" y2="22" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
          <circle cx="50" cy="20" r="3" fill="rgba(56,189,248,0.6)" className="animate-twinkle" />
          {/* Sinyal */}
          <circle cx="50" cy="20" r="8"  fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
          <circle cx="50" cy="20" r="14" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
          {/* Kamera */}
          <circle cx="50" cy="52" r="4" fill="rgba(15,23,42,0.7)" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
          <circle cx="50" cy="52" r="2" fill="rgba(56,189,248,0.3)" />
        </svg>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 4. SERTIFIKAT — Puncak Fajar                               */
/* ─────────────────────────────────────────────────────────── */
export function SertifikatDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Cahaya fajar / aurora di belakang */}
      <div
        className="absolute top-0 left-1/4 w-1/2 h-48"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(251,191,36,0.07) 0%, rgba(251,146,60,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Siluet puncak gunung di bawah */}
      <svg
        className="alpine-deco-svg absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Puncak tertinggi tengah */}
        <path
          d="M0,200 L300,200 L440,100 L500,140 L580,60 L660,140 L720,100 L880,200 L1440,200Z"
          fill="rgba(148,163,184,0.06)"
        />
        <path
          d="M600,200 L860,200 L960,80 L1040,130 L1140,40 L1240,130 L1300,90 L1440,160 L1440,200Z"
          fill="rgba(148,163,184,0.08)"
        />
        {/* Salju di puncak */}
        <path
          d="M555,70 L580,55 L605,70 L590,65 L580,58 L570,65Z"
          fill="rgba(226,232,240,0.15)"
        />
        <path
          d="M1115,50 L1140,35 L1165,50 L1150,44 L1140,38 L1130,44Z"
          fill="rgba(226,232,240,0.15)"
        />
      </svg>

      {/* Bendera puncak berkibar — kiri (xl+) */}
      <div className="hidden xl:block absolute left-8 bottom-16">
        <svg width="70" height="120" viewBox="0 0 70 120" aria-hidden="true" className="alpine-deco-svg">
          {/* Tiang bendera */}
          <line x1="20" y1="10" x2="20" y2="110" stroke="rgba(148,163,184,0.5)" strokeWidth="2.5" />
          {/* Bendera */}
          <polygon
            points="20,12 55,22 20,38"
            fill="rgba(239,68,68,0.5)"
            stroke="rgba(239,68,68,0.3)"
            strokeWidth="1"
            className="animate-flag-wave"
            style={{ transformOrigin: '20px 25px' }}
          />
          {/* Puncak batuan gunung */}
          <polygon points="10,112 20,80 30,112" fill="rgba(148,163,184,0.2)" />
          <polygon points="0,120 20,78 40,120" fill="rgba(100,116,139,0.15)" />
          {/* Bintang pencapaian kecil di bendera */}
          <text x="31" y="27" textAnchor="middle" fill="rgba(251,191,36,0.6)" fontSize="8">★</text>
        </svg>
      </div>

      {/* Bintang-bintang pencapaian — kanan (xl+) */}
      <div className="hidden xl:block absolute right-6 bottom-10">
        <svg width="90" height="130" viewBox="0 0 90 130" aria-hidden="true" className="alpine-deco-svg">
          {/* Bintang besar */}
          <text x="45" y="40"  textAnchor="middle" fill="rgba(251,191,36,0.55)"  fontSize="30" className="animate-twinkle">★</text>
          {/* Bintang kecil */}
          <text x="15" y="30"  textAnchor="middle" fill="rgba(251,191,36,0.35)"  fontSize="16" className="animate-twinkle-delay-1">★</text>
          <text x="72" y="22"  textAnchor="middle" fill="rgba(251,191,36,0.3)"   fontSize="13" className="animate-twinkle-delay-2">★</text>
          <text x="20" y="70"  textAnchor="middle" fill="rgba(251,191,36,0.25)"  fontSize="11" className="animate-twinkle-delay-3">★</text>
          <text x="75" y="65"  textAnchor="middle" fill="rgba(251,191,36,0.3)"   fontSize="14" className="animate-twinkle-delay-4">★</text>
          {/* Label */}
          <text x="45" y="90"  textAnchor="middle" fill="rgba(186,230,253,0.35)" fontSize="7" fontFamily="monospace">PENCAPAIAN</text>
          <text x="45" y="100" textAnchor="middle" fill="rgba(186,230,253,0.25)" fontSize="6" fontFamily="monospace">TERVERIFIKASI</text>
          {/* Lingkaran halo */}
          <circle cx="45" cy="27" r="22" fill="none" stroke="rgba(251,191,36,0.1)" strokeWidth="1.5" strokeDasharray="4,4" />
        </svg>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 5. KEAHLIAN — Langit Konstelasi                            */
/* ─────────────────────────────────────────────────────────── */

// Titik konstelasi (x%, y%)
const CONSTELLATION_NODES = [
  [15, 20], [28, 10], [42, 25], [35, 40], [55, 15],
  [68, 30], [80, 12], [75, 45], [90, 25], [60, 50],
  [20, 55], [45, 60], [10, 70], [30, 75], [70, 65],
  [85, 70], [50, 80],
];
const CONSTELLATION_EDGES = [
  [0, 1], [1, 2], [2, 4], [4, 5], [5, 6], [6, 8],
  [2, 3], [3, 9], [5, 7], [7, 9], [0, 10], [10, 11],
  [11, 13], [9, 11], [7, 14], [14, 15], [11, 16],
];

export function KeahlianDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Konstelasi bintang terhubung */}
      <svg
        className="alpine-deco-svg absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Garis penghubung */}
        {CONSTELLATION_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={CONSTELLATION_NODES[a][0]}
            y1={CONSTELLATION_NODES[a][1]}
            x2={CONSTELLATION_NODES[b][0]}
            y2={CONSTELLATION_NODES[b][1]}
            stroke="rgba(186,230,253,0.1)"
            strokeWidth="0.3"
          />
        ))}
        {/* Titik bintang */}
        {CONSTELLATION_NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.6"
            fill="rgba(186,230,253,0.5)"
          />
        ))}
      </svg>

      {/* Tech-bot / rover maskot — kiri (xl+) */}
      <div className="hidden xl:block absolute left-4 top-1/3 animate-float-slow">
        <svg width="80" height="110" viewBox="0 0 80 110" aria-hidden="true" className="alpine-deco-svg">
          {/* Kepala robot */}
          <rect x="22" y="8" width="36" height="30" rx="8" fill="rgba(30,58,138,0.55)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" />
          {/* Mata kiri */}
          <circle cx="34" cy="21" r="5" fill="rgba(15,23,42,0.7)" />
          <circle cx="34" cy="21" r="3" fill="rgba(56,189,248,0.6)" className="animate-twinkle-delay-1" />
          {/* Mata kanan */}
          <circle cx="46" cy="21" r="5" fill="rgba(15,23,42,0.7)" />
          <circle cx="46" cy="21" r="3" fill="rgba(56,189,248,0.6)" className="animate-twinkle-delay-2" />
          {/* Antena */}
          <line x1="40" y1="8" x2="40" y2="2" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
          <circle cx="40" cy="2" r="2.5" fill="rgba(56,189,248,0.6)" className="animate-twinkle" />
          {/* Badan */}
          <rect x="18" y="38" width="44" height="38" rx="6" fill="rgba(15,23,42,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
          {/* Panel dada */}
          <rect x="26" y="44" width="28" height="20" rx="3" fill="rgba(30,58,138,0.4)" />
          <line x1="28" y1="48" x2="52" y2="48" stroke="rgba(56,189,248,0.35)" strokeWidth="1" />
          <line x1="28" y1="52" x2="48" y2="52" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />
          <line x1="28" y1="56" x2="50" y2="56" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
          {/* Tangan */}
          <rect x="4"  y="40" width="14" height="10" rx="4" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
          <rect x="62" y="40" width="14" height="10" rx="4" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
          {/* Roda */}
          <ellipse cx="28" cy="82" rx="8" ry="6" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
          <ellipse cx="52" cy="82" rx="8" ry="6" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
          <line x1="20" y1="82" x2="60" y2="82" stroke="rgba(96,165,250,0.2)" strokeWidth="1.5" />
          {/* Trek roda */}
          <ellipse cx="28" cy="97" rx="20" ry="6" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="3,3" />
          <ellipse cx="52" cy="97" rx="20" ry="6" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      </div>

      {/* Kristal/batuan gunung cyan — kanan (xl+) */}
      <div className="hidden xl:block absolute right-4 top-1/4 animate-float-slow-delay">
        <svg width="90" height="130" viewBox="0 0 90 130" aria-hidden="true" className="alpine-deco-svg">
          {/* Kristal besar tengah */}
          <polygon
            points="45,5 65,40 55,80 35,80 25,40"
            fill="rgba(56,189,248,0.12)"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1.5"
          />
          {/* Refleksi dalam kristal */}
          <polygon points="45,5 52,25 45,22 38,25" fill="rgba(186,230,253,0.15)" />
          <line x1="45" y1="5" x2="45" y2="80" stroke="rgba(186,230,253,0.1)" strokeWidth="1" strokeDasharray="4,4" />
          {/* Kristal kiri kecil */}
          <polygon
            points="18,40 30,65 22,90 14,90 6,65"
            fill="rgba(56,189,248,0.08)"
            stroke="rgba(56,189,248,0.2)"
            strokeWidth="1"
          />
          {/* Kristal kanan kecil */}
          <polygon
            points="72,45 84,70 76,95 68,95 60,70"
            fill="rgba(56,189,248,0.08)"
            stroke="rgba(56,189,248,0.2)"
            strokeWidth="1"
          />
          {/* Tanah/batuan */}
          <ellipse cx="45" cy="82" rx="30" ry="6" fill="rgba(100,116,139,0.15)" />
          {/* Cahaya cyan di puncak */}
          <circle cx="45" cy="10" r="8" fill="rgba(56,189,248,0.08)" className="animate-twinkle-delay-1" />
          {/* Label */}
          <text x="45" y="115" textAnchor="middle" fill="rgba(56,189,248,0.3)" fontSize="7" fontFamily="monospace">SKILL CRYSTAL</text>
        </svg>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* 6. KONTAK — Api Unggun Malam                               */
/* ─────────────────────────────────────────────────────────── */
export function KontakDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">

      {/* Siluet perbukitan malam */}
      <svg
        className="alpine-deco-svg absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,140 Q180,80 360,120 Q540,160 720,90 Q900,20 1080,100 Q1260,160 1440,110 L1440,180 L0,180Z"
          fill="rgba(30,41,59,0.4)"
        />
        <path
          d="M0,165 Q200,130 420,150 Q640,170 860,140 Q1080,110 1300,145 Q1380,160 1440,150 L1440,180 L0,180Z"
          fill="rgba(15,23,42,0.5)"
        />
      </svg>

      {/* Bintang di langit malam kontak */}
      {[
        { x: '5%',  y: '8%',  delay: '' },
        { x: '15%', y: '4%',  delay: 'animate-twinkle-delay-1' },
        { x: '25%', y: '12%', delay: 'animate-twinkle-delay-2' },
        { x: '50%', y: '3%',  delay: 'animate-twinkle-delay-3' },
        { x: '65%', y: '8%',  delay: '' },
        { x: '78%', y: '5%',  delay: 'animate-twinkle-delay-4' },
        { x: '88%', y: '10%', delay: 'animate-twinkle-delay-1' },
        { x: '95%', y: '6%',  delay: 'animate-twinkle-delay-2' },
      ].map((s, i) => (
        <div key={i} className={`absolute animate-twinkle ${s.delay}`} style={{ left: s.x, top: s.y }}>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="1.5" fill="rgba(186,230,253,0.65)" />
          </svg>
        </div>
      ))}

      {/* Api unggun — kiri (xl+) */}
      <div className="hidden xl:block absolute left-8 bottom-16">
        <svg width="80" height="90" viewBox="0 0 80 90" aria-hidden="true" className="alpine-deco-svg">
          {/* Batu lingkaran api unggun */}
          <ellipse cx="40" cy="78" rx="28" ry="8" fill="rgba(51,65,85,0.5)" />
          {[32, 20, 46, 55, 28, 48].forEach(() => {})}
          <circle cx="20" cy="76" r="5" fill="rgba(71,85,105,0.5)" />
          <circle cx="30" cy="80" r="4" fill="rgba(71,85,105,0.5)" />
          <circle cx="40" cy="81" r="4" fill="rgba(71,85,105,0.4)" />
          <circle cx="52" cy="79" r="5" fill="rgba(71,85,105,0.5)" />
          <circle cx="60" cy="75" r="4" fill="rgba(71,85,105,0.4)" />
          {/* Kayu */}
          <line x1="22" y1="75" x2="58" y2="68" stroke="rgba(120,86,54,0.6)" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="68" x2="58" y2="75" stroke="rgba(120,86,54,0.6)" strokeWidth="3" strokeLinecap="round" />
          {/* Nyala api — utama */}
          <ellipse cx="40" cy="58" rx="10" ry="16" fill="rgba(251,146,60,0.4)" className="animate-campfire" style={{ transformOrigin: '40px 68px' }} />
          <ellipse cx="40" cy="52" rx="6"  ry="12" fill="rgba(251,191,36,0.5)" className="animate-campfire" style={{ transformOrigin: '40px 68px', animationDelay: '0.15s' }} />
          <ellipse cx="40" cy="48" rx="3"  ry="8"  fill="rgba(254,249,195,0.5)" className="animate-campfire" style={{ transformOrigin: '40px 68px', animationDelay: '0.3s' }} />
          {/* Percikan api */}
          <circle cx="34" cy="40" r="1.5" fill="rgba(251,191,36,0.6)" className="animate-twinkle-delay-1" />
          <circle cx="47" cy="36" r="1.5" fill="rgba(251,191,36,0.5)" className="animate-twinkle-delay-3" />
          <circle cx="40" cy="32" r="1"   fill="rgba(251,146,60,0.5)" className="animate-twinkle-delay-2" />
          {/* Cahaya di tanah */}
          <ellipse cx="40" cy="80" rx="22" ry="5" fill="rgba(251,191,36,0.07)" />
        </svg>
      </div>

      {/* Pemancar sinyal / cangkir hangat — kanan (xl+) */}
      <div className="hidden xl:block absolute right-8 bottom-14 animate-float-slow">
        <svg width="80" height="100" viewBox="0 0 80 100" aria-hidden="true" className="alpine-deco-svg">
          {/* Cangkir */}
          <path d="M18,55 Q18,80 42,80 Q66,80 66,55 L60,45 L24,45Z" fill="rgba(30,58,138,0.5)" stroke="rgba(96,165,250,0.35)" strokeWidth="1.5" />
          {/* Handle cangkir */}
          <path d="M66,52 Q80,52 80,62 Q80,72 66,72" fill="none" stroke="rgba(96,165,250,0.35)" strokeWidth="2" />
          {/* Piring alas */}
          <ellipse cx="42" cy="81" rx="26" ry="5" fill="rgba(30,58,138,0.4)" stroke="rgba(96,165,250,0.25)" strokeWidth="1" />
          {/* Uap hangat */}
          <path d="M30,42 Q32,34 30,26" fill="none" stroke="rgba(186,230,253,0.3)" strokeWidth="1.5" strokeLinecap="round" className="animate-twinkle-delay-1" />
          <path d="M42,40 Q44,30 42,20" fill="none" stroke="rgba(186,230,253,0.3)" strokeWidth="1.5" strokeLinecap="round" className="animate-twinkle-delay-2" />
          <path d="M54,42 Q56,33 54,25" fill="none" stroke="rgba(186,230,253,0.3)" strokeWidth="1.5" strokeLinecap="round" className="animate-twinkle-delay-3" />
          {/* Layar mini di cangkir / logo */}
          <text x="42" y="67" textAnchor="middle" fill="rgba(56,189,248,0.4)" fontSize="10" fontFamily="monospace">&lt;/&gt;</text>
          {/* Sinyal WiFi di atas */}
          <path d="M28,15 Q42,5 56,15"  fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M33,10 Q42,3 51,10"  fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="42" cy="7" r="2.5" fill="rgba(56,189,248,0.4)" className="animate-twinkle" />
        </svg>
      </div>

    </div>
  );
}
