import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UI_TRANSLATIONS, resolveLocalTranslation } from '../i18n/translations';
import { translateBatch } from '../services/api';

const LANG_STORAGE_KEY = 'faris-portfolio-lang';
const TR_CACHE_STORAGE_KEY = 'faris-portfolio-tr-en-v1';

const LanguageContext = createContext(null);

function readInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'id';
  } catch {
    return 'id';
  }
}

function readInitialCache() {
  try {
    const raw = localStorage.getItem(TR_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);
  const [enCache, setEnCache] = useState(readInitialCache);
  const [translating, setTranslating] = useState(false);
  const inFlightRef = useRef(new Set());
  const cacheRef = useRef(enCache);

  useEffect(() => {
    cacheRef.current = enCache;
  }, [enCache]);

  const setLang = useCallback((nextLang) => {
    const normalized = nextLang === 'en' ? 'en' : 'id';
    setLangState(normalized);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, normalized);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = normalized;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Helper terjemahan UI statis dengan substitusi variabel {key}
  const t = useCallback(
    (key, vars) => {
      const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.id;
      let val = getByPath(dict, key);
      if (val === undefined) {
        val = getByPath(UI_TRANSLATIONS.id, key);
      }
      if (typeof val !== 'string') return val !== undefined ? val : key;
      if (!vars) return val;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? '')),
        val
      );
    },
    [lang]
  );

  // Helper terjemahan teks dinamis dari database
  const tr = useCallback(
    (text) => {
      if (typeof text !== 'string') return text;
      if (lang !== 'en') return text;
      const trimmed = text.trim();
      if (!trimmed) return text;

      const localHit = resolveLocalTranslation(trimmed);
      if (localHit) return localHit;

      const cached = enCache[trimmed];
      if (cached) return cached;

      return text;
    },
    [lang, enCache]
  );

  // Batch fetch terjemahan yang belum ada di cache
  const ensureTranslations = useCallback(async (texts = []) => {
    if (lang !== 'en' || !Array.isArray(texts) || texts.length === 0) return;

    const currentCache = cacheRef.current;
    const missing = [];

    for (const raw of texts) {
      if (typeof raw !== 'string') continue;
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (resolveLocalTranslation(trimmed)) continue;
      if (currentCache[trimmed]) continue;
      if (inFlightRef.current.has(trimmed)) continue;
      missing.push(trimmed);
    }

    const uniqueMissing = Array.from(new Set(missing));
    if (uniqueMissing.length === 0) return;

    uniqueMissing.forEach((item) => inFlightRef.current.add(item));
    setTranslating(true);

    try {
      const result = await translateBatch(uniqueMissing, 'en', 'id');
      if (result && Object.keys(result).length > 0) {
        setEnCache((prev) => {
          const next = { ...prev, ...result };
          try {
            localStorage.setItem(TR_CACHE_STORAGE_KEY, JSON.stringify(next));
          } catch {
            // ignore quota errors
          }
          return next;
        });
      }
    } finally {
      uniqueMissing.forEach((item) => inFlightRef.current.delete(item));
      if (inFlightRef.current.size === 0) {
        setTranslating(false);
      }
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      tr,
      ensureTranslations,
      translating,
    }),
    [lang, setLang, t, tr, ensureTranslations, translating]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback aman jika komponen dirender di luar LanguageProvider (mis. AdminPanel)
    return {
      lang: 'id',
      setLang: () => {},
      t: (key, vars) => {
        let val = getByPath(UI_TRANSLATIONS.id, key);
        if (typeof val !== 'string') return val !== undefined ? val : key;
        if (!vars) return val;
        return Object.entries(vars).reduce(
          (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? '')),
          val
        );
      },
      tr: (text) => text,
      ensureTranslations: async () => {},
      translating: false,
    };
  }
  return ctx;
}
