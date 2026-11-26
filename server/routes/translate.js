import { Router } from 'express';

const router = Router();

// Cache memori sederhana di server agar terjemahan teks yang sama tidak memanggil Google Translate berulang kali
const serverTranslationCache = new Map();
const MAX_CACHE_ENTRIES = 1000;

// Daftar nama orang, instansi, proyek, dan istilah teknis yang HARUS tetap utuh (tidak diterjemahkan)
const PROTECTED_TERMS = [
  'PT Vinix Seven Aurum (VINIX7)',
  'PT Vinix Seven Aurum',
  'Universitas Duta Bangsa Surakarta',
  'Universitas Duta Bangsa',
  'SMK Muhammadiyah 1 Gondangrejo',
  'Speed Computer Surakarta',
  'Faris Pratama Putra',
  'Aiven Cloud MySQL',
  'Vercel Serverless',
  'WeMos D1 Mini',
  'Telegram Bot API',
  'Facebook Marketplace',
  'WhatsApp Business',
  'Java Swing GUI',
  'Speed Computer',
  'FIKOM Preloved',
  'Tailwind CSS',
  'scikit-learn',
  'NetBeans IDE',
  'Arduino IDE',
  'Arduino Uno',
  'Blynk Cloud',
  'TiDB Cloud',
  'Google Cloud',
  'UAT Testing',
  'Node.js',
  'Express',
  'Cloudinary',
  'Java Swing',
  'JavaScript',
  'TypeScript',
  'PostgreSQL',
  'Streamlit',
  'Blynk API',
  'XGBoost',
  'CRISP-DM',
  'REST API',
  'Mikrotik',
  'WhatsApp',
  'Instagram',
  'LinkedIn',
  'LAN/WLAN',
  'ESP8266',
  'HC-SR04',
  'Tkinter',
  'Netlify',
  'SENATIB',
  'Aksademy',
  'Skillpedia',
  'TRrecPro',
  'Xperimind.id',
  'VINIX7',
  'Vercel',
  'GitHub',
  'SQLite',
  'Python',
  'ESP32',
  'Blynk',
  'React',
  'MySQL',
  'Aiven',
  'HTML5',
  'PyQt',
  'MQ-2',
  'CSS3',
  'TiDB',
  'Vite',
  'Java',
  'PHP',
  'C++',
  'UDB',
  'Git',
  'SSO',
  'COD',
  'UAT',
  'POS',
  'IoT',
  'UI/UX',
  'API',
];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function maskProtectedTerms(text) {
  const placeholders = [];
  let masked = text;

  for (const term of PROTECTED_TERMS) {
    const isShortAlpha = /^[A-Za-z0-9+/. -]{1,5}$/.test(term);
    const pattern = isShortAlpha
      ? new RegExp(`(?<![A-Za-z0-9])${escapeRegex(term)}(?![A-Za-z0-9])`, 'g')
      : new RegExp(escapeRegex(term), 'g');

    masked = masked.replace(pattern, (match) => {
      const idx = placeholders.length;
      placeholders.push(match);
      return `ZXQ${idx}XZ`;
    });
  }

  return { masked, placeholders };
}

function unmaskProtectedTerms(text, placeholders) {
  if (!placeholders.length) return text;
  return text.replace(/ZXQ\s*(\d+)\s*XZ/gi, (full, idxStr) => {
    const idx = Number(idxStr);
    return Number.isInteger(idx) && placeholders[idx] !== undefined ? placeholders[idx] : full;
  });
}

async function translateSingleViaGoogle(text, sourceLang = 'id', targetLang = 'en') {
  const cleanText = String(text || '').trim();
  if (!cleanText) return text;

  const cacheKey = `${sourceLang}->${targetLang}:${cleanText}`;
  if (serverTranslationCache.has(cacheKey)) {
    return serverTranslationCache.get(cacheKey);
  }

  const { masked, placeholders } = maskProtectedTerms(cleanText);

  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx` +
    `&sl=${encodeURIComponent(sourceLang)}` +
    `&tl=${encodeURIComponent(targetLang)}` +
    `&dt=t&q=${encodeURIComponent(masked)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(7000),
  });

  if (!res.ok) {
    throw new Error(`Translate upstream status ${res.status}`);
  }

  const data = await res.json();
  let translated = '';
  if (Array.isArray(data) && Array.isArray(data[0])) {
    translated = data[0]
      .map((part) => (Array.isArray(part) && typeof part[0] === 'string' ? part[0] : ''))
      .join('');
  }

  const restored = unmaskProtectedTerms(translated || cleanText, placeholders).trim();
  const finalResult = restored || cleanText;

  if (serverTranslationCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = serverTranslationCache.keys().next().value;
    if (firstKey !== undefined) serverTranslationCache.delete(firstKey);
  }
  serverTranslationCache.set(cacheKey, finalResult);

  return finalResult;
}

// POST /api/translate
// Body: { texts: string[], sourceLang?: 'id', targetLang?: 'en' }
router.post('/', async (req, res) => {
  try {
    const rawTexts = Array.isArray(req.body?.texts) ? req.body.texts : [];
    const sourceLang = req.body?.sourceLang === 'en' ? 'en' : 'id';
    const targetLang = req.body?.targetLang === 'id' ? 'id' : 'en';

    const uniqueTexts = Array.from(
      new Set(
        rawTexts
          .filter((t) => typeof t === 'string' && t.trim().length > 0)
          .map((t) => t.trim())
      )
    ).slice(0, 120);

    if (uniqueTexts.length === 0 || sourceLang === targetLang) {
      const identity = {};
      uniqueTexts.forEach((t) => {
        identity[t] = t;
      });
      return res.json({ translations: identity, fallback: false });
    }

    const translations = {};
    let hadFallback = false;

    // Proses paralel bertahap (maksimal 6 sekaligus) agar cepat namun tidak memicu rate-limit
    const CONCURRENCY = 6;
    for (let i = 0; i < uniqueTexts.length; i += CONCURRENCY) {
      const batch = uniqueTexts.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(async (orig) => {
          try {
            const tr = await translateSingleViaGoogle(orig, sourceLang, targetLang);
            return [orig, tr];
          } catch {
            hadFallback = true;
            return [orig, orig];
          }
        })
      );
      results.forEach(([orig, tr]) => {
        translations[orig] = tr;
      });
    }

    return res.json({ translations, fallback: hadFallback });
  } catch (err) {
    console.error('Translate error:', err);
    return res.json({ translations: {}, fallback: true });
  }
});

export default router;
