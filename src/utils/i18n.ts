import { ui, defaultLang } from '@/i18n/ui';

export function getLangFromUrl(urlOrCookies: URL | any) {
  if (urlOrCookies instanceof URL) {
    const [, lang] = urlOrCookies.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
  }

  if (urlOrCookies && urlOrCookies.has && urlOrCookies.has('lang')) {
    const lang = urlOrCookies.get('lang')?.value;
    if (lang && lang in ui) return lang as keyof typeof ui;
  }

  return defaultLang;
}

export async function getGlobalTranslations(lang: keyof typeof ui = defaultLang) {
  let globalTranslations: Record<string, string> = {};

  try {
    const defaultGlobal = await import(`../i18n/pages/global/pt.json`);
    globalTranslations = defaultGlobal.default;
  } catch(e) {}

  if (lang !== defaultLang) {
    try {
      const langGlobal = await import(`../i18n/pages/global/${lang}.json`);
      globalTranslations = { ...globalTranslations, ...langGlobal.default };
    } catch(e) {}
  }

  return globalTranslations;
}

export async function useTranslations(lang: keyof typeof ui) {
  const globalTranslations = await getGlobalTranslations(lang);
  return function t(key: string) {
    return globalTranslations[key] || key;
  }
}

// Function to load page-specific translations
export async function getPageTranslations(page: string, lang: keyof typeof ui = defaultLang) {
  const globalTranslations = await getGlobalTranslations(lang);
  let pageTranslations = {};

  try {
    const defaultPageTranslations = await import(`../i18n/pages/${page}/pt.json`);
    pageTranslations = defaultPageTranslations.default;
  } catch(e) {}

  if (lang !== defaultLang) {
      try {
        const langPageTranslations = await import(`../i18n/pages/${page}/${lang}.json`);
        pageTranslations = { ...pageTranslations, ...langPageTranslations.default };
      } catch (e) {}
  }

  return { ...globalTranslations, ...pageTranslations };
}

export function usePageTranslations(pageDict: Record<string, string>, lang: keyof typeof ui = defaultLang) {
  return function t(key: string) {
    return pageDict[key] || key;
  }
}
