import { ui, defaultLang } from '@/i18n/ui';

const allTranslations = import.meta.glob('../i18n/pages/**/*.json', { eager: true });

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
    const defaultGlobalModule = allTranslations[`../i18n/pages/global/pt.json`] as any;
    if (defaultGlobalModule && defaultGlobalModule.default) {
        globalTranslations = defaultGlobalModule.default;
    }
  } catch(e) {}

  if (lang !== defaultLang) {
    try {
      const langGlobalModule = allTranslations[`../i18n/pages/global/${lang}.json`] as any;
      if (langGlobalModule && langGlobalModule.default) {
          globalTranslations = { ...globalTranslations, ...langGlobalModule.default };
      }
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
    const defaultPageModule = allTranslations[`../i18n/pages/${page}/pt.json`] as any;
    if (defaultPageModule && defaultPageModule.default) {
        pageTranslations = defaultPageModule.default;
    }
  } catch(e) {}

  if (lang !== defaultLang) {
      try {
        const langPageModule = allTranslations[`../i18n/pages/${page}/${lang}.json`] as any;
        if (langPageModule && langPageModule.default) {
            pageTranslations = { ...pageTranslations, ...langPageModule.default };
        }
      } catch (e) {}
  }

  return { ...globalTranslations, ...pageTranslations };
}

export function usePageTranslations(pageDict: Record<string, string>, lang: keyof typeof ui = defaultLang) {
  return function t(key: string) {
    return pageDict[key] || key;
  }
}
