import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectMockup({ project }) {
  const { t, tr } = useLanguage();

  if (project.imageUrl) {
    return (
      <img
        src={project.imageUrl}
        alt={tr(project.title)}
        className="w-full h-full object-contain bg-slate-950/80 p-1.5 sm:p-2"
      />
    );
  }

  switch (project.svgType) {
    case 'fikom':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g-fikom" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
          <rect width="640" height="360" fill="url(#g-fikom)" />
          <rect x="44" y="34" width="552" height="292" rx="14" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="2" />
          <rect x="44" y="34" width="552" height="36" rx="14" fill="#1e293b" />
          <circle cx="68" cy="52" r="5" fill="#f87171" />
          <circle cx="86" cy="52" r="5" fill="#fbbf24" />
          <circle cx="104" cy="52" r="5" fill="#34d399" />
          <rect x="135" y="43" width="240" height="18" rx="9" fill="#0f172a" />
          <text x="150" y="56" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">fikom-preloved.vercel.app</text>
          <rect x="66" y="90" width="150" height="26" rx="6" fill="#0284c7" fillOpacity="0.25" />
          <text x="78" y="107" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">FIKOM Preloved v1.1</text>
          <rect x="470" y="90" width="104" height="26" rx="6" fill="#10b981" fillOpacity="0.2" />
          <text x="486" y="107" fill="#34d399" fontSize="11" fontWeight="bold" fontFamily="sans-serif">LIVE PROD</text>
          {[66, 242, 418].map((x, idx) => (
            <g key={x}>
              <rect x={x} y="134" width="156" height="170" rx="10" fill="#1e293b" />
              <rect x={x + 12} y="146" width="132" height="82" rx="6" fill={idx === 0 ? '#38bdf8' : idx === 1 ? '#818cf8' : '#34d399'} fillOpacity="0.2" />
              <rect x={x + 12} y="240" width="96" height="10" rx="4" fill="#e2e8f0" fillOpacity="0.8" />
              <rect x={x + 12} y="258" width="64" height="8" rx="4" fill="#38bdf8" />
              <rect x={x + 12} y="276" width="132" height="18" rx="5" fill="#0ea5e9" />
            </g>
          ))}
        </svg>
      );
    case 'xgboost':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#1e1b4b" />
          <rect x="44" y="34" width="552" height="292" rx="14" fill="#0f172a" stroke="#818cf8" strokeOpacity="0.4" strokeWidth="2" />
          <text x="72" y="74" fill="#e2e8f0" fontSize="16" fontWeight="bold" fontFamily="sans-serif">XGBoost Career Classification</text>
          <text x="72" y="96" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">2,975 Rows · 13 Features · 5-Fold Stratified CV · Streamlit</text>
          <rect x="72" y="120" width="150" height="72" rx="10" fill="#1e293b" />
          <text x="88" y="144" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Dummy Baseline</text>
          <text x="88" y="176" fill="#cbd5e1" fontSize="24" fontWeight="bold" fontFamily="sans-serif">18.68%</text>
          <rect x="240" y="120" width="170" height="72" rx="10" fill="#312e81" stroke="#818cf8" strokeOpacity="0.5" />
          <text x="256" y="144" fill="#c7d2fe" fontSize="11" fontFamily="sans-serif">XGBoost F1-Macro</text>
          <text x="256" y="176" fill="#38bdf8" fontSize="24" fontWeight="bold" fontFamily="sans-serif">31.73%</text>
          <rect x="428" y="120" width="140" height="72" rx="10" fill="#1e293b" />
          <text x="444" y="144" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Target Classes</text>
          <text x="444" y="176" fill="#34d399" fontSize="24" fontWeight="bold" fontFamily="sans-serif">{t('mockup.paths4')}</text>
          <rect x="72" y="216" width="496" height="84" rx="10" fill="#1e293b" />
          <rect x="96" y="264" width="76" height="22" rx="4" fill="#38bdf8" />
          <rect x="206" y="246" width="76" height="40" rx="4" fill="#818cf8" />
          <rect x="316" y="232" width="76" height="54" rx="4" fill="#34d399" />
          <rect x="426" y="254" width="76" height="32" rx="4" fill="#fbbf24" />
        </svg>
      );
    case 'iot-plant':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#06281e" />
          <rect x="48" y="40" width="544" height="280" rx="14" fill="#0f172a" stroke="#34d399" strokeOpacity="0.4" strokeWidth="2" />
          <text x="76" y="82" fill="#34d399" fontSize="15" fontWeight="bold" fontFamily="sans-serif">ESP8266 · Smart Plant Watering</text>
          <text x="76" y="102" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">Blynk API · Soil Moisture Sensor · Relay Pump · LCD</text>
          <circle cx="170" cy="210" r="64" fill="none" stroke="#1e293b" strokeWidth="14" />
          <circle cx="170" cy="210" r="64" fill="none" stroke="#34d399" strokeWidth="14" strokeDasharray="290 402" strokeLinecap="round" />
          <text x="142" y="217" fill="#f1f5f9" fontSize="22" fontWeight="bold" fontFamily="sans-serif">72%</text>
          <rect x="286" y="148" width="270" height="48" rx="10" fill="#1e293b" />
          <text x="306" y="177" fill="#e2e8f0" fontSize="13" fontFamily="sans-serif">{t('mockup.pumpAuto')}</text>
          <rect x="286" y="212" width="270" height="48" rx="10" fill="#065f46" fillOpacity="0.45" stroke="#34d399" strokeOpacity="0.4" />
          <text x="306" y="241" fill="#6ee7b7" fontSize="13" fontWeight="bold" fontFamily="sans-serif">{t('mockup.blynkConnected')}</text>
        </svg>
      );
    case 'iot-gas':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#2a1215" />
          <rect x="48" y="40" width="544" height="280" rx="14" fill="#0f172a" stroke="#fb7185" strokeOpacity="0.45" strokeWidth="2" />
          <text x="76" y="82" fill="#fda4af" fontSize="15" fontWeight="bold" fontFamily="sans-serif">{t('mockup.lpgTitle')}</text>
          <text x="76" y="102" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">MQ-2 Gas Sensor · Early Warning Buzzer · C++</text>
          <rect x="76" y="136" width="220" height="148" rx="12" fill="#1e293b" />
          <text x="98" y="172" fill="#94a3b8" fontSize="12" fontFamily="sans-serif">{t('mockup.mq2Reading')}</text>
          <text x="98" y="220" fill="#fb7185" fontSize="34" fontWeight="bold" fontFamily="sans-serif">PPM</text>
          <text x="98" y="256" fill="#34d399" fontSize="12" fontFamily="sans-serif">{t('mockup.realtimeMonitoring')}</text>
          <rect x="322" y="136" width="234" height="66" rx="12" fill="#881337" fillOpacity="0.45" stroke="#fb7185" strokeOpacity="0.5" />
          <text x="344" y="174" fill="#fecdd3" fontSize="14" fontWeight="bold" fontFamily="sans-serif">{t('mockup.buzzerReady')}</text>
          <rect x="322" y="218" width="234" height="66" rx="12" fill="#1e293b" />
          <text x="344" y="256" fill="#cbd5e1" fontSize="13" fontFamily="sans-serif">{t('mockup.esp32Chip')}</text>
        </svg>
      );
    case 'iot-height':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#0c1e35" />
          <rect x="48" y="40" width="544" height="280" rx="14" fill="#0f172a" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="2" />
          <text x="76" y="82" fill="#38bdf8" fontSize="15" fontWeight="bold" fontFamily="sans-serif">{t('mockup.heightTitle')}</text>
          <text x="76" y="102" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">{t('mockup.ultrasonicSub')}</text>
          <rect x="76" y="140" width="290" height="136" rx="12" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
          <text x="102" y="188" fill="#a7f3d0" fontSize="18" fontFamily="monospace">{t('mockup.heightLabel')}</text>
          <text x="102" y="236" fill="#ecfdf5" fontSize="32" fontWeight="bold" fontFamily="monospace">172.5 cm</text>
          <rect x="394" y="140" width="162" height="136" rx="12" fill="#1e293b" />
          <circle cx="448" cy="208" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="504" cy="208" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          <text x="434" y="260" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">HC-SR04</text>
        </svg>
      );
    case 'desktop-inv':
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#172554" />
          <rect x="44" y="34" width="552" height="292" rx="12" fill="#0f172a" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="2" />
          <rect x="44" y="34" width="552" height="34" rx="12" fill="#1e293b" />
          <text x="68" y="56" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="sans-serif">{t('mockup.invTitle')}</text>
          <rect x="68" y="88" width="504" height="32" rx="6" fill="#1e293b" />
          <text x="84" y="109" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{t('mockup.invHeader')}</text>
          <rect x="68" y="132" width="504" height="36" rx="6" fill="#1e293b" fillOpacity="0.55" />
          <text x="84" y="155" fill="#f1f5f9" fontSize="11" fontFamily="sans-serif">SP-001 — SSD NVMe 512GB ({t('mockup.invStock')}: 24 · {t('mockup.invSafe')})</text>
          <rect x="68" y="178" width="504" height="36" rx="6" fill="#1e293b" fillOpacity="0.55" />
          <text x="84" y="201" fill="#f1f5f9" fontSize="11" fontFamily="sans-serif">SP-002 — RAM DDR4 8GB 3200MHz ({t('mockup.invStock')}: 18 · {t('mockup.invSafe')})</text>
          <rect x="68" y="224" width="504" height="36" rx="6" fill="#1e293b" fillOpacity="0.55" />
          <text x="84" y="247" fill="#fbbf24" fontSize="11" fontFamily="sans-serif">SP-003 — Thermal Paste CPU ({t('mockup.invStock')}: 4 · Restock)</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 640 360" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="640" height="360" fill="#1e1b4b" />
          <rect x="44" y="34" width="552" height="292" rx="12" fill="#0f172a" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="2" />
          <rect x="44" y="34" width="552" height="34" rx="12" fill="#1e293b" />
          <text x="68" y="56" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="sans-serif">{t('mockup.posTitle')}</text>
          <rect x="68" y="88" width="290" height="212" rx="10" fill="#1e293b" />
          <text x="86" y="116" fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="sans-serif">{t('mockup.posCart')}</text>
          <rect x="86" y="132" width="254" height="28" rx="6" fill="#0f172a" />
          <rect x="86" y="170" width="254" height="28" rx="6" fill="#0f172a" />
          <rect x="86" y="208" width="254" height="28" rx="6" fill="#0f172a" />
          <rect x="378" y="88" width="194" height="212" rx="10" fill="#1e293b" />
          <text x="398" y="122" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">{t('mockup.posTotal')}</text>
          <text x="398" y="156" fill="#34d399" fontSize="22" fontWeight="bold" fontFamily="sans-serif">Rp 450.000</text>
          <rect x="398" y="190" width="154" height="36" rx="8" fill="#0ea5e9" />
          <text x="434" y="213" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">{t('mockup.posProcess')}</text>
        </svg>
      );
  }
}
